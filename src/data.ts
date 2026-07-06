/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Song, Project, CommunityPost, AdminStats, DistributionRelease, WalletTransaction, Ticket } from "./types";

export const INITIAL_SONGS: Song[] = [
  {
    id: "1",
    title: "Endless Dreams",
    artist: "Koya AI",
    genre: "EDM",
    mood: "Happy",
    duration: 225, // 3:45
    bpm: 128,
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400",
    energy: 92,
    lyrics: `[Verse 1]\nNeon horizons start to fade\nWe walk the street that circuits made\nUnder the light of cyan skies\nI see tomorrow in your eyes\n\n[Chorus]\nOh, endless dreams, we run so far\nBeneath the cyber-glowing star\nUnleash the speed, we break the chains\nElectronic pulse is in our veins!`,
    isFavorite: true,
    vocalsName: "Aurora (Pop Soprano)",
    instruments: ["Lead Synth", "Sub Bass", "Cyber Drums", "Arpeggiator"],
    melodyNotes: [60, 64, 67, 71, 72, 76],
    stemVols: { drums: 80, bass: 75, melody: 85, vocals: 90, other: 60 },
    effects: { reverb: 40, delay: 30, autoTune: 50, compressor: true, noiseRemoval: false },
  },
  {
    id: "2",
    title: "Falling Stars",
    artist: "Koya AI",
    genre: "LoFi",
    mood: "Relaxed",
    duration: 161, // 2:41
    bpm: 80,
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400",
    energy: 35,
    lyrics: `[Verse 1]\nRaindrops tapping on the glass\nWondering if this storm will pass\nA cup of tea, a quiet room\nChasing away the winter gloom\n\n[Chorus]\nFalling stars across the night\nSoftly guide us with their light\nTake your time, let worries go\nMoving gentle, moving slow`,
    isFavorite: false,
    vocalsName: "Milo (LoFi Warm)",
    instruments: ["Fender Rhodes", "Acoustic Kick", "Vinyl Crackle", "Muted Bass"],
    melodyNotes: [57, 60, 62, 64, 67, 69],
    stemVols: { drums: 60, bass: 70, melody: 75, vocals: 80, other: 50 },
    effects: { reverb: 70, delay: 20, autoTune: 10, compressor: false, noiseRemoval: true },
  },
  {
    id: "3",
    title: "Echoes of Love",
    artist: "Koya AI",
    genre: "Pop",
    mood: "Romantic",
    duration: 238, // 3:58
    bpm: 105,
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400",
    energy: 72,
    lyrics: `[Verse 1]\nHeartbeat echoes in the dark\nEvery whisper leaves a spark\nSince the moment you arrived\nEvery feeling has survived\n\n[Chorus]\nThese are the echoes of our love\nHands reaching for the stars above\nNo matter where the path may bend\nI will hold you till the end`,
    isFavorite: true,
    vocalsName: "Seraphina (Silky Vocal)",
    instruments: ["Grand Piano", "Groove Bass", "Snap Drums", "Strings"],
    melodyNotes: [60, 62, 64, 67, 69, 72],
    stemVols: { drums: 75, bass: 80, melody: 70, vocals: 95, other: 65 },
    effects: { reverb: 50, delay: 40, autoTune: 35, compressor: true, noiseRemoval: true },
  },
  {
    id: "4",
    title: "Night Drive",
    artist: "Koya AI",
    genre: "Cyberpunk",
    mood: "Dark",
    duration: 210, // 3:30
    bpm: 110,
    coverUrl: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80&w=400",
    energy: 80,
    lyrics: `[Verse 1]\nChrome and shadows on the street\nHeavy engine, steady beat\nAccelerating through the grid\nKeeping all our secrets hid\n\n[Chorus]\nOn this night drive we are free\nPast the glass and neon sea\nNo destination, just the flight\nDisappearing in the night`,
    isFavorite: false,
    vocalsName: "Vector (Vocoder Robot)",
    instruments: ["Moog Bass", "Analog Drums", "Arpeggiated Synth", "Pad FX"],
    melodyNotes: [48, 51, 53, 55, 58, 60],
    stemVols: { drums: 85, bass: 90, melody: 75, vocals: 70, other: 55 },
    effects: { reverb: 30, delay: 50, autoTune: 80, compressor: true, noiseRemoval: false },
  },
  {
    id: "5",
    title: "Lost in You",
    artist: "Koya AI",
    genre: "Sad",
    mood: "Melancholic",
    duration: 250, // 4:10
    bpm: 90,
    coverUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400",
    energy: 45,
    lyrics: `[Verse 1]\nSilence speaking in this room\nGolden shadows fade to gloom\nCounting hours as they pass\nShattered memories like glass\n\n[Chorus]\nI get so lost, so lost in you\nSearching for what we once knew\nBut the colors wash away\nLeaving only shades of gray`,
    isFavorite: false,
    vocalsName: "Evelyn (Ethereal Alto)",
    instruments: ["Acoustic Guitar", "Ambient Reverb Pad", "Soft Percussion"],
    melodyNotes: [57, 59, 60, 62, 64, 67],
    stemVols: { drums: 40, bass: 60, melody: 80, vocals: 90, other: 70 },
    effects: { reverb: 85, delay: 15, autoTune: 20, compressor: false, noiseRemoval: true },
  },
  {
    id: "6",
    title: "Immortal",
    artist: "Koya AI",
    genre: "Rock",
    mood: "Angry",
    duration: 222, // 3:42
    bpm: 115,
    coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80&w=400",
    energy: 88,
    lyrics: `[Verse 1]\nThunder shaking at the gate\nWe refuse to accept our fate\nRaise the banners, strike the drum\nLet them see what we've become\n\n[Chorus]\nWe are immortal, we stand tall\nWatch the ancient empires fall\nWith the fire in our eyes\nWe will conquer all the skies!`,
    isFavorite: false,
    vocalsName: "Jax (Rock Tenor)",
    instruments: ["Distorted Guitar", "Hard Rock Drums", "Heavy Bass"],
    melodyNotes: [52, 55, 57, 59, 62, 64],
    stemVols: { drums: 90, bass: 85, melody: 80, vocals: 85, other: 50 },
    effects: { reverb: 30, delay: 25, autoTune: 5, compressor: true, noiseRemoval: false },
  },
];

