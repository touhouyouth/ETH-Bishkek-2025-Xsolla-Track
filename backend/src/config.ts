import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  cron: {
    fetch: "*/10 * * * * *",
    ipfs: "0 */1 * * *",
  },
  externalApi: {
    baseURL: process.env.EXTERNAL_API_BASE!,
    apiKey: process.env.EXTERNAL_API_KEY!,
  },
  ipfs: {
    gateway: process.env.IPFS_GATEWAY ?? "https://ipfs.io",
  },
};
