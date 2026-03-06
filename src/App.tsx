/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Player, Team, MatchInfo } from "./types";
import { PlayerForm } from "./components/PlayerForm";
import { PlayerList } from "./components/PlayerList";
import { TeamDisplay } from "./components/TeamDisplay";
import { MatchSettings } from "./components/MatchSettings";
import { ScoreCounter } from "./components/ScoreCounter";
import { PlayerStats } from "./components/PlayerStats";
import { generateBalancedTeams, shuffleTeams } from "./utils/teamGenerator";
import {
  RefreshCw,
  Shuffle,
  RotateCcw,
  LayoutDashboard,
  Share2,
  Target,
  BarChart3,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { supabase } from "./lib/supabase";
import { useUser } from "@clerk/clerk-react";

// Example data
const INITIAL_PLAYERS: Player[] = [
  {
    id: "1",
    name: "Virat",
    batting: 10,
    bowling: 4,
    fielding: 9,
    totalSkill: 23,
    matches: 45,
    runs: 1200,
    wickets: 2,
  },
  {
    id: "2",
    name: "Rohit",
    batting: 9,
    bowling: 3,
    fielding: 7,
    totalSkill: 19,
    matches: 42,
    runs: 1150,
    wickets: 1,
  },
  {
    id: "3",
    name: "Bumrah",
    batting: 3,
    bowling: 10,
    fielding: 8,
    totalSkill: 21,
    matches: 38,
    runs: 120,
    wickets: 85,
  },
  {
    id: "4",
    name: "Hardik",
    batting: 8,
    bowling: 8,
    fielding: 9,
    totalSkill: 25,
    matches: 35,
    runs: 650,
    wickets: 42,
  },
  {
    id: "5",
    name: "Jadeja",
    batting: 7,
    bowling: 9,
    fielding: 10,
    totalSkill: 26,
    matches: 40,
    runs: 580,
    wickets: 55,
  },
  {
    id: "6",
    name: "Pant",
    batting: 9,
    bowling: 2,
    fielding: 8,
    totalSkill: 19,
    matches: 30,
    runs: 890,
    wickets: 0,
  },
  {
    id: "7",
    name: "Shami",
    batting: 4,
    bowling: 9,
    fielding: 7,
    totalSkill: 20,
    matches: 36,
    runs: 150,
    wickets: 78,
  },
  {
    id: "8",
    name: "Gill",
    batting: 8,
    bowling: 3,
    fielding: 8,
    totalSkill: 19,
    matches: 25,
    runs: 720,
    wickets: 0,
  },
  {
    id: "9",
    name: "Sky",
    batting: 9,
    bowling: 2,
    fielding: 9,
    totalSkill: 20,
    matches: 28,
    runs: 940,
    wickets: 0,
  },
  {
    id: "10",
    name: "Siraj",
    batting: 3,
    bowling: 9,
    fielding: 7,
    totalSkill: 19,
    matches: 32,
    runs: 80,
    wickets: 62,
  },
];

type Tab = "splitter" | "score" | "stats";

export default function App() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("splitter");
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [teamA, setTeamA] = useState<Team>({
    name: "Red Warriors",
    players: [],
    totalSkill: 0,
  });
  const [teamB, setTeamB] = useState<Team>({
    name: "Blue Titans",
    players: [],
    totalSkill: 0,
  });
  const [matchInfo, setMatchInfo] = useState<MatchInfo>({
    matchName: "Sunday Morning Turf",
    groundName: "HSR Layout Turf",
    matchDate: new Date().toISOString().split("T")[0],
  });

  const handleAddPlayer = (
    newPlayerData: Omit<Player, "id" | "totalSkill">,
  ) => {
    const totalSkill =
      newPlayerData.batting + newPlayerData.bowling + newPlayerData.fielding;
    const newPlayer: Player = {
      ...newPlayerData,
      id: Math.random().toString(36).substr(2, 9),
      totalSkill,
      matches: 0,
      runs: 0,
      wickets: 0,
    };
    setPlayers([...players, newPlayer]);
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleEditPlayer = (updatedPlayer: Player) => {
    const name = prompt("Edit Player Name:", updatedPlayer.name);
    if (name) {
      setPlayers(
        players.map((p) => (p.id === updatedPlayer.id ? { ...p, name } : p)),
      );
    }
  };

  const handleGenerateTeams = () => {
    if (players.length < 2) return;
    const { teamA: a, teamB: b } = generateBalancedTeams(
      players,
      teamA.name,
      teamB.name,
    );
    setTeamA(a);
    setTeamB(b);

    saveMatch(a, b);
  };

  const handleShuffleTeams = () => {
    if (players.length < 2) return;
    const { teamA: a, teamB: b } = shuffleTeams(
      players,
      teamA.name,
      teamB.name,
    );
    setTeamA(a);
    setTeamB(b);
  };

  const handleResetTeams = () => {
    setTeamA({ ...teamA, players: [], totalSkill: 0 });
    setTeamB({ ...teamB, players: [], totalSkill: 0 });
  };

  const handleRenameTeam = (type: "A" | "B", newName: string) => {
    if (type === "A") setTeamA({ ...teamA, name: newName });
    else setTeamB({ ...teamB, name: newName });
  };

  async function saveMatch(teamA: Team, teamB: Team) {
  console.log("Saving match...");

  const { error } = await supabase.from("matches").insert([
    {
      user_id: user?.id,
      match_name: matchInfo.matchName,
      ground_name: matchInfo.groundName,
      match_date: matchInfo.matchDate,
      team_a: teamA,
      team_b: teamB
    }
  ]);

  if (error) {
    console.error("Error saving match:", error);
  } else {
    console.log("Match saved successfully");
  }
}

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-800">
              Kshitij<span className="text-indigo-600">11</span>
            </h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("splitter")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "splitter" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Users size={16} />
              Splitter
            </button>
            <button
              onClick={() => setActiveTab("score")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "score" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Target size={16} />
              Scoreboard
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "stats" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <BarChart3 size={16} />
              Stats
            </button>
          </nav>
          <nav className="hidden md:flex items-center bg-slate-100 p-2 rounded-xl">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 text-sm font-semibold text-gray-700 hover:text-black transition">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-slate-200 p-2 flex justify-center gap-2">
        <button
          onClick={() => setActiveTab("splitter")}
          className={`p-2 rounded-lg ${activeTab === "splitter" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
        >
          <Users size={20} />
        </button>
        <button
          onClick={() => setActiveTab("score")}
          className={`p-2 rounded-lg ${activeTab === "score" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
        >
          <Target size={20} />
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`p-2 rounded-lg ${activeTab === "stats" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
        >
          <BarChart3 size={20} />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "splitter" && (
            <motion.div
              key="splitter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Settings & Input */}
              <div className="lg:col-span-4 space-y-8">
                <MatchSettings settings={matchInfo} onUpdate={setMatchInfo} />
                <PlayerForm onAddPlayer={handleAddPlayer} />
                <PlayerList
                  players={players}
                  onRemovePlayer={handleRemovePlayer}
                  onEditPlayer={handleEditPlayer}
                />
              </div>

              {/* Right Column: Teams & Controls */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleGenerateTeams}
                      disabled={players.length < 2}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                    >
                      <RefreshCw size={18} />
                      Generate Teams
                    </button>
                    <button
                      onClick={handleShuffleTeams}
                      disabled={players.length < 2}
                      className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition-all active:scale-[0.98]"
                    >
                      <Shuffle size={18} />
                      Shuffle
                    </button>
                  </div>
                  <button
                    onClick={handleResetTeams}
                    className="flex items-center gap-2 text-slate-400 hover:text-rose-500 font-bold px-4 py-2 transition-colors"
                  >
                    <RotateCcw size={18} />
                    Reset
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800">
                      MATCH PREVIEW
                    </h2>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {matchInfo.matchName}
                      </p>
                      <p className="text-sm font-medium text-slate-600">
                        {matchInfo.groundName} • {matchInfo.matchDate}
                      </p>
                    </div>
                  </div>

                  <TeamDisplay
                    teamA={teamA}
                    teamB={teamB}
                    onRenameTeam={handleRenameTeam}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "score" && (
            <motion.div
              key="score"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {teamA.players.length > 0 ? (
                <ScoreCounter teamA={teamA} teamB={teamB} />
              ) : (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                  <Target size={48} className="mx-auto mb-4 text-slate-200" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Teams Not Generated
                  </h3>
                  <p className="text-slate-500 mb-6">
                    You need to split players into teams before starting the
                    scoreboard.
                  </p>
                  <button
                    onClick={() => setActiveTab("splitter")}
                    className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl"
                  >
                    Go to Splitter
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PlayerStats players={players} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2026 Kshitij11 • Built for balanced sports matches</p>
        </div>
      </footer>
    </div>
  );
}
