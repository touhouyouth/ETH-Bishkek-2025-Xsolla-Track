import express from "express";
import cors from "cors";
import { storage } from "./services/storage.js";
import { generateClaimSignature } from "./services/signature.js";
import { log } from "./logger.js";
import { getWalletHistory } from "./services/walletHistory.js";

export function createServer() {
  const app = express();
  
  app.use(cors());
  
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/data", (_req, res) => res.json(storage.get()));

  app.get("/api/items/:steamId", (req, res) => {
    const { steamId } = req.params;
    const state = storage.get();

    const user = state.users.find((u) => u.steamId === steamId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const availableItems = state.items.filter(
      (item) => item.ownerSteamId === steamId && !item.isClaimed
    );

    res.json({ items: availableItems });
  });

  app.get("/api/user/:walletAddress", (req, res) => {
    const { walletAddress } = req.params;
    const state = storage.get();

    const user = state.users.find(
      (u) => u.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!user) {
      return res.status(404).json({ error: "User not found for this wallet address" });
    }

    res.json({ steamId: user.steamId });
  });

  app.post("/api/claim/signature", async (req, res) => {
    const { steamId, itemId, walletAddress } = req.body;

    if (!steamId || !itemId || !walletAddress) {
      return res.status(400).json({
        error: "Missing required fields: steamId, itemId, walletAddress",
      });
    }

    const state = storage.get();
    const item = state.items.find((i) => i.classId === itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.ownerSteamId !== steamId) {
      return res
        .status(403)
        .json({ error: "Item doesn't belong to this user" });
    }

    if (item.isClaimed) {
      return res.status(400).json({ error: "Item already claimed" });
    }

    try {
      const signature = await generateClaimSignature(item);
      log.info("Signature generated", signature);
      return res.json({ signature });
    } catch (error) {
      return res.status(500).json({ error: "Failed to generate signature" });
    }
  });

  // === EPOCH HISTORY ENDPOINT ===

  /**
   * GET /api/history/wallet/:walletAddress
   * Returns the full history of all tokens across epochs
   */
  app.get("/api/history/wallet/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress || walletAddress.length < 10) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const history = await getWalletHistory(walletAddress);
      res.json(history);
    } catch (error: any) {
      log.error(`Error fetching wallet history: ${error.message}`);
      res.status(500).json({ error: "Failed to fetch wallet history" });
    }
  });

  // if you need to trigger the job manually:
  // app.post('/jobs/fetch', async (_req, res) => { await fetchExternalJob(); res.json({ ok: true }); });

  return app;
}
