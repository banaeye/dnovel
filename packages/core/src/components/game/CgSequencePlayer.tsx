import { useState, useEffect, useCallback } from 'react';
import type { CgFrame } from '../../types/scene';
import { useAssets } from '../../context/AssetContext';
import styles from './CgSequencePlayer.module.css';

interface CgSequencePlayerProps {
  frames: CgFrame[];
  onComplete: () => void;
}

const FRAME_DURATION = 2800;

export function CgSequencePlayer({ frames, onComplete }: CgSequencePlayerProps) {
  const { resolveAsset } = useAssets();
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((i) => {
      if (i < frames.length - 1) return i + 1;
      onComplete();
      return i;
    });
  }, [frames.length, onComplete]);

  useEffect(() => {
    const id = setTimeout(advance, FRAME_DURATION);
    return () => clearTimeout(id);
  }, [index, advance]);

  const frame = frames[index];
  const src = resolveAsset(frame.src);

  return (
    <div className={styles.overlay} onClick={advance}>
      <img
        key={index}
        src={src}
        alt=""
        className={`${styles.frame} ${styles[frame.position]}`}
      />

      <div className={styles.progress}>
        {frames.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
