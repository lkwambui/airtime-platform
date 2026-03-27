import { db } from "../database/db";
import { logInfo, logError } from "../utils/logger";

/**
 * Mark devices OFFLINE if no ping in last 30 seconds
 */
export async function updateDeviceStatus() {
  try {
    const result = await db.query(`
      UPDATE devices
      SET status='OFFLINE'
      WHERE last_seen < NOW() - INTERVAL '30 seconds'
      AND status='ONLINE'
      RETURNING id, name
    `);

    if (result.rows.length > 0) {
      logInfo("Devices marked OFFLINE", result.rows);
    }
  } catch (error) {
    logError("Device status job error", error);
  }
}