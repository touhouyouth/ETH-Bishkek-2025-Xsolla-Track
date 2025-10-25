export interface UserState {
  isLoading: boolean;
  address: string | null;
}

export interface AppContextType extends UserState {
  reset: () => void;
}
