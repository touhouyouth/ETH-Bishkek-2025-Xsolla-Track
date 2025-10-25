export type User = {
  id: number;
  name: string;
  steamId: string;
  walletAddress: string;
};

export type Item = {
  id: number;
  classId: string;
  ownerSteamId: string;
  oldOwnerSteamId: string | null;
  isTransferred: boolean;
  isClaimed: boolean;
};

export type State = {
  users: User[];
  items: Item[];
  externalData: unknown;
  updatedAt?: number;
};
