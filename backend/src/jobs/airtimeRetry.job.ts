import { db } from "../database/db";
import { sendAirtime } from "../services/airtime.service";
import { logInfo, logError } from "../utils/logger";

/**
 * Retry airtime for successful payments
 * that did not complete airtime delivery
 */
export async function retryAirtimeJobs() {
  try {
    const [rows] = await db.query(
      `SELECT id, receiver_phone, airtime_value
       FROM transactions
       WHERE status = 'SUCCESS'`,
    );

    const transactions = rows as any[];

    if (transactions.length === 0) {
      logInfo("No airtime retries pending");
      return;
    }

    for (const tx of transactions) {
      try {
        logInfo("Retrying airtime", {
          transactionId: tx.id,
          phone: tx.receiver_phone,
        });

        await sendAirtime(tx.receiver_phone, tx.airtime_value);

        await db.query(
          "UPDATE transactions SET status = 'AIRTIME_SENT' WHERE id = ?",
          [tx.id],
        );

        logInfo("Airtime retry successful", {
          transactionId: tx.id,
        });
      } catch (err) {
        logError("Airtime retry failed", {
          transactionId: tx.id,
          error: err,
        });
      }
    }
  } catch (error) {
    logError("Airtime retry job error", error);
  }
}
