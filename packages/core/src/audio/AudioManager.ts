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
}

export const audioManager = new AudioManager();
