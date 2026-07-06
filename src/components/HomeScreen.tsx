/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Play, Pause, Sparkles, Music, Mic, Image, Video, Disc, Globe, Heart, MessageSquare, Plus, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Song, Project, CommunityPost } from "../types";
import { FEATURED_ARTISTS, POPULAR_GENRES } from "../data";

interface HomeScreenProps {
  songs: Song[];
  projects: Project[];
  feed: CommunityPost[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onPlayPause: () => void;
  onNavigate: (tab: string) => void;
  onLikePost: (postId: string) => void;
}

export default function HomeScreen({
  songs,
  projects,
  feed,
  currentSong,
  isPlaying,
  onPlaySong,
  onPlayPause,
  onNavigate,
  onLikePost,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getQuickActionIcon = (action: string) => {
    switch (action) {
      case "music": return <Music className="h-5 w-5 text-cyan-400" />;
      case "lyrics": return <Sparkles className="h-5 w-5 text-purple-400" />;
      case "vocal": return <Mic className="h-5 w-5 text-pink-400" />;
      case "cover": return <Image className="h-5 w-5 text-blue-400" />;
      case "video": return <Video className="h-5 w-5 text-emerald-400" />;
      default: return <Sparkles className="h-5 w-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Good Morning <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Let's create something revolutionary today on Koya AI.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search songs, artists, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { key: "music", label: "Music Gen", tab: "create" },
          { key: "lyrics", label: "Lyrics Gen", tab: "lyrics" },
          { key: "vocal", label: "Vocal Studio", tab: "vocal" },
          { key: "cover", label: "Cover Art", tab: "cover" },
          { key: "video", label: "Video Gen", tab: "video" },
        ].map((action) => (
          <button
            key={action.key}
            onClick={() => onNavigate(action.tab)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group text-center"
          >
            <div className="p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform mb-2">
              {getQuickActionIcon(action.key)}
            </div>
            <span className="text-xs font-semibold text-slate-300">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main Promo card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-black/40 p-6 md:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
            <Sparkles className="h-3 w-3" /> AI Music Revolution
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Generate Studio-Quality AI Songs with Natural Vocals
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Create full instrumental tracks or complete vocal songs in over 100 languages. Mix, master, and release your creations worldwide.
          </p>
          <button
            onClick={() => onNavigate("create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(168,85,247,0.3)] active:scale-95"
          >
            Create New Song <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Continue Creating & Popular Genres */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Disc className="h-5 w-5 text-purple-400" /> Continue Creating
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                onClick={() => onNavigate(project.type === "music" ? "create" : project.type)}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20">
                    {getQuickActionIcon(project.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-400">{project.genre} • Edited {project.lastEdited}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Genres */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-400" /> Popular Genres
          </h3>
          <div className="space-y-3">
            {POPULAR_GENRES.map((genre, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
                    #{idx + 1}
                  </div>
                  <span className="text-sm font-bold text-white">{genre.name}</span>
                </div>
                <span className="text-xs text-slate-400">{genre.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Songs & Featured Artists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Songs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FlameIcon /> Trending Songs
            </h3>
            <span className="text-xs text-purple-400 font-semibold cursor-pointer hover:underline">See All</span>
          </div>
          
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredSongs.map((song) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
                    isCurrent
                      ? "bg-purple-900/20 border-purple-500/40"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="h-12 w-12 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className={`text-sm font-semibold ${isCurrent ? "text-purple-400" : "text-white"}`}>
                        {song.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {song.artist} • <span className="text-slate-500">{song.genre}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-500">{song.bpm} BPM</span>
                    <button
                      onClick={() => onPlaySong(song)}
                      className="p-3 rounded-full bg-white/5 hover:bg-purple-500/20 text-white hover:text-purple-400 transition-all active:scale-95"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="h-4 w-4 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Artists */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <StarIcon /> Featured Artists
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {FEATURED_ARTISTS.map((artist, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
              >
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="h-10 w-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-sm font-semibold text-white">{artist.name}</h4>
                  <p className="text-xs text-slate-400">{artist.genre} • {artist.followers} followers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-400" /> Community Feed
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feed.map((post) => (
            <div
              key={post.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group"
            >
              <div className="space-y-3">
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={post.avatar} alt={post.author} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{post.author}</h4>
                      <p className="text-[10px] text-slate-400">{post.timestamp}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    post.role === "Artist" ? "bg-purple-500/10 text-purple-400" :
                    post.role === "Label" ? "bg-cyan-500/10 text-cyan-400" :
                    "bg-slate-500/10 text-slate-400"
                  }`}>
                    {post.role}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                  {post.content}
                </p>

                {/* Attached Song */}
                {post.songTitle && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="p-1.5 rounded bg-purple-500/10 text-purple-400">
                        <Music className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-semibold text-white block truncate">{post.songTitle}</span>
                        <span className="text-[10px] text-slate-500 truncate block">{post.genre}</span>
                      </div>
                    </div>
                    {post.audioUrl && (
                      <button
                        onClick={() => {
                          const matchingSong = songs.find(s => s.id === post.audioUrl);
                          if (matchingSong) onPlaySong(matchingSong);
                        }}
                        className="p-1.5 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-all"
                      >
                        <Play className="h-3 w-3 fill-current" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Engagement */}
              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-white/5 text-slate-400 text-xs">
                <button
                  onClick={() => onLikePost(post.id)}
                  className="flex items-center gap-1.5 hover:text-pink-500 transition-colors"
                >
                  <Heart className={`h-4 w-4 ${post.hasLiked ? "fill-pink-500 text-pink-500" : ""}`} />
                  {post.likes}
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlameIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
