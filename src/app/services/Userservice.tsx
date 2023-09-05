"use client";

import axios from "axios";

export class Userservice {
  static async getPlayersStats({
    division,
    season,
  }: {
    division: number;
    season: string;
  }) {
    console.log("Division:", division); // Add this line

    try {
      const axiosConfig = {
        headers: {
          Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
          Accept: "application/json",
        },
      };

      const [
        competition,
        divisions,
        tables,
        stats,
        players,
        championStats,
        championStatsPlayer,
      ] = await Promise.all([
        axios.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/competition/${season}`,
          {
            headers: axiosConfig.headers,
          }
        ),
        axios.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/competition/${season}/divisions`,
          { headers: axiosConfig.headers }
        ),
        axios.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/${division}/tables`,
          { headers: axiosConfig.headers }
        ),
        axios.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/${division}/stats`,
          {
            headers: axiosConfig.headers,
          }
        ),
        axios.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/${division}/players`,
          { headers: axiosConfig.headers }
        ),
        axios.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/${division}/stats/lol/champions`,
          { headers: axiosConfig.headers }
        ),
        axios.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/user/2474/stats/lol/champions?division_id=${division}`,
          { headers: axiosConfig.headers }
        ),
      ]);

      console.log("divisons", divisions.data);
      console.log("championstats", championStats.data);
      console.log("championplayerstats", championStatsPlayer.data);
      console.log("stats", stats.data);
      console.log("competition", competition.data);
      console.log("tables", tables.data);
      console.log("players", players.data);

      const playerData: any = players.data.data.map((player: any): any => {
        // Find the corresponding teamInfo and stats for the player
        const teamInfo = tables.data.find(
          (table: any) => table.team_id === player.team_id
        );
        const playerStats = stats.data.find(
          (stat: any) => stat.user && stat.user.id === player.user_id
        );

        // Merge player, teamInfo, and stats
        return {
          ...player,
          stats: playerStats, // Storing playerStats under the 'stats' key
          teamname: teamInfo ? teamInfo.display_name : "Unknown Team",
        };
      });

      // Filter out players that have no stats
      const filteredPlayerData = playerData.filter((player: any) => {
        return (
          player.stats !== null &&
          player.stats !== undefined &&
          Object.keys(player.stats).length > 0
        );
      });

      console.log("playerdata", playerData);
      console.log("filtreed", filteredPlayerData);

      return filteredPlayerData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
}
