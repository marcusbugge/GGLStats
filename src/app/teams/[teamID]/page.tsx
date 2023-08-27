import Navbar from "@/app/components/Navbar";
import React from "react";

export default function page({ params }: { params: { teamID: string } }) {
  console.log("param", params.teamID);

  return (
    <div>
      <h2>test</h2>
    </div>
  );
}
