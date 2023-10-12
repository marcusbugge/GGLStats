import axios from "axios";

import { GetServerSideProps } from "next";
export class Userservice {
  static async getPlayersStats({
    division,
    season,
  }: {
    division: number;
    season: string;
  }) {
    try {
      const [tables, stats, players] = await Promise.all([
        axios.get(
          `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/division/${division}/tables`
        ),
        axios.get(
          `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/division/${division}/stats`
        ),
        axios.get(
          `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/division/${division}/players`
        ),
      ]);

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
