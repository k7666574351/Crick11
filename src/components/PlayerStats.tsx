import React from "react";
import { Player } from "../types";
import { BarChart3, TrendingUp, Award, Zap } from "lucide-react";
import { motion } from "motion/react";

interface PlayerStatsProps {
  players: Player[];
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ players }) => {
  // Sort players by total skill for the leaderboard
  const sortedPlayers = [...players].sort(
    (a, b) => b.totalSkill - a.totalSkill,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <BarChart3 className="text-indigo-600" />
          PLAYER ANALYTICS
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedPlayers.slice(0, 4).map((player, idx) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        TOP {idx + 1}
                      </span>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Elite Tier
                      </p>
                    </div>
                    <h3 className="text-xl font-black text-slate-800">
                      {player.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-indigo-600">
                      {player.totalSkill}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Total Pts
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Bat
                    </p>
                    <p className="font-black text-slate-700">
                      {player.batting}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Bowl
                    </p>
                    <p className="font-black text-slate-700">
                      {player.bowling}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Field
                    </p>
                    <p className="font-black text-slate-700">
                      {player.fielding}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Full Roster Stats</h3>
              <TrendingUp size={16} className="text-slate-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="px-6 py-4">Player</th>
                    <th className="px-6 py-4">Matches</th>
                    <th className="px-6 py-4">Runs</th>
                    <th className="px-6 py-4">Wickets</th>
                    <th className="px-6 py-4">Skill Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {player.name}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {player.matches ?? 0}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {player.runs ?? 0}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {player.wickets ?? 0}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500"
                              style={{
                                width: `${(player.totalSkill / 30) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold text-indigo-600">
                            {player.totalSkill}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Detailed Player Stats */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
            <h3 className="text-lg font-black text-slate-800 mb-4">
              Player Detailed Stats
            </h3>

            {sortedPlayers.map((player) => (
              <div
                key={player.id}
                className="border border-slate-100 rounded-xl p-4 mb-4 hover:bg-slate-50"
              >
                <h4 className="font-black text-slate-800 mb-3">
                  {player.name}
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-400">Runs</p>
                    <p className="font-bold">{player.runs}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-400">4s</p>
                    <p className="font-bold">{player.fours}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-400">6s</p>
                    <p className="font-bold">{player.sixes}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-400">Strike Rate</p>
                    <p className="font-bold">{player.strikeRate}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-400">Wickets</p>
                    <p className="font-bold">{player.wickets}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-400">Overs</p>
                    <p className="font-bold">{player.overs}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-slate-400">Economy</p>
                    <p className="font-bold">{player.economy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
            <Award className="mb-4 opacity-50" size={32} />
            <h3 className="text-xl font-black mb-1">MVP CONTENDER</h3>
            <p className="text-indigo-100 text-sm mb-6">
              Based on current skill metrics and match performance.
            </p>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-black text-xl">
                {sortedPlayers[0]?.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-lg">{sortedPlayers[0]?.name}</p>
                <p className="text-xs text-indigo-200">
                  Skill Rating: {sortedPlayers[0]?.totalSkill}/30
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-amber-500" size={20} />
              <h3 className="font-bold text-slate-800">Skill Distribution</h3>
            </div>
            <div className="space-y-4">
              {["Batting", "Bowling", "Fielding"].map((skill) => {
                const avg =
                  players.reduce(
                    (sum, p) =>
                      sum + (p[skill.toLowerCase() as keyof Player] as number),
                    0,
                  ) / players.length;
                return (
                  <div key={skill}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-400 uppercase tracking-widest">
                        {skill}
                      </span>
                      <span className="text-slate-700">
                        {avg.toFixed(1)} Avg
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-800"
                        style={{ width: `${(avg / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
