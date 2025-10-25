"use client";

import NftList from "@/components/NftList";
import { useApp } from "@/contexts/AppContext";
import ConnectWallet from "@/components/ConnectWallet";
import Loader from "@/components/Loader";

export default function Home() {
  const { address, isLoading } = useApp();

  if (isLoading) {
    return <Loader />;
  }

  if (!address) {
    return <ConnectWallet />;
  }

  return <NftList />;
}
