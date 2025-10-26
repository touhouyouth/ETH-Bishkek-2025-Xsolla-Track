import cron from "node-cron";
import { config } from "../config.js";
import { fetchExternalJob } from "./fetchExternal.js";
import { checkItemClaimJob } from "./checkItemClaim.js";
import { syncEpochsJob } from "./syncEpochs.js";

export function startScheduler() {
  // cron.schedule(config.cron.fetch, fetchExternalJob, { timezone: "UTC" });
  // cron.schedule(config.cron.ipfs, checkItemClaimJob, { timezone: "UTC" });
  
  // Sync epochs every 5 minutes
  cron.schedule("*/5 * * * *", syncEpochsJob, { timezone: "UTC" });
}
