import { useState, useEffect } from 'react';
import type { SaveData } from '../../storage/StorageInterface';
import { getStorage } from '../../storage/StorageFactory';
import { Button } from '../ui/Button';
import { SaveLoadMenu } from './SaveLoadMenu';
import styles from './TitleScreen.module.css';

interface TitleScreenProps {
  onNewGame: () => void;
  onLoad: (saveData: SaveData) => void;
}

export function TitleScreen({ onNewGame, onLoad }: TitleScreenProps) {
  const [showLoad, setShowLoad] = useState(false);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    getStorage()
      .listSaves()
      .then((saves) => setHasSave(saves.some(Boolean)));
  }, []);

  async function handleSave(_slotId: number) {}

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>ノベルゲーム</h1>
      <p className={styles.subtitle}>NOVEL GAME</p>
      <div className={styles.actions}>
        <Button label="はじめから" size="large" onClick={onNewGame} />
        {hasSave && (
          <Button label="続きから" size="large" onClick={() => setShowLoad(true)} />
        )}
      </div>

      {showLoad && (
        <SaveLoadMenu
          onSave={handleSave}
          onLoad={(data) => {
            setShowLoad(false);
            onLoad(data);
          }}
          onClose={() => setShowLoad(false)}
        />
      )}
    </div>
  );
}
