import { createPublicClient, http } from "viem";
import axios from "axios";
import { xsollaZKSync, config } from "../config.js";
import { log } from "../logger.js";
import type { EpochData, EpochCache, TokenMetadata } from "../types.js";

const EPOCH_REGISTRY_ABI = [
  {
    inputs: [],
    name: "currentEpoch",
    outputs: [{ name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "epochId", type: "uint64" }],
    name: "epochs",
    outputs: [
      { name: "root", type: "bytes32" },
      { name: "fromTs", type: "uint64" },
      { name: "toTs", type: "uint64" },
      { name: "baseUri", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const publicClient = createPublicClient({
  chain: xsollaZKSync,
  transport: http(),
});

// In-memory cache for epochs (последние 5 эпох)
const epochCacheMap = new Map<string, EpochCache>();
const MAX_CACHED_EPOCHS = 5;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

/**
 * Retry function with exponential backoff for 429 errors
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 4000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      const is429 = error.response?.status === 429;
      const isTimeout =
        error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";

      if (attempt < maxRetries && (is429 || isTimeout)) {
        const delay = baseDelay * Math.pow(2, attempt);
        log.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms (error: ${error.message})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

/**
 * Get current epoch ID from contract
 */
export async function getCurrentEpochId(): Promise<bigint> {
  const epochId = await publicClient.readContract({
    address: config.epochRegistryAddress,
    abi: EPOCH_REGISTRY_ABI,
    functionName: "currentEpoch",
  });
  return epochId;
}

/**
 * Get epoch data from contract
 */
export async function getEpochData(epochId: bigint): Promise<EpochData> {
  const [root, fromTs, toTs, baseUri] = await publicClient.readContract({
    address: config.epochRegistryAddress,
    abi: EPOCH_REGISTRY_ABI,
    functionName: "epochs",
    args: [epochId],
  });
  return { epochId, root, fromTs, toTs, baseUri };
}

/**
 * Parse IPFS URI to extract CID and epoch path
 */
function parseIpfsUri(uri: string): { cid: string; epochPath: string } {
  let match = uri.match(/ipfs:\/\/([^\/]+)\/(.+)\/?/);

  if (!match) {
    match = uri.match(/\/ipfs\/([^\/]+)\/(.+)\/?/);
  }

  if (!match) {
    throw new Error(`Invalid IPFS URI: ${uri}`);
  }

  return {
    cid: match[1],
    epochPath: match[2].replace(/\/$/, ""),
  };
}

/**
 * Download a single item metadata from IPFS
 */
async function downloadItemFromIpfs(
  cid: string,
  epochPath: string,
  classId: string
): Promise<TokenMetadata | null> {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}/${epochPath}/${classId}.json`;
  
  try {
    const response = await retryWithBackoff(
      () =>
        axios.get(url, {
          headers: {
            "x-pinata-gateway-token": config.pinataJwt,
          },
          timeout: 15000,
        }),
      5,
      2000
    );
    return response.data;
  } catch (error: any) {
    log.error(
      `Failed to download item ${classId} from IPFS after retries: ${error.message}`
    );
    return null;
  }
}

/**
 * Get all JSON files in an IPFS epoch directory
 */
async function getAllFilesInEpoch(
  cid: string,
  epochPath: string
): Promise<string[]> {
  log.info(`Fetching files for CID ${cid} from IPFS gateway...`);

  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}/${epochPath}/`;
    const response = await retryWithBackoff(
      () =>
        axios.get(url, {
          timeout: 20000,
          headers: {
            Accept: "text/html",
            "x-pinata-gateway-token": config.pinataJwt,
          },
        }),
      5,
      2000
    );

    const html = response.data;

    const regex = /<a[^>]*href="[^"]*">([^<]+\.json)<\/a>/g;
    const matches = [...html.matchAll(regex)];

    const classIds = matches
      .map((match) => match[1])
      .filter((name) => name && name.endsWith(".json"))
      .filter((name) => !name.includes("/"))
      .map((name) => name.replace(".json", ""));

    const uniqueClassIds = [...new Set(classIds)];

    if (uniqueClassIds.length === 0) {
      throw new Error(`No JSON files found in ${url}`);
    }

    log.info(`Found ${uniqueClassIds.length} JSON files in epoch ${epochPath}`);
    return uniqueClassIds;
  } catch (error: any) {
    log.error(`Failed to get directory listing: ${error.message}`);
    throw error;
  }
}

/**
 * Download all items metadata from a specific epoch
 */
async function downloadAllItemsFromEpoch(
  epochData: EpochData
): Promise<Map<string, TokenMetadata>> {
  log.info(`📥 Downloading ALL items from epoch ${epochData.epochId}...`);

  const { cid, epochPath } = parseIpfsUri(epochData.baseUri);

  const allClassIds = await getAllFilesInEpoch(cid, epochPath);

  log.info(`Found ${allClassIds.length} total items in epoch ${epochData.epochId}`);

  const itemsMap = new Map<string, TokenMetadata>();

  // Download items in batches to avoid overwhelming the gateway
  const BATCH_SIZE = 10;
  for (let i = 0; i < allClassIds.length; i += BATCH_SIZE) {
    const batch = allClassIds.slice(i, i + BATCH_SIZE);
    
    const downloadPromises = batch.map(async (classId) => {
      const metadata = await downloadItemFromIpfs(cid, epochPath, classId);
      if (metadata) {
        itemsMap.set(classId, metadata);
        log.info(
          `✓ Downloaded ${classId} (${itemsMap.size}/${allClassIds.length}) (steam_id: ${metadata.steam_id})`
        );
      }
    });

    await Promise.all(downloadPromises);
    
    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < allClassIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  log.info(`✅ Downloaded ${itemsMap.size} items from epoch ${epochData.epochId}`);

  if (itemsMap.size !== allClassIds.length) {
    log.warn(
      `⚠️ Warning: Expected ${allClassIds.length} items but only downloaded ${itemsMap.size}`
    );
  }

  return itemsMap;
}

/**
 * Get epoch from cache or fetch from IPFS
 */
export async function getEpochWithCache(
  epochId: bigint
): Promise<EpochCache | null> {
  const epochIdStr = epochId.toString();

  // Check if in cache and not expired
  const cached = epochCacheMap.get(epochIdStr);
  if (cached) {
    const age = Date.now() - cached.fetchedAt;
    if (age < CACHE_TTL) {
      log.info(`✓ Using cached data for epoch ${epochId} (age: ${Math.floor(age / 1000)}s)`);
      return cached;
    } else {
      log.info(`Cache expired for epoch ${epochId}, re-fetching...`);
      epochCacheMap.delete(epochIdStr);
    }
  }

  try {
    // Fetch epoch data from contract
    const epochData = await getEpochData(epochId);

    // Check if epoch exists (baseUri should not be empty)
    if (!epochData.baseUri || epochData.baseUri === "") {
      log.warn(`Epoch ${epochId} does not exist or has empty baseUri`);
      return null;
    }

    // Download metadata from IPFS
    const metadata = await downloadAllItemsFromEpoch(epochData);

    const cache: EpochCache = {
      epoch: epochData,
      metadata,
      fetchedAt: Date.now(),
    };

    // Add to cache
    epochCacheMap.set(epochIdStr, cache);

    // Cleanup old cache entries if needed
    if (epochCacheMap.size > MAX_CACHED_EPOCHS) {
      const entries = Array.from(epochCacheMap.entries());
      entries.sort((a, b) => a[1].fetchedAt - b[1].fetchedAt);
      
      // Remove oldest entries
      for (let i = 0; i < epochCacheMap.size - MAX_CACHED_EPOCHS; i++) {
        epochCacheMap.delete(entries[i][0]);
        log.info(`Removed old cache entry for epoch ${entries[i][0]}`);
      }
    }

    log.info(`✅ Cached epoch ${epochId} with ${metadata.size} items`);

    return cache;
  } catch (error: any) {
    log.error(`Failed to fetch epoch ${epochId}: ${error.message}`);
    return null;
  }
}

/**
 * Sync the last N epochs to cache
 */
export async function syncRecentEpochs(
  numEpochs: number = MAX_CACHED_EPOCHS
): Promise<void> {
  try {
    log.info(`🔄 Starting sync of recent ${numEpochs} epochs...`);

    const currentEpochId = await getCurrentEpochId();
    log.info(`Current epoch ID: ${currentEpochId}`);

    if (currentEpochId === 0n) {
      log.info("No epochs to sync yet");
      return;
    }

    // Sync last N epochs
    const startEpochId = currentEpochId - BigInt(numEpochs - 1);
    const minEpochId = startEpochId > 0n ? startEpochId : 1n;

    const epochsToSync: bigint[] = [];
    for (let i = minEpochId; i <= currentEpochId; i++) {
      epochsToSync.push(i);
    }

    log.info(
      `Syncing epochs ${minEpochId} to ${currentEpochId} (${epochsToSync.length} epochs)`
    );

    // Sync epochs sequentially to avoid overwhelming the IPFS gateway
    for (const epochId of epochsToSync) {
      await getEpochWithCache(epochId);
      // Small delay between epochs
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    log.info(`✅ Sync completed. Cached ${epochCacheMap.size} epochs`);
  } catch (error: any) {
    log.error(`Failed to sync recent epochs: ${error.message}`);
  }
}

/**
 * Get all cached epochs
 */
export function getAllCachedEpochs(): Map<string, EpochCache> {
  return epochCacheMap;
}

/**
 * Clear cache (useful for testing)
 */
export function clearCache(): void {
  epochCacheMap.clear();
  log.info("Cache cleared");
}

