import { useState } from 'react';
import type { ItemDefinition } from '../../types/item';
import { useAssets } from '../../context/AssetContext';
import styles from './ItemCard.module.css';

interface ItemCardProps {
  item: ItemDefinition;
  selected: boolean;
  onClick: () => void;
}

export function ItemCard({ item, selected, onClick }: ItemCardProps) {
  const { resolveAsset } = useAssets();
  const [imgError, setImgError] = useState(false);
  const src = item.icon ? resolveAsset(item.icon) : null;

  return (
    <div
      className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
      onClick={onClick}
    >
      {src && !imgError ? (
        <img
          className={styles.icon}
          src={src}
          alt={item.name}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.iconPlaceholder}>📦</div>
      )}
      <span className={styles.name}>{item.name}</span>
    </div>
  );
}
