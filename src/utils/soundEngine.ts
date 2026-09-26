// Procedural Web Audio API sound generator for InkBlade
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;
  private ambientGain: GainNode | null = null;
  private ambientActive: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08 * this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08 * this.volume, this.ctx.currentTime);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public getVolume() {
    return this.volume;
  }

  // Sword slash whoosh with metallic edge
  public playSlash(type: 'light' | 'heavy' | 'quick' = 'light') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = type === 'heavy' ? 0.35 : 0.22;

    // Filtered noise for whoosh
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(type === 'heavy' ? 2400 : 3200, t + dur * 0.4);
    filter.frequency.exponentialRampToValueAtTime(400, t + dur);
    filter.Q.setValueAtTime(type === 'heavy' ? 3.5 : 4.5, t);

    const gain = this.ctx.createGain();
    const peakVol = (type === 'heavy' ? 0.45 : 0.35) * this.volume;
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(peakVol, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // Subtle metallic overtone oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'heavy' ? 950 : 1400, t);
    osc.frequency.exponentialRampToValueAtTime(type === 'heavy' ? 420 : 650, t + dur);

    oscGain.gain.setValueAtTime(0.12 * this.volume, t);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.7);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  // Punch impact (solid body strike)
  public playPunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);

    gain.gain.setValueAtTime(0.5 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);

    // Click snap
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'square';
    snap.frequency.setValueAtTime(480, t);
    snap.frequency.exponentialRampToValueAtTime(80, t + 0.04);
    snapGain.gain.setValueAtTime(0.3 * this.volume, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    snap.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snap.start(t);
    snap.stop(t + 0.04);
  }

  // Heavy kick / slam
  public playKick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.2);

    gain.gain.setValueAtTime(0.6 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Parry clash ring (high harmonic metal deflection)
  public playParry() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = [1840, 2460, 3920];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 0.98, t + 0.6);

      const level = (0.25 / (idx + 1)) * this.volume;
      gain.gain.setValueAtTime(level, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  // Dodge whoosh
  public playDodge() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.18);

    gain.gain.setValueAtTime(0.2 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  // Footstep on tatami / timber
  public playFootstep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.06);

    gain.gain.setValueAtTime(0.15 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // Special move / Taiko Gong impact
  public playSpecial() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Deep taiko fundamental
    const bass = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bass.type = 'triangle';
    bass.frequency.setValueAtTime(95, t);
    bass.frequency.exponentialRampToValueAtTime(35, t + 0.8);
    bassGain.gain.setValueAtTime(0.8 * this.volume, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    bass.connect(bassGain);
    bassGain.connect(this.ctx.destination);
    bass.start(t);
    bass.stop(t + 0.8);

    // Resonant gong shimmer
    [440, 680, 890, 1320].forEach((freq) => {
      const bell = this.ctx!.createOscillator();
      const bellGain = this.ctx!.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(freq, t);
      bellGain.gain.setValueAtTime(0.2 * this.volume, t);
      bellGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      bell.connect(bellGain);
      bellGain.connect(this.ctx!.destination);
      bell.start(t);
      bell.stop(t + 1.2);
    });
  }

  // Toggle ambient bamboo forest wind sound
  public toggleAmbient() {
    if (this.ambientActive) {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
      }
      this.ambientActive = false;
      return false;
    }

    this.initCtx();
    if (!this.ctx) return false;

    const dur = 4.0;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // pinkish noise
      lastOut = data[i];
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.06 * this.volume, this.ctx.currentTime + 1.5);

    noise.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);
    noise.start();

    this.ambientActive = true;
    return true;
  }

  public isAmbientActive() {
    return this.ambientActive;
  }
}

export const soundEngine = new SoundEngine();
