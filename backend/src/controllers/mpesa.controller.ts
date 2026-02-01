import { Request, Response } from "express";
import { db } from "../database/db";
import { sendAirtime } from "../services/airtime.service";
import { logInfo, logError } from "../utils/logger";

export async function mpesaCallback(req: Request, res: Response) {
  // log every callback (VERY IMPORTANT)
  logInfo("MPESA callback received", req.body);

  try {
    const cb = req.body.Body.stkCallback;

    // Safaricom sometimes sends unexpected payloads
    if (!cb) {
      logError("Invalid MPESA callback payload", req.body);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const ref = cb.AccountReference?.replace("TX-", "");

    if (!ref) {
      logError("Missing AccountReference in callback", cb);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    if (cb.ResultCode === 0) {
      // payment success
      await db.query("UPDATE transactions SET status='SUCCESS' WHERE id=$1", [
        ref,
      ]);

      const txResult = await db.query(
        "SELECT receiver_phone, airtime_value FROM transactions WHERE id=$1",
        [ref],
      );

      const tx = txResult.rows[0];

      if (!tx) {
        logError("Transaction not found after payment success", ref);
        return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
      }

      // send airtime
      await sendAirtime(tx.receiver_phone, tx.airtime_value);

      await db.query(
        "UPDATE transactions SET status='AIRTIME_SENT' WHERE id=$1",
        [ref],
      );

      logInfo("Airtime sent successfully", {
        transactionId: ref,
        phone: tx.receiver_phone,
        amount: tx.airtime_value,
      });
    } else {
      // payment failed or cancelled
      await db.query("UPDATE transactions SET status='FAILED' WHERE id=$1", [
        ref,
      ]);

      logInfo("MPESA payment failed", {
        transactionId: ref,
        resultCode: cb.ResultCode,
        resultDesc: cb.ResultDesc,
      });
    }

    // ALWAYS acknowledge Safaricom
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    logError("MPESA callback processing error", error);

    // Even on error, always return success to Safaricom
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
