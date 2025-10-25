import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../providers/AppProvider";
import { Stack } from "@xsolla-zk/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M3N747",
  description: "M3N747",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
