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

export default () => {
  let config: NextConfig = {
    transpilePackages: [
      "react-native",
      "react-native-web",
      "react-native-svg",
      "react-native-reanimated",
      "@xsolla-zk/react",
      "@xsolla-zk/config",
      "@xsolla-zk/icons",
    ],
  };

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    };
  }

  return config;
};
