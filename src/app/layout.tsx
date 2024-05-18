"use client";

import "../app/styles/global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import { useState } from "react";
import icon from "../app/assets/logo.png";

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
    | "MVPs"
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
      <title>GGL Stats | Statistics for GoodGame-Ligaen</title>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
