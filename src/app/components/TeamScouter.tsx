import React, { useEffect, useState } from "react";
import "./components.css";
import { Teamservice } from "../services/Teamservice";

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

export default function TeamScouter({ divisionId, playerStats }: any) {
  const [divisionData, setDivisionData] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const actualId = divisionIds[divisionId];
    if (actualId) {
      fetch(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/competition/11710/tables`
      )
        .then((response: any) => response.json())
        .then((data: any) => {
          const division = data.find((div: any) => div.id === actualId);
          setDivisionData(division);
        })
        .catch((error: any) => console.error("Error fetching data:", error));
    } else {
      console.error(`Unknown divisionId: ${divisionId}`);
    }
  }, [divisionId]);

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    const enhancedTeams = Teamservice.getPlayersByTeamWithStats(playerStats);
    const playersForClickedTeam = enhancedTeams[team.team.name] || [];
    setTeams(playersForClickedTeam);
  };

  const calculateChampionKDA = ({ kills, deaths, assists }: any) => {
    return deaths === 0 ? Infinity : (kills + assists) / deaths;
  };

  const cleanChampionName = (name: string) => {
    return name.replace(/[^a-zA-Z]/g, "");
  };

  const renderChampionStats = (
    champion: string,
    statsArray: any[],
    playerName: string,
    gamesCount?: number
  ) => {
    const kda = calculateChampionKDA(statsArray[0]);
    const cleanName = cleanChampionName(champion);
    return (
      <div className="champion-stats">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/13.8.1/img/champion/${cleanName}.png`}
          alt={champion}
          width="40"
          height="40"
        />
        <p>KDA: {isFinite(kda) ? kda.toFixed(2) : "Perfect"}</p>
        {gamesCount !== undefined && (
          <p>
            {` `}
            ...Games: {gamesCount}
          </p>
        )}
      </div>
    );
  };

  const renderPlayerStats = (player: any) => {
    const championsWithKDA = Object.entries(player.champions).map(
      ([champion, statsArray]: any) => {
        return {
          champion,
          kda: calculateChampionKDA(statsArray[0]),
          statsArray,
        };
      }
    );

    const sortedChampions = championsWithKDA.sort(
      (a: any, b: any) => b.kda - a.kda
    );
    const top3Champions = sortedChampions.slice(0, 3);

    const championsWithGames = Object.entries(player.champions).map(
      ([champion, statsArray]: any) => {
        return {
          champion,
          games: statsArray.length,
        };
      }
    );

    const sortedChampionsByGames = championsWithGames.sort(
      (a: any, b: any) => b.games - a.games
    );
    const top3PickedChampions = sortedChampionsByGames.slice(0, 3);

    return (
      <div className="player-stats">
        <div className="flagname">
          <img
            src={`https://flagsapi.com/${player.nationality}/flat/64.png`}
            alt={`${player.nationality} flag`}
          />
          <h2 className="white">{player.nickname}</h2>
        </div>
        <div>
          <h4 className="white top3">Top 3 champions by KDA</h4>
          <div className="championstats">
            {top3Champions.map(({ champion, statsArray }: any) =>
              renderChampionStats(champion, statsArray, player.name)
            )}
          </div>
        </div>
        <div>
          <h4 className="white top3">Top 3 most picked champions</h4>
          <div className="championstats">
            {top3PickedChampions.map(({ champion, games }: any) =>
              renderChampionStats(
                champion,
                player.champions[champion],
                player.name,
                games
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTeamDetails = () => {
    const playerNames = teams.map((player) => player.nickname).join("%2C");
    return (
      <div className="team-scout">
        <button onClick={() => setSelectedTeam(null)}>Go Back</button>
        <div className="team-details-header">
          <img
            src={selectedTeam.team.logo.url}
            alt={selectedTeam.team.name}
            width="100"
            height="100"
            className="teamlogo-header"
          />
          <h1 className="white">{selectedTeam.name}</h1>
          <a
            href={`https://www.op.gg/multisearch/euw?summoners=${playerNames}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://s-lol-web.op.gg/images/reverse.rectangle.png"
              alt="opgg"
              className="opgg"
            />
          </a>
        </div>
        <div className="scout-team-details">
          {teams.map((player: any) => renderPlayerStats(player))}
        </div>
      </div>
    );
  };

  const renderTeamsList = () => (
    <div className="team-scouter">
      {divisionData?.signups.map((signup: any) => (
        <div
          className="scout-team"
          key={signup.id}
          onClick={() => handleTeamClick(signup)}
        >
          <img
            src={signup.team.logo.url}
            alt={signup.team.name}
            width="40"
            height="40"
          />
          {signup.team.name}
        </div>
      ))}
    </div>
  );

  return selectedTeam ? renderTeamDetails() : renderTeamsList();
}
