import React from 'react';
import { Team } from '../types';
import { Trophy, Shield, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';

interface TeamDisplayProps {
  teamA: Team;
  teamB: Team;
  onRenameTeam: (team: 'A' | 'B', newName: string) => void;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({ teamA, teamB, onRenameTeam }) => {
  const TeamCard = ({ team, type, onRename }: { team: Team; type: 'A' | 'B'; onRename: (name: string) => void }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden"
    >
      <div className={`p-4 ${type === 'A' ? 'bg-indigo-600' : 'bg-emerald-600'} text-white`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {type === 'A' ? <Shield size={20} /> : <Trophy size={20} />}
            <input
              type="text"
              value={team.name}
              onChange={(e) => onRename(e.target.value)}
              className="bg-transparent border-none font-bold text-xl focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 w-full"
            />
          </div>
          <Edit3 size={14} className="opacity-50" />
        </div>
        <div className="flex justify-between items-end">
          <span className="text-xs uppercase font-bold tracking-widest opacity-80">Total Skill</span>
          <span className="text-2xl font-black">{team.totalSkill}</span>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        {team.players.map((player, idx) => (
          <div key={player.id} className="flex items-center justify-between py-2 border-bottom border-slate-100 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300 w-4">{idx + 1}</span>
              <span className="font-medium text-slate-700">{player.name}</span>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
              {player.totalSkill}
            </span>
          </div>
        ))}
        {team.players.length === 0 && (
          <p className="text-center text-slate-400 py-8 italic">No players assigned</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TeamCard team={teamA} type="A" onRename={(name) => onRenameTeam('A', name)} />
      <TeamCard team={teamB} type="B" onRename={(name) => onRenameTeam('B', name)} />
    </div>
  );
};
