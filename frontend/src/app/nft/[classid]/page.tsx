"use client";

import { useParams } from "next/navigation";
import {
  useLoreEpochsCurrentEpoch,
  useLoreEpochsEpochs,
} from "@/hooks/readLoreEpochQueries";
import { useNftMetadata } from "@/hooks";
import { useMemo } from "react";
import { Stack, Typography, Button } from "@xsolla-zk/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TradeHistory from "@/components/TradeHistory";

export default function NftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classid = params.classid as string;
  const { data: currentEpoch } = useLoreEpochsCurrentEpoch();
  const { data: epochs } = useLoreEpochsEpochs(Number(currentEpoch));

  const {
    data: metadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useNftMetadata([classid], epochs?.[3]);

  const nftData = useMemo(() => {
    if (metadata && metadata.length > 0) {
      return metadata[0];
    }
    return null;
  }, [metadata]);

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "#b0c3d9";
      case "uncommon":
        return "#5e98d9";
      case "rare":
        return "#4b69ff";
      case "mythical":
        return "#8847ff";
      case "legendary":
        return "#d32ce6";
      case "immortal":
        return "#b28a33";
      case "arcana":
        return "#ade55c";
      case "ancient":
        return "#eb4b4b";
      default:
        return "#b0c3d9";
    }
  };

  if (metadataLoading) {
    return (
      <Stack
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        padding={40}
        backgroundColor="#0a0a0a"
      >
        <Typography preset="heading.400.default" color="white">
          Загрузка NFT...
        </Typography>
      </Stack>
    );
  }

  if (metadataError || !nftData) {
    return (
      <Stack
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        padding={40}
        backgroundColor="#0a0a0a"
      >
        <Typography preset="heading.400.default" color="red">
          Error loading NFT
        </Typography>
        <Button variant="primary" onPress={() => router.back()} marginTop={20}>
          Back
        </Button>
      </Stack>
    );
  }

  const heroTag = nftData.tags.find((tag) => tag.category === "Hero");
  const rarityTag = nftData.tags.find((tag) => tag.category === "Rarity");
  const typeTag = nftData.tags.find((tag) => tag.category === "Type");

  return (
    <Stack
      flexDirection="column"
      minHeight="100vh"
      backgroundColor="#0a0a0a"
      padding={20}
    >
      {/* Header */}
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={40}
        paddingTop={20}
      >
        <Button
          variant="secondary"
          onPress={() => router.back()}
          paddingHorizontal={16}
          paddingVertical={8}
        >
          <Typography preset="primary">← Back</Typography>
        </Button>
        <Typography preset="heading.400.default" color="white">
          NFT Details
        </Typography>
        <div style={{ width: 100 }} /> {/* Spacer for centering */}
      </Stack>

      {/* NFT Content */}
      <Stack
        flexDirection="row"
        gap={40}
        alignItems="flex-start"
        maxWidth={1200}
        marginHorizontal="auto"
        width="100%"
      >
        {/* NFT Image */}
        <Stack
          flex={1}
          maxWidth={500}
          borderRadius={20}
          overflow="hidden"
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.1)"
          backgroundColor="rgba(20, 20, 20, 0.8)"
          backdropFilter="blur(10px)"
        >
          <Stack position="relative" width="100%" height={400}>
            <Image
              src={nftData.icon_url}
              alt={nftData.name}
              width={500}
              height={400}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Rarity Badge */}
            <Stack
              position="absolute"
              top={16}
              right={16}
              paddingHorizontal={12}
              paddingVertical={6}
              borderRadius={12}
              backgroundColor={getRarityColor(
                rarityTag?.localized_tag_name || "common"
              )}
            >
              <Typography preset="compact.200.accent" color="white">
                {rarityTag?.localized_tag_name || "Unknown"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* NFT Details */}
        <Stack flex={1} gap={24} padding={20}>
          <Stack gap={16}>
            <Typography
              preset="display.500.default"
              color="white"
              style={{ fontSize: "2.5rem", fontWeight: "bold" }}
            >
              {nftData.name}
            </Typography>

            <Typography
              preset="heading.300.default"
              color="#a0a0a0"
              style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
            >
              Class ID: {nftData.classid}
            </Typography>
          </Stack>

          {/* Tags */}
          <Stack gap={16}>
            <Stack gap={8}>
              <Typography preset="heading.400.default" color="white">
                Hero
              </Typography>
              <Typography preset="compact.250.default" color="#a0a0a0">
                {heroTag?.localized_tag_name || "Unknown"}
              </Typography>
            </Stack>

            <Stack gap={8}>
              <Typography preset="heading.400.default" color="white">
                Type
              </Typography>
              <Typography preset="compact.250.default" color="#a0a0a0">
                {typeTag?.localized_tag_name || "Unknown"}
              </Typography>
            </Stack>

            <Stack gap={8}>
              <Typography preset="heading.400.default" color="white">
                Rarity
              </Typography>
              <Typography preset="compact.250.default" color="#a0a0a0">
                {rarityTag?.localized_tag_name || "Unknown"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Trade History Section */}
      <Stack
        maxWidth={1200}
        marginHorizontal="auto"
        width="100%"
        marginTop={40}
      >
        <TradeHistory classid={classid} />
      </Stack>
    </Stack>
  );
}
