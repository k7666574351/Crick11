import { Player, Team } from "../types";

/**
 * Generates two balanced teams based on the total skill of players.
 * Uses a greedy approach: sort players by skill and distribute them.
 */
export const generateBalancedTeams = (
  players: Player[],
  teamAName: string = "Team A",
  teamBName: string = "Team B"
): { teamA: Team; teamB: Team } => {
  // Sort players by total skill in descending order
  const sortedPlayers = [...players].sort((a, b) => b.totalSkill - a.totalSkill);

  const teamA: Player[] = [];
  const teamB: Player[] = [];

  let skillA = 0;
  let skillB = 0;

  // Distribute players to the team with lower current total skill
  sortedPlayers.forEach((player) => {
    if (skillA <= skillB) {
      teamA.push(player);
      skillA += player.totalSkill;
    } else {
      teamB.push(player);
      skillB += player.totalSkill;
    }
  });

  return {
    teamA: {
      name: teamAName,
      players: teamA,
      totalSkill: skillA,
    },
    teamB: {
      name: teamBName,
      players: teamB,
      totalSkill: skillB,
    },
  };
};

/**
 * Shuffles players randomly and then splits them.
 * Useful for a less "perfectly balanced" but more varied split.
 */
export const shuffleTeams = (
  players: Player[],
  teamAName: string = "Team A",
  teamBName: string = "Team B"
): { teamA: Team; teamB: Team } => {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const mid = Math.ceil(shuffled.length / 2);
  
  const teamAPlayers = shuffled.slice(0, mid);
  const teamBPlayers = shuffled.slice(mid);

  return {
    teamA: {
      name: teamAName,
      players: teamAPlayers,
      totalSkill: teamAPlayers.reduce((sum, p) => sum + p.totalSkill, 0),
    },
    teamB: {
      name: teamBName,
      players: teamBPlayers,
      totalSkill: teamBPlayers.reduce((sum, p) => sum + p.totalSkill, 0),
    },
  };
};
