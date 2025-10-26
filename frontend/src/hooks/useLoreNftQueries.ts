"use client";

import { useQuery } from "@tanstack/react-query";
import {
  readLoreNftTokensOfOwner,
  readLoreNftTokenUri,
  readLoreNftOwnerOf,
} from "@/.contracts/abis";
import { wagmiConfig } from "@/config/wagmi.config";

// Хук для получения токенов пользователя
export function useLoreNftTokensOfOwner(address?: `0x${string}` | undefined) {
  return useQuery({
    queryKey: ["loreNft", "tokensOfOwner", address],
    queryFn: async () => {
      if (!address) return [];
      const result = await readLoreNftTokensOfOwner(wagmiConfig, {
        args: [address],
      });

      return result;
    },
    enabled: !!address,
    staleTime: 30000, // 30 секунд
  });
}

// Хук для получения информации о конкретном токене
export function useLoreNftToken(tokenId: bigint | undefined) {
  const tokenUriQuery = useQuery({
    queryKey: ["loreNft", "tokenUri", tokenId?.toString()],
    queryFn: async () => {
      if (!tokenId) return null;
      const result = await readLoreNftTokenUri(wagmiConfig, {
        args: [tokenId],
      });
      return result;
    },
    enabled: !!tokenId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  const ownerQuery = useQuery({
    queryKey: ["loreNft", "ownerOf", tokenId?.toString()],
    queryFn: async () => {
      if (!tokenId) return null;
      const result = await readLoreNftOwnerOf(wagmiConfig, {
        args: [tokenId],
      });
      return result;
    },
    enabled: !!tokenId,
    staleTime: 30000, // 30 секунд
  });

  return {
    tokenUri: tokenUriQuery.data,
    owner: ownerQuery.data,
    isLoading: tokenUriQuery.isLoading || ownerQuery.isLoading,
    error: tokenUriQuery.error || ownerQuery.error,
  };
}
