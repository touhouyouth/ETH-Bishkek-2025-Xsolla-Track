# Lore Proof

> ETH Bishkek 2025 Hackathon - Xsolla Track

On-chain digital twins of Steam items as NFTs with real-time monitoring and epoch-based snapshots on IPFS.

## Overview

Creates verifiable NFT representations of Steam Dota 2 items, tracks ownership and statistics changes over time through periodic snapshots (epochs) stored on IPFS and committed to blockchain.

**Key Features:**
- Real-time Steam inventory monitoring
- Epoch-based metadata snapshots (every X hours)
- EIP-712 signature-based transfers
- Complete item history preserved on-chain

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 18 + TypeScript 5
- Wagmi v2 + ConnectKit (Web3)
- Viem 2.x
- Tailwind CSS v4
- Xsolla ZK Design System (@xsolla-zk/react)

### Backend
- Node.js + TypeScript
- Express.js
- Viem (blockchain interactions)
- Axios (Steam API)
- node-cron (scheduled tasks)
- Pinata SDK (IPFS)

### Smart Contracts
- Solidity
- Foundry + foundry-zksync
- OpenZeppelin (ERC721Enumerable, AccessControl)
- EIP-712, EIP-4906

### Infrastructure
- Xsolla ZK Sepolia Testnet (Chain ID: 555776)
- IPFS (Pinata)
- Steam Web API

## Prerequisites

```bash
# Required
Node.js >= 18.x
Yarn or npm
Foundry with zkSync support

# Accounts/Keys needed
- Steam API Key: https://steamcommunity.com/dev/apikey
- Pinata Account: https://pinata.cloud/ (for IPFS)
- Wallet with ETH on Xsolla ZK Sepolia
```

### Install Foundry zkSync

```bash
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
foundryup-zksync
```

## Quick Start

```bash
# Clone repository
git clone <repo-url>
cd ETH-Bishkek-2025-Xsolla-Track

# Install dependencies
cd backend && yarn install
cd ../frontend && yarn install
cd ../contracts && forge install

# Configure environment (see below)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp contracts/.env.example contracts/.env

# Run services
cd backend && yarn dev          # Terminal 1 (port 3000)
cd frontend && yarn dev         # Terminal 2 (port 3001)
```

## Environment Configuration

### Backend (`backend/.env`)

```bash
# Server
PORT=3000

# Blockchain
EPOCH_REGISTRY_ADDRESS=0xC2259646b5e2b4b6da3e970965B83513f9Ca61B0
CONTRACT_ADDRESS=0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C
SIGNER_PRIVATE_KEY=0x...                    # Private key for EIP-712 signatures

# IPFS (Pinata)
PINATA_JWT=eyJhbGc...                       # JWT from Pinata dashboard
IPFS_GATEWAY=https://gateway.pinata.cloud   # Optional

# Steam API
EXTERNAL_API_BASE=https://api.steampowered.com
EXTERNAL_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX   # From steamcommunity.com/dev/apikey
```

**Required Variables:**
- `PINATA_JWT` - Pinata API JWT token
- `EPOCH_REGISTRY_ADDRESS` - Deployed registry contract address
- `SIGNER_PRIVATE_KEY` - Private key for signing transfers
- `EXTERNAL_API_KEY` - Steam Web API key

### Frontend (`frontend/.env.local`)

```bash
# Optional
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...    # From cloud.walletconnect.com
NEXT_PUBLIC_API_URL=http://localhost:3000   # Backend URL
```

### Contracts (`contracts/.env`)

```bash
# Deployment
OWNER_PRIVATE_KEY=0x...         # Deployer private key (becomes admin)
BACKEND_SIGNER=0x...            # Address authorized to sign transfers

# Optional
NFT_NAME="Lore Proof Assets"
NFT_SYMBOL="LORE"
INITIAL_BASE_URI="ipfs://"

# IPFS (for scripts)
PINATA_JWT=eyJhbGc...
```

## Project Structure

