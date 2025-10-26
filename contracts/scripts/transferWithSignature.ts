#!/usr/bin/env tsx
import { ethers } from 'ethers';

// Command line arguments or hardcoded values
const args = process.argv.slice(2);

const contractAddress = args[0] || '0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C';
const from = args[1] || '0x9F7dd0BfA1fA430BDf276BD996f809F4b8E1cC9C';
const to = args[2] || '0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f';
const tokenId = args[3] || '3450589820';
const nonce = args[4] || '1761426919897653704';
const deadline = args[5] || '1761430519';
const signature = args[6] || '0x981c056cd492e8d50b82fb1383c7026ceb07d8c1a3727084dbbc9d78008f98bd0c348d339cb87fa3d10047d22a903ab4afdeb42fb06f4f46e643df6d4ba53cd01b';
const privateKey = args[7]; // REQUIRED: Private key must be provided as argument
const rpcUrl = args[8] || 'https://zkrpc-sepolia.xsollazk.com';

async function main() {
  console.log('🚀 TransferWithSignature Script for LoreNFT\n');

  // Validate arguments
  if (!privateKey) {
    console.error('❌ Private key is required!');
    console.error('\nUsage:');
    console.error('  npx tsx scripts/transferWithSignature.ts <contractAddress> <from> <to> <tokenId> <nonce> <deadline> <signature> <privateKey> [rpcUrl]');
    process.exit(1);
  }
  
  if (!privateKey.startsWith('0x')) {
    console.error('❌ Private key must start with 0x');
    process.exit(1);
  }

  console.log('📋 Parameters:');
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   RPC URL: ${rpcUrl}`);
  console.log(`   From: ${from}`);
  console.log(`   To: ${to}`);
  console.log(`   Token ID: ${tokenId}`);
  console.log(`   Nonce: ${nonce}`);
  console.log(`   Deadline: ${deadline} (${new Date(Number(deadline) * 1000).toISOString()})`);
  console.log(`   Signature: ${signature}`);
  console.log('');

  try {
    // Connect to blockchain
    console.log('🔗 Connecting to blockchain...');
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`   Wallet address: ${wallet.address}`);

    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`   Wallet balance: ${ethers.formatEther(balance)} ETH`);
    console.log('');

    // Contract ABI (only transferWithSignature function)
    const contractABI = [
      'function transferWithSignature(address from, address to, uint256 tokenId, uint256 nonce, uint256 deadline, bytes calldata signature) external',
      'function ownerOf(uint256 tokenId) external view returns (address)',
      'function backendSigner() external view returns (address)',
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Check current owner
    console.log('🔍 Checking current token owner...');
    try {
      const currentOwner = await contract.ownerOf(tokenId);
      console.log(`   Current owner: ${currentOwner}`);
      
      if (currentOwner.toLowerCase() !== from.toLowerCase()) {
        console.error(`   ⚠️  WARNING: Current owner (${currentOwner}) doesn't match 'from' parameter (${from})`);
      } else {
        console.log(`   ✅ Owner matches 'from' parameter`);
      }
    } catch (error: any) {
      console.error(`   ⚠️  Could not check current owner: ${error.message}`);
    }

    // Check backend signer
    console.log('\n🔍 Checking backend signer...');
    try {
      const backendSigner = await contract.backendSigner();
      console.log(`   Backend signer: ${backendSigner}`);
    } catch (error: any) {
      console.error(`   ⚠️  Could not check backend signer: ${error.message}`);
    }

    // Check deadline
    const now = Math.floor(Date.now() / 1000);
    console.log(`\n⏰ Checking deadline...`);
    console.log(`   Current timestamp: ${now} (${new Date(now * 1000).toISOString()})`);
    console.log(`   Deadline: ${deadline} (${new Date(Number(deadline) * 1000).toISOString()})`);
    
    if (now > Number(deadline)) {
      console.error(`   ❌ Signature has expired! (${now - Number(deadline)} seconds ago)`);
      process.exit(1);
    } else {
      console.log(`   ✅ Signature valid for ${Number(deadline) - now} more seconds`);
    }

    console.log('\n📝 Calling transferWithSignature...');
    
    // Estimate gas first
    try {
      const gasEstimate = await contract.transferWithSignature.estimateGas(
        from,
        to,
        tokenId,
        nonce,
        deadline,
        signature
      );
      console.log(`   Estimated gas: ${gasEstimate.toString()}`);
    } catch (error: any) {
      console.error(`   ⚠️  Gas estimation failed: ${error.message}`);
      if (error.data) {
        console.error('   Error data:', error.data);
      }
      if (error.reason) {
        console.error('   Reason:', error.reason);
      }
      console.log('\n   Attempting to send transaction anyway...');
    }

    const tx = await contract.transferWithSignature(
      from,
      to,
      tokenId,
      nonce,
      deadline,
      signature
    );

    console.log(`\n   Transaction sent: ${tx.hash}`);
    console.log('   Waiting for confirmation...');

    const receipt = await tx.wait();
    console.log(`\n✅ Transfer completed successfully!`);
    console.log(`   Transaction: ${receipt.hash}`);
    console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`   Block: ${receipt.blockNumber}`);

    // Check new owner
    console.log('\n🔍 Verifying new owner...');
    const newOwner = await contract.ownerOf(tokenId);
    console.log(`   New owner: ${newOwner}`);
    
    if (newOwner.toLowerCase() === to.toLowerCase()) {
      console.log(`   ✅ Transfer verified! Token now belongs to ${to}`);
    } else {
      console.log(`   ⚠️  Unexpected owner: ${newOwner}`);
    }

    console.log('\n✨ Script completed successfully!');

  } catch (error: any) {
    console.error('\n❌ Error calling transferWithSignature:', error.message);
    if (error.data) {
      console.error('   Error data:', error.data);
    }
    if (error.reason) {
      console.error('   Reason:', error.reason);
    }
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    process.exit(1);
  }
}

main().catch(console.error);

