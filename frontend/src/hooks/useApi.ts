"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SteamPlayerSummariesResponse } from "@/types/app";

// API утилиты для работы с бэкендом
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiItem {
  id: number;
  classId: string;
  ownerSteamId: string;
  oldOwnerSteamId: string;
  signatureGenerated: boolean;
  isClaimed: boolean;
  // Добавьте другие поля в зависимости от структуры данных
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ClaimSignatureRequest {
  steamId: string;
  itemId: string;
  walletAddress: string;
}

export interface ClaimSignatureResponse {
  signature: {
    signature: `0x${string}`;
    contractAddress: `0x${string}`;
    transferData: {
      to: `0x${string}`;
      from: `0x${string}`;
      tokenId: string;
      nonce: string;
      deadline: string;
    }
  }
}

export interface UserByWalletResponse {
  steamId: string;
}

// Функция для получения предметов пользователя
export async function getUserItems(
  steamId: string
): Promise<ApiResponse<{ items: ApiItem[] }>> {
  try {
    console.log(`📡 Fetching items for steamId: ${steamId}`);

    const response = await fetch(`${API_BASE_URL}/api/items/${steamId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched items for steamId ${steamId}:`, data);

    return { data };
  } catch (error) {
    console.error(`❌ Error fetching items for steamId ${steamId}:`, error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Функция для получения подписи для клейма
export async function getClaimSignature(
  request: ClaimSignatureRequest
): Promise<ApiResponse<ClaimSignatureResponse>> {
  try {
    console.log(`📡 Requesting claim signature for item ${request.itemId}`);

    const response = await fetch(`${API_BASE_URL}/api/claim/signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`✅ Successfully got claim signature:`, data);

    return { data };
  } catch (error) {
    console.error(`❌ Error getting claim signature:`, error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Функция для получения Steam ID по wallet address
export async function getUserByWallet(
  walletAddress: string
): Promise<ApiResponse<UserByWalletResponse>> {
  try {
    console.log(`📡 Fetching user for wallet: ${walletAddress}`);

    const response = await fetch(`${API_BASE_URL}/api/user/${walletAddress}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(
      `✅ Successfully fetched user for wallet ${walletAddress}:`,
      data
    );

    return { data };
  } catch (error) {
    console.error(`❌ Error fetching user for wallet ${walletAddress}:`, error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Функция для получения информации о Steam пользователе
export async function getSteamPlayerInfo(
  steamId: string
): Promise<ApiResponse<SteamPlayerSummariesResponse>> {
  try {
    console.log(`📡 Fetching Steam player info for steamId: ${steamId}`);

    // Используем наш Next.js API route для обхода CORS
    const response = await fetch(`/api/steam?steamid=${steamId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched Steam player info:`, data);

    return { data };
  } catch (error) {
    console.error(`❌ Error fetching Steam player info:`, error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Хук для получения предметов пользователя
export function useUserItems(steamId: string | undefined) {
  return useQuery({
    queryKey: ["userItems", steamId],
    queryFn: async () => {
      if (!steamId) {
        throw new Error("SteamId is required");
      }

      const result = await getUserItems(steamId);
      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!steamId,
    staleTime: 30 * 1000, // 30 секунд
  });
}

// Хук для получения подписи клейма
export function useClaimSignature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ClaimSignatureRequest) => {
      const result = await getClaimSignature(request);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      // Инвалидируем кэш предметов пользователя после успешного клейма
      queryClient.invalidateQueries({
        queryKey: ["userItems", variables.steamId],
      });

      console.log("✅ Claim signature obtained successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Failed to get claim signature:", error);
    },
  });
}

// Хук для получения информации о Steam пользователе
export function useSteamPlayerInfo(steamId: string | undefined) {
  return useQuery({
    queryKey: ["steamPlayerInfo", steamId],
    queryFn: async () => {
      if (!steamId) {
        throw new Error("SteamId is required");
      }

      const result = await getSteamPlayerInfo(steamId);
      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!steamId,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });
}
