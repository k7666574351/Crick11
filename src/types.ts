export interface Player {
  id: string;
  name: string;
  batting: number;
  bowling: number;
  fielding: number;
  totalSkill: number;
  // Mock stats for the stats page
  matches?: number;
  runs?: number;
  wickets?: number;
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
