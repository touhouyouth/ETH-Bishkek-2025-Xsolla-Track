"use client";

import { Stack, Typography } from "@xsolla-zk/react";
import { useSteamPlayerInfo } from "@/hooks/useApi";
import Image from "next/image";
import { ArrowRight } from "@xsolla-zk/icons";

interface TradeHistoryItem {
  id: string;
  fromSteamId: string;
  toSteamId: string;
  timestamp: string;
}

interface TradeHistoryProps {
  classid: string;
}

// Моковые данные для истории трейдов
const mockTradeHistory: TradeHistoryItem[] = [
  {
    id: "1",
    fromSteamId: "76561198260012732",
    toSteamId: "76561199185854372",
    timestamp: "2025-10-26T04:30:00Z",
  },
  {
    id: "2",
    fromSteamId: "76561198000000002",
    toSteamId: "76561198260012732",
    timestamp: "2025-10-26T04:27:00Z",
  },
  {
    id: "3",
    fromSteamId: "76561198000000003",
    toSteamId: "76561198000000002",
    timestamp: "2025-10-26T03:43:00Z",
  },
];

export default function TradeHistory({ classid }: TradeHistoryProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Stack
      flexDirection="column"
      gap={20}
      padding={24}
      borderRadius={16}
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.1)"
      backgroundColor="rgba(20, 20, 20, 0.8)"
      backdropFilter="blur(10px)"
    >
      <Typography preset="heading.400.default" color="white">
        Trade history
      </Typography>

      {mockTradeHistory.length === 0 ? (
        <Stack
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding={40}
          gap={16}
        >
          <Typography preset="compact.250.default" color="#888">
            История трейдов пуста
          </Typography>
        </Stack>
      ) : (
        <Stack flexDirection="column" gap={16}>
          {mockTradeHistory.map((trade) => (
            <TradeHistoryItem key={trade.id} trade={trade} formatDate={formatDate} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

interface TradeHistoryItemProps {
  trade: TradeHistoryItem;
  formatDate: (timestamp: string) => string;
}

function TradeHistoryItem({ trade, formatDate }: TradeHistoryItemProps) {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      padding={16}
      borderRadius={12}
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.05)"
      backgroundColor="rgba(30, 30, 30, 0.6)"
    >
      <Stack flexDirection="row" alignItems="center" gap={16} flex={1}>
        {/* Отправитель */}
        <SteamUserInfo steamId={trade.fromSteamId} />
        
        {/* Стрелка */}
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          width={40}
          height={40}
          backgroundColor="rgba(32, 218, 255, 0.1)"
          borderWidth={1}
          borderColor="rgba(32, 218, 255, 0.3)"
        >
          <ArrowRight size={16} color="#20DAFF" />
        </Stack>
        
        {/* Получатель */}
        <SteamUserInfo steamId={trade.toSteamId} />
      </Stack>

      {/* Дата */}
      <Stack alignItems="flex-end">
        <Typography preset="compact.200.default" color="#888">
          {formatDate(trade.timestamp)}
        </Typography>
      </Stack>
    </Stack>
  );
}

interface SteamUserInfoProps {
  steamId: string;
}

function SteamUserInfo({ steamId }: SteamUserInfoProps) {
  const {
    data: steamPlayerInfo,
    isLoading: steamInfoLoading,
    error: steamInfoError,
  } = useSteamPlayerInfo(steamId);

  if (steamInfoLoading) {
    return (
      <Stack
        flexDirection="row"
        alignItems="center"
        gap={8}
        paddingHorizontal={12}
        paddingVertical={8}
        borderRadius={8}
        backgroundColor="rgba(50, 50, 50, 0.5)"
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#333",
          }}
        />
        <Stack flexDirection="column" gap={2}>
          <div
            style={{
              width: 80,
              height: 12,
              backgroundColor: "#333",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              width: 60,
              height: 10,
              backgroundColor: "#222",
              borderRadius: 4,
            }}
          />
        </Stack>
      </Stack>
    );
  }

  if (steamInfoError || !steamPlayerInfo?.response?.players?.[0]) {
    return (
      <Stack
        flexDirection="row"
        alignItems="center"
        gap={8}
        paddingHorizontal={12}
        paddingVertical={8}
        borderRadius={8}
        backgroundColor="rgba(50, 50, 50, 0.5)"
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography preset="compact.150.default" color="#666">
            ?
          </Typography>
        </div>
        <Stack flexDirection="column" gap={2}>
          <Typography preset="compact.200.default" color="#888">
            Неизвестный пользователь
          </Typography>
          <Typography preset="compact.150.default" color="#666">
            ID: {steamId}
          </Typography>
        </Stack>
      </Stack>
    );
  }

  const player = steamPlayerInfo.response.players[0];

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      gap={8}
      paddingHorizontal={12}
      paddingVertical={8}
      borderRadius={8}
      backgroundColor="rgba(50, 50, 50, 0.5)"
    >
      <Image
        src={player.avatarmedium}
        alt={player.personaname}
        width={32}
        height={32}
        style={{
          borderRadius: "50%",
          border: "2px solid #20DAFF",
        }}
      />
      <Stack flexDirection="column" gap={2}>
        <Typography preset="compact.200.accent" color="#20DAFF">
          {player.personaname}
        </Typography>
        <Typography preset="compact.150.default" color="#666">
          ID: {steamId}
        </Typography>
      </Stack>
    </Stack>
  );
}
