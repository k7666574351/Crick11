import React from 'react';
import { MatchInfo } from '../types';
import { Calendar, MapPin, Trophy } from 'lucide-react';

interface MatchSettingsProps {
  settings: MatchInfo;
  onUpdate: (settings: MatchInfo) => void;
}

export const MatchSettings: React.FC<MatchSettingsProps> = ({ settings, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...settings, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
        <Trophy size={20} className="text-amber-500" />
        Match Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Match Name</label>
          <div className="relative">
            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input
              name="matchName"
              type="text"
              value={settings.matchName}
              onChange={handleChange}
              placeholder="Weekend Clash"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ground Name</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input
              name="groundName"
              type="text"
              value={settings.groundName}
              onChange={handleChange}
              placeholder="Central Turf"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input
              name="matchDate"
              type="date"
              value={settings.matchDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
