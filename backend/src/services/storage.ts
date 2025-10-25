type User = {
  id: number;
  name: string;
  steamId: string;
};

type Item = {
  id: number;
  classId: string;
  ownerSteamId: string;
  isTransferred: boolean;
  isClaimed: boolean;
};

type State = {
  users: User[];
  items: Item[];
  externalData: unknown;
  updatedAt?: number;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "adilet",
    steamId: "76561198260012732",
  },
  {
    id: 2,
    name: "friend",
    steamId: "76561199185854372",
  },
];

const initialItems: Item[] = [
  {
    id: 1,
    classId: "4977756017",
    ownerSteamId: "76561199185854372",
    isTransferred: false,
    isClaimed: true,
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
