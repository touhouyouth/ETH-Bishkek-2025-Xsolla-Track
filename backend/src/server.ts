import express from "express";
import { storage } from "./services/storage.js";

export function createServer() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/data", (_req, res) => res.json(storage.get()));

  // if you need to trigger the job manually:
  // app.post('/jobs/fetch', async (_req, res) => { await fetchExternalJob(); res.json({ ok: true }); });

  return app;
}
