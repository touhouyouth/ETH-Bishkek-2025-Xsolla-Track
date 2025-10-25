import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";

export const xsollaZkChain = {
  id: 555272,
  name: "Xsolla ZK Sepolia",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://zkrpc.xsollazk.com"] },
  },
} as const;

export const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${
          process.env.NEXT_PUBLIC_ALCHEMY_ID || ""
        }`
      ),
    },

    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    appName: "Xsolla Web3 Demo",

    appDescription: "Simple wallet connection demo",
    appUrl: "https://xsolla.com",
    appIcon: "https://xsolla.com/favicon.ico",
  })
);
