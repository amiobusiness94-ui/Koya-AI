/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Globe, Disc, Upload, Calendar, CheckCircle2, ShieldCheck, TrendingUp, DollarSign, Activity, Star, Users, Zap, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DistributionRelease, Song } from "../types";
import { DIST_PLATFORMS } from "../data";

interface DistributionFormProps {
  releases: DistributionRelease[];
  songs: Song[];
  onAddRelease: (release: DistributionRelease) => void;
  pricingPlan: string;
  onUpgradePlan: (plan: string) => void;
}

export default function DistributionForm({
  releases,
  songs,
  onAddRelease,
  pricingPlan,
  onUpgradePlan,
}: DistributionFormProps) {
  const [activeTab, setActiveTab] = useState<"releases" | "distribute" | "plans">("releases");

  // FORM STATE
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("Koya AI");
  const [genre, setGenre] = useState("EDM");
  const [releaseDate, setReleaseDate] = useState("2026-07-15");
  const [coverUrl, setCoverUrl] = useState("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Spotify", "Apple Music", "YouTube Music"]);
  const [copyrightDecl, setCopyrightDecl] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTogglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSelectAllPlatforms = () => {
    if (selectedPlatforms.length === DIST_PLATFORMS.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms([...DIST_PLATFORMS]);
    }
  };

  const handleSubmitRelease = () => {
    if (!songTitle || !artistName || !copyrightDecl || isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(() => {
      onAddRelease({
        id: "release_" + Date.now(),
        songTitle,
        artist: artistName,
        genre,
        releaseDate,
        coverUrl,
        platforms: selectedPlatforms,
        status: "Reviewing",
        copyrightDecl,
        streams: 0,
        earnings: 0,
      });

      setSongTitle("");
      setIsSubmitting(false);
      setActiveTab("releases");
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Sub tabs */}
      <div className="flex border-b border-white/10">
        {[
          { key: "releases", label: "My Distributed Tracks", icon: <Disc className="h-4 w-4" /> },
          { key: "distribute", label: "Submit New Release", icon: <Globe className="h-4 w-4" /> },
          { key: "plans", label: "Pricing & Plans", icon: <ShieldCheck className="h-4 w-4" /> },
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
        {/* RELEASES MONITOR TAB */}
        {activeTab === "releases" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Quick distribution report stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Global Streams</span>
                  <span className="text-2xl font-black text-white mt-1 block">764,000</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Royalty Earnings</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">₹24,500.00</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Active Release Tier</span>
                  <span className="text-2xl font-black text-cyan-400 mt-1 block">{pricingPlan} Plan</span>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Releases list */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-white uppercase tracking-wider text-slate-300">My Releases Catalog</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {releases.map((rel) => (
                  <div
                    key={rel.id}
                    className="p-5 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md flex gap-4"
                  >
                    <img src={rel.coverUrl} alt={rel.songTitle} className="w-24 h-24 rounded-2xl object-cover border border-white/10" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold text-white truncate max-w-[150px]">{rel.songTitle}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            rel.status === "Distributed" ? "bg-emerald-500/10 text-emerald-400" : "bg-cyan-500/10 text-cyan-400"
                          }`}>
                            {rel.status}
                          </span>
                        </div>
                        <p className="text-xs text-purple-400 font-semibold">{rel.artist} • {rel.genre}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Platforms: {rel.platforms.join(", ")}</p>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                        <span>Streams: {rel.streams.toLocaleString()}</span>
                        <span className="text-emerald-400">Royalty: ₹{rel.earnings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* DISTRIBUTE NEW SONG FORM TAB */}
        {activeTab === "distribute" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Form details */}
            <div className="lg:col-span-2 space-y-6 rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Distribute Worldwide</h3>
                <p className="text-xs text-slate-400">Fill in track metadata and select streaming platforms.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Song Title</label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="Enter track name"
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Primary Artist Name</label>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Enter artist name"
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Music Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  >
                    {["EDM", "LoFi", "Pop", "Rock", "Hip Hop", "Sad", "Cyberpunk"].map((g) => (
                      <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Release Date</label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Art select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cover Art Image URL</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button className="px-4 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-white/10">
                    <Upload className="h-4 w-4" /> Upload File
                  </button>
                </div>
              </div>

              {/* Checklist copyright */}
              <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={copyrightDecl}
                    onChange={(e) => setCopyrightDecl(e.target.checked)}
                    className="mt-1 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white block">Official Copyright Declaration</span>
                    <span className="text-[10px] text-slate-400 leading-normal block">
                      I declare that I hold full master recordings & visual copyrights for this release, or hold valid authorization to use and distribute these materials commercially on Koya AI.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit releases button */}
              <button
                onClick={handleSubmitRelease}
                disabled={!songTitle || !copyrightDecl || isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-400 disabled:from-white/10 disabled:to-white/10 disabled:text-slate-500 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Uploading files to IPFS & Distributor queues..." : "Submit Release for Review"}
              </button>
            </div>

            {/* Platforms checkboxes list */}
            <div className="space-y-4 rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Streaming Platforms</h4>
                <button onClick={handleSelectAllPlatforms} className="text-xs text-purple-400 hover:underline">
                  {selectedPlatforms.length === DIST_PLATFORMS.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {DIST_PLATFORMS.map((plat) => {
                  const isChecked = selectedPlatforms.includes(plat);
                  return (
                    <button
                      key={plat}
                      onClick={() => handleTogglePlatform(plat)}
                      className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-purple-500/10 border-purple-500 text-purple-400"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {plat}
                      {isChecked && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* PRICING PLANS TAB */}
        {activeTab === "plans" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Free Artist Plan */}
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
              {pricingPlan === "Artist" && (
                <div className="absolute top-4 right-4 text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                  Current Plan
                </div>
              )}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Standard Tier</span>
                <h3 className="text-2xl font-black text-white block">Artist Plan</h3>
                <div className="text-3xl font-black text-white">FREE</div>
                <p className="text-xs text-slate-400 leading-normal">Perfect for solo producers getting started with AI music creation and release.</p>
                
                <div className="space-y-3 pt-4 border-t border-white/5">
                  {[
                    "Unlimited Audio Releases",
                    "Unlimited Labels & Artists profile links",
                    "80% Royalty Share",
                    "Release delivery time 3–4 Business Days",
                    "YouTube Content ID Matching",
                    "WhatsApp Support response (48-72h)",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {pricingPlan !== "Artist" && (
                <button
                  onClick={() => onUpgradePlan("Artist")}
                  className="w-full py-3 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Downgrade to Artist Plan
                </button>
              )}
            </div>

            {/* Label Pro Plan */}
            <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-black/40 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
              {pricingPlan === "Label" && (
                <div className="absolute top-4 right-4 text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                  Current Plan
                </div>
              )}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-widest block">Professional Tier</span>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">BEST VALUE</span>
                </div>
                <h3 className="text-2xl font-black text-white block">Label Plan</h3>
                <div className="text-3xl font-black text-purple-400">₹999 <span className="text-xs font-normal text-slate-400">One-Time Payment</span></div>
                <p className="text-xs text-slate-400 leading-normal">Designed for commercial record labels, groups, and power producers.</p>
                
                <div className="space-y-3 pt-4 border-t border-white/5">
                  {[
                    "Provided to YouTube under custom Label Name",
                    "Fast Delivery Release (1–2 Business Days)",
                    "Priority Playlist pitching support",
                    "Dedicated support responses (under 24 hours)",
                    "80% Royalty Share",
                    "Official Artist Channel branding",
                    "Exclusive smart links marketing hub",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {pricingPlan !== "Label" && (
                <button
                  onClick={() => onUpgradePlan("Label")}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(168,85,247,0.3)]"
                >
                  Upgrade to Label Plan
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
