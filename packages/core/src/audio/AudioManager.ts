export class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private voiceAudio: HTMLAudioElement | null = null;

  playBgm(path: string, loop = true, volume = 0.8): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    const audio = new Audio(path);
    audio.loop = loop;
    audio.volume = volume;
    audio.play().catch(() => {});
    this.bgmAudio = audio;
  }

  stopBgm(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio = null;
    }
  }

  setBgmVolume(volume: number): void {
    if (this.bgmAudio) {
      this.bgmAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  async playVoice(audioUrl: string, volume = 0.9, onEnd?: () => void): Promise<void> {
    if (this.voiceAudio) {
      this.voiceAudio.pause();
    }
    const audio = new Audio(audioUrl);
    audio.volume = volume;
    this.voiceAudio = audio;
    if (onEnd) audio.addEventListener('ended', onEnd, { once: true });
    console.log('[AudioManager] playVoice:', audioUrl.slice(0, 60));
    await audio.play().catch((e) => console.warn('[AudioManager] play failed:', e));
  }

  stopVoice(): void {
    if (this.voiceAudio) {
      this.voiceAudio.pause();
      this.voiceAudio = null;
    }
  }

  playSe(path: string, volume = 0.8): void {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play().catch(() => {});
  }

  playItemGetSe(volume = 0.4): void {
    try {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);

      const notes = [
        { freq: 880,  start: 0.00, dur: 0.12 },
        { freq: 1320, start: 0.10, dur: 0.18 },
      ];

      for (const { freq, start, dur } of notes) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        g.gain.setValueAtTime(0, ctx.currentTime + start);
        g.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      }

      setTimeout(() => ctx.close(), 600);
    } catch {
      // Web Audio API 未対応環境では無音
    }
  }
}

export const audioManager = new AudioManager();
