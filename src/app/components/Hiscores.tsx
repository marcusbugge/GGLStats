import React from "react";

type Player = {
  stats: {
    kadratio: string;
    side: string;
    firstBloodKills: number;
    pentaKills: number;
    quadraKills: number;
    mapsPlayed: number;
    mapsWon: number;
    totalDamageTaken: number;
    totalDamageDealt: number;
    firstTowerKills: number;
    allMinionsKilledPerMinute: string;
  };
  team_id: number;
  teamname: string;
};

interface HiscoresProps {
  players: Player[];
}

const Hiscores: React.FC<HiscoresProps> = ({ players }) => {
  const calculateTeamKDA = (teamId: number) => {
    const teamPlayers = players.filter(
      (player) => player.team_id === teamId && player.stats.mapsPlayed >= 3
    );
    const totalKDA = teamPlayers.reduce(
      (acc, player) => acc + parseFloat(player.stats.kadratio),
      0
    );
    return (totalKDA / teamPlayers.length).toFixed(2);
  };

  const calculateTeamTotal = (teamId: number, stat: string) => {
    return players
      .filter(
        (player) => player.team_id === teamId && player.stats.mapsPlayed >= 3
      )
      .reduce((acc, player: any) => acc + player.stats[stat], 0);
  };

  const calculateTeamAverage = (teamId: number, stat: string) => {
    const teamPlayers = players.filter(
      (player) => player.team_id === teamId && player.stats.mapsPlayed >= 3
    );
    const totalStat = teamPlayers.reduce(
      (acc, player: any) => acc + parseFloat(player.stats[stat]),
      0
    );
    const totalMaps = teamPlayers.reduce(
      (acc, player) => acc + player.stats.mapsPlayed,
      0
    );

    return totalMaps === 0 ? 0 : (totalStat / totalMaps).toFixed(2);
  };

  const calculateTeamFarmPerMinute = (teamId: number) => {
    const teamPlayers = players.filter(
      (player) => player.team_id === teamId && player.stats.mapsPlayed >= 3
    );
    const totalFarmPerMinute = teamPlayers.reduce(
      (acc, player) => acc + parseFloat(player.stats.allMinionsKilledPerMinute),
      0
    );
    return (totalFarmPerMinute / teamPlayers.length).toFixed(2);
  };
  const teamIds = Array.from(new Set(players.map((player) => player.team_id)));
  const teamStats = teamIds.map((teamId) => ({
    teamId,
    teamName:
      players.find((player) => player.team_id === teamId)?.teamname || "",
    kda: calculateTeamKDA(teamId),
    firstBloodKills: players
      .filter((player) => player.team_id === teamId)
      .reduce((acc, player) => acc + player.stats.firstBloodKills, 0),
    pentaKills: players
      .filter((player) => player.team_id === teamId)
      .reduce((acc, player) => acc + player.stats.pentaKills, 0),
    quadraKills: players
      .filter((player) => player.team_id === teamId)
      .reduce((acc, player) => acc + player.stats.quadraKills, 0),
    avgDamageTaken: calculateTeamAverage(teamId, "totalDamageTaken"),
    avgDamageDealt: calculateTeamAverage(teamId, "totalDamageDealt"),
    firstTowerKills: calculateTeamTotal(teamId, "firstTowerKills"),
    farmPerMinute: calculateTeamFarmPerMinute(teamId),
    gold: calculateTeamAverage(teamId, "goldEarned"),
  }));

  teamStats.sort((a, b) => parseFloat(b.kda) - parseFloat(a.kda));

  const sortedByKDA = [...teamStats].sort(
    (a, b) => parseFloat(b.kda) - parseFloat(a.kda)
  );
  const sortedByFirstBloodKills = [...teamStats].sort(
    (a, b) => b.firstBloodKills - a.firstBloodKills
  );
  const sortedByFirstTowerKills = [...teamStats].sort(
    (a, b) => b.firstTowerKills - a.firstTowerKills
  );
  const sortedByFarmPerMinute = [...teamStats].sort(
    (a, b) => parseFloat(b.farmPerMinute) - parseFloat(a.farmPerMinute)
  );

  return (
    <div className="white teamstats">
      <div className="bgteam">
        {" "}
        <h3>Teams by KDA</h3>
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>KDA</th>
            </tr>
          </thead>
          <tbody>
            {sortedByKDA.map((team, index) => (
              <tr key={index}>
                <td>{team.teamName}</td>
                <td>{team.kda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bgteam">
        <h3>First Blood Kills </h3>
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>First Blood Kills</th>
            </tr>
          </thead>
          <tbody>
            {sortedByFirstBloodKills.map((team, index) => (
              <tr key={index}>
                <td>{team.teamName}</td>
                <td>{team.firstBloodKills}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bgteam">
        <h3>First Tower Kills</h3>
        <table>
          <thead>
            <tr>
              <th>Team</th>

              <th>First Tower Kills</th>
            </tr>
          </thead>
          <tbody>
            {sortedByFirstTowerKills.map((team, index) => (
              <tr key={index}>
                <td>{team.teamName}</td>

                <td>{team.firstTowerKills}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bgteam">
        {" "}
        <h3>Team CS/min</h3>
        <table>
          <thead>
            <tr>
              <th>Team</th>

              <th>CS/min</th>
            </tr>
          </thead>
          <tbody>
            {sortedByFarmPerMinute.map((team, index) => (
              <tr key={index}>
                <td>{team.teamName}</td>

                <td>{team.farmPerMinute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hiscores;
