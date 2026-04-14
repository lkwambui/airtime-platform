import { Request, Response } from "express";
import { db } from "../database/db";
import { logError, logInfo } from "../utils/logger";

const ALLOWED_JOB_STATUSES = ["PENDING", "SUCCESS", "FAILED"] as const;

function parseJobStatus(status: unknown) {
  if (typeof status !== "string") return null;
  const normalized = status.trim().toUpperCase();
  return ALLOWED_JOB_STATUSES.includes(
    normalized as (typeof ALLOWED_JOB_STATUSES)[number]
  )
    ? normalized
    : null;
}

function parseJobId(jobId: unknown) {
  const parsed = Number(jobId);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function verifyDevice(req: Request) {
  const key = req.headers.authorization;
  return key === `Bearer ${process.env.DEVICE_API_KEY}`;
}

/**
 * 📡 DEVICE PING
 */
export async function devicePing(req: Request, res: Response) {
  try {
    if (!verifyDevice(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { deviceId, battery, charging } = req.body;

    if (typeof deviceId !== "string" || !deviceId.trim()) {
      return res.status(400).json({ message: "deviceId is required" });
    }

    if (
      battery !== undefined &&
      (typeof battery !== "number" || battery < 0 || battery > 100)
    ) {
      return res
        .status(400)
        .json({ message: "battery must be a number between 0 and 100" });
    }

    if (charging !== undefined && typeof charging !== "boolean") {
      return res
        .status(400)
        .json({ message: "charging must be boolean" });
    }

    const existing = await db.query(
      "SELECT id FROM devices WHERE name=$1",
      [deviceId]
    );

    if (existing.rows.length === 0) {
      await db.query(
        "INSERT INTO devices (name, status, battery, charging, last_seen) VALUES ($1, 'ONLINE', $2, $3, NOW())",
        [deviceId, battery ?? 0, charging ?? false]
      );
      logInfo("New device registered", { deviceId });
    } else {
      await db.query(
        `UPDATE devices 
         SET status='ONLINE', battery=$1, charging=$2, last_seen=NOW() 
         WHERE name=$3`,
        [battery ?? 0, charging ?? false, deviceId]
      );
      logInfo("Device updated", { deviceId });
    }

    res.json({ success: true });
  } catch (error) {
    logError("Device ping failed", error);
    res.status(500).json({ message: "Ping failed" });
  }
}

/**
 * 📥 DEVICE RESULT (🔥 FINAL LOGIC)
 */
export async function deviceResult(req: Request, res: Response) {
  try {
    if (!verifyDevice(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { jobId, status, message } = req.body;

    const parsedJobId = parseJobId(jobId);
    const parsedStatus = parseJobStatus(status);

    if (!parsedJobId || !parsedStatus) {
      return res
        .status(400)
        .json({ message: "Invalid jobId or status" });
    }

    // 🔥 1. UPDATE JOB
    const jobResult = await db.query(
      `UPDATE airtime_jobs 
       SET status=$1, response=$2, updated_at=NOW() 
       WHERE id=$3 
       RETURNING *`,
      [parsedStatus, message ?? "", parsedJobId]
    );

    const job = jobResult.rows[0];

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const transactionId = job.transaction_id;

    logInfo("Job updated", {
      jobId: parsedJobId,
      status: parsedStatus,
      transactionId,
    });

    // 🔥 2. IF ANY JOB FAILS → FAIL WHOLE TRANSACTION
    if (parsedStatus === "FAILED") {
      await db.query(
        `UPDATE transactions 
         SET status='FAILED', updated_at=NOW() 
         WHERE id=$1`,
        [transactionId]
      );

      logInfo("Transaction FAILED due to job failure", {
        transactionId,
      });

      return res.json({ success: true });
    }

    // 🔥 3. CHECK IF ALL JOBS ARE SUCCESS
    const pending = await db.query(
      `SELECT id FROM airtime_jobs 
       WHERE transaction_id=$1 AND status!='SUCCESS'`,
      [transactionId]
    );

    if (pending.rows.length === 0) {
      await db.query(
        `UPDATE transactions 
         SET status='SUCCESS', updated_at=NOW() 
         WHERE id=$1`,
        [transactionId]
      );

      logInfo("🎉 ALL JOBS COMPLETED → TRANSACTION SUCCESS", {
        transactionId,
      });
    }

    res.json({ success: true });
  } catch (error) {
    logError("Device result failed", error);
    res.status(500).json({ message: "Result failed" });
  }
                                 }
