import cron from "node-cron";
import { config } from "../config.js";
import { fetchExternalJob } from "./fetchExternal.js";
import { updateIpfsJob } from "./updateIpfs.js";

export function startScheduler() {
  cron.schedule(config.cron.fetch, fetchExternalJob, { timezone: "UTC" });
  // cron.schedule(config.cron.ipfs, updateIpfsJob, { timezone: "UTC" });
}
