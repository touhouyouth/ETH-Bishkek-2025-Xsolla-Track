import type { User, Item, State } from "../types.js";

const initialUsers: User[] = [
  {
    name: "adilet",
    steamId: "76561198260012732",
    walletAddress: "",
  },
  {
    name: "friend",
    steamId: "76561199185854372",
    walletAddress: "",
  },
];

const initialItems: Item[] = [
  {
    id: 1,
    classId: "2704470580",
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
