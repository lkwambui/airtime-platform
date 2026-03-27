import { Router } from "express";
import {
  devicePing,
  getJobs,
  submitResult,
} from "../controllers/device.controller";

const router = Router();

router.post("/ping", devicePing);
router.get("/jobs", getJobs);
router.post("/result", submitResult);

export default router;