export const FEATURED_ARTISTS = [
  { name: "Koya AI", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150", followers: "125.4K", genre: "AI Fusion" },
  { name: "HoloVibe", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", followers: "84.2K", genre: "Synthwave" },
  { name: "DJ Aurora", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", followers: "310.8K", genre: "Future Bass" },
  { name: "Lofi Kitten", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150", followers: "192.5K", genre: "Chill Hop" },
];

export const POPULAR_GENRES = [
  { name: "EDM", count: "12,421 songs", icon: "Zap" },
  { name: "LoFi", count: "9,850 songs", icon: "Coffee" },
  { name: "Pop", count: "15,820 songs", icon: "Flame" },
  { name: "Hip Hop", count: "18,910 songs", icon: "Music" },
  { name: "Rock", count: "6,412 songs", icon: "Guitar" },
  { name: "Cyberpunk", count: "4,124 songs", icon: "Cpu" },
];

export const INITIAL_PROJECTS: Project[] = [
  { id: "p1", title: "Midnight Session", genre: "EDM", lastEdited: "2 hours ago", type: "music", status: "In Progress", data: {} },
  { id: "p2", title: "Retro Wave Lyrics", genre: "Synthwave", lastEdited: "Yesterday", type: "lyrics", status: "Completed", data: {} },
  { id: "p3", title: "Cyber Vocal Cloning", genre: "Pop", lastEdited: "3 days ago", type: "vocal", status: "In Progress", data: {} },
  { id: "p4", title: "Space Journey Artwork", genre: "Space Ambient", lastEdited: "1 week ago", type: "cover", status: "Completed", data: {} },
];

export const COMMUNITY_FEED: CommunityPost[] = [
  {
    id: "post1",
    author: "Zane_Matrix",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    role: "Artist",
    content: "Just generated this awesome new EDM track using Koya AI's custom melody-notes seed. The bass energy is absolutely insane! Let me know what you guys think of the vocals. 🔥🔊",
    likes: 142,
    hasLiked: false,
    comments: 24,
    timestamp: "10 mins ago",
    songTitle: "Endless Dreams",
    genre: "EDM",
    audioUrl: "1",
  },
  {
    id: "post2",
    author: "Lofi_Vibes_Only",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    role: "Creator",
    content: "Used the lyrics generator in French for my next Chillhop single. The metaphors Gemini 3.5 generated are deep! Merging it with vocal preset 'Milo' now.",
    likes: 98,
    hasLiked: true,
    comments: 11,
    timestamp: "1 hour ago",
  },
  {
    id: "post3",
    author: "Universal_Records_Label",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    role: "Label",
    content: "We just submitted 5 new singles for worldwide distribution via Koya AI! The analytics dashboard has been extremely accurate, especially for Apple Music & Spotify royalty tracking.",
    likes: 215,
    hasLiked: false,
    comments: 38,
    timestamp: "4 hours ago",
  },
];

export const INITIAL_RELEASES: DistributionRelease[] = [
  {
    id: "r1",
    songTitle: "Endless Dreams",
    artist: "Koya AI",
    genre: "EDM",
    releaseDate: "2026-07-10",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400",
    platforms: ["Spotify", "Apple Music", "YouTube Music", "TIDAL", "SoundCloud"],
    status: "Distributed",
    copyrightDecl: true,
    smartLink: "https://koya.ai/share/endless-dreams",
    streams: 452000,
    earnings: 1450.5,
  },
  {
    id: "r2",
    songTitle: "Falling Stars",
    artist: "Koya AI",
    genre: "LoFi",
    releaseDate: "2026-07-12",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400",
    platforms: ["Spotify", "Apple Music", "YouTube Music", "Deezer", "Audiomack"],
    status: "Distributed",
    copyrightDecl: true,
    smartLink: "https://koya.ai/share/falling-stars",
    streams: 312000,
    earnings: 985.2,
  },
  {
    id: "r3",
    songTitle: "Echoes of Love",
    artist: "Koya AI",
    genre: "Pop",
    releaseDate: "2026-07-20",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400",
    platforms: ["Spotify", "Apple Music", "YouTube Music", "Amazon Music", "JioSaavn", "Gaana"],
    status: "Reviewing",
    copyrightDecl: true,
    streams: 0,
    earnings: 0,
  },
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  { id: "tx1", platform: "Spotify Royalties", amount: 1450.5, date: "2026-07-01", status: "Completed", type: "royalty" },
  { id: "tx2", platform: "Apple Music Royalties", amount: 985.2, date: "2026-07-02", status: "Completed", type: "royalty" },
  { id: "tx3", platform: "YouTube Music Royalties", amount: 620.4, date: "2026-07-03", status: "Completed", type: "royalty" },
  { id: "tx4", platform: "Withdrawal to UPI", amount: -1500.0, date: "2026-07-04", status: "Completed", type: "withdrawal" },
];

export const ADMIN_TICKETS: Ticket[] = [
  { id: "t1", user: "Zane_Matrix", subject: "Spotify Profile Linking", message: "Hey support, can you link my official Spotify profile with my Koya AI distributor profile? My artist URI is spotify:artist:29837.", status: "Open", priority: "Medium", date: "2026-07-05" },
  { id: "t2", user: "SpeedyRecords", subject: "GST Invoice request", message: "We bought the Label Plan (₹999) and need the GST invoice for tax declarations. Here is our GSTIN: 27AAAAA1111A1Z1.", status: "In Progress", priority: "Low", date: "2026-07-04" },
  { id: "t3", user: "BeatMaker99", subject: "Content ID Claim dispute", message: "One of our beats was claimed by another distributor by mistake. Here is the metadata, we have full copyrights.", status: "Open", priority: "High", date: "2026-07-06" },
];

export const DIST_PLATFORMS = [
  "Spotify", "Apple Music", "YouTube Music", "Amazon Music", "Deezer", "TIDAL", "SoundCloud", "Audiomack", "Boomplay", "JioSaavn", "Gaana", "Hungama Music"
];
