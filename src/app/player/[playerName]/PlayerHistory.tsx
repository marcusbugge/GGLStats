import React from "react";

export default function PlayerHistory({ games }: any) {
  if (!games || games.length === 0) {
    return <div>No games found for this player.</div>;
  }

  console.log("games", games);

  // Helper function to render items or placeholders
  const renderItems = (game: any) => {
    let items = [];
    for (let i = 1; i <= 6; i++) {
      const itemImage = game[`item${i}Image`];
      if (itemImage) {
        items.push(
          <img className="item" src={itemImage} alt={`Item ${i}`} key={i} />
        );
      } else {
        // Render a gray box as a placeholder if there is no item image
        items.push(<div className="item placeholder" key={i} />);
      }
    }
    return items;
  };

  // Helper function to determine the game outcome
  const gameOutcome = (game: any) => {
    return game.mapsWon === 1 ? "victory" : "defeat";
  };

  // Helper to generate outcome text with specific classes
  const renderOutcomeText = (game: any) => {
    const outcome = gameOutcome(game);
    return (
      <div className={`outcome-text ${outcome}-text`}>
        {outcome.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="history">
      {games.map((game: any, index: any) => (
        <div className={`match-cntt ${gameOutcome(game)}`} key={index}>
          <div className="champ-cnt">
            <img
              className="championimg"
              src={game.championImage}
              alt="Champion"
            />

            <div className="sums">
              <img className="sum" src={game.spell1Image} alt="Spell 1" />
              <img className="sum" src={game.spell2Image} alt="Spell 2" />
            </div>

            <div className="stats">
              <p className="kda">
                {game.kills}/{game.deaths}/{game.assists}
              </p>
              <div className="rest-stats">
                <p>{game.allMinionsKilledPerMinute} CS/m</p>
                <p>{game.killParticipation}% KP</p>
                <p>{game.kadratio} KDA</p>
              </div>
              <div className="items">{renderItems(game)}</div>
            </div>

            {/** <p className="oppo">vs {game.opponent.name}</p>**/}
          </div>
        </div>
      ))}
    </div>
  );
}
