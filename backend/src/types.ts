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
