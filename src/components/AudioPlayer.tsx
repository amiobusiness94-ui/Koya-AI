/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, RefreshCw, Shuffle, Sliders, ChevronUp, ChevronDown, Sparkles, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Song } from "../types";
import { synthEngine } from "../utils/synth";

interface AudioPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFavorite: (id: string) => void;
  onUpdateSongVols: (id: string, vols: Song["stemVols"]) => void;
  onUpdateSongEffects: (id: string, fx: Song["effects"]) => void;
}

export default function AudioPlayer({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onToggleFavorite,
  onUpdateSongVols,
  onUpdateSongEffects,
}: AudioPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [vols, setVols] = useState<Song["stemVols"]>({ drums: 80, bass: 75, melody: 85, vocals: 90, other: 60 });
  const [effects, setEffects] = useState<Song["effects"]>({ reverb: 40, delay: 30, autoTune: 50, compressor: true, noiseRemoval: false });

  const progressInterval = useRef<any>(null);

  useEffect(() => {
    if (currentSong) {
      setVols(currentSong.stemVols);
      setEffects(currentSong.effects);
    }
  }, [currentSong]);

  // Handle synth playback and progress simulation
  useEffect(() => {
    if (isPlaying && currentSong) {
      // Start Synth Engine
      synthEngine.play(currentSong, (step) => {
        setCurrentStep(step);
      });

      // Simulate timeline progress
      progressInterval.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= currentSong.duration) {
            onNext(); // Auto next
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      synthEngine.stop();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      synthEngine.stop();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentSong]);

  // Reset elapsed on song change
  useEffect(() => {
    setElapsed(0);
    setCurrentStep(0);
  }, [currentSong]);

  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = (elapsed / currentSong.duration) * 100;

  const handleVolChange = (key: keyof Song["stemVols"], val: number) => {
    const updatedVols = { ...vols, [key]: val };
    setVols(updatedVols);
    onUpdateSongVols(currentSong.id, updatedVols);
    synthEngine.updateStemVolumes(updatedVols);
  };

  const handleEffectChange = (key: keyof Song["effects"], val: any) => {
    const updatedEffects = { ...effects, [key]: val };
    setEffects(updatedEffects);
    onUpdateSongEffects(currentSong.id, updatedEffects);
    synthEngine.updateEffects(updatedEffects);
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 md:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-black/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300">
        
        {/* Expanded Mixer / Studio View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-b border-white/10 px-6 py-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stem Mixer */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
                    <Sliders className="h-4 w-4" /> Multitrack Stem Mixer
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: "vocals", label: "AI Vocals", color: "bg-purple-500" },
                      { key: "drums", label: "Drums & Beats", color: "bg-cyan-500" },
                      { key: "bass", label: "Bass Engine", color: "bg-blue-500" },
                      { key: "melody", label: "Synths & Melodies", color: "bg-pink-500" },
                      { key: "other", label: "Atmosphere & SFX", color: "bg-emerald-500" },
                    ].map((stem) => (
                      <div key={stem.key} className="flex items-center gap-4">
                        <span className="w-28 text-xs text-slate-300">{stem.label}</span>
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden group">
                          <div
                            className={`h-full ${stem.color} rounded-full`}
                            style={{ width: `${(vols as any)[stem.key]}%` }}
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={(vols as any)[stem.key]}
                            onChange={(e) => handleVolChange(stem.key as any, parseInt(e.target.value))}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <span className="w-8 text-right text-xs font-mono text-slate-400">
                          {(vols as any)[stem.key]}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Studio FX & Master FX */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> AI DSP Mastering Suite
                  </h3>
                  <div className="space-y-4">
                    {/* Reverb */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Space Reverb (Decay)</span>
                        <span className="text-cyan-400 font-mono">{effects.reverb}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${effects.reverb}%` }} />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={effects.reverb}
                          onChange={(e) => handleEffectChange("reverb", parseInt(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Delay */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Stereo Echo Delay</span>
                        <span className="text-pink-400 font-mono">{effects.delay}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${effects.delay}%` }} />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={effects.delay}
                          onChange={(e) => handleEffectChange("delay", parseInt(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Auto-tune */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Auto-Tune Correction</span>
                        <span className="text-purple-400 font-mono">{effects.autoTune}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${effects.autoTune}%` }} />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={effects.autoTune}
                          onChange={(e) => handleEffectChange("autoTune", parseInt(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Switches */}
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={effects.compressor}
                          onChange={(e) => handleEffectChange("compressor", e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
                        />
                        Limit Compressor
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={effects.noiseRemoval}
                          onChange={(e) => handleEffectChange("noiseRemoval", e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
                        />
                        Noise Isolation
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Player View */}
        <div className="flex flex-col md:flex-row items-center gap-4 px-6 py-4 justify-between">
          
          {/* Cover & Title */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="h-12 w-12 rounded-lg object-cover border border-white/10 shadow-lg"
            />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white truncate max-w-[180px]">{currentSong.title}</h4>
              <p className="text-xs text-purple-400 font-medium truncate flex items-center gap-1">
                <Music className="h-3 w-3" /> {currentSong.artist} • {currentSong.vocalsName}
              </p>
            </div>
            <button
              onClick={() => onToggleFavorite(currentSong.id)}
              className="text-slate-400 hover:text-pink-500 transition-colors p-2 md:hidden"
            >
              <Heart className={`h-5 w-5 ${currentSong.isFavorite ? "fill-pink-500 text-pink-500" : ""}`} />
            </button>
          </div>

          {/* Player controls & Waveform */}
          <div className="flex flex-col items-center gap-2 flex-1 w-full max-w-lg">
            {/* Waveform Visualization */}
            <div className="flex items-center justify-between gap-1 w-full h-8 px-2 overflow-hidden">
              {Array.from({ length: 36 }).map((_, i) => {
                // Waveform bounces dynamically when playing
                const stepMultiplier = currentStep === i % 16 ? 1.8 : 0.8;
                const randomHeight = isPlaying
                  ? Math.sin(i * 0.3 + currentStep * 0.5) * 12 + 16
                  : 4;
                const heightVal = Math.max(4, Math.min(32, randomHeight * stepMultiplier));
                const isPast = i / 36 <= progressPercent / 100;

                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isPast ? "bg-cyan-400" : "bg-white/20"
                    }`}
                    style={{ height: `${heightVal}px` }}
                  />
                );
              })}
            </div>

            {/* Timings and slider */}
            <div className="flex items-center gap-3 w-full text-xs font-mono text-slate-400">
              <span>{formatTime(elapsed)}</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${progressPercent}%` }} />
              </div>
              <span>{formatTime(currentSong.duration)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
            <div className="flex items-center gap-2">
              <button onClick={onPrev} className="text-slate-300 hover:text-white p-2 transition-colors">
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={onPlayPause}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 transition-transform active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white translate-x-0.5" />}
              </button>
              <button onClick={onNext} className="text-slate-300 hover:text-white p-2 transition-colors">
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(currentSong.id)}
                className="hidden md:block text-slate-300 hover:text-pink-500 transition-colors p-2"
              >
                <Heart className={`h-5 w-5 ${currentSong.isFavorite ? "fill-pink-500 text-pink-500" : ""}`} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`text-slate-300 hover:text-purple-400 p-2 rounded-lg border border-white/5 bg-white/5 transition-all ${
                  isExpanded ? "text-purple-400 border-purple-500/30" : ""
                }`}
                title="Studio Mixer"
              >
                {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
