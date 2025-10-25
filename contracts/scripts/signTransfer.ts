#!/usr/bin/env tsx
import { ethers } from 'ethers';

// Command line arguments
const args = process.argv.slice(2);

const from = args[0] || '0x9F7dd0BfA1fA430BDf276BD996f809F4b8E1cC9C';
const to = args[1] || '0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f';
const tokenId = args[2] || '3450589820';
const nonce = args[3] || '1761426919897653704';
const deadline = args[4] || '1761430519';
const backendPrivateKey = args[5]; // Private key of backend signer
const contractAddress = args[6] || '0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C';
const rpcUrl = args[7] || 'https://zkrpc-sepolia.xsollazk.com';

async function main() {
  console.log('🔐 Sign Transfer Script for LoreNFT\n');

  if (!backendPrivateKey) {
    console.error('❌ Backend private key is required!');
    console.log('\nUsage:');
    console.log('  npx tsx scripts/signTransfer.ts <from> <to> <tokenId> <nonce> <deadline> <backendPrivateKey> [contractAddress] [rpcUrl]');
    console.log('\nExample:');
    console.log('  npx tsx scripts/signTransfer.ts \\');
    console.log('    0x9F7dd0BfA1fA430BDf276BD996f809F4b8E1cC9C \\');
    console.log('    0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f \\');
    console.log('    3450589820 \\');
    console.log('    1761426919897653704 \\');
    console.log('    1761430519 \\');
    console.log('    0xYOUR_BACKEND_PRIVATE_KEY');
    process.exit(1);
  }

  console.log('📋 Parameters:');
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   From: ${from}`);
  console.log(`   To: ${to}`);
  console.log(`   Token ID: ${tokenId}`);
  console.log(`   Nonce: ${nonce}`);
  console.log(`   Deadline: ${deadline} (${new Date(Number(deadline) * 1000).toISOString()})`);
  console.log('');

  try {
    // Connect to blockchain
    console.log('🔗 Connecting to blockchain...');
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const backendWallet = new ethers.Wallet(backendPrivateKey, provider);
    console.log(`   Backend signer address: ${backendWallet.address}`);
    console.log('');

    // Get contract name and version for EIP-712
    const contractABI = [
      'function name() external view returns (string)',
      'function backendSigner() external view returns (address)',
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const name = await contract.name();
    const backendSigner = await contract.backendSigner();
    
    console.log('📝 Contract info:');
    console.log(`   Name: ${name}`);
    console.log(`   Backend Signer: ${backendSigner}`);
    console.log('');

    // Check if wallet matches backend signer
    if (backendWallet.address.toLowerCase() !== backendSigner.toLowerCase()) {
      console.error(`❌ ERROR: Wallet address (${backendWallet.address}) doesn't match backend signer (${backendSigner})`);
      console.error('   You need the private key of the backend signer to create valid signatures!');
      process.exit(1);
    }

    console.log('✅ Wallet matches backend signer\n');

    // Get chain ID
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    console.log(`   Chain ID: ${chainId}`);
    console.log('');

    // EIP-712 Domain
    const domain = {
      name: name,
      version: '1.0',
      chainId: chainId,
      verifyingContract: contractAddress,
    };

    // EIP-712 Types
    const types = {
      Transfer: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    // Values to sign
    const value = {
      from: from,
      to: to,
      tokenId: tokenId,
      nonce: nonce,
      deadline: deadline,
    };

    console.log('🔐 Creating EIP-712 signature...');
    console.log('\nDomain:', JSON.stringify(domain, null, 2));
    console.log('\nTypes:', JSON.stringify(types, null, 2));
    console.log('\nValue:', JSON.stringify(value, null, 2));
    console.log('');

    // Sign the typed data
    const signature = await backendWallet.signTypedData(domain, types, value);

    console.log('✅ Signature created successfully!\n');
    console.log('📋 Result:');
    console.log(`   Signature: ${signature}`);
    console.log('');

    // Verify signature
    const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
    console.log('🔍 Verification:');
    console.log(`   Recovered address: ${recoveredAddress}`);
    console.log(`   Expected address: ${backendWallet.address}`);
    
    if (recoveredAddress.toLowerCase() === backendWallet.address.toLowerCase()) {
      console.log('   ✅ Signature is valid!');
    } else {
      console.log('   ❌ Signature verification failed!');
    }

    console.log('\n📝 Use this data to call transferWithSignature:');
    console.log(JSON.stringify({
      contractAddress: contractAddress,
      transferData: {
        from: from,
        to: to,
        tokenId: tokenId,
        nonce: nonce,
        deadline: deadline,
      },
      signature: signature,
    }, null, 2));

  } catch (error: any) {
    console.error('\n❌ Error creating signature:', error.message);
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

