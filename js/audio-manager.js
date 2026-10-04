import { CONFIG, STORAGE_KEYS } from './config.js';

export class AudioManager {
  constructor() {
    this.audio = document.getElementById('background-audio');
    this.muted = localStorage.getItem(STORAGE_KEYS.musicMuted) === 'true';
    const savedVolume = Number(localStorage.getItem(STORAGE_KEYS.musicVolume));
    this.volume = Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : CONFIG.music.volume;
    this.paperEnabled = localStorage.getItem(STORAGE_KEYS.paperEnabled) !== 'false';
    const savedPaperVolume = Number(localStorage.getItem(STORAGE_KEYS.paperVolume));
    this.paperVolume = Number.isFinite(savedPaperVolume) ? Math.min(1, Math.max(0, savedPaperVolume)) : CONFIG.paperSound.volume;
    this.ctx = null;
    this.paperGain = null;
    this.audio.src = CONFIG.music.src;
    this.audio.volume = this.volume;
    this.audio.muted = this.muted;
  }

  async init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!this.ctx && AudioContext) {
      this.ctx = new AudioContext();
    }
    if (this.ctx?.state === 'suspended') await this.ctx.resume().catch(() => {});
  }

  async playMusic() {
    if (!CONFIG.music.enabled) return false;
    await this.init();
    try { await this.audio.play(); return true; } catch (_) { return false; }
  }

  async toggleMusic() {
    await this.init();
    if (this.audio.paused) return this.playMusic();
    this.audio.pause();
    return false;
  }

  toggleMute() {
    this.muted = !this.muted;
    this.audio.muted = this.muted;
    localStorage.setItem(STORAGE_KEYS.musicMuted, String(this.muted));
    return this.muted;
  }

  setVolume(v) {
    this.volume = Math.min(1, Math.max(0, Number(v) || 0));
    this.audio.volume = this.volume;
    localStorage.setItem(STORAGE_KEYS.musicVolume, String(this.volume));
  }

  setPaperEnabled(enabled) {
    this.paperEnabled = !!enabled;
    localStorage.setItem(STORAGE_KEYS.paperEnabled, String(this.paperEnabled));
  }

  setPaperVolume(v) {
    this.paperVolume = Math.min(1, Math.max(0, Number(v) || 0));
    localStorage.setItem(STORAGE_KEYS.paperVolume, String(this.paperVolume));
  }

  _ensurePaperGraph() {
    if (!this.ctx) return false;
    if (!this.paperGain) {
      this.paperGain = this.ctx.createGain();
      this.paperGain.gain.value = this.paperVolume;
      this.paperGain.connect(this.ctx.destination);
    }
    this.paperGain.gain.value = this.paperVolume;
    return true;
  }

  _noise(duration = 0.08) {
    if (!this.paperEnabled || !this._ensurePaperGraph()) return null;
    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.18;
    }
    return buffer;
  }

  playRustle(intensity = 0.5) {
    if (!this.paperEnabled || !this._ensurePaperGraph()) return;
    const duration = 0.07;
    const buffer = this._noise(duration);
    if (!buffer) return;
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    src.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = 1400 + Math.random() * 900;
    filter.Q.value = 1.3;
    const now = this.ctx.currentTime;
    const level = Math.min(0.24, Math.max(0.01, intensity * 0.20));
    gain.gain.setValueAtTime(0.005, now);
    gain.gain.linearRampToValueAtTime(level, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter).connect(gain).connect(this.paperGain);
    src.start(now);
  }

  playLand() {
    if (!this.paperEnabled || !this._ensurePaperGraph()) return;
    const duration = 0.13;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    src.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(190, this.ctx.currentTime + duration);
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter).connect(gain).connect(this.paperGain);
    src.start(now);
  }
}
