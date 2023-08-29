import React, { useState, useEffect } from "react";
import axios from "axios";

interface Player {
  nickname: string;
  team_name: string;

  [key: string]: any;
}

const LadderService: React.FC<{ players: Player[] }> = ({ players }) => {
  const tierOrder = [
    "iron",
    "bronze",
    "silver",
    "gold",
    "platinum",
    "emerald",
    "diamond",
    "master",
    "grandmaster",
    "challenger",
  ];

  const [rankedPlayers, setRankedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const MAX_NAMES_PER_REQUEST = 12;
        const chunkedPlayers = Array.from(
          { length: Math.ceil(players.length / MAX_NAMES_PER_REQUEST) },
          (_, i) =>
            players.slice(
              i * MAX_NAMES_PER_REQUEST,
              (i + 1) * MAX_NAMES_PER_REQUEST
            )
        );

        const rankedPlayers: Player[] = [];

        const fetchChunk = async (playerChunk: Player[]) => {
          const summonerNames = playerChunk.map((p) => p.nickname).join(", ");
          const res = await axios.get(
            `https://corsproxy.io/?https://api.lolstats.fourzero.one/v2/summonerrank?region=euw1&&summoner=${summonerNames}`
          );
          const rankStrings: string = res.data;
          const rankArray = rankStrings.split(" || ");

          for (const player of playerChunk) {
            const rankInfo = rankArray.find((rankStr) => {
              const match = rankStr.match(
                new RegExp(`^${player.nickname}\\s+(.*)`)
              );
              return match ? true : false;
            });
            const rank = rankInfo
              ? rankInfo.replace(new RegExp(`^${player.nickname}\\s+`), "")
              : "Unranked";
            rankedPlayers.push({ ...player, rank });
          }
        };

        const promises = chunkedPlayers.map(fetchChunk);
        await Promise.all(promises);

        rankedPlayers.sort((a, b) => {
          const aRankInfo = a.rank.toLowerCase().split(" - ");
          const bRankInfo = b.rank.toLowerCase().split(" - ");

          const aTierDivision = aRankInfo[0].split(" ");
          const bTierDivision = bRankInfo[0].split(" ");

          const aTier = aTierDivision[0];
          const bTier = bTierDivision[0];

          const aTierIndex = tierOrder.indexOf(aTier);
          const bTierIndex = tierOrder.indexOf(bTier);

          if (aTierIndex < bTierIndex) return 1;
          if (aTierIndex > bTierIndex) return -1;

          // If the tier is below 'master', check divisions
          if (aTierIndex < tierOrder.indexOf("master")) {
            const aDivision = parseInt(aTierDivision[1]);
            const bDivision = parseInt(bTierDivision[1]);

            if (aDivision !== bDivision) {
              return bDivision - aDivision; // 1 > 2 > 3 > 4
            }
          }

          // If both are the same tier and division, check LP
          const aLP = parseInt(aRankInfo[1].split("LP")[0]);
          const bLP = parseInt(bRankInfo[1].split("LP")[0]);

          return bLP - aLP; // Higher LP should come first
        });

        setRankedPlayers(rankedPlayers);
      } catch (error) {
        console.error(`Could not fetch ranks: ${error}`);
        setRankedPlayers(
          players.map((player) => ({ ...player, rank: "Unranked" }))
        );
      }
    };

    fetchRanks();
  }, [players]);

  return (
    <div>
      <h2>GGL SoloQ Ladder</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>IGN</th>
            <th>Team</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {rankedPlayers.map((player: any, index: any) => (
            <tr key={index}>
              <td className="white flagname">
                <p className="rank-ladder">{index + 1}</p>
                <img
                  src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                  alt={`${player.nationality} flag`}
                />
                {player.user_name}
              </td>
              <td>{player.nickname}</td>

              <td>{player.team_name}</td>
              <td className="white">{player.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LadderService;
