"use client";

import "./app.css";

import React, { useEffect, useState } from "react";
import { fetchAllPlayerStats } from "./services/Dataservice";
import { Gameservice } from "./services/Gameservice";
import { Teamservice } from "./services/Teamservice";
import Navbar from "./components/Navbar";

type SortPreference = "Player" | "Champion";

function Eks() {
  const [playerStats, setPlayerStats] = useState<PlayerData[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<any>("1.div");
  const [viewPreference, setViewPreference] = useState("Player");
  const [sortPreference, setSortPreference] =
    useState<SortPreference>("Player");

  useEffect(() => {
    fetchAllPlayerStats(selectedDivision).then((data) => {
      setPlayerStats(data);
    });
  }, [selectedDivision]);

  const playersByKills = Gameservice.getPlayersByKills(playerStats);
  const playersByDeaths = Gameservice.getPlayersByDeaths(playerStats);
  const playersByAssists = Gameservice.getPlayersByAssists(playerStats);

  // Placeholder. You'll need to implement these methods in the Gameservice.
  const championsByKills = Gameservice.getChampionsByKills(playerStats);

  console.log("killssdfsdfsdf", championsByKills);

  // const championsByDeaths = Gameservice.getChampionsByDeaths(playerStats);
  //const championsByAssists = Gameservice.getChampionsByAssists(playerStats);

  const handleDivisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDivision(event.target.value);
  };

  const handleViewPreferenceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setViewPreference(event.target.value);
  };

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
    marginBottom: "20px",
  };

  const tableHeaderStyle = {};

  const tableRowStyle = {};

  const tableDataStyle = {
    padding: "8px",
  };

  const renderPlayerTables = () => {
    return (
      <>
        <div style={{ padding: "20px" }}>
          <h2>Players by Kills</h2>
          <table>
            <thead>
              <tr style={tableRowStyle}>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Total Kills</th>
                <th>Kills/Game</th>
                <th>Game Count</th>
              </tr>
            </thead>
            <tbody>
              {playersByKills.map((player, index) => (
                <tr key={index} style={tableRowStyle}>
                  <td className="white flagname">
                    {" "}
                    <img
                      src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                      alt={`${player.nationality} flag`}
                    />
                    {player.user_name}
                  </td>
                  <td style={tableDataStyle}>{player.nickname}</td>

                  <td style={tableDataStyle}>{player.team_name}</td>
                  <td className="white" style={tableDataStyle}>
                    {player.totalKills}
                  </td>
                  <td className="white" style={tableDataStyle}>
                    {player.killsPerGame.toFixed(2)}
                  </td>
                  <td className="white" style={tableDataStyle}>
                    {player.gameCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Players by Deaths</h2>
          <table>
            <thead>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>Gamer Name</th>
                <th style={tableHeaderStyle}>Nationality</th>
                <th style={tableHeaderStyle}>Total Deaths</th>
                <th style={tableHeaderStyle}>Deaths/Game</th>
                <th style={tableHeaderStyle}>Game Count</th>
              </tr>
            </thead>
            <tbody>
              {playersByDeaths.map((player, index) => (
                <tr key={index} style={tableRowStyle}>
                  <td style={tableDataStyle}>{player.user_name}</td>
                  <td style={tableDataStyle}>
                    <img
                      src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                      alt={`${player.nationality} flag`}
                    />
                  </td>
                  <td style={tableDataStyle}>{player.totalDeaths}</td>
                  <td style={tableDataStyle}>
                    {player.deathsPerGame.toFixed(2)}
                  </td>
                  <td style={tableDataStyle}>{player.gameCount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Players by Assists</h2>
          <table>
            <thead>
              <tr style={tableRowStyle}>
                <th style={tableHeaderStyle}>Gamer Name</th>
                <th style={tableHeaderStyle}>Nationality</th>
                <th style={tableHeaderStyle}>Total Assists</th>
                <th style={tableHeaderStyle}>Assists/Game</th>
                <th style={tableHeaderStyle}>Game Count</th>
              </tr>
            </thead>
            <tbody>
              {playersByAssists.map((player, index) => (
                <tr key={index} style={tableRowStyle}>
                  <td style={tableDataStyle}>{player.user_name}</td>
                  <td style={tableDataStyle}>
                    <img
                      src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                      alt={`${player.nationality} flag`}
                    />
                  </td>
                  <td style={tableDataStyle}>{player.totalAssists}</td>
                  <td style={tableDataStyle}>
                    {player.assistsPerGame.toFixed(2)}
                  </td>
                  <td style={tableDataStyle}>{player.gameCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderChampionTables = () => {
    return (
      <>
        {/* Champions by Kills Table */}
        <h2>Champions by Kills</h2>
        <table>
          <thead>
            <tr style={tableRowStyle}>
              <th style={tableHeaderStyle}>Champion</th>
              <th style={tableHeaderStyle}>Total Kills</th>
              <th style={tableHeaderStyle}>Kills/Game</th>
              <th style={tableHeaderStyle}>Game Count</th>
            </tr>
          </thead>
          <tbody>
            {championsByKills.map((champion, index) => (
              <tr key={index} style={tableRowStyle}>
                <td style={tableDataStyle}>{champion.champion}</td>
                <td style={tableDataStyle}>{champion.totalKills}</td>
                <td style={tableDataStyle}>
                  {champion.killsPerGame.toFixed(2)}
                </td>
                <td style={tableDataStyle}>{champion.gameCount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Champions by Deaths</h2>

        <h2>Champions by Assists</h2>
      </>
    );
  };

  const renderTeamsTables = () => {
    const teams = Teamservice.getPlayersByTeam(playerStats);

    return (
      <>
        {Object.entries(teams).map(([teamName, players]) => (
          <div key={teamName} style={{ padding: "20px", marginBottom: "30px" }}>
            <h2>{teamName}</h2>
            <table>
              <thead>
                <tr style={tableRowStyle}>
                  <th style={tableHeaderStyle}>Gamer Name</th>
                  <th style={tableHeaderStyle}>Nick</th>
                  <th style={tableHeaderStyle}>Nationality</th>
                  <th style={tableHeaderStyle}>Total Kills</th>
                  <th style={tableHeaderStyle}>Kills/Game</th>
                  <th style={tableHeaderStyle}>Game Count</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.user_id} style={tableRowStyle}>
                    <td style={tableDataStyle}>{player.user_name}</td>
                    <td style={tableDataStyle}>{player.nickname}</td>
                    <td style={tableDataStyle}>
                      <img
                        src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                        alt={`${player.nationality} flag`}
                      />
                    </td>
                    <td style={tableDataStyle}>
                      {Object.values(player.champions)
                        .flat()
                        .reduce((sum, game) => sum + game.kills, 0)}
                    </td>
                    <td style={tableDataStyle}>
                      {(
                        Object.values(player.champions)
                          .flat()
                          .reduce((sum, game) => sum + game.kills, 0) /
                        Object.values(player.champions).flat().length
                      ).toFixed(2)}
                    </td>
                    <td style={tableDataStyle}>
                      {Object.values(player.champions).flat().length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <div>
          <label>Select Division: </label>
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
          <label>View Stats By: </label>
          <select value={viewPreference} onChange={handleViewPreferenceChange}>
            <option value="Player">Player</option>
            <option value="Champion">Champion</option>
            <option value="Teams">Teams</option>
          </select>
        </div>

        <div className="tables">
          {" "}
          {viewPreference === "Player" && renderPlayerTables()}
          {viewPreference === "Champion" && renderChampionTables()}
          {viewPreference === "Teams" && renderTeamsTables()}
        </div>
      </div>
    </div>
  );
}

export default Eks;
