"use client";

import { Stack, TamaguiProvider } from "@xsolla-zk/react";
import { config } from "../config/tamagui.config";
import { AppContextProvider } from "@/contexts/AppContext";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/config/wagmi.config";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import Header from "../components/Header";

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            <AppContextProvider>
              <Stack
                flexDirection="column"
                flex={1}
                height="100vh"
                width="100vw"
              >
                <Header />
                <Stack flex={1} padding={20} className="overflow-x-hidden">
                  {children}
                </Stack>
              </Stack>
            </AppContextProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </TamaguiProvider>
  );
}
