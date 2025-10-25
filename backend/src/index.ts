import { config } from "./config.js";
import { startScheduler } from "./jobs/scheduler.js";
import { createServer } from "./server.js";
import { log } from "./logger.js";

const app = createServer();

const server = app.listen(config.port, () => {
  log.info(`HTTP listening on :${config.port}`);
  startScheduler();
});

// graceful shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
function shutdown() {
  log.info("Shutting down...");
  server.close(() => process.exit(0));
}
