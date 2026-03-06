import React, { useState } from 'react';
import { Player } from '../types';
import { UserPlus } from 'lucide-react';

interface PlayerFormProps {
  onAddPlayer: (player: Omit<Player, 'id' | 'totalSkill'>) => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer }) => {
  const [name, setName] = useState('');
  const [batting, setBatting] = useState(5);
  const [bowling, setBowling] = useState(5);
  const [fielding, setFielding] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAddPlayer({
      name,
      batting,
      bowling,
      fielding
    });
    
    setName('');
    setBatting(5);
    setBowling(5);
    setFielding(5);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
        <UserPlus size={20} className="text-emerald-500" />
        Add New Player
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Player Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name..."
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Batting ({batting})</label>
            <input
              type="range"
              min="1"
              max="10"
              value={batting}
              onChange={(e) => setBatting(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Bowling ({bowling})</label>
            <input
              type="range"
              min="1"
              max="10"
              value={bowling}
              onChange={(e) => setBowling(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Fielding ({fielding})</label>
            <input
              type="range"
              min="1"
              max="10"
              value={fielding}
              onChange={(e) => setFielding(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
        >
          Add Player
        </button>
      </form>
    </div>
  );
};
