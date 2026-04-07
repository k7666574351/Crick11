import { Player, Team } from "../types";

export const splitTeams = (players: Player[]) => {
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const mid = Math.ceil(shuffled.length / 2);

  const calculateTeamSkill = (teamPlayers: Player[]) =>
    teamPlayers.reduce((sum, p) => sum + (p.totalSkill || 0), 0);

  const teamAPlayers = shuffled.slice(0, mid);
  const teamBPlayers = shuffled.slice(mid);

  const teamA: Team = {
    name: "Team A",
    players: teamAPlayers,
    totalSkill: calculateTeamSkill(teamAPlayers),
  };

  const teamB: Team = {
    name: "Team B",
    players: teamBPlayers,
    totalSkill: calculateTeamSkill(teamBPlayers),
  };

  return { teamA, teamB };
};
