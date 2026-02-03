import { Request, Response } from "express";
import { stkPush } from "../services/mpesa.service";
import { db } from "../database/db";
import { calculateAirtime } from "../utils/calculator";
import { logError, logInfo } from "../utils/logger";

export async function initiatePayment(req: Request, res: Response) {
  try {
    const { payerPhone, receiverPhone, amount } = req.body;

    logInfo("Payment initiation request", { payerPhone, receiverPhone, amount });

    if (!payerPhone || !receiverPhone || !amount) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // get rate
    const rateResult = await db.query("SELECT rate FROM settings WHERE id = 1");
    const rate = rateResult.rows[0].rate;

    // calculate airtime
    const airtime = calculateAirtime(amount, rate);

    // save transaction
    const txResult = await db.query(
      `INSERT INTO transactions
       (payer_phone, receiver_phone, amount_paid, airtime_value, rate_used)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [payerPhone, receiverPhone, amount, airtime, rate],
    );
    const transactionId = txResult.rows[0].id;

    const txId = transactionId;

    logInfo("Transaction created", { txId });

    // send STK push
    const stkResponse = await stkPush(payerPhone, amount, `TX-${txId}`);

    logInfo("STK Push response", stkResponse);

    // Update transaction with CheckoutRequestID
    if (stkResponse.CheckoutRequestID) {
      await db.query(
        "UPDATE transactions SET checkout_request_id=$1 WHERE id=$2",
        [stkResponse.CheckoutRequestID, txId]
      );
    }

    res.json({
      message: "STK Push sent",
      transactionId: txId,
    });
  } catch (error) {
    logError("Payment initiation failed", error);
    res.status(500).json({
      message: "Payment initiation failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
