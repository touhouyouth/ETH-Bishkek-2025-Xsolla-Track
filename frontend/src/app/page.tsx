"use client";

import NftList from "@/components/NftList";
import { useApp } from "@/contexts/AppContext";
import ConnectWallet from "@/components/ConnectWallet";

export default function Home() {
  const { address } = useApp();

  if (!address) {
    return <ConnectWallet />;
  }

  return <NftList />;
}
