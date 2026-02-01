import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/airtime.controller";
import { requireAdmin } from "../middlewares/jwt.middleware";

const router = Router();

// Public endpoint
router.get("/settings", getSettings);

// Admin-only endpoint
router.post("/settings", requireAdmin, updateSettings);

export default router;
