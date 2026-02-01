import { Router } from "express";
import { mpesaCallback } from "../controllers/mpesa.controller";

const router = Router();
router.post("/callback", mpesaCallback);
export default router;
