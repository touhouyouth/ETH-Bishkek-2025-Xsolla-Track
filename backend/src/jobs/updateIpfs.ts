import { publishToIPFS } from "../services/ipfs.js";
import { storage } from "../services/storage.js";
import { log } from "../logger.js";

let isRunning = false;

export async function updateIpfsJob() {
  if (isRunning) {
    log.info("updateIpfsJob skipped (already running)");
    return;
  }
  isRunning = true;
  try {
    const payload = storage.get();
    const cid = await publishToIPFS(payload);
    log.info("IPFS updated", { cid });
  } catch (e) {
    log.error("updateIpfsJob failed", e);
  } finally {
    isRunning = false;
  }
}
