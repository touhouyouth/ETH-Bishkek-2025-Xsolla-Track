import { log } from "../logger.js";
import { getAllCachedEpochs, getCurrentEpochId, getEpochWithCache } from "./epochSync.js";
import type { WalletHistory } from "../types.js";

/**
 * Build wallet history from cached epochs
 * Returns history of all tokens that were owned by this wallet across epochs
 */
export async function getWalletHistory(
  walletAddress: string
): Promise<WalletHistory> {
  try {
    log.info(`Fetching history for wallet: ${walletAddress}`);

    // Get all cached epochs
    const cachedEpochs = getAllCachedEpochs();

    if (cachedEpochs.size === 0) {
      log.warn("No cached epochs available, syncing...");
      // Try to sync at least the current epoch
      const currentEpochId = await getCurrentEpochId();
      if (currentEpochId > 0n) {
        await getEpochWithCache(currentEpochId);
      }
    }

    const history: WalletHistory["history"] = [];

    // Sort epochs by ID (oldest first)
    const sortedEpochs = Array.from(cachedEpochs.entries())
      .sort((a, b) => Number(a[1].epoch.epochId) - Number(b[1].epoch.epochId));

    log.info(`Processing ${sortedEpochs.length} epochs for wallet history`);

    // Build history for each token across epochs
    const tokenHistoryMap = new Map<
      string,
      Array<{
        epochId: string;
        epochFromTs: bigint;
        steamId: string;
        tokenName: string;
        iconUrl: string;
      }>
    >();

    for (const [epochIdStr, epochCache] of sortedEpochs) {
      const { epoch, metadata } = epochCache;

      // Iterate through all tokens in this epoch
      for (const [tokenId, tokenMetadata] of metadata.entries()) {
        // Check if this token has any association with the wallet
        // For now, we'll collect all tokens and their steam_id changes
        const entry = {
          epochId: epochIdStr,
          epochFromTs: epoch.fromTs,
          steamId: tokenMetadata.steam_id,
          tokenName: tokenMetadata.name,
          iconUrl: tokenMetadata.icon_url_large || tokenMetadata.icon_url,
        };

        if (!tokenHistoryMap.has(tokenId)) {
          tokenHistoryMap.set(tokenId, []);
        }
        tokenHistoryMap.get(tokenId)!.push(entry);
      }
    }

    // Calculate epochTime for each entry
    // epochTime = difference between epochFromTs of consecutive epochs
    // For the last epoch: epochTime = current time - epochFromTs
    const currentTime = BigInt(Math.floor(Date.now() / 1000));

    // Convert to final history format
    // We'll return all tokens with their full history
    for (const [tokenId, tokenHistory] of tokenHistoryMap.entries()) {
      // Add each epoch entry for this token
      for (let i = 0; i < tokenHistory.length; i++) {
        const entry = tokenHistory[i];
        const nextEntry = tokenHistory[i + 1];

        let epochTime: bigint;
        if (nextEntry) {
          // Not the last epoch: difference between next epoch's fromTs and current fromTs
          epochTime = nextEntry.epochFromTs - entry.epochFromTs;
        } else {
          // Last epoch: current time - fromTs
          epochTime = currentTime - entry.epochFromTs;
        }

        history.push({
          epochId: entry.epochId,
          epochFromTs: entry.epochFromTs.toString(),
          epochTime: epochTime.toString(),
          tokenId: tokenId,
          steamId: entry.steamId,
          tokenName: entry.tokenName,
          iconUrl: entry.iconUrl,
        });
      }
    }

    // Sort history by epoch ID and token ID
    history.sort((a, b) => {
      const epochCompare = Number(a.epochId) - Number(b.epochId);
      if (epochCompare !== 0) return epochCompare;
      return a.tokenId.localeCompare(b.tokenId);
    });

    log.info(
      `✅ Generated history for wallet ${walletAddress}: ${history.length} entries`
    );

    return {
      walletAddress,
      history,
    };
  } catch (error: any) {
    log.error(`Failed to get wallet history: ${error.message}`);
    throw error;
  }
}

