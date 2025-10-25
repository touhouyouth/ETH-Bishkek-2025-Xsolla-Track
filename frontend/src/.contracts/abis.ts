import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from "@wagmi/core/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LoreNFT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const loreNftAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "name_", internalType: "string", type: "string" },
      { name: "symbol_", internalType: "string", type: "string" },
      { name: "admin", internalType: "address", type: "address" },
      { name: "initialBaseUriEpoch", internalType: "string", type: "string" },
      { name: "reg", internalType: "contract ILoreEpochs", type: "address" },
      { name: "backendSigner_", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "REGISTRY_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "TRANSFER_TYPEHASH",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "backendSigner",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "baseUriEpoch",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address[]", type: "address[]" },
      { name: "tokenIds", internalType: "uint256[]", type: "uint256[]" },
    ],
    name: "batchMint",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    name: "completedTransfers",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields", internalType: "bytes1", type: "bytes1" },
      { name: "name", internalType: "string", type: "string" },
      { name: "version", internalType: "string", type: "string" },
      { name: "chainId", internalType: "uint256", type: "uint256" },
      { name: "verifyingContract", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "extensions", internalType: "uint256[]", type: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "fromTokenId", internalType: "uint256", type: "uint256" },
      { name: "toTokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "emitBatchMetadataUpdate",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "tokenId", internalType: "uint256", type: "uint256" }],
    name: "getApproved",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "role", internalType: "bytes32", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "operator", internalType: "address", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "loreRegistry",
    outputs: [
      { name: "", internalType: "contract ILoreEpochs", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "tokenId", internalType: "uint256", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "operator", internalType: "address", type: "address" },
      { name: "approved", internalType: "bool", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newSigner", internalType: "address", type: "address" }],
    name: "setBackendSigner",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newBase", internalType: "string", type: "string" }],
    name: "setBaseUriEpoch",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "reg", internalType: "contract ILoreEpochs", type: "address" },
    ],
    name: "setLoreRegistry",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "enabled", internalType: "bool", type: "bool" }],
    name: "setTransfersEnabled",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "iid", internalType: "bytes4", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "index", internalType: "uint256", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "index", internalType: "uint256", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "tokenId", internalType: "uint256", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "tokenId", internalType: "uint256", type: "uint256" },
      { name: "epochId", internalType: "uint64", type: "uint64" },
    ],
    name: "tokenURIAtEpoch",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "tokensOfOwner",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "tokenId", internalType: "uint256", type: "uint256" },
      { name: "nonce", internalType: "uint256", type: "uint256" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "signature", internalType: "bytes", type: "bytes" },
    ],
    name: "transferWithSignature",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "transfersEnabled",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "approved",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "tokenId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "operator",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "approved", internalType: "bool", type: "bool", indexed: false },
    ],
    name: "ApprovalForAll",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "_fromTokenId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "_toTokenId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "BatchMetadataUpdate",
  },
  { type: "event", anonymous: false, inputs: [], name: "EIP712DomainChanged" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "_tokenId",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "MetadataUpdate",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "previousAdminRole",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "newAdminRole",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
    ],
    name: "RoleAdminChanged",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "RoleGranted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "RoleRevoked",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "newSigner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "SetBackendSigner",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "newBaseUriEpoch",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "SetBaseUriEpoch",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "reg", internalType: "address", type: "address", indexed: true },
    ],
    name: "SetLoreRegistry",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "enabled", internalType: "bool", type: "bool", indexed: false },
    ],
    name: "SetTransfersEnabled",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "tokenId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
    ],
    name: "Transfer",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "tokenId",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
    ],
    name: "TransferWithSignature",
  },
  { type: "error", inputs: [], name: "InvalidShortString" },
  {
    type: "error",
    inputs: [{ name: "str", internalType: "string", type: "string" }],
    name: "StringTooLong",
  },
] as const;

/**
 *
 */
export const loreNftAddress = {
  555776: "0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C",
} as const;

/**
 *
 */
