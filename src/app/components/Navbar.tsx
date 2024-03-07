"use client";

import React, { useEffect, useState } from "react";
import "./navbar.css";
import Mvp from "../assets/mvp.png";
import Players from "../assets/players.png";
import Champions from "../assets/champions.png";
import Standings from "../assets/standings.png";
import Stats from "../assets/stats.png";
import Teamscouter from "../assets/teamscouter.png";
import { useRouter, withRouter } from "next/router";
import Image from "next/image";

export default function Navbar({ setNavSort, handleSortOptionClick }: any) {
  const [activeSort, setActiveSort] = useState<string>("");

  const handleNavSort = (sort: string) => {
    setNavSort(sort);
    setActiveSort(sort);
  };

  const handleSortClick = (sort: string) => {
    handleSortOptionClick(sort);
    setActiveSort(sort);
  };

  return (
    <div>
      {/* Dropdown */}

      <div className="navbar">
        <h1 className="gglstats white">
          <span className="ggl">GGL </span> Stats
        </h1>
        <div className="navbar-content">
          <h2
            onClick={() => handleSortClick("Player")}
            className={activeSort === "Player" ? "active" : ""}
          >
            <Image src={Players} alt="Players" />
            Players
          </h2>
          <h2
            onClick={() => handleSortClick("Champion")}
            className={activeSort === "Champion" ? "active" : ""}
          >
            <Image src={Champions} alt="Champions" />
            Champions
          </h2>
          <h2
            onClick={() => handleSortClick("Team Scouter")}
            className={activeSort === "Team Scouter" ? "active" : ""}
          >
            <Image src={Teamscouter} alt="Teamscouter" />
            Team Scouter
          </h2>
          <h2
            onClick={() => handleSortClick("Records")}
            className={activeSort === "Records" ? "active" : ""}
          >
            <Image src={Stats} alt="Stats" />
            Team Stats
          </h2>

          <h2
            onClick={() => handleSortClick("MVPs")}
            className={activeSort === "MVPs" ? "active" : ""}
          >
            <Image src={Mvp} alt="Mvp" />
            MVPs
          </h2>
          <h2
            onClick={() => handleSortClick("Standings")}
            className={activeSort === "Standings" ? "active" : ""}
          >
            <Image src={Standings} alt="Standings" />
            Standings
          </h2>

          <h2
            onClick={() => handleSortClick("Ladder")}
            className={activeSort === "Ladder" ? "active ladder" : "ladder"}
          >
            <span className="beta white">BETA</span>SoloQ Ladder
          </h2>
        </div>
      </div>
    </div>
  );
}
