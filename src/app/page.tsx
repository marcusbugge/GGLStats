"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Eks from "./Eks";
import Footer from "./components/Footer";
import Script from "next/script";
import TagManager from "react-gtm-module";

type SortPreference =
  | "Player"
  | "Champion"
  | "Standings"
  | "Records"
  | "Team Scouter"
  | "Ladder";

export default function Home() {
  const [navSort, setNavSort] = useState("Overall");
  const [sortPreference, setSortPreference] =
    useState<SortPreference>("Player");

  const [viewPreference, setViewPreference] =
    useState<SortPreference>("Player");
  const handleSortOptionClick = (option: SortPreference) => {
    setSortPreference(option);
    setViewPreference(option);
  };

  useEffect(() => {
    TagManager.initialize({ gtmId: "G-VWH0SM300Y" });
  }, []);

  return (
    <main>
      ¨
      <div className="page-cnt">
        <Navbar
          navSort={navSort}
          setNavSort={setNavSort}
          setSortPreference={setSortPreference}
          handleSortOptionClick={handleSortOptionClick}
        />
        <Eks
          navSort={navSort}
          setNavSort={setNavSort}
          setSortPreference={setSortPreference}
          viewPreference={viewPreference}
        />
      </div>
      <Footer />
    </main>
  );
}
