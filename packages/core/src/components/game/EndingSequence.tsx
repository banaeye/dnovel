import { useEffect, useState } from 'react';
import type { CgFrame } from '../../types/scene';
import { useAssets } from '../../context/AssetContext';
import styles from './EndingSequence.module.css';

const PHASE1_MS = 12000;
const PHASE2_MS = 6000;

type CreditItem =
  | { kind: 'mainTitle'; text: string }
  | { kind: 'section'; text: string }
  | { kind: 'name'; text: string }
  | { kind: 'spacer' };

const CREDIT_ITEMS: CreditItem[] = [
  { kind: 'spacer' },
  { kind: 'section', text: 'STORY & SCRIPT' },
  { kind: 'name', text: 'Anonymous' },
  { kind: 'spacer' },
  { kind: 'section', text: 'CHARACTER DESIGN' },
  { kind: 'name', text: 'Anonymous' },
  { kind: 'spacer' },
  { kind: 'section', text: 'VOICE ACTING' },
  { kind: 'name', text: 'VOICEVOX' },
  { kind: 'spacer' },
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

function ScrollCredits({ title, items, durationSec }: { title: string; items: CreditItem[]; durationSec: number }) {
  return (
    <div className={styles.scrollWrap} style={{ animationDuration: `${durationSec}s` }}>
      {[{ kind: 'mainTitle' as const, text: title }, ...items].map((item, i) => {
        if (item.kind === 'mainTitle') return <div key={i} className={styles.creditMainTitle}>{item.text}</div>;
        if (item.kind === 'section') return <div key={i} className={styles.creditSection}>{item.text}</div>;
        if (item.kind === 'name') return <div key={i} className={styles.creditName}>{item.text}</div>;
        return <div key={i} className={styles.creditSpacer} />;
      })}
    </div>
  );
}

function CgMontage({ frames }: { frames: CgFrame[] }) {
  const { resolveAsset } = useAssets();
  const displayFrames = frames.slice(0, 4);
  const frameDuration = PHASE1_MS / Math.max(displayFrames.length, 1);

  return (
    <div className={styles.imageStage}>
      {displayFrames.map((frame, i) => {
        const src = resolveAsset(frame.src);
        return (
          <div
            key={`${frame.src}-${i}`}
            className={`${styles.cgFrame} ${i === displayFrames.length - 1 ? styles.cgFrameLast : ''}`}
            style={{
              animationDelay: `${i * frameDuration}ms`,
              animationDuration: `${PHASE1_MS}ms`,
            }}
          >
            <img className={styles.backdropImg} src={src} alt="" />
            <img className={styles.wideImg} src={src} alt="" />
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  frames: CgFrame[];
  title?: string;
  onTitle: () => void;
}

export function EndingSequence({ frames, title = '赤羽の一日', onTitle }: Props) {
  const [phase, setPhase] = useState<1 | 2>(1);
  const displayFrames = frames.slice(0, 4);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), PHASE1_MS);
    const t2 = setTimeout(onTitle, PHASE1_MS + PHASE2_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.root}>
      <CgMontage frames={displayFrames} />
      <div className={styles.vignette} />
      <div className={styles.creditsLayer}>
        <ScrollCredits title={title} items={CREDIT_ITEMS} durationSec={PHASE1_MS / 1000} />
      </div>
      {phase === 2 && <div className={styles.finText}>Fin</div>}
    </div>
  );
}
