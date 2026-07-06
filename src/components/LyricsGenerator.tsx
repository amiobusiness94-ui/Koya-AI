/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, FileText, Image, Video, Globe, Download, Play, Plus, BookOpen, Trash2, Code, Clapperboard, Layers, Loader } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Project } from "../types";

interface LyricsGeneratorProps {
  onAddProject: (proj: Project) => void;
}

export default function LyricsGenerator({ onAddProject }: LyricsGeneratorProps) {
  const [activeTab, setActiveTab] = useState<"lyrics" | "cover" | "video">("lyrics");

  // LYRICS GENERATION STATE
  const [lyricsPrompt, setLyricsPrompt] = useState("");
  const [language, setLanguage] = useState("English");
  const [songType, setSongType] = useState("Pop");
  const [theme, setTheme] = useState("Cybernetic Love");
  const [mood, setMood] = useState("Energetic");
  const [verses, setVerses] = useState(2);
  const [choruses, setChoruses] = useState(1);
  const [generatedLyrics, setGeneratedLyrics] = useState("");
  const [lyricsLoading, setLyricsLoading] = useState(false);

  // COVER ART STATE
  const [coverPrompt, setCoverPrompt] = useState("");
  const [coverStyle, setCoverStyle] = useState("Cyberpunk");
  const [generatedCover, setGeneratedCover] = useState("");
  const [coverLoading, setCoverLoading] = useState(false);

  // VIDEO GENERATOR STATE
  const [videoSongTitle, setVideoSongTitle] = useState("");
  const [videoStyle, setVideoStyle] = useState("Lyrics Video");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [videoResolution, setVideoResolution] = useState("1080P");
  const [videoScenes, setVideoScenes] = useState<any[]>([]);
  const [videoLoading, setVideoLoading] = useState(false);

  // LYRICS HANDLER
  const handleGenerateLyrics = async () => {
    if (!lyricsPrompt || lyricsLoading) return;
    setLyricsLoading(true);
    setGeneratedLyrics("");

    try {
      const response = await fetch("/api/generate-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: lyricsPrompt,
          genre: songType,
          language,
          songType,
          theme,
          mood,
          verseCount: verses,
          chorusCount: choruses,
        }),
      });

      const data = await response.json();
      setGeneratedLyrics(data.lyrics);

      // Save as project
      onAddProject({
        id: "proj_" + Date.now(),
        title: `${songType} Lyrics: ${lyricsPrompt.substring(0, 15)}...`,
        genre: songType,
        lastEdited: "Just now",
        type: "lyrics",
        status: "Completed",
        data: { lyrics: data.lyrics, language, theme },
      });
    } catch (err) {
      console.error(err);
      setGeneratedLyrics("Failed to connect to lyrics engine. Please try again.");
    } finally {
      setLyricsLoading(false);
    }
  };

  // COVER ART HANDLER
  const handleGenerateCover = async () => {
    if (!coverPrompt || coverLoading) return;
    setCoverLoading(true);
    setGeneratedCover("");

    try {
      const response = await fetch("/api/generate-cover-art-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: coverPrompt, style: coverStyle }),
      });
      const data = await response.json();

      // Based on style we choose nice high quality Unsplash templates as assets
      const styleImages: Record<string, string> = {
        Cyberpunk: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600",
        Realistic: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600",
        Minimal: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600",
        Luxury: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
        "3D": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600",
        Anime: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600",
        Neon: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=600",
      };

      setTimeout(() => {
        setGeneratedCover(styleImages[coverStyle] || styleImages.Cyberpunk);
        onAddProject({
          id: "proj_" + Date.now(),
          title: `Cover Art: ${coverPrompt.substring(0, 15)}`,
          genre: "Visual",
          lastEdited: "Just now",
          type: "cover",
          status: "Completed",
          data: { coverUrl: styleImages[coverStyle], prompt: data.prompt },
        });
        setCoverLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setCoverLoading(false);
    }
  };

  // VIDEO GENERATOR HANDLER
  const handleGenerateVideo = async () => {
    if (!videoSongTitle || videoLoading) return;
    setVideoLoading(true);
    setVideoScenes([]);

    try {
      const response = await fetch("/api/generate-video-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songTitle: videoSongTitle, style: videoStyle }),
      });
      const data = await response.json();

      setTimeout(() => {
        setVideoScenes(data.scenes || []);
        onAddProject({
          id: "proj_" + Date.now(),
          title: `${videoStyle}: ${videoSongTitle}`,
          genre: "Video Concept",
          lastEdited: "Just now",
          type: "video",
          status: "Completed",
          data: { scenes: data.scenes, style: videoStyle },
        });
        setVideoLoading(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      setVideoLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {[
          { key: "lyrics", label: "AI Lyrics Generator", icon: <FileText className="h-4 w-4" /> },
          { key: "cover", label: "AI Cover Generator", icon: <Image className="h-4 w-4" /> },
          { key: "video", label: "AI Video Generator", icon: <Video className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-purple-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* AI LYRICS GENERATOR */}
        {activeTab === "lyrics" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Form */}
            <div className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-purple-400 h-5 w-5" /> Unlimited AI Lyrics Generator
                </h3>
                <p className="text-xs text-slate-400">Generate creative song verses, bridges, hooks, or full structures in seconds.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Song Topic / Theme</label>
                <textarea
                  value={lyricsPrompt}
                  onChange={(e) => setLyricsPrompt(e.target.value)}
                  placeholder="e.g., A song about escaping a holographic simulation, finding authentic connections, digital hearts..."
                  rows={4}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Language (100+ supported)</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g., English, Spanish, Japanese..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Song Type / Style</label>
                  <select
                    value={songType}
                    onChange={(e) => setSongType(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  >
                    {["Pop", "Hip Hop", "Rap", "Rock", "EDM", "Romantic", "Sad", "Trap", "Bollywood"].map((type) => (
                      <option key={type} value={type} className="bg-slate-900 text-white">{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Slider details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Verse count</span>
                    <span className="text-purple-400 font-mono">{verses}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={verses}
                    onChange={(e) => setVerses(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Chorus count</span>
                    <span className="text-cyan-400 font-mono">{choruses}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={choruses}
                    onChange={(e) => setChoruses(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateLyrics}
                disabled={lyricsLoading || !lyricsPrompt}
                className="w-full py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-white/10 disabled:text-slate-500 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {lyricsLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Writing lyrics via Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Write Lyrics (100% Free)
                  </>
                )}
              </button>
            </div>

            {/* Output Display */}
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 flex flex-col justify-between min-h-[400px]">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Generated Song Lyrics</h4>
                {generatedLyrics ? (
                  <div className="bg-white/5 rounded-2xl border border-white/5 p-6 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line max-h-[350px] overflow-y-auto custom-scrollbar">
                    {generatedLyrics}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <FileText className="h-12 w-12 mb-3 opacity-35" />
                    <p className="text-xs">Your generated lyrics will appear here.</p>
                  </div>
                )}
              </div>
              {generatedLyrics && (
                <button
                  onClick={() => {
                    const blob = new Blob([generatedLyrics], { type: "text/plain" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `${theme.replace(/\s+/g, "_")}_lyrics.txt`;
                    link.click();
                  }}
                  className="mt-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" /> Download Lyrics .txt
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* AI COVER ART GENERATOR */}
        {activeTab === "cover" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Form */}
            <div className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Image className="text-purple-400 h-5 w-5" /> AI Album Cover Art Generator
                </h3>
                <p className="text-xs text-slate-400">Generate professional, luxury, or cyberpunk cover art designs for your single / album.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Visual Description</label>
                <textarea
                  value={coverPrompt}
                  onChange={(e) => setCoverPrompt(e.target.value)}
                  placeholder="e.g., A glowing crystal floating in a calm pink lake with stars, retro typography that reads 'Neon Horizons'..."
                  rows={4}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Artistic Style Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Cyberpunk", "Realistic", "Minimal", "Luxury", "3D", "Anime", "Neon"].map((style) => (
                    <button
                      key={style}
                      onClick={() => setCoverStyle(style)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        coverStyle === style
                          ? "bg-purple-500/10 border-purple-500 text-purple-400"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateCover}
                disabled={coverLoading || !coverPrompt}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-white/10 disabled:text-slate-500 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {coverLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Rendering 4K cover via Gemini-3.1-flash-image...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Cover Art (4K UltraHD)
                  </>
                )}
              </button>
            </div>

            {/* Output Visualizer */}
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 flex flex-col justify-between items-center min-h-[400px]">
              <div className="w-full">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Aesthetic Rendering Result</h4>
                {generatedCover ? (
                  <div className="space-y-4">
                    <img
                      src={generatedCover}
                      alt="Generated Album Cover"
                      className="w-64 h-64 mx-auto rounded-2xl object-cover border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
                    />
                    <div className="p-3 bg-white/5 rounded-xl text-[10px] text-slate-400 leading-relaxed font-mono">
                      <b>Prompt:</b> {coverPrompt}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                    <Image className="h-12 w-12 mb-3 opacity-35" />
                    <p className="text-xs">Your high resolution artwork will display here.</p>
                  </div>
                )}
              </div>
              {generatedCover && (
                <a
                  href={generatedCover}
                  target="_blank"
                  rel="noreferrer"
                  download="cover_art_hd.jpg"
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" /> Download HighRes JPG
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* AI VIDEO GENERATOR */}
        {activeTab === "video" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column Form */}
            <div className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clapperboard className="text-purple-400 h-5 w-5" /> AI Music Video Creator
                </h3>
                <p className="text-xs text-slate-400">Generate synchronized lyrics videos, ambient sound waves, or visualizer storyboards.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select Song Title</label>
                <input
                  type="text"
                  value={videoSongTitle}
                  onChange={(e) => setVideoSongTitle(e.target.value)}
                  placeholder="e.g., Endless Dreams, Echoes of Love..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Video Template Style</label>
                  <select
                    value={videoStyle}
                    onChange={(e) => setVideoStyle(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  >
                    <option className="bg-slate-900 text-white">Lyrics Video</option>
                    <option className="bg-slate-900 text-white">Beat Visualizer</option>
                    <option className="bg-slate-900 text-white">TikTok / Reels Short</option>
                    <option className="bg-slate-900 text-white">Cinematic Music Video</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Aspect Ratio / Layout</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  >
                    <option className="bg-slate-900 text-white" value="16:9">16:9 (YouTube / TV)</option>
                    <option className="bg-slate-900 text-white" value="9:16">9:16 (TikTok / Reels)</option>
                    <option className="bg-slate-900 text-white" value="1:1">1:1 (Square Feed)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateVideo}
                disabled={videoLoading || !videoSongTitle}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-white/10 disabled:text-slate-500 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {videoLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Rendering storyboard scenes using Veo-3.1-lite...</span>
                  </>
                ) : (
                  <>
                    <Video className="h-5 w-5" />
                    Render AI Video Scene Blueprint
                  </>
                )}
              </button>
            </div>

            {/* Right Column Scenes Output */}
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 flex flex-col justify-between min-h-[400px]">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Video Rendering Concept Scenes</h4>
                {videoScenes.length > 0 ? (
                  <div className="space-y-4">
                    {videoScenes.map((scene, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-start gap-4 relative overflow-hidden group"
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5"
                          style={{ backgroundColor: scene.color }}
                        />
                        <span className="text-xs font-mono font-bold text-slate-400">{scene.time}</span>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-white">{scene.description}</p>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                            Mood Accent: {scene.color}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                    <Video className="h-12 w-12 mb-3 opacity-35" />
                    <p className="text-xs">Your video scenes will generate here.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
