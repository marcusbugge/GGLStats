import "../app.css";

import React, { useEffect, useState } from "react";
import { fetchAllPlayerStats } from "../services/Dataservice";
import { Gameservice } from "../services/Gameservice";
import { Teamservice } from "../services/Teamservice";
import Navbar from "../components/Navbar";
import Standings from "../components/Standings";
import Kills from "../components/Player";
import Player from "../components/Player";
import TeamScouter from "../components/TeamScouter";
import LadderService from "../services/Ladderservice";
import Champions from "../components/Champions";
import Deaths from "../components/Deaths";
import { Userservice } from "../services/Userservice";
import SortButtons from "../components/SortButtons";
import axios from "axios";
import { GetServerSideProps } from "next";
import Hiscores from "../components/Hiscores";
import Dropdown from "../components/Dropdown";

type SortPreference =
  | "Player"
  | "Champion"
  | "Standings"
  | "Team Scouter"
  | "Ladder";

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

function Ekss({
  setSortPreference,
  navSort,
  setNavSort,
  viewPreference,
  initialPlayerStats,
}: any) {
  const [playerStats, setPlayerStats] = useState(initialPlayerStats);

  console.log("playerstatss sertver", playerStats);

  const [playerStatsTest, setPlayerStatsTest] = useState([]);
  const [fetchedDivisions, setFetchedDivisions] = useState<any[]>([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("11710");
  const [loading, setLoading] = useState(true);

  const seasonOptions = [
    { name: "Høst 2023", value: "11710" },
    { name: "Vår 2023", value: "11044" },
    { name: "Høst 2022", value: "10429" },
    { name: "Høst 2021", value: "9535" },
  ]; // Or fetch dynamically

  // Fetch divisions
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get(
          `https://corsproxy.io/?https://www.gamer.no/api/paradise/v2/competition/${selectedSeason}/divisions`,
          {
            headers: {
              Authorization:
                "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
              Accept: "application/json",
            },
          }
        );
        setFetchedDivisions(response.data);
        // Try to set to "1. divisjon" by default, otherwise set to the first division in the list
        const defaultDivision =
          response.data.find((div: any) => div.name === "1. divisjon") ||
          response.data[0];

        if (defaultDivision) {
          setSelectedDivision(defaultDivision.name);
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisions();
  }, [selectedSeason]); // Runs when selectedSeason changes

  // Fetch player stats
  useEffect(() => {
    if (selectedDivision && selectedSeason) {
      // Only proceed if both are set
      const fetchPlayerData = async () => {
        setLoading(true);
        const divisionId = fetchedDivisions.find(
          (div) => div.name === selectedDivision
        ).id;
        const data = await Userservice.getPlayersStats({
          division: divisionId,
          season: selectedSeason,
        });
        setPlayerStatsTest(data);
        setLoading(false);
      };
      fetchPlayerData();
    }
  }, [selectedDivision, selectedSeason, fetchedDivisions]); // Runs when any of these change

  useEffect(() => {
    if (viewPreference === "Champion" && !navSort) {
      setNavSort("Games"); // Setting "Games" as the default sort for Champions.
    }
  }, [viewPreference, navSort]);

  const sortOptionsPlayer = [
    "Overall",
    "KDA",
    "Kills",
    "Deaths",
    "Assists",
    "Vision",
    "KP",
    "Farm",
    "Damage",
    "Gold",
  ];

  const sortOptionsChampion = ["Games", "Winrate", "KDA", "Farm", "KP", "Gold"];

  const sortOptionsLadder = ["Show all", "Division", "Team"];

  let sortOptions;
  if (viewPreference === "Player") {
    sortOptions = sortOptionsPlayer;
  } else if (viewPreference === "Champion") {
    sortOptions = sortOptionsChampion;
  } else if (viewPreference === "Standings") {
  } else if (viewPreference === "Ladder") {
    sortOptions = sortOptionsLadder;
  }

  const handleDivisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDivision(event.target.value);
  };

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(event.target.value);
  };

  // Find the division object from fetchedDivisions based on selectedDivision
  const selectedDivisionObject = fetchedDivisions.find(
    (division) => division.name === selectedDivision
  );

  // Extract the division ID from the selected division object
  const actualDivisionID = selectedDivisionObject
    ? selectedDivisionObject.id
    : null;

  return (
    <div className="app">
      <div className="content">
        <div className="content-nav">
          <div className="dropdowns">
            <Dropdown
              options={fetchedDivisions.map((div) => ({
                name: div.name,
                value: div.name,
              }))}
              selectedValue={selectedDivision}
              onChange={(value: any) => setSelectedDivision(value)}
            />
            <Dropdown
              options={seasonOptions}
              selectedValue={selectedSeason}
              onChange={(value: any) => setSelectedSeason(value)}
            />
          </div>
          <div>
            {viewPreference === "Player" && (
              <>
                <SortButtons
                  options={sortOptionsPlayer}
                  selectedSort={navSort}
                  onSortClick={setNavSort}
                />
              </>
            )}
            {viewPreference === "Champion" && (
              <>
                <SortButtons
                  options={sortOptionsChampion}
                  selectedSort={navSort}
                  onSortClick={setNavSort}
                />
              </>
            )}
            {viewPreference === "Standings" && (
              <SortButtons
                options={[]}
                selectedSort={navSort}
                onSortClick={setNavSort}
              />
            )}
          </div>
        </div>

        <div className="tables">
          {viewPreference === "Player" && (
            <Player
              loading={loading}
              navSort={navSort}
              playerTest={playerStatsTest}
              division={selectedDivision}
              season={selectedSeason}
            />
          )}
          {viewPreference === "Champion" && (
            <Champions
              playerDataList={playerStats}
              loading={loading}
              navSort={navSort}
              divisionID={actualDivisionID}
            />
          )}
          {viewPreference === "Records" && <Hiscores />}
          {viewPreference === "Ladder" && (
            <LadderService players={playerStatsTest} navSort={navSort} />
          )}
          {viewPreference === "Standings" && (
            <Standings
              divisionId={actualDivisionID}
              selectedSeason={selectedSeason}
              playerStats={playerStatsTest}
            />
          )}
          {viewPreference === "Team Scouter" && (
            <TeamScouter
              divisionId={selectedDivision}
              playerStats={playerStatsTest}
              selectedSeason={selectedSeason}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Ekss;

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("getServerSideProps is running");
  let playerStatsData = [];
  try {
    // Fetch the initial data for playerStats.
    // Note: You'll need to determine how you're setting division and season.
    const division = 11408; // Replace with actual value
    const season = "11710"; // Replace with actual value
    playerStatsData = await Userservice.getPlayersStats({
      division,
      season,
    });
    console.log("test");

    console.log("serverside", playerStatsData);
  } catch (error) {
    console.error("Server-side data fetch error:", error);
  }

  return {
    props: {
      initialPlayerStats: playerStatsData,
    },
  };
};