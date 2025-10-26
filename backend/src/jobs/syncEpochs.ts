import { log } from "../logger.js";
import { syncRecentEpochs } from "../services/epochSync.js";

/**
 * Cron job to sync recent epochs from the contract
 * This runs periodically to keep the cache up-to-date
 */
export async function syncEpochsJob() {
  try {
    log.info("⏰ Running epoch sync job...");
    await syncRecentEpochs(5); // Sync last 5 epochs
  } catch (error: any) {
    log.error(`Epoch sync job failed: ${error.message}`);
  }
}

