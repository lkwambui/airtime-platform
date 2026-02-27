import app from "./app";
import { db } from "./database/db";

const PORT = process.env.PORT || 4000;

async function applyRuntimeMigrations() {
  try {
    await db.query("ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'AIRTIME_SENT'");
    await db.query("ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'AIRTIME_FAILED'");
    console.log("✅ Runtime migrations applied");
  } catch (error) {
    console.error("⚠️ Runtime migration skipped/failed", error);
  }
}

async function startServer() {
  await applyRuntimeMigrations();

  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
  });
}

void startServer();
