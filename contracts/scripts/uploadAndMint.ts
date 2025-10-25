#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';
import { ethers } from 'ethers';

// Configuration
const PINATA_API_KEY = 'a4f817228bc75f6333ef';
const PINATA_SECRET_API_KEY = 'fbf3ba4cec1d0612fa94bbb6eff079a149bbc0958c4355f001fa2e0a79fec97b';
const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YjM0MzMyMS1hZTA1LTRmNGYtYjIzYi1hMmEzMzVlMWFiMmIiLCJlbWFpbCI6ImxlYmVkZXY2NjZlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhNGY4MTcyMjhiYzc1ZjYzMzNlZiIsInNjb3BlZEtleVNlY3JldCI6ImZiZjNiYTRjZWMxZDA2MTJmYTk0YmJiNmVmZjA3OWExNDliYmMwOTU4YzQzNTVmMDAxZmEyZTBhNzlmZWM5N2IiLCJleHAiOjE3OTI5NTM5ODF9.Yr1bn1PIREeD4XXrZQGrMUkbb8313xZnVUi0SlHfmfA';

const DEFAULT_RECIPIENT = '0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f';
const EPOCH = '4'; // Current epoch
const STEAM_ID_TEST = '76561198260012732'; // Steam ID for test.json items
const STEAM_ID_FRIEND = '76561199185854372'; // Steam ID for friend.json items

// Command line arguments
const args = process.argv.slice(2);
const recipient = args[0] || DEFAULT_RECIPIENT;
const privateKey = args[1]; // Optional: Private key for minting
const rpcUrl = args[2]; // Optional: RPC URL
const contractAddress = args[3]; // Optional: NFT contract address

interface Item {
  classid: string;
  tradable: number;
  name: string;
  type: string;
  icon_url: string;
  icon_url_large: string;
  descriptions: any[];
  tags: any[];
  _source?: 'test' | 'friend'; // Track source for steam_id assignment
  [key: string]: any;
}

interface TestData {
  descriptions: Item[];
}

/**
 * Upload JSON to Pinata IPFS
 */
async function uploadToPinata(jsonData: any, filename: string): Promise<string> {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  
  const data = {
    pinataContent: jsonData,
    pinataMetadata: {
      name: filename,
    },
    pinataOptions: {
      cidVersion: 1,
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
    });

    console.log(`✅ Uploaded ${filename}: ipfs://${response.data.IpfsHash}`);
    return response.data.IpfsHash;
  } catch (error: any) {
    console.error(`❌ Error uploading ${filename}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Create a folder structure on IPFS by uploading multiple files
 */
async function uploadFolderToPinata(items: Item[]): Promise<string> {
  console.log(`\n📦 Preparing to upload ${items.length} items to IPFS in folder structure...`);
  
  // Create a temporary directory structure
  const tempDir = path.join(process.cwd(), 'temp_ipfs_upload', EPOCH);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Write each item as a JSON file
  const uploadedItems: { classid: string; ipfsHash: string }[] = [];
  
  for (const item of items) {
    const filename = `${item.classid}.json`;
    const filepath = path.join(tempDir, filename);
    
    // Write JSON file
    fs.writeFileSync(filepath, JSON.stringify(item, null, 2));
    
    try {
      // Upload individual file
      const ipfsHash = await uploadToPinata(item, `${EPOCH}/${filename}`);
      uploadedItems.push({ classid: item.classid, ipfsHash });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to upload item ${item.classid}, skipping...`);
    }
  }

  // Clean up temp directory
  fs.rmSync(path.join(process.cwd(), 'temp_ipfs_upload'), { recursive: true, force: true });

  console.log(`\n✅ Successfully uploaded ${uploadedItems.length} items to IPFS`);
  
  // Now upload the folder structure using Pinata's directory upload
  return await uploadDirectoryStructure(items);
}

/**
 * Upload directory structure to Pinata
 */
