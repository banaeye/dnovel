import { useState } from 'react';
import type { ItemDefinition } from '../../types/item';
import type { GameState } from '../../types/gameState';
import { canUseItem } from '../../engine/ItemEngine';
import type { MasterData } from '../../loaders/dataLoader';
import { Modal } from '../ui/Modal';
import { ItemCard } from './ItemCard';
import { Button } from '../ui/Button';
import styles from './InventoryPanel.module.css';

interface InventoryPanelProps {
  state: GameState;
  masterData: MasterData;
  onUse: (itemId: string) => void;
  onClose: () => void;
}

export function InventoryPanel({ state, masterData, onUse, onClose }: InventoryPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items: ItemDefinition[] = state.inventory
    .map((id) => masterData.items[id])
    .filter((item): item is ItemDefinition => Boolean(item));

  const selected = selectedId ? masterData.items[selectedId] : null;

  return (
    <Modal title="持ち物" onClose={onClose}>
      <div className={styles.grid}>
        {items.length === 0 ? (
          <p className={styles.empty}>何も持っていない</p>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
            />
          ))
        )}
      </div>

      {selected && (
        <div className={styles.detail}>
          <div className={styles.detailName}>{selected.name}</div>
          <div className={styles.detailDesc}>{selected.description}</div>
          <div className={styles.actions}>
            {selected.usable && (
              <Button
                label="使う"
                disabled={!canUseItem(selected.id, state, masterData)}
                onClick={() => onUse(selected.id)}
              />
            )}
            <Button label="閉じる" onClick={onClose} size="small" />
          </div>
        </div>
      )}
    </Modal>
  );
}
