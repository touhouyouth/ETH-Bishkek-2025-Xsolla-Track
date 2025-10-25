import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";

export const xsollaZkChain = {
  id: 555776,
  name: "Xsolla ZK Sepolia",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://zkrpc-sepolia.xsollazk.com"] },
  },
} as const;

export const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: [xsollaZkChain],
    transports: {
      [xsollaZkChain.id]: http("https://zkrpc-sepolia.xsollazk.com"),
    },

    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    appName: "Xsolla Web3 Demo",

    appDescription: "Simple wallet connection demo",
    appUrl: "https://xsolla.com",
    appIcon: "https://xsolla.com/favicon.ico",
  }),
);
