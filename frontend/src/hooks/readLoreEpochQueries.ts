
import { useQuery } from "@tanstack/react-query";
import {
    readLoreEpochsCurrentEpoch,
  readLoreEpochsEpochs
} from "@/.contracts/abis";
import { wagmiConfig } from "@/config/wagmi.config";

export function useLoreEpochsEpochs(epochId: number | undefined) {
  return useQuery({
    queryKey: ["loreEpoch", "epochs", epochId],
    queryFn: async () => {
      if (!epochId) return null;
      const result = await readLoreEpochsEpochs(wagmiConfig, {
        args: [BigInt(epochId)],
      });
      return result;
    },
    enabled: !!epochId,
    staleTime: 30000, // 30 секунд
  });
}

export function useLoreEpochsCurrentEpoch() {
  return useQuery({
    queryKey: ["loreEpoch", "currentEpoch"],
    queryFn: async () => {
      const result = await readLoreEpochsCurrentEpoch(wagmiConfig, {});
      return result;
    },
  });
}
