"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAccount } from "wagmi";
import type { ReactNode } from "react";
import type { UserState } from "@/types/app";
import type { AppContextType } from "@/types/app";
import { getUserByWallet } from "@/hooks/useApi";

const initialState: UserState = {
  isLoading: true,
  address: undefined,
  steamId: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<UserState>(initialState);
  const { address, isConnecting, isReconnecting } = useAccount();

  const setSteamId = useCallback((steamId: string | null): void => {
    setState((prev) => ({
      ...prev,
      steamId,
    }));
  }, []);

  useEffect(() => {
    const isLoading = isConnecting || isReconnecting;

    setState((prev) => ({
      ...prev,
      address: address ?? undefined,
      isLoading,
    }));

    if (address && !isLoading) {
      getUserByWallet(address) // CHANGE to address
        .then((response) => {
          if (response.data) {
            setSteamId(response.data.steamId);
          } else {
            setSteamId(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching steamId:", error);
          setSteamId(null);
        });
    } else if (!address) {
      setSteamId(null);
    }
  }, [address, isConnecting, isReconnecting, setSteamId]);

  const reset = useCallback((): void => {
    setState(initialState);
  }, []);

  const value: AppContextType = {
    ...state,
    reset,
    setSteamId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
