import { ContractConfig, defineConfig } from "@wagmi/cli";
import { actions } from "@wagmi/cli/plugins";
import { contractsConfig } from "./src/.contracts/_contracts";

export default defineConfig({
  out: "./src/.contracts/abis.ts",
  contracts: contractsConfig as ContractConfig<number, undefined>[],

  plugins: [
    actions({
      overridePackageName: "@wagmi/core",
    }),
  ],
});
