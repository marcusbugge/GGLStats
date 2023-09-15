import axios from "axios";
import { getData } from "../api/getTest";
import { GetServerSideProps } from "next";
export class Userservice {
  static async getPlayersStats({
    division,
    season,
  }: {
    division: number;
    season: string;
  }) {
    console.log("GAMER_API_TOKEN:", process.env.NEXT_PUBLIC_GAMER_API_TOKEN);

    try {
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GAMER_API_TOKEN}`,
          Accept: "application/json",
        },
      };

      const [tables, stats, players] = await Promise.all([
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
      ]);

      console.log("token", process.env.NEXT_PUBLIC_GAMER_API_TOKEN);

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

      return filteredPlayerData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
}
