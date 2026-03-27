import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import publicRoutes from "./routes/public.routes";
import adminRoutes from "./routes/admin.routes";
import paymentRoutes from "./routes/payment.routes";
import mpesaRoutes from "./routes/mpesa.routes";
import deviceRoutes from "./routes/device.routes"; // ✅ NEW
import { db } from "./database/db";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Root status endpoint
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Kredo ChapChap API" });
});

// routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/device", deviceRoutes); // ✅ NEW

// DB health check
app.get("/db-health", async (_req, res) => {
  try {
    await db.query("SELECT NOW()");
    res.json({
      status: "OK",
      message: "Database connected",
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      error: err,
    });
  }
});

app.use(errorHandler);

export default app;