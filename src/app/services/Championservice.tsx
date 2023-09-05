import axios from "axios";

export class Championservice {
  static async getChampionData({
    divisionID,
  }: {
    divisionID: string | number;
  }) {
    // Config for axios
    const axiosConfig = {
      headers: {
        Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
        Accept: "application/json",
      },
    };

    try {
      console.log("div id", divisionID); // Logging the division ID for debugging

      if (divisionID === undefined) {
        console.warn("divisionID is undefined");
        return null;
      }

      // Fetching the data
      const response = await axios.get(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/division/${divisionID}/stats/lol/champions`,
        axiosConfig
      );

      // Make sure to verify if response and response.data exist
      if (response && response.data) {
        return response.data;
      } else {
        console.warn("No data found");
        return null;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      throw error; // Optionally, you can propagate the error back to the caller
    }
  }
}
