import React from "react";
import { Gameservice } from "../services/Gameservice";

export default function Champions({
  loading,
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
    if (navSort == "Winrate") {
      const filteredChampions = showFiltered
        ? championsByWinrate.filter((champion: any) => champion.games >= 2)
        : championsByWinrate;
      return (
        <div>
          <h2>Champions by Winrate</h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Game Count</th>
                <th>Winrate</th>
              </tr>
            </thead>
            <tbody>
              {filteredChampions.map((champion: any, index: any) => (
                <>
                  <tr key={index} onClick={() => handleChampionClick(champion)}>
                    <td>
                      {(() => {
                        const cleanName = cleanChampionName(champion.champion);

                        const championGames = Gameservice.getGamesForChampion(
                          playerDataList,
                          champion.champion
                        );

                        return (
                          <>
                            <div className="champion-img-name">
                              {index + 1}
                              <img
                                src={`https://ddragon.leagueoflegends.com/cdn/13.8.1/img/champion/${cleanName}.png`}
                              ></img>
                              <p className="white">{champion.champion}</p>
                            </div>
                          </>
                        );
                      })()}
                    </td>
                    <td>{champion.games}</td>
                    <td>{champion.winrate}</td>
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
    } else if (navSort == "KDA") {
      const filteredChampions = showFiltered
        ? championsByKDA.filter((champion: any) => champion.totalGames >= 2)
        : championsByKDA;

      return (
        <div>
          <h2>Champions by KDA</h2>
          <table>
            <thead>
              <tr>
                <th>Champion</th>
                <th>Games</th>
                <th>KDA</th>
              </tr>
            </thead>
            <tbody>
              {filteredChampions.map((champion: any, index: any) => (
                <>
                  <tr key={index} onClick={() => handleChampionClick(champion)}>
                    <td>
                      {(() => {
                        const cleanName = cleanChampionName(champion.champion);
                        const championGames = Gameservice.getGamesForChampion(
                          playerDataList,
                          champion.champion
                        );

                        return (
                          <>
                            <div className="champion-img-name">
                              {index + 1}
                              <img
                                src={`https://ddragon.leagueoflegends.com/cdn/13.8.1/img/champion/${cleanName}.png`}
                              ></img>
                              <p className="white">{champion.champion}</p>
                            </div>
                          </>
                        );
                      })()}
                    </td>
                    <td>{champion.totalGames}</td>
                    <td className="white">{champion.kda.toFixed(2)}</td>
                  </tr>
                  {clickedChampion === champion && (
                    <td className="champion-details" colSpan={3}>
                      {/* Put your detailed data about the clickedChampion here */}
                      <div
                        className={
                          clickedChampion === champion
                            ? "slide-down-entered"
                            : "slide-down-exited"
                        }
                      >
                        <h3 className="white">{champion.champion} players</h3>

                        {championGames.map((game: any, gameIndex: number) => (
                          <div className="details-data" key={gameIndex}>
                            <p>{gameIndex + 1}</p>
                            <p className="white">{game.user_name}</p>
                            <div className="flex-details">
                              <p>
                                Kills:{" "}
                                <span className="white">{game.kills}</span>
                              </p>
                              <p>
                                Deaths:{" "}
                                <span className="white">{game.deaths}</span>
                              </p>
                              <p>
                                Assists:{" "}
                                <span className="white">{game.assists}</span>
                              </p>
                              <p>
                                KDA: <span className="white">{game.kda}</span>
                              </p>
                            </div>

                            {/* Add more game-specific stats here */}
                          </div>
                        ))}

                        {/* LOOP OVER championgames here and render out all the games with stats and the player*/}
                      </div>
                    </td>
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
      <button onClick={() => setShowFiltered(!showFiltered)}>
        {showFiltered
          ? "Show All Champions"
          : "Show Champions with Game Count >= 2"}
      </button>
      <RenderChampionTables
        championsByKDA={championsByKDA}
        championsByGames={championsByGames}
        championsByWinrate={championsByWinrate}
      />
    </div>
  );
}

const cleanChampionName = (name: string) => {
  let cleanedName = name.replace(/[^a-zA-Z]/g, ""); // Remove all characters that are not letters

  // Make the first letter following an apostrophe lowercase
  if (name.includes("'")) {
    const pos = name.indexOf("'");
    if (pos < name.length - 1) {
      const letterAfterApostrophe = name.charAt(pos + 1).toLowerCase();
      cleanedName =
        cleanedName.slice(0, pos) +
        letterAfterApostrophe +
        cleanedName.slice(pos + 1);
    }
  }
  return cleanedName;
};
