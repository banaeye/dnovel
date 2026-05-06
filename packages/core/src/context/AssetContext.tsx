import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

interface AssetContextValue {
  resolveAsset: (relativePath: string) => string;
  resolveVoicePath: (hashKey: string) => string;
}

export const AssetContext = createContext<AssetContextValue>({
  resolveAsset: (p) => p,
  resolveVoicePath: (k) => `assets/voicevox/${k}.mp3`,
});

export function AssetProvider({
  assetsBaseUrl,
  children,
}: {
  assetsBaseUrl: string;
  children: ReactNode;
}) {
  const base = assetsBaseUrl.replace(/\/$/, '');
  const value = useMemo<AssetContextValue>(() => ({
    resolveAsset: (relativePath) => `${base}/${relativePath}`,
    resolveVoicePath: (hashKey) => `${base}/voicevox/${hashKey}.mp3`,
  }), [base]);

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
}

export function useAssets(): AssetContextValue {
  return useContext(AssetContext);
}
