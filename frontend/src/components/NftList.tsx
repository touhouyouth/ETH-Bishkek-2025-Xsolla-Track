"use client";

import { RichIcon, Stack, Text } from "@xsolla-zk/react";
import { Face } from "@xsolla-zk/icons";
import { useApp } from "@/contexts/AppContext";

export default function NftList() {
  const { address } = useApp();
  return (
    <Stack
      flexDirection="column"
      flex={1}
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      padding={100}
      gap={8}
    >
      <Text fontSize="$8">Address: {address}</Text>
    </Stack>
  );
}
