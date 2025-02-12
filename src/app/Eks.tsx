import "./app.css";

import React, { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Standings from "./components/Standings";
import Kills from "./components/Player";
import Player from "./components/Player";
import TeamScouter from "./components/TeamScouter";
import LadderService from "./services/Ladderservice";
import Champions from "./components/Champions";
import { Userservice } from "./services/Userservice";
import SortButtons from "./components/SortButtons";
import axios from "axios";
import Hiscores from "./components/Hiscores";
import Dropdown from "./components/Dropdown";
import Mvp from "./components/Mvp";

const seasonOptions = [
  { name: "Vinter 2025", value: "13163" },
  { name: "Høst 2024", value: "12465" },
  { name: "Vår 2024", value: "12080" },
  { name: "Høst 2023", value: "11710" },
  { name: "Vår 2023", value: "11044" },
  { name: "Høst 2022", value: "10429" },
];

// Hjelpefunksjon for å sortere divisjoner
const sortDivisions = (divisions: any[]) => {
  return divisions.sort((a, b) => {
    // Hent tall fra divisjonsnavnene
    const aNum = parseInt(a.name);
    const bNum = parseInt(b.name);

    // Hvis begge har tall, sorter etter tall
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    // Hvis bare en har tall, sett den først
    if (!isNaN(aNum)) return -1;
    if (!isNaN(bNum)) return 1;
    // Ellers sorter alfabetisk
    return a.name.localeCompare(b.name);
  });
};

export default function Eks({ navSort, setNavSort, viewPreference }: any) {
  const [playerStatsTest, setPlayerStatsTest] = useState([]);
  const [fetchedDivisions, setFetchedDivisions] = useState<any[]>([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(seasonOptions[0].value);
  const [loading, setLoading] = useState(true);
  const [mvpsort, setMvpsort] = useState("Round 1");

  // Find the division object from fetchedDivisions based on selectedDivision
  const selectedDivisionObject = fetchedDivisions.find(
    (division) => division.name === selectedDivision
  );

  // Extract the division ID from the selected division object
  const actualDivisionID = selectedDivisionObject
    ? selectedDivisionObject.id
    : null;

  // Fetch divisions
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get(
          `/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/competition/${selectedSeason}/divisions`
        );
        const sortedDivisions = sortDivisions(response.data);
        setFetchedDivisions(sortedDivisions);
        // Try to set to "1. divisjon" by default, otherwise set to the first division in the list
        const defaultDivision =
          sortedDivisions.find((div: any) => div.name === "1. divisjon") ||
          sortedDivisions[0];

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
        const data: any = await Userservice.getPlayersStats({
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
    "Towers",
  ];

  const sortOptionsChampion = ["Games", "Winrate", "KDA", "Farm", "KP", "Gold"];

  const sortOptionsLadder = ["Show all", "Division", "Team"];

  const sortOptionsMVP = [
    "Round 1",
    "Round 2",
    "Round 3",
    "Round 4",
    "Round 5",
    "Round 6",
    "Round 7",
    "Round 8",
    "Round 9",
  ];

  let sortOptions;
  if (viewPreference === "Player") {
    sortOptions = sortOptionsPlayer;
  } else if (viewPreference === "Champion") {
    sortOptions = sortOptionsChampion;
  } else if (viewPreference === "Standings") {
  } else if (viewPreference === "Ladder") {
    sortOptions = sortOptionsLadder;
  } else if (viewPreference === "MVPs") {
    sortOptions = sortOptionsMVP;
  }

  const handleDivisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDivision(event.target.value);
  };

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(event.target.value);
  };

  return (
    <div className="app">
      <div className="content">
        <div className="header-bg">
          <img
            src="https://www.goodgameligaen.no/image/700/GGL_Logo_Horisontal-Negativ.png?c=0&h=501&w=1360&format=webp"
            alt="goodgame-logo"
          />
        </div>
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
            {viewPreference === "MVPs" && (
              <SortButtons
                options={sortOptionsMVP}
                selectedSort={mvpsort}
                onSortClick={setMvpsort}
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
              div={actualDivisionID}
              season={selectedSeason}
            />
          )}
          {viewPreference === "Champion" && (
            <Champions
              playerDataList={playerStatsTest}
              loading={loading}
              navSort={navSort}
              divisionID={actualDivisionID}
            />
          )}
          {viewPreference === "Records" && (
            <Hiscores players={playerStatsTest} />
          )}
          {viewPreference === "Ladder" && (
            <LadderService players={playerStatsTest} navSort={navSort} />
          )}
          {viewPreference === "MVPs" && (
            <Mvp
              selectedSeason={selectedSeason}
              divisionId={actualDivisionID}
              mvpsort={mvpsort}
            />
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
