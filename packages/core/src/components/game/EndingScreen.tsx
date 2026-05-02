import styles from './EndingScreen.module.css';

interface EndingScreenProps {
  onTitle: () => void;
}

export function EndingScreen({ onTitle }: EndingScreenProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.scroll} onAnimationEnd={onTitle}>
        <div className={styles.mainTitle}>赤羽の一日</div>

        <div className={styles.section}>シナリオ</div>
        <div className={styles.name}>CoderDojo赤羽</div>

        <div className={styles.spacer} />

        <div className={styles.section}>プログラム</div>
        <div className={styles.name}>CoderDojo赤羽</div>

        <div className={styles.spacer} />

        <div className={styles.section}>キャラクター</div>
        <div className={styles.name}>ケン</div>
        <div className={styles.name}>ユイ</div>
        <div className={styles.name}>田村のおばあさん</div>
        <div className={styles.name}>田中メンター</div>
        <div className={styles.name}>大学生</div>

        <div className={styles.spacer} />

        <div className={styles.section}>スペシャルサンクス</div>
        <div className={styles.name}>赤羽のみなさん</div>

        <div className={styles.fin}>Fin</div>
      </div>


    </div>
  );
}
