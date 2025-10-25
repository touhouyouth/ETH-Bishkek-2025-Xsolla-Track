#!/usr/bin/env tsx
/**
 * Script to filter out items containing "сокровищница" or "загрузочный экран" from friend.json
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

interface FriendData {
  descriptions: Item[];
}

async function main() {
  console.log('🔍 Filtering friend.json...\n');

  const friendJsonPath = path.join(process.cwd(), 'friend.json');
  
  if (!fs.existsSync(friendJsonPath)) {
    console.error('❌ friend.json not found!');
    process.exit(1);
  }

  console.log('📖 Reading friend.json...');
  const rawData = fs.readFileSync(friendJsonPath, 'utf-8');
  const friendData: FriendData = JSON.parse(rawData);

  console.log(`   ✅ Successfully parsed JSON`);
  console.log(`   Total items before filtering: ${friendData.descriptions.length}`);

  // Filter out items containing treasury/treasure or loading screen keywords (Russian and English)
  const originalCount = friendData.descriptions.length;
  const keywords = [
    'сокровищница',
    'загрузочный экран',
    'treasure chest',
    'loading screen'
  ];
  
  const filteredDescriptions = friendData.descriptions.filter(item => {
    const itemJson = JSON.stringify(item).toLowerCase();
    return !keywords.some(keyword => itemJson.includes(keyword.toLowerCase()));
  });

  const removedCount = originalCount - filteredDescriptions.length;
  console.log(`   Removed items: ${removedCount}`);
  console.log(`   Remaining items: ${filteredDescriptions.length}`);

  // Show removed items
  if (removedCount > 0) {
    console.log('\n🗑️  Removed items:');
    friendData.descriptions.forEach((item, idx) => {
      const itemJson = JSON.stringify(item).toLowerCase();
      if (keywords.some(keyword => itemJson.includes(keyword.toLowerCase()))) {
        console.log(`   - ${item.name} (ClassID: ${item.classid})`);
      }
    });
  }

  // Save filtered data
  const filteredData = {
    ...friendData,
    descriptions: filteredDescriptions
  };

  const outputPath = path.join(process.cwd(), 'friend.json');
  console.log('\n💾 Saving filtered data...');
  fs.writeFileSync(outputPath, JSON.stringify(filteredData, null, 2), 'utf-8');
  console.log(`   ✅ Saved to ${outputPath}`);

  console.log('\n✅ Filtering complete!');
  console.log(`   Original: ${originalCount} items`);
  console.log(`   Filtered: ${filteredDescriptions.length} items`);
  console.log(`   Removed: ${removedCount} items`);
}

main().catch(console.error);

