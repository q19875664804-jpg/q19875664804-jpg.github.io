/**
 * 《方块世界 · 农场经营与交易》原生 Web Audio API 音乐/音效引擎
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.bgmGain = null;
        this.sfxGain = null;
        this.isMuted = false;
        this.isBgmPlaying = false;
        this.bgmTimer = null;
        this.step = 0;

        // 五度和弦田园旋律音符频率 (Hz)
        this.scale = [
            261.63, // C4
            293.66, // D4
            329.63, // E4
            392.00, // G4
            440.00, // A4
            523.25, // C5
            587.33, // D5
            659.25  // E5
        ];

        // 简谱和弦行进索引
        this.melody = [0, 2, 3, 5, 4, 2, 3, 1, 0, 3, 2, 4, 3, 5, 4, 2];
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.bgmGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.sfxGain.connect(this.ctx.destination);

        this.startBGM();
    }

    toggleMute() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        this.isMuted = !this.isMuted;
        if (this.bgmGain) {
            this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);
        }
        if (this.sfxGain) {
            this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
        }
        return !this.isMuted;
    }

    // 播放背景轻音乐循回生成器
    startBGM() {
        if (this.isBgmPlaying) return;
        this.isBgmPlaying = true;

        const playNote = () => {
            if (!this.ctx || this.isMuted) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const noteFreq = this.scale[this.melody[this.step % this.melody.length]];
            this.step++;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(noteFreq, now);

            // 柔和的木吉他/风铃包络
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.2, now + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

            osc.connect(gain);
            gain.connect(this.bgmGain);

            osc.start(now);
            osc.stop(now + 0.95);
        };

        this.bgmTimer = setInterval(playNote, 420);
    }

    // 常用音效合成方法
    playClick() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    playCoin() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        [987.77, 1318.51].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(startTime);
            osc.stop(startTime + 0.23);
        });
    }

    playHarvest() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.06;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(startTime);
            osc.stop(startTime + 0.26);
        });
    }

    playWater() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    playWeed() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playPest() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    playPlant() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playError() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.setValueAtTime(130, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.22);
    }
}

window.soundEngine = new SoundEngine();
