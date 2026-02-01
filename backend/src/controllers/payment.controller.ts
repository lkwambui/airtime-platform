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
    const [rows] = await db.query("SELECT rate FROM settings WHERE id = 1");
    const rate = (rows as any[])[0].rate;

    // calculate airtime
    const airtime = calculateAirtime(amount, rate);

    // save transaction
    const [result] = await db.query(
      `INSERT INTO transactions
       (payer_phone, receiver_phone, amount_paid, airtime_value, rate_used)
       VALUES (?, ?, ?, ?, ?)`,
      [payerPhone, receiverPhone, amount, airtime, rate],
    );

    const txId = (result as any).insertId;

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
