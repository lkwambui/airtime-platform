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
 * Create Airtime Job (🔥 NOW WITH SPLITTING)
 */
export async function createAirtimeJob(
  transactionId: string,
  recipientPhone: string,
  amount: number
) {
  try {
    const localPhone = toLocalPhone(recipientPhone);
    const airtimeAmount = Math.round(amount);

    const MAX = 10000;

    // 🔥 SPLIT INTO CHUNKS
    const chunks: number[] = [];
    let remaining = airtimeAmount;

    while (remaining > 0) {
      if (remaining >= MAX) {
        chunks.push(MAX);
        remaining -= MAX;
      } else {
        chunks.push(remaining);
        remaining = 0;
      }
    }

    const device = await getAvailableDevice();

    let assignedDevice = null;
    let status = "WAITING_ETOPUP";

    if (!device) {
      status = "WAITING_DEVICE";
    } else {
      assignedDevice = device.name;
    }

    logInfo("Creating airtime jobs (SPLIT)", {
      transactionId,
      phone: localPhone,
      totalAmount: airtimeAmount,
      chunks,
      device: assignedDevice || "NONE",
      status,
    });

    // 🔥 CREATE MULTIPLE JOBS
    for (const chunk of chunks) {
      await db.query(
        `
        INSERT INTO airtime_jobs (transaction_id, phone, amount, status, assigned_device)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [transactionId, localPhone, chunk, status, assignedDevice]
      );
    }

    // 🔥 UPDATE TRANSACTION (DO NOT MARK SUCCESS YET)
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
          ? "No device available. Jobs queued."
          : "Jobs created and assigned",
    };
  } catch (error: any) {
    logError("Failed to create airtime job", error.message);
    throw error;
  }
        }
