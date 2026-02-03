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

    const accountRef = cb.AccountReference;
    if (!accountRef) {
      logError("Missing AccountReference in callback", cb);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const txId = accountRef.replace("TX-", "");

    if (cb.ResultCode === 0) {
      // Payment successful
      await db.query(
        "UPDATE transactions SET status='SUCCESS' WHERE id=$1",
        [txId]
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