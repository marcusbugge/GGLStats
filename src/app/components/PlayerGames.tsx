import React, { useState, useEffect } from "react";

export default function PlayerGames({ player, div }: any) {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGamesForPlayer() {
      try {
        const response = await fetch(
          `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/matchup?team_id=${player.team_id}&division_id=${div}`
        );
        const matchups = await response.json();

        const allStatsPromises = matchups.data.map(async (matchup: any) => {
          const statsResponse = await fetch(
            `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/matchup/${matchup.id}/stats`
          );
          const statsData = await statsResponse.json();
          const opponent =
            matchup.home_signup.team.id === player.team_id
              ? matchup.away_signup
              : matchup.home_signup;
          return {
            matchupData: matchup,
            statsData,
            opponent,
          };
        });

        const allStats = await Promise.all(allStatsPromises);

        const playerGames: any = allStats
          .flatMap((data) =>
            data.statsData.map((stat: any) => ({
              ...stat,
              opponent: data.opponent,
            }))
          )
          .filter((stats) => stats.summonerId === player.stats.summonerId);

        setGames(playerGames);
      } catch (error) {
        console.error("Error fetching games for player:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGamesForPlayer();
  }, [player]);

  if (isLoading)
    return (
      <div>
        {" "}
        <div className="placeholder-player">
          <table className="sortable">
            <thead>
              <tr>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }, (_, index) => (
                <tr key={index + 1}>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

  return (
    <div>
      <div className="player-games">
        {games.map((game: any, index) => (
          <div key={index} className="player-game-obj">
            <div className="test-game">
              <div className="player-gam">
                {" "}
                {game.mapsWon == game.mapsPlayed ? (
                  <div className="score-game-win">Win</div>
                ) : (
                  <div className="score-game-loss">Loss</div>
                )}
                <img src={game.championImage} alt={game.championName} />
                <div className="player-champ">
                  <h4 className="white">{game.summonerName}</h4>
                  <p>
                    {game.kills} / {game.deaths} / {game.assists}
                  </p>
                  <p>{game.kadratio} KDA</p>
                  <p>{game.killParticipation}% KP</p>
                  <p>{game.allMinionsKilledPerMinute} CS/m</p>
                  <p>{game.totalDamageToChampionsPerMinute} DPM</p>

                  <p>{game.goldEarnedPerMinute} Gold/m</p>
                </div>
              </div>
              <p className="vs white"> vs {game.opponent.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
