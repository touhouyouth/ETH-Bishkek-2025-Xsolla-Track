#!/usr/bin/env tsx
import { ethers } from 'ethers';

// Command line arguments
const args = process.argv.slice(2);

const newBaseUriEpoch = args[0]; // Gateway URL
const batchFromTokenId = args[1]; // Min tokenId
const batchToTokenId = args[2]; // Max tokenId
const privateKey = args[3]; // Private key
const rpcUrl = args[4] || 'https://zkrpc-sepolia.xsollazk.com';
const registryAddress = args[5] || '0xC2259646b5e2b4b6da3e970965B83513f9Ca61B0'; // Actual LoreEpochRegistry

/**
 * Generate random bytes32 for root
 */
function generateRandomRoot(): string {
  return ethers.hexlify(ethers.randomBytes(32));
}

/**
 * Generate timestamps (from: 1 minute ago, to: now)
 */
function generateTimestamps(): { fromTs: number; toTs: number } {
  const now = Math.floor(Date.now() / 1000);
  const fromTs = now - 60; // 1 minute ago
  const toTs = now; // now
  return { fromTs, toTs };
}

async function main() {
  console.log('🚀 CommitEpoch Script for LoreEpochRegistry\n');

  // Validate arguments
  if (!newBaseUriEpoch || !batchFromTokenId || !batchToTokenId || !privateKey) {
    console.error('❌ Missing required arguments!');
    console.log('\nUsage:');
    console.log('  npx tsx scripts/commitEpoch.ts <newBaseUriEpoch> <batchFromTokenId> <batchToTokenId> <privateKey> [rpcUrl] [registryAddress]');
    console.log('\nExample:');
    console.log('  npx tsx scripts/commitEpoch.ts \\');
    console.log('    "https://gateway.pinata.cloud/ipfs/QmXXX/0/" \\');
    console.log('    2704470580 \\');
    console.log('    5224599512 \\');
    console.log('    0xYOUR_PRIVATE_KEY');
    process.exit(1);
  }

  // Generate random root and timestamps
  const root = generateRandomRoot();
  const { fromTs, toTs } = generateTimestamps();

  console.log('📋 Parameters:');
  console.log(`   Registry Address: ${registryAddress}`);
  console.log(`   RPC URL: ${rpcUrl}`);
  console.log(`   Root (random): ${root}`);
  console.log(`   Base URI: ${newBaseUriEpoch}`);
  console.log(`   From Timestamp: ${fromTs} (${new Date(fromTs * 1000).toISOString()})`);
  console.log(`   To Timestamp: ${toTs} (${new Date(toTs * 1000).toISOString()})`);
  console.log(`   Batch From TokenId: ${batchFromTokenId}`);
  console.log(`   Batch To TokenId: ${batchToTokenId}`);
  console.log('');

  try {
    // Connect to blockchain
    console.log('🔗 Connecting to blockchain...');
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`   Wallet address: ${wallet.address}`);

    // Contract ABI (only commitEpoch function)
    const contractABI = [
      'function commitEpoch(bytes32 root, string calldata newBaseUriEpoch, uint64 fromTs, uint64 toTs, uint256 batchFromTokenId, uint256 batchToTokenId) external',
      'function currentEpoch() external view returns (uint256)',
      'function epochs(uint64 epochId) external view returns (bytes32 root, uint64 fromTs, uint64 toTs, string memory baseUri)',
    ];

    const contract = new ethers.Contract(registryAddress, contractABI, wallet);

    // Check current epoch
    const currentEpoch = await contract.currentEpoch();
    console.log(`   Current epoch: ${currentEpoch}`);
    
    // If there's a previous epoch, check its toTs
    let adjustedFromTs = fromTs;
    let adjustedToTs = toTs;
    
    if (currentEpoch > 0) {
      const prevEpoch = await contract.epochs(currentEpoch);
      console.log(`   Previous epoch toTs: ${prevEpoch.toTs} (${new Date(Number(prevEpoch.toTs) * 1000).toISOString()})`);
      
      // Make sure fromTs is greater than prev.toTs
      const prevToTs = Number(prevEpoch.toTs);
      const now = Math.floor(Date.now() / 1000);
      
      if (prevToTs >= adjustedFromTs) {
        adjustedFromTs = prevToTs + 1;
        adjustedToTs = now;
        console.log(`   ⚠️  Adjusted timestamps to avoid overlap:`);
        console.log(`      New From Timestamp: ${adjustedFromTs} (${new Date(adjustedFromTs * 1000).toISOString()})`);
        console.log(`      New To Timestamp: ${adjustedToTs} (${new Date(adjustedToTs * 1000).toISOString()})`);
      }
    }
    console.log('');

    // Call commitEpoch
    console.log('📝 Calling commitEpoch...');
    const tx = await contract.commitEpoch(
      root,
      newBaseUriEpoch,
      adjustedFromTs,
      adjustedToTs,
      batchFromTokenId,
      batchToTokenId
    );

    console.log(`   Transaction sent: ${tx.hash}`);
    console.log('   Waiting for confirmation...');

    const receipt = await tx.wait();
    console.log(`\n✅ Epoch committed successfully!`);
    console.log(`   Transaction: ${receipt.hash}`);
    console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`   Block: ${receipt.blockNumber}`);

    // Check new epoch
    const newEpoch = await contract.currentEpoch();
    console.log(`   New epoch: ${newEpoch}`);

    console.log('\n✨ Script completed successfully!');
    console.log('\n📝 Next step:');
    console.log(`   Update NFT contract's baseUriEpoch to: ${newBaseUriEpoch}`);

  } catch (error: any) {
    console.error('\n❌ Error calling commitEpoch:', error.message);
    if (error.data) {
      console.error('   Error data:', error.data);
    }
    if (error.reason) {
      console.error('   Reason:', error.reason);
    }
    process.exit(1);
  }
}

main().catch(console.error);

