#!/usr/bin/env tsx
import { ethers } from 'ethers';

// Parse arguments
const args = process.argv.slice(2);
const tokenId = args[0] || '2704470580';
const epoch1 = args[1] || '5';
const epoch2 = args[2] || '6';
const rpcUrl = args[3] || 'https://zkrpc-sepolia.xsollazk.com';
const registryAddress = args[4] || '0xC2259646b5e2b4b6da3e970965B83513f9Ca61B0';

async function fetchEpochData(registry: any, epochId: string) {
  try {
    const epochData = await registry.epochs(epochId);
    return {
      exists: true,
      root: epochData.root,
      fromTs: epochData.fromTs,
      toTs: epochData.toTs,
      baseUri: epochData.baseUri,
    };
  } catch (error: any) {
    return {
      exists: false,
      error: error.message,
    };
  }
}

async function fetchMetadata(uri: string) {
  try {
    // Convert IPFS URIs to gateway URLs
    const gatewayUri = uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    const response = await fetch(gatewayUri);
    
    if (response.ok) {
      const metadata = await response.json();
      return {
        success: true,
        data: metadata,
      };
    } else {
      return {
        success: false,
        error: `${response.status} ${response.statusText}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function main() {
  console.log('🔍 Universal Epoch Comparison Tool\n');
  console.log(`Token ID: ${tokenId}`);
  console.log(`Comparing Epochs: ${epoch1} vs ${epoch2}\n`);

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const registryABI = [
      'function currentEpoch() external view returns (uint256)',
      'function epochs(uint64 epochId) external view returns (bytes32 root, uint64 fromTs, uint64 toTs, string memory baseUri)',
    ];

    const registry = new ethers.Contract(registryAddress, registryABI, provider);

    // Get current epoch
    const currentEpoch = await registry.currentEpoch();
    console.log(`📊 Current Epoch: ${currentEpoch}\n`);

    // Process both epochs
    const epochs = [epoch1, epoch2];
    
    for (const epochId of epochs) {
      console.log(`${'='.repeat(70)}`);
      console.log(`📦 Epoch ${epochId}${currentEpoch.toString() === epochId ? ' (CURRENT)' : ''}`);
      console.log(`${'='.repeat(70)}`);

      const epochData = await fetchEpochData(registry, epochId);

      if (!epochData.exists) {
        console.log(`   ⚠️  Epoch ${epochId} does not exist or error occurred`);
        console.log(`   Error: ${epochData.error}\n`);
        continue;
      }

      // Display epoch info
      console.log(`   Root: ${epochData.root}`);
      console.log(`   From: ${epochData.fromTs} (${new Date(Number(epochData.fromTs) * 1000).toISOString()})`);
      console.log(`   To: ${epochData.toTs} (${new Date(Number(epochData.toTs) * 1000).toISOString()})`);
      console.log(`   Base URI: ${epochData.baseUri}`);

      // Construct token URI
      const tokenUri = `${epochData.baseUri}${tokenId}.json`;
      const gatewayUri = tokenUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
      
      console.log(`\n   🔗 Token URI:`);
      if (epochData.baseUri.startsWith('ipfs://')) {
        console.log(`      IPFS: ${tokenUri}`);
        console.log(`      Gateway: ${gatewayUri}`);
      } else {
        console.log(`      ${tokenUri}`);
      }

      // Fetch metadata
      console.log(`\n   📥 Fetching metadata...`);
      const metadata = await fetchMetadata(tokenUri);

      if (metadata.success) {
        console.log('   ✅ Metadata found:');
        const data = metadata.data;
        if (data.name) console.log(`      Name: ${data.name}`);
        if (data.type) console.log(`      Type: ${data.type}`);
        if (data.steam_id) console.log(`      Steam ID: ${data.steam_id}`);
        if (data.classid) console.log(`      Class ID: ${data.classid}`);
        if (data.tradable !== undefined) console.log(`      Tradable: ${data.tradable}`);
      } else {
        console.log(`   ❌ Failed to fetch metadata: ${metadata.error}`);
      }

      console.log('');
    }

    console.log(`${'='.repeat(70)}`);
    console.log('✅ Comparison completed!\n');
    
    console.log('💡 Usage:');
    console.log('   npx tsx scripts/compareEpochs.ts <tokenId> <epoch1> <epoch2> [rpcUrl] [registryAddress]');
    console.log('\nExamples:');
    console.log('   npx tsx scripts/compareEpochs.ts 2704470580 5 6');
    console.log('   npx tsx scripts/compareEpochs.ts 5224599512 6 7');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.reason) {
      console.error('   Reason:', error.reason);
    }
    process.exit(1);
  }
}

main().catch(console.error);
