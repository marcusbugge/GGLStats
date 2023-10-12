import axios from "axios";

export class Championservice {
  static async getChampionData({
    divisionID,
  }: {
    divisionID: string | number;
  }) {
    try {
      if (divisionID === undefined) {
        console.warn("divisionID is undefined");
        return null;
      }

      // Fetching the data
      const response = await axios.get(
        `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/division/${divisionID}/stats/lol/champions`
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
