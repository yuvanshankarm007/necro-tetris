/**
 * NecroBlocks Procedural Web Audio Synthesizer
 * 100% Original Procedural Web Audio API — Zero external audio files or copyright dependencies.
 * Generates an original haunting 8-bit gothic crypt dirge with pulse waves and resonant organ harmonics.
 */

// Note frequencies in Hz
const NOTES: Record<string, number> = {
  C3: 130.81,
  D3: 146.83,
  Eb3: 155.56,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  Ab3: 207.65,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  Ab4: 415.3,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  Eb5: 622.25,
  E5: 659.25,
  REST: 0,
};

// Original Gothic Crypt Dirge (Original Composition in D Minor / Harmonic Phrygian)
const ORIGINAL_CRYPT_DIRGE: [string, number][] = [
  ['D4', 6], ['F4', 2], ['A4', 4], ['G4', 4],
  ['F4', 4], ['Eb4', 4], ['D4', 8],
  ['D4', 4], ['F4', 4], ['G4', 4], ['Ab4', 4],
  ['A4', 8], ['REST', 4], ['A4', 4],
  ['C5', 6], ['B4', 2], ['A4', 4], ['G4', 4],
  ['F4', 6], ['G4', 2], ['A4', 4], ['F4', 4],
  ['Eb4', 6], ['F4', 2], ['G4', 4], ['Eb4', 4],
  ['D4', 12], ['REST', 4],
];

export class SpookySynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimeoutId: number | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.25;

  private initContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public startBGM(): void {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.playBgmStep(0);
  }

  public stopBGM(): void {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId !== null) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  private playBgmStep(index: number): void {
    if (!this.isBgmPlaying || !this.ctx || !this.masterGain) return;

    const [note, duration16ths] = ORIGINAL_CRYPT_DIRGE[index];
    const stepDurationSec = 0.095;
    const noteDurationSec = duration16ths * stepDurationSec;

    if (note !== 'REST' && !this.isMuted) {
      const freq = NOTES[note] || 220;

      const oscLead = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1350, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.2, this.ctx.currentTime);

      oscLead.type = 'square';
      oscLead.frequency.setValueAtTime(freq, this.ctx.currentTime);

      oscSub.type = 'sawtooth';
      oscSub.frequency.setValueAtTime(freq * 0.5, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + noteDurationSec * 0.92);

      oscLead.connect(filter);
      oscSub.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      oscLead.start(now);
      oscSub.start(now);
      oscLead.stop(now + noteDurationSec);
      oscSub.stop(now + noteDurationSec);
    }

    const nextIndex = (index + 1) % ORIGINAL_CRYPT_DIRGE.length;
    this.bgmTimeoutId = window.setTimeout(() => {
      this.playBgmStep(nextIndex);
    }, noteDurationSec * 1000);
  }

  private lastMoveSoundTime = 0;

  public playMove(): void {
    const nowMs = performance.now();
    if (nowMs - this.lastMoveSoundTime < 42) return;
    this.lastMoveSoundTime = nowMs;

    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(230, now + 0.04);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playRotate(): void {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playHardDrop(): void {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playLineClear(lines: number): void {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const baseFreqs = lines === 4 ? [440, 523.25, 659.25, 880] : [293.66, 349.23, 440];

    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = lines === 4 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.001, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45 + idx * 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.05);
      osc.stop(now + 0.45 + idx * 0.05);
    });
  }

  public playCurseTrigger(): void {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.4);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playGameOver(): void {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const notes = [220, 207.65, 196.0, 164.81];
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + i * 0.35;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }
}

export const spookyAudio = new SpookySynthesizer();
