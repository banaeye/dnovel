import type { SceneChoice } from '../../types/scene';
import type { FlagMap } from '../../types/flag';
import { evaluateCondition } from '../../engine/ConditionEvaluator';
import styles from './ChoiceList.module.css';

interface ChoiceListProps {
  choices: SceneChoice[];
  flags: FlagMap;
  inventory: string[];
  locationId: string;
  onSelect: (index: number) => void;
}

export function ChoiceList({ choices, flags, inventory, locationId, onSelect }: ChoiceListProps) {
  const ctx = { flags, inventory, locationId };
  const visible = choices
    .map((c, i) => ({ choice: c, originalIndex: i }))
    .filter(({ choice }) => evaluateCondition(choice.condition, ctx));

  return (
    <div className={styles.root}>
      <div className={styles.box}>
        {visible.map(({ choice, originalIndex }) => (
          <button
            key={originalIndex}
            className={styles.choice}
            onClick={() => onSelect(originalIndex)}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}
