import React, { useState } from "react";

interface Champion {
  champtionId: number;
  image: string;
  name: string;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgGoldEarnedPerMinute: number;
  avgKillParticipation: number;
  avgMinionsKilledPerMinute: number;
  avgTotalMinionsKilled: number;
  winCount: number;
  count: number;
}

interface PlayerStatsProps {
  champData: Champion[];
}

export default function PlayerStats({ champData }: PlayerStatsProps) {
  // State to control the number of champions displayed
  const [displayCount, setDisplayCount] = useState(15);

  const handleShowMore = () => {
    // Increase the number of champions displayed by 15 each time the button is pressed
    setDisplayCount((prevCount) => prevCount + 15);
  };
  return (
    <div className="playerstats">
      {champData.slice(0, displayCount).map((champion) => {
        const winrate = (champion.winCount / champion.count) * 100;
        const winrateStyle = {
          color: winrate >= 60 ? "#ff4d4d" : "lightgray",
        };

        const kda =
          (champion.avgKills + champion.avgAssists) / champion.avgDeaths;
        const kdaStyle = {
          color:
            kda >= 5
              ? "#ff4d4d"
              : kda >= 4
              ? "#0093ff"
              : kda >= 3
              ? "#00bba3"
              : "gray",
        };

        return (
          <div key={champion.champtionId} className="champion-statss">
            <div className="firstt">
              <img
                src={champion.image}
                alt={champion.name}
                style={{ width: 50, height: 50 }}
              />
              <div className="stats-playerss">
                <div className="first-stats">
                  <h1>{champion.name}</h1>
                  <p>
                    CS {champion.avgTotalMinionsKilled.toFixed(0)} (
                    {champion.avgMinionsKilledPerMinute.toFixed(2)})
                  </p>
                </div>
                <div className="middle-stats">
                  <p className="killsdeathassist" style={kdaStyle}>
                    {kda.toFixed(2)} KDA
                  </p>
                  <p>
                    {champion.avgKills.toFixed(1) +
                      " / " +
                      champion.avgDeaths.toFixed(1) +
                      " / " +
                      champion.avgAssists.toFixed(1)}
                  </p>
                </div>
                <div className="last-stats">
                  <p className="wr" style={winrateStyle}>
                    {winrate.toFixed(0)}%
                  </p>
                  <p>{champion.count} games</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="showmore">
        {displayCount < champData.length && (
          <p onClick={handleShowMore} className="load-more">
            Load more...
          </p>
        )}
      </div>
    </div>
  );
}
