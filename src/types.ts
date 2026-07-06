/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  duration: number; // in seconds
  bpm: number;
  coverUrl: string;
  energy: number;
  lyrics: string;
  isFavorite: boolean;
  vocalsName: string;
  instruments: string[];
  melodyNotes: number[]; // MIDI notes (48 - 76) for synthesis
  stemVols: {
    drums: number;
    bass: number;
    melody: number;
    vocals: number;
    other: number;
  };
  effects: {
    reverb: number;
    delay: number;
    autoTune: number;
    compressor: boolean;
    noiseRemoval: boolean;
  };
}

export interface Project {
  id: string;
  title: string;
  genre: string;
  lastEdited: string;
  type: "music" | "lyrics" | "vocal" | "cover" | "video";
  status: "In Progress" | "Completed";
  data: any;
}

export interface WalletTransaction {
  id: string;
  platform: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  type: "royalty" | "withdrawal";
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  method: "UPI" | "Bank Transfer";
  destination: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface DistributionRelease {
  id: string;
  songTitle: string;
  artist: string;
  genre: string;
  releaseDate: string;
  coverUrl: string;
  platforms: string[];
  status: "Draft" | "Reviewing" | "Distributed";
  copyrightDecl: boolean;
  smartLink?: string;
  streams: number;
  earnings: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  role: "Artist" | "Label" | "Creator";
  content: string;
  likes: number;
  hasLiked: boolean;
  comments: number;
  timestamp: string;
  songTitle?: string;
  genre?: string;
  audioUrl?: string;
}

export interface Ticket {
  id: string;
  user: string;
  subject: string;
  message: string;
  status: "Open" | "Resolved" | "In Progress";
  priority: "High" | "Medium" | "Low";
  date: string;
}

export interface AdminStats {
  usersCount: number;
  artistsCount: number;
  labelsCount: number;
  totalDistributed: number;
  systemCpu: number;
  systemMem: number;
  apiRequests: number;
  pendingWithdrawals: number;
}
