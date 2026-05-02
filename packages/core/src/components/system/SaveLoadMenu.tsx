import { useState, useEffect } from 'react';
import type { SaveData } from '../../storage/StorageInterface';
import { MAX_SAVE_SLOTS } from '../../storage/StorageInterface';
import { getStorage } from '../../storage/StorageFactory';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import styles from './SaveLoadMenu.module.css';

type Tab = 'save' | 'load';

interface SaveLoadMenuProps {
  onSave: (slotId: number) => Promise<void>;
  onLoad: (saveData: SaveData) => void;
  onClose: () => void;
}

export function SaveLoadMenu({ onSave, onLoad, onClose }: SaveLoadMenuProps) {
  const [tab, setTab] = useState<Tab>('save');
  const [saves, setSaves] = useState<Array<{ slotId: number; data: SaveData } | null>>([]);

  useEffect(() => {
    getStorage()
      .listSaves()
      .then(setSaves);
  }, []);

  async function handleSave(slotId: number) {
    await onSave(slotId);
    const updated = await getStorage().listSaves();
    setSaves(updated);
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('ja-JP', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <Modal title="セーブ / ロード" onClose={onClose}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'save' ? styles.tabActive : ''}`}
          onClick={() => setTab('save')}
        >
          セーブ
        </button>
        <button
          className={`${styles.tab} ${tab === 'load' ? styles.tabActive : ''}`}
          onClick={() => setTab('load')}
        >
          ロード
        </button>
      </div>

      <div className={styles.slots}>
        {Array.from({ length: MAX_SAVE_SLOTS }, (_, i) => {
          const slotId = i + 1;
          const entry = saves[i] ?? null;
          return (
            <div key={slotId} className={styles.slot}>
              <div className={styles.slotInfo}>
                <div className={styles.slotLabel}>スロット {slotId}</div>
                {entry ? (
                  <div className={styles.slotData}>
                    {formatDate(entry.data.timestamp)}
                    　プレイ時間: {Math.floor(entry.data.playtime / 60)}分
                  </div>
                ) : (
                  <div className={styles.slotEmpty}>データなし</div>
                )}
              </div>
              <div className={styles.slotActions}>
                {tab === 'save' && (
                  <Button
                    label="セーブ"
                    size="small"
                    onClick={() => handleSave(slotId)}
                  />
                )}
                {tab === 'load' && entry && (
                  <Button
                    label="ロード"
                    size="small"
                    onClick={() => {
                      onLoad(entry.data);
                      onClose();
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
