import "dotenv/config";
import { defineChain } from "viem";

export const xsollaZKSync = defineChain({
  id: 555776,
  name: "Xsolla ZK Sepolia Testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: {
    default: { http: ["https://zkrpc-sepolia.xsollazk.com"] },
    public: { http: ["https://zkrpc-sepolia.xsollazk.com"] },
  },
});

export const config = {
  port: Number(process.env.PORT ?? 3000),
  cron: {
    fetch: "*/10 * * * * *",
    ipfs: "*/10 * * * * *",
  },
  externalApi: {
    baseURL: process.env.EXTERNAL_API_BASE!,
    apiKey: process.env.EXTERNAL_API_KEY!,
  },
  ipfs: {
    gateway: process.env.IPFS_GATEWAY ?? "https://ipfs.io",
  },
  contractAddress:
    process.env.CONTRACT_ADDRESS ??
    "0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C",
};
