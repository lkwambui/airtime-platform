import { Request, Response } from "express";
import { stkPush } from "../services/mpesa.service";
import { db } from "../database/db";
import { calculateAirtime } from "../utils/calculator";

export async function initiatePayment(req: Request, res: Response) {
  try {
    const { payerPhone, receiverPhone, amount } = req.body;

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

    // send STK push
    await stkPush(payerPhone, amount, `TX-${txId}`);

    res.json({
      message: "STK Push sent",
      transactionId: txId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment initiation failed",
      error,
    });
  }
}
