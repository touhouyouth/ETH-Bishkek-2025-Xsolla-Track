#!/usr/bin/env tsx
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://zkrpc-sepolia.xsollazk.com');
const contractAddress = '0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C';
const tokenId = process.argv[2] || '2704470580';

const abi = [
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function balanceOf(address owner) external view returns (uint256)',
];

async function main() {
  const contract = new ethers.Contract(contractAddress, abi, provider);

  console.log('🔍 Checking token ownership...\n');
  console.log('Contract:', contractAddress);
  console.log('Token ID:', tokenId);
  console.log('');

  try {
    const owner = await contract.ownerOf(tokenId);
    console.log('✅ Current owner:', owner);
    console.log('');
    
    // Check balances of both addresses
    const addr1 = '0x9F7dd0BfA1fA430BDf276BD996f809F4b8E1cC9C';
    const addr2 = '0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f';
    
    const balance1 = await contract.balanceOf(addr1);
    const balance2 = await contract.balanceOf(addr2);
    
    console.log('📊 Balances:');
    console.log('   Address 0x9F7dd0BfA1fA430BDf276BD996f809F4b8E1cC9C:', balance1.toString(), 'tokens');
    console.log('   Address 0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f:', balance2.toString(), 'tokens');
    console.log('');
    
    if (owner.toLowerCase() === addr1.toLowerCase()) {
      console.log('✅ Token belongs to 0x9F7dd0BfA1fA430BDf276BD996f809F4b8E1cC9C (from)');
    } else if (owner.toLowerCase() === addr2.toLowerCase()) {
      console.log('✅ Token belongs to 0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f (to)');
    } else {
      console.log('⚠️  Token belongs to different address:', owner);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Token may not exist or contract call failed');
  }
}

main();

