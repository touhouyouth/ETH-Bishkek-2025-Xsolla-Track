import type { User, Item, State } from "../types.js";

const initialUsers: User[] = [
  {
    name: "adilet",
    steamId: "76561198260012732",
    walletAddress: "0x3Ba6810768c2F4FD3Be2c5508E214E68B514B35f",
  },
  {
    name: "friend",
    steamId: "76561199185854372",
    walletAddress: "0x9F7dd0BfA1fA430BDf276BD996f809F4b8E1cC9C",
  },
];

const initialItems: Item[] = [
  {
    id: 1,
    classId: "3450589820",
    ownerSteamId: "76561199185854372",
    oldOwnerSteamId: "76561198260012732",
    signatureGenerated: true,
    isClaimed: false,
  },
];

const initialState: State = {
  users: initialUsers,
  items: initialItems,
  externalData: null,
};

const state: State = initialState;

export const storage = {
  get: () => state,
  updateItem: (classId: string, itemNewValues: Partial<Item>) => {
    state.items = state.items.map((item) =>
      item.classId === classId ? { ...item, ...itemNewValues } : item
    );
  },
};
