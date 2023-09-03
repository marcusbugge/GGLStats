import React, { useEffect, useState } from "react";
import "./components.css";
import { Teamservice } from "../services/Teamservice";
import { Bar } from "react-chartjs-2";

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

export default function TeamScouter({ divisionId, playerStats }: any): any {
  const [divisionData, setDivisionData] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [playerChampionData, setPlayerChampionData] = useState<any>({});
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [clickedPlayerId, setClickedPlayerId] = useState<number | null>(null);

  const [selectedPlayerGames, setSelectedPlayerGames] = useState<any>([]);

  console.log("Tamscout players", playerStats);

  useEffect(() => {
    const actualId = divisionIds[divisionId];
    if (actualId) {
      fetch(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/competition/11710/tables`,
        {
          headers: {
            Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const division = data.find((div: any) => div.id === actualId);
          setDivisionData(division);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      console.error(`Unknown divisionId: ${divisionId}`);
    }
  }, [divisionId]);

  useEffect(() => {
    if (teams.length > 0) {
      const fetchData = async () => {
        const newPlayerChampionData: any = {};

        for (const player of teams) {
          const response = await fetch(
            `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/user/${player.user.id}/stats/lol/champions?division_id=${divisionIds[divisionId]}`,
            {
              headers: {
                Authorization:
                  "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
                Accept: "application/json",
              },
            }
          );
          const data = await response.json();
          newPlayerChampionData[player.user.id] = data.data;
        }

        setPlayerChampionData(newPlayerChampionData);
        console.log("playerchampiondata", playerChampionData);
      };

      fetchData();
    }
  }, [teams, divisionId]);

  const handleTeamClick = (team: any) => {
    const filteredPlayers = filterPlayersByTeam(team.team.id);
    setTeams(filteredPlayers);
    setSelectedTeam(team);
  };

  const filterPlayersByTeam = (teamId: any) => {
    return playerStats.filter((player: any) => player.team_id === teamId);
  };

  const renderPlayerStats = (player: any) => {
    const handlePlayerClick = () => {
      setClickedPlayerId(player.user.id);
    };
    // Retrieve the array of champions for this player
    const championData = playerChampionData[player.user.id] || [];

    // Initialize variables to hold the total win count and total games played
    let totalWinCount = 0;
    let totalGamesPlayed = 0;

    // Loop through each champion to sum up the win count and total games
    championData?.forEach((champ: any) => {
      totalWinCount += champ.winCount;
      totalGamesPlayed += champ.count;
    });

    // Calculate the overall win rate
    let overallWinRate;
    if (totalGamesPlayed === 0) {
      overallWinRate = "..."; // Or set to 100 or 0 based on what you consider appropriate
    } else {
      overallWinRate = ((totalWinCount / totalGamesPlayed) * 100).toFixed(2);
    }

    // Sort the array based on the 'count' field
    const sortedChampionData = [...championData]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return (
      <div className="player-stats">
        <div>
          <div className="team-player-cnt" onClick={() => handlePlayerClick()}>
            <div className="white flagname">
              <img
                src={`https://flagsapi.com/${player.user.nationality}/flat/64.png`}
                alt={`${player.nationality} flag`}
              />
              <h2 className="white">{player.nickname}</h2>
              <h4 className="summoner-player">{player.stats?.summonerName}</h4>
            </div>
            <div className="team-player-stat">
              <h3>{totalGamesPlayed} games</h3>
              <h4 className="white">{overallWinRate}% WR</h4>
            </div>
          </div>

          {clickedPlayerId === player.user.id && (
            <div className="player-games">
              {championData.map((game: any, index: number) => (
                <div className="champion-player-data" key={index}>
                  {/* Render each individual game's info here */}
                  <div className="champion-img-name">
                    <img src={game.image}></img>
                    <p className="white">{game.name}</p>
                  </div>

                  <div className="championstats">
                    Games:
                    <p className="white">{game.count} </p>
                    KDA:{" "}
                    <p className="white">
                      {(
                        (game.avgKills + game.avgAssists) /
                        game.avgDeaths
                      ).toFixed(2)}
                    </p>
                    CS/m:
                    <p className="white">{game.avgMinionsKilledPerMinute}</p>
                    Gold/m:
                    <p className="white">{game.avgGoldEarnedPerMinute}</p>
                    KP:
                    <p className="white">{game.avgKillParticipation}%</p>
                    WR:
                    <p className="white">
                      {((game.winCount / game.count) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderIndividualGames = () => {
    <div></div>;
  };

  const renderTeamDetails = () => {
    const playerNames = teams
      .map((player) => player.stats.summonerName)
      .join("%2C");
    return (
      <div className="team-scout">
        <button
          onClick={() => {
            setSelectedTeam(null);
            setTeams([]); // Clear the teams
          }}
        >
          Go Back
        </button>
        <div className="top-teamscout">
          <div className="team-details-header divbg">
            <img
              src={selectedTeam.team.logo.url}
              alt={selectedTeam.team.name}
              width="100"
              height="100"
              className="teamlogo-header"
            />
            <h1 className="teamname-scout white">{selectedTeam.name}</h1>
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
          <div className="team-overall divbg"></div>
        </div>
        <div className="scout-team-details divbg">
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

  return selectedPlayer
    ? renderIndividualGames()
    : selectedTeam
    ? renderTeamDetails()
    : renderTeamsList();
}
