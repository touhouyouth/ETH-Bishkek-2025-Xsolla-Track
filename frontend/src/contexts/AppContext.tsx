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
  address: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<UserState>(initialState);
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      setState((prev) => ({ ...prev, address }));
    } else {
      setState(initialState);
    }
  }, [address]);

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
