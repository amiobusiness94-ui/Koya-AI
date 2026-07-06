/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, Shield, Bell, Globe, CreditCard, Trash2, ShieldAlert, Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";

interface SettingsViewProps {
  pricingPlan: string;
}

export default function SettingsView({ pricingPlan }: SettingsViewProps) {
  const [username, setUsername] = useState("amiobusiness94");
  const [email, setEmail] = useState("amiobusiness94@gmail.com");
  const [lang, setLang] = useState("English");
  const [notifSound, setNotifSound] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-white">System Settings</h2>
        <p className="text-xs text-slate-400">Configure your Koya AI profile credentials, security keys, and alert preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation / Side lists */}
        <div className="space-y-3">
          {[
            { label: "My Profile", icon: <User className="h-4 w-4 text-purple-400" /> },
            { label: "Sign-in Security", icon: <Shield className="h-4 w-4 text-cyan-400" /> },
            { label: "Notifications", icon: <Bell className="h-4 w-4 text-pink-400" /> },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                idx === 0
                  ? "bg-purple-500/10 border-purple-500/30 text-white"
                  : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>

        {/* Configurations Details forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Profile Specifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Associated Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-cyan-400" /> Active Subscription
            </h4>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
              <div>
                <span className="text-xs font-bold text-white block">Koya {pricingPlan} Member Tier</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Renewable automatically. Worldwide distribution unlocked.</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest">{pricingPlan}</span>
              </div>
            </div>
          </div>

          {/* Alerts Toggles */}
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">System Notification Alerts</h4>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-200 block">Email Royalty Invoices</span>
                  <span className="text-[10px] text-slate-500 block">Recieve a weekly report containing Spotify & Apple streams royalties.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-200 block">Push Live Release Updates</span>
                  <span className="text-[10px] text-slate-500 block">Get notified immediately when your track is live in stores.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPush}
                  onChange={(e) => setNotifPush(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
              </label>
            </div>
          </div>

          {/* Danger zone delete */}
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Account Safety Gate
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Deleting your Koya AI profile is irreversible. All distributed audio tracks, pending royalties, smart links, and lyrics histories will be permanently scrubbed.
            </p>

            {deleteConfirm ? (
              <div className="flex gap-4">
                <button
                  onClick={() => alert("Account deleted! (Demo mock reset)")}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Yes, Delete Permanently
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 border border-white/10 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="py-2 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all"
              >
                Request Permanent Deletion
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
