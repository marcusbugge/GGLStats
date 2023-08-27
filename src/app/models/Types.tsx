type Stats = {
  kills: number;
  assists: number;
  deaths: number;
  character: string;
};

type Player = {
  id: number;
  stats: Stats[];
};

type Division = {
  id: number;
  name: string;
};

type GameStats = {
  kills: number;
  deaths: number;
  assists: number;
};

type PlayerData = {
  user_id: number;
  user_name: string;
  nationality: string;
  team_id: string;
  team_name: string; // Add this line
  nickname: string;
  division: {
    name: string;
  };
  champions: Record<string, GameStats[]>;
};

type PlayerKillsSummary = {
  user_id: number;
  user_name: string; // real gamer name
  nationality: string; // nationality of the player
  totalKills: number;
  killsPerGame: number;
  gameCount: number;
  nickname: string;
  team_name: string; // Add this line
};

type PlayerDeathsSummary = {
  user_id: number;
  user_name: string; // real gamer name
  nationality: string; // nationality of the player
  totalDeaths: number;
  deathsPerGame: number;
  gameCount: number;
};

type PlayerAssistsSummary = {
  user_id: number;
  user_name: string; // real gamer name
  nationality: string; // nationality of the player
  totalAssists: number;
  assistsPerGame: number;
  gameCount: number;
};

type ChampionKillsSummary = {
  champion: string;
  totalKills: number;
  killsPerGame: number;
  gameCount: number;
  topPlayer: {
    user_id: number;
    user_name: string;
    kills: number;
  };
};

type TeamLogo = {
  url: string;
};

type TeamInfo = {
  name: string;
  url: string;
  logo: TeamLogo;
};

type Signup = {
  id: number;
  name: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  played: number;
  team: TeamInfo;
};

type Division2 = {
  id: number;
  name: string;
  signups: Signup[];
};

type PlayerKDAStats = {
  nickname: string;
  team_name: string; // Add this line
  user_id: number;
  user_name: string;
  nationality: string;
  kda: string | number; // You may decide whether you want to store 'Infinite' or not
  gameCount: number;
};

interface PlayerProps {
  navSort: string;
  playersByKills: PlayerKillsSummary[];
  playersByDeaths: PlayerDeathsSummary[];
  playersByAssists: PlayerAssistsSummary[];
  playersByKDA: PlayerKDAStats[];
}

type PlayerDataWithStats = PlayerData & {
  kda: number | string; // or 'Perfect'
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  killsPerGame: number;
  deathsPerGame: number;
  assistsPerGame: number;
};
