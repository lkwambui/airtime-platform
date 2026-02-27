import { Request, Response } from "express";
import { db } from "../database/db";
import { sendAirtime } from "../services/airtime.service";
import { logInfo, logError } from "../utils/logger";

export async function mpesaCallback(req: Request, res: Response) {
  logInfo("MPESA callback received", req.body);

  try {
    const callback = req.body?.Body?.stkCallback;

    // Always acknowledge Safaricom first
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

    if (resultCode === 0) {
      logInfo("Payment successful", {
        transactionId,
        checkoutRequestId,
      });

      await db.query(
        "UPDATE transactions SET status=$1 WHERE id=$2",
        ["SUCCESS", transactionId]
      );

      try {
        await sendAirtime(tx.receiver_phone, tx.airtime_value);

        await db.query(
          "UPDATE transactions SET status=$1 WHERE id=$2",
          ["AIRTIME_SENT", transactionId]
        );

        logInfo("Airtime sent successfully", {
          transactionId,
          phone: tx.receiver_phone,
          amount: tx.airtime_value,
        });
      } catch (airtimeError) {
        logError("Airtime sending failed", airtimeError);

        await db.query(
          "UPDATE transactions SET status=$1 WHERE id=$2",
          ["AIRTIME_FAILED", transactionId]
        );
      }
    } else {
      logInfo("Payment failed or cancelled", {
        transactionId,
        resultCode,
        resultDesc,
      });

      await db.query(
        "UPDATE transactions SET status=$1 WHERE id=$2",
        ["FAILED", transactionId]
      );
    }
  } catch (error) {
    logError("MPESA callback error", error);
  }
}