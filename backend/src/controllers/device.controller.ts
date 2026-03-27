import { Request, Response } from "express";
import { db } from "../database/db";
import { logInfo, logError } from "../utils/logger";

/**
 * 🔐 OPTIONAL: simple API key check
 */
function verifyDevice(req: Request) {
  const key = req.headers.authorization;
  return key === 'Bearer ${process.env.DEVICE_API_KEY}';
}

/**
 * 📱 DEVICE PING (heartbeat)
 */
export async function devicePing(req: Request, res: Response) {
  try {
    if (!verifyDevice(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { deviceId, battery, charging } = req.body;

    await db.query(
      `
      UPDATE devices
      SET 
        status='ONLINE',
        battery=$1,
        charging=$2,
        last_seen=NOW()
      WHERE name=$3
      `,
      [battery, charging, deviceId]
    );

    res.json({ success: true });
  } catch (error) {
    logError("Device ping failed", error);
    res.status(500).json({ message: "Ping failed" });
  }
}

/**
 * 📥 GET JOB FOR DEVICE
 */
export async function getJobs(req: Request, res: Response) {
  try {
    if (!verifyDevice(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { deviceId } = req.query;

    const result = await db.query(
      `
      SELECT * FROM transactions
      WHERE status='WAITING_ETOPUP'
      AND (assigned_device=$1 OR assigned_device IS NULL)
      ORDER BY created_at ASC
      LIMIT 1
      `,
      [deviceId]
    );

    if (result.rows.length === 0) {
      return res.json({ job: null });
    }

    const job = result.rows[0];

    // assign device if not assigned
    if (!job.assigned_device) {
      await db.query(
        `
        UPDATE transactions
        SET assigned_device=$1
        WHERE id=$2
        `,
        [deviceId, job.id]
      );
    }

    res.json({
      job: {
        id: job.id,
        phone: job.receiver_phone,
        amount: Math.round(job.airtime_value),
      },
    });
  } catch (error) {
    logError("Get jobs failed", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
}

/**
 * 📤 RECEIVE RESULT FROM APK
 */
export async function submitResult(req: Request, res: Response) {
  try {
    if (!verifyDevice(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { transactionId, status, balance } = req.body;

    let newStatus = "FAILED";

    if (status === "SUCCESS") {
      newStatus = "SUCCESS";
    }

    await db.query(
      `
      UPDATE transactions
      SET 
        status=$1,
        balance_after=$2,
        updated_at=NOW()
      WHERE id=$3
      `,
      [newStatus, balance || null, transactionId]
    );

    logInfo("Device result received", {
      transactionId,
      status: newStatus,
      balance,
    });

    res.json({ success: true });
  } catch (error) {
    logError("Submit result failed", error);
    res.status(500).json({ message: "Failed to submit result" });
  }
}