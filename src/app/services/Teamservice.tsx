"use client";

import axios from "axios";
import { Gameservice } from "./Gameservice";

const divisionIds: Record<string, number> = {
  "1.div": 11408,
  "2.div": 11451,
  "3.div A": 11490,
  "3.div B": 11491,
  "3.div C": 11492,
  "4.div A": 11493,
  "4.div B": 11494,
  "4.div C": 11495,
};

interface Params {
  division: number;
  playerStatsTest: any; // Consider replacing 'any' with a proper type
}

export class Teamservice {
  static async getPlayersByTeamWithStats(params: Params) {
    const { division } = params;

    const axiosConfig = {
      headers: {
        Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
        Accept: "application/json",
      },
    };

    try {
      // Get players
      const playerReponse = await axios.get(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/${division}/players`,
        { headers: axiosConfig.headers }
      );
      const players = playerReponse.data;

      // Get teams
      const teamReponse = await axios.get(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/${division}/tables`,
        { headers: axiosConfig.headers }
      );
      const teams = teamReponse.data;

      // Create a mapping of team IDs to team names
      const teamNameMap: Record<string, string> = {};
      for (const team of teams) {
        teamNameMap[team.id] = team.name;
      }

      // Check if players is iterable
      if (players && Array.isArray(players)) {
        for (const player of players) {
          const teamId = player.team_id;
          const teamName = teamNameMap[teamId] || "Unknown";
          player.teamName = teamName; // Add the teamName attribute to each player object
        }
      } else {
        console.error("Received non-iterable data for players:", players);
      }
    } catch (error) {
      console.error("Failed to retrieve players:", error);
    }
  }
}
