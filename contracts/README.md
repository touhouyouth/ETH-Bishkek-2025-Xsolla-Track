# Lore Game Assets - NFT Contracts

Smart contracts for game asset NFTs with epoch-based metadata snapshots on IPFS and EIP-712 signature-based transfers.

## Contracts Overview

- **LoreNFT**: ERC721Enumerable NFT contract with:
  - Epoch-based metadata system (all attributes stored in IPFS JSON)
  - Transfer restrictions (signature-based or admin-controlled)
  - EIP-712 for typed signature verification
  - EIP-4906 for metadata update events
  - Role-based access control (MINTER_ROLE, REGISTRY_ROLE)
  - Token enumeration (get all token IDs by user address)

- **LoreEpochRegistry**: Registry for managing metadata epochs:
  - Stores epoch roots and IPFS CIDs
  - Automatically updates NFT baseURI on epoch commits
  - Emits EIP-4906 batch metadata update events
  - Role-based access (GAME_ROLE for epoch commits)

## Prerequisites

Install `foundry-zksync` for zkSync deployment support:

```bash
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
foundryup-zksync
```

## Setup

```bash
# Install dependencies
forge install
```

## Build

```bash
# Build with zkSync support
forge build --zksync

# Or regular build
forge build
```

## Test

The project includes comprehensive test coverage for both contracts with 67 tests total.

### Running Tests

```bash
# Run all tests
forge test

# Run with detailed output
forge test -vv

# Run specific test file
forge test --match-path test/LoreNFT.t.sol -vv
forge test --match-path test/LoreEpochRegistry.t.sol -vv

# Run specific test by name
forge test --match-test testMint -vv

# Run with gas reporting
forge test --gas-report
```

### Test Coverage

```bash
# Generate coverage report
forge coverage

# Generate detailed LCOV report
forge coverage --report lcov
```

### Test Suites

**LoreNFT Tests (47 tests)**:
- Constructor validation (6 tests)
- Minting (single & batch) (8 tests)
- Backend signer management (3 tests)
- Transfer controls (4 tests)
- Signature-based transfers (7 tests)
- Base URI management (4 tests)
- Token URI queries (3 tests)
- Registry management (4 tests)
- Batch metadata updates (2 tests)
- Token enumeration (2 tests)
- Interface support (1 test)

**LoreEpochRegistry Tests (20 tests)**:
- Constructor validation (3 tests)
- Epoch commits (8 tests)
- Epoch queries (4 tests)
- Integration tests (2 tests)
- Role management (2 tests)

### Test Results

All tests passing:
```
Ran 2 test suites: 67 tests passed, 0 failed, 0 skipped
```

## Deploy

### Environment Variables

Set the following environment variables before deployment:

```bash
# Required for deployment
export OWNER_PRIVATE_KEY=0x...        # Your private key (will be admin for both contracts)
export BACKEND_SIGNER=0x...           # Address authorized to sign transfer approvals

# Optional (with defaults)
export NFT_NAME="Lore Game Assets"    # NFT collection name
export NFT_SYMBOL="LORE"              # NFT collection symbol
export INITIAL_BASE_URI="ipfs://"     # Initial IPFS base URI for metadata

# Required for IPFS upload scripts (scripts/uploadAndMint.ts)
export PINATA_JWT=your_pinata_jwt     # Pinata JWT token (recommended)
# OR use API keys:
export PINATA_API_KEY=your_api_key
export PINATA_SECRET_API_KEY=your_secret_key
```

### Deploy to Xsolla ZK

```bash
cd /path/to/contracts

# Set your environment variables
export OWNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
export BACKEND_SIGNER=0xYOUR_BACKEND_SIGNER_ADDRESS

# Deploy to Xsolla ZK
forge script script/DeployLore.s.sol:DeployLore \
  --rpc-url https://zkrpc-sepolia.xsollazk.com \
  --broadcast \
  --zksync
```

### Deploy to Local Network

```bash
forge script script/DeployLore.s.sol:DeployLore \
  --rpc-url http://localhost:8011 \
  --broadcast \
  --zksync
```

## Deployment Process

The deployment script automatically:

1. Deploys **LoreNFT** contract with a temporary registry address
2. Deploys **LoreEpochRegistry** contract with the NFT address
3. Updates the NFT to point to the real registry
4. Grants `REGISTRY_ROLE` to the registry contract

