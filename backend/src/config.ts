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

const PINATA_JWT = process.env.PINATA_JWT ?? "";
const EPOCH_REGISTRY_ADDRESS = process.env
  .EPOCH_REGISTRY_ADDRESS as `0x${string}`;
const GAME_ROLE_PRIVATE_KEY = process.env
  .GAME_ROLE_PRIVATE_KEY as `0x${string}`;
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY as `0x${string}`;

if (!PINATA_JWT) {
  throw new Error("PINATA_JWT not set");
}
if (!EPOCH_REGISTRY_ADDRESS) {
  throw new Error("EPOCH_REGISTRY_ADDRESS not set");
}
// if (!GAME_ROLE_PRIVATE_KEY) {
//   throw new Error("GAME_ROLE_PRIVATE_KEY not set");
// }
if (!SIGNER_PRIVATE_KEY) {
  throw new Error("SIGNER_PRIVATE_KEY not set");
}

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
  pinataJwt: PINATA_JWT,
  epochRegistryAddress: EPOCH_REGISTRY_ADDRESS,
  // gameRolePrivateKey: GAME_ROLE_PRIVATE_KEY,
  signerPrivateKey: SIGNER_PRIVATE_KEY,
};