```
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── config.ts          # Config and env vars
│   │   ├── index.ts           # Entry point
│   │   ├── server.ts          # Express server
│   │   ├── jobs/              # Cron schedulers
│   │   └── services/          # IPFS, epoch sync, Steam API
│   └── package.json
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   ├── components/        # React components
│   │   ├── config/            # Wagmi, Tamagui config
│   │   └── hooks/             # Custom hooks
│   └── package.json
│
└── contracts/                  # Solidity contracts
    ├── src/
    │   ├── LoreNFT.sol        # ERC721 NFT contract
    │   └── LoreEpochRegistry.sol
    ├── script/DeployLore.s.sol
    ├── scripts/               # TypeScript utilities
    └── package.json
```

## Backend

**Port:** 3000

**Scripts:**
```bash
yarn dev        # Development with hot reload (tsx watch)
yarn build      # Compile TypeScript
yarn start      # Production server
```

**Key Services:**
- `services/ipfs.ts` - IPFS upload, epoch creation
- `services/epochSync.ts` - Blockchain epoch synchronization
- `jobs/scheduler.ts` - Cron jobs (every 10 seconds)

**Cron Configuration** (`src/config.ts`):
```typescript
cron: {
  fetch: "*/10 * * * * *",  // Fetch Steam data every 10s
  ipfs: "*/10 * * * * *",   // Create epochs every 10s
}
```

**API Endpoints:**
- `GET /health` - Health check
- `GET /api/epochs` - List all epochs
- `GET /api/epochs/:id` - Epoch details
- `POST /api/sync-epochs` - Trigger sync

## Frontend

**Port:** 3001 (default Next.js dev server)

**Scripts:**
```bash
yarn dev        # Dev server
yarn build      # Production build
yarn start      # Production server
yarn lint       # ESLint
yarn format     # Prettier
yarn type       # TypeScript check
yarn contracts  # Generate contract types from ABIs
```

**Configuration:**
- `src/config/wagmi.config.ts` - Wagmi + ConnectKit setup
- `src/config/tamagui.config.ts` - UI theme configuration

**Key Dependencies:**
- `wagmi` v2.18.2 - React hooks for Ethereum
- `connectkit` v1.9.1 - Wallet connection UI
- `viem` v2.38.4 - Ethereum utilities
- `@xsolla-zk/react` - Design system components

## Smart Contracts

**Network:** Xsolla ZK Sepolia (Chain ID: 555776)  
**RPC:** https://zkrpc-sepolia.xsollazk.com

**Deployed Contracts:**
- **LoreNFT:** `0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C`
- **LoreEpochRegistry:** `0xC2259646b5e2b4b6da3e970965B83513f9Ca61B0`

**Scripts:**
```bash
# Development
forge build --zksync    # Compile contracts
forge test              # Run tests

# Deployment
forge script script/DeployLore.s.sol:DeployLore \
  --rpc-url https://zkrpc-sepolia.xsollazk.com \
  --broadcast --zksync

# Utilities
yarn preview            # Preview metadata
yarn test-upload        # Test IPFS
yarn upload-and-mint    # Upload + mint NFTs
yarn commit-epoch       # Commit new epoch
```

**Contract Features:**

**LoreNFT:**
- ERC721Enumerable (token enumeration)
- EIP-712 (signature-based transfers)
- EIP-4906 (metadata update events)
- Role-based access (MINTER_ROLE, REGISTRY_ROLE)

**LoreEpochRegistry:**
- Stores epoch metadata (IPFS CID, Merkle root, timestamps)
- Updates NFT baseURI on epoch commit
- Emits batch metadata update events

**Key Functions:**
```solidity
// LoreNFT
function mint(address to) external
function transferWithSignature(address from, address to, uint256 tokenId, uint256 nonce, uint256 deadline, bytes calldata signature) external
function tokensOfOwner(address owner) external view returns (uint256[] memory)

// LoreEpochRegistry
function commitEpoch(bytes32 epochRoot, string calldata ipfsCid, uint64 fromTimestamp, uint64 toTimestamp, uint256 fromTokenId, uint256 toTokenId) external
```

## How It Works

### 1. Digital Twin Creation
- Steam item is registered → NFT minted with matching ID
- All attributes stored in IPFS JSON (weapon, skin, wear, kills, etc.)