export const loreNftConfig = {
  address: loreNftAddress,
  abi: loreNftAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__
 *
 *
 */
export const readLoreNft = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 *
 */
export const readLoreNftDefaultAdminRole = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "DEFAULT_ADMIN_ROLE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"MINTER_ROLE"`
 *
 *
 */
export const readLoreNftMinterRole = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "MINTER_ROLE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"REGISTRY_ROLE"`
 *
 *
 */
export const readLoreNftRegistryRole = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "REGISTRY_ROLE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"TRANSFER_TYPEHASH"`
 *
 *
 */
export const readLoreNftTransferTypehash = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "TRANSFER_TYPEHASH",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"backendSigner"`
 *
 *
 */
export const readLoreNftBackendSigner = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "backendSigner",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"balanceOf"`
 *
 *
 */
export const readLoreNftBalanceOf = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"baseUriEpoch"`
 *
 *
 */
export const readLoreNftBaseUriEpoch = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "baseUriEpoch",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"completedTransfers"`
 *
 *
 */
export const readLoreNftCompletedTransfers = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "completedTransfers",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"eip712Domain"`
 *
 *
 */
export const readLoreNftEip712Domain = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "eip712Domain",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"getApproved"`
 *
 *
 */
export const readLoreNftGetApproved = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "getApproved",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 *
 */
export const readLoreNftGetRoleAdmin = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "getRoleAdmin",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"hasRole"`
 *
 *
 */
export const readLoreNftHasRole = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "hasRole",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"isApprovedForAll"`
 *
 *
 */
export const readLoreNftIsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "isApprovedForAll",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"loreRegistry"`
 *
 *
 */
export const readLoreNftLoreRegistry = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "loreRegistry",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"name"`
 *
 *
 */
export const readLoreNftName = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "name",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"ownerOf"`
 *
 *
 */
export const readLoreNftOwnerOf = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "ownerOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"supportsInterface"`
 *
 *
 */
export const readLoreNftSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "supportsInterface",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"symbol"`
 *
 *
 */
export const readLoreNftSymbol = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "symbol",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"tokenByIndex"`
 *
 *
 */
export const readLoreNftTokenByIndex = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "tokenByIndex",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 *
 *
 */
export const readLoreNftTokenOfOwnerByIndex = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "tokenOfOwnerByIndex",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"tokenURI"`
 *
 *
 */
export const readLoreNftTokenUri = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "tokenURI",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"tokenURIAtEpoch"`
 *
 *
 */
export const readLoreNftTokenUriAtEpoch = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "tokenURIAtEpoch",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"tokensOfOwner"`
 *
 *
 */
export const readLoreNftTokensOfOwner = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "tokensOfOwner",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"totalSupply"`
 *
 *
 */
export const readLoreNftTotalSupply = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"transfersEnabled"`
 *
 *
 */
export const readLoreNftTransfersEnabled = /*#__PURE__*/ createReadContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "transfersEnabled",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__
 *
 *
 */
export const writeLoreNft = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const writeLoreNftApprove = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"batchMint"`
 *
 *
 */
export const writeLoreNftBatchMint = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "batchMint",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"emitBatchMetadataUpdate"`
 *
 *
 */
export const writeLoreNftEmitBatchMetadataUpdate =
  /*#__PURE__*/ createWriteContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "emitBatchMetadataUpdate",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"grantRole"`
 *
 *
 */
export const writeLoreNftGrantRole = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "grantRole",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"mint"`
 *
 *
 */
export const writeLoreNftMint = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"renounceRole"`
 *
 *
 */
export const writeLoreNftRenounceRole = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "renounceRole",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"revokeRole"`
 *
 *
 */
export const writeLoreNftRevokeRole = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "revokeRole",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 *
 */
export const writeLoreNftSafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "safeTransferFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 *
 */
export const writeLoreNftSetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "setApprovalForAll",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setBackendSigner"`
 *
 *
 */
export const writeLoreNftSetBackendSigner = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "setBackendSigner",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setBaseUriEpoch"`
 *
 *
 */
export const writeLoreNftSetBaseUriEpoch = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "setBaseUriEpoch",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setLoreRegistry"`
 *
 *
 */
export const writeLoreNftSetLoreRegistry = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "setLoreRegistry",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setTransfersEnabled"`
 *
 *
 */
export const writeLoreNftSetTransfersEnabled =
  /*#__PURE__*/ createWriteContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "setTransfersEnabled",
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const writeLoreNftTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "transferFrom",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"transferWithSignature"`
 *
 *
 */
export const writeLoreNftTransferWithSignature =
  /*#__PURE__*/ createWriteContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "transferWithSignature",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__
 *
 *
 */
export const simulateLoreNft = /*#__PURE__*/ createSimulateContract({
  abi: loreNftAbi,
  address: loreNftAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const simulateLoreNftApprove = /*#__PURE__*/ createSimulateContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "approve",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"batchMint"`
 *
 *
 */
export const simulateLoreNftBatchMint = /*#__PURE__*/ createSimulateContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "batchMint",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"emitBatchMetadataUpdate"`
 *
 *
 */
export const simulateLoreNftEmitBatchMetadataUpdate =
  /*#__PURE__*/ createSimulateContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "emitBatchMetadataUpdate",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"grantRole"`
 *
 *
 */
export const simulateLoreNftGrantRole = /*#__PURE__*/ createSimulateContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "grantRole",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"mint"`
 *
 *
 */
export const simulateLoreNftMint = /*#__PURE__*/ createSimulateContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "mint",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"renounceRole"`
 *
 *
 */
export const simulateLoreNftRenounceRole = /*#__PURE__*/ createSimulateContract(
  { abi: loreNftAbi, address: loreNftAddress, functionName: "renounceRole" },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"revokeRole"`
 *
 *
 */
export const simulateLoreNftRevokeRole = /*#__PURE__*/ createSimulateContract({
  abi: loreNftAbi,
  address: loreNftAddress,
  functionName: "revokeRole",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 *
 *
 */
export const simulateLoreNftSafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "safeTransferFrom",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 *
 *
 */
export const simulateLoreNftSetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "setApprovalForAll",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setBackendSigner"`
 *
 *
 */
export const simulateLoreNftSetBackendSigner =
  /*#__PURE__*/ createSimulateContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "setBackendSigner",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setBaseUriEpoch"`
 *
 *
 */
export const simulateLoreNftSetBaseUriEpoch =
  /*#__PURE__*/ createSimulateContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "setBaseUriEpoch",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setLoreRegistry"`
 *
 *
 */
export const simulateLoreNftSetLoreRegistry =
  /*#__PURE__*/ createSimulateContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "setLoreRegistry",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"setTransfersEnabled"`
 *
 *
 */
export const simulateLoreNftSetTransfersEnabled =
  /*#__PURE__*/ createSimulateContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "setTransfersEnabled",
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const simulateLoreNftTransferFrom = /*#__PURE__*/ createSimulateContract(
  { abi: loreNftAbi, address: loreNftAddress, functionName: "transferFrom" },
);

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link loreNftAbi}__ and `functionName` set to `"transferWithSignature"`
 *
 *
 */
export const simulateLoreNftTransferWithSignature =
  /*#__PURE__*/ createSimulateContract({
    abi: loreNftAbi,
    address: loreNftAddress,
    functionName: "transferWithSignature",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__
 *
 *
 */
export const watchLoreNftEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: loreNftAbi,
  address: loreNftAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"Approval"`
 *
 *
 */
export const watchLoreNftApprovalEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: loreNftAbi, address: loreNftAddress, eventName: "Approval" },
);

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"ApprovalForAll"`
 *
 *
 */
export const watchLoreNftApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "ApprovalForAll",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"BatchMetadataUpdate"`
 *
 *
 */
export const watchLoreNftBatchMetadataUpdateEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "BatchMetadataUpdate",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 *
 *
 */
export const watchLoreNftEip712DomainChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "EIP712DomainChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"MetadataUpdate"`
 *
 *
 */
export const watchLoreNftMetadataUpdateEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "MetadataUpdate",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 *
 */
export const watchLoreNftRoleAdminChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "RoleAdminChanged",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"RoleGranted"`
 *
 *
 */
export const watchLoreNftRoleGrantedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "RoleGranted",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 *
 */
export const watchLoreNftRoleRevokedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "RoleRevoked",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"SetBackendSigner"`
 *
 *
 */
export const watchLoreNftSetBackendSignerEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "SetBackendSigner",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"SetBaseUriEpoch"`
 *
 *
 */
export const watchLoreNftSetBaseUriEpochEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "SetBaseUriEpoch",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"SetLoreRegistry"`
 *
 *
 */
export const watchLoreNftSetLoreRegistryEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "SetLoreRegistry",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"SetTransfersEnabled"`
 *
 *
 */
export const watchLoreNftSetTransfersEnabledEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "SetTransfersEnabled",
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"Transfer"`
 *
 *
 */
export const watchLoreNftTransferEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: loreNftAbi, address: loreNftAddress, eventName: "Transfer" },
);

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link loreNftAbi}__ and `eventName` set to `"TransferWithSignature"`
 *
 *
 */
export const watchLoreNftTransferWithSignatureEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: loreNftAbi,
    address: loreNftAddress,
    eventName: "TransferWithSignature",
  });
