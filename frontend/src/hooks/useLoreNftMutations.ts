"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeLoreNftTransferWithSignature } from "@/.contracts/abis";
import { wagmiConfig } from "@/config/wagmi.config";

export function useLoreNftTransferWithSignature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      from,
      to,
      tokenId,
      nonce,
      deadline,
      signature,
    }: {
      from: `0x${string}`;
      to: `0x${string}`;
      tokenId: bigint;
      nonce: bigint;
      deadline: bigint;
      signature: `0x${string}`;
    }) => {
      const hash = await writeLoreNftTransferWithSignature(wagmiConfig, {
        args: [from, to, tokenId, nonce, deadline, signature],
      });
      return hash;
    },
    onSuccess: (hash, variables) => {
      // Инвалидируем запросы для отправителя и получателя
      queryClient.invalidateQueries({
        queryKey: ["loreNft", "balance", variables.from],
      });
      queryClient.invalidateQueries({
        queryKey: ["loreNft", "balance", variables.to],
      });
      queryClient.invalidateQueries({
        queryKey: ["loreNft", "tokensOfOwner", variables.from],
      });
      queryClient.invalidateQueries({
        queryKey: ["loreNft", "tokensOfOwner", variables.to],
      });
      queryClient.invalidateQueries({
        queryKey: ["loreNft", "ownerOf", variables.tokenId.toString()],
      });
    },
  });
}
