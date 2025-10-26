#!/usr/bin/env tsx
import { ethers } from 'ethers';

// Command line arguments
const args = process.argv.slice(2);

const contractAddress = args[0] || '0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C';
const from = args[1] || '0x9F7dd0BfA1fA430BDf276BD996f809F4b8E1cC9C';
const to = args[2] || '0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f';
const tokenId = args[3] || '2704470580';
const nonce = args[4] || '1761450425568410282';
const deadline = args[5] || '1761454025';
const signature = args[6] || '0x9301b99d757cb086c5b58ed98898ec88269df69798bee68f5b22c82b5700cb51049f718f71b769e9b18648eeb832d18e2ba84f7bb25211e2356ac208ec4929401c';
const rpcUrl = args[7] || 'https://zkrpc-sepolia.xsollazk.com';

async function main() {
  console.log('🔍 Simulate TransferWithSignature (Static Call)\n');

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
    // Connect to blockchain (no wallet needed for static call)
    console.log('🔗 Connecting to blockchain...');
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    console.log(`   Chain ID: ${network.chainId}`);
    console.log('');

    // Contract ABI
    const contractABI = [
      'function transferWithSignature(address from, address to, uint256 tokenId, uint256 nonce, uint256 deadline, bytes calldata signature) external',
      'function ownerOf(uint256 tokenId) external view returns (address)',
      'function backendSigner() external view returns (address)',
      'function completedTransfers(bytes32) external view returns (bool)',
      'function transfersEnabled() external view returns (bool)',
      'function name() external view returns (string)',
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Check contract info
    console.log('📝 Contract info:');
    const contractName = await contract.name();
    const backendSigner = await contract.backendSigner();
    const transfersEnabled = await contract.transfersEnabled();
    console.log(`   Name: ${contractName}`);
    console.log(`   Backend Signer: ${backendSigner}`);
    console.log(`   Transfers Enabled: ${transfersEnabled}`);
    console.log('');

    // Check current owner
    console.log('🔍 Checking current state...');
    let currentOwner;
    try {
      currentOwner = await contract.ownerOf(tokenId);
      console.log(`   Current owner of token ${tokenId}: ${currentOwner}`);
      
      if (currentOwner.toLowerCase() !== from.toLowerCase()) {
        console.log(`   ⚠️  WARNING: Current owner (${currentOwner}) doesn't match 'from' parameter (${from})`);
      } else {
        console.log(`   ✅ Owner matches 'from' parameter`);
      }
    } catch (error: any) {
      console.log(`   ❌ Token ${tokenId} does not exist or error checking owner: ${error.message}`);
    }
    console.log('');

    // Check if signature was already used
    console.log('🔍 Checking signature status...');
    try {
      // Calculate the same hash as contract does
      const domain = {
        name: contractName,
        version: '1.0',
        chainId: Number(network.chainId),
        verifyingContract: contractAddress,
      };

      const types = {
        Transfer: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      };

      const value = {
        from: from,
        to: to,
        tokenId: tokenId,
        nonce: nonce,
        deadline: deadline,
      };

      // Verify signature first
      const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
      console.log(`   Recovered signer from signature: ${recoveredAddress}`);
      
      if (recoveredAddress.toLowerCase() === backendSigner.toLowerCase()) {
        console.log(`   ✅ Signature is valid (matches backend signer)`);
      } else {
        console.log(`   ❌ Signature is INVALID (recovered: ${recoveredAddress}, expected: ${backendSigner})`);
      }

      // Check if already used
      const structHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
          [
            ethers.keccak256(ethers.toUtf8Bytes('Transfer(address from,address to,uint256 tokenId,uint256 nonce,uint256 deadline)')),
            from,
            to,
            tokenId,
            nonce,
            deadline
          ]
        )
      );
      
      // This is the hash that would be stored in completedTransfers
      const typedDataHash = ethers.TypedDataEncoder.hash(domain, types, value);
      
      const isUsed = await contract.completedTransfers(typedDataHash);
      console.log(`   Signature already used: ${isUsed}`);
      
      if (isUsed) {
        console.log(`   ❌ This signature was already used (replay protection)`);
      } else {
        console.log(`   ✅ Signature is fresh (not used yet)`);
      }
    } catch (error: any) {
      console.log(`   ⚠️  Could not check signature status: ${error.message}`);
    }
    console.log('');

    // Check deadline
    const now = Math.floor(Date.now() / 1000);
    console.log(`⏰ Checking deadline...`);
    console.log(`   Current timestamp: ${now} (${new Date(now * 1000).toISOString()})`);
    console.log(`   Deadline: ${deadline} (${new Date(Number(deadline) * 1000).toISOString()})`);
    
    if (now > Number(deadline)) {
      console.log(`   ❌ Signature has expired! (${now - Number(deadline)} seconds ago)`);
    } else {
      console.log(`   ✅ Signature valid for ${Number(deadline) - now} more seconds`);
    }
    console.log('');

    // Simulate the call using estimateGas
    console.log('🎯 Simulating transferWithSignature call...\n');
    console.log('   Method 1: Using estimateGas()');
    try {
      const gasEstimate = await contract.transferWithSignature.estimateGas(
        from,
        to,
        tokenId,
        nonce,
        deadline,
        signature
      );
      console.log(`   ✅ SUCCESS! Estimated gas: ${gasEstimate.toString()}`);
      console.log(`   Transaction would succeed if executed!`);
    } catch (error: any) {
      console.log(`   ❌ FAILED! Transaction would revert`);
      console.log(`   Error: ${error.message}`);
      if (error.data) {
        console.log(`   Error data: ${error.data}`);
      }
      if (error.reason) {
        console.log(`   Reason: ${error.reason}`);
      }
      
      // Try to decode the revert reason
      if (error.error?.data) {
        try {
          const reason = ethers.toUtf8String('0x' + error.error.data.slice(138));
          console.log(`   Decoded revert reason: ${reason}`);
        } catch (e) {
          console.log(`   Raw error data: ${error.error.data}`);
        }
      }
    }
    console.log('');

    // Try staticCall as well
    console.log('   Method 2: Using staticCall()');
    try {
      await contract.transferWithSignature.staticCall(
        from,
        to,
        tokenId,
        nonce,
        deadline,
        signature
      );
      console.log(`   ✅ SUCCESS! Static call passed`);
      console.log(`   Transaction would succeed if executed!`);
    } catch (error: any) {
      console.log(`   ❌ FAILED! Static call reverted`);
      console.log(`   Error: ${error.shortMessage || error.message}`);
      if (error.reason) {
        console.log(`   Reason: ${error.reason}`);
      }
    }

    console.log('\n✨ Simulation completed!');
    console.log('\n💡 Note: This was only a simulation. No actual transaction was sent.');

  } catch (error: any) {
    console.error('\n❌ Error during simulation:', error.message);
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

