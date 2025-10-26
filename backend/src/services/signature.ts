import type { Item } from "../types.js";
import { http, createWalletClient } from "viem";
import type { TypedDataDomain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { storage } from "./storage.js";
import { config, xsollaZKSync } from "../config.js";

const account = privateKeyToAccount(config.signerPrivateKey);

const walletClient = createWalletClient({
  account,
  chain: xsollaZKSync,
  transport: http(),
});

export async function generateClaimSignature(item: Item) {
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

  const owner = storage
    .get()
    .users.find((u) => u.steamId === item.ownerSteamId);

  if (!item.oldOwnerSteamId) {
    throw new Error("Old owner not found");
  }

  const oldOwner = storage
    .get()
    .users.find((u) => u.steamId === item.oldOwnerSteamId);

  const domain: TypedDataDomain = {
    name: "Lore Game Assets",
    version: "1.0",
    chainId: xsollaZKSync.id,
    verifyingContract: config.contractAddress as `0x${string}`,
  };

  const types = {
    Transfer: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const nonce =
    BigInt(Date.now()) * 1000000n + BigInt(Math.floor(Math.random() * 1000000));

  const transferData = {
    to: owner?.walletAddress as `0x${string}`,
    from: oldOwner?.walletAddress as `0x${string}`,
    tokenId: item.classId,
    nonce,
    deadline: BigInt(deadline),
  };

  const signature = await walletClient.signTypedData({
    domain,
    types,
    primaryType: "Transfer",
    message: transferData,
  });

  const response = {
    contractAddress: config.contractAddress,
    transferData: {
      ...transferData,
      nonce: transferData.nonce.toString(),
      deadline: transferData.deadline.toString(),
    },
    signature,
  };

  return response;
}
