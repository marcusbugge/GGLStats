import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Mvp({ selectedSeason, divisionId, mvpsort }: any) {
  const [roundData, setRoundData] = useState<any>(null);
  const [playerData, setPlayerData] = useState<any>(null);
  const [mvp, setMvp] = useState<any>(null);
  const [teamTableData, setTeamTableData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingRoundData, setIsLoadingRoundData] = useState<boolean>(false);
  const [isLoadingPlayerData, setIsLoadingPlayerData] =
    useState<boolean>(false);
  const [isLoadingTeamTableData, setIsLoadingTeamTableData] =
    useState<boolean>(false);

  const headers = {
    Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
    "Content-Type": "application/json",
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
  };

  const customWeights: any = {
    1: 1.0, // First place
    2: 1.1, // Second place
    3: 1.2,
    4: 1.3,
    5: 1.4,
    6: 1.5,
    7: 1.7,
    8: 1.7,
    9: 1.7,
    10: 1.8,
    // Add more placements as needed
  };

  console.log("teamtabledata", teamTableData);

  const getMultiplier = (teamId: string) => {
    if (!teamTableData) return 1;

    const team = teamTableData.signups.find((t: any) => t.team.id === teamId);
    if (!team) return 1;

    const placement = team.placement;
    const multiplier = customWeights[placement] || 1; // Default to 1 if placement is not found

    return multiplier;
  };

  const calculateAvgPlacement = (
    player: any,
    allPlayers: any[],
    allSortCategories: Record<string, string>
  ) => {
    let totalRank = 0;
    let categoriesCount = 0;

    // Assuming player has an opponentTeamId attribute

    console.log("playeroppononet", player);

    const multiplier: any = getMultiplier(player.opponentTeamId);

    for (let key in allSortCategories) {
      const statKey = allSortCategories[key];
      const sortedPlayers = [...allPlayers].sort(
        (a, b) => b[statKey] - a[statKey]
      );
      const rank =
        sortedPlayers.findIndex((p) => p.summonerName === player.summonerName) +
        1;
      totalRank += rank;
      categoriesCount++;
    }

    const avgPlacement = totalRank / categoriesCount;

    // Apply the multiplier to the overall average placement here.
    return avgPlacement * multiplier;
  };

  const convertStringNumbersToNumbers = (obj: any) => {
    for (let key in obj) {
      if (typeof obj[key] === "string" && !isNaN(Number(obj[key]))) {
        obj[key] = Number(obj[key]);
      } else if (typeof obj[key] === "object") {
        convertStringNumbersToNumbers(obj[key]);
      }
    }
    return obj;
  };

  useEffect(() => {
    console.log("roundnumber", mvpsort);

    const roundNumber = mvpsort.replace(/\D+/g, "");

    setIsLoadingRoundData(true);

    axios
      .get(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/${divisionId}/matchups?round_number=${roundNumber}&include_maps=1`,
        { headers }
      )
      .then((response) => {
        console.log("roundata", roundData);

        setRoundData(response.data);
      })
      .finally(() => {
        setIsLoadingRoundData(false);
      });
  }, [mvpsort, divisionId]);

  useEffect(() => {
    if (roundData) {
      setIsLoadingPlayerData(true);
      const matchIds = roundData.map((match: any) => match.id);

      Promise.all(
        matchIds.map((id: any) =>
          axios.get(
            `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/matchup/${id}/stats`,
            { headers }
          )
        )
      )
        .then((responses) => {
          const allPlayers: any = [];

          for (let i = 0; i < responses.length; i++) {
            const playersInMatch = responses[i].data;
            const { home_signup, away_signup } = roundData[i];

            playersInMatch.forEach((player: any) => {
              if (player.teamId === home_signup.team.id) {
                player.opponentTeamId = away_signup.team.id;
              } else {
                player.opponentTeamId = home_signup.team.id;
              }
              allPlayers.push(player);
            });
          }

          // Convert all string numbers to actual numbers
          const sanitizedPlayers = allPlayers.map((player: any) =>
            convertStringNumbersToNumbers({ ...player })
          );

          setPlayerData(sanitizedPlayers);
        })
        .finally(() => {
          setIsLoadingPlayerData(false);
        });
    }
  }, [roundData]);

  useEffect(() => {
    if (typeof divisionId !== "undefined") {
      setIsLoadingTeamTableData(true);
      fetch(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/competition/${selectedSeason}/tables`
      )
        .then((response) => response.json())
        .then((data) => {
          const division = data.find((div: any) => div.id === divisionId);
          if (division) {
            setTeamTableData(division);
          }
        })
        .finally(() => {
          setIsLoadingTeamTableData(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      console.error(`Unknown divisionId: ${divisionId}`);
    }
  }, [divisionId]);

  useEffect(() => {
    if (playerData) {
      const sortedPlayers = [...playerData]
        .map((player) => {
          const avgPlacement = calculateAvgPlacement(
            player,
            playerData,
            defaultSortColumns
          );

          return {
            ...player,
            avgPlacement,
          };
        })
        .sort((a, b) => a.avgPlacement - b.avgPlacement); // Lower average rank is better

      const uniqueSortedPlayers = Array.from(
        new Set(sortedPlayers.map((player) => player.summonerName))
      ).map((summonerName) =>
        sortedPlayers.find((player) => player.summonerName === summonerName)
      );

      setMvp(uniqueSortedPlayers.slice(0, 3)); // Extract the top 3 unique players
    }
  }, [playerData]);

  console.log("playerdta", playerData);
  const isEverythingLoaded =
    !isLoadingRoundData && !isLoadingPlayerData && !isLoadingTeamTableData;

  return (
    <div className="mvp-page">
      <h1 className="white">MVPs of the Round</h1>
      {!isEverythingLoaded ? (
        <p>Loading...</p>
      ) : mvp ? (
        <div className="podium">
          <div className="podiumname">
            <h2 className="white">{mvp[1]?.summonerName}</h2>
            <div className="placement placement-2">
              <p>2nd</p>
            </div>
          </div>
          <div className="podiumname">
            <h2 className="white">{mvp[0]?.summonerName}</h2>
            <div className="placement placement-1">
              <p>MVP</p>
            </div>
          </div>

          <div className="podiumname">
            <h2 className="white">{mvp[2]?.summonerName}</h2>
            <div className="placement placement-3">
              <p>3rd</p>
            </div>
          </div>
          <div className="mvpbg"></div>
        </div>
      ) : (
        <p>No data available.</p>
      )}

      <div className="understanding">
        <h3 className="white">Understanding the MVP Statistic</h3>
        <p>
          The MVP score is determined by taking an average of a players rankings
          across multiple game statistics such as Kills, Deaths, Assists, and so
          on. However, the score also factors in the skill level of the
          opponents faced. Performing well against a higher-ranked team results
          in a special boost to the MVP score.
        </p>
        <p>
          In simple terms, its not just about individual performance but also
          the caliber of the opponent. Both factors contribute to determining
          the true MVPs of the round.
        </p>
      </div>
    </div>
  );
}
