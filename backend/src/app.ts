import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import publicRoutes from "./routes/public.routes";
import adminRoutes from "./routes/admin.routes";
import paymentRoutes from "./routes/payment.routes";
import mpesaRoutes from "./routes/mpesa.routes";
import { db } from "./database/db";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/mpesa", mpesaRoutes);

// DB health check (temporary)
app.get("/db-health", async (_req: express.Request, res: express.Response) => {
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

export default app;
import { errorHandler } from "./middlewares/error.middleware";

app.use(errorHandler);
