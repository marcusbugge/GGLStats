"use client";

import axios from "axios";

export class Championservice {
  static async getChampionData() {
    try {
      const axiosConfig = {
        headers: {
          Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
          Accept: "application/json",
        },
      };

      const [championStats, championStatsPlayer] = await Promise.all([
        axios.get(
          "https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/11408/stats/lol/champions",
          { headers: axiosConfig.headers }
        ),
        axios.get(
          "https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/user/2474/stats/lol/champions?division_id=11408",
          { headers: axiosConfig.headers }
        ),
      ]);

      return championStats.data;
    } catch {
      console.log("");
    }
  }
}
