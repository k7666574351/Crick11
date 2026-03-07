import { Player, Team } from "../types";

export const splitTeams = (players: Player[]) => {
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const mid = Math.ceil(shuffled.length / 2);

  const teamA: Team = {
    name: "Team A",
    players: shuffled.slice(0, mid),
  };

  const teamB: Team = {
    name: "Team B",
    players: shuffled.slice(mid),
  };

  return { teamA, teamB };
};