import { Request, Response } from "express";
import { db } from "../database/db";
import { sendAirtime } from "../services/airtime.service";
import { logInfo, logError } from "../utils/logger";

export async function mpesaCallback(req: Request, res: Response) {
  // Always log raw callback
  logInfo("MPESA callback received", req.body);

  try {
    const cb = req.body?.Body?.stkCallback;

    // Safety: unexpected payloads
    if (!cb) {
      logError("Invalid MPESA callback payload", req.body);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const checkoutId = cb.CheckoutRequestID;

    /**
     * 🔴 PAYMENT FAILED / CANCELLED / TIMEOUT
     * NOTE:
     * - AccountReference is NOT sent here
     * - CallbackMetadata is NOT sent here
     * - This is NORMAL behaviour
     */
    if (cb.ResultCode !== 0) {
      await db.query(
        `UPDATE transactions
         SET status = 'FAILED',
             failure_reason = $1
         WHERE checkout_request_id = $2`,
        [cb.ResultDesc, checkoutId]
      );

      logInfo("MPESA payment failed", {
        checkoutId,
        resultCode: cb.ResultCode,
        resultDesc: cb.ResultDesc,
      });

      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    /**
     * 🟢 PAYMENT SUCCESS
     * Only here does Safaricom send metadata
     */
    const metadata = cb.CallbackMetadata?.Item || [];

    const accountRef = metadata.find(
      (i: any) => i.Name === "AccountReference"
    )?.Value;

    const receipt = metadata.find(
      (i: any) => i.Name === "MpesaReceiptNumber"
    )?.Value;

    const amount = metadata.find(
      (i: any) => i.Name === "Amount"
    )?.Value;

    if (!accountRef || !receipt) {
      logError("Missing metadata on successful callback", metadata);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // Extract internal transaction ID
    const txId = accountRef.replace("TX-", "");

    // Mark transaction as PAID
    await db.query(
      `UPDATE transactions
       SET status = 'PAID',
           mpesa_receipt = $1,
           amount_paid = $2
       WHERE id = $3`,
      [receipt, amount, txId]
    );

    // Fetch airtime details
    const txResult = await db.query(
      `SELECT receiver_phone, airtime_value
       FROM transactions
       WHERE id = $1`,
      [txId]
    );

    const tx = txResult.rows[0];

    if (!tx) {
      logError("Transaction not found after payment success", txId);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    /**
     * 🚀 SEND AIRTIME
     * This happens ONLY after confirmed payment
     */
    await sendAirtime(tx.receiver_phone, tx.airtime_value);

    await db.query(
      `UPDATE transactions
       SET status = 'AIRTIME_SENT'
       WHERE id = $1`,
      [txId]
    );

    logInfo("Airtime sent successfully", {
      transactionId: txId,
      phone: tx.receiver_phone,
      amount: tx.airtime_value,
    });

    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    logError("MPESA callback processing error", error);

    // IMPORTANT:
    // Even on error, always respond 200 to Safaricom
    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}