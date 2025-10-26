"use client";

import { Stack, Typography } from "@xsolla-zk/react";
import dynamic from "next/dynamic";
import { useApp } from "@/contexts/AppContext";
import Loader from "@/components/Loader";

const NftList = dynamic(() => import("@/components/NftList"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function Home() {
  const { address, isLoading } = useApp();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Stack flexDirection="column" width="100%" minHeight="100vh">
      {/* Hero Section */}
      <Stack
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingVertical={80}
        paddingHorizontal={20}
        position="relative"
        overflow="hidden"
        backgroundColor="#0a0a0a"
      >
        {/* Hero Content */}
        <Stack
          flexDirection="column"
          alignItems="center"
          gap={24}
          maxWidth={800}
        >
          <Typography
            preset="display.600.default"
            color="$border.info-primary"
            style={{
              backgroundClip: "text",
              background: "#20DAFF",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "3.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            LoreProof
          </Typography>

          <Typography
            preset="heading.400.default"
            textAlign="center"
            style={{
              color: "#a0a0a0",
              fontSize: "1.25rem",
              lineHeight: "1.6",
              maxWidth: "600px",
            }}
          >
            Proof of Ownership. Proof of Story. Proof of Legend. <br />
            Turn every in-game asset into a living collectible with verifiable
            ownership history.
          </Typography>

          <Typography
            preset="heading.400.default"
            style={{
              color: "#a0a0a0",
              fontSize: "1.25rem",
              lineHeight: "1.6",
              maxWidth: "600px",
            }}
          ></Typography>
        </Stack>
      </Stack>

      {/* Collection Section */}
      {address && (
        <Stack
          flexDirection="column"
          paddingVertical={60}
          paddingHorizontal={20}
          backgroundColor="#0a0a0a"
        >
          <Stack alignItems="center" marginBottom={40}>
            <Typography
              preset="display.500.default"
              style={{
                color: "#ffffff",
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Your NFT Collection
            </Typography>
            <Typography
              preset="heading.300.default"
              style={{
                color: "#888",
                fontSize: "1rem",
                textAlign: "center",
                maxWidth: "500px",
              }}
            >
              Explore your unique collection of Lore NFTs. Each card tells a
              story and represents a piece of the digital universe.
            </Typography>
          </Stack>

          <NftList />
        </Stack>
      )}

      <Stack
        flexDirection="column"
        paddingVertical={60}
        paddingHorizontal={20}
        backgroundColor="#0a0a0a"
      ></Stack>
    </Stack>
  );
}
