import React, { useState, useEffect } from "react";
import Loadingspin from "../components/Loadingspin";

interface Player {
  summonerName: string;
  teamId: string;
  nationality: string;
  user_name: string;
  rank?: { rank: string; LP: string }; // This is the change
  division?: string;
}

interface LadderServiceProps {
  players: any[];
  navSort: any;
}

const LadderService = ({ players, navSort }: LadderServiceProps) => {
  const [allPlayerInfo, setAllPlayerInfo] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Add this line
  const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

  let sortedPlayers = [...players]; // Create a copy of players

  const sortPlayers = (players: Player[], sortBy: string) => {
    let sorted = [...players];
    if (sortBy === "Division") {
      sorted.sort((a, b) => {
        if (a.division && b.division) {
          return a.division.localeCompare(b.division);
        }
        return 0;
      });
    }
    // Add more sorting conditions here as needed.
    return sorted;
  };

  useEffect(() => {
    // Call the sorting function whenever 'navSort' changes
    const sorted = sortPlayers(allPlayerInfo, navSort);
    setAllPlayerInfo(sorted);
  }, [navSort]);

  const rankPriority: any = {
    Challenger: 9,
    Grandmaster: 8,
    Master: 7,
    Diamond: 6,
    Emerald: 5,
    Platinum: 4,
    Gold: 3,
    Silver: 2,
    Iron: 1,
  };

  const romanPriority: any = {
    I: 4,
    II: 3,
    III: 2,
    IV: 1,
  };

  const fetchDivisionStats = async (divisionIds: string[]) => {
    const promises = divisionIds.map((id) =>
      fetch(
        `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/division/${id}/stats`
      ).then((response) => response.json())
    );

    return await Promise.all(promises);
  };

  const fetchRank = async (
    summonerNames: string[]
  ): Promise<Map<string, { rank: string; LP: string }>> => {
    const url = `/api/gamer-proxy?https://api.lolstats.fourzero.one/v2/summonerrank?region=euw1&&summoner=${summonerNames.join(
      ","
    )}`;
    const response = await fetch(url);
    const data = await response.text();

    return parseRankData(data);
  };

  const parseRankData = (
    data: string
  ): Map<string, { rank: string; LP: string }> => {
    const entries = data.split(" || ");
    const rankMap = new Map<string, { rank: string; LP: string }>();

    const rankRegex =
      /(Iron|Silver|Gold|Platinum|Emerald|Diamond|Master|Grandmaster|Challenger) ([IVXLCDM]+) - (\d+LP)/;

    for (const entry of entries) {
      const rankMatch = entry.match(rankRegex);
      if (rankMatch) {
        const name = entry.substring(0, rankMatch.index).trim();
        const rank = `${rankMatch[1]} ${rankMatch[2]}`;
        const LP = rankMatch[3];
        rankMap.set(name, { rank, LP });
      }
    }

    return rankMap;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        /* const divisionsResponse = await fetch(
          `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/competition/${id}/divisions`
        );

        const allDivisions = await divisionsResponse.json();

        // Filter out divisions with order greater than 3
        const filteredDivisions = allDivisions.filter(
          (division: any) => division.order <= 5
        );

        const allPlayerStats = await fetchDivisionStats(
          filteredDivisions.map((d: any) => d.id)
        );

        const updatedPlayerInfo: Player[] = [];

        for (let i = 0; i < allPlayerStats.length; i++) {
          const stats = allPlayerStats[i];
          const division = allDivisions[i];

          for (const player of stats) {
            const summonerName = player.summonerName || "Unknown";
            const teamId = player.teamname || "Unknown";
            const nationality = player.user.nationality;
            const user_name = player.user.user_name;

            updatedPlayerInfo.push({
              summonerName,
              teamId,
              nationality,
              user_name,
              division: division.name, // Use the division name directly
            });
          }
        }

        const rankPromises = [];

        const chunks = [];
        for (let i = 0; i < updatedPlayerInfo.length; i += 12) {
          chunks.push(updatedPlayerInfo.slice(i, i + 12));
        }

        for (const chunk of chunks) {
          await sleep(670); // waits for 500 ms
          const summonerNames = chunk.map((player) => player.summonerName);
          const rankPromise = fetchRank(summonerNames).then((rankMap: any) => {
            for (const player of chunk) {
              player.rank = rankMap.get(player.summonerName) || {
                rank: "Unranked",
                LP: "0LP",
              };
            }
          });

          rankPromises.push(rankPromise);
        }

        await Promise.all(rankPromises);

        updatedPlayerInfo.sort((a, b) => {
          const aRankStr = a.rank?.rank || "";
          const bRankStr = b.rank?.rank || "";

          const [rankA = "", divisionA = ""] = aRankStr.split(" ");
          const [rankB = "", divisionB = ""] = bRankStr.split(" ");

          const LPA = parseInt(a.rank?.LP.replace("LP", "") || "0", 10);
          const LPB = parseInt(b.rank?.LP.replace("LP", "") || "0", 10);

          if (rankPriority[rankA] !== rankPriority[rankB]) {
            return (rankPriority[rankB] || 0) - (rankPriority[rankA] || 0);
          }

          if (divisionA && divisionB && divisionA !== divisionB) {
            return (
              (romanPriority[divisionB] || 0) - (romanPriority[divisionA] || 0)
            );
          }

          return LPB - LPA;
        });

        setAllPlayerInfo(updatedPlayerInfo); */
      } catch (error) {
        console.error(`Could not fetch data: ${error}`);
      } finally {
        setIsLoading(false); // Add this line
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="loadingspinner">
        <Loadingspin />
      </div>
    ); // Simple loading indicator, you can replace with your own animation
  }

  return (
    <div>
      <h2>GGL SoloQ Ladder</h2>

      <p>
        <strong className="white">Note: </strong>
        Some players may encounter difficulty locating their profiles. This
        could be due to special characters in their usernames or a potential bug
        in the system.
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>IGN</th>

            <th>Division</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {allPlayerInfo.map((player: Player, index: number) => (
            <tr key={index}>
              <td className="white flagname">
                <p className="rank-ladder">{index + 1}</p>
                <img
                  src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
                  alt={`${player.nationality} flag`}
                />
                {player.user_name}
              </td>
              <td>{player.summonerName}</td>

              <td>{player.division}</td>
              <td className="white">
                {player.rank?.rank} - {player.rank?.LP}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LadderService;
