"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const fetchPlayerData = async (): Promise<PlayerData[]> => {
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
        "https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/competition/11710",
        {
          headers: axiosConfig.headers,
        }
      ),
      axios.get(
        "https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/competition/11710/divisions",
        { headers: axiosConfig.headers }
      ),
      axios.get(
        "https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/11408/tables",
        { headers: axiosConfig.headers }
      ),
      axios.get(
        "https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/11408/stats",
        {
          headers: axiosConfig.headers,
        }
      ),
      axios.get(
        "https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/11408/players",
        { headers: axiosConfig.headers }
      ),
      axios.get(
        "https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/11408/stats/lol/champions",
        { headers: axiosConfig.headers }
      ),
      axios.get(
        "https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/user/2474/stats/lol/champions?division_id=11408",
        { headers: axiosConfig.headers }
      ),
    ]);

    console.log("divisons", divisions.data);
    console.log("championstats", championStats.data);
    console.log("championplayerstats", championStatsPlayer.data);
    console.log("stats", stats.data);
    console.log("competition", competition.data);
    console.log("tables", tables.data);

    const playerData: any = stats.data.map((player: any): any => {
      const teamInfo = tables.data.find(
        (table: any) => table.team_id === player.user.team_id
      );
      return {
        ...player,
        teamname: teamInfo ? teamInfo.display_name : "Unknown Team",
      };
    });

    console.log("playerdata", playerData);

    return playerData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default fetchPlayerData;
