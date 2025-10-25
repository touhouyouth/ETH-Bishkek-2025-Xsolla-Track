"use client";

import { Stack, Button, Typography } from "@xsolla-zk/react";
import { Wallet, Logout } from "@xsolla-zk/icons";
import { useModal } from "connectkit";
import { useAccount, useDisconnect } from "wagmi";

export default function Header() {
  const { setOpen } = useModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

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
        <Typography preset="heading.500.default">LoreNFT</Typography>
      </Stack>

      <Stack flexDirection="row" alignItems="center" gap={20}>
      </Stack>

      <Stack flexDirection="row" alignItems="center" gap={12}>
        {isConnected ? (
          <Stack flexDirection="row" alignItems="center" gap={8}>
            <Stack
              flexDirection="row"
              alignItems="center"
              gap={8}
              paddingHorizontal={12}
              paddingVertical={8}
              borderRadius={8}
              borderWidth={1}
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
