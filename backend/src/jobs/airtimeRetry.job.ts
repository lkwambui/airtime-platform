import { db } from "../database/db";
import { logInfo, logError } from "../utils/logger";

/**
 * Auto-handle stuck airtime jobs
 */
export async function retryAirtimeJobs() {
  try {
    // 🔥 1. Mark long-waiting transactions as FAILED (no SMS / no result)
    const failedResult = await db.query(`
      UPDATE transactions
      SET status = 'FAILED', updated_at = NOW()
      WHERE status = 'WAITING_ETOPUP'
      AND updated_at < NOW() - INTERVAL '20 minutes'
      RETURNING id, receiver_phone
    `);

    if (failedResult.rows.length > 0) {
      logInfo("Marked transactions as FAILED", failedResult.rows);
    } else {
      logInfo("No stuck airtime jobs found");
    }

    // 🔥 2. Mark long-stuck jobs table entries as FAILED (device never responded)
    const stuckJobs = await db.query(`
      UPDATE jobs
      SET status = 'FAILED', updated_at = NOW()
      WHERE status = 'WAITING_ETOPUP'
      AND created_at < NOW() - INTERVAL '20 minutes'
      RETURNING id, phone
    `);

    if (stuckJobs.rows.length > 0) {
      logInfo("Marked jobs as FAILED (no device response)", stuckJobs.rows);
    } else {
      logInfo("No stuck jobs found");
    }

    // 🔥 3. Try re-assign jobs that were waiting for device
    const device = await db.query(`
      SELECT name FROM devices
      WHERE status='ONLINE' AND enabled=true
      LIMIT 1
    `);

    if (device.rows.length === 0) {
      logInfo("No available device for reassignment");
      return;
    }

    const deviceName = device.rows[0].name;

    const reassigned = await db.query(`
      UPDATE transactions
      SET 
        status = 'WAITING_ETOPUP',
        assigned_device = $1,
        updated_at = NOW()
      WHERE status = 'WAITING_DEVICE'
      RETURNING id
    `, [deviceName]);

    if (reassigned.rows.length > 0) {
      logInfo("Reassigned transactions to device", {
        device: deviceName,
        count: reassigned.rows.length,
      });
    }

    // 🔥 4. Promote PENDING jobs to WAITING_ETOPUP so device picks them up
    const promoted = await db.query(`
      UPDATE jobs
      SET status = 'WAITING_ETOPUP', updated_at = NOW()
      WHERE status = 'PENDING'
      RETURNING id, phone
    `);

    if (promoted.rows.length > 0) {
      logInfo("Promoted PENDING jobs to WAITING_ETOPUP", promoted.rows);
    }

  } catch (error) {
    logError("Airtime retry job error", error);
  }
}