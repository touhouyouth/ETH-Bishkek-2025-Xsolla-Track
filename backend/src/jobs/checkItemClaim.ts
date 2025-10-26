import { log } from "../logger.js";
import { storage } from "../services/storage.js";
import { createPublicClient, http } from "viem";
import { config, xsollaZKSync } from "../config.js";

const publicClient = createPublicClient({
  chain: xsollaZKSync,
  transport: http(),
});

const contractABI = [
  {
    name: "tokensOfOwner",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
] as const;

let isRunning = false;

export async function checkItemClaimJob() {
  if (isRunning) {
    log.info("checkItemClaimJob skipped (already running)");
    return;
  }

  isRunning = true;

  try {
    log.info("checkItemClaimJob started");

    const state = storage.get();

    const itemsToCheck = state.items.filter(
      (item) => !item.isClaimed && item.signatureGenerated
    );

    log.info(`Found ${itemsToCheck.length} items to check`);

    for (const item of itemsToCheck) {
      try {
        const owner = state.users.find((u) => u.steamId === item.ownerSteamId);

        if (!owner) {
          log.warn(`Owner not found for item ${item.id}`);
          continue;
        }

        log.info(
          `Checking item ${item.id} (classId: ${item.classId}) for owner ${owner.walletAddress}`
        );

        const tokenIds = await publicClient.readContract({
          address: config.contractAddress as `0x${string}`,
          abi: contractABI,
          functionName: "tokensOfOwner",
          args: [owner.walletAddress as `0x${string}`],
        });

        log.info(
          `Owner ${owner.walletAddress} has ${
            tokenIds.length
          } tokens: ${tokenIds.join(", ")}`
        );

        const isOwned = tokenIds.some(
          (tokenId) => tokenId.toString() === item.classId
        );

        if (isOwned) {
          log.info(`Item ${item.id} (classId: ${item.classId}) is claimed!`);
          storage.updateItem(item.classId, { isClaimed: true });
        } else {
          log.info(
            `Item ${item.id} (classId: ${item.classId}) not yet claimed`
          );
        }
      } catch (error) {
        log.error(`Failed to check item ${item.id}`, error);
      }
    }

    log.info("checkItemClaimJob completed");
  } catch (e) {
    log.error("checkItemClaimJob failed", e);
  } finally {
    isRunning = false;
  }
}
