import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../context/GameStoreContext';
import { useAssets } from '../../context/AssetContext';
import { audioManager } from '../../audio/AudioManager';
import { useAudioStore } from '../../store/audioStore';
import { getAvailableCommands } from '../../engine/CommandEngine';
import { getAvailableConnections } from '../../engine/LocationEngine';
import type { SaveData } from '../../storage/StorageInterface';
import { SceneBackground } from './SceneBackground';
import { CharacterSprite } from './CharacterSprite';
import { DialogueBox } from './DialogueBox';
import { ChoiceList } from './ChoiceList';
import { CommandPanel } from './CommandPanel';
import { ClickableAreaOverlay } from './ClickableArea';
import { MapView } from './MapView';
import { InventoryPanel } from '../inventory/InventoryPanel';
import { SystemMenu } from '../system/SystemMenu';
import { CgSequencePlayer } from './CgSequencePlayer';
import { EndingSequence } from './EndingSequence';
import styles from './GameScreen.module.css';

interface GameScreenProps {
  onLoadGame: (saveData: SaveData) => void;
  /** エンディング完了後に呼ばれるコールバック。省略時は goToTitle */
  onTitle?: () => void;
}

export function GameScreen({ onLoadGame, onTitle }: GameScreenProps) {
  const {
    state,
    masterData,
    advanceMessage,
    selectChoice,
    executeCommand,
    selectTalkTarget,
    completeCgSequence,
    moveToLocation,
    clickArea,
    useItem,
    closeOverlay,
    goToTitle,
    toSaveData,
  } = useGameStore();

  const { settings } = useAudioStore();
  const { resolveAsset } = useAssets();

  const scene = masterData.scenes[state.currentSceneId];
  const location = masterData.locations[state.currentLocationId];
  const currentMessage = scene?.messages[state.currentMessageIndex];
  const speakerId = currentMessage?.voice_character_id;
  const speaker = speakerId ? (masterData.characters[speakerId] ?? null) : null;

  const commands = getAvailableCommands(scene, location, masterData);
  const connections = getAvailableConnections(state.currentLocationId, state, masterData);

  const choices = scene?.branches?.choices ?? [];
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakingCharId = currentMessage?.voice_character_id ?? null;
  const effectiveIsSpeaking = isSpeaking && state.phase === 'message';

  const currentBgmRef = useRef<string | null>(null);
  useEffect(() => {
    const bgm = scene?.bgm;
    if (!bgm || bgm === currentBgmRef.current) return;
    currentBgmRef.current = bgm;
    audioManager.playBgm(resolveAsset(bgm), true, settings.bgmVolume);
  }, [scene?.bgm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state.phase === 'title') {
      audioManager.stopBgm();
      currentBgmRef.current = null;
    }
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== 'engine_transition') return;
    audioManager.stopBgm();
    audioManager.stopVoice();
    currentBgmRef.current = null;
  }, [state.phase]);

  useEffect(() => () => {
    audioManager.stopBgm();
    audioManager.stopVoice();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (state.phase === 'message') {
        e.preventDefault();
        advanceMessage();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.phase, advanceMessage]);

  return (
    <div className={styles.root}>
      <SceneBackground
        backgroundPath={scene?.background}
        locationName={location?.name}
      />

      {state.phase !== 'examine' && state.currentCharacters.map((display) => {
        const char = masterData.characters[display.character_id];
        if (!char) return null;
        return (
          <CharacterSprite
            key={display.character_id}
            display={display}
            character={char}
            isSpeaking={effectiveIsSpeaking && display.character_id === speakingCharId}
          />
        );
      })}

      {state.phase === 'message' && scene?.overlay_image && (
        <div
          className={styles.cgOverlay}
          style={{ backgroundImage: `url(${resolveAsset(scene.overlay_image)})` }}
        />
      )}

      {state.phase === 'examine' && (
        <ClickableAreaOverlay
          areas={scene?.clickable_areas ?? []}
          flags={state.flags}
          inventory={state.inventory}
          locationId={state.currentLocationId}
          onClick={clickArea}
          onClose={closeOverlay}
        />
      )}

      {(state.phase === 'message') && currentMessage && (
        <DialogueBox
          message={currentMessage}
          speaker={speaker}
          textSpeed={settings.textSpeed}
          onAdvance={advanceMessage}
          onSpeakingChange={setIsSpeaking}
        />
      )}

      {state.phase === 'choice' && (
        <ChoiceList
          choices={choices}
          flags={state.flags}
          inventory={state.inventory}
          locationId={state.currentLocationId}
          onSelect={selectChoice}
        />
      )}

      {state.phase === 'talk_select' && (
        <ChoiceList
          choices={[
            ...state.talkCandidates.map((c) => ({
              label: masterData.characters[c.characterId]?.name ?? c.characterId,
              next_scene: c.sceneId,
              condition: null,
            })),
            { label: 'やめる', next_scene: '', condition: null },
          ]}
          flags={state.flags}
          inventory={state.inventory}
          locationId={state.currentLocationId}
          onSelect={(i) =>
            i === state.talkCandidates.length
              ? selectTalkTarget(-1)
              : selectTalkTarget(i)
          }
        />
      )}

      {state.phase === 'command' && (
        <CommandPanel commands={commands} onSelect={executeCommand} />
      )}

      {state.phase === 'map' && (
        <MapView
          connections={connections}
          onMove={moveToLocation}
          onClose={closeOverlay}
        />
      )}

      {state.phase === 'inventory' && (
        <InventoryPanel
          state={state}
          masterData={masterData}
          onUse={useItem}
          onClose={closeOverlay}
        />
      )}

      {state.phase === 'cg_sequence' && scene?.cg_sequence && (
        <CgSequencePlayer
          frames={scene.cg_sequence}
          onComplete={completeCgSequence}
        />
      )}

      {state.phase !== 'ending' && (
        <SystemMenu
          onGetSaveData={toSaveData}
          onLoad={onLoadGame}
          onTitle={goToTitle}
        />
      )}

      {state.phase === 'ending' && (
        <EndingSequence
          frames={scene?.cg_sequence ?? []}
          title={scene?.ending_title}
          onTitle={onTitle ?? goToTitle}
        />
      )}
    </div>
  );
}
