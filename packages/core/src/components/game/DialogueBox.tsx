import { useState, useEffect } from 'react';
import type { SceneMessage } from '../../types/scene';
import type { CharacterDefinition } from '../../types/character';
import { TextWriter } from '../ui/TextWriter';
import { useVoicevox } from '../../hooks/useVoicevox';
import styles from './DialogueBox.module.css';

interface DialogueBoxProps {
  message: SceneMessage;
  speaker: CharacterDefinition | null;
  textSpeed: number;
  onAdvance: () => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export function DialogueBox({ message, speaker, textSpeed, onAdvance, onSpeakingChange }: DialogueBoxProps) {
  const [complete, setComplete] = useState(false);
  const [instant, setInstant] = useState(false);
  const { speak, stop } = useVoicevox();

  useEffect(() => {
    setComplete(false);
    setInstant(false);
    speak(message, speaker, () => onSpeakingChange?.(false));
    onSpeakingChange?.(true);
  }, [message.text]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClick() {
    if (!complete) {
      stop();
      setInstant(true);
      setComplete(true);
      onSpeakingChange?.(false);
    } else {
      stop();
      onAdvance();
    }
  }

  const speakerName = speaker?.name ?? null;
  const isNarration = !speakerName;

  return (
    <div className={styles.root}>
      {speakerName && <div className={styles.nameplate}>{speakerName}</div>}
      <div className={isNarration ? styles.boxNarration : styles.box} onClick={handleClick}>
        <div className={isNarration ? styles.textNarration : styles.text}>
          <TextWriter
            text={message.text}
            speed={textSpeed}
            instant={instant}
            onComplete={() => setComplete(true)}
          />
        </div>
        {complete && <span className={styles.arrow}>▼</span>}
      </div>
    </div>
  );
}
