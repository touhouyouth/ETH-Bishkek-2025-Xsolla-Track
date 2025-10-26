export interface UserState {
  isLoading: boolean;
  address: `0x${string}` | undefined;
  steamId: string | null;
}

export interface AppContextType extends UserState {
  reset: () => void;
  setSteamId: (steamId: string | null) => void;
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
  isNotClaimed?: boolean;
}

// Steam API типы
export interface SteamPlayer {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  commentpermission: number;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: number;
  primaryclanid: string;
  timecreated: number;
  personastateflags: number;
}

export interface SteamPlayerSummariesResponse {
  response: {
    players: SteamPlayer[];
  };
}
