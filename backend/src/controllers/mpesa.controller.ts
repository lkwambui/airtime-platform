import { Request, Response } from "express";
import { db } from "../database/db";
import { sendAirtime } from "../services/airtime.service";
import { logInfo, logError } from "../utils/logger";

export async function mpesaCallback(req: Request, res: Response) {
  logInfo("MPESA callback received", req.body);

  try {
    const cb = req.body?.Body?.stkCallback;

    if (!cb) {
      logError("Invalid callback payload", req.body);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const checkoutRequestId = cb.CheckoutRequestID;
    if (!checkoutRequestId) {
      logError("Missing CheckoutRequestID in callback", cb);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // Find transaction by checkout_request_id
    const txResult = await db.query(
      "SELECT id FROM transactions WHERE checkout_request_id=$1 LIMIT 1",
      [checkoutRequestId]
    );

    if (!txResult.rows.length) {
      logError("Transaction not found for checkout request", checkoutRequestId);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const txId = txResult.rows[0].id;

    if (cb.ResultCode === 0) {
      // Payment successful
      await db.query(
        "UPDATE transactions SET status='SUCCESS', mpesa_reference=$1 WHERE id=$2",
        [cb.MerchantRequestID, txId]
      );

      const result = await db.query(
        "SELECT receiver_phone, airtime_value FROM transactions WHERE id=$1",
        [txId]
      );

      const tx = result.rows[0];
      if (!tx) {
        logError("Transaction not found", txId);
        return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
      }

      await sendAirtime(tx.receiver_phone, tx.airtime_value);

      await db.query(
        "UPDATE transactions SET status='AIRTIME_SENT' WHERE id=$1",
        [txId]
      );

      logInfo("Airtime sent", {
        txId,
        phone: tx.receiver_phone,
        amount: tx.airtime_value,
      });
    } else {
      // Payment failed
      await db.query(
        "UPDATE transactions SET status='FAILED' WHERE id=$1",
        [txId]
      );

      logInfo("Payment failed", {
        txId,
        code: cb.ResultCode,
        desc: cb.ResultDesc,
      });
    }

    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    logError("MPESA callback error", error);
    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}