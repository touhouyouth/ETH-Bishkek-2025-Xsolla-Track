import { INftCard } from "@/types/app";
import { Button, Stack, Typography } from "@xsolla-zk/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NftCard({ 
  nft, 
  onClaim 
}: { 
  nft: INftCard; 
  onClaim?: () => void; 
}) {
  const router = useRouter();

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

  return (
    <Stack
      className="hover:scale-[1.05] hover:shadow-2xl transition-all duration-300 ease-out"
      flexDirection="column"
      width="100%"
      height="min-content"
      borderRadius={20}
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.1)"
      overflow="hidden"
      backgroundColor="rgba(20, 20, 20, 0.8)"
      backdropFilter="blur(10px)"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
    >
      {/* NFT Image */}
      <Stack position="relative" width="100%" height={200}>
        <Image
          src={nft.image}
          alt={nft.name}
          width={400}
          height={200}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Rarity Badge */}
        <Stack
          position="absolute"
          top={12}
          right={12}
          paddingHorizontal={8}
          paddingVertical={4}
          borderRadius={12}
          backgroundColor={getRarityColor(nft.rarity)}
        >
          <Typography preset="compact.200.accent" color="white">
            {nft.rarity}
          </Typography>
        </Stack>
      </Stack>

      {/* NFT Content */}
      <Stack padding={16} gap={12}>
        {/* Title and Hero */}
        <Stack gap={4}>
          <Typography preset="heading.400.default">{nft.name}</Typography>
          <Typography preset="compact.250.default">Hero: {nft.hero}</Typography>
        </Stack>

        {/* Description */}
        <Typography preset="compact.250.default">{nft.description}</Typography>

        <Typography preset="compact.200.default">Type: {nft.type}</Typography>

        {/* Action Buttons */}
        <Stack flexDirection="row" gap={8} marginTop={8}>
          <Button
            variant="primary"
            size="medium"
            flex={1}
            width="50%"
            height={40}
            borderRadius={8}
            onPress={() => router.push(`/nft/${nft.classid}`)}
          >
            <Typography preset="compact.250.accent">View Details</Typography>
          </Button>

          {nft.isNotClaimed && onClaim && (
            <Button
              onPress={onClaim}
              variant="secondary"
              size="medium"
              width="50%"
              height={40}
              borderRadius={8}
              paddingHorizontal={16}
            >
              <Typography preset="compact.250.default">Claim</Typography>
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
