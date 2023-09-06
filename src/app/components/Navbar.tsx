"use client";

import React, { useEffect, useState } from "react";
import "./navbar.css";
import { useRouter, withRouter } from "next/router";

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
      <div className="dropdown">
        <h2 className="white">Menu</h2>
        <div className="dropdown-content">
          <h2
            onClick={() => handleSortClick("Player")}
            className={activeSort === "Player" ? "active" : ""}
          >
            Players
          </h2>
          <h2
            onClick={() => handleSortClick("Champion")}
            className={activeSort === "Champion" ? "active" : ""}
          >
            Champions
          </h2>
          <h2
            onClick={() => handleSortClick("Standings")}
            className={activeSort === "Standings" ? "active" : ""}
          >
            Standings
          </h2>
          <h2
            onClick={() => handleSortClick("Team Scouter")}
            className={activeSort === "Team Scouter" ? "active" : ""}
          >
            Team scouter
          </h2>
          <h2
            onClick={() => handleSortClick("Ladder")}
            className={activeSort === "Ladder" ? "active ladder" : "ladder"}
          >
            <span className="beta white">BETA</span>SoloQ Ladder
          </h2>
        </div>
      </div>
      <div className="navbar">
        <h1 className="gglstats white">
          <span className="ggl">GGL </span> Stats
        </h1>
        <div className="navbar-content">
          <h2
            onClick={() => handleSortClick("Player")}
            className={activeSort === "Player" ? "active" : ""}
          >
            Players
          </h2>
          <h2
            onClick={() => handleSortClick("Champion")}
            className={activeSort === "Champion" ? "active" : ""}
          >
            Champions
          </h2>
          <h2
            onClick={() => handleSortClick("Standings")}
            className={activeSort === "Standings" ? "active" : ""}
          >
            Standings
          </h2>

          <div className="nav-line"></div>
          <br></br>
          <h2
            onClick={() => handleSortClick("Team Scouter")}
            className={activeSort === "Team Scouter" ? "active" : ""}
          >
            Team scouter
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
