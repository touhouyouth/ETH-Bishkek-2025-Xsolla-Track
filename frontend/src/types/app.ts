export interface UserState {
  address: string | null;
}

export interface AppContextType extends UserState {
  reset: () => void;
}
