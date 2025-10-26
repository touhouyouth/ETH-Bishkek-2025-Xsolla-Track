"use client";

import {
  useClaimSignature,
  useLoreNftTokensOfOwner,
  useLoreNftTransferWithSignature,
  useNftMetadata,
  useUserItems,
} from "@/hooks";
import NftCard from "./NftCard";
import { Rarity } from "@/types/app";
import {
  useLoreEpochsCurrentEpoch,
  useLoreEpochsEpochs,
} from "@/hooks/readLoreEpochQueries";
import { useEffect, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";

export default function NftList() {
  const { steamId, address } = useApp();
  const {
    data: tokens,
    isLoading: tokensLoading,
    error: tokensError,
  } = useLoreNftTokensOfOwner(address);
  const { data: currentEpoch } = useLoreEpochsCurrentEpoch();
  const { data: epochs } = useLoreEpochsEpochs(Number(currentEpoch));
  const { data: userItems } = useUserItems(steamId ?? undefined);
  const { mutateAsync } = useClaimSignature();
  const { mutateAsync: transferWithSignature } =
    useLoreNftTransferWithSignature();
  const nftTokenIds = useMemo(() => {
    return tokens?.map((token) => token.toString()) || [];
  }, [tokens]);

  const userItemIds = useMemo(() => {
    return userItems?.items?.map((item) => item.classId) || [];
  }, [userItems]);

  useEffect(() => {
    console.log("NFT Token IDs:", nftTokenIds);
    console.log("User Item IDs:", userItemIds);
  }, [nftTokenIds, userItemIds]);

  const {
    data: nftMetadata,
    isLoading: nftMetadataLoading,
    error: nftMetadataError,
  } = useNftMetadata(nftTokenIds, epochs?.[3]);

  const {
    data: userItemMetadata,
    isLoading: userItemMetadataLoading,
    error: userItemMetadataError,
  } = useNftMetadata(userItemIds, epochs?.[3], true);

  const handleClaim = async (classid: string) => {
    if (address && steamId) {
      const signatureData = await mutateAsync({
        steamId: steamId,
        itemId: classid,
        walletAddress: address,
      });
      console.log("Claim signature data:", signatureData);

      if (signatureData?.signature)
        transferWithSignature({
          from: signatureData.signature.transferData.from,
          to: signatureData.signature.transferData.to,
          tokenId: BigInt(classid),
          nonce: BigInt(signatureData?.signature.transferData.nonce),
          deadline: BigInt(signatureData?.signature.transferData.deadline),
          signature: signatureData?.signature.signature,
        });
    }
  };

  // Объединяем метаданные из NFT токенов и пользовательских предметов
  const allMetadata = useMemo(() => {
    const nftData = (nftMetadata || []).map((item) => ({
      ...item,
      source: "nft",
    }));
    const userItemData = (userItemMetadata || []).map((item) => ({
      ...item,
      source: "userItem",
    }));

    // Создаем Map для удаления дубликатов по classid
    const uniqueMetadata = new Map();

    // Сначала добавляем NFT данные
    nftData.forEach((item) => {
      uniqueMetadata.set(item.classid, item);
    });

    // Затем добавляем user item данные (перезаписывают NFT если есть дубликат)
    userItemData.forEach((item) => {
      uniqueMetadata.set(item.classid, item);
    });

    const result = Array.from(uniqueMetadata.values());
    console.log("Combined metadata:", result);

    return result;
  }, [nftMetadata, userItemMetadata]);

  // Показываем ошибку
  if (tokensError || nftMetadataError || userItemMetadataError) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        <p>
          Loading error:{" "}
          {tokensError?.message ||
            nftMetadataError?.message ||
            userItemMetadataError?.message}
        </p>
      </div>
    );
  }

  if (
    (!tokens || tokens.length === 0) &&
    (!userItems || userItems.items.length === 0)
  ) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>No NFTs or items found</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
        padding: "0",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {allMetadata?.map((nft) => {
        const heroTag = nft.tags.find(
          (tag: { category: string; localized_tag_name: string }) =>
            tag.category === "Hero"
        );
        const rarityTag = nft.tags.find(
          (tag: { category: string; localized_tag_name: string }) =>
            tag.category === "Rarity"
        );
        const typeTag = nft.tags.find(
          (tag: { category: string; localized_tag_name: string }) =>
            tag.category === "Type"
        );

        return (
          <NftCard
            key={`${nft.classid}-${nft.source || "default"}`}
            onClaim={() => handleClaim(nft.classid)}
            nft={{
              name: nft.name,
              description: `Class ID: ${nft.classid}`,
              image: nft.icon_url,
              hero: heroTag?.localized_tag_name || "Unknown",
              type: typeTag?.localized_tag_name || "Unknown",
              rarity: rarityTag?.localized_tag_name as Rarity,
              classid: nft.classid,
              isNotClaimed: nft.isNotClaimed || false,
            }}
          />
        );
      })}
    </div>
  );
}
