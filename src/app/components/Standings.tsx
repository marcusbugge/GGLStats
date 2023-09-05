import React, { useEffect, useState } from "react";
import "./components.css";

export default function Standings({ divisionId, selectedSeason }: any) {
  const [divisionData, setDivisionData] = useState<Division2 | null>(null);

  console.log("hello");

  useEffect(() => {
    if (typeof divisionId !== "undefined") {
      fetch(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/competition/${selectedSeason}/tables`
      )
        .then((response) => response.json())
        .then((data) => {
          const division = data.find((div: Division2) => div.id === divisionId);
          if (division) {
            setDivisionData(division);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      console.error(`Unknown divisionId: ${divisionId}`);
    }
  }, [divisionId]);

  return (
    <div className="standings">
      <h2>{divisionData?.name || "Loading..."} tabell</h2>
      <div className="standing-table">
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Played</th>
              <th>+/-</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {divisionData?.signups.map((signup: any, index) => {
              // Calculating the score differential
              const scoreDifferential = signup.score_for - signup.score_against;
              return (
                <tr key={signup.id}>
                  <td>
                    <div className="standing-team">
                      <p>{index + 1}</p>
                      <a href={signup.team.url}>
                        <img
                          src={signup.team.logo.url}
                          alt={signup.team.name}
                          width="40"
                          height="40"
                        />
                        {signup.team.name}
                      </a>
                    </div>
                  </td>
                  <td>{signup.played}</td>
                  <td>{scoreDifferential}</td>{" "}
                  {/* Displaying the calculated score differential */}
                  <td className="white">{signup.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
