export interface UserState {
  isLoading: boolean;
  address: string | null;
}

export interface AppContextType extends UserState {
  reset: () => void;
}

export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Mythical"
  | "Legendary"
  | "Immortal"
  | "Arcana"
  | "Ancient";

export interface INftCard {
  name: string;
  description: string;
  image: string;
  hero: string;
  type: string;
  rarity: Rarity;
  classid: string;
}
