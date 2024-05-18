import React from "react";

export default function Playerinfo({ role, user }: any) {
  console.log("role info", role);
  console.log("user info", user);

  return (
    <div className="playerinfo">
      <img
        src={`https://flagsapi.com/${user.nationality}/flat/64.png`}
        alt={`${user.nationality} flag`}
      />
      <div className="stroke"></div>
      <img src={role.image} alt="role" />
    </div>
  );
}
