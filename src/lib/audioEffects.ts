"use client";

// Web Audio API Synthesizer for High-Tech Cinematic Sound Effects
// No external mp3/wav files required, zero latency, works on all modern browsers

class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // 1. RGB LED Chime (Futuristic ascending harmonic glass chime)
  playRgbChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (major chord)

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.85);
    });
  }

  // 2. High Red LED Strobe Alarm (Emergency siren chirp)
  playRedAlarm() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 3 rapid alternating high-intensity alarm bursts
    for (let i = 0; i < 3; i++) {
      const startTime = now + i * 0.18;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(960, startTime);
      osc.frequency.exponentialRampToValueAtTime(480, startTime + 0.14);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.16);
    }
  }

  // 3. Firecrackers 3D Burst & Crackles
  playFirecrackerPop() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // A: Initial launch rocket whoosh
    const rocketOsc = ctx.createOscillator();
    const rocketGain = ctx.createGain();
    rocketOsc.type = "triangle";
    rocketOsc.frequency.setValueAtTime(250, now);
    rocketOsc.frequency.exponentialRampToValueAtTime(1100, now + 0.22);
    rocketGain.gain.setValueAtTime(0.08, now);
    rocketGain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
    rocketOsc.connect(rocketGain);
    rocketGain.connect(ctx.destination);
    rocketOsc.start(now);
    rocketOsc.stop(now + 0.24);

    // B: Main Explosion Boom
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = "sine";
    boomOsc.frequency.setValueAtTime(160, now + 0.24);
    boomOsc.frequency.exponentialRampToValueAtTime(35, now + 0.55);
    boomGain.gain.setValueAtTime(0.35, now + 0.24);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(now + 0.24);
    boomOsc.stop(now + 0.75);

    // C: Crackle noise bursts (firecracker sparks)
    for (let i = 0; i < 7; i++) {
      const crackleTime = now + 0.28 + i * 0.05 + Math.random() * 0.03;
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(2400 + Math.random() * 1800, crackleTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, crackleTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, crackleTime + 0.04);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(crackleTime);
      noise.stop(crackleTime + 0.045);
    }
  }

  // 4. Cinematic Task Card Opening Sci-Fi Warp
  playCinematicCardOpen() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Resonant futuristic frequency sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.35);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.48);
  }
}

export const soundEffects = new SoundSynthesizer();
