import axios from "axios";
import roles from "../../../roles.json"; // Assuming roles.json is stored locally and can be imported directly
interface PlayerRoles {
  [key: string]: string;
}

interface RolesData {
  PlayerRoles: PlayerRoles;
}

const rolesData: RolesData = roles;
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

      const playerData = players.data.data.map((player: any): any => {
        // Find the corresponding teamInfo and stats for the player
        const teamInfo = tables.data.find(
          (table: any) => table.team_id === player.team_id
        );
        const playerStats = stats.data.find(
          (stat: any) => stat.user && stat.user.id === player.user_id
        );

        // Find player role from roles.json data
        const playerRole: string =
          rolesData.PlayerRoles[player.user_id.toString()];

        // Merge player, teamInfo, stats, and add role
        return {
          ...player,
          stats: playerStats, // Storing playerStats under the 'stats' key
          teamname: teamInfo ? teamInfo.display_name : "Unknown Team",
          role: playerRole ? playerRole : "?", // Add the role or mark as unknown
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

      console.log(filteredPlayerData);

      return filteredPlayerData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
}
