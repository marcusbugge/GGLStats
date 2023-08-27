import React, { useEffect, useState } from "react";
import "./components.css";

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

export default function Standings({ divisionId }: any) {
  const [divisionData, setDivisionData] = useState<Division2 | null>(null);

  useEffect(() => {
    const actualId = divisionIds[divisionId];
    if (typeof actualId !== "undefined") {
      fetch(
        `https://corsproxy.io/?https://www.gamer.no/api/paradise/competition/11710/tables`
      )
        .then((response) => response.json())
        .then((data) => {
          const division = data.find((div: Division2) => div.id === actualId);
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
            {divisionData?.signups.map((signup: any) => {
              // Calculating the score differential
              const scoreDifferential = signup.score_for - signup.score_against;
              return (
                <tr key={signup.id}>
                  <td>
                    <div className="standing-team">
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
