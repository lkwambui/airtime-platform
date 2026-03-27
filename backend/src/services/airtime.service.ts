import { db } from "../database/db";
import { logInfo, logError } from "../utils/logger";

/**
 * Convert 2547XXXXXXXX → 07XXXXXXXX
 */
function toLocalPhone(phone: string): string {
  if (phone.startsWith("254")) {
    return "0" + phone.substring(3);
  }
  return phone;
}

/**
 * Get available device
 */
async function getAvailableDevice() {
  const result = await db.query(`
    SELECT * FROM devices
    WHERE status='ONLINE' AND enabled=true
    ORDER BY last_seen DESC
    LIMIT 1
  `);

  return result.rows[0];
}

/**
 * Create Airtime Job (for APK)
 */
export async function createAirtimeJob(
  transactionId: string,
  recipientPhone: string,
  amount: number
) {
  try {
    const localPhone = toLocalPhone(recipientPhone);
    const airtimeAmount = Math.round(amount);

    const device = await getAvailableDevice();

    let status = "WAITING_ETOPUP";
    let assignedDevice = null;

    // If no device available → queue it
    if (!device) {
      status = "WAITING_DEVICE";
    } else {
      assignedDevice = device.name;
    }

    logInfo("Creating airtime job", {
      transactionId,
      phone: localPhone,
      amount: airtimeAmount,
      device: assignedDevice || "NONE",
      status,
    });

    await db.query(
      `
      UPDATE transactions
      SET 
        receiver_phone = $1,
        airtime_value = $2,
        status = $3,
        assigned_device = $4,
        updated_at = NOW()
      WHERE id = $5
      `,
      [localPhone, airtimeAmount, status, assignedDevice, transactionId]
    );

    return {
      success: true,
      message:
        status === "WAITING_DEVICE"
          ? "No device available. Job queued."
          : "Job assigned to device",
    };
  } catch (error: any) {
    logError("Failed to create airtime job", error.message);
    throw error;
  }
}