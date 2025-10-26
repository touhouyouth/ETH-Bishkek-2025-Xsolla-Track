#!/usr/bin/env tsx
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

async function main() {
  console.log('📊 Preview of test.json data\n');

  const testDataPath = path.join(process.cwd(), 'test.json');
  
  if (!fs.existsSync(testDataPath)) {
    console.error('❌ test.json not found!');
    process.exit(1);
  }

  console.log('📖 Reading test.json...');
  const rawData = fs.readFileSync(testDataPath, 'utf-8');
  const testData: TestData = JSON.parse(rawData);

  console.log(`   Total items in descriptions: ${testData.descriptions.length}`);
  
  const tradableItems = testData.descriptions.filter(item => item.tradable === 1);
  const nonTradableItems = testData.descriptions.filter(item => item.tradable === 0);
  
  console.log(`   Tradable items (tradable === 1): ${tradableItems.length}`);
  console.log(`   Non-tradable items (tradable === 0): ${nonTradableItems.length}`);

  if (tradableItems.length > 0) {
    console.log('\n📋 First 10 tradable items:');
    tradableItems.slice(0, 10).forEach((item, idx) => {
      console.log(`   ${idx + 1}. ClassID: ${item.classid} - ${item.name} (${item.type})`);
    });
    
    if (tradableItems.length > 10) {
      console.log(`   ... and ${tradableItems.length - 10} more`);
    }

    console.log('\n📝 Sample JSON structure for first item:');
    console.log(JSON.stringify(tradableItems[0], null, 2).substring(0, 500) + '...');
  } else {
    console.log('\n⚠️  No tradable items found!');
  }

  console.log('\n✅ Preview complete!');
}

main().catch(console.error);


