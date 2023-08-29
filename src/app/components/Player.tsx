import React from "react";

export default function Player({
  loading,
  navSort,
  playersByKills,
  playersByDeaths,
  playersByAssists,
  playersByKDA,
}: any) {
  const RenderPlayerTables = ({
    loading,
    navSort,
    playersByKills,
    playersByDeaths,
    playersByAssists,
    playersByKDA,
  }: any) => {
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
      return (
        <div>
          <h2>Players by Kills</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>IGN</th>
                <th>Team</th>
                <th>Games</th>
                <th>Kills</th>
                <th>Kills/Game</th>
              </tr>
            </thead>
            <tbody>
              {playersByKills.map((player: any, index: any) => (
                <tr key={index}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                      alt={`${player.nationality} flag`}
                    />
                    {player.user_name}
                  </td>
                  <td>{player.nickname}</td>

                  <td>{player.team_name}</td>
                  <td className="white">{player.gameCount}</td>
                  <td className="white">{player.totalKills}</td>
                  <td className="white">{player.killsPerGame.toFixed(2)}</td>
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
                <th>Count</th>
                <th>Deaths</th>
                <th>Deaths/Game</th>
              </tr>
            </thead>
            <tbody>
              {playersByDeaths.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                      alt={`${player.nationality} flag`}
                    />
                    {player.user_name}
                  </td>
                  <td>{player.nickname}</td>

                  <td>{player.team_name}</td>
                  <td className="white">{player.gameCount}</td>
                  <td className="white">{player.totalDeaths}</td>
                  <td className="white">{player.deathsPerGame.toFixed(2)}</td>
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

                <th>Team</th>
                <th>Games</th>
                <th>Better than team average</th>
                <th>KDA</th>
              </tr>
            </thead>
            <tbody>
              {playersByKDA.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                      alt={`${player.nationality} flag`}
                    />
                    {player.user_name}
                  </td>

                  <td>{player.team_name}</td>
                  <td className="white">{player.gameCount}</td>

                  <td
                    style={{
                      color:
                        parseFloat(player.betterThanTeamAvg) >= 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {player.betterThanTeamAvg}%
                  </td>
                  <td className="white">{player.kda}</td>
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
              {playersByAssists.map((player: any, index: any) => (
                <tr key={index + 1}>
                  <td className="white flagname">
                    {" "}
                    <p>{index + 1}</p>
                    <img
                      src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                      alt={`${player.nationality} flag`}
                    />
                    {player.user_name}
                  </td>
                  <td>{player.nickname}</td>

                  <td>{player.team_name}</td>
                  <td className="white">{player.gameCount}</td>
                  <td className="white">{player.totalAssists}</td>
                  <td className="white">{player.assistsPerGame.toFixed(2)}</td>
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
      <RenderPlayerTables
        loading={loading}
        navSort={navSort}
        playersByKills={playersByKills}
        playersByDeaths={playersByDeaths}
        playersByAssists={playersByAssists}
        playersByKDA={playersByKDA}
      />
    </div>
  );
}
