export interface Player {
  id: string;
  name: string;

  batting: number;
  bowling: number;
  fielding: number;
  totalSkill: number;

  matches?: number;

  // Batting stats
  runs?: number;
  fours?: number;
  sixes?: number;
  ballsFaced?: number;
  strikeRate?: number;

  // Bowling stats
  wickets?: number;
  overs?: number;
  economy?: number;

  // Fielding
  catches?: number;

  isAvailable?: boolean;
}

export interface Team {
  name: string;
  players: Player[];
  totalSkill: number;
}

export interface MatchInfo {
  matchName: string;
  groundName: string;
  matchDate: string;
}

export interface ScoreState {
  runs: number;
  wickets: number;
  balls: number;
  strikerId: string | null;
  nonStrikerId: string | null;
  bowlerId: string | null;
}
