"use client";

import { Gameservice } from "./Gameservice";

// Inside your Teamservice class
// Inside your Teamservice class
export class Teamservice {
  static getPlayersByTeamWithStats(
    playerDataList: PlayerData[]
  ): Record<string, PlayerDataWithStats[]> {
    const teams: Record<string, PlayerDataWithStats[]> = {};

    // Generate statistics for each player using Gameservice methods
    const kdaStats = Gameservice.getPlayersByKDA(playerDataList);
    const killsStats = Gameservice.getPlayersByKills(playerDataList);
    const deathsStats = Gameservice.getPlayersByDeaths(playerDataList);
    const assistsStats = Gameservice.getPlayersByAssists(playerDataList);

    playerDataList.forEach((playerData) => {
      const teamName = playerData.team_name;
      if (!teams[teamName]) {
        teams[teamName] = [];
      }

      // Find the player stats
      const kdaStat = kdaStats.find(
        (stat) => stat.user_id === playerData.user_id
      );
      const killsStat = killsStats.find(
        (stat) => stat.user_id === playerData.user_id
      );
      const deathsStat = deathsStats.find(
        (stat) => stat.user_id === playerData.user_id
      );
      const assistsStat = assistsStats.find(
        (stat) => stat.user_id === playerData.user_id
      );

      // Attach the stats to the player data
      const playerWithStats: PlayerDataWithStats = {
        ...playerData,
        kda: kdaStat?.kda || 0,
        totalKills: killsStat?.totalKills || 0,
        totalDeaths: deathsStat?.totalDeaths || 0,
        totalAssists: assistsStat?.totalAssists || 0,
        killsPerGame: killsStat?.killsPerGame || 0,
        deathsPerGame: deathsStat?.deathsPerGame || 0,
        assistsPerGame: assistsStat?.assistsPerGame || 0,
      };

      teams[teamName].push(playerWithStats);
    });

    // Sort the player stats within each team in descending order based on different metrics
    for (const teamName in teams) {
      teams[teamName].sort((a, b) => {
        // Sorting logic can be adjusted based on your specific needs.
        // Here it's sorted by KDA, then totalKills, then totalAssists.
        if (b.kda !== a.kda) return Number(b.kda) - Number(a.kda);
        if (b.totalKills !== a.totalKills) return b.totalKills - a.totalKills;
        return b.totalAssists - a.totalAssists;
      });
    }

    return teams;
  }
}

export interface PlayerDataWithStats extends PlayerData {
  kda: number | string; // or 'Perfect'
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  killsPerGame: number;
  deathsPerGame: number;
  assistsPerGame: number;
}