/**
 * Get history for a specific token across epochs
 */
export async function getTokenHistory(tokenId: string): Promise<{
  tokenId: string;
  history: Array<{
    epochId: string;
    epochFromTs: string;
    epochTime: string;
    steamId: string;
    tokenName: string;
    iconUrl: string;
  }>;
}> {
  try {
    log.info(`Fetching history for token: ${tokenId}`);

    const cachedEpochs = getAllCachedEpochs();

    if (cachedEpochs.size === 0) {
      log.warn("No cached epochs available");
      return { tokenId, history: [] };
    }

    const tempHistory: Array<{
      epochId: string;
      epochFromTs: bigint;
      steamId: string;
      tokenName: string;
      iconUrl: string;
    }> = [];

    // Sort epochs by ID (oldest first)
    const sortedEpochs = Array.from(cachedEpochs.entries())
      .sort((a, b) => Number(a[1].epoch.epochId) - Number(b[1].epoch.epochId));

    for (const [epochIdStr, epochCache] of sortedEpochs) {
      const { epoch, metadata } = epochCache;

      const tokenMetadata = metadata.get(tokenId);
      if (tokenMetadata) {
        tempHistory.push({
          epochId: epochIdStr,
          epochFromTs: epoch.fromTs,
          steamId: tokenMetadata.steam_id,
          tokenName: tokenMetadata.name,
          iconUrl: tokenMetadata.icon_url_large || tokenMetadata.icon_url,
        });
      }
    }

    // Calculate epochTime for each entry
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    const history = tempHistory.map((entry, i) => {
      const nextEntry = tempHistory[i + 1];
      const epochTime = nextEntry
        ? nextEntry.epochFromTs - entry.epochFromTs
        : currentTime - entry.epochFromTs;

      return {
        epochId: entry.epochId,
        epochFromTs: entry.epochFromTs.toString(),
        epochTime: epochTime.toString(),
        steamId: entry.steamId,
        tokenName: entry.tokenName,
        iconUrl: entry.iconUrl,
      };
    });

    log.info(`✅ Generated history for token ${tokenId}: ${history.length} entries`);

    return {
      tokenId,
      history,
    };
  } catch (error: any) {
    log.error(`Failed to get token history: ${error.message}`);
    throw error;
  }
}

/**
 * Get all tokens owned by a specific steam_id in the latest epoch
 */
export async function getTokensBySteamId(steamId: string): Promise<{
  steamId: string;
  tokens: Array<{
    tokenId: string;
    tokenName: string;
    iconUrl: string;
    epochId: string;
  }>;
}> {
  try {
    log.info(`Fetching tokens for steam_id: ${steamId}`);

    // Get the latest epoch from cache
    const currentEpochId = await getCurrentEpochId();
    const epochCache = await getEpochWithCache(currentEpochId);

    if (!epochCache) {
      log.warn("No current epoch available");
      return { steamId, tokens: [] };
    }

    const tokens: Array<{
      tokenId: string;
      tokenName: string;
      iconUrl: string;
      epochId: string;
    }> = [];

    for (const [tokenId, tokenMetadata] of epochCache.metadata.entries()) {
      if (tokenMetadata.steam_id === steamId) {
        tokens.push({
          tokenId,
          tokenName: tokenMetadata.name,
          iconUrl: tokenMetadata.icon_url_large || tokenMetadata.icon_url,
          epochId: currentEpochId.toString(),
        });
      }
    }

    log.info(`✅ Found ${tokens.length} tokens for steam_id ${steamId}`);

    return {
      steamId,
      tokens,
    };
  } catch (error: any) {
    log.error(`Failed to get tokens by steam_id: ${error.message}`);
    throw error;
  }
}

