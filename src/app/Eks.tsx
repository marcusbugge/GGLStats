"use client";

import "./app.css";

import React, { useEffect, useState } from "react";
import { fetchAllPlayerStats } from "./services/Dataservice";
import { Gameservice } from "./services/Gameservice";
import { Teamservice } from "./services/Teamservice";
import Navbar from "./components/Navbar";
import Standings from "./components/Standings";
import Kills from "./components/Player";
import Player from "./components/Player";
import TeamScouter from "./components/TeamScouter";
import LadderService from "./services/Ladderservice";
import Champions from "./components/Champions";
import Deaths from "./components/Deaths";
import { Userservice } from "./services/Userservice";
import SortButtons from "./components/SortButtons";

type SortPreference =
  | "Player"
  | "Champion"
  | "Standings"
  | "Team Scouter"
  | "Ladder";

const divisionIds: Record<string, number> = {
  "1.div": 11408,
  "2.div": 11451,
  "3.div A": 11490,
  "3.div B": 11491,
  "3.div C": 11492,
  "4.div A": 11493,
  "4.div B": 11494,
  "4.div C": 11495,
};

function Eks({ setSortPreference, navSort, setNavSort, viewPreference }: any) {
  const [playerStats, setPlayerStats] = useState<PlayerData[]>([]);
  const [playerStatsTest, setPlayerStatsTest] = useState<[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<any>("1.div");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Set loading to true before fetch

    // Fetch player stats
    const fetchPlayerData = async () => {
      console.log("selected div", divisionIds[selectedDivision]);

      const data = await Userservice.getPlayersStats({
        division: divisionIds[selectedDivision],
      });
      console.log("Fetched player data:", data);

      setPlayerStatsTest(data);
      setLoading(false);

      // set it to state if needed
    };

    fetchPlayerData();
  }, [selectedDivision]);

  const sortOptionsPlayer = [
    "Best overall",
    "KDA",
    "Kills",
    "Deaths",
    "Assists",
    "Vision",
    "KP",
    "Farm",
    "Damage",
    "Gold",
  ];

  const sortOptionsChampion = ["Games", "Winrate", "KDA", "Farm", "KP", "Gold"];
  const sortOptionsTeam = ["Winrate", "Kills", "Deaths"];
  const sortOptionsLadder = ["Show all", "Division", "Team"];

  let sortOptions;
  if (viewPreference === "Player") {
    sortOptions = sortOptionsPlayer;
  } else if (viewPreference === "Champion") {
    sortOptions = sortOptionsChampion;
  } else if (viewPreference === "Standings") {
    sortOptions = sortOptionsTeam;
  } else if (viewPreference === "Ladder") {
    sortOptions = sortOptionsLadder;
  }

  const handleDivisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDivision(event.target.value);
  };

  console.log(selectedDivision);

  return (
    <div className="app">
      <div className="content">
        <div className="content-nav">
          <div>
            <select>
              <option value="Høst 2023">Høst 2023</option>
            </select>
            <select value={selectedDivision} onChange={handleDivisionChange}>
              <option value="1.div">1.div</option>
              <option value="2.div">2.div</option>
              <option value="3.div A">3.div A</option>
              <option value="3.div B">3.div B</option>
              <option value="3.div C">3.div C</option>
              <option value="4.div A">4.div A</option>
              <option value="4.div B">4.div B</option>
              <option value="4.div C">4.div C</option>
            </select>
          </div>
          <div>
            {viewPreference === "Player" && (
              <>
                <SortButtons
                  options={sortOptionsPlayer}
                  selectedSort={navSort}
                  onSortClick={setNavSort}
                />
              </>
            )}
            {viewPreference === "Champion" && (
              <>
                <SortButtons
                  options={sortOptionsChampion}
                  selectedSort={navSort}
                  onSortClick={setNavSort}
                />
              </>
            )}
            {viewPreference === "Standings" && (
              <SortButtons
                options={sortOptionsTeam}
                selectedSort={navSort}
                onSortClick={setNavSort}
              />
            )}
            {viewPreference === "Ladder" && (
              <SortButtons
                options={sortOptionsLadder}
                selectedSort={navSort}
                onSortClick={setNavSort}
              />
            )}
          </div>
        </div>

        <div className="tables">
          {" "}
          {viewPreference === "Player" && (
            <Player
              loading={loading}
              navSort={navSort}
              playerTest={playerStatsTest}
              division={selectedDivision}
            />
          )}
          {viewPreference === "Champion" && (
            <Champions
              playerDataList={playerStats}
              loading={loading}
              navSort={navSort}
            />
          )}
          {viewPreference === "Ladder" && (
            <LadderService players={playerStatsTest} navSort={navSort} />
          )}
          {viewPreference === "Standings" && (
            <Standings divisionId={selectedDivision} />
          )}
          {viewPreference === "Team Scouter" && (
            <TeamScouter
              divisionId={selectedDivision}
              playerStats={playerStatsTest}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Eks;
