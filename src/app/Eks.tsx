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

type SortPreference =
  | "Player"
  | "Champion"
  | "Team"
  | "Team Scouter"
  | "Ladder";

function Eks() {
  const [navSort, setNavSort] = useState("KDA");
  const [playerStats, setPlayerStats] = useState<PlayerData[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<any>("1.div");
  const [viewPreference, setViewPreference] =
    useState<SortPreference>("Player");
  const [sortPreference, setSortPreference] =
    useState<SortPreference>("Player");

  useEffect(() => {
    setLoading(true); // Set loading to true before fetch
    fetchAllPlayerStats(selectedDivision).then((data) => {
      setPlayerStats(data);
      setLoading(false); // Set loading to false after data is fetched
    });
  }, [selectedDivision]);

  const playersByKills = Gameservice.getPlayersByKills(playerStats);
  const playersByDeaths = Gameservice.getPlayersByDeaths(playerStats);
  const playersByAssists = Gameservice.getPlayersByAssists(playerStats);
  const playersByKDA = Gameservice.getPlayersByKDA(playerStats);
  // Placeholder. You'll need to implement these methods in the Gameservice.
  const championsByWinrate = Gameservice.getChampionWinrate(playerStats);
  const championsByGames = Gameservice.getChampionsByGamesPlayed(playerStats);
  const championsByKDA = Gameservice.getChampionKDAGames(playerStats);

  console.log("stats", playerStats);
  console.log("stats by kills", playersByKills);

  // const championsByDeaths = Gameservice.getChampionsByDeaths(playerStats);
  //const championsByAssists = Gameservice.getChampionsByAssists(playerStats);

  const handleDivisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDivision(event.target.value);
  };

  const handleSortOptionClick = (option: SortPreference) => {
    setSortPreference(option);
    setViewPreference(option);
  };

  const [loading, setLoading] = useState(true);

  const renderTeamsTables = () => {
    const teams = Teamservice.getPlayersByTeamWithStats(playerStats);

    return (
      <>
        {Object.entries(teams).map(([teamName, players]) => (
          <div key={teamName} style={{ padding: "20px", marginBottom: "30px" }}>
            <h2>{teamName}</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>IGN</th>
                  <th>Total Kills</th>
                  <th>Kills/game</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.user_id}>
                    <td className="white flagname">
                      {" "}
                      <img
                        src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                        alt={`${player.nationality} flag`}
                      />
                      {player.user_name}
                    </td>
                    <td>{player.nickname}</td>
                    <td>{player.totalKills}</td>
                    <td>{player.killsPerGame}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </>
    );
  };

  console.log(selectedDivision);

  return (
    <div className="app">
      <Navbar
        setNavSort={setNavSort}
        handleSortOptionClick={handleSortOptionClick}
      />
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
          <div className="sorts-cnt">
            {viewPreference === "Player" && (
              <>
                <div
                  className={`sort-option ${navSort === "KDA" ? "active" : ""}`}
                  onClick={() => setNavSort("KDA")}
                >
                  KDA
                </div>
                <div
                  className={`sort-option ${
                    navSort === "Kills" ? "active" : ""
                  }`}
                  onClick={() => setNavSort("Kills")}
                >
                  Kills
                </div>
                <div
                  className={`sort-option ${
                    navSort === "Deaths" ? "active" : ""
                  }`}
                  onClick={() => setNavSort("Deaths")}
                >
                  Deaths
                </div>
                <div
                  className={`sort-option ${
                    navSort === "Assists" ? "active" : ""
                  }`}
                  onClick={() => setNavSort("Assists")}
                >
                  Assists
                </div>
              </>
            )}
            {viewPreference === "Champion" && (
              <>
                <div
                  className={`sort-option ${navSort === "KDA" ? "active" : ""}`}
                  onClick={() => setNavSort("KDA")}
                >
                  KDA
                </div>
                <div
                  className={`sort-option ${
                    navSort === "Winrate" ? "active" : ""
                  }`}
                  onClick={() => setNavSort("Winrate")}
                >
                  Winrate
                </div>
                <div
                  className={`sort-option ${
                    navSort === "Games" ? "active" : ""
                  }`}
                  onClick={() => setNavSort("Games")}
                >
                  Games
                </div>
              </>
            )}
            {viewPreference === "Team" && null}
          </div>
        </div>

        <div className="tables">
          {" "}
          {viewPreference === "Player" && (
            <Player
              loading={loading}
              navSort={navSort}
              playersByKills={playersByKills}
              playersByDeaths={playersByDeaths}
              playersByAssists={playersByAssists}
              playersByKDA={playersByKDA}
            />
          )}
          {viewPreference === "Champion" && (
            <Champions
              championsByKDA={championsByKDA}
              championsByGames={championsByGames}
              championsByWinrate={championsByWinrate}
              playerDataList={playerStats}
              loading={loading}
              navSort={navSort}
            />
          )}
          {viewPreference === "Ladder" && (
            <LadderService players={playerStats} />
          )}
          {viewPreference === "Team" && renderTeamsTables()}
          {viewPreference === "Team Scouter" && (
            <TeamScouter
              divisionId={selectedDivision}
              playerStats={playerStats}
            />
          )}
        </div>
      </div>
      {selectedDivision !== undefined &&
        (viewPreference === "Team" || viewPreference === "Team Scouter") && (
          <Standings divisionId={selectedDivision} />
        )}
    </div>
  );
}

export default Eks;
