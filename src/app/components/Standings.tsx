import React, { useEffect, useState } from "react";
import "./components.css";

export default function Standings({
  divisionId,
  selectedSeason,
  playerStats,
}: any) {
  const [divisionData, setDivisionData] = useState<Division2 | null>(null);

  console.log("hello");
  console.log("playersttas", playerStats);

  useEffect(() => {
    if (typeof divisionId !== "undefined") {
      fetch(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/competition/${selectedSeason}/tables`
      )
        .then((response) => response.json())
        .then((data) => {
          const division = data.find((div: Division2) => div.id === divisionId);
          if (division) {
            setDivisionData(division);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      console.error(`Unknown divisionId: ${divisionId}`);
    }
  }, [divisionId]);

  console.log(divisionData);

  // Organize the player stats by team ID.
  const teamStats: { [key: number]: any } = {};

  playerStats.forEach((player: any) => {
    const teamId = player.team_id;
    if (!teamStats[teamId]) {
      teamStats[teamId] = {
        mostGamesPlayed: 0,
        playerWithMostGames: null,
        totalGoldEarned: 0,
        totalPlayTime: 0,
      };
    }

    // Update the player with the most games played
    if (teamStats[teamId].mostGamesPlayed < player.stats.mapsPlayed) {
      teamStats[teamId].mostGamesPlayed = player.stats.mapsPlayed;
      teamStats[teamId].playerWithMostGames = player;
    }

    // Update the total gold earned and total playtime for the team
    teamStats[teamId].totalGoldEarned += player.stats.goldEarned;
    teamStats[teamId].totalPlayTime += player.stats.playTime;
  });

  // Function to convert minutes to "MM:SS" format
  const formatTime = (timeInMinutes: number) => {
    const totalSeconds = Math.round(timeInMinutes * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="standings">
      <h2>{divisionData?.name || "Loading..."} tabell</h2>
      <div className="standing-table">
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Played</th>
              <th>Overall Playtime</th> {/* New column */}
              <th>Avg Gold/Game</th> {/* New column */}
              <th>+/-</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {divisionData?.signups.map((signup: any, index) => {
              // Calculating the score differential
              const scoreDifferential = signup.score_for - signup.score_against;
              // New stats based on team ID
              const currentTeamStats = teamStats[signup.team.id] || {};
              const avgPlayTimePerGameInMinutes =
                (currentTeamStats.playerWithMostGames?.stats.playTime || 0) /
                (currentTeamStats.mostGamesPlayed || 1) /
                60;
              const avgTeamIncomePerMinute =
                currentTeamStats.totalGoldEarned /
                (currentTeamStats.totalPlayTime / 60);

              // Check for banned status
              const isBanned = signup.retire_user_id !== null;

              return (
                <tr key={signup.id}>
                  <td>
                    <div className="standing-team">
                      <p>{index + 1}</p>
                      <a href={signup.team.url}>
                        <img
                          src={signup.team.logo.url}
                          alt={signup.team.name}
                          width="40"
                          height="40"
                        />
                        {signup.team.name}
                        {isBanned ? <span className="skull">💀</span> : " "}
                        {/* Display emoji if the team is banned */}
                      </a>
                    </div>
                  </td>
                  <td>{signup.played}</td>
                  <td>{formatTime(avgPlayTimePerGameInMinutes)} </td>{" "}
                  {/* New data cell */}
                  <td>{avgTeamIncomePerMinute.toFixed(2)}</td>{" "}
                  {/* New data cell */}
                  <td>{scoreDifferential}</td>{" "}
                  {/* Displaying the calculated score differential */}
                  <td className="white">{signup.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
