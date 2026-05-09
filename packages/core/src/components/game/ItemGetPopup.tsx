import { useEffect, useRef, useState } from 'react';
import type { ItemDefinition } from '../../types/item';
import { useAssets } from '../../context/AssetContext';
import { audioManager } from '../../audio/AudioManager';
import styles from './ItemGetPopup.module.css';

const DISPLAY_MS = 2500;

interface ItemGetPopupProps {
  item: ItemDefinition;
  onDismiss: () => void;
}

export function ItemGetPopup({ item, onDismiss }: ItemGetPopupProps) {
  const { resolveAsset } = useAssets();
  const [leaving, setLeaving] = useState(false);
  const dismissedRef = useRef(false);

  function dismiss() {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setLeaving(true);
    setTimeout(onDismiss, 280);
  }

  useEffect(() => {
    audioManager.playItemGetSe();
    const t = setTimeout(dismiss, DISPLAY_MS);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.popup}${leaving ? ` ${styles.leaving}` : ''}`}
        onClick={dismiss}
      >
        <div className={styles.header}>✦ アイテムを手に入れた！ ✦</div>
        <div className={styles.body}>
          <div className={styles.iconBox}>
            {item.icon
              ? <img src={resolveAsset(item.icon)} alt={item.name} className={styles.iconImg} />
              : <span className={styles.iconDefault}>📦</span>
            }
          </div>
          <div className={styles.info}>
            <div className={styles.itemName}>{item.name}</div>
            <div className={styles.itemDesc}>{item.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
