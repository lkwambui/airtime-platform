import { Request, Response } from "express";
import { db } from "../database/db";
import { logError, logInfo } from "../utils/logger";

const ALLOWED_JOB_STATUSES = ["PENDING", "SUCCESS", "FAILED"] as const;

function parseJobStatus(status: unknown) {
  if (typeof status !== "string") return null;
  const normalized = status.trim().toUpperCase();
  return ALLOWED_JOB_STATUSES.includes(normalized as (typeof ALLOWED_JOB_STATUSES)[number])
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

export async function devicePing(req: Request, res: Response) {
  try {
    if (!verifyDevice(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { deviceId, battery, charging } = req.body;

    if (typeof deviceId !== "string" || !deviceId.trim()) {
      return res.status(400).json({ message: "deviceId is required" });
    }

    if (battery !== undefined && (typeof battery !== "number" || battery < 0 || battery > 100)) {
      return res.status(400).json({ message: "battery must be a number between 0 and 100" });
    }

    if (charging !== undefined && typeof charging !== "boolean") {
      return res.status(400).json({ message: "charging must be boolean" });
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
        `UPDATE devices SET status='ONLINE', battery=$1, charging=$2, last_seen=NOW() WHERE name=$3`,
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

export async function getJobs(req: Request, res: Response) {
  try {
    if (!verifyDevice(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { device } = req.query;

    if (device !== undefined && typeof device !== "string") {
      return res.status(400).json({ message: "device query must be a string" });
    }

    const result = await db.query(
      `
      SELECT * FROM jobs
      WHERE status='PENDING'
      LIMIT 1
      `
    );

    if (result.rows.length === 0) {
      return res.json({ job: null });
    }

    logInfo("Job fetched for device", {
      device: device || null,
      jobId: result.rows[0].id,
    });

    res.json({ job: result.rows[0] });
  } catch (error) {
    logError("Get jobs failed", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
}

export async function submitResult(req: Request, res: Response) {
  try {
    if (!verifyDevice(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { jobId, status } = req.body;

    const parsedJobId = parseJobId(jobId);
    if (!parsedJobId) {
      return res.status(400).json({ message: "jobId must be a positive integer" });
    }

    const parsedStatus = parseJobStatus(status);
    if (!parsedStatus) {
      return res.status(400).json({
        message: `status must be one of: ${ALLOWED_JOB_STATUSES.join(", ")}`,
      });
    }

    const result = await db.query(
      `
      UPDATE jobs
      SET status=$1, updated_at=NOW()
      WHERE id=$2
      `,
      [parsedStatus, parsedJobId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    logInfo("Job result updated", { jobId: parsedJobId, status: parsedStatus });
    res.json({ message: "Result updated" });
  } catch (error) {
    logError("Submit result failed", error);
    res.status(500).json({ message: "Failed to update result" });
  }
}
