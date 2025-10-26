#!/usr/bin/env tsx
/**
 * Test script to verify upload functionality without actually uploading
 */
import fs from 'fs';
import path from 'path';

interface Item {
  classid: string;
  tradable: number;
  name: string;
  type: string;
  [key: string]: any;
}

interface TestData {
  descriptions: Item[];
}

const EPOCH = '0';
const DEFAULT_RECIPIENT = '0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f';

async function main() {
  console.log('🧪 Testing upload script (DRY RUN - no actual upload)\n');
  console.log(`   Epoch: ${EPOCH}`);
  console.log(`   Default Recipient: ${DEFAULT_RECIPIENT}\n`);

  // Read friend.json
  const testDataPath = path.join(process.cwd(), 'friend.json');
  
  if (!fs.existsSync(testDataPath)) {
    console.error('❌ friend.json not found!');
    process.exit(1);
  }

  console.log('📖 Reading friend.json...');
  const rawData = fs.readFileSync(testDataPath, 'utf-8');
  const testData: TestData = JSON.parse(rawData);

  console.log(`   ✅ Successfully parsed JSON`);
  console.log(`   Total items: ${testData.descriptions.length}`);

  // Filter tradable items
  const tradableItems = testData.descriptions.filter(item => item.tradable === 1);
  console.log(`   Tradable items: ${tradableItems.length}\n`);

  if (tradableItems.length === 0) {
    console.log('⚠️  No tradable items found!');
    process.exit(0);
  }

  // Show what would be uploaded
  console.log('📦 Items that would be uploaded:\n');
  tradableItems.forEach((item, idx) => {
    console.log(`   ${idx + 1}. ClassID: ${item.classid}`);
    console.log(`      Name: ${item.name}`);
    console.log(`      Type: ${item.type}`);
    console.log(`      Target path: ${EPOCH}/${item.classid}.json`);
    console.log(`      JSON size: ${JSON.stringify(item).length} bytes\n`);
  });

  // Calculate total size
  const totalSize = tradableItems.reduce((acc, item) => acc + JSON.stringify(item).length, 0);
  console.log(`📊 Upload Summary:`);
  console.log(`   Total items: ${tradableItems.length}`);
  console.log(`   Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   Average size per item: ${(totalSize / tradableItems.length / 1024).toFixed(2)} KB`);

  // Simulate structure
  console.log(`\n📁 Directory structure that would be created:`);
  console.log(`   /${EPOCH}/`);
  tradableItems.forEach(item => {
    console.log(`   ├── ${item.classid}.json`);
  });

  // Token IDs that would be minted
  console.log(`\n🔨 NFT Minting (if enabled):`);
  console.log(`   Recipient: ${DEFAULT_RECIPIENT}`);
  console.log(`   Token IDs to mint:`);
  tradableItems.forEach((item, idx) => {
    console.log(`      ${idx + 1}. TokenID: ${item.classid} (${item.name})`);
  });

  console.log(`\n✅ Test complete! Everything looks good.`);
  console.log(`\n📝 To actually upload, run:`);
  console.log(`   npm run upload`);
}

main().catch(console.error);


