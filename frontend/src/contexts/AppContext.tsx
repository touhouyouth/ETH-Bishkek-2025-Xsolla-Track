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

const initialState: UserState = {
  isLoading: true,
  address: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<UserState>(initialState);
  const { address, isConnecting, isReconnecting } = useAccount();

  useEffect(() => {
    const isLoading = isConnecting || isReconnecting;

    setState((prev) => ({
      ...prev,
      address: address ?? null,
      isLoading,
    }));
  }, [address, isConnecting, isReconnecting]);

  const reset = useCallback((): void => {
    setState(initialState);
  }, []);

  const value: AppContextType = {
    ...state,
    reset,
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
