export const contractsConfig = [
  {
    name: "LoreNFT",
    abi: [
      {
        type: "constructor",
        inputs: [
          {
            name: "name_",
            type: "string",
            internalType: "string",
          },
          {
            name: "symbol_",
            type: "string",
            internalType: "string",
          },
          {
            name: "admin",
            type: "address",
            internalType: "address",
          },
          {
            name: "initialBaseUriEpoch",
            type: "string",
            internalType: "string",
          },
          {
            name: "reg",
            type: "address",
            internalType: "contract ILoreEpochs",
          },
          {
            name: "backendSigner_",
            type: "address",
            internalType: "address",
          },
        ],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "DEFAULT_ADMIN_ROLE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "MINTER_ROLE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "REGISTRY_ROLE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "TRANSFER_TYPEHASH",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "approve",
        inputs: [
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "backendSigner",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "address",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "balanceOf",
        inputs: [
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "baseUriEpoch",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "string",
            internalType: "string",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "batchMint",
        inputs: [
          {
            name: "to",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "tokenIds",
            type: "uint256[]",
            internalType: "uint256[]",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "completedTransfers",
        inputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "eip712Domain",
        inputs: [],
        outputs: [
          {
            name: "fields",
            type: "bytes1",
            internalType: "bytes1",
          },
          {
            name: "name",
            type: "string",
            internalType: "string",
          },
          {
            name: "version",
            type: "string",
            internalType: "string",
          },
          {
            name: "chainId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "verifyingContract",
            type: "address",
            internalType: "address",
          },
          {
            name: "salt",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "extensions",
            type: "uint256[]",
            internalType: "uint256[]",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "emitBatchMetadataUpdate",
        inputs: [
          {
            name: "fromTokenId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "toTokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "getApproved",
        inputs: [
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "address",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getRoleAdmin",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        outputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "grantRole",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "hasRole",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "isApprovedForAll",
        inputs: [
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
          {
            name: "operator",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "loreRegistry",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "contract ILoreEpochs",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "mint",
        inputs: [
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "name",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "string",
            internalType: "string",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "ownerOf",
        inputs: [
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "address",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "renounceRole",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "revokeRole",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "safeTransferFrom",
        inputs: [
          {
            name: "from",
            type: "address",
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "safeTransferFrom",
        inputs: [
          {
            name: "from",
            type: "address",
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "data",
            type: "bytes",
            internalType: "bytes",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "setApprovalForAll",
        inputs: [
          {
            name: "operator",
            type: "address",
            internalType: "address",
          },
          {
            name: "approved",
            type: "bool",
            internalType: "bool",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "setBackendSigner",
        inputs: [
          {
            name: "newSigner",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "setBaseUriEpoch",
        inputs: [
          {
            name: "newBase",
            type: "string",
            internalType: "string",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "setLoreRegistry",
        inputs: [
          {
            name: "reg",
            type: "address",
            internalType: "contract ILoreEpochs",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "setTransfersEnabled",
        inputs: [
          {
            name: "enabled",
            type: "bool",
            internalType: "bool",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "supportsInterface",
        inputs: [
          {
            name: "iid",
            type: "bytes4",
            internalType: "bytes4",
          },
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "symbol",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "string",
            internalType: "string",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "tokenByIndex",
        inputs: [
          {
            name: "index",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "tokenOfOwnerByIndex",
        inputs: [
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
          {
            name: "index",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "tokenURI",
        inputs: [
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [
          {
            name: "",
            type: "string",
            internalType: "string",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "tokenURIAtEpoch",
        inputs: [
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "epochId",
            type: "uint64",
            internalType: "uint64",
          },
        ],
        outputs: [
          {
            name: "",
            type: "string",
            internalType: "string",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "tokensOfOwner",
        inputs: [
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [
          {
            name: "",
            type: "uint256[]",
            internalType: "uint256[]",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "totalSupply",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "transferFrom",
        inputs: [
          {
            name: "from",
            type: "address",
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "transferWithSignature",
        inputs: [
          {
            name: "from",
            type: "address",
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "nonce",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "signature",
            type: "bytes",
            internalType: "bytes",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "transfersEnabled",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "event",
        name: "Approval",
        inputs: [
          {
            name: "owner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "approved",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "ApprovalForAll",
        inputs: [
          {
            name: "owner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "operator",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "approved",
            type: "bool",
            indexed: false,
            internalType: "bool",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "BatchMetadataUpdate",
        inputs: [
          {
            name: "_fromTokenId",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
          {
            name: "_toTokenId",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "EIP712DomainChanged",
        inputs: [],
        anonymous: false,
      },
      {
        type: "event",
        name: "MetadataUpdate",
        inputs: [
          {
            name: "_tokenId",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RoleAdminChanged",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "previousAdminRole",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "newAdminRole",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RoleGranted",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "sender",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RoleRevoked",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "sender",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "SetBackendSigner",
        inputs: [
          {
            name: "newSigner",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "SetBaseUriEpoch",
        inputs: [
          {
            name: "newBaseUriEpoch",
            type: "string",
            indexed: false,
            internalType: "string",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "SetLoreRegistry",
        inputs: [
          {
            name: "reg",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "SetTransfersEnabled",
        inputs: [
          {
            name: "enabled",
            type: "bool",
            indexed: false,
            internalType: "bool",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          {
            name: "from",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "TransferWithSignature",
        inputs: [
          {
            name: "from",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "to",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "tokenId",
            type: "uint256",
            indexed: true,
            internalType: "uint256",
          },
        ],
        anonymous: false,
      },
      {
        type: "error",
        name: "InvalidShortString",
        inputs: [],
      },
      {
        type: "error",
        name: "StringTooLong",
        inputs: [
          {
            name: "str",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    address: {
      "555776": "0x2117502fb0171de18DD27dC0bD331cf2C39F9F1C",
    },
  },
  {
    name: "LoreEpochs",
    abi: [
      {
        type: "constructor",
        inputs: [
          {
            name: "admin",
            type: "address",
            internalType: "address",
          },
          {
            name: "nft_",
            type: "address",
            internalType: "contract LoreNFT",
          },
        ],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "DEFAULT_ADMIN_ROLE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "GAME_ROLE",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "NFT_MANAGER",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "commitEpoch",
        inputs: [
          {
            name: "root",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "newBaseUriEpoch",
            type: "string",
            internalType: "string",
          },
          {
            name: "fromTs",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "toTs",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "batchFromTokenId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "batchToTokenId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "currentEpoch",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint64",
            internalType: "uint64",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "epochs",
        inputs: [
          {
            name: "epochId",
            type: "uint64",
            internalType: "uint64",
          },
        ],
        outputs: [
          {
            name: "root",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "fromTs",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "toTs",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "baseUri",
            type: "string",
            internalType: "string",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "getRoleAdmin",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        outputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "grantRole",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "hasRole",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "nft",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "contract LoreNFT",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "renounceRole",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "revokeRole",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "supportsInterface",
        inputs: [
          {
            name: "interfaceId",
            type: "bytes4",
            internalType: "bytes4",
          },
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool",
          },
        ],
        stateMutability: "view",
      },
      {
        type: "event",
        name: "EpochCommitted",
        inputs: [
          {
            name: "epochId",
            type: "uint64",
            indexed: true,
            internalType: "uint64",
          },
          {
            name: "root",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "fromTs",
            type: "uint64",
            indexed: false,
            internalType: "uint64",
          },
          {
            name: "toTs",
            type: "uint64",
            indexed: false,
            internalType: "uint64",
          },
          {
            name: "baseUriEpoch",
            type: "string",
            indexed: false,
            internalType: "string",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RoleAdminChanged",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "previousAdminRole",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "newAdminRole",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RoleGranted",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "sender",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
      {
        type: "event",
        name: "RoleRevoked",
        inputs: [
          {
            name: "role",
            type: "bytes32",
            indexed: true,
            internalType: "bytes32",
          },
          {
            name: "account",
            type: "address",
            indexed: true,
            internalType: "address",
          },
          {
            name: "sender",
            type: "address",
            indexed: true,
            internalType: "address",
          },
        ],
        anonymous: false,
      },
    ],
    address: {
      "555776": "0xC2259646b5e2b4b6da3e970965B83513f9Ca61B0",
    },
  },
];
