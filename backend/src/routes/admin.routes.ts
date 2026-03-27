import { Router } from "express";
import {
  adminLogin,
  retryTransaction,
  forceSuccess,
  toggleDevice,
  manualAirtime,
  getTransactions,
  getDevices, // ✅ NEW
} from "../controllers/admin.controller";

const router = Router();

/**
 * 🔑 AUTH
 */
router.post("/login", adminLogin);

/**
 * 📊 TRANSACTIONS
 */
router.get("/transactions", getTransactions);

/**
 * 🔁 ACTIONS
 */
router.post("/retry/:id", retryTransaction);
router.post("/force-success/:id", forceSuccess);

/**
 * 📱 DEVICES
 */
router.get("/devices", getDevices); // ✅ NEW
router.post("/device/toggle/:id", toggleDevice);

/**
 * 💸 MANUAL AIRTIME
 */
router.post("/manual-airtime", manualAirtime);

export default router;