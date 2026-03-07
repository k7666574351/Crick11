import { useEffect } from "react";
import React, { useState } from "react";
import { Team, Player, ScoreState } from "../types";
import {
  Target,
  User,
  ChevronRight,
  RotateCcw,
  ArrowRightLeft,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface ScoreCounterProps {
  teamA: Team;
  teamB: Team;
  setTeamAPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setTeamBPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

export const ScoreCounter: React.FC<ScoreCounterProps> = ({
  teamA,
  teamB,
  setTeamAPlayers,
  setTeamBPlayers,
}) => {
  const [score, setScore] = useState<ScoreState>({
    runs: 0,
    wickets: 0,
    balls: 0,
    strikerId: null,
    nonStrikerId: null,
    bowlerId: null,
  });

  useEffect(() => {
    localStorage.setItem("matchScore", JSON.stringify(score));
  }, [score]);

  const [battingTeam, setBattingTeam] = useState<"A" | "B">("A");
  const [totalOvers, setTotalOvers] = useState(5);
  const [firstInningsRuns, setFirstInningsRuns] = useState<number | null>(null);

  const currentBattingTeam = battingTeam === "A" ? teamA : teamB;
  const currentBowlingTeam = battingTeam === "A" ? teamB : teamA;
  const target = firstInningsRuns !== null ? firstInningsRuns + 1 : null;
  const ballsLeft = totalOvers * 6 - score.balls;
  const runsNeeded = target ? target - score.runs : null;

  const striker = currentBattingTeam.players.find(
    (p) => p.id === score.strikerId,
  );
  const nonStriker = currentBattingTeam.players.find(
    (p) => p.id === score.nonStrikerId,
  );
  const bowler = currentBowlingTeam.players.find(
    (p) => p.id === score.bowlerId,
  );

  const rotateStrike = () => {
    setScore((prev) => ({
      ...prev,
      strikerId: prev.nonStrikerId,
      nonStrikerId: prev.strikerId,
    }));
  };

  const addRuns = (r: number) => {
    const addWide = () => {
      // do not allow scoring if overs finished
      if (score.balls >= totalOvers * 6) return;
      if (!score.strikerId) {
        alert("Select striker before scoring");
        return;
      }
      setScore((prev) => {
        const newRuns = prev.runs + 1;

        // update first innings score if chasing
        if (battingTeam === "A" && prev.balls === totalOvers * 6 - 1) {
          setFirstInningsRuns(newRuns);
        }

        return {
          ...prev,
          runs: newRuns,
        };
      });

      // update bowler runs conceded
      if (score.bowlerId) {
        const updateBowler = (players: Player[]) =>
          players.map((p) => {
            if (p.id === score.bowlerId) {
              return {
                ...p,
                runsConceded: (p.runsConceded || 0) + 1,
              };
            }
            return p;
          });

        if (battingTeam === "A") {
          setTeamBPlayers(updateBowler);
        } else {
          setTeamAPlayers(updateBowler);
        }
      }
    };
    // stop if overs finished
    if (score.balls >= totalOvers * 6) return;

    // striker must exist
    if (!score.strikerId) return;

    // ------------------------
    // Update Batsman Stats
    // ------------------------
    const updatePlayers = (players: Player[]) =>
      players.map((p) => {
        if (p.id === score.strikerId) {
          return {
            ...p,
            runs: (p.runs || 0) + r,
            ballsFaced: (p.ballsFaced || 0) + 1,
            fours: r === 4 ? (p.fours || 0) + 1 : p.fours,
            sixes: r === 6 ? (p.sixes || 0) + 1 : p.sixes,
          };
        }
        return p;
      });

    if (battingTeam === "A") {
      setTeamAPlayers(updatePlayers);
    } else {
      setTeamBPlayers(updatePlayers);
    }

    // ------------------------
    // Update Bowler Stats
    // ------------------------
    if (score.bowlerId) {
      const updateBowler = (players: Player[]) =>
        players.map((p) => {
          if (p.id === score.bowlerId) {
            return {
              ...p,
              runsConceded: (p.runsConceded || 0) + r,
              ballsBowled: (p.ballsBowled || 0) + 1,
            };
          }
          return p;
        });

      if (battingTeam === "A") {
        setTeamBPlayers(updateBowler);
      } else {
        setTeamAPlayers(updateBowler);
      }
    }

    // ------------------------
    // Update Scoreboard
    // ------------------------
    setScore((prev) => {
      const newBalls = prev.balls + 1;
      const newRuns = prev.runs + r;

      let newStriker = prev.strikerId;
      let newNonStriker = prev.nonStrikerId;

      // rotate strike on odd runs
      if (prev.nonStrikerId && r % 2 !== 0) {
        newStriker = prev.nonStrikerId;
        newNonStriker = prev.strikerId;
      }

      // set first innings score when overs complete
      if (newBalls === totalOvers * 6 && battingTeam === "A") {
        setFirstInningsRuns(newRuns);
      }

      return {
        ...prev,
        runs: newRuns,
        balls: newBalls,
        strikerId: newStriker,
        nonStrikerId: newNonStriker,
      };
    });
  };

  const addWide = () => {
    // do not allow scoring if overs finished
    if (score.balls >= totalOvers * 6) return;

    setScore((prev) => {
      const newRuns = prev.runs + 1;

      // update first innings score if chasing
      if (battingTeam === "A" && prev.balls === totalOvers * 6 - 1) {
        setFirstInningsRuns(newRuns);
      }

      return {
        ...prev,
        runs: newRuns,
      };
    });

    // update bowler runs conceded
    if (score.bowlerId) {
      const updateBowler = (players: Player[]) =>
        players.map((p) => {
          if (p.id === score.bowlerId) {
            return {
              ...p,
              runsConceded: (p.runsConceded || 0) + 1,
            };
          }
          return p;
        });

      if (battingTeam === "A") {
        setTeamBPlayers(updateBowler);
      } else {
        setTeamAPlayers(updateBowler);
      }
    }
  };
  const addWicket = () => {
    if (score.balls >= totalOvers * 6) return;
    if (!score.bowlerId) return;
    const updateBowler = (players: Player[]) =>
      players.map((p) => {
        if (p.id === score.bowlerId) {
          return {
            ...p,
            wickets: (p.wickets || 0) + 1,
            ballsBowled: (p.ballsBowled || 0) + 1,
          };
        }
        return p;
      });

    if (battingTeam === "A") {
      setTeamBPlayers(updateBowler);
    } else {
      setTeamAPlayers(updateBowler);
    }

    setScore((prev) => ({
      ...prev,
      wickets: prev.wickets + 1,
      balls: prev.balls + 1,
      strikerId: null,
    }));
  };

  const resetScore = () => {
    setScore({
      runs: 0,
      wickets: 0,
      balls: 0,
      strikerId: null,
      nonStrikerId: null,
      bowlerId: null,
    });
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
          <div className="flex items-center gap-3 mb-4">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Match Overs
            </label>

            <select
              value={totalOvers}
              onChange={(e) => setTotalOvers(Number(e.target.value))}
              className="px-3 py-1 rounded-lg border border-slate-200 text-sm"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((o) => (
                <option key={o} value={o}>
                  {o} Overs
                </option>
              ))}
            </select>
          </div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <Target size={20} className="text-rose-500" />
            Live Scoreboard
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setBattingTeam("A")}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${battingTeam === "A" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              {teamA.name} Batting
            </button>
            <button
              onClick={() => setBattingTeam("B")}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${battingTeam === "B" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              {teamB.name} Batting
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Main Score */}
          <div className="text-center md:text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Current Score
            </p>
            <div className="flex items-baseline gap-2 justify-center md:justify-start">
              <span className="text-6xl font-black text-slate-800">
                {score.runs}
              </span>
              <span className="text-4xl font-bold text-slate-300">/</span>
              <span className="text-4xl font-bold text-rose-500">
                {score.wickets}
              </span>
            </div>
            <p className="text-slate-500 font-medium mt-1">
              Overs: {formatOvers(score.balls)} / {totalOvers}
            </p>

            {firstInningsRuns !== null && battingTeam === "B" && (
              <div className="mt-1">
                <p className="text-sm font-bold text-emerald-600">
                  Target: {target}
                </p>

                {runsNeeded !== null && runsNeeded > 0 && ballsLeft >= 0 && (
                  <p className="text-xs font-semibold text-slate-500">
                    {runsNeeded} runs needed in {ballsLeft} balls
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Player Selection */}
          <div className="space-y-3">
            <div
              className={`p-3 rounded-xl border transition-all ${score.strikerId ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Striker
                </label>
                {score.strikerId && (
                  <Zap
                    size={12}
                    className="text-amber-500 fill-amber-500 animate-pulse"
                  />
                )}
              </div>
              <select
                value={score.strikerId || ""}
                onChange={(e) =>
                  setScore((prev) => ({ ...prev, strikerId: e.target.value }))
                }
                className="w-full bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-sm"
              >
                <option value="">Select Striker</option>
                {currentBattingTeam.players.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={p.id === score.nonStrikerId}
                  >
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                onClick={rotateStrike}
                disabled={!score.strikerId}
                className="p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all shadow-sm"
                title="Rotate Strike"
              >
                <ArrowRightLeft size={14} />
              </button>
            </div>

            <div
              className={`p-3 rounded-xl border transition-all ${score.nonStrikerId ? "bg-slate-50 border-slate-200" : "bg-slate-50 border-slate-100"}`}
            >
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Non-Striker
              </label>
              <select
                value={score.nonStrikerId || ""}
                onChange={(e) =>
                  setScore((prev) => ({
                    ...prev,
                    nonStrikerId: e.target.value,
                  }))
                }
                className="w-full bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-sm"
              >
                <option value="">Select Non-Striker</option>
                {currentBattingTeam.players.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={p.id === score.strikerId}
                  >
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Bowler
              </label>
              <select
                value={score.bowlerId || ""}
                onChange={(e) =>
                  setScore((prev) => ({ ...prev, bowlerId: e.target.value }))
                }
                className="w-full bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-sm"
              >
                <option value="">Select Bowler</option>
                {currentBowlingTeam.players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3, 4, 6].map((r) => (
              <button
                key={r}
                onClick={() => addRuns(r)}
                className="h-12 flex items-center justify-center bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-xl font-bold transition-all active:scale-95"
              >
                {r}
              </button>
            ))}
            <button
              onClick={addWide}
              className="h-12  bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl font-bold transition-all active:scale-95"
            >
              Wide
            </button>
            <button
              onClick={addWicket}
              className="h-12  bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition-all active:scale-95"
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
        <div
          className={`p-4 rounded-2xl border transition-all ${score.strikerId ? "bg-white border-indigo-200 shadow-sm" : "bg-slate-50 border-slate-200 opacity-60"}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${score.strikerId ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-400"}`}
            >
              <User size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Striker
                </p>
                {score.strikerId && (
                  <Zap size={10} className="text-amber-500 fill-amber-500" />
                )}
              </div>
              <p className="font-bold text-slate-800 truncate">
                {striker?.name || "---"}
              </p>
              <p className="text-[10px] text-slate-500">
                Bat: {striker?.batting || 0}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${score.nonStrikerId ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-slate-200 opacity-60"}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${score.nonStrikerId ? "bg-slate-100 text-slate-500" : "bg-slate-200 text-slate-400"}`}
            >
              <User size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Non-Striker
              </p>
              <p className="font-bold text-slate-800 truncate">
                {nonStriker?.name || "---"}
              </p>
              <p className="text-[10px] text-slate-500">
                Bat: {nonStriker?.batting || 0}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${score.bowlerId ? "bg-white border-emerald-200 shadow-sm" : "bg-slate-50 border-slate-200 opacity-60"}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${score.bowlerId ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}
            >
              <Target size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Bowler
              </p>
              <p className="font-bold text-slate-800 truncate">
                {bowler?.name || "---"}
              </p>
              <p className="text-[10px] text-slate-500">
                Bowl: {bowler?.bowling || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
