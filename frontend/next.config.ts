import type { NextConfig } from "next";
import { withTamagui } from "@tamagui/next-plugin";

const plugins = [
  withTamagui({
    config: "./src/config/tamagui.config.ts",
    components: ["@xsolla-zk/react"],
    outputCSS: "./public/tamagui.css",
    disableExtraction: process.env.NODE_ENV === "development",
    appDir: true,
    logTimings: true,
  }),
];

const nextConfig = (): NextConfig => {
  let config: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "steamcommunity-a.akamaihd.net",
          port: "",
          pathname: "/economy/image/**",
        },
        {
          protocol: "https",
          hostname: "ipfs.io",
          port: "",
          pathname: "/ipfs/**",
        },
        {
          protocol: "https",
          hostname: "gateway.pinata.cloud",
          port: "",
          pathname: "/ipfs/**",
        },
        {
          protocol: "https",
          hostname: "cloudflare-ipfs.com",
          port: "",
          pathname: "/ipfs/**",
        },
      ],
    },
    transpilePackages: [
      "react-native",
      "react-native-web",
      "react-native-svg",
      "react-native-reanimated",
      "@xsolla-zk/react",
      "@xsolla-zk/config",
      "@xsolla-zk/icons",
    ],
    webpack: (config, { isServer }) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "pino-pretty": false,
        "@react-native-async-storage/async-storage": false,
      };

      config.externals = config.externals || [];
      if (!isServer) {
        config.externals.push({
          "pino-pretty": "pino-pretty",
          "@react-native-async-storage/async-storage":
            "@react-native-async-storage/async-storage",
        });
      }

      return config;
    },
  };

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    };
  }

  return config;
};

export default nextConfig;
