import { createTamagui } from "@xsolla-zk/react";
import { webConfig } from "@xsolla-zk/config/web";

export const config = createTamagui(webConfig);

export type Conf = typeof config;

declare module "@xsolla-zk/react" {
  interface TamaguiCustomConfig extends Conf {}
}