### 2. Real-Time Monitoring
- Backend polls Steam API every 10 seconds
- Detects ownership changes and stat updates (kills, matches)

### 3. Epoch System
Every X hours:
```
Backend → Collect item states
       → Generate metadata JSONs
       → Upload to IPFS (get CID)
       → Compute Merkle root
       → Call commitEpoch() on-chain
       → NFT baseURI updated automatically
```

**Epoch Data:**
- Time range (from/to timestamps)
- IPFS CID (directory with all JSONs)
- Merkle root (for verification)
- Token ID range

**Result:** Complete, immutable history of all items

### 4. Signature-Based Transfers
- User requests transfer → Backend validates
- Backend signs EIP-712 typed message
- User submits transaction with signature
- Contract verifies signature before transfer

## Network Setup

**Add to MetaMask:**
```
Network Name: Xsolla ZK Sepolia
RPC URL: https://zkrpc-sepolia.xsollazk.com
Chain ID: 555776
Currency: ETH
```

## Development

### Start All Services
```bash
# Terminal 1: Backend
cd backend && yarn dev

# Terminal 2: Frontend  
cd frontend && yarn dev
```

### Create Manual Epoch
```bash
cd contracts
yarn commit-epoch

# Or via API
curl -X POST http://localhost:3000/api/epochs
```

### Test Transfer Flow
```bash
cd contracts
yarn signTransfer              # Generate signature
yarn transferWithSignature     # Execute transfer
```

## Metadata Structure

**IPFS JSON Example:**
```json
{
  "name": "StatTrak™ AK-47 | Redline (Field-Tested)",
  "description": "Digital twin of Steam CS2 item",
  "image": "ipfs://QmXxx.../image.png",
  "attributes": [
    {"trait_type": "Weapon Type", "value": "AK-47"},
    {"trait_type": "Skin", "value": "Redline"},
    {"trait_type": "Rarity", "value": "Classified"},
    {"trait_type": "Wear", "value": "Field-Tested"},
    {"trait_type": "Paint Seed", "value": 381},
    {"trait_type": "StatTrak Kills", "value": 1547},
    {"trait_type": "Matches Played", "value": 89},
    {"trait_type": "Steam Item ID", "value": "2704470580"},
    {"trait_type": "Epoch", "value": 42}
  ]
}
```

**URI Format:** `ipfs://<epoch_cid>/<tokenId>.json`

## Troubleshooting

**Backend won't start:**
```bash
# Check .env file exists and has all required vars
cat backend/.env | grep PINATA_JWT
cat backend/.env | grep SIGNER_PRIVATE_KEY
```

**Frontend wallet issues:**
- Add Xsolla ZK network to MetaMask manually
- Get testnet ETH from faucet

**Contract deployment fails:**
```bash
# Verify foundry-zksync installed
foundryup-zksync --version

# Check balance
cast balance $YOUR_ADDRESS --rpc-url https://zkrpc-sepolia.xsollazk.com
```

**IPFS upload timeout:**
- Check Pinata JWT validity
- Verify account upload limits

## Testing

```bash
# Backend
cd backend
yarn test  # (to be implemented)

# Frontend
cd frontend
yarn test  # (to be implemented)

# Contracts
cd contracts
forge test
forge test -vvv  # Verbose
```

## Production Deployment

**Backend:**
```bash
cd backend
yarn build
NODE_ENV=production yarn start

# Or with PM2
pm2 start dist/index.js --name lore-proof-backend
```

**Frontend:**
```bash
cd frontend
yarn build
yarn start

# Or deploy to Vercel
vercel --prod
```

**Contracts:**
```bash
cd contracts
# Set production env vars
forge script script/DeployLore.s.sol:DeployLore \
  --rpc-url https://zkrpc-sepolia.xsollazk.com \
  --broadcast --zksync
```

## Resources

- [Xsolla ZK Docs](https://docs.xsollazk.com/)
- [zkSync Docs](https://docs.zksync.io/)
- [Steam Web API](https://steamcommunity.com/dev)
- [Foundry Book](https://book.getfoundry.sh/)
- [Wagmi Docs](https://wagmi.sh/)

