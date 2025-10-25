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

```bash
forge test
```

## Deploy

### Environment Variables

Set the following environment variables before deployment:

```bash
# Required
export OWNER_PRIVATE_KEY=0x...        # Your private key (will be admin for both contracts)
export BACKEND_SIGNER=0x...           # Address authorized to sign transfer approvals

# Optional (with defaults)
export NFT_NAME="Lore Game Assets"    # NFT collection name
export NFT_SYMBOL="LORE"              # NFT collection symbol
export INITIAL_BASE_URI="ipfs://"     # Initial IPFS base URI for metadata
```

### Deploy to Xsolla ZK

```bash
cd /path/to/contracts

# Set your environment variables
export OWNER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
export BACKEND_SIGNER=0xYOUR_BACKEND_SIGNER_ADDRESS

# Deploy to Xsolla ZK
forge script script/DeployLore.s.sol:DeployLore \
  --rpc-url https://zkrpc.xsollazk.com \
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
  --rpc-url https://zkrpc.xsollazk.com \
  --private-key $OWNER_PRIVATE_KEY
```

### Get All Token IDs by User Address

```bash
# Get all token IDs owned by a user
cast call <NFT_ADDRESS> "tokensOfOwner(address)" <USER_ADDRESS> \
  --rpc-url https://sepolia.era.zksync.dev
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

### zkSync Sepolia

- LoreNFT: `0xa0c7D5611EfA882204b8B6A92F369AFA949A65a0`
- LoreEpochRegistry: `0xAd6421d11F0E3f01E6841F26b9398FE794d0d3F6`
- Explorer: https://sepolia.explorer.zksync.io/

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Backend Signer**: Keep the backend signer private key secure - it controls all transfers
3. **Admin Keys**: The admin has full control over both contracts
4. **Transfer Restrictions**: By default, only signature-based transfers are allowed
5. **Epoch Integrity**: Verify Merkle roots off-chain before committing epochs

## Development

### Update Backend Signer

```bash
cast send <NFT_ADDRESS> "setBackendSigner(address)" <NEW_SIGNER> \
  --rpc-url https://zkrpc.xsollazk.com \
  --private-key $OWNER_PRIVATE_KEY
```

### Grant Roles

```bash
# Grant MINTER_ROLE to another address
cast send <NFT_ADDRESS> "grantRole(bytes32,address)" \
  $(cast keccak "MINTER_ROLE") \
  <NEW_MINTER_ADDRESS> \
  --rpc-url https://zkrpc.xsollazk.com \
  --private-key $OWNER_PRIVATE_KEY
```

## License

MIT
