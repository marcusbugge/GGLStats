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

      // Create a map of player stats for easy lookup
      const playerStatsMap = new Map<number, any>();
      stats.data.forEach((stat: any) => {
        if (stat.user && stat.user.id) {
          playerStatsMap.set(stat.user.id, stat);
        }
      });

      // Create a map of player data for easy lookup
      const playerDataMap = new Map<number, any>();
      players.data.data.forEach((player: any) => {
        playerDataMap.set(player.user_id, player);
      });

      const mergedPlayerData: any[] = [];

      // Iterate through stats and add all players with stats
      playerStatsMap.forEach((playerStat, userId) => {
        const player = playerDataMap.get(userId) || {
          user_id: userId,
          user: playerStat.user, // Include the whole user object
        };
        const teamInfo = tables.data.find(
          (table: any) => table.team_id === player.team_id
        );
        const playerRole: string = rolesData.PlayerRoles[userId.toString()];

        mergedPlayerData.push({
          ...player,
          stats: playerStat,
          teamname: teamInfo ? teamInfo.display_name : "Unknown Team",
          role: playerRole ? playerRole : "?",
        });
      });

      console.log(mergedPlayerData);

      return mergedPlayerData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
}
