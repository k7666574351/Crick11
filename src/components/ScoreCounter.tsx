import React, { useState } from 'react';
import { Team, Player, ScoreState } from '../types';
import { Target, User, ChevronRight, RotateCcw, ArrowRightLeft, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface ScoreCounterProps {
  teamA: Team;
  teamB: Team;
}

export const ScoreCounter: React.FC<ScoreCounterProps> = ({ teamA, teamB }) => {
  const [score, setScore] = useState<ScoreState>({
    runs: 0,
    wickets: 0,
    balls: 0,
    strikerId: null,
    nonStrikerId: null,
    bowlerId: null,
  });

  const [battingTeam, setBattingTeam] = useState<'A' | 'B'>('A');

  const currentBattingTeam = battingTeam === 'A' ? teamA : teamB;
  const currentBowlingTeam = battingTeam === 'A' ? teamB : teamA;

  const striker = currentBattingTeam.players.find(p => p.id === score.strikerId);
  const nonStriker = currentBattingTeam.players.find(p => p.id === score.nonStrikerId);
  const bowler = currentBowlingTeam.players.find(p => p.id === score.bowlerId);

  const rotateStrike = () => {
    setScore(prev => ({
      ...prev,
      strikerId: prev.nonStrikerId,
      nonStrikerId: prev.strikerId
    }));
  };

  const addRuns = (r: number) => {
    setScore(prev => {
      let newStriker = prev.strikerId;
      let newNonStriker = prev.nonStrikerId;
      
      // Rotate strike on odd runs
      if (r % 2 !== 0) {
        newStriker = prev.nonStrikerId;
        newNonStriker = prev.strikerId;
      }

      return {
        ...prev,
        runs: prev.runs + r,
        balls: prev.balls + 1,
        strikerId: newStriker,
        nonStrikerId: newNonStriker
      };
    });
  };

  const addWicket = () => {
    setScore(prev => ({ 
      ...prev, 
      wickets: prev.wickets + 1, 
      balls: prev.balls + 1,
      strikerId: null // Clear striker on wicket
    }));
  };

  const resetScore = () => {
    setScore({ runs: 0, wickets: 0, balls: 0, strikerId: null, nonStrikerId: null, bowlerId: null });
  };

  const formatOvers = (balls: number) => {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return `${overs}.${remainingBalls}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <Target size={20} className="text-rose-500" />
            Live Scoreboard
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setBattingTeam('A')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${battingTeam === 'A' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              {teamA.name} Batting
            </button>
            <button 
              onClick={() => setBattingTeam('B')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${battingTeam === 'B' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              {teamB.name} Batting
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Main Score */}
          <div className="text-center md:text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Score</p>
            <div className="flex items-baseline gap-2 justify-center md:justify-start">
              <span className="text-6xl font-black text-slate-800">{score.runs}</span>
              <span className="text-4xl font-bold text-slate-300">/</span>
              <span className="text-4xl font-bold text-rose-500">{score.wickets}</span>
            </div>
            <p className="text-slate-500 font-medium mt-1">Overs: {formatOvers(score.balls)}</p>
          </div>

          {/* Player Selection */}
          <div className="space-y-3">
            <div className={`p-3 rounded-xl border transition-all ${score.strikerId ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Striker</label>
                {score.strikerId && <Zap size={12} className="text-amber-500 fill-amber-500 animate-pulse" />}
              </div>
              <select 
                value={score.strikerId || ''} 
                onChange={(e) => setScore(prev => ({ ...prev, strikerId: e.target.value }))}
                className="w-full bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-sm"
              >
                <option value="">Select Striker</option>
                {currentBattingTeam.players.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === score.nonStrikerId}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={rotateStrike}
                disabled={!score.strikerId || !score.nonStrikerId}
                className="p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all shadow-sm"
                title="Rotate Strike"
              >
                <ArrowRightLeft size={14} />
              </button>
            </div>

            <div className={`p-3 rounded-xl border transition-all ${score.nonStrikerId ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Non-Striker</label>
              <select 
                value={score.nonStrikerId || ''} 
                onChange={(e) => setScore(prev => ({ ...prev, nonStrikerId: e.target.value }))}
                className="w-full bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-sm"
              >
                <option value="">Select Non-Striker</option>
                {currentBattingTeam.players.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === score.strikerId}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Bowler</label>
              <select 
                value={score.bowlerId || ''} 
                onChange={(e) => setScore(prev => ({ ...prev, bowlerId: e.target.value }))}
                className="w-full bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-sm"
              >
                <option value="">Select Bowler</option>
                {currentBowlingTeam.players.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3, 4, 6].map(r => (
              <button
                key={r}
                onClick={() => addRuns(r)}
                className="h-12 flex items-center justify-center bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-xl font-bold transition-all active:scale-95"
              >
                {r}
              </button>
            ))}
            <button
              onClick={addWicket}
              className="h-12 col-span-2 bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition-all active:scale-95"
            >
              Wicket
            </button>
            <button
              onClick={resetScore}
              className="h-12 col-span-4 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-bold transition-all"
            >
              <RotateCcw size={14} />
              Reset Score
            </button>
          </div>
        </div>
      </div>

      {/* Match Context Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-4 rounded-2xl border transition-all ${score.strikerId ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${score.strikerId ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
              <User size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Striker</p>
                {score.strikerId && <Zap size={10} className="text-amber-500 fill-amber-500" />}
              </div>
              <p className="font-bold text-slate-800 truncate">{striker?.name || '---'}</p>
              <p className="text-[10px] text-slate-500">Bat: {striker?.batting || 0}</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${score.nonStrikerId ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${score.nonStrikerId ? 'bg-slate-100 text-slate-500' : 'bg-slate-200 text-slate-400'}`}>
              <User size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Non-Striker</p>
              <p className="font-bold text-slate-800 truncate">{nonStriker?.name || '---'}</p>
              <p className="text-[10px] text-slate-500">Bat: {nonStriker?.batting || 0}</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${score.bowlerId ? 'bg-white border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${score.bowlerId ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
              <Target size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bowler</p>
              <p className="font-bold text-slate-800 truncate">{bowler?.name || '---'}</p>
              <p className="text-[10px] text-slate-500">Bowl: {bowler?.bowling || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
