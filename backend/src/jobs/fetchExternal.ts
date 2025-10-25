import axios from "axios";
import { storage } from "../services/storage.js";
import { log } from "../logger.js";

let isRunning = false;

type SteamAsset = {
  assetid: string;
  classid: string;
  instanceid: string;
  amount: string;
};

type SteamInventoryResponse = {
  assets?: SteamAsset[];
  descriptions?: unknown[];
  total_inventory_count?: number;
  success?: number;
};

type UserInventory = {
  steamId: string;
  userName: string;
  assetIds: Set<string>;
};

export async function fetchExternalJob() {
  if (isRunning) {
    log.info("fetchExternalJob skipped (already running)");
    return;
  }

  isRunning = true;
  log.info("Starting fetchExternalJob");

  try {
    const state = storage.get();

    const inventories: UserInventory[] = await Promise.all(
      state.users.map(async (user) => {
        try {
          const steamResponse = await axios.get<SteamInventoryResponse>(
            `https://steamcommunity.com/inventory/${user.steamId}/570/2?l=en&count=1000`,
            { timeout: 10000 }
          );

          const data = steamResponse.data;
          const assetIds = new Set<string>(
            (data?.assets || []).map((asset) => asset.classid)
          );

          log.info(
            `Fetched inventory for ${user.name}: ${assetIds.size} items`
          );

          return {
            steamId: user.steamId,
            userName: user.name,
            assetIds,
          };
        } catch (error) {
          log.error(`Failed to fetch inventory for ${user.name}:`);
          return {
            steamId: user.steamId,
            userName: user.name,
            assetIds: new Set<string>(),
          };
        }
      })
    );

    for (const item of state.items) {
      const expectedOwnerInventory = inventories.find(
        (inv) => inv.steamId === item.ownerSteamId
      );

      if (!expectedOwnerInventory) {
        log.warn(
          `Expected owner ${item.ownerSteamId} not found in tracked users for item ${item.classId}`
        );
        continue;
      }

      const isWithExpectedOwner = expectedOwnerInventory.assetIds.has(
        item.classId
      );

      if (isWithExpectedOwner) {
        log.info(
          `Item ${item.classId} is still with expected owner ${expectedOwnerInventory.userName}`
        );
        continue;
      }

      log.warn(
        `Item ${item.classId} NOT found with expected owner ${expectedOwnerInventory.userName}`
      );

      const newOwner = inventories.find(
        (inv) =>
          inv.steamId !== item.ownerSteamId && inv.assetIds.has(item.classId)
      );

      if (newOwner) {
        log.info(
          `Item ${item.classId} found with new owner ${newOwner.userName}. Marking as transferred.`
        );

        storage.updateItem(item.classId, {
          ownerSteamId: newOwner.steamId,
          isTransferred: true,
          isClaimed: false,
        });
      } else {
        log.warn(
          `Item ${item.classId} not found in any tracked inventory. May have been traded externally.`
        );

        if (!item.isTransferred) {
          storage.updateItem(item.classId, {
            isTransferred: true,
            isClaimed: false,
          });
        }
      }
    }

    log.info("Assets:", state.items);

    log.info("Completed fetchExternalJob");
  } catch (e) {
    log.error("fetchExternalJob failed", e);
  } finally {
    isRunning = false;
  }
}
