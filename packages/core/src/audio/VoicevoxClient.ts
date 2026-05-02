export interface VoicevoxConfig {
  baseUrl: string;
  enabled: boolean;
  prebuiltOnly: boolean;
}

const defaultConfig: VoicevoxConfig = {
  baseUrl: import.meta.env.VITE_VOICEVOX_URL ?? 'http://localhost:50021',
  enabled: true,
  prebuiltOnly: import.meta.env.VITE_VOICEVOX_PREBUILT_ONLY === 'true',
};

export class VoicevoxClient {
  private config: VoicevoxConfig;

  constructor(config: VoicevoxConfig = defaultConfig) {
    this.config = config;
  }

  async isAvailable(): Promise<boolean> {
    if (this.config.prebuiltOnly) return false;
    try {
      const res = await fetch(`${this.config.baseUrl}/version`, { signal: AbortSignal.timeout(1000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  async synthesize(text: string, speakerId: number): Promise<ArrayBuffer | null> {
    if (!this.config.enabled || this.config.prebuiltOnly) return null;
    try {
      const queryRes = await fetch(
        `${this.config.baseUrl}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
        { method: 'POST' },
      );
      if (!queryRes.ok) return null;

      const query = await queryRes.json();

      const synthRes = await fetch(
        `${this.config.baseUrl}/synthesis?speaker=${speakerId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(query),
        },
      );
      if (!synthRes.ok) return null;

      return synthRes.arrayBuffer();
    } catch {
      return null;
    }
  }
}

export const voicevoxClient = new VoicevoxClient();
