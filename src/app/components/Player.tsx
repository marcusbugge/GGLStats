import React, { useEffect, useState } from "react";

export default function Player({ loading, navSort, playerTest }: any) {
  const [isDataReady, setIsDataReady] = useState(false);

  const defaultSortColumns: any = {
    Kills: "killsPerMap",
    Deaths: "deathsPerMap", // Update with the correct column
    KDA: "kadratio",
    Assists: "assistsPerMap", // Update with the correct column
    Vision: "visionScore", // Update with the correct column
    KP: "killParticipation",
    Farm: "allMinionsKilledPerMinute",
    Damage: "totalDamageToChampionsPerMinute",
    Gold: "goldEarnedPerMinute", // Update with the correct column
  };

  console.log("playertest", playerTest);

  const [headerSort, setHeaderSort] = useState({
    column: defaultSortColumns[navSort],
    order: "asc",
  });

  useEffect(() => {
    setHeaderSort({
      column: defaultSortColumns[navSort],
      order: "desc",
    });

    setIsDataReady(true);
  }, [navSort]);

  const handleHeaderSort = (column: string) => {
    if (headerSort.column === column) {
      setHeaderSort((prevState) => ({
        column,
        order: prevState.order === "asc" ? "desc" : "asc",
      }));
    } else {
      setHeaderSort({
        column,
        order: "asc",
      });
    }
  };

  const calculateAvgPlacement = (player: any, allSortCategories: any) => {
    let totalPlacement = 0;
    let categoryCount = 0;

    for (const category in allSortCategories) {
      const isLessBetter = category === "Deaths"; // specify other categories if needed
      const sortedList = [...playerTest].sort((a, b) => {
        const aVal = a.stats
          ? parseFloat(a.stats[allSortCategories[category]] || 0)
          : 0;
        const bVal = b.stats
          ? parseFloat(b.stats[allSortCategories[category]] || 0)
          : 0;
        return isLessBetter ? aVal - bVal : bVal - aVal;
      });
      const placement = sortedList.findIndex((p) => p === player);
      totalPlacement += placement + 1; // +1 because index is 0-based
      categoryCount++;
    }

    return categoryCount > 0 ? totalPlacement / categoryCount : 0;
  };

  // Function to calculate average placement for a team
  const calculateTeamAveragePlacement = (
    players: any,
    allSortCategories: any
  ) => {
    const totalPlacements = players.map((player: any) =>
      calculateAvgPlacement(player, allSortCategories)
    );
    return (
      totalPlacements.reduce(
        (acc: number, placement: number) => acc + placement,
        0
      ) / players.length
    );
  };

  // Group players by their team
  const groupByTeam = (players: any) => {
    return players.reduce((acc: any, player: any) => {
      (acc[player.teamname] = acc[player.teamname] || []).push(player);
      return acc;
    }, {});
  };

  const groupedByTeam: any = groupByTeam(playerTest);

  // Calculate team average placements
  const teamAveragePlacements: any = {};
  for (const team in groupedByTeam) {
    teamAveragePlacements[team] = calculateTeamAveragePlacement(
      groupedByTeam[team],
      defaultSortColumns
    );
  }

  // Create a new sorted array and add 'percentBetter' to each player object
  const sortedPlayerTest = isDataReady
    ? [...playerTest]
        .map((player: any) => {
          const avgPlacement = calculateAvgPlacement(
            player,
            defaultSortColumns
          );
          let percentBetter = 0;

          if (player.teamname && teamAveragePlacements[player.teamname]) {
            const teamAvgPlacement = teamAveragePlacements[player.teamname];
            percentBetter =
              ((teamAvgPlacement - avgPlacement) / teamAvgPlacement) * 100;
          }

          return {
            ...player,
            avgPlacement,
            percentBetter,
          };
        })
        .sort((a, b) => {
          if (headerSort.column) {
            const aValue = a.stats
              ? parseFloat(a.stats[headerSort.column] || 0)
              : 0;
            const bValue = b.stats
              ? parseFloat(b.stats[headerSort.column] || 0)
              : 0;

            if (navSort === "Deaths") {
              return aValue - bValue;
            } else if (navSort === "Avg Placement") {
              return a.avgPlacement - b.avgPlacement;
            }

            if (headerSort.order === "asc") {
              return aValue - bValue;
            } else {
              return bValue - aValue;
            }
          }
          return 0;
        })
    : [];

  const RenderPlayerTables = ({ loading, navSort }: any) => {
    if (loading) {
      return (
        <div className="placeholder-player">
          <h2>Loading...</h2>
          <table className="sortable">
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Kills</th>
                <th>Kills/Game</th>
                <th>Games</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }, (_, index) => (
                <tr key={index + 1}>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (navSort === "Kills") {
      console.log("sorted", sortedPlayerTest);

      return (
        <div>
          <h2>Players by Kills</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th
                  onClick={() => handleHeaderSort("mapsPlayed")}
                  className={
                    headerSort.column === "mapsPlayed" ? "sortable" : ""
                  }
                >
                  Games
                </th>
                <th
                  onClick={() => handleHeaderSort("kills")}
                  className={headerSort.column === "kills" ? "sortable" : ""}
                >
                  Kills
                </th>
                <th
                  onClick={() => handleHeaderSort("killsPerMinute")}
                  className={
                    headerSort.column === "killsPerMinute" ? "sortable" : ""
                  }
                >
                  Kills/Min
                </th>
                <th
                  onClick={() => handleHeaderSort("killsPerMap")}
                  className={
                    headerSort.column === "killsPerMap" ? "sortable" : ""
                  }
                >
                  Kills/Game
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest.map((player: any, index: any) => (
                <tr key={index}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                      alt={`${player.user.nationality} flag`}
                    />
                    {player.user.user_name}
                  </td>
                  <td>{player.stats?.summonerName}</td>

                  <td>{player.teamname}</td>
                  <td className="white">{player.stats?.mapsPlayed}</td>
                  <td className="white">{player.stats?.kills}</td>
                  <td className="white">{player.stats?.killsPerMinute}</td>
                  <td className="white">{player.stats?.killsPerMap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Best overall") {
      return (
        <div>
          <h2>Best player overall</h2>
          <p>
            This is a stat that calculates the average placement across all
            tables. Can be judged as the best performing player. <br></br>There
            is also a stat that shows how many percent (%) each player are
            "better" than their teammates. This can be <br></br>judged as how
            much they have been carrying.
          </p>
          <p></p>
          <p>
            (NB!) In later versions roles will take a part of the calculations,
            because now support and top is capped by their role <br></br>due to
            small numbers in some of the statistics.
            <br></br>
          </p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>% better</th>
                <th>Avg Placement</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest
                .sort((a, b) => a.avgPlacement - b.avgPlacement)
                .map((player, index) => (
                  <tr key={index}>
                    {/* ...existing columns */}
                    <td className="white flagname">
                      {" "}
                      <p>{index + 1}</p>
                      <img
                        src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                        alt={`${player.user.nationality} flag`}
                      />
                      {player.user.user_name}
                    </td>
                    <td>{player.stats?.summonerName}</td>
                    <td>{player.teamname}</td>
                    <td>{player.percentBetter.toFixed(2)}%</td>
                    <td className="white">{player.avgPlacement.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Deaths") {
      return (
        <div>
          <h2>Players by Deaths</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th
                  onClick={() => handleHeaderSort("mapsPlayed")}
                  className={
                    headerSort.column === "mapsPlayed" ? "sortable" : ""
                  }
                >
                  Games
                </th>
                <th
                  onClick={() => handleHeaderSort("deathsPerMinute")}
                  className={
                    headerSort.column === "deathsPerMinute" ? "sortable" : ""
                  }
                >
                  Deaths/min
                </th>
                <th
                  onClick={() => handleHeaderSort("deathsPerMap")}
                  className={
                    headerSort.column === "deathsPerMap" ? "sortable" : ""
                  }
                >
                  Deaths/Game
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                      alt={`${player.user.nationality} flag`}
                    />
                    {player.user.user_name}
                  </td>
                  <td>{player.stats?.summonerName}</td>
                  <td>{player.teamname}</td>
                  <td className="white">{player.stats?.mapsPlayed}</td>
                  <td className="white">{player.stats?.deathsPerMinute}</td>
                  <td className="white">{player.stats?.deathsPerMap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (navSort === "KDA") {
      return (
        <div>
          <h2>Players by KDA</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Games</th>
                <th
                  onClick={() => handleHeaderSort("kadratio")}
                  className={headerSort.column === "kadratio" ? "sortable" : ""}
                >
                  KDA
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                      alt={`${player.user.nationality} flag`}
                    />
                    {player.user.user_name}
                  </td>
                  <td>{player.stats?.summonerName}</td>
                  <td>{player.teamname}</td>
                  <td>{player.stats?.mapsPlayed}</td>
                  <td className="white">{player.stats?.kadratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Assists") {
      return (
        <div>
          <h2>Players by Assists</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Games</th>
                <th>Assists</th>
                <th>Assists/game</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                      alt={`${player.user.nationality} flag`}
                    />
                    {player.user.user_name}
                  </td>
                  <td>{player.stats?.summonerName}</td>
                  <td>{player.teamname}</td>
                  <td className="white">{player.stats?.mapsPlayed}</td>
                  <td className="white">{player.stats?.assists}</td>
                  <td className="white">{player.stats?.assistsPerMap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Vision") {
      return (
        <div>
          <h2>Players by Vision</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Games</th>
                <th>Wards/Game</th>
                <th>Controlwards/Game</th>
                <th>Vision Score/Game</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                      alt={`${player.user.nationality} flag`}
                    />
                    {player.user.user_name}
                  </td>
                  <td>{player.stats?.summonerName}</td>
                  <td>{player.teamname}</td>
                  <td className="white">{player.stats?.mapsPlayed}</td>
                  <td className="white">{player.stats?.wardsPlaced}</td>
                  <td className="white">
                    {player.stats?.controlWardsPurchased}
                  </td>

                  <td className="white">
                    {(
                      player.stats?.visionScore / player.stats?.mapsPlayed
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "KP") {
      return (
        <div>
          <h2>Players by Kill Participation</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Games</th>
                <th>KP</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                      alt={`${player.user.nationality} flag`}
                    />
                    {player.user.user_name}
                  </td>
                  <td>{player.stats?.summonerName}</td>
                  <td>{player.teamname}</td>
                  <td>{player.stats?.mapsPlayed}</td>
                  <td className="white">{player.stats?.killParticipation}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Farm") {
      return (
        <div>
          <h2>Players by Farm</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Games</th>
                <th>CS/min</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                      alt={`${player.user.nationality} flag`}
                    />
                    {player.user.user_name}
                  </td>
                  <td>{player.stats?.summonerName}</td>
                  <td>{player.teamname}</td>
                  <td>{player.stats?.mapsPlayed}</td>
                  <td className="white">
                    {player.stats?.allMinionsKilledPerMinute}/min
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Damage") {
      return (
        <div>
          <h2>Players by Damage</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Games</th>
                <th>Damage/min</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                      alt={`${player.user.nationality} flag`}
                    />
                    {player.user.user_name}
                  </td>
                  <td>{player.stats?.summonerName}</td>
                  <td>{player.teamname}</td>
                  <td>{player.stats?.mapsPlayed}</td>
                  <td className="white">
                    {player.stats?.totalDamageToChampionsPerMinute}/min
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Gold") {
      return (
        <div>
          <h2>Players by Gold</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Games</th>
                <th>Gold Spent/min</th>
                <th>Gold Earned/min</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerTest.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                      alt={`${player.user.nationality} flag`}
                    />
                    {player.user.user_name}
                  </td>
                  <td>{player.stats?.summonerName}</td>
                  <td>{player.teamname}</td>
                  <td>{player.stats?.mapsPlayed}</td>

                  <td className="white">
                    {player.stats?.goldSpentPerMinute}/min
                  </td>
                  <td className="white">
                    {player.stats?.goldEarnedPerMinute}/min
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };
  return (
    <div>
      <RenderPlayerTables loading={loading} navSort={navSort} />
    </div>
  );
}
