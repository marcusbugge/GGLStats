"use client";

export class Gameservice {
  static getPlayersByKills(playerDataList: PlayerData[]): PlayerKillsSummary[] {
    return playerDataList
      .filter((playerData) => Object.keys(playerData.champions).length > 0)
      .map((playerData) => {
        const totalKills = Object.values(playerData.champions)
          .flat()
          .reduce((sum, game) => sum + game.kills, 0);
        const totalGames = Object.values(playerData.champions).flat().length;
        return {
          user_id: playerData.user_id,
          user_name: playerData.user_name,
          nationality: playerData.nationality,
          totalKills,
          killsPerGame: totalKills / totalGames,
          gameCount: totalGames,
          nickname: playerData.nickname,
          team_name: playerData.team_name,
        };
      })
      .sort((a, b) => b.totalKills - a.totalKills);
  }

  static getPlayersByDeaths(
    playerDataList: PlayerData[]
  ): PlayerDeathsSummary[] {
    return playerDataList
      .filter((playerData) => Object.keys(playerData.champions).length > 0)
      .map((playerData) => {
        const totalDeaths = Object.values(playerData.champions)
          .flat()
          .reduce((sum, game) => sum + game.deaths, 0);
        const totalGames = Object.values(playerData.champions).flat().length;
        return {
          user_id: playerData.user_id,
          user_name: playerData.user_name,
          nationality: playerData.nationality,
          totalDeaths,
          deathsPerGame: totalDeaths / totalGames,
          gameCount: totalGames,
        };
      })
      .sort((a, b) => b.totalDeaths - a.totalDeaths);
  }

  static getPlayersByAssists(
    playerDataList: PlayerData[]
  ): PlayerAssistsSummary[] {
    return playerDataList
      .filter((playerData) => Object.keys(playerData.champions).length > 0)
      .map((playerData) => {
        const totalAssists = Object.values(playerData.champions)
          .flat()
          .reduce((sum, game) => sum + game.assists, 0);
        const totalGames = Object.values(playerData.champions).flat().length;
        return {
          user_id: playerData.user_id,
          user_name: playerData.user_name,
          nationality: playerData.nationality,
          totalAssists,
          assistsPerGame: totalAssists / totalGames,
          gameCount: totalGames,
        };
      })
      .sort((a, b) => b.totalAssists - a.totalAssists);
  }

  static getChampionsByKills(
    playerDataList: PlayerData[]
  ): ChampionKillsSummary[] {
    const championStats = this.aggregateChampionStats(playerDataList);
    return Object.entries(championStats)
      .map(([champion, stats]) => ({
        champion,
        totalKills: stats.kills,
        killsPerGame: stats.kills / stats.gameCount,
        gameCount: stats.gameCount,
        topPlayer: stats.topPlayer, // This might need further adjustments if you want to implement it again
      }))
      .sort((a, b) => b.totalKills - a.totalKills);
  }

  private static aggregateChampionStats(playerDataList: PlayerData[]) {
    const championStats: Record<string, any> = {};

    playerDataList.forEach((playerData) => {
      Object.entries(playerData.champions).forEach(([champion, games]) => {
        if (!championStats[champion]) {
          championStats[champion] = {
            kills: 0,
            deaths: 0,
            assists: 0,
            gameCount: 0,
          };
        }
        games.forEach((game) => {
          championStats[champion].kills += game.kills;
          championStats[champion].deaths += game.deaths;
          championStats[champion].assists += game.assists;
          championStats[champion].gameCount += 1;
        });
      });
    });

    return championStats;
  }
}
