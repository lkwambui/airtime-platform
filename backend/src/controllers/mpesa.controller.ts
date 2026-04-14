import { Request, Response } from "express";
import { db } from "../database/db";
import { createAirtimeJob } from "../services/airtime.service";
import { logInfo, logError } from "../utils/logger";

export async function mpesaCallback(req: Request, res: Response) {
  logInfo("MPESA callback received", req.body);

  try {
    const callback = req.body?.Body?.stkCallback;

    // ✅ Always acknowledge Safaricom immediately
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    if (!callback) {
      logError("Invalid callback structure", req.body);
      return;
    }

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    const resultDesc = callback.ResultDesc;

    if (!checkoutRequestId) {
      logError("Missing CheckoutRequestID", callback);
      return;
    }

    // 🔍 Find transaction
    const txResult = await db.query(
      "SELECT * FROM transactions WHERE checkout_request_id=$1",
      [checkoutRequestId]
    );

    if (txResult.rows.length === 0) {
      logError("Transaction not found", checkoutRequestId);
      return;
    }

    const tx = txResult.rows[0];
    const transactionId = tx.id;

    // ✅ PAYMENT SUCCESS
    if (resultCode === 0) {
      logInfo("Payment successful", {
        transactionId,
        checkoutRequestId,
      });

      // 🔥 EXTRACT MPESA DETAILS
      const items = callback.CallbackMetadata?.Item || [];

      let mpesaCode = "";
      let amountPaid = 0;

      for (const item of items) {
        if (item.Name === "MpesaReceiptNumber") {
          mpesaCode = item.Value;
        }
        if (item.Name === "Amount") {
          amountPaid = item.Value;
        }
      }

      try {
        // 🔥 SAVE MPESA CODE + AMOUNT
        await db.query(
          `UPDATE transactions 
           SET mpesa_code=$1, amount_paid=$2 
           WHERE id=$3`,
          [mpesaCode, amountPaid, transactionId]
        );

        // 🔥 CREATE AIRTIME JOB(S)
        await createAirtimeJob(
          transactionId,
          tx.receiver_phone,
          tx.airtime_value
        );

        // 🔥 SET STATUS → WAITING ETOPUP
        await db.query(
          `UPDATE transactions 
           SET status=$1, updated_at=NOW() 
           WHERE id=$2`,
          ["WAITING_ETOPUP", transactionId]
        );

        logInfo("Airtime job created", {
          transactionId,
          phone: tx.receiver_phone,
          amount: tx.airtime_value,
          mpesaCode,
          amountPaid,
        });

      } catch (jobError) {
        logError("Failed to create airtime job", jobError);

        await db.query(
          `UPDATE transactions 
           SET status=$1, updated_at=NOW() 
           WHERE id=$2`,
          ["FAILED", transactionId]
        );
      }
    }

    // ❌ PAYMENT FAILED / CANCELLED
    else {
      logInfo("Payment failed or cancelled", {
        transactionId,
        resultCode,
        resultDesc,
      });

      await db.query(
        `UPDATE transactions 
         SET status=$1, updated_at=NOW() 
         WHERE id=$2`,
        ["FAILED", transactionId]
      );
    }

  } catch (error) {
    logError("MPESA callback error", error);
  }
}
