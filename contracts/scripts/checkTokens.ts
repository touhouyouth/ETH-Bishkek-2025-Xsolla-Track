#!/usr/bin/env tsx
import { ethers } from 'ethers';

// Configuration
const RPC_URL = 'https://zkrpc-sepolia.xsollazk.com';
const NFT_CONTRACT = '0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C';
const OWNER_ADDRESS = process.argv[2] || '0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f';

async function main() {
  console.log('🔍 Checking tokens owned by address...\n');
  console.log(`   Owner: ${OWNER_ADDRESS}`);
  console.log(`   NFT Contract: ${NFT_CONTRACT}`);
  console.log(`   RPC: ${RPC_URL}\n`);

  try {
    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Contract ABI
    const contractABI = [
      'function tokensOfOwner(address owner) external view returns (uint256[])',
      'function balanceOf(address owner) external view returns (uint256)',
      'function tokenURI(uint256 tokenId) external view returns (string)',
      'function baseUriEpoch() external view returns (string)',
    ];

    const contract = new ethers.Contract(NFT_CONTRACT, contractABI, provider);

    // Get balance
    console.log('📊 Fetching balance...');
    const balance = await contract.balanceOf(OWNER_ADDRESS);
    console.log(`   Balance: ${balance.toString()} tokens\n`);

    if (balance > 0) {
      // Get all tokens
      console.log('📋 Fetching tokens...');
      const tokens = await contract.tokensOfOwner(OWNER_ADDRESS);
      console.log(`   Total tokens found: ${tokens.length}\n`);

      // Get base URI
      const baseUri = await contract.baseUriEpoch();
      console.log(`   Base URI: ${baseUri}\n`);

      // Display tokens
      console.log('🎫 Owned Token IDs:');
      for (let i = 0; i < tokens.length; i++) {
        const tokenId = tokens[i].toString();
        console.log(`   ${i + 1}. Token ID: ${tokenId}`);
        
        // Get token URI
        try {
          const uri = await contract.tokenURI(tokens[i]);
          console.log(`      URI: ${uri}`);
        } catch (e) {
          console.log(`      URI: Unable to fetch`);
        }
        console.log('');
      }
    } else {
      console.log('⚠️  No tokens found for this address.');
    }

    console.log('✅ Check complete!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.reason) {
      console.error('   Reason:', error.reason);
    }
    process.exit(1);
  }
}

main().catch(console.error);

