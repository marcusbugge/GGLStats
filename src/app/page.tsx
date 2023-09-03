"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Eks from "./Eks";

type SortPreference =
  | "Player"
  | "Champion"
  | "Standings"
  | "Team Scouter"
  | "Ladder";

export default function Home() {
  const [navSort, setNavSort] = useState("KDA");
  const [sortPreference, setSortPreference] =
    useState<SortPreference>("Player");

  const [viewPreference, setViewPreference] =
    useState<SortPreference>("Player");
  const handleSortOptionClick = (option: SortPreference) => {
    setSortPreference(option);
    setViewPreference(option);
  };
  return (
    <main>
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
    </main>
  );
}
