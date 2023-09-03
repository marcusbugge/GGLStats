"use client";

import React, { useEffect, useState } from "react";
import { Gameservice } from "../services/Gameservice";
import { Championservice } from "../services/Championservice";

export default function Champions({
  navSort,
  playersByKills,
  playersByDeaths,
  championsByKDA,
  championsByGames,
  championsByWinrate,
  playerDataList,
}: any) {
  const [showFiltered, setShowFiltered] = React.useState(false);

  const [clickedChampion, setClickedChampion] = React.useState(null);

  const [championGames, setChampionGames] = React.useState<any[]>([]);

  const [championData, setChampionData]: any = useState([]);

  const [loading, setLoading] = useState(true); // Initialize state to manage loading status

  useEffect(() => {
    const fetchChampionData = async () => {
      const data = await Championservice.getChampionData();
      setChampionData(data.data);
      setLoading(false); // Set loading to false once the data is fetched
    };

    fetchChampionData(); // Call the function to fetch the data
  }, []); // Empty dependency array to ensure the effect only runs once

  console.log("asdjklfksdflks", championData);

  const handleChampionClick = async (champion: any) => {
    console.log("champ", champion);

    if (clickedChampion === champion) {
      setClickedChampion(null); // Hide details if clicked again
      setChampionGames([]); // Clear the games list
    } else {
      setClickedChampion(champion); // Show details

      // Fetch or calculate championGames here, using your Gameservice or another method
      const games = await Gameservice.getGamesForChampion(
        playerDataList,
        champion.champion
      );

      const gamesSort = games.sort((a, b) => b.kda - a.kda); // Sort games by KDA
      setChampionGames(gamesSort);
    }
  };

  const RenderChampionTables = ({
    championsByWinrate,
    championsByGames,
    championsByKDA,
  }: any) => {
    if (navSort == "KDA") {
      return (
        <div>
          <h2>Champions by KDA</h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Game Count</th>
                <th>Kills/game</th>
                <th>Deaths/game</th>
                <th>Assists/game</th>
                <th>KDA</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(championData) &&
                championData.map((champion: any, index: any) => (
                  // your code

                  <>
                    <tr
                      key={index}
                      onClick={() => handleChampionClick(champion)}
                    >
                      <td>
                        {(() => {
                          const championGames = Gameservice.getGamesForChampion(
                            playerDataList,
                            champion.champion
                          );

                          return (
                            <>
                              <div className="champion-img-name">
                                {index + 1}
                                <img src={champion.image}></img>
                                <p className="white">{champion.name}</p>
                              </div>
                            </>
                          );
                        })()}
                      </td>
                      <td>{champion.count}</td>
                      <td className="white">{champion.avgKills.toFixed(2)}</td>
                      <td className="white">{champion.avgDeaths.toFixed(2)}</td>
                      <td className="white">
                        {champion.avgAssists.toFixed(2)}
                      </td>
                      <td className="white">
                        {(
                          (champion.kills + champion.assists) /
                          champion.deaths
                        ).toFixed(2)}
                      </td>
                    </tr>
                    {clickedChampion === champion && (
                      <tr>
                        <td>
                          {/* Put your detailed data about the clickedChampion here */}
                          <div>
                            <h3>Details for {champion.champion}</h3>
                            {/* Other details... */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort == "Winrate") {
      return (
        <div>
          <h2>Champions by Winrate</h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Game Count</th>
                <th>Wins</th>
                <th>Loss</th>
                <th>Winrate</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(championData) &&
                championData.map((champion: any, index: any) => (
                  // your code

                  <>
                    <tr
                      key={index}
                      onClick={() => handleChampionClick(champion)}
                    >
                      <td>
                        {(() => {
                          const championGames = Gameservice.getGamesForChampion(
                            playerDataList,
                            champion.champion
                          );

                          return (
                            <>
                              <div className="champion-img-name">
                                {index + 1}
                                <img src={champion.image}></img>
                                <p className="white">{champion.name}</p>
                              </div>
                            </>
                          );
                        })()}
                      </td>
                      <td>{champion.count}</td>
                      <td>{champion.winCount}</td>
                      <td>{champion.count - champion.winCount}</td>
                      <td className="white">
                        {((champion.winCount / champion.count) * 100).toFixed(
                          2
                        )}
                        %
                      </td>
                    </tr>
                    {clickedChampion === champion && (
                      <tr>
                        <td>
                          {/* Put your detailed data about the clickedChampion here */}
                          <div>
                            <h3>Details for {champion.champion}</h3>
                            {/* Other details... */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort == "Farm") {
      return (
        <div>
          <h2>Champions by Farm</h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Game Count</th>
                <th>CS/game</th>
                <th>CS/min</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(championData) &&
                championData.map((champion: any, index: any) => (
                  // your code

                  <>
                    <tr
                      key={index}
                      onClick={() => handleChampionClick(champion)}
                    >
                      <td>
                        {(() => {
                          const championGames = Gameservice.getGamesForChampion(
                            playerDataList,
                            champion.champion
                          );

                          return (
                            <>
                              <div className="champion-img-name">
                                {index + 1}
                                <img src={champion.image}></img>
                                <p className="white">{champion.name}</p>
                              </div>
                            </>
                          );
                        })()}
                      </td>
                      <td>{champion.count}</td>
                      <td className="white">
                        {champion.avgTotalMinionsKilled.toFixed(0)}
                      </td>
                      <td className="white">
                        {champion.avgMinionsKilledPerMinute}
                      </td>
                    </tr>
                    {clickedChampion === champion && (
                      <tr>
                        <td>
                          {/* Put your detailed data about the clickedChampion here */}
                          <div>
                            <h3>Details for {champion.champion}</h3>
                            {/* Other details... */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort == "KP") {
      return (
        <div>
          <h2>Champions by KP</h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Game Count</th>
                <th>KP</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(championData) &&
                championData.map((champion: any, index: any) => (
                  // your code

                  <>
                    <tr
                      key={index}
                      onClick={() => handleChampionClick(champion)}
                    >
                      <td>
                        {(() => {
                          const championGames = Gameservice.getGamesForChampion(
                            playerDataList,
                            champion.champion
                          );

                          return (
                            <>
                              <div className="champion-img-name">
                                {index + 1}
                                <img src={champion.image}></img>
                                <p className="white">{champion.name}</p>
                              </div>
                            </>
                          );
                        })()}
                      </td>
                      <td>{champion.count}</td>
                      <td className="white">
                        {champion.avgKillParticipation}%
                      </td>
                    </tr>
                    {clickedChampion === champion && (
                      <tr>
                        <td>
                          {/* Put your detailed data about the clickedChampion here */}
                          <div>
                            <h3>Details for {champion.champion}</h3>
                            {/* Other details... */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort == "Gold") {
      return (
        <div>
          <h2>Champions by Gold</h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Game Count</th>
                <th>Gold/min</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(championData) &&
                championData.map((champion: any, index: any) => (
                  // your code

                  <>
                    <tr
                      key={index}
                      onClick={() => handleChampionClick(champion)}
                    >
                      <td>
                        {(() => {
                          const championGames = Gameservice.getGamesForChampion(
                            playerDataList,
                            champion.champion
                          );

                          return (
                            <>
                              <div className="champion-img-name">
                                {index + 1}
                                <img src={champion.image}></img>
                                <p className="white">{champion.name}</p>
                              </div>
                            </>
                          );
                        })()}
                      </td>
                      <td>{champion.count}</td>
                      <td className="white">
                        {champion.avgGoldEarnedPerMinute}
                      </td>
                    </tr>
                    {clickedChampion === champion && (
                      <tr>
                        <td>
                          {/* Put your detailed data about the clickedChampion here */}
                          <div>
                            <h3>Details for {champion.champion}</h3>
                            {/* Other details... */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort == "Games") {
      return (
        <div>
          <h2>Champions by Games</h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Game Count</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(championData) &&
                championData.map((champion: any, index: any) => (
                  // your code

                  <>
                    <tr
                      key={index}
                      onClick={() => handleChampionClick(champion)}
                    >
                      <td>
                        {(() => {
                          const championGames = Gameservice.getGamesForChampion(
                            playerDataList,
                            champion.champion
                          );

                          return (
                            <>
                              <div className="champion-img-name">
                                {index + 1}
                                <img src={champion.image}></img>
                                <p className="white">{champion.name}</p>
                              </div>
                            </>
                          );
                        })()}
                      </td>
                      <td>{champion.count}</td>
                    </tr>
                    {clickedChampion === champion && (
                      <tr>
                        <td>
                          {/* Put your detailed data about the clickedChampion here */}
                          <div>
                            <h3>Details for {champion.champion}</h3>
                            {/* Other details... */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div>
      <RenderChampionTables
        championsByKDA={championsByKDA}
        championsByGames={championsByGames}
        championsByWinrate={championsByWinrate}
      />
    </div>
  );
}
