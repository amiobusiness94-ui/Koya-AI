import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Initialize Gemini client with proper configuration and User-Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined. AI features will fallback to simulated values.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiConfigured: !!ai });
  });

  // API: Generate Lyrics
  app.post("/api/generate-lyrics", async (req: any, res: any) => {
    const { prompt, genre, language, songType, theme, mood, verseCount, chorusCount } = req.body;

    if (!ai) {
      return res.json({
        lyrics: `[Verse 1]\nWalking down the neon streets (Simulated)\nFeeling the electronic beats\nKoya AI is in the air\nSynthesizers everywhere\n\n[Chorus]\nOh neon light, shine so bright\nWe are generating songs tonight\nUnleash the beats, feel the bass\nIn this cosmic digital space\n\n[Verse 2]\nLyrics flowing in ${language || "English"}\nMaking music we cherish\nWith the modern glassmorphic style\nMake every listener smile\n\n[Outro]\nDigital echoes fading out...\n`,
        title: "Neon Echoes (Offline Demo)",
      });
    }

    try {
      const model = "gemini-3.5-flash";
      const systemInstruction = `You are a professional songwriting AI assistant for Koya AI. Generate premium, high-quality, structured song lyrics in ${language || "English"}. Format the output with clear sections like [Verse 1], [Chorus], [Verse 2], [Bridge], etc. Match the theme: ${theme || "universal"}, genre: ${genre || "Pop"}, mood: ${mood || "energetic"}.`;

      const response = await ai.models.generateContent({
        model,
        contents: `Create structured lyrics about: "${prompt || "a futuristic music revolution"}".
Song Type: ${songType || "Pop"}
Theme / Mood: ${theme || "Modern"} / ${mood || "Happy"}
Include about ${verseCount || 2} verses, ${chorusCount || 1} chorus, and an outro. Keep the phrasing extremely musical and premium.`,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const lyrics = response.text || "Failed to generate lyrics. Try again.";
      res.json({ lyrics });
    } catch (error: any) {
      console.error("Lyrics generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate lyrics" });
    }
  });

  // API: Generate Song Metadata and Synthesis Parameters
  app.post("/api/generate-song-meta", async (req: any, res: any) => {
    const { prompt, genre, mood, language, tempo, singer, instruments } = req.body;

    if (!ai) {
      // Return beautiful structured simulated data
      return res.json({
        title: prompt ? `${prompt.substring(0, 20)} Jam` : "Cyber Resonance",
        description: `A stellar ${genre || "EDM"} track full of ${mood || "happy"} vibes, featuring elegant synthesizers and ${singer || "Female"} vocals.`,
        energy: 85,
        bpm: tempo === "Fast" ? 128 : tempo === "Slow" ? 85 : 105,
        vocalTone: "Satin Warm with Air Reverb",
        instruments: ["Synthesizer", "Drum Machine", "Sub Bass"],
        melodyNotes: [60, 63, 65, 67, 70, 72], // pentatonic for synthesis
        structure: [
          { name: "Intro", duration: 15 },
          { name: "Verse 1", duration: 30 },
          { name: "Chorus", duration: 30 },
          { name: "Verse 2", duration: 30 },
          { name: "Chorus", duration: 30 },
          { name: "Outro", duration: 15 },
        ],
        coverArtPrompt: "Cyberpunk album art featuring a glowing neon vinyl record in deep space, high fidelity 3D render",
      });
    }

    try {
      const model = "gemini-3.5-flash";
      const userPrompt = `Analyze this music request and generate a structured song blueprint:
Request: "${prompt || "a beautiful space journey sound"}"
Genre: ${genre || "EDM"}
Mood: ${mood || "Epic"}
Singer Gender/Vibe: ${singer || "Female"}
Tempo Level: ${tempo || "Medium"}`;

      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: "You are an expert AI Music Producer. Define structured song details, a fitting title, descriptive properties, a list of midi melody note pitches (between 48 and 76) for synthesis, and structure.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A creative, cool song title" },
              description: { type: Type.STRING, description: "A high-fidelity paragraph describing the song's energy, instruments, and style" },
              energy: { type: Type.INTEGER, description: "Energy value from 0 to 100" },
              bpm: { type: Type.INTEGER, description: "Appropriate BPM, e.g., 70-160" },
              vocalTone: { type: Type.STRING, description: "Short stylistic vocal description" },
              instruments: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 to 5 core musical instruments used",
              },
              melodyNotes: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER },
                description: "Array of 6 MIDI note numbers (48-76) forming a beautiful melodic motif",
              },
              coverArtPrompt: { type: Type.STRING, description: "Visual description prompt for cover generator" },
            },
            required: ["title", "description", "energy", "bpm", "vocalTone", "instruments", "melodyNotes", "coverArtPrompt"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      // Add standard layout timing structure
      const structure = [
        { name: "Intro", duration: 12 },
        { name: "Verse 1", duration: 24 },
        { name: "Chorus", duration: 24 },
        { name: "Verse 2", duration: 24 },
        { name: "Chorus", duration: 24 },
        { name: "Outro", duration: 12 },
      ];
      res.json({ ...data, structure });
    } catch (error: any) {
      console.error("Song metadata generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate song data" });
    }
  });

  // API: AI Cover Art Generator Prompts
  app.post("/api/generate-cover-art-prompt", async (req: any, res: any) => {
    const { prompt, style } = req.body;
    if (!ai) {
      return res.json({
        prompt: `Premium high fidelity ${style || "Cyberpunk"} album cover. Visualizing: ${prompt || "Neon sound waves"}. Highly polished, dramatic lighting, 8k resolution, award winning poster art.`,
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create an extremely descriptive and artistic prompt for an AI Image Generator to design a premium music cover art. Theme/Text: "${prompt || "Digital Dreams"}", Style: "${style || "Cyberpunk"}". Keep it aesthetic, visual, focusing on layout, lighting, color palettes (neon, gold, dark), textures, and atmosphere. Do not include user-interface elements.`,
      });
      res.json({ prompt: response.text });
    } catch (error: any) {
      res.json({ prompt: `A stunning, highly stylized ${style} digital music cover visualising "${prompt}" with rich depth and colors.` });
    }
  });

  // API: AI Video Generator Concepts
  app.post("/api/generate-video-concept", async (req: any, res: any) => {
    const { songTitle, style } = req.body;
    if (!ai) {
      return res.json({
        scenes: [
          { time: "0:00", description: "Neon fog rolling across an empty dark stage, cyan soundwaves pulsing.", color: "#06b6d4" },
          { time: "0:15", description: "Vocal tracks kick in; a holographic singer glowing with purple light materializes.", color: "#a855f7" },
          { time: "0:45", description: "Chorus climax; camera flying rapidly through a futuristic synthwave grid metropolis.", color: "#ec4899" },
          { time: "1:15", description: "Subtle beats; camera pans up to deep space stars aligning with the drum EQ.", color: "#3b82f6" },
        ],
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a scene-by-scene audio-visualizer video concept script for the song "${songTitle || "Universal Energy"}". Video style: ${style || "Lyrics Video"}. Output standard JSON matching an array of scene objects.`,
        config: {
          systemInstruction: "You are a visual music director. Generate 4 key scene descriptions for an audio-responsive music video. Respond only with raw JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING, description: "Start timestamp (e.g. 0:00, 0:15)" },
                    description: { type: Type.STRING, description: "A highly visual description of what appears responsive to the music" },
                    color: { type: Type.STRING, description: "Hex color representing the visual aura" },
                  },
                  required: ["time", "description", "color"],
                },
              },
            },
            required: ["scenes"],
          },
        },
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      res.json({
        scenes: [
          { time: "0:00", description: "Neon lasers slicing through geometric dark cubes, syncing with the beat.", color: "#06b6d4" },
          { time: "0:20", description: "Abstract smoke in deep space drifting upwards in rhythm with vocals.", color: "#a855f7" },
          { time: "0:50", description: "Exploding stars producing sound ripples during the high energy chorus.", color: "#ec4899" },
        ],
      });
    }
  });

  // Vite Integration for Serving Frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Koya AI Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
