/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TrendingUp, DollarSign, Wallet, Users, Globe, ExternalLink, Settings, ArrowUpRight, Activity, ShieldCheck, Server, Send, Ban, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Song, WalletTransaction, WithdrawalRequest, Ticket, AdminStats } from "../types";
import { INITIAL_TRANSACTIONS, ADMIN_TICKETS } from "../data";

interface ArtistDashboardProps {
  songs: Song[];
  transactions: WalletTransaction[];
  withdrawals: WithdrawalRequest[];
  tickets: Ticket[];
  onAddWithdrawal: (req: WithdrawalRequest) => void;
  onAddTransaction: (tx: WalletTransaction) => void;
  onResolveTicket: (id: string) => void;
  onApproveWithdrawal: (id: string) => void;
}

export default function ArtistDashboard({
  songs,
  transactions,
  withdrawals,
  tickets,
  onAddWithdrawal,
  onAddTransaction,
  onResolveTicket,
  onApproveWithdrawal,
}: ArtistDashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "wallet" | "admin">("dashboard");

  // WALLET WITHDRAW FORM STATE
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<"UPI" | "Bank Transfer">("UPI");
  const [withdrawDest, setWithdrawDest] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // ADMIN STATE
  const [adminStats, setAdminStats] = useState<AdminStats>({
    usersCount: 1420,
    artistsCount: 310,
    labelsCount: 24,
    totalDistributed: 764,
    systemCpu: 42,
    systemMem: 68,
    apiRequests: 2480,
    pendingWithdrawals: withdrawals.filter(w => w.status === "Pending").length,
  });

  const availableBalance = 18250;
  const pendingBalance = 6250;

  // Custom Inline SVG Line Chart Data Points (Jan - Jun)
  const chartPoints = [20, 45, 30, 80, 65, 95];
  const chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > availableBalance) return;

    const newRequest: WithdrawalRequest = {
      id: "withdraw_" + Date.now(),
      amount: amt,
      method: withdrawMethod,
      destination: withdrawDest,
      date: "2026-07-06",
      status: "Pending",
    };

    onAddWithdrawal(newRequest);

    // Record pending transaction
    onAddTransaction({
      id: "tx_" + Date.now(),
      platform: `Withdrawal via ${withdrawMethod}`,
      amount: -amt,
      date: "2026-07-06",
      status: "Pending",
      type: "withdrawal",
    });

    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawAmount("");
      setWithdrawDest("");
      setWithdrawSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Tab Selectors */}
      <div className="flex border-b border-white/10">
        {[
          { key: "dashboard", label: "Artist Dashboard", icon: <Users className="h-4 w-4" /> },
          { key: "wallet", label: "Koya Wallet", icon: <Wallet className="h-4 w-4" /> },
          { key: "admin", label: "Koya Administration", icon: <Server className="h-4 w-4" /> },
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
        {/* ARTIST DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Stats Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Streams", val: "1.25M", sub: "+12.5% this month", icon: <TrendingUp className="text-cyan-400" /> },
                { label: "Monthly Revenue", val: "₹24,500", sub: "+8.3% this month", icon: <DollarSign className="text-emerald-400" /> },
                { label: "Verified Followers", val: "12.5K", sub: "+450 new fans", icon: <Users className="text-purple-400" /> },
                { label: "Dist. Countries", val: "120", sub: "Worldwide reach", icon: <Globe className="text-pink-400" /> },
              ].map((card, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-black text-white">{card.val}</h3>
                  <span className="text-[10px] text-slate-400">{card.sub}</span>
                </div>
              ))}
            </div>

            {/* Custom Responsive SVG Chart & Top Songs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Custom SVG Line Chart */}
              <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Revenue Stream Timeline</h4>
                  <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                    Jan - June (INR)
                  </span>
                </div>

                {/* Inline SVG Chart */}
                <div className="w-full h-48 bg-white/5 rounded-2xl relative overflow-hidden flex flex-col justify-end p-2">
                  <svg className="w-full h-32 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient Fill under path */}
                    <path
                      d="M 0 100 L 0 80 Q 100 55 100 55 Q 200 70 200 70 Q 300 20 300 20 Q 400 35 400 35 Q 500 5 500 5 L 500 100 Z"
                      fill="url(#chartGrad)"
                    />

                    {/* Main Line path */}
                    <path
                      d="M 0 80 Q 100 55 100 55 Q 200 70 200 70 Q 300 20 300 20 Q 400 35 400 35 Q 500 5 500 5"
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>

                    {/* Dots representing points */}
                    <circle cx="0" cy="80" r="4.5" fill="#a855f7" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="100" cy="55" r="4.5" fill="#a855f7" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="200" cy="70" r="4.5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="300" cy="20" r="4.5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="400" cy="35" r="4.5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="500" cy="5" r="4.5" fill="#ec4899" stroke="#fff" strokeWidth="1.5" />
                  </svg>

                  {/* Horizontal months axis */}
                  <div className="flex justify-between px-2 pt-2 border-t border-white/5 text-[10px] text-slate-500 font-semibold">
                    {chartMonths.map((m, i) => (
                      <span key={i}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Songs */}
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">My Top Tracks</h4>
                <div className="space-y-3">
                  {songs.slice(0, 3).map((song, i) => (
                    <div key={song.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-400">#{i + 1}</span>
                        <div>
                          <h5 className="text-xs font-bold text-white">{song.title}</h5>
                          <span className="text-[10px] text-slate-500">{song.genre}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{(342100 - i * 110000).toLocaleString()} st</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Links & Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Artist Smart Links</h4>
                <p className="text-xs text-slate-400">Share your album with a single landing link redirecting listeners to Spotify, Apple, Deezer, etc.</p>
                
                <div className="space-y-3">
                  {[
                    { title: "Endless Dreams Single Link", link: "https://koya.ai/share/endless-dreams" },
                    { title: "Falling Stars Chill Mix", link: "https://koya.ai/share/falling-stars" },
                  ].map((sl, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                      <span className="text-slate-300 font-semibold">{sl.title}</span>
                      <a href={sl.link} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 font-mono">
                        Link <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile verification */}
              <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/10 to-black/30 p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-purple-400" /> Koya Verified Artist Profile
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    Submit your ID and link your official music channels (Spotify Creator, YouTube OAC) to get the blue badge. Verifications are audited within 48 business hours.
                  </p>
                </div>
                <button className="py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all">
                  Apply for Verification Blue Badge
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* WALLET TAB */}
        {activeTab === "wallet" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Balance Display & Withdraw form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balances */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl border border-white/10 bg-black/40">
                  <span className="text-xs text-slate-400 font-semibold">Available Balance</span>
                  <div className="text-3xl font-black text-white mt-1">₹{availableBalance.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                    Ready to withdraw immediately
                  </span>
                </div>

                <div className="p-6 rounded-3xl border border-white/10 bg-black/40">
                  <span className="text-xs text-slate-400 font-semibold">Pending Balance</span>
                  <div className="text-3xl font-black text-slate-400 mt-1">₹{pendingBalance.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-2">
                    Depositing on 15th July (Next Cycle)
                  </span>
                </div>
              </div>

              {/* Withdraw Form */}
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-purple-400" /> Withdraw Earnings
                </h4>

                {withdrawSuccess ? (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs text-center">
                    🎉 Withdrawal request filed successfully! Processing via {withdrawMethod}.
                  </div>
                ) : (
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400">Withdraw Amount (INR)</label>
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          max={availableBalance}
                          placeholder="e.g., 5000"
                          className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-400">Payment Gateway</label>
                        <select
                          value={withdrawMethod}
                          onChange={(e) => setWithdrawMethod(e.target.value as any)}
                          className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                        >
                          <option value="UPI" className="bg-slate-900 text-white">Google Pay / PhonePe (UPI)</option>
                          <option value="Bank Transfer" className="bg-slate-900 text-white">Direct Bank NEFT/IMPS</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">
                        {withdrawMethod === "UPI" ? "UPI ID" : "Bank Account details (IFS Code, Account Number)"}
                      </label>
                      <input
                        type="text"
                        value={withdrawDest}
                        onChange={(e) => setWithdrawDest(e.target.value)}
                        placeholder={withdrawMethod === "UPI" ? "e.g., amio@okaxis" : "e.g., Account: 9182039801, IFSC: HDFC0001"}
                        className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Process Withdrawal
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Transaction Ledger */}
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Transaction History</h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                    <div>
                      <h5 className="font-bold text-white">{tx.platform}</h5>
                      <span className="text-[10px] text-slate-500">{tx.date}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold ${tx.amount > 0 ? "text-emerald-400" : "text-pink-400"}`}>
                        {tx.amount > 0 ? "+" : ""}₹{tx.amount.toLocaleString()}
                      </span>
                      <span className="text-[9px] block text-slate-500">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* KOYA ADMIN TAB */}
        {activeTab === "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* System Status telemetry grids */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold uppercase">
                  <span>Server Node CPU</span>
                  <span className="text-cyan-400 font-mono">{adminStats.systemCpu}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${adminStats.systemCpu}%` }} />
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold uppercase">
                  <span>Docker Containers Memory</span>
                  <span className="text-purple-400 font-mono">{adminStats.systemMem}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${adminStats.systemMem}%` }} />
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold uppercase">
                  <span>Gemini API Rate limits</span>
                  <span className="text-pink-400 font-mono">{adminStats.apiRequests} reqs</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-400 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
            </div>

            {/* Withdraw Queue & Support Tickets moderation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Withdrawal Queue */}
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Distribution Withdrawal Queue</h4>
                <div className="space-y-3">
                  {withdrawals.length > 0 ? (
                    withdrawals.map((req) => (
                      <div key={req.id} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                        <div>
                          <span className="font-bold text-white block">₹{req.amount.toLocaleString()} ({req.method})</span>
                          <span className="text-[10px] text-slate-400 font-mono">Dest: {req.destination}</span>
                        </div>
                        {req.status === "Pending" ? (
                          <button
                            onClick={() => onApproveWithdrawal(req.id)}
                            className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" /> Approved
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-6">No pending withdrawals in queue.</div>
                  )}
                </div>
              </div>

              {/* Moderation Tickets */}
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Artist Helpdesk Tickets</h4>
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-white block">{t.subject}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">User: {t.user} • Priority: {t.priority}</span>
                        </div>
                        {t.status === "Open" ? (
                          <button
                            onClick={() => onResolveTicket(t.id)}
                            className="px-3 py-1 border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white text-[10px] font-bold rounded-lg transition-all"
                          >
                            Resolve
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{t.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
