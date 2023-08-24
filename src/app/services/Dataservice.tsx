"use client";
import axios from "axios";

const api = axios.create({
  headers: {
    Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
    Accept: "application/json",
  },
});

type Division =
  | "1.div"
  | "2.div"
  | "3.div A"
  | "3.div B"
  | "3.div C"
  | "4.div A"
  | "4.div B"
  | "4.div C";

const divisionIds: Record<Division, number> = {
  "1.div": 11408,
  "2.div": 11451,
  "3.div A": 11490,
  "3.div B": 11491,
  "3.div C": 11492,
  "4.div A": 11493,
  "4.div B": 11494,
  "4.div C": 11495,
};

export async function fetchAllPlayerStats(
  division?: Division
): Promise<PlayerData[]> {
  let currentPage = 1;
  const allPlayerStats: any[] = [];

  const divisionId = division ? divisionIds[division] : undefined;

  try {
    while (true) {
      let urlMatchup = `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/matchup?competition_id=11710&from_date=2023-08-10&page=${currentPage}&filter=finished`;

      if (divisionId) {
        urlMatchup += `&division_id=${divisionId}`;
      }

      const matchupsData = (await api.get(urlMatchup)).data;

      const statsPromises = matchupsData.data.map((matchup: any) =>
        api.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/matchup/${matchup.id}/stats`
        )
      );

      const statsResponses = await Promise.all(statsPromises);

      statsResponses.forEach((response, index) => {
        const statsData = response.data;
        statsData.forEach((playerStat: any) => {
          playerStat.division = matchupsData.data[index].division;
        });
        allPlayerStats.push(...statsData);
      });

      if (matchupsData.meta.current_page >= matchupsData.meta.last_page) {
        break;
      }

      currentPage++;
    }

    // Filter out players with an undefined team_id
    const validPlayerStats = allPlayerStats.filter(
      (player) => player.team_id !== undefined
    );

    // Step 1: Extract all unique team_ids from validPlayerStats
    const uniqueTeamIds = Array.from(
      new Set(validPlayerStats.map((player) => player.team_id))
    );

    // Step 2: Fetch team names for each team_id and store in a map
    const teamNamesPromises = uniqueTeamIds.map((teamId) => {
      if (teamId != null) {
        return api.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/team/${teamId}`
        );
      }
      return Promise.resolve(null);
    });

    const teamNamesResponses = await Promise.all(teamNamesPromises);

    const teamNamesMap = new Map();
    teamNamesResponses.forEach((response: any, index: number) => {
      if (response) {
        teamNamesMap.set(uniqueTeamIds[index], response.data.name);
      }
    });

    // Now fetch player details and user nicknames for validPlayerStats only.
    const playerDetailsPromises = validPlayerStats.map((player: any) =>
      api.get(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/user/${player.user_id}`
      )
    );

    const userNicknamesPromises = validPlayerStats.map((player: any) =>
      api.get(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/user/${player.user_id}/thirdpartyaccounts?page=1`
      )
    );

    const [playerDetailsResponses, userNicknamesResponses] = await Promise.all([
      Promise.all(playerDetailsPromises),
      Promise.all(userNicknamesPromises),
    ]);

    const userNicknamesMap = new Map();

    userNicknamesResponses.forEach((response: any, index: number) => {
      const userId = validPlayerStats[index].user_id;
      const nicknameData = response.data.data.find(
        (item: any) => item.provider.title === "League of Legends"
      );
      if (nicknameData) {
        userNicknamesMap.set(userId, nicknameData.nickname);
      }
    });

    playerDetailsResponses.forEach((response, index) => {
      validPlayerStats[index].user_name = response.data.user_name;
      validPlayerStats[index].nationality = response.data.nationality;
    });

    // Step 3: Construct final player object with team name
    return validPlayerStats.map((player: any) => {
      const championStats: Record<string, GameStats[]> = {};

      player.stats.forEach((stat: any) => {
        if (!championStats[stat.character.name]) {
          championStats[stat.character.name] = [];
        }
        championStats[stat.character.name].push({
          kills: stat.kills,
          deaths: stat.deaths,
          assists: stat.assists,
        });
      });

      const nickname = userNicknamesMap.get(player.user_id) || "N/A";

      return {
        user_id: player.user_id,
        user_name: player.user_name,
        nationality: player.nationality,
        team_id: player.team_id,
        team_name: teamNamesMap.get(player.team_id) || "N/A", // Add team_name
        nickname: nickname,
        champions: championStats,
        division: player.division,
      };
    });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    return [];
  }
}
