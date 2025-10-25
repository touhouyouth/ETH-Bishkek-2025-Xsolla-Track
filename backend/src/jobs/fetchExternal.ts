import axios from "axios";
import { api } from "../services/apiClient.js";
import { storage } from "../services/storage.js";
import { log } from "../logger.js";

// Steam user ID (Steam64 ID format)
const STEAM_USER_ID = "76561198000000000"; // Replace with actual Steam ID

let isRunning = false;

export async function fetchExternalJob() {
  if (isRunning) {
    log.info("fetchExternalJob skipped (already running)");
    return;
  }
  isRunning = true;
  try {
    // Fetch CS2 inventory data from Steam API
    const steamResponse = await axios.get(
      `https://steamcommunity.com/inventory/${STEAM_USER_ID}/730/2?l=en&count=500`
    );

    log.info("CS2 Inventory Data:", steamResponse.data);

    // const { data } = await api.get("/data"); // подставьте путь
    // storage.setExternalData(data);
    log.info("Fetched external data");
  } catch (e) {
    log.error("fetchExternalJob failed", e);
  } finally {
    isRunning = false;
  }
}
