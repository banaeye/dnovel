import { useState, useEffect } from 'react';
import type { SaveData } from '../../storage/StorageInterface';
import { getStorage } from '../../storage/StorageFactory';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { SaveLoadMenu } from './SaveLoadMenu';
import { useGameStore } from '../../context/GameStoreContext';
import { useAssets } from '../../context/AssetContext';
import type { ChapterConfig } from '../../types/chapter';
import styles from './TitleScreen.module.css';

interface TitleScreenProps {
  onNewGame: () => void;
  onLoad: (saveData: SaveData) => void;
  chapters?: ChapterConfig[];
  onStartChapter?: (chapter: ChapterConfig) => void;
}

export function TitleScreen({ onNewGame, onLoad, chapters, onStartChapter }: TitleScreenProps) {
  const [showContinue, setShowContinue] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [saves, setSaves] = useState<Array<{ slotId: number; data: SaveData } | null>>([]);
  const [autoSave, setAutoSave] = useState<SaveData | null>(null);
  const { state } = useGameStore();
  const { resolveAsset } = useAssets();

  useEffect(() => {
    const storage = getStorage();
    storage.listSaves().then(setSaves);
    storage.loadAutoSave().then(setAutoSave);
  }, []);

  async function handleSave(_slotId: number) {}

  function isChapterUnlocked(chapter: ChapterConfig): boolean {
    const { unlockFlag } = chapter;
    if (!unlockFlag) return true;
    if (state.flags[unlockFlag]) return true;
    return saves.some((entry) => Boolean(entry?.data.flags[unlockFlag]));
  }

  const playableChapters = chapters?.filter(isChapterUnlocked) ?? [];
  const hasSave = saves.some(Boolean);
  const canContinue = hasSave || playableChapters.length > 0;

  return (
    <div
      className={styles.root}
      style={{ backgroundImage: `url(${resolveAsset('cg/title.jpg')})` }}
    >
      <div className={styles.actions}>
        <Button label="はじめから" size="large" onClick={onNewGame} />
        {autoSave && (
          <Button label="オートセーブからはじめる" size="large" onClick={() => onLoad(autoSave)} />
        )}
        {canContinue && (
          <Button label="続きから" size="large" onClick={() => setShowContinue(true)} />
        )}
      </div>

      {showContinue && (
        <Modal title="続きから" onClose={() => setShowContinue(false)}>
          <div className={styles.continueMenu}>
            {hasSave && (
              <Button
                label="セーブデータをロード"
                size="large"
                onClick={() => {
                  setShowContinue(false);
                  setShowLoad(true);
                }}
              />
            )}
            {playableChapters.length > 0 && (
              <div className={styles.chapterList}>
                <div className={styles.sectionLabel}>章を選ぶ</div>
                {playableChapters.map((ch) => (
                  <Button
                    key={`${ch.initialSceneId}:${ch.initialLocationId}`}
                    label={ch.title}
                    size="large"
                    onClick={() => {
                      setShowContinue(false);
                      onStartChapter?.(ch);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {showLoad && (
        <SaveLoadMenu
          onSave={handleSave}
          onLoad={(data) => {
            setShowLoad(false);
            onLoad(data);
          }}
          onClose={() => setShowLoad(false)}
          initialTab="load"
          chapters={chapters}
        />
      )}
    </div>
  );
}
