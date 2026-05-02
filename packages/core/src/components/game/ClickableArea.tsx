import type { ClickableArea as ClickableAreaDef } from '../../types/scene';
import type { FlagMap } from '../../types/flag';
import { evaluateCondition } from '../../engine/ConditionEvaluator';
import styles from './ClickableArea.module.css';

interface ClickableAreaProps {
  areas: ClickableAreaDef[];
  flags: FlagMap;
  inventory: string[];
  locationId: string;
  onClick: (areaId: string) => void;
  onClose: () => void;
}

export function ClickableAreaOverlay({
  areas,
  flags,
  inventory,
  locationId,
  onClick,
  onClose,
}: ClickableAreaProps) {
  const ctx = { flags, inventory, locationId };

  return (
    <div className={styles.root}>
      <div className={styles.hint}>
        {areas.length > 0 ? '調べる場所をクリックしてください' : '調べられるものはない'}
      </div>
      {areas
        .filter((area) => evaluateCondition(area.condition, ctx))
        .map((area) => (
          <div
            key={area.id}
            className={styles.area}
            style={{
              left: area.x,
              top: area.y,
              width: area.width,
              height: area.height,
            }}
            onClick={() => onClick(area.id)}
          >
            <span className={styles.label}>{area.label}</span>
          </div>
        ))}
      <button className={styles.closeBtn} onClick={onClose}>
        閉じる
      </button>
    </div>
  );
}
