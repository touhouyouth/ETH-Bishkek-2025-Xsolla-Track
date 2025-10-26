import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { xsollaZKSync } from "../config.js";
import { log } from "../logger.js";
import { storage } from "./storage.js";

const PINATA_JWT = process.env.PINATA_JWT ?? "";
const EPOCH_REGISTRY_ADDRESS = process.env
  .EPOCH_REGISTRY_ADDRESS as `0x${string}`;
const GAME_ROLE_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY as `0x${string}`;

if (!PINATA_JWT) {
  throw new Error("PINATA_JWT not set");
}
if (!EPOCH_REGISTRY_ADDRESS) {
  throw new Error("EPOCH_REGISTRY_ADDRESS not set");
}
if (!GAME_ROLE_PRIVATE_KEY) {
  throw new Error("GAME_ROLE_PRIVATE_KEY not set");
}

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
  {
    inputs: [
      { name: "root", type: "bytes32" },
      { name: "newBaseUriEpoch", type: "string" },
      { name: "fromTs", type: "uint64" },
      { name: "toTs", type: "uint64" },
      { name: "batchFromTokenId", type: "uint256" },
      { name: "batchToTokenId", type: "uint256" },
    ],
    name: "commitEpoch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const publicClient = createPublicClient({
  chain: xsollaZKSync,
  transport: http(),
});

const account = privateKeyToAccount(GAME_ROLE_PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: xsollaZKSync,
  transport: http(),
});

interface IpfsItemMetadata {
  classid: string;
  steam_id: string;
  tradable: number;
  name: string;
  type: string;
  icon_url: string;
  icon_url_large: string;
  descriptions: any[];
  tags: any[];
  _source?: "test" | "friend"; // Track source for steam_id assignment
  [key: string]: any;
}

async function getCurrentEpochId(): Promise<bigint> {
  const epochId = await publicClient.readContract({
    address: EPOCH_REGISTRY_ADDRESS,
    abi: EPOCH_REGISTRY_ABI,
    functionName: "currentEpoch",
  });
  return epochId;
}

async function getEpochData(epochId: bigint) {
  const [root, fromTs, toTs, baseUri] = await publicClient.readContract({
    address: EPOCH_REGISTRY_ADDRESS,
    abi: EPOCH_REGISTRY_ABI,
    functionName: "epochs",
    args: [epochId],
  });
  return { root, fromTs, toTs, baseUri };
}

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

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
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
          `Retry attempt ${
            attempt + 1
          }/${maxRetries} after ${delay}ms (error: ${error.message})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

async function downloadItemFromIpfs(
  cid: string,
  epochPath: string,
  classId: string
): Promise<IpfsItemMetadata | null> {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}/${epochPath}/${classId}.json`;
  log.info(`Downloading item from IPFS: ${url}`);
  try {
    const response = await retryWithBackoff(
      () =>
        axios.get(url, {
          headers: {
            "x-pinata-gateway-token": PINATA_JWT,
          },
          timeout: 10000,
        }),
      3,
      1000
    );
    return response.data;
  } catch (error: any) {
    log.error(
      `Failed to download item ${classId} from IPFS after retries: ${error.message}`
    );
    return null;
  }
}

async function getAllFilesInEpoch(
  cid: string,
  epochPath: string
): Promise<string[]> {
  log.info(`Fetching files for CID ${cid} from IPFS gateway...`);

  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}/${epochPath}/`;
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        Accept: "text/html",
      },
    });

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

    log.info(`Found ${uniqueClassIds.length} JSON files`);
    return uniqueClassIds;
  } catch (error: any) {
    log.error(`Failed to get directory listing: ${error.message}`);
    throw new Error(
      `Cannot get file list from IPFS directory: ${error.message}`
    );
  }
}

async function downloadAllItemsFromCurrentEpoch(
  epochId: bigint
): Promise<Map<string, IpfsItemMetadata>> {
  log.info(`📥 Downloading ALL items from epoch ${epochId}...`);

  const { baseUri } = await getEpochData(epochId);
  const { cid, epochPath } = parseIpfsUri(baseUri);

  const allClassIds = await getAllFilesInEpoch(cid, epochPath);

  log.info(`Found ${allClassIds.length} total items in epoch ${epochId}`);

  const itemsMap = new Map<string, IpfsItemMetadata>();

  const downloadPromises = allClassIds.map(async (classId) => {
    const metadata = await downloadItemFromIpfs(cid, epochPath, classId);
    if (metadata) {
      itemsMap.set(classId, metadata);
      log.info(
        `✓ Downloaded ${classId} (${itemsMap.size}/${allClassIds.length}) (owner: ${metadata.steam_id})`
      );
    }
  });

  await Promise.all(downloadPromises);

  log.info(`✅ Downloaded ${itemsMap.size} items from epoch ${epochId}`);

  if (itemsMap.size !== allClassIds.length) {
    log.warn(
      `⚠️ Warning: Expected ${allClassIds.length} items but only downloaded ${itemsMap.size}`
    );
  }

  return itemsMap;
}

async function uploadEpochToIpfs(
  items: Map<string, IpfsItemMetadata>,
  newEpochId: number
): Promise<string> {
  log.info(`Uploading epoch ${newEpochId} to IPFS...`);

  const tempDir = path.join(
    process.cwd(),
    "temp_epoch_upload",
    newEpochId.toString()
  );

  try {
    if (fs.existsSync(path.dirname(tempDir))) {
      fs.rmSync(path.dirname(tempDir), { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    for (const [classId, metadata] of items) {
      const filepath = path.join(tempDir, `${classId}.json`);
      fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2));
    }

    const formData = new FormData();

    for (const [classId] of items) {
      const filepath = path.join(tempDir, `${classId}.json`);
      const fileStream = fs.createReadStream(filepath);
      formData.append("file", fileStream, {
        filepath: `${newEpochId}/${classId}.json`,
      });
    }

    const metadata = JSON.stringify({
      name: `Epoch ${newEpochId} - NFT Metadata`,
      keyvalues: {
        epoch: newEpochId.toString(),
        itemCount: items.size.toString(),
      },
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 1,
      wrapWithDirectory: true,
    });
    formData.append("pinataOptions", options);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    const baseUri = `ipfs://${ipfsHash}/${newEpochId}/`;

    log.info(`✅ Uploaded epoch ${newEpochId} to IPFS: ${baseUri}`);

    fs.rmSync(path.dirname(tempDir), { recursive: true, force: true });

    return ipfsHash;
  } catch (error: any) {
    log.error(`Failed to upload epoch to IPFS: ${error.message}`);

    if (fs.existsSync(path.dirname(tempDir))) {
      fs.rmSync(path.dirname(tempDir), { recursive: true, force: true });
    }

    throw error;
  }
}

