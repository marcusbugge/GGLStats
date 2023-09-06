"use client";

import React, { useEffect, useState } from "react";
import { Gameservice } from "../services/Gameservice";
import { Championservice } from "../services/Championservice";

export default function Champions({
  navSort,
  playerDataList,
  divisionID,
}: any) {
  const [clickedChampion, setClickedChampion] = useState(null);
  const [championData, setChampionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [minGameCount, setMinGameCount] = useState(0);

  const [headerSort, setHeaderSort] = useState({
    column: navSort.toLowerCase(),
    order: "asc",
  });

  useEffect(() => {
    const defaultColumn = getDefaultColumnToSort(navSort);

    setHeaderSort({
      column: defaultColumn,
      order: "desc", // or 'asc' if you want ascending as default
    });
  }, [navSort]);

  useEffect(() => {
    const fetchChampionData = async () => {
      if (!divisionID) return;

      try {
        const { data } = await Championservice.getChampionData({ divisionID });
        setChampionData(data);
        setLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    fetchChampionData();
  }, [divisionID]);

  const mapping: any = {
    Games: "count",
    Winrate: "winrate",
    KDA: "kda",
    Farm: "avgMinionsKilledPerMinute",
    KP: "avgKillParticipation",
    Gold: "avgGoldEarnedPerMinute",
  };

  const getDefaultColumnToSort = (navSort: any) => {
    return mapping[navSort] || "count";
  };

  const handleHeaderSort = (column: any) => {
    const mappedColumn = mapping[column] || column;

    setHeaderSort((prevState) => ({
      column: mappedColumn,
      order: prevState.order === "asc" ? "desc" : "asc",
    }));
  };
  // Replace the existing sortedChampionData line with this
  const sortedChampionData = [...championData]
    .filter((champion) => champion.count >= minGameCount) // filter champions by game count

    .sort((a: any, b: any) => {
      let aValue: number = 0;
      let bValue: number = 0;

      if (headerSort.column === "winrate") {
        aValue = a.winCount && a.count ? a.winCount / a.count : 0;
        bValue = b.winCount && b.count ? b.winCount / b.count : 0;
      } else if (headerSort.column === "kda") {
        aValue = a.kills && a.deaths ? (a.kills + a.assists) / a.deaths : 0;
        bValue = b.kills && b.deaths ? (b.kills + b.assists) / b.deaths : 0;

        if (a.deaths === 0) aValue = Infinity;
        if (b.deaths === 0) bValue = Infinity;
      } else if (headerSort.column === "avgMinionsKilledPerMinute") {
        // New code here
        aValue = a.avgMinionsKilledPerMinute || 0;
        bValue = b.avgMinionsKilledPerMinute || 0;
      } else if (headerSort.column === "avgKillParticipation") {
        // New code here
        aValue = a.avgKillParticipation || 0;
        bValue = b.avgKillParticipation || 0;
      } else {
        aValue = a[headerSort.column] ?? 0;
        bValue = b[headerSort.column] ?? 0;
      }

      if (aValue === Infinity && bValue !== Infinity) return -1;
      if (bValue === Infinity && aValue !== Infinity) return 1;

      return headerSort.order === "asc" ? aValue - bValue : bValue - aValue;
    });

  console.log(sortedChampionData);
  const RenderChampionTable = () => {
    const headers: any = {
      KDA: [
        "Champion",
        "Count",
        "Kills/game",
        "Deaths/game",
        "Assists/game",
        "KDA",
      ],
      Winrate: ["Champion", "Count", "Wins", "Loss", "Winrate"],
      Games: ["Champion", "Count"],
      Farm: ["Champion", "Count", "Farm"],
      KP: ["Champion", "Count", "KP"],
      Gold: ["Champion", "Count", "Gold"],
      // Add more headers for each navSort type
    };

    const renderRowContent = (champion: any, navSort: any, index: number) => {
      switch (navSort) {
        case "KDA":
          return (
            <>
              <div className="champion-img-name">
                <p className="white">{index + 1}</p>
                <img src={champion.image}></img>
                <p className="white">{champion.name}</p>
              </div>
              <td>{champion.count}</td>
              <td className="white">{champion.avgKills.toFixed(2)}</td>
              <td className="white">{champion.avgDeaths.toFixed(2)}</td>
              <td className="white">{champion.avgAssists.toFixed(2)}</td>
              <td className="white">
                {(
                  (champion.kills + champion.assists) /
                  champion.deaths
                ).toFixed(2)}
              </td>
            </>
          );
        case "Winrate":
          return (
            <>
              <div className="champion-img-name">
                <p className="white">{index + 1}</p>
                <img src={champion.image}></img>
                <p className="white">{champion.name}</p>
              </div>
              <td>{champion.count}</td>
              <td className="">{champion.winCount}</td>
              <td className="">{champion.count - champion.winCount}</td>
              <td className="white">
                {((champion.winCount / champion.count) * 100).toFixed(2)}%
              </td>
            </>
          );

        case "Games":
          return (
            <>
              <div className="champion-img-name">
                <p className="white">{index + 1}</p>
                <img src={champion.image}></img>
                <p className="white">{champion.name}</p>
              </div>
              <td className="white">{champion.count}</td>
            </>
          );
        case "Farm":
          return (
            <>
              <div className="champion-img-name">
                <p className="white">{index + 1}</p>
                <img src={champion.image}></img>
                <p className="white">{champion.name}</p>
              </div>
              <td className="">{champion.count}</td>
              <td className="white">{champion.avgMinionsKilledPerMinute}</td>
            </>
          );
        case "KP":
          return (
            <>
              <div className="champion-img-name">
                <p className="white">{index + 1}</p>
                <img src={champion.image}></img>
                <p className="white">{champion.name}</p>
              </div>
              <td className="">{champion.count}</td>
              <td className="white">{champion.avgKillParticipation}%</td>
            </>
          );
        case "Gold":
          return (
            <>
              <div className="champion-img-name">
                <p className="white">{index + 1}</p>
                <img src={champion.image}></img>
                <p className="white">{champion.name}</p>
              </div>
              <td className="">{champion.count}</td>
              <td className="white">{champion.avgGoldEarnedPerMinute}</td>
            </>
          );
        // Add more cases based on other types of sorting (e.g., 'Games', 'Lossrate', etc.)
        default:
          return null;
      }
    };

    console.log("headers", headers);
    console.log("navsort", navSort);

    return (
      <div>
        <h2>Champions by {navSort}</h2>

        <table>
          <thead>
            <tr>
              {headers
                ? (headers[navSort] ?? []).map((header: any) => (
                    <th key={header} onClick={() => handleHeaderSort(header)}>
                      {header}
                    </th>
                  ))
                : null}
            </tr>
          </thead>
          <tbody>
            {sortedChampionData.map((champion, index) => (
              <tr key={index}>{renderRowContent(champion, navSort, index)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return <div>{!loading && <RenderChampionTable />}</div>;
}
