"use client";

import { useState } from "react";
import { getCompetitionInfo } from "./Data";

export default function Counter() {
  const [count, setCount] = useState(0);

  getCompetitionInfo().then((data) => console.log(data));

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
