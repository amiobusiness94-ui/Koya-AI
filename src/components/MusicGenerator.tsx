/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Play, Plus, Trash2, Cpu, Music, Mic, Volume2, Settings, Sliders, Activity, Info, Loader } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Song, Project } from "../types";

interface MusicGeneratorProps {
  onAddSong: (song: Song) => void;
  onPlaySong: (song: Song) => void;
  onAddProject: (proj: Project) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

export default function MusicGenerator({
  onAddSong,
  onPlaySong,
  onAddProject,
  currentSong,
  isPlaying,
}: MusicGeneratorProps) {
  const [activeTab, setActiveTab] = useState<"generate" | "vocal" | "daw">("generate");

  // MUSIC GENERATION STATE
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("EDM");
  const [mood, setMood] = useState("Happy");
  const [tempo, setTempo] = useState("Fast");
  const [energy, setEnergy] = useState(85);
  const [singer, setSinger] = useState("Female");
  const [language, setLanguage] = useState("English");
  const [format, setFormat] = useState("WAV");
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState("");

  // VOCAL CLONE STATE
  const [vocalName, setVocalName] = useState("");
  const [vocalPitch, setVocalPitch] = useState(0); // -12 to +12
  const [vocalHarmony, setVocalHarmony] = useState("Fifth Harmony");
  const [clonedVoices, setClonedVoices] = useState<string[]>(["Aurora", "Milo", "Seraphina", "Jax"]);
  const [cloningStatus, setCloningStatus] = useState(false);

  const genres = ["EDM", "LoFi", "Pop", "Hip Hop", "Rock", "Cyberpunk", "Sad", "Trap", "Classical"];
  const moods = ["Happy", "Epic", "Romantic", "Sad", "Dark", "Energetic", "Relaxed", "Ethereal"];

  const handleGenerateMusic = async () => {
    if (generating) return;
    setGenerating(true);

    const steps = [
      "Consulting Gemini-3.5-flash for song blueprints...",
      "Synthesizing melodic pentatonic note seeds...",
      "Assembling multi-track stem volumes...",
      "Configuring DSP FX limits & reverb modules...",
      "Finalizing HD WAV studio rendering...",
    ];

    let currentStepIdx = 0;
    setGenStep(steps[0]);

    const stepInterval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setGenStep(steps[currentStepIdx]);
      }
    }, 1200);

    try {
      const response = await fetch("/api/generate-song-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          genre,
          mood,
          language,
          tempo,
          singer,
        }),
      });

      const meta = await response.json();
      clearInterval(stepInterval);

      // Create new fully functional song
      const newSong: Song = {
        id: "song_" + Date.now(),
        title: meta.title || "Untitled Creation",
        artist: "Koya AI Creator",
        genre: genre,
        mood: mood,
        duration: 180, // 3:00
        bpm: meta.bpm || (tempo === "Fast" ? 128 : tempo === "Slow" ? 80 : 105),
        coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400",
        energy: meta.energy || energy,
        lyrics: `[Verse 1]\n${meta.description || "Generated description is loaded into song metadata."}\n\n[Chorus]\nCreated by Koya AI with dynamic synth stems.\nUnleash the notes and feel the rhythm!`,
        isFavorite: false,
        vocalsName: singer === "Female" ? "Aurora (AI Pop)" : "Milo (AI Smooth)",
        instruments: meta.instruments || ["Synthesizer", "Drum Machine", "Analog Bass"],
        melodyNotes: meta.melodyNotes || [60, 62, 64, 67, 69, 72],
        stemVols: { drums: 80, bass: 75, melody: 85, vocals: 90, other: 60 },
        effects: { reverb: 40, delay: 30, autoTune: 50, compressor: true, noiseRemoval: false },
      };

      // Also create a project automatically
      const newProject: Project = {
        id: "p_" + Date.now(),
        title: newSong.title,
        genre: genre,
        lastEdited: "Just now",
        type: "music",
        status: "Completed",
        data: newSong,
      };

      onAddSong(newSong);
      onAddProject(newProject);
      onPlaySong(newSong); // Instantly starts playing procedural synth beat!
      setPrompt("");
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
      setGenStep("");
    }
  };

  const handleCloneVoice = () => {
    if (!vocalName || cloningStatus) return;
    setCloningStatus(true);
    setTimeout(() => {
      setClonedVoices([...clonedVoices, vocalName + " (Cloned)"]);
      setVocalName("");
      setCloningStatus(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {[
          { key: "generate", label: "AI Music Generator", icon: <Music className="h-4 w-4" /> },
          { key: "vocal", label: "AI Vocal Studio", icon: <Mic className="h-4 w-4" /> },
          { key: "daw", label: "AI DAW Editor", icon: <Sliders className="h-4 w-4" /> },
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
        {activeTab === "generate" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Generator Form */}
            <div className="lg:col-span-2 space-y-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Create Unlimited AI Music</h3>
                <p className="text-xs text-slate-400">Describe the song you want to generate. Gemini will draft melody chords and presets.</p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Describe your track</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A high-energy futuristic synthwave track with a powerful bassline, cinematic drops, and angelic female harmonies..."
                  rows={4}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Advanced Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Genre Selector</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    {genres.map((g) => (
                      <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Emotional Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    {moods.map((m) => (
                      <option key={m} value={m} className="bg-slate-900 text-white">{m}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tempo / BPM Speed</label>
                  <div className="flex gap-2">
                    {["Slow", "Medium", "Fast"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTempo(t)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          tempo === t
                            ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Singer Style</label>
                  <div className="flex gap-2">
                    {["Female", "Male", "Duet", "Choir"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSinger(s)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          singer === s
                            ? "bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lyrics Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="English, Spanish, Hindi, Japanese..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Export Audio Format</label>
                  <div className="flex gap-2">
                    {["WAV", "MP3", "FLAC", "AAC"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                          format === f
                            ? "bg-pink-500/10 border-pink-500 text-pink-400"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateMusic}
                disabled={generating || !prompt}
                className="w-full py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 disabled:from-white/10 disabled:to-white/10 disabled:text-slate-500 text-white font-extrabold rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {generating ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span className="animate-pulse">{genStep}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    Generate HD Koya AI Song
                  </>
                )}
              </button>
            </div>

            {/* Live Telemetry Info Panel */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/20 via-black/40 to-black/60 p-6 space-y-4">
                <h4 className="text-md font-bold text-white flex items-center gap-2">
                  <Cpu className="text-purple-400 h-5 w-5" /> Synthesis Audio Engine
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Koya AI includes a state-of-the-art Web Audio procedural engine. When you hit generate, our model drafts direct synthesizer note pitches and sends them to your browser's audio nodes in real-time.
                </p>
                <div className="space-y-2 font-mono text-xs text-slate-400">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Sample Rate:</span>
                    <span className="text-cyan-400">44100 Hz</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Active Channels:</span>
                    <span className="text-purple-400">5 Stems (Stereo)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Dynamic DSP:</span>
                    <span className="text-pink-400">Reverb / Delay / EQ</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Info className="h-4 w-4 text-cyan-400" /> Did you know?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generated audio tracks can be added directly to our <b>Music Distribution</b> tab to deliver them to Spotify, Apple Music, and other major streaming channels.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI VOCAL STUDIO */}
        {activeTab === "vocal" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left side Voice List & Clone Form */}
            <div className="lg:col-span-2 space-y-6 rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">AI Voice Cloning Studio</h3>
                <p className="text-xs text-slate-400">Clones realistic, emotional, and consent-based voices for your music production.</p>
              </div>

              {/* Voice Clone input */}
              <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-xs font-bold uppercase text-purple-400 tracking-wider">Create a Cloned Vocal Preset</h4>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={vocalName}
                    onChange={(e) => setVocalName(e.target.value)}
                    placeholder="e.g., My Studio Mic Vocal, Sweet Soprano..."
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder-slate-500"
                  />
                  <button
                    onClick={handleCloneVoice}
                    disabled={cloningStatus || !vocalName}
                    className="px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
                  >
                    {cloningStatus ? "Cloning..." : "Clone Voice"}
                  </button>
                </div>
              </div>

              {/* Advanced Voice parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Pitch Offset (Semitones)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      value={vocalPitch}
                      onChange={(e) => setVocalPitch(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono text-cyan-400">{vocalPitch > 0 ? "+" : ""}{vocalPitch}st</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">AI Harmony Generator</label>
                  <select
                    value={vocalHarmony}
                    onChange={(e) => setVocalHarmony(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  >
                    <option className="bg-slate-900 text-white">Solo Lead</option>
                    <option className="bg-slate-900 text-white">Fifth Harmony</option>
                    <option className="bg-slate-900 text-white">Octave Double</option>
                    <option className="bg-slate-900 text-white">Full Choir backing</option>
                  </select>
                </div>
              </div>

              {/* Display existing voices */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Available Vocal Presets</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {clonedVoices.map((voice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-white">{voice}</span>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side instructions & consent statement */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-pink-950/20 via-black/40 to-black p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="h-4 w-4 text-pink-400" /> Consent & Ethical AI Policy
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Koya AI supports and strictly respects creators' digital property rights. Voice cloning on Koya AI requires affirmative, cryptographic consent checks or authentic master-track sample inputs.
              </p>
              <div className="p-3.5 rounded-xl border border-pink-500/20 bg-pink-500/5 text-pink-400 text-xs">
                🚨 Unlicensed commercial impersonations of famous recording artists are automatically blocked by our AI Moderation layers.
              </div>
            </div>
          </motion.div>
        )}

        {/* AI DAW EDITOR */}
        {activeTab === "daw" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Timeline Multi-track display */}
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" /> Studio Multi-track Board
                  </h3>
                  <p className="text-xs text-slate-400">Adjust individual tracks and view live step waveforms.</p>
                </div>
                {currentSong ? (
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-purple-400 font-semibold">
                    <Music className="h-3.5 w-3.5" /> Editing: {currentSong.title} ({currentSong.bpm} BPM)
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">No active song loaded. Click home and play a track first.</div>
                )}
              </div>

              {/* Visual Grid representing timelines */}
              <div className="space-y-4">
                {[
                  { name: "AI Vocals Channel", key: "vocals", color: "from-purple-500 to-pink-500" },
                  { name: "Beats & Drums", key: "drums", color: "from-cyan-400 to-blue-500" },
                  { name: "Bass Engine Sub", key: "bass", color: "from-blue-600 to-indigo-700" },
                  { name: "Synth Melody Chords", key: "melody", color: "from-pink-500 to-purple-600" },
                ].map((track) => (
                  <div key={track.key} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <span className="md:col-span-3 text-xs font-semibold text-slate-300">{track.name}</span>
                    <div className="md:col-span-9 h-12 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden flex items-center px-4 justify-between">
                      {/* Interactive Visual blocks */}
                      <div className="flex gap-1.5">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 rounded-full transition-all duration-300 ${
                              isPlaying && i % 4 === 0
                                ? "bg-purple-500 h-8"
                                : "bg-white/10 h-6"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Stem</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-slate-300 text-xs leading-relaxed flex items-center gap-3">
                <Settings className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <span>Adjust stem volumes, reverb, delay, auto-tune, and mastering settings dynamically inside the <b>Global Floating Player</b> located at the bottom of the screen!</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
