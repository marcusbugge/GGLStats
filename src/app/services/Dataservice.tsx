"use client";
import axios from "axios";

const api = axios.create({
  headers: {
    Authorization: "Bearer 22|jDom6Dw36tOiG0BMrUWTH2HBbu5SoAVZOv3M9rmD",
    Accept: "application/json",
  },
});

type Division =
  | "1.div"
  | "2.div"
  | "3.div A"
  | "3.div B"
  | "3.div C"
  | "4.div A"
  | "4.div B"
  | "4.div C";

const divisionIds: Record<Division, number> = {
  "1.div": 11408,
  "2.div": 11451,
  "3.div A": 11490,
  "3.div B": 11491,
  "3.div C": 11492,
  "4.div A": 11493,
  "4.div B": 11494,
  "4.div C": 11495,
};

export async function fetchAllPlayerStats() {}
