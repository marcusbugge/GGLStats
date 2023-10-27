import React, { useEffect, useState } from "react";
import Loadingspin from "./Loadingspin";

const GameDetails = ({ matchID, isWinningTeam }: any) => {
  const [playerStats, setPlayerStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedPosition = window.scrollY;

    setIsLoading(true); // Set loading to true before API call
    fetch(
      `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/matchup/${matchID}/stats`
    )
      .then((response) => response.json())
      .then((data) => {
        setPlayerStats(data);
        setIsLoading(false); // Set loading to false after API call
      });
  }, []);

  useEffect(() => {}, []);

  // Group player stats by gameTime
  const groupByGameTime: { [key: string]: any[] } = {};
  playerStats.forEach((player: any) => {
    const gameTime = player.playTime;
    if (!groupByGameTime[gameTime]) {
      groupByGameTime[gameTime] = [];
    }
    groupByGameTime[gameTime].push(player);
  });

  const renderItem = (player: any) => {
    const items = [];
    let lastItem = null;

    for (let i = 0; i <= 5; i++) {
      const itemID = player[`item${i}`];
      const itemImage = player[`item${i}Image`];
      const itemName = player[`item${i}Name`];

      if (itemID && itemImage && itemName) {
        if (i !== 5) {
          items.push(
            <div key={itemID} className="item">
              <img src={itemImage} alt={itemName} title={itemName} />
            </div>
          );
        } else {
          lastItem = (
            <div key={itemID} className="item last-item">
              <img src={itemImage} alt={itemName} title={itemName} />
            </div>
          );
        }
      }
    }

    return (
      <div className="item-container">
        {lastItem}
        {items}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="game-details-container">
        <div className="loading-spinners white" style={{ minHeight: "500px" }}>
          <Loadingspin />
        </div>
      </div>
    );
  }

  return (
    <div>
      {Object.keys(groupByGameTime).map((gameTime, gameIndex) => (
        <div key={gameTime}>
          <h4 className="gamecount white">Game {gameIndex + 1}</h4>
          <div className="game">
            <div className="width100">
              {groupByGameTime[gameTime]
                .filter((player: any) => player.side === "home")
                .map((player: any, index) => (
                  <div className="player-game" key={index}>
                    <div className="testtesttest">
                      <img
                        src={player.championImage}
                        alt={player.championName}
                      />
                      <h4 className="white">{player.summonerName}</h4>
                    </div>

                    <p className="">
                      {player.kills} / {player.deaths} / {player.assists}
                    </p>

                    <div className="item-hold">{renderItem(player)}</div>

                    {/* Add more stats here */}
                  </div>
                ))}
            </div>
            <div className="width100">
              {groupByGameTime[gameTime]
                .filter((player: any) => player.side !== "home")
                .map((player: any, index) => (
                  <div className="player-game" key={index}>
                    <div className="testtesttest">
                      <img
                        src={player.championImage}
                        alt={player.championName}
                      />
                      <h4 className="white">{player.summonerName}</h4>
                    </div>

                    <p className="">
                      {player.kills} / {player.deaths} / {player.assists}
                    </p>

                    <div className="item-hold">{renderItem(player)}</div>

                    {/* Add more stats here */}
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameDetails;