After deployment, you'll have:
- **Admin address** with full control (DEFAULT_ADMIN_ROLE, MINTER_ROLE, GAME_ROLE)
- **LoreNFT** contract for minting and managing NFTs
- **LoreEpochRegistry** contract for committing new metadata epochs

## Usage Examples

### Mint NFTs

```bash
# Using cast
cast send <NFT_ADDRESS> "mint(address)" <RECIPIENT_ADDRESS> \
  --rpc-url https://zkrpc-sepolia.xsollazk.com \
  --private-key $OWNER_PRIVATE_KEY
```

### Get All Token IDs by User Address

```bash
# Get all token IDs owned by a user
cast call <NFT_ADDRESS> "tokensOfOwner(address)" <USER_ADDRESS> \
  --rpc-url https://zkrpc-sepolia.xsollazk.com
```

### Commit New Epoch

```bash
# Commit a new metadata epoch
cast send <REGISTRY_ADDRESS> \
  "commitEpoch(bytes32,string,uint64,uint64,uint256,uint256)" \
  <MERKLE_ROOT> \
  "ipfs://NEW_CID/" \
  <FROM_TIMESTAMP> \
  <TO_TIMESTAMP> \
  <FROM_TOKEN_ID> \
  <TO_TOKEN_ID> \
  --rpc-url https://zkrpc.xsollazk.com \
  --private-key $OWNER_PRIVATE_KEY
```

### Transfer with Signature

To transfer NFTs, you need a backend signature (EIP-712). The signature must be generated off-chain by the `BACKEND_SIGNER` address.

```javascript
// Example signature generation (backend)
const domain = {
  name: "Lore Game Assets",
  version: "1.0",
  chainId: YOUR_CHAIN_ID,
  verifyingContract: NFT_ADDRESS
};

const types = {
  Transfer: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "tokenId", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ]
};

const value = {
  from: CURRENT_OWNER,
  to: RECIPIENT,
  tokenId: TOKEN_ID,
  nonce: UNIQUE_NONCE,
  deadline: Math.floor(Date.now() / 1000) + 3600 // 1 hour
};

const signature = await signer._signTypedData(domain, types, value);
```

Then call the contract:

```bash
cast send <NFT_ADDRESS> \
  "transferWithSignature(address,address,uint256,uint256,uint256,bytes)" \
  <FROM> <TO> <TOKEN_ID> <NONCE> <DEADLINE> <SIGNATURE> \
  --rpc-url https://zkrpc.xsollazk.com
```

### Enable Free Transfers (Optional)

By default, transfers require backend signatures. To enable free transfers:

```bash
cast send <NFT_ADDRESS> "setTransfersEnabled(bool)" true \
  --rpc-url https://zkrpc.xsollazk.com \
  --private-key $OWNER_PRIVATE_KEY
```

## Architecture

### Metadata Storage

All NFT attributes (weapon type, skin, rarity, wear, paint seed, stickers, StatTrak kills, match count, etc.) are stored in IPFS JSON files, not on-chain.

Token URI format: `ipfs://<CID_epoch>/<tokenId>.json`

### Epoch System

1. **Off-chain**: Build IPFS directory with `<tokenId>.json` files for each NFT
2. **Off-chain**: Compute Merkle root and upload to IPFS
3. **On-chain**: Call `commitEpoch()` with new root and IPFS CID
4. **Result**: All NFT metadata URIs automatically update to point to new epoch

### Roles

**LoreNFT**:
- `DEFAULT_ADMIN_ROLE`: Can grant/revoke all roles
- `MINTER_ROLE`: Can mint new NFTs
- `REGISTRY_ROLE`: Can update baseURI and emit metadata events

**LoreEpochRegistry**:
- `DEFAULT_ADMIN_ROLE`: Full admin access
- `GAME_ROLE`: Can commit new epochs
- `NFT_MANAGER`: Reserved for future use

## Deployed Contracts

### Xsolla ZK Sepolia (Chain ID: 555776)

- LoreNFT: `0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C`
- LoreEpochRegistry: `0xC2259646b5e2b4b6da3e970965B83513f9Ca61B0`
- RPC URL: https://zkrpc-sepolia.xsollazk.com
- Admin/Deployer: `0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f`
