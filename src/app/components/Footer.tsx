import React from "react";

export default function Footer() {
  return (
    <div className="footer">
      <div>
        <p className="white">Disclaimer</p>
        <p>
          The statistics displayed on this site are sourced from the Good
          Game-ligaen via the gamer.no API. While we strive for accuracy, there
          may be discrepancies or errors in the data presented. Its important to
          note that not all games or players have complete statistics available,
          which could impact the accuracy of player placements and other metrics
          displayed on this site.
        </p>
        <p className="white">Feedback</p>
        <p>
          If you notice any issues or have suggestions for improvement, please
          report them to the creator @buggebugge on Discord. Your input is
          valuable and helps me continually refine the user experience.
        </p>
      </div>
      <h1 className="white"></h1>
    </div>
  );
}
