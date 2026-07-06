/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Music, Sparkles, Globe, Users, Settings, LogOut, ChevronRight, Bell, User, Disc } from "lucide-react";
import { Song, Project, DistributionRelease, WalletTransaction, WithdrawalRequest, Ticket } from "./types";
import { INITIAL_SONGS, INITIAL_PROJECTS, COMMUNITY_FEED, INITIAL_RELEASES, INITIAL_TRANSACTIONS, ADMIN_TICKETS } from "./data";

// Sub-components
import HomeScreen from "./components/HomeScreen";
import MusicGenerator from "./components/MusicGenerator";
import LyricsGenerator from "./components/LyricsGenerator";
import DistributionForm from "./components/DistributionForm";
import ArtistDashboard from "./components/ArtistDashboard";
import SettingsView from "./components/SettingsView";
import AudioPlayer from "./components/AudioPlayer";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  // Core synchronized application state
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [currentSong, setCurrentSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [feed, setFeed] = useState(COMMUNITY_FEED);
  const [releases, setReleases] = useState<DistributionRelease[]>(INITIAL_RELEASES);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
    { id: "w1", amount: 1500, method: "UPI", destination: "amio@okaxis", date: "2026-07-04", status: "Approved" },
  ]);
  const [tickets, setTickets] = useState<Ticket[]>(ADMIN_TICKETS);
  const [pricingPlan, setPricingPlan] = useState("Artist");

  // Handlers for state updates across sub-components
  const handleAddSong = (newSong: Song) => {
    setSongs([newSong, ...songs]);
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    const idx = songs.findIndex((s) => s.id === currentSong?.id);
    if (idx !== -1 && idx < songs.length - 1) {
      setCurrentSong(songs[idx + 1]);
    } else {
      setCurrentSong(songs[0]); // Loop back
    }
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    const idx = songs.findIndex((s) => s.id === currentSong?.id);
    if (idx > 0) {
      setCurrentSong(songs[idx - 1]);
    } else {
      setCurrentSong(songs[songs.length - 1]); // Loop to end
    }
    setIsPlaying(true);
  };

  const handleToggleFavorite = (id: string) => {
    setSongs(
      songs.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
    if (currentSong?.id === id) {
      setCurrentSong({ ...currentSong, isFavorite: !currentSong.isFavorite });
    }
  };

  const handleUpdateSongVols = (id: string, vols: Song["stemVols"]) => {
    setSongs(songs.map((s) => (s.id === id ? { ...s, stemVols: vols } : s)));
  };

  const handleUpdateSongEffects = (id: string, fx: Song["effects"]) => {
    setSongs(songs.map((s) => (s.id === id ? { ...s, effects: fx } : s)));
  };

  const handleAddProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
  };

  const handleAddRelease = (newRelease: DistributionRelease) => {
    setReleases([newRelease, ...releases]);
  };

  const handleAddWithdrawal = (newReq: WithdrawalRequest) => {
    setWithdrawals([newReq, ...withdrawals]);
  };

  const handleAddTransaction = (newTx: WalletTransaction) => {
    setTransactions([newTx, ...transactions]);
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(
      tickets.map((t) => (t.id === ticketId ? { ...t, status: "Resolved" } : t))
    );
  };

  const handleApproveWithdrawal = (withdrawalId: string) => {
    setWithdrawals(
      withdrawals.map((w) => (w.id === withdrawalId ? { ...w, status: "Approved" } : w))
    );
  };

  const handleLikePost = (postId: string) => {
    setFeed(
      feed.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
              hasLiked: !p.hasLiked,
            }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-slate-100 flex font-sans antialiased relative">
      {/* Background neon ambient gradients */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-black/40 backdrop-blur-md p-6 justify-between fixed h-full z-30">
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Disc className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white leading-none tracking-tight">
                Koya <span className="text-purple-400">AI</span>
              </h1>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5 block">Music Studio</span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1">
            {[
              { key: "home", label: "Home Hub", icon: <Home className="h-4 w-4" /> },
              { key: "create", label: "AI Music Gen", icon: <Music className="h-4 w-4" /> },
              { key: "lyrics", label: "Lyrics & Visuals", icon: <Sparkles className="h-4 w-4" /> },
              { key: "distribute", label: "Worldwide Dist.", icon: <Globe className="h-4 w-4" /> },
              { key: "dashboard", label: "Artist Portal", icon: <Users className="h-4 w-4" /> },
              { key: "settings", label: "Preferences", icon: <Settings className="h-4 w-4" /> },
            ].map((link) => {
              const isActive = activeTab === link.key;
              return (
                <button
                  key={link.key}
                  onClick={() => setActiveTab(link.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-purple-500/15 text-white border-l-4 border-purple-500"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-purple-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
              alt="User profile"
              className="h-9 w-9 rounded-full object-cover border border-purple-500/20"
            />
            <div>
              <h4 className="text-xs font-bold text-white leading-none">Amio</h4>
              <span className="text-[9px] text-slate-500 mt-0.5 block">Pro Member</span>
            </div>
          </div>
          <button
            onClick={() => alert("Logged out! (Demo mode)")}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-[10px] uppercase tracking-wider font-extrabold text-pink-500 hover:bg-pink-500/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out Account
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* Top Header Controls */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 lg:hidden">
            <Disc className="h-6 w-6 text-purple-500 animate-spin-slow" />
            <h1 className="text-lg font-black text-white tracking-tight">Koya AI</h1>
          </div>
          
          <div className="hidden lg:block text-xs font-mono text-slate-500">
            Network Status: <span className="text-emerald-400 font-bold">Secure</span> • API Latency: <span className="text-purple-400 font-bold">12ms</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 relative transition-all">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-pink-500" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 hidden md:block">amiobusiness94</span>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-xs">
                AM
              </div>
            </div>
          </div>
        </header>

        {/* Content Tabs Wrapper */}
        <div className="p-6 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "home" && (
                <HomeScreen
                  songs={songs}
                  projects={projects}
                  feed={feed}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlaySong={handlePlaySong}
                  onPlayPause={handlePlayPause}
                  onNavigate={setActiveTab}
                  onLikePost={handleLikePost}
                />
              )}

              {activeTab === "create" && (
                <MusicGenerator
                  onAddSong={handleAddSong}
                  onPlaySong={handlePlaySong}
                  onAddProject={handleAddProject}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                />
              )}

              {activeTab === "lyrics" && <LyricsGenerator onAddProject={handleAddProject} />}

              {activeTab === "distribute" && (
                <DistributionForm
                  releases={releases}
                  songs={songs}
                  onAddRelease={handleAddRelease}
                  pricingPlan={pricingPlan}
                  onUpgradePlan={setPricingPlan}
                />
              )}

              {activeTab === "dashboard" && (
                <ArtistDashboard
                  songs={songs}
                  transactions={transactions}
                  withdrawals={withdrawals}
                  tickets={tickets}
                  onAddWithdrawal={handleAddWithdrawal}
                  onAddTransaction={handleAddTransaction}
                  onResolveTicket={handleResolveTicket}
                  onApproveWithdrawal={handleApproveWithdrawal}
                />
              )}

              {activeTab === "settings" && <SettingsView pricingPlan={pricingPlan} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* BOTTOM MOBILE NAVIGATION */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-black/80 backdrop-blur-lg py-2.5 px-6 flex justify-between items-center">
        {[
          { key: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
          { key: "create", label: "AI Music", icon: <Music className="h-5 w-5" /> },
          { key: "lyrics", label: "Lyrics", icon: <Sparkles className="h-5 w-5" /> },
          { key: "distribute", label: "Dist.", icon: <Globe className="h-5 w-5" /> },
          { key: "dashboard", label: "Artist", icon: <Users className="h-5 w-5" /> },
        ].map((link) => {
          const isActive = activeTab === link.key;
          return (
            <button
              key={link.key}
              onClick={() => setActiveTab(link.key)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? "text-purple-400 font-black scale-105" : "text-slate-400 hover:text-white"
              }`}
            >
              {link.icon}
              <span className="text-[9px] font-semibold">{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* PERSISTENT FLOATING AUDIO PLAYER */}
      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextSong}
        onPrev={handlePrevSong}
        onToggleFavorite={handleToggleFavorite}
        onUpdateSongVols={handleUpdateSongVols}
        onUpdateSongEffects={handleUpdateSongEffects}
      />
    </div>
  );
}
