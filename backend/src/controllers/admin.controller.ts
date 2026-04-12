import { Request, Response } from "express";
import { authenticateAdmin } from "../services/auth.service";
import { db } from "../database/db";
import { logError, logInfo } from "../utils/logger";

/**
 * 🔐 Simple PIN check
 */
function verifyPin(pin: string) {
  return pin === process.env.ADMIN_PIN;
}

/**
 * 🔑 ADMIN LOGIN
 */
export async function adminLogin(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password required",
    });
  }

  try {
    const { token } = await authenticateAdmin(username, password);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error: any) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    logError("Admin login failed", error);

    res.status(500).json({
      message: "Admin login failed",
      error: process.env.NODE_ENV === "production" ? undefined : error?.message,
    });
  }
}

/**
 * 🔁 RETRY TRANSACTION
 */
export async function retryTransaction(req: Request, res: Response) {
  const { id } = req.params;
  const { pin, admin } = req.body;

  if (!verifyPin(pin)) {
    return res.status(403).json({ message: "Invalid PIN" });
  }

  try {
    const device = await db.query(`
      SELECT name FROM devices
      WHERE status='ONLINE' AND enabled=true
      LIMIT 1
    `);

    let status = "WAITING_DEVICE";
    let assignedDevice = null;

    if (device.rows.length > 0) {
      status = "WAITING_ETOPUP";
      assignedDevice = device.rows[0].name;
    }

    await db.query(
      `
      UPDATE transactions
      SET 
        status=$1,
        assigned_device=$2,
        retried_by=$3,
        retried_at=NOW()
      WHERE id=$4
      `,
      [status, assignedDevice, admin || "admin", id]
    );

    logInfo("Transaction retried", { id, admin });

    res.json({ message: "Transaction retried" });
  } catch (error) {
    logError("Retry failed", error);
    res.status(500).json({ message: "Retry failed" });
  }
}

/**
 * ✅ FORCE SUCCESS (manual override)
 */
export async function forceSuccess(req: Request, res: Response) {
  const { id } = req.params;
  const { pin, admin } = req.body;

  if (!verifyPin(pin)) {
    return res.status(403).json({ message: "Invalid PIN" });
  }

  try {
    await db.query(
      `
      UPDATE transactions
      SET 
        status='SUCCESS',
        completed_by=$1,
        updated_at=NOW()
      WHERE id=$2
      `,
      [admin || "admin", id]
    );

    logInfo("Transaction forced to SUCCESS", { id, admin });

    res.json({ message: "Marked as SUCCESS" });
  } catch (error) {
    logError("Force success failed", error);
    res.status(500).json({ message: "Failed to mark success" });
  }
}

/**
 * 📱 ENABLE / DISABLE DEVICE
 */
export async function toggleDevice(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await db.query(
      `
      UPDATE devices
      SET enabled = NOT enabled
      WHERE id=$1
      `,
      [id]
    );

    res.json({ message: "Device toggled" });
  } catch (error) {
    logError("Device toggle failed", error);
    res.status(500).json({ message: "Failed to toggle device" });
  }
}

/**
 * 💸 MANUAL AIRTIME REQUEST
 */
export async function manualAirtime(req: Request, res: Response) {
  const { phone, amount, pin } = req.body;

  if (!verifyPin(pin)) {
    return res.status(403).json({ message: "Invalid PIN" });
  }

  try {
    const device = await db.query(`
      SELECT name FROM devices
      WHERE status='ONLINE' AND enabled=true
      LIMIT 1
    `);

    if (device.rows.length === 0) {
      return res.status(400).json({
        message: "No available device",
      });
    }

    const assignedDevice = device.rows[0].name;

    const result = await db.query(
      `
      INSERT INTO transactions (
        receiver_phone,
        airtime_value,
        status,
        assigned_device,
        created_at
      )
      VALUES ($1, $2, 'WAITING_ETOPUP', $3, NOW())
      RETURNING id
      `,
      [phone, Math.round(amount), assignedDevice]
    );

    res.json({
      message: "Manual airtime queued",
      transactionId: result.rows[0].id,
    });
  } catch (error) {
    logError("Manual airtime failed", error);
    res.status(500).json({ message: "Manual airtime failed" });
  }
}

/**
 * 📊 GET TRANSACTIONS
 */
export async function getTransactions(req: Request, res: Response) {
  try {
    const result = await db.query(`
      SELECT 
        id,
        payer_phone,
        receiver_phone,
        amount_paid,
        airtime_value,
        rate_used,
        status,
        mpesa_reference,
        checkout_request_id,
        assigned_device,
        balance_before,
        balance_after,
        retried_by,
        retried_at,
        created_at,
        updated_at
      FROM transactions
      ORDER BY created_at DESC
      LIMIT 200
    `);

    res.json(result.rows);
  } catch (error) {
    logError("Fetch transactions failed", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
}

/**
 * 📈 DASHBOARD STATS
 */
export async function getDashboardStats(req: Request, res: Response) {
  try {
    const statsWeekly = await db.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN payer_phone IS NOT NULL THEN amount_paid ELSE 0 END), 0) AS mpesa_received,
        COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN airtime_value ELSE 0 END), 0) AS airtime_sent
      FROM transactions
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);

    const statsMonthly = await db.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN payer_phone IS NOT NULL THEN amount_paid ELSE 0 END), 0) AS mpesa_received,
        COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN airtime_value ELSE 0 END), 0) AS airtime_sent
      FROM transactions
      WHERE created_at >= DATE_TRUNC('month', NOW())
    `);

    const chart = await db.query(`
      SELECT 
        TO_CHAR(created_at, 'Dy') AS day,
        EXTRACT(DOW FROM created_at)::int AS dow,
        COALESCE(SUM(CASE WHEN payer_phone IS NOT NULL THEN amount_paid ELSE 0 END), 0) AS mpesa,
        COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN airtime_value ELSE 0 END), 0) AS airtime
      FROM transactions
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(created_at, 'Dy'), EXTRACT(DOW FROM created_at)
      ORDER BY dow
    `);

    res.json({
      weekly: {
        mpesaReceived: Number(statsWeekly.rows[0].mpesa_received),
        airtimeSent: Number(statsWeekly.rows[0].airtime_sent),
      },
      monthly: {
        mpesaReceived: Number(statsMonthly.rows[0].mpesa_received),
        airtimeSent: Number(statsMonthly.rows[0].airtime_sent),
      },
      chart: chart.rows.map((r) => ({
        day: r.day,
        mpesa: Number(r.mpesa),
        airtime: Number(r.airtime),
      })),
    });
  } catch (error) {
    logError("Fetch dashboard stats failed", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
}

/**
 * 📱 GET DEVICES (NEW)
 */
export async function getDevices(req: Request, res: Response) {
  try {
    const result = await db.query(`
      SELECT id, name, brand, battery, charging, status, enabled, last_seen
      FROM devices
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    logError("Fetch devices failed", error);
    res.status(500).json({ message: "Failed to fetch devices" });
  }
}