"use client";

import { getSteamImageUrl, IPFS_URL } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";

interface NftMetadata {
  classid: string;
  name: string;
  icon_url: string;
  isNotClaimed?: boolean;
  tags: Array<{
    category: string;
    localized_tag_name: string;
    localized_category_name: string;
  }>;
}

// Функция для получения метаданных одного NFT
async function fetchNftMetadata(
  classId: string,
  ipfsUrl?: string,
  isNotClaimed?: boolean
): Promise<NftMetadata> {
  const url = ipfsUrl
    ? `${ipfsUrl}/${classId}.json`
    : `${IPFS_URL}/${classId}.json`;

  console.log(`📡 Fetching metadata for class_id: ${classId} from: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch metadata for class_id ${classId}: ${response.statusText}`
    );
  }

  const rawMetadata = await response.json();
  console.log(`✅ Got raw metadata for class_id ${classId}:`, rawMetadata);

  // Маппим данные из IPFS в наш формат
  const metadata: NftMetadata = {
    classid: rawMetadata.classid || classId,
    name: rawMetadata.name || "Unknown",
    icon_url: getSteamImageUrl(rawMetadata.icon_url || ""),
    tags: rawMetadata.tags || [],
    isNotClaimed: isNotClaimed || false,
  };

  console.log(`✅ Processed metadata for class_id ${classId}:`, metadata);

  return metadata;
}

// Хук для получения метаданных всех NFT
export function useNftMetadata(
  classIds: string[] | undefined,
  ipfsUrl?: string,
  isNotClaimed?: boolean
) {
  return useQuery({
    queryKey: ["nftMetadata", classIds, ipfsUrl],
    queryFn: async () => {
      if (!classIds || classIds.length === 0 || !ipfsUrl) {
        return [];
      }

      try {
        // Получаем метаданные для всех токенов параллельно
        console.log(`📡 Starting metadata fetch for ${classIds.length} tokens`);

        const metadataPromises = classIds.map((classId) =>
          fetchNftMetadata(classId.toString(), ipfsUrl, isNotClaimed)
        );

        // Используем Promise.allSettled вместо Promise.all
        const results = await Promise.allSettled(metadataPromises);

        // Фильтруем только успешные результаты
        const metadataArray = results
          .map((result, index) => {
            if (result.status === "fulfilled") {
              return result.value;
            } else {
              console.warn(
                `⚠️ Failed to fetch metadata for classId ${classIds[index]}:`,
                result.reason
              );
              return null;
            }
          })
          .filter((metadata): metadata is NftMetadata => metadata !== null);

        console.log(
          `✅ Successfully fetched ${metadataArray.length}/${classIds.length} metadata items:`,
          metadataArray
        );
        return metadataArray;
      } catch (error) {
        console.error("❌ Error fetching NFT metadata:", error);
        throw error;
      }
    },
    enabled: !!classIds && classIds.length > 0 && !!ipfsUrl,
    gcTime: 10 * 60 * 1000, // 10 минут
    refetchOnWindowFocus: false, // Не перезапрашивать при фокусе окна
    refetchOnMount: false, // Не перезапрашивать при монтировании
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
