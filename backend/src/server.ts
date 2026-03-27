import app from "./app";
import { db } from "./database/db";
import { retryAirtimeJobs } from "./jobs/airtimeRetry.job"; // ✅ NEW
import { updateDeviceStatus } from "./jobs/deviceStatus.job"; // ✅ NEW

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await db.query("SELECT 1"); // simple DB check

    app.listen(PORT, () => {
      console.log('🚀 Backend running on port ${PORT}');
    });

    // 🔥 Run background jobs

    // Check stuck transactions
    setInterval(() => {
      retryAirtimeJobs();
    }, 60000); // every 1 min

    // Check device status (online/offline)
    setInterval(() => {
      updateDeviceStatus();
    }, 10000); // every 10 sec

  } catch (error) {
    console.error("❌ Failed to start server", error);
  }
}

void startServer();