async function uploadDirectoryStructure(items: Item[]): Promise<string> {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  
  // Create temporary directory structure
  const tempDir = path.join(process.cwd(), 'temp_ipfs_upload', EPOCH);
  if (fs.existsSync(path.join(process.cwd(), 'temp_ipfs_upload'))) {
    fs.rmSync(path.join(process.cwd(), 'temp_ipfs_upload'), { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  console.log(`\n📦 Creating folder structure in ${tempDir}...`);

  // Write files to disk with steam_id added
  for (const item of items) {
    const filename = `${item.classid}.json`;
    const filepath = path.join(tempDir, filename);
    
    // Add appropriate steam_id based on source
    const steamId = item._source === 'test' ? STEAM_ID_TEST : STEAM_ID_FRIEND;
    const { _source, ...itemWithoutSource } = item; // Remove _source field
    const itemWithSteamId = {
      ...itemWithoutSource,
      steam_id: steamId
    };
    
    fs.writeFileSync(filepath, JSON.stringify(itemWithSteamId, null, 2));
  }

  const formData = new FormData();
  
  // Add each file with proper directory structure
  for (const item of items) {
    const filename = `${item.classid}.json`;
    const filepath = path.join(tempDir, filename);
    const fileStream = fs.createReadStream(filepath);
    formData.append('file', fileStream, {
      filepath: `${EPOCH}/${filename}`,
    });
  }

  // Add metadata
  const metadata = JSON.stringify({
    name: `Epoch ${EPOCH} - NFT Metadata`,
    keyvalues: {
      epoch: EPOCH,
      itemCount: items.length.toString(),
    }
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 1,
    wrapWithDirectory: true,
  });
  formData.append('pinataOptions', options);

  try {
    console.log(`   Uploading to IPFS...`);
    const response = await axios.post(url, formData, {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
    });

    const ipfsHash = response.data.IpfsHash;
    const baseUri = `ipfs://${ipfsHash}/${EPOCH}/`;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}/${EPOCH}/`;
    
    console.log(`\n✅ Uploaded folder structure to IPFS: ipfs://${ipfsHash}`);
    console.log(`   Base URI for epoch ${EPOCH}: ${baseUri}`);
    console.log(`   Gateway URL: ${gatewayUrl}`);
    
    // Clean up temp directory
    fs.rmSync(path.join(process.cwd(), 'temp_ipfs_upload'), { recursive: true, force: true });
    
    return ipfsHash;
  } catch (error: any) {
    console.error('❌ Error uploading folder structure:', error.response?.data || error.message);
    // Clean up temp directory on error
    if (fs.existsSync(path.join(process.cwd(), 'temp_ipfs_upload'))) {
      fs.rmSync(path.join(process.cwd(), 'temp_ipfs_upload'), { recursive: true, force: true });
    }
    throw error;
  }
}

/**
 * Mint NFTs on the contract
 */
async function mintNFTs(items: Item[], baseUri: string) {
  if (!privateKey || !rpcUrl || !contractAddress) {
    console.log('\n⚠️  Skipping minting: Missing privateKey, rpcUrl, or contractAddress');
    console.log('   To enable minting, run:');
    console.log('   ts-node scripts/uploadAndMint.ts <recipient> <privateKey> <rpcUrl> <contractAddress>');
    return;
  }

  console.log('\n🔨 Starting NFT minting process...');
  console.log(`   Contract: ${contractAddress}`);
  console.log(`   Recipient: ${recipient}`);
  console.log(`   Items to mint: ${items.length}`);

  // Connect to blockchain
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Contract ABI (only the functions we need)
  const contractABI = [
    'function mint(address to, uint256 tokenId) external',
    'function batchMint(address[] calldata to, uint256[] calldata tokenIds) external',
  ];

  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  try {
    // Prepare batch mint data
    const recipients = items.map(() => recipient);
    const tokenIds = items.map(item => item.classid);

    console.log(`\n📝 Batch minting ${tokenIds.length} NFTs...`);
    
    // Execute batch mint
    const tx = await contract.batchMint(recipients, tokenIds);
    console.log(`   Transaction sent: ${tx.hash}`);
    
    console.log('   Waiting for confirmation...');
    const receipt = await tx.wait();
    
    console.log(`✅ Minting complete! Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`   Transaction: ${receipt.hash}`);
  } catch (error: any) {
    console.error('❌ Error minting NFTs:', error.message);
    if (error.data) {
      console.error('   Error data:', error.data);
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting IPFS Upload and NFT Minting Script\n');
  console.log(`   Epoch: ${EPOCH}`);
  console.log(`   Steam ID (test.json): ${STEAM_ID_TEST}`);
  console.log(`   Steam ID (friend.json): ${STEAM_ID_FRIEND}`);
  console.log(`   Recipient: ${recipient}`);
  console.log(`   Minting: ${privateKey ? 'ENABLED' : 'DISABLED'}\n`);

  // Read test.json
  const testJsonPath = path.join(process.cwd(), 'test.json');
  const friendJsonPath = path.join(process.cwd(), 'friend.json');
  
  let allTradableItems: Item[] = [];

  // Read and process test.json
  if (fs.existsSync(testJsonPath)) {
    console.log('📖 Reading test.json...');
    const testRawData = fs.readFileSync(testJsonPath, 'utf-8');
    const testData: TestData = JSON.parse(testRawData);
    const testTradableItems = testData.descriptions
      .filter(item => item.tradable === 1)
      .map(item => ({ ...item, _source: 'test' as const }));
    console.log(`   Total items in test.json: ${testData.descriptions.length}`);
    console.log(`   Tradable items from test.json: ${testTradableItems.length}`);
    allTradableItems.push(...testTradableItems);
  } else {
    console.log('⚠️  test.json not found, skipping...');
  }

  // Read and process friend.json
  if (fs.existsSync(friendJsonPath)) {
    console.log('📖 Reading friend.json...');
    const friendRawData = fs.readFileSync(friendJsonPath, 'utf-8');
    const friendData: TestData = JSON.parse(friendRawData);
    const friendTradableItems = friendData.descriptions
      .filter(item => item.tradable === 1)
      .map(item => ({ ...item, _source: 'friend' as const }));
    console.log(`   Total items in friend.json: ${friendData.descriptions.length}`);
    console.log(`   Tradable items from friend.json: ${friendTradableItems.length}`);
    allTradableItems.push(...friendTradableItems);
  } else {
    console.log('⚠️  friend.json not found, skipping...');
  }

  // Check for duplicate classids
  const classIds = new Set<string>();
  const uniqueTradableItems: Item[] = [];
  let duplicateCount = 0;
  
  for (const item of allTradableItems) {
    if (!classIds.has(item.classid)) {
      classIds.add(item.classid);
      uniqueTradableItems.push(item);
    } else {
      duplicateCount++;
    }
  }

  const tradableItems = uniqueTradableItems;
  
  console.log(`\n📊 Combined statistics:`);
  console.log(`   Total tradable items: ${allTradableItems.length}`);
  console.log(`   Duplicate classids removed: ${duplicateCount}`);
  console.log(`   Unique tradable items: ${tradableItems.length}`);

  if (tradableItems.length === 0) {
    console.log('\n⚠️  No tradable items found. Exiting.');
    process.exit(0);
  }

  // Display sample items
  console.log('\n📋 Sample tradable items:');
  tradableItems.slice(0, 5).forEach((item, idx) => {
    console.log(`   ${idx + 1}. ClassID: ${item.classid} - ${item.name}`);
  });
  if (tradableItems.length > 5) {
    console.log(`   ... and ${tradableItems.length - 5} more`);
  }

  // Upload to IPFS
  try {
    const ipfsHash = await uploadDirectoryStructure(tradableItems);
    const baseUri = `ipfs://${ipfsHash}/${EPOCH}/`;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}/${EPOCH}/`;
    
    console.log('\n📊 Upload Summary:');
    console.log(`   IPFS Hash: ${ipfsHash}`);
    console.log(`   Base URI (ipfs://): ${baseUri}`);
    console.log(`   Base URI (gateway): ${gatewayUrl}`);
    console.log(`   Items uploaded: ${tradableItems.length}`);
    console.log(`   Token IDs: ${tradableItems.map(i => i.classid).join(', ')}`);

    // Mint NFTs if credentials provided
    await mintNFTs(tradableItems, baseUri);

    console.log('\n✨ Script completed successfully!');
    console.log('\n📝 Next steps:');
    console.log(`   1. Call commitEpoch on LoreEpochRegistry with:`);
    console.log(`      - newBaseUriEpoch: ${gatewayUrl}`);
    console.log(`      - batchFromTokenId: ${Math.min(...tradableItems.map(i => Number(i.classid)))}`);
    console.log(`      - batchToTokenId: ${Math.max(...tradableItems.map(i => Number(i.classid)))}`);
    console.log(`   2. Verify metadata at: ${gatewayUrl}${tradableItems[0].classid}.json`);
    
  } catch (error) {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  }
}

// Run main function
main().catch(console.error);

