"use client";

import { Button, Text, Stack } from "@xsolla-zk/react";

export default function Home() {
  return (
    <Stack padding={4} gap={4} maxWidth={400}>
      <Text fontSize="$8">M3N747</Text>
      <Button onPress={() => alert("M3N747")} size="$500">
        <Button.Text>M3N747</Button.Text>
      </Button>
    </Stack>
  );
}
