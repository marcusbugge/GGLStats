import axios from "axios";

const headers = {
  Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
  Accept: "application/json",
};

export async function getData() {
  let data = await Promise.all([axios.get(
    `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/competition/11710`,
    {
      headers: headers,
    }
  )]);

  return data;
}
