"use client";

import { TamaguiProvider } from "@xsolla-zk/react";
import { config } from "../config/tamagui.config";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      {children}
    </TamaguiProvider>
  );
}
