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
      if (!playerName) return;

      const userID = Array.isArray(playerName) ? playerName[0] : playerName;
      const urls = [
        `/api/gamer-proxy?https://www.gamer.no/api/paradise/user/${userID}`,
        `/api/gamer-proxy?https://www.gamer.no/api/paradise/user/${userID}/stats/lol/team-position-counts?fromDate=2015-11-08`,
      ];

      try {
        const [userDetailsResponse, roleDataResponse] = await Promise.all(
          urls.map((url) => axios.get(url))
        );

        const user = userDetailsResponse.data;
        const roles = roleDataResponse.data.positions;
        const mostPlayedRole = roles.reduce(
          (acc: any, role: any) => (role.count > acc.count ? role : acc),
          { count: -1 }
        );

        const today = new Date().toISOString().split("T")[0];
        const championsResponse = await axios.get(
          `/api/gamer-proxy?https://www.gamer.no/api/paradise/user/${userID}/stats/lol/champions?fromDate=2015-11-08&toDate=${today}`
        );
        const championsData = championsResponse.data.data;
        const mostPlayedChampion = championsData.reduce(
          (prev: any, current: any) =>
            prev.count > current.count ? prev : current,
          {}
        );
        const formattedName = formatChampionName(mostPlayedChampion.name);
        const championBg = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${formattedName}_0.jpg`;

        let games = [];
        if (user.team_id) {
          const matchupsResponse = await axios.get(
            `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/matchup?team_id=${teamID}&division_id=${divisionID}`
          );
          const matchups = matchupsResponse.data.data;

          const allStats = await Promise.all(
            matchups.map(async (matchup: any) => {
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

          games = allStats
            .flatMap(({ statsData, opponent }) =>
              statsData.map((stat: any) => ({ ...stat, opponent }))
            )
            .filter((stat) => stat.remoteId === user.id);
        }

        setData({
          isLoading: false,
          user,
          games,
          role: mostPlayedRole,
          championBg,
          champData: championsData,
        });
      } catch (error) {
        console.error("Failed to fetch user or matchup data:", error);
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

  const headerStyle = {
    backgroundImage: `url(${data.championBg})`,
    backgroundSize: "cover",
    opacity: "1",
  };

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
