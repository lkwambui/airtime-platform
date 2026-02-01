import { Router } from "express";
import { initiatePayment } from "../controllers/payment.controller";

const router = Router();
router.post("/pay", initiatePayment);
export default router;