function computeEpochRoot(items: Map<string, IpfsItemMetadata>): `0x${string}` {
  const itemsArray = Array.from(items.values());
  const dataString = JSON.stringify(itemsArray);

  const hash = Buffer.from(dataString).toString("hex");
  const paddedHash = hash.padEnd(64, "0").slice(0, 64);

  return `0x${paddedHash}` as `0x${string}`;
}

async function commitEpochToContract(
  root: `0x${string}`,
  baseUri: string,
  fromTs: bigint,
  toTs: bigint
) {
  log.info("Committing epoch to contract...");

  const state = storage.get();
  const classIds = state.items.map((item) => BigInt(item.classId));
  const batchFromTokenId =
    classIds.length > 0 ? classIds.reduce((a, b) => (a < b ? a : b)) : 0n;
  const batchToTokenId =
    classIds.length > 0 ? classIds.reduce((a, b) => (a > b ? a : b)) : 0n;

  try {
    const hash = await walletClient.writeContract({
      address: EPOCH_REGISTRY_ADDRESS,
      abi: EPOCH_REGISTRY_ABI,
      functionName: "commitEpoch",
      args: [root, baseUri, fromTs, toTs, batchFromTokenId, batchToTokenId],
    });

    log.info(`✅ Epoch committed! Transaction hash: ${hash}`);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    log.info(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

    return receipt;
  } catch (error: any) {
    log.error(`Failed to commit epoch: ${error.message}`);
    throw error;
  }
}

export async function createNewEpochForTrade(tradedClassId: string) {
  log.info(`🔄 Starting epoch creation for traded item: ${tradedClassId}`);

  try {
    const currentEpochId = await getCurrentEpochId();
    log.info(`Current epoch ID: ${currentEpochId}`);

    const currentItems = await downloadAllItemsFromCurrentEpoch(currentEpochId);

    const state = storage.get();
    const tradedItem = state.items.find(
      (item) => item.classId === tradedClassId
    );

    if (!tradedItem) {
      throw new Error(`Traded item ${tradedClassId} not found in storage`);
    }

    const currentMetadata = currentItems.get(tradedClassId);
    if (!currentMetadata) {
      throw new Error(
        `Metadata for traded item ${tradedClassId} not found in IPFS`
      );
    }

    currentMetadata.steam_id = tradedItem.ownerSteamId;
    currentItems.set(tradedClassId, currentMetadata);

    log.info(
      `Updated item ${tradedClassId} steam_id to ${tradedItem.ownerSteamId}`
    );

    log.info(`Current items: ${JSON.stringify(currentItems)}`);

    const newEpochId = Number(currentEpochId) + 1;
    const ipfsHash = await uploadEpochToIpfs(currentItems, newEpochId);
    const newBaseUri = `https://gateway.pinata.cloud/ipfs/${ipfsHash}/${newEpochId}/`;

    const root = computeEpochRoot(currentItems);

    const currentTime = BigInt(Math.floor(Date.now() / 1000));

    await commitEpochToContract(
      root,
      newBaseUri,
      currentTime,
      currentTime + 1n
    );

    log.info(`✅ Successfully created epoch ${newEpochId} for trade!`);

    return {
      epochId: newEpochId,
      baseUri: newBaseUri,
      tradedItem: tradedClassId,
    };
  } catch (error: any) {
    log.error(`❌ Failed to create new epoch: ${error.message}`);
    throw error;
  }
}

export async function initializeEpochService() {
  try {
    const currentEpochId = await getCurrentEpochId();
    log.info(`Epoch service initialized. Current epoch: ${currentEpochId}`);
  } catch (error: any) {
    log.error(`Failed to initialize epoch service: ${error.message}`);
  }
}
