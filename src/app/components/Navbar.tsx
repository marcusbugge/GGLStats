import React from "react";
import "./navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <h1 className="white">GGL Stats</h1>

      <div className="navbar-content">
        <h2>Standings</h2>
        <h2>KDA</h2>
        <h2>Kills</h2>
        <h2>Deaths</h2>
        <h2>Assists</h2>
      </div>
    </div>
  );
}
