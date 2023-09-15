import React, { useEffect, useState } from "react";
import "./components.css";
import { Teamservice } from "../services/Teamservice";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import GameDetails from "./GameDetails";

const fetchData = async (url: any, headers = {}) => {
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    throw error;
  }
};

export default function TeamScouter({
  divisionId,
  playerStats,
  selectedSeason,
}: any): any {
  const [divisionData, setDivisionData] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [teamClicked, setTeamClicked] = useState<any>(false);
  const [playerChampionData, setPlayerChampionData] = useState<any>({});
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [clickedPlayerId, setClickedPlayerId] = useState<number | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [finishedMatches, setFinishedMatches] = useState<any[]>([]);
  const [fetchedDivisions, setFetchedDivisions] = useState<
    Record<string, number>
  >({});

  const [selectedPlayerGames, setSelectedPlayerGames] = useState<any>([]);

  const [clickedMatchID, setClickedMatchID] = useState(null);

  const handleMatchClick = (matchID: any) => {
    // Toggle the clicked state: If it's already clicked, hide it. Otherwise, show it.
    setClickedMatchID((prevMatchID) =>
      prevMatchID === matchID ? null : matchID
    );
  };

  const commonHeaders = {
    Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
    Accept: "application/json",
  };

  console.log("Tamscout players", playerStats);
  console.log("divid", divisionId);

  console.log("fetched divisionshhsd", fetchedDivisions);

  useEffect(() => {
    const actualId = fetchedDivisions[divisionId];
    if (actualId) {
      fetchData(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/competition/${selectedSeason}/tables`,
        commonHeaders
      )
        .then((data) => {
          const division = data.find((div: any) => div.id === actualId);
          setDivisionData(division);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      console.error(`Unknown divisionId: ${divisionId}`);
    }
  }, [divisionId, fetchedDivisions, selectedSeason]);

  useEffect(() => {
    if (teams.length > 0) {
      const fetchDataForTeams = async () => {
        const newPlayerChampionData: any = {};

        for (const player of teams) {
          const data = await fetchData(
            `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/user/${player.user.id}/stats/lol/champions?division_id=${fetchedDivisions[divisionId]}`,
            commonHeaders
          );
          newPlayerChampionData[player.user.id] = data.data;
        }

        setPlayerChampionData(newPlayerChampionData);
      };

      fetchDataForTeams();
    }
  }, [teams, divisionId, fetchedDivisions]);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const axiosConfig = {
          headers: {
            Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
            Accept: "application/json",
          },
        };

        const response = await axios.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/competition/${selectedSeason}/divisions`,
          { headers: axiosConfig.headers }
        );

        // Assuming the response.data contains an array of divisions with 'name' and 'id' properties
        const divisions: Record<string, number> = {};
        response.data.forEach((division: any) => {
          divisions[division.name] = division.id;
        });

        setFetchedDivisions(divisions);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };

    fetchDivisions();
  }, [selectedSeason]);

  useEffect(() => {
    console.log("team", selectedTeam);

    if (selectedTeam) {
      fetchUpcomingMatches(selectedTeam.team_id);
      fetchFinishedMatches(selectedTeam.team_id);
    }
  }, [selectedTeam]);

  const fetchUpcomingMatches = async (teamID: number) => {
    try {
      const url = `https://corsproxy.io/?https://www.gamer.no/api/paradise/team/${teamID}/matchups?page=1`;
      const axiosConfig = {
        headers: commonHeaders,
      };

      const response = await axios.get(url, axiosConfig);
      setUpcomingMatches(response.data.data);
    } catch (error) {
      console.error("Failed to fetch upcoming matches:", error);
    }
  };

  const fetchFinishedMatches = async (teamID: number) => {
    console.log("dividisisi", divisionId);

    try {
      const url = `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/matchup?team_id=${teamID}&filter=finished&division_id=${fetchedDivisions[divisionId]}`;
      const axiosConfig = {
        headers: commonHeaders,
      };

      const response = await axios.get(url, axiosConfig);
      setFinishedMatches(response.data.data);

      console.log("finished", finishedMatches);
    } catch (error) {
      console.error("Failed to fetch finished matches:", error);
    }
  };

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

  let played: any[] = [];
  const renderTeamDetails = () => {
    const mostPlayed = () => {
      teams.forEach((player) => {
        const playerData = playerChampionData[player.user.id];

        if (playerData) {
          playerData.forEach((champ: any) => {
            played.push(champ);
          });
        }
      });

      // Sort the 'played' array by the 'games' property
      played.sort((a, b) => b.games - a.games);

      return played; // You may want to return 'played' instead, depending on your needs
    };

    const mostPlayedChamp = mostPlayed();

    console.log("played", played);

    // Sort champions by pick count and winrate
    const sortedByPickCount = Object.values(played).sort(
      (a: any, b: any) => b.count - a.count
    );
    const top5MostPicked = sortedByPickCount.slice(0, 5);

    const sortedByWinRate = Object.values(played).sort(
      (a: any, b: any) =>
        (b.winCount / b.count) * 100 - (a.winCount / a.count) * 100
    );
    const top5HighestWinRate = sortedByWinRate.slice(0, 5);

    console.log(top5MostPicked);

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
          <div className="team-overall divbg">
            <div className="top5-most-picked">
              <h3 className="">Most Picked Champions</h3>
              <div className="wr-cnt">
                {top5MostPicked.map((champ: any, index: number) => (
                  <div className="champion-scout" key={index}>
                    <img src={champ.image} alt={champ.name} />

                    <p className="white"> {champ.count} games</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="top5-highest-winrate">
              <h3 className="">Highest Winrate Champions</h3>
              <div className="wr-cnt">
                {top5HighestWinRate.map((champ: any, index: number) => (
                  <div className="champion-scout" key={index}>
                    <img src={champ.image} alt={champ.name} />

                    <p className="white games-ch">
                      {((champ.winCount / champ.count) * 100).toFixed(2)}%{" "}
                      <p className=""> {champ.count} games</p>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="scout-team-details divbg">
          {teams.map((player: any) => renderPlayerStats(player))}
        </div>

        <div className="team-games">
          {" "}
          <div>
            <h2>Finished Matches</h2>
            {finishedMatches.map((match, index) => {
              const homeTeamId = match.home_signup.team.id;
              const awayTeamId = match.away_signup.team.id;

              const isWinningTeam =
                (homeTeamId === match.home_signup.team.id &&
                  match.winning_side === "home") ||
                (awayTeamId === match.away_signup.team.id &&
                  match.winning_side === "away");

              // Adding new condition for selectedTeam
              const isSelectedAndWinningTeam =
                (selectedTeam.team_id === homeTeamId &&
                  match.winning_side === "home") ||
                (selectedTeam.team_id === awayTeamId &&
                  match.winning_side === "away");

              // Update the className based on new condition
              const className = isSelectedAndWinningTeam
                ? "selected-win"
                : isWinningTeam
                ? "win"
                : "loss";

              return (
                <div className="match-det" key={index}>
                  <div
                    className={`upcoming-game ${className}`}
                    onClick={() => handleMatchClick(match.id)}
                  >
                    <h3 className="white opponent">
                      <img
                        src={match.home_signup.team.logo.url}
                        alt="team logo"
                      />
                      {match.home_signup.name} - {match.away_signup.name}
                      <img
                        src={match.away_signup.team.logo.url}
                        alt="team logo"
                      />
                    </h3>
                    <div className="matchdata">
                      <h3 className="white">
                        {match.home_score} - {match.away_score}
                      </h3>
                      <a href={match.url}>
                        <button>Details</button>
                      </a>
                    </div>
                  </div>

                  {clickedMatchID === match.id ? ( // Check if this match's ID is the clicked one
                    <GameDetails
                      matchID={match.id}
                      isWinningTeam={isWinningTeam}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2>Upcoming Matches</h2>
          {upcomingMatches.map((match, index) => (
            <div className="upcoming-game" key={index}>
              <h3 className="white opponent">
                <img src={match.home_signup.team.logo.url} alt="teamlogo" />
                {match.home_signup.name} - {match.away_signup.name}{" "}
                <img src={match.away_signup.team.logo.url} alt="teamlogo" />
              </h3>
              <div className="matchdata">
                <p>Start time: {new Date(match.start_time).toLocaleString()}</p>{" "}
                <a href={match.url}>
                  {" "}
                  <button>Details</button>
                </a>
              </div>
            </div>
          ))}
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
