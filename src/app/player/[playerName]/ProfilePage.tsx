import React, { useState, useEffect, useMemo } from "react";
import "./playerprofile.css";

import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import PlayerHistory from "./PlayerHistory";
import PlayerMarks from "./Playermarks";
import PlayerInfo from "./Playerinfo";
import PlayerStats from "./Playerstats";
import GGLlogo from "../../assets/GGL.png";
import { log } from "console";
import Image from "next/image";

export default function PlayerProfile() {
  const { playerName }: any = useParams();
  const searchParams = useSearchParams();
  const divisionID = searchParams.get("divisionID");
  let teamID = searchParams.get("teamID");

  if (teamID == "undefined") {
    teamID = "111111";
  }

  const [data, setData]: any = useState({
    isLoading: true,
    user: null,
    games: [],
    role: "",
    championBg: "",
    champData: null,
  });

  const playerNameUpper = useMemo(
    () => playerName?.toUpperCase() || "",
    [playerName]
  );

  useEffect(() => {
    async function fetchUserDetails() {
      if (!playerName) {
        console.log("Ingen spillernavn tilgjengelig");
        return;
      }

      console.log("Starter datahenting for spiller:", playerName);
      const userID = Array.isArray(playerName) ? playerName[0] : playerName;
      const urls = [
        `/api/gamer-proxy?https://www.gamer.no/api/paradise/user/${userID}`,
        `/api/gamer-proxy?https://www.gamer.no/api/paradise/user/${userID}/stats/lol/team-position-counts?fromDate=2015-11-08`,
      ];

      try {
        console.log("Henter brukerdetaljer og rolledata...");
        const [userDetailsResponse, roleDataResponse] = await Promise.all(
          urls.map((url) => axios.get(url))
        );

        console.log("Brukerdetaljer mottatt:", userDetailsResponse.data);
        console.log("Rolledata mottatt:", roleDataResponse.data);

        const user = userDetailsResponse.data;
        const roles = roleDataResponse.data?.data?.positions || [];
        console.log("Behandler rolledata:", roles);

        let mostPlayedRole = { name: "unknown", count: 0 };
        if (Array.isArray(roles) && roles.length > 0) {
          mostPlayedRole = roles.reduce(
            (acc: any, role: any) => (role.count > acc.count ? role : acc),
            roles[0]
          );
        }
        console.log("Mest spilte rolle:", mostPlayedRole);

        const today = new Date().toISOString().split("T")[0];
        console.log("Henter champion-statistikk...");
        const championsResponse = await axios.get(
          `/api/gamer-proxy?https://www.gamer.no/api/paradise/user/${userID}/stats/lol/champions?fromDate=2015-11-08&toDate=${today}`
        );
        console.log("Champion-data mottatt:", championsResponse.data);

        const championsData = championsResponse.data?.data || [];
        let mostPlayedChampion = { name: "unknown", count: 0 };
        if (Array.isArray(championsData) && championsData.length > 0) {
          mostPlayedChampion = championsData.reduce(
            (prev: any, current: any) =>
              prev.count > current.count ? prev : current,
            championsData[0]
          );
        }
        console.log("Mest spilte champion:", mostPlayedChampion);

        const formattedName = formatChampionName(mostPlayedChampion.name);
        const championBg = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedName}_0.jpg`;

        let games = [];
        if (user.team_id) {
          console.log(
            "Henter lagkamper for team_id:",
            teamID,
            "og division_id:",
            divisionID
          );
          const matchupsResponse = await axios.get(
            `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/matchup?team_id=${teamID}&division_id=${divisionID}`
          );
          const matchups = matchupsResponse.data.data;
          console.log("Matchups mottatt:", matchups);

          console.log("Henter statistikk for hver kamp...");
          const allStats = await Promise.all(
            matchups.map(async (matchup: any) => {
              console.log("Henter statistikk for kamp:", matchup.id);
              const statsResponse = await axios.get(
                `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/matchup/${matchup.id}/stats`
              );
              const opponent =
                matchup.home_signup.team.id === user.team_id
                  ? matchup.away_signup
                  : matchup.home_signup;
              return {
                matchupData: matchup,
                statsData: statsResponse.data,
                opponent,
              };
            })
          );

          console.log("All kampstatistikk hentet:", allStats);

          games = allStats
            .flatMap(({ statsData, opponent }) =>
              statsData.map((stat: any) => ({ ...stat, opponent }))
            )
            .filter((stat) => stat.remoteId === user.id)
            .reverse();
          console.log("Filtrerte kamper for spiller:", games);
        }

        console.log("Setter oppdatert data til state");
        setData({
          isLoading: false,
          user,
          games,
          role: mostPlayedRole,
          championBg,
          champData: championsData,
        });
      } catch (error) {
        console.error("Feil ved henting av data:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios feildetaljer:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
          });
        }
        setData((prev: any) => ({ ...prev, isLoading: false }));
      }
    }

    fetchUserDetails();
  }, [playerName, teamID, divisionID]);

  if (data.isLoading) {
    return (
      <div className="loader-img">
        <Image src={GGLlogo} alt="logo" width={200} height={200} />
      </div>
    );
  }

  if (!data.user) {
    return (
      <div className="playerprofile">
        <div>Kunne ikke finne bruker</div>
      </div>
    );
  }

  const headerStyle = {
    backgroundImage: `url(${data.championBg})`,
    backgroundSize: "cover",
    opacity: "1",
  };

  console.log(data);

  return (
    <div className="playerprofile">
      <div className="headerr" style={headerStyle}>
        {data.user.user_name.toUpperCase()}
        {data.user.teamname}
      </div>
      <div>
        <div className="header-info"></div>
        <div className="player-grid">
          <div className="left-grid">
            <PlayerInfo role={data.role} user={data.user} />
            <PlayerStats champData={data.champData} />
          </div>
          <PlayerHistory
            playerID={playerNameUpper}
            teamID={teamID}
            user={data.user}
            games={data.games}
          />
        </div>
      </div>
    </div>
  );
}

function formatChampionName(name: any) {
  return name.replace(/['\s]+/g, "");
}
