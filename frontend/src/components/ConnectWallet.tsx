"use client";

import { Stack, Button, Typography, Separator } from "@xsolla-zk/react";
import { Wallet } from "@xsolla-zk/icons";
import { useModal } from "connectkit";

export default function ConnectWallet() {
  const { setOpen } = useModal();
  return (
    <Stack flex={1} width="100%" alignItems="center" justifyContent="center">
      <Stack
        flexDirection="column"
        height={378}
        width={296}
        borderRadius={20}
        borderWidth={2}
        borderColor="#6939F91F"
        alignItems="center"
        justifyContent="center"
        gap={10}
      >
        <Typography preset="display.400.default">
          Connect your wallet
        </Typography>
        <Stack width={200}>
          <Separator weight="$stroke.100" />
        </Stack>
        <Button
          onPress={() => setOpen(true)}
          height={40}
          width="100%"
          maxW={220}
          marginTop={10}
        >
          <Wallet />
          <Typography preset="compact.250.accent">Connect wallet</Typography>
        </Button>
      </Stack>
    </Stack>
  );
}
