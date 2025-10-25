import cron from "node-cron";
import { config } from "../config.js";
import { fetchExternalJob } from "./fetchExternal.js";
import { checkItemClaimJob } from "./checkItemClaim.js";

export function startScheduler() {
  // cron.schedule(config.cron.fetch, fetchExternalJob, { timezone: "UTC" });
  cron.schedule(config.cron.ipfs, checkItemClaimJob, { timezone: "UTC" });
}
