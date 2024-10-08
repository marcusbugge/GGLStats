import React, { useEffect, useState } from "react";
import PlayerGames from "./PlayerGames";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Player({
  loading,
  navSort,
  playerTest,
  season,
  div,
  playerError,
}: any) {
  const router = useRouter();
  const [isDataReady, setIsDataReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByGames, setFilterByGames] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const roleImages: any = {
    top: "https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-static-assets/global/default/svg/position-top-light.svg",
    jungle:
      "https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-static-assets/global/default/svg/position-jungle-light.svg",
    middle:
      "https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-static-assets/global/default/svg/position-middle-light.svg",
    bottom:
      "https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-static-assets/global/default/svg/position-bottom-light.svg",
    utility:
      "https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-static-assets/global/default/svg/position-utility-light.svg",
  };

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
    Towers: "towers",
  };

  const categoryMultipliers: any = {
    Kills: 1.2,
    Deaths: 1,
    KDA: 1,
    Assists: 1,
    Vision: 0.8,
    KP: 1,
    Farm: 1.2,
    Damage: 1.2,
    Gold: 1,
    Towers: 0.5,
  };

  const roleMultipliers: any = {
    top: 0.9,
    jungle: 0.9,
    middle: 1,
    bottom: 1,
    utility: 0.8,
  };

  const [playerClick, setPlayerClick] = useState<any>(null);

  function playerClicked(player: any) {
    console.log(player);

    if (player) {
      router.push(
        `/player/${player.user_id}?teamID=${player.team_id}&divisionID=${div}`
      );
    }

    // setPlayerClick(player);
  }

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
    let weightedTotalPlacement = 0;
    let totalWeight = 0;

    for (const category in allSortCategories) {
      const weight = categoryMultipliers[category] || 1; // If a multiplier doesn't exist, use 1 as the default
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
      weightedTotalPlacement += (placement + 1) * weight; // Multiply by weight
      totalWeight += weight;
    }

    const avgPlacement =
      totalWeight > 0 ? weightedTotalPlacement / totalWeight : 0;
    const roleMultiplier = roleMultipliers[player.role.toLowerCase()] || 1;
    return avgPlacement * roleMultiplier;
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
    return players?.reduce((acc: any, player: any) => {
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

          let towers =
            player.stats?.firstTowerKills + player.stats?.firstTowerAssists;

          // Update the player's stats to include towers
          let tower = {
            ...player.stats,
            towers,
          };

          return {
            ...player,
            avgPlacement,
            percentBetter,
            stats: tower,
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

  const filteredPlayerTestt = sortedPlayerTest.filter((player) => {
    const searchTermLower = searchTerm.toLowerCase();
    const moreThanThreeGames = filterByGames
      ? player.stats?.mapsPlayed > 3
      : true;
    return (
      moreThanThreeGames &&
      (player.user.user_name.toLowerCase().includes(searchTermLower) ||
        (player.stats?.summonerName &&
          player.stats.summonerName.toLowerCase().includes(searchTermLower)) ||
        (player.teamname &&
          player.teamname.toLowerCase().includes(searchTermLower)))
    );
  });

  const filteredPlayerTest = filteredPlayerTestt.filter(
    (player) => activeRole === null || player.role === activeRole
  );

  const RenderPlayerTables = ({ loading, navSort }: any) => {
    if (playerTest.length === 0) {
      return (
        <div className="placeholder-player">
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
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (navSort === "Kills") {
      return (
        <div>
          <div className="header-search"></div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
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
              {filteredPlayerTest.flatMap((player, index) => {
                const roleImageSrc = roleImages[player.role.toLowerCase()];
                const playerRow = (
                  <tr
                    key={`player-${index}`}
                    onClick={() => playerClicked(player)}
                    className={
                      index === 0
                        ? "top-1"
                        : index === 1
                        ? "top-2"
                        : index === 2
                        ? "top-3"
                        : ""
                    }
                  >
                    <td className="white flagname">
                      <p>{index + 1}</p>
                      <img
                        src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                        alt={`${player.user.nationality} flag`}
                      />
                      {player.user.user_name}
                    </td>
                    <td>
                      <img
                        src={roleImageSrc}
                        alt={player.role}
                        style={{
                          width: "26px",
                          height: "26px",
                          marginRight: "20px",
                        }}
                      />
                    </td>

                    <td>{player.stats?.summonerName}</td>
                    <td>{player.teamname}</td>
                    <td className="white">{player.stats?.mapsPlayed}</td>
                    <td className="white">{player.stats?.kills}</td>
                    <td className="white">{player.stats?.killsPerMinute}</td>
                    <td className="white">{player.stats?.killsPerMap}</td>
                  </tr>
                );

                // If this is the clicked player, we add the PlayerGames component under it
                if (
                  playerClick &&
                  playerClick.user.user_name === player.user.user_name
                ) {
                  return [
                    playerRow,
                    <tr key={`playerGames-${index}`} className="player-games">
                      <td colSpan={7}>
                        <PlayerGames player={playerClick} div={div} />
                      </td>
                    </tr>,
                  ];
                }

                // If not, just return the player's row
                return [playerRow];
              })}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Overall") {
      return (
        <div>
          <p>
            This statistic computes the average placement across all tables,
            serving as an indicator of a player overall performance.
            Additionally, we offer a metric that quantifies how much a player
            outperforms their teammates, expressed as a percentage. This can be
            interpreted as the extent to which a player carries the team.
          </p>
          <p>
            <strong>Note:</strong> Future updates will factor in player roles
            into these calculations. Currently, players in support and top roles
            may find their statistics limited due to role-specific constraints.
          </p>

          <div className="role-select-cnt">
            <div className="roles-cnt">
              {Object.entries(roleImages).map(([role, src]: any) => (
                <img
                  key={role}
                  src={src}
                  alt={role}
                  style={{
                    width: "35px",
                    height: "35px",
                    backgroundColor:
                      activeRole === role ? "var(--purple)" : "none",
                  }}
                  onClick={() =>
                    setActiveRole(role === activeRole ? null : role)
                  }
                />
              ))}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>IGN</th>
                <th
                  onClick={() => handleHeaderSort("teamname")}
                  className={headerSort.column === "teamname" ? "sortable" : ""}
                >
                  Team
                </th>
                <th
                  onClick={() => handleHeaderSort("percentBetter")}
                  className={
                    headerSort.column === "percentBetter" ? "sortable" : ""
                  }
                >
                  Carry
                </th>
                <th
                  onClick={() => handleHeaderSort("avgPlacement")}
                  className={
                    headerSort.column === "avgPlacement" ? "sortable" : ""
                  }
                >
                  Avg Placement
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayerTest
                .sort((a, b) => a.avgPlacement - b.avgPlacement)
                .flatMap((player, index) => {
                  const roleImageSrc = roleImages[player.role.toLowerCase()];
                  const playerRow = (
                    <tr
                      key={`player-${index}`}
                      onClick={() => playerClicked(player)}
                      className={
                        index === 0
                          ? "top-1"
                          : index === 1
                          ? "top-2"
                          : index === 2
                          ? "top-3"
                          : ""
                      }
                    >
                      <td className="white flagname">
                        {" "}
                        <p>{index + 1}</p>
                        <img
                          src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                          alt={`${player.user.nationality} flag`}
                        />
                        {player.user.user_name}
                        {player.user.role === "banned" ? (
                          <p className="skull">💀</p>
                        ) : null}
                      </td>
                      <td>
                        <img
                          src={roleImageSrc}
                          alt={player.role}
                          style={{
                            width: "26px",
                            height: "26px",
                            marginRight: "20px",
                          }}
                        />
                      </td>
                      <td>{player.stats?.summonerName}</td>
                      <td>{player.teamname}</td>
                      <td>
                        <p
                          className={`carrypercent ${
                            player.percentBetter > 0 ? "positive" : "negative"
                          }`}
                        >
                          {player.percentBetter.toFixed(2)}%
                        </p>
                      </td>

                      <td className="white">
                        {player.avgPlacement.toFixed(2)}
                      </td>
                    </tr>
                  );

                  // If this is the clicked player, we add the PlayerGames component under it
                  if (
                    playerClick &&
                    playerClick.user.user_name === player.user.user_name
                  ) {
                    return [
                      playerRow,
                      <tr key={`playerGames-${index}`} className="player-games">
                        <td colSpan={7}>
                          <PlayerGames player={playerClick} div={div} />
                        </td>
                      </tr>,
                    ];
                  }

                  // If not, just return the player's row
                  return [playerRow];
                })}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Deaths") {
      return (
        <div>
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
              {filteredPlayerTest.flatMap((player: any, index: any) => (
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
                  onClick={() => handleHeaderSort("kadratio")}
                  className={headerSort.column === "kadratio" ? "sortable" : ""}
                >
                  KDA
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayerTest.map((player: any, index: any) => (
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
    }
    if (navSort === "Towers") {
      return (
        <div>
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
                  onClick={() => handleHeaderSort("towers")}
                  className={headerSort.column === "towers" ? "sortable" : ""}
                >
                  Firsttower
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayerTest.flatMap((player, index) => {
                const playerRow = (
                  <tr
                    key={`player-${index}`}
                    onClick={() => playerClicked(player)}
                  >
                    <td className="white flagname">
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
                    <td className="white">{player.stats?.towers}</td>
                  </tr>
                );

                // If this is the clicked player, we add the PlayerGames component under it
                if (
                  playerClick &&
                  playerClick.user.user_name === player.user.user_name
                ) {
                  return [
                    playerRow,
                    <tr key={`playerGames-${index}`} className="player-games">
                      <td colSpan={7}>
                        <PlayerGames player={playerClick} div={div} />
                      </td>
                    </tr>,
                  ];
                }

                // If not, just return the player's row
                return [playerRow];
              })}
            </tbody>
          </table>
        </div>
      );
    } else if (navSort === "Assists") {
      return (
        <div>
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
                  onClick={() => handleHeaderSort("assists")}
                  className={headerSort.column === "assists" ? "sortable" : ""}
                >
                  Assists
                </th>
                <th
                  onClick={() => handleHeaderSort("assistsPerMap")}
                  className={
                    headerSort.column === "assistsPerMap" ? "sortable" : ""
                  }
                >
                  Assists/game
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayerTest.map((player: any, index: any) => (
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
                  onClick={() => handleHeaderSort("wardsPlaced")}
                  className={
                    headerSort.column === "wardsPlaced" ? "sortable" : ""
                  }
                >
                  Wards/Game
                </th>
                <th
                  onClick={() => handleHeaderSort("controlWardsPurchased")}
                  className={
                    headerSort.column === "controlWardsPurchased"
                      ? "sortable"
                      : ""
                  }
                >
                  Controlwards/Game
                </th>
                <th
                  onClick={() => handleHeaderSort("visionScore")}
                  className={
                    headerSort.column === "visionScore" ? "sortable" : ""
                  }
                >
                  Vision Score/Game
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayerTest.map((player: any, index: any) => (
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
                  <td className="white">
                    {(
                      player.stats?.wardsPlaced / player.stats?.mapsPlayed
                    ).toFixed(2)}
                  </td>
                  <td className="white">
                    {(
                      player.stats?.controlWardsPurchased /
                      player.stats?.mapsPlayed
                    ).toFixed(2)}
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
              {filteredPlayerTest.map((player: any, index: any) => (
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
              {filteredPlayerTest.map((player: any, index: any) => (
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
              {filteredPlayerTest.map((player: any, index: any) => (
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
              {filteredPlayerTest.map((player: any, index: any) => (
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
      {/* Move the search bar here to make it available in all tables */}
      <div className="header-search">
        <h2>Players by {navSort}</h2>
        <div className="checkbox">
          <button
            className={filterByGames ? "buttonactive" : "checkbox-3"}
            onClick={() => setFilterByGames(!filterByGames)}
          >
            More than 3 games
          </button>

          <input
            type="text"
            placeholder="Filter by player or team"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <RenderPlayerTables loading={loading} navSort={navSort} />
    </div>
  );
}
