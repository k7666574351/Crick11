import React from 'react';
import { Player } from '../types';
import { Trash2, Edit2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlayerListProps {
  players: Player[];
  onRemovePlayer: (id: string) => void;
  onEditPlayer: (player: Player) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, onRemovePlayer, onEditPlayer }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
          <Users size={20} className="text-indigo-500" />
          Player List ({players.length})
        </h2>
      </div>

      {players.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
          <Users size={48} className="mb-2 opacity-20" />
          <p>No players added yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {players.map((player) => (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{player.name}</h3>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Bat: <span className="text-slate-600">{player.batting}</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Bowl: <span className="text-slate-600">{player.bowling}</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Field: <span className="text-slate-600">{player.fielding}</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">
                      Total: {player.totalSkill}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditPlayer(player)}
                    className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
