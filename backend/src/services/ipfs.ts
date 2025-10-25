import { log } from "../logger.js";

export async function publishToIPFS(payload: unknown) {
  // here, connect to ipfs-http-client or your gateway/pinning-service
  // stub for hackathon:
  log.info("Publishing to IPFS...", { size: JSON.stringify(payload).length });
  // return CID as a string
  return "bafy...dummy";
}
