import { useEffect, useState } from 'react';
import type { CgFrame } from '../../types/scene';
import { useAssets } from '../../context/AssetContext';
import styles from './EndingSequence.module.css';

const PHASE1_MS = 12000;
const PHASE2_MS = 12000;
const PHASE3_MS = 5000;

type CreditItem =
  | { kind: 'mainTitle'; text: string }
  | { kind: 'section'; text: string }
  | { kind: 'name'; text: string }
  | { kind: 'spacer' };

const PART1: CreditItem[] = [
  { kind: 'mainTitle', text: '赤羽の一日' },
  { kind: 'spacer' },
  { kind: 'section', text: 'STORY & SCRIPT' },
  { kind: 'name', text: 'Anonymous' },
  { kind: 'spacer' },
  { kind: 'section', text: 'CHARACTER DESIGN' },
  { kind: 'name', text: 'Anonymous' },
  { kind: 'spacer' },
  { kind: 'section', text: 'VOICE ACTING' },
  { kind: 'name', text: 'VOICEVOX' },
];

const PART2: CreditItem[] = [
  { kind: 'section', text: 'MUSIC' },
  { kind: 'name', text: 'Anonymous' },
  { kind: 'spacer' },
  { kind: 'section', text: 'PROGRAMMING' },
  { kind: 'name', text: 'Anonymous' },
  { kind: 'spacer' },
  { kind: 'section', text: 'SPECIAL THANKS' },
  { kind: 'name', text: 'CoderDojo 赤羽' },
  { kind: 'spacer' },
  { kind: 'name', text: 'Thank you for playing.' },
];

function ScrollCredits({ items, durationSec }: { items: CreditItem[]; durationSec: number }) {
  return (
    <div className={styles.scrollWrap} style={{ animationDuration: `${durationSec}s` }}>
      {items.map((item, i) => {
        if (item.kind === 'mainTitle') return <div key={i} className={styles.creditMainTitle}>{item.text}</div>;
        if (item.kind === 'section') return <div key={i} className={styles.creditSection}>{item.text}</div>;
        if (item.kind === 'name') return <div key={i} className={styles.creditName}>{item.text}</div>;
        return <div key={i} className={styles.creditSpacer} />;
      })}
    </div>
  );
}

function CgStack({ frames }: { frames: CgFrame[] }) {
  const { resolveAsset } = useAssets();
  return (
    <div className={styles.cgPanel}>
      {frames.map((frame, i) => (
        <img
          key={frame.src}
          className={styles.cgPanelImg}
          src={resolveAsset(frame.src)}
          alt=""
          style={{ animationDelay: `${i * 3}s` }}
        />
      ))}
    </div>
  );
}

interface Props {
  frames: CgFrame[];
  onTitle: () => void;
}

export function EndingSequence({ frames, onTitle }: Props) {
  const { resolveAsset } = useAssets();
  const [phase, setPhase] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), PHASE1_MS);
    const t2 = setTimeout(() => setPhase(3), PHASE1_MS + PHASE2_MS);
    const t3 = setTimeout(onTitle, PHASE1_MS + PHASE2_MS + PHASE3_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const rightFrames = frames.slice(0, 3);
  const leftFrames = frames.slice(3, 5);
  const finFrame = frames[frames.length - 1] ?? null;

  if (phase === 3) {
    return (
      <div className={styles.finRoot}>
        {finFrame && (
          <img
            className={styles.finImg}
            src={resolveAsset(finFrame.src)}
            alt=""
          />
        )}
        <div className={styles.finText}>Fin</div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.leftPanel}>
        {phase === 1
          ? <ScrollCredits items={PART1} durationSec={PHASE1_MS / 1000} />
          : <CgStack frames={leftFrames} />
        }
      </div>
      <div className={styles.divider} />
      <div className={styles.rightPanel}>
        {phase === 1
          ? <CgStack frames={rightFrames} />
          : <ScrollCredits items={PART2} durationSec={PHASE2_MS / 1000} />
        }
      </div>
    </div>
  );
}
