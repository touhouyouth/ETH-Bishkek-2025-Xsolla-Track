// Типы для React Query хуков LoreNFT

export interface LoreNftMintParams {
  to: `0x${string}`;
}

export interface LoreNftBatchMintParams {
  recipients: `0x${string}`[];
}

export interface LoreNftApproveParams {
  to: `0x${string}`;
  tokenId: bigint;
}

export interface LoreNftSetApprovalForAllParams {
  operator: `0x${string}`;
  approved: boolean;
}

export interface LoreNftTransferParams {
  from: `0x${string}`;
  to: `0x${string}`;
  tokenId: bigint;
}

export interface LoreNftSafeTransferParams {
  from: `0x${string}`;
  to: `0x${string}`;
  tokenId: bigint;
  data?: `0x${string}`;
}

export interface LoreNftTransferWithSignatureParams {
  from: `0x${string}`;
  to: `0x${string}`;
  tokenId: bigint;
  nonce: bigint;
  deadline: bigint;
  signature: `0x${string}`;
}

export interface LoreNftTokenDetails {
  tokenId: bigint;
  tokenUri: string;
  owner: `0x${string}`;
  approved?: `0x${string}`;
}

export interface LoreNftTokenWithMetadata extends LoreNftTokenDetails {
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  } | null;
}

export interface LoreNftUserProfile {
  balance: bigint;
  tokens: bigint[];
  isLoading: boolean;
  error: Error | null;
}

export interface LoreNftCollectionWithMetadata {
  tokens: bigint[];
  tokenDetails: LoreNftTokenDetails[];
  tokensWithMetadata: LoreNftTokenWithMetadata[];
  isLoading: boolean;
  error: Error | null;
}

export interface LoreNftContractInfo {
  name?: string;
  symbol?: string;
  totalSupply?: bigint;
  maxMintedId?: bigint;
  isLoading: boolean;
  error: Error | null;
}

export interface LoreNftSettings {
  transfersEnabled?: boolean;
  baseUriEpoch?: string;
  loreRegistry?: `0x${string}`;
  backendSigner?: `0x${string}`;
  isLoading: boolean;
  error: Error | null;
}
