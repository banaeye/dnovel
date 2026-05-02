import { useState } from 'react';
import type { SaveData } from '../../storage/StorageInterface';
import { getStorage } from '../../storage/StorageFactory';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SaveLoadMenu } from './SaveLoadMenu';
import { SettingsPanel } from './SettingsPanel';
import styles from './SystemMenu.module.css';

interface SystemMenuProps {
  onGetSaveData: () => SaveData;
  onLoad: (saveData: SaveData) => void;
  onTitle: () => void;
}

export function SystemMenu({ onGetSaveData, onLoad, onTitle }: SystemMenuProps) {
  const [open, setOpen] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  async function handleSave(slotId: number) {
    await getStorage().save(slotId, onGetSaveData());
  }

  return (
    <>
      <button className={styles.btn} onClick={() => setOpen(true)}>
        MENU
      </button>

      {open && !showSaveLoad && !showSettings && (
        <Modal title="システムメニュー" onClose={() => setOpen(false)}>
          <div className={styles.menuList}>
            <Button
              label="セーブ / ロード"
              onClick={() => setShowSaveLoad(true)}
            />
            <Button
              label="設定"
              onClick={() => setShowSettings(true)}
            />
            <Button
              label="タイトルへ戻る"
              onClick={() => {
                setOpen(false);
                onTitle();
              }}
            />
            <Button label="閉じる" onClick={() => setOpen(false)} size="small" />
          </div>
        </Modal>
      )}

      {open && showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}

      {open && showSaveLoad && (
        <SaveLoadMenu
          onSave={handleSave}
          onLoad={(data) => {
            onLoad(data);
            setShowSaveLoad(false);
            setOpen(false);
          }}
          onClose={() => setShowSaveLoad(false)}
        />
      )}
    </>
  );
}
