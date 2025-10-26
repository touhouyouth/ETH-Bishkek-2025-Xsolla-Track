import { config } from "./config.js";
import { startScheduler } from "./jobs/scheduler.js";
import { createServer } from "./server.js";
import { log } from "./logger.js";
import {
  createNewEpochForTrade,
  initializeEpochService,
} from "./services/ipfs.js";
import { syncRecentEpochs } from "./services/epochSync.js";

const app = createServer();

const server = app.listen(config.port, async () => {
  log.info(`HTTP listening on :${config.port}`);

  // Start cron scheduler
  startScheduler();

  // Initialize epoch sync on startup
  log.info("🚀 Initializing epoch sync...");
  try {
    await syncRecentEpochs(5); // Sync last 5 epochs on startup
    log.info("✅ Initial epoch sync completed");
  } catch (error: any) {
    log.error(`Failed to sync epochs on startup: ${error.message}`);
  }

  // Keep existing functionality
  // createNewEpochForTrade("2704470580");
  initializeEpochService();
});

// graceful shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
function shutdown() {
  log.info("Shutting down...");
  server.close(() => process.exit(0));
}
