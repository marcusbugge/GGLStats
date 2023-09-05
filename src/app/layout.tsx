"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  type SortPreference =
    | "Player"
    | "Champion"
    | "Standings"
    | "Team Scouter"
    | "Ladder";

  const [navSort, setNavSort] = useState("Overall");
  const [sortPreference, setSortPreference] =
    useState<SortPreference>("Player");

  const [viewPreference, setViewPreference] =
    useState<SortPreference>("Player");
  const handleSortOptionClick = (option: SortPreference) => {
    setSortPreference(option);
    setViewPreference(option);
  };
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
