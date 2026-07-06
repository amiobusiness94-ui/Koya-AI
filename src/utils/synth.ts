/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Song } from "../types";

class KoyaSynthEngine {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private timerId: number | null = null;
  private bpm = 120;
  private currentStep = 0;
  private song: Song | null = null;

  // Audio nodes
  private masterGain: GainNode | null = null;
  private drumsGain: GainNode | null = null;
  private bassGain: GainNode | null = null;
  private melodyGain: GainNode | null = null;
  private vocalsGain: GainNode | null = null;

  // Effects nodes
  private reverbNode: ConvolverNode | DelayNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  constructor() {
    // Lazy initialize on first click/play
  }

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;

    this.drumsGain = this.ctx.createGain();
    this.bassGain = this.ctx.createGain();
    this.melodyGain = this.ctx.createGain();
    this.vocalsGain = this.ctx.createGain();

    // Setup basic Delay Effect
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayNode.delayTime.value = 0.35; // 350ms delay
    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.value = 0.4;

    // Connect feedback loop for delay
    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);

    // Setup simulated reverb (using a subtle multi-tap delay chain)
    this.reverbNode = this.ctx.createDelay(1.0);
    this.reverbNode.delayTime.value = 0.15;

    // Low-pass filter for mastering
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = "lowpass";
    this.filterNode.frequency.value = 20000;

    // Route gains
    // Drums are clean, direct to master
    this.drumsGain.connect(this.masterGain);

    // Bass connects to master with subtle lowpass
    this.bassGain.connect(this.masterGain);

    // Melody goes to Delay & Master
    this.melodyGain.connect(this.masterGain);
    this.melodyGain.connect(this.delayNode);

    // Vocals connect to Master + Delay + Reverb
    this.vocalsGain.connect(this.masterGain);
    this.vocalsGain.connect(this.delayNode);
    this.vocalsGain.connect(this.reverbNode);

    // Route delay and reverb to master
    this.delayNode.connect(this.masterGain);
    this.reverbNode.connect(this.masterGain);

    // Master goes through lowpass filter to destination
    this.masterGain.connect(this.filterNode);
    this.filterNode.connect(this.ctx.destination);
  }

  public play(song: Song, onStep?: (step: number) => void) {
    this.init();
    if (this.isRunning) this.stop();

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.song = song;
    this.bpm = song.bpm || 120;
    this.isRunning = true;
    this.currentStep = 0;

    // Set initial volumes from stems
    this.updateStemVolumes(song.stemVols);
    this.updateEffects(song.effects);

    const stepDuration = 60 / this.bpm / 2; // 8th notes

    const scheduleNext = () => {
      if (!this.isRunning || !this.ctx) return;
      this.playStep(this.currentStep);
      if (onStep) {
        onStep(this.currentStep);
      }
      this.currentStep = (this.currentStep + 1) % 16;
      this.timerId = window.setTimeout(scheduleNext, stepDuration * 1000);
    };

    scheduleNext();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public updateStemVolumes(vols: Song["stemVols"]) {
    if (!this.drumsGain || !this.bassGain || !this.melodyGain || !this.vocalsGain) return;
    // Map 0-100 values to actual audio gain values (0 to 1)
    this.drumsGain.gain.setValueAtTime(vols.drums / 100, this.ctx?.currentTime || 0);
    this.bassGain.gain.setValueAtTime(vols.bass / 100, this.ctx?.currentTime || 0);
    this.melodyGain.gain.setValueAtTime(vols.melody / 100, this.ctx?.currentTime || 0);
    this.vocalsGain.gain.setValueAtTime(vols.vocals / 100, this.ctx?.currentTime || 0);
  }

  public updateEffects(fx: Song["effects"]) {
    if (!this.delayFeedback || !this.reverbNode || !this.filterNode) return;
    const now = this.ctx?.currentTime || 0;

    // Map reverb level
    const reverbVol = fx.reverb / 100;
    // Delay feedback level
    this.delayFeedback.gain.setValueAtTime((fx.delay / 100) * 0.7, now);

    // Autotune simulated by subtle low-pass or high-pass peak modulation
    if (fx.autoTune > 30) {
      this.filterNode.type = "peaking";
      this.filterNode.frequency.setValueAtTime(1200 + fx.autoTune * 20, now);
      this.filterNode.Q.setValueAtTime(4, now);
    } else {
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(fx.noiseRemoval ? 4000 : 20000, now);
      this.filterNode.Q.setValueAtTime(1, now);
    }
  }

  private playStep(step: number) {
    if (!this.ctx || !this.song) return;
    const now = this.ctx.currentTime;
    const genre = this.song.genre.toLowerCase();

    // 1. DRUMS SYNTHESIS
    // Kick on beats 1, 5, 9, 13 (step % 4 === 0)
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.drumsGain!);

      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);

      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.3);
    }

    // Hi-hat on steps 2, 4, 6, 8, 10, 12, 14, 16
    if (step % 2 === 1) {
      // Noise buffer or quick pulse for hihat
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.connect(gain);
      gain.connect(this.drumsGain!);

      osc.frequency.setValueAtTime(10000, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.06);
    }

    // Snare on beat 2 & 4 (steps 4, 12)
    if (step === 4 || step === 12) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.connect(gain);
      gain.connect(this.drumsGain!);

      osc.frequency.setValueAtTime(350, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.16);
    }

    // 2. BASS SYNTHESIS (Root chord notes)
    // Plays longer bass notes on steps 0, 4, 8, 12
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = genre.includes("edm") || genre.includes("trap") ? "sawtooth" : "sine";
      osc.connect(gain);
      gain.connect(this.bassGain!);

      const bassNotes = [36, 40, 43, 41]; // MIDI chords mapping (C, E, G, F)
      const currentChordIdx = Math.floor(step / 4) % bassNotes.length;
      const midiNote = bassNotes[currentChordIdx];
      const freq = this.midiToFreq(midiNote);

      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    }

    // 3. MELODY SYNTHESIS (Using Gemini melodyNotes sequence)
    // Play on alternating steps
    if (step % 2 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(this.melodyGain!);

      const notes = this.song.melodyNotes && this.song.melodyNotes.length > 0 
        ? this.song.melodyNotes 
        : [60, 63, 65, 67, 70, 72]; // Pentatonic default

      const noteIdx = (step / 2) % notes.length;
      const midiNote = notes[noteIdx];
      const freq = this.midiToFreq(midiNote);

      osc.frequency.setValueAtTime(freq, now);

      // Add a tiny vibrato
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.value = 6; // 6Hz
      vibratoGain.gain.value = 4; // 4Hz pitch depth
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start(now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.start(now);
      vibrato.stop(now + 0.45);
      osc.stop(now + 0.45);
    }

    // 4. VOCAL SYNTHESIS (Aesthetic harmonized pads)
    // Plays on step 0 and step 8
    if (step === 0 || step === 8) {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "triangle";
      osc2.type = "sine";

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.vocalsGain!);

      const rootFreq = this.midiToFreq(60 + (step === 0 ? 0 : 5)); // Harmonized fifth
      osc1.frequency.setValueAtTime(rootFreq, now);
      osc2.frequency.setValueAtTime(rootFreq * 1.5, now); // Perfect fifth harmony

      // Slide vocal frequency slightly to sound organic (portamento)
      osc1.frequency.exponentialRampToValueAtTime(rootFreq * 1.2, now + 1.2);
      osc2.frequency.exponentialRampToValueAtTime(rootFreq * 1.8, now + 1.2);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.3); // Fade in voice
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5); // Fade out voice

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.6);
      osc2.stop(now + 1.6);
    }
  }

  private midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }
}

export const synthEngine = new KoyaSynthEngine();
