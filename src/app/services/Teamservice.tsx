"use client";

export class Teamservice {
  static getPlayersByTeam(
    playerDataList: PlayerData[]
  ): Record<string, PlayerData[]> {
    const teams: Record<string, PlayerData[]> = {};

    playerDataList.forEach((playerData) => {
      const teamName = playerData.team_name;
      if (!teams[teamName]) {
        teams[teamName] = [];
      }
      teams[teamName].push(playerData);
    });

    return teams;
  }
}
