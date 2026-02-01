import { Request, Response } from "express";
import { db } from "../database/db";

// GET /api/settings
export async function getSettings(_req: Request, res: Response) {
  try {
    const [rows] = await db.query(
      "SELECT rate, in_stock FROM settings WHERE id = 1",
    );

    const settings = (rows as any[])[0];

    res.json({
      rate: Number(settings.rate),
      inStock: Boolean(settings.in_stock),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch settings",
      error,
    });
  }
}

// POST /api/settings (admin)
export async function updateSettings(req: Request, res: Response) {
  try {
    const { rate, inStock } = req.body;

    await db.query("UPDATE settings SET rate = ?, in_stock = ? WHERE id = 1", [
      rate,
      inStock,
    ]);

    res.json({
      message: "Settings updated successfully",
      rate,
      inStock,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update settings",
      error,
    });
  }
}
