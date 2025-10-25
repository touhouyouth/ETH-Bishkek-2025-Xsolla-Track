export const IPFS_URL =
  process.env.NEXT_PUBLIC_IPFS_URL || "https://ipfs.io/ipfs/";

export const getSteamImageUrl = (image_url: string): string => {
  return `https://steamcommunity-a.akamaihd.net/economy/image/${image_url}`;
};