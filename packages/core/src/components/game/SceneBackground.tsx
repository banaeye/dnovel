import { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import styles from './SceneBackground.module.css';

interface SceneBackgroundProps {
  backgroundPath?: string;
  locationName?: string;
  possessed?: boolean;
  onLoad?: () => void;
}

export function SceneBackground({ backgroundPath, locationName, possessed = false, onLoad }: SceneBackgroundProps) {
  const { resolveAsset } = useAssets();
  const [imgError, setImgError] = useState(false);

  const src = backgroundPath ? resolveAsset(backgroundPath) : null;

  useEffect(() => { setImgError(false); }, [src]);

  return (
    <div className={`${styles.root} ${possessed ? styles.possessed : ''}`}>
      {src && !imgError ? (
        <img
          className={styles.img}
          src={src}
          alt=""
          onLoad={onLoad}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.fallback}>
          {locationName && (
            <span className={styles.locationName}>{locationName}</span>
          )}
        </div>
      )}
    </div>
  );
}
