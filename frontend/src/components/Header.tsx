"use client";

import { Stack, Button, Typography } from "@xsolla-zk/react";
import { Wallet, Logout } from "@xsolla-zk/icons";
import { useModal } from "connectkit";
import { useAccount, useDisconnect } from "wagmi";
import { useApp } from "@/contexts/AppContext";
import { useSteamPlayerInfo } from "@/hooks/useApi";
import Image from "next/image";

export default function Header() {
  const { steamId } = useApp();
  const { setOpen } = useModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Получаем информацию о Steam пользователе
  const {
    data: steamPlayerInfo,
    isLoading: steamInfoLoading,
    error: steamInfoError,
  } = useSteamPlayerInfo(steamId || undefined);

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal={20}
      paddingVertical={16}
      width="100%"
    >
      <Stack flexDirection="row" alignItems="center" gap={12}>
        <Typography preset="display.400.accent" color="#20DAFF">
          LoreProof
        </Typography>
      </Stack>

      <Stack flexDirection="row" alignItems="center" gap={20}></Stack>

      <Stack flexDirection="row" alignItems="center" gap={12}>
        {isConnected ? (
          <Stack flexDirection="row" alignItems="center" gap={8}>
            {/* Steam информация */}
            {steamInfoLoading ? (
              <Stack
                flexDirection="row"
                alignItems="center"
                gap={8}
                paddingHorizontal={12}
                paddingVertical={8}
                borderRadius={8}
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.1)"
                backgroundColor="rgba(20, 20, 20, 0.8)"
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#333",
                  }}
                />
                <Typography preset="compact.200.default" color="#888">
                  Загрузка Steam...
                </Typography>
              </Stack>
            ) : steamPlayerInfo?.response?.players?.[0] ? (
              <Stack
                flexDirection="row"
                alignItems="center"
                gap={8}
                paddingHorizontal={12}
                paddingVertical={8}
                borderRadius={8}
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.1)"
                backgroundColor="rgba(20, 20, 20, 0.8)"
              >
                <Image
                  src={steamPlayerInfo.response.players[0].avatarmedium}
                  alt={steamPlayerInfo.response.players[0].personaname}
                  width={32}
                  height={32}
                  style={{
                    borderRadius: "50%",
                    border: "2px solid #20DAFF",
                  }}
                />
                <Stack flexDirection="column" gap={2}>
                  <Typography preset="compact.200.accent" color="#20DAFF">
                    {steamPlayerInfo.response.players[0].personaname}
                  </Typography>
                  <Typography preset="compact.150.default" color="#888">
                    Steam ID: {steamId}
                  </Typography>
                </Stack>
              </Stack>
            ) : steamId ? (
              <Stack
                flexDirection="row"
                alignItems="center"
                gap={8}
                paddingHorizontal={12}
                paddingVertical={8}
                borderRadius={8}
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.1)"
                backgroundColor="rgba(20, 20, 20, 0.8)"
              >
                <Typography preset="compact.200.default" color="#888">
                  Steam ID: {steamId}
                </Typography>
              </Stack>
            ) : null}

            {/* Wallet информация */}
            <Stack
              flexDirection="row"
              alignItems="center"
              gap={8}
              paddingHorizontal={12}
              paddingVertical={16}
              borderRadius={8}
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.1)"
              backgroundColor="rgba(20, 20, 20, 0.8)"
            >
              <Wallet size={16} color="white" />
              <Typography preset="compact.250.default">
                {formatAddress(address!)}
              </Typography>
            </Stack>

            <Button
              onPress={handleDisconnect}
              size="small"
              borderRadius={8}
              paddingHorizontal={12}
              paddingVertical={8}
            >
              <Logout size={16} />
            </Button>
          </Stack>
        ) : (
          <Button
            onPress={() => setOpen(true)}
            variant="primary"
            size="medium"
            borderRadius={8}
            paddingHorizontal={16}
            paddingVertical={10}
            flexDirection="row"
            alignItems="center"
            gap={8}
          >
            <Wallet size={16} color="white" />
            <Typography preset="compact.250.accent">Connect Wallet</Typography>
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
