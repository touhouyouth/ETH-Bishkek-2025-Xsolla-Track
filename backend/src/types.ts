export type User = {
  name: string;
  steamId: string;
  walletAddress: string;
};

export type Item = {
  id: number;
  classId: string;
  ownerSteamId: string;
  oldOwnerSteamId: string | null;
  signatureGenerated: boolean;
  isClaimed: boolean;
};

export type State = {
  users: User[];
  items: Item[];
  externalData: unknown;
  updatedAt?: number;
};

// Epoch-related types
export type EpochData = {
  epochId: bigint;
  root: `0x${string}`;
  fromTs: bigint;
  toTs: bigint;
  baseUri: string;
};

export type TokenMetadata = {
  classid: string;
  steam_id: string;
  tradable: number;
  name: string;
  type: string;
  icon_url: string;
  icon_url_large: string;
  descriptions: any[];
  tags: any[];
  [key: string]: any;
};

export type EpochCache = {
  epoch: EpochData;
  metadata: Map<string, TokenMetadata>; // classId -> metadata
  fetchedAt: number;
};

export type WalletHistory = {
  walletAddress: string;
  history: Array<{
    epochId: string;
    epochFromTs: string;
    epochTime: string; // Duration in seconds
    tokenId: string;
    steamId: string;
    tokenName: string;
    iconUrl: string;
  }>;
};
