"use client";

import { Stack, Typography } from "@xsolla-zk/react";

export default function Loader() {
  return (
    <Stack flex={1} width="100%" alignItems="center" justifyContent="center">
      <Stack
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={20}
      >
        <Typography preset="display.300.default">Loading</Typography>
      </Stack>
    </Stack>
  );
}
