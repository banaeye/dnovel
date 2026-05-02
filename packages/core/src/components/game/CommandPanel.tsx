import type { CommandDefinition } from '../../types/command';
import styles from './CommandPanel.module.css';

interface CommandPanelProps {
  commands: CommandDefinition[];
  onSelect: (commandId: string) => void;
}

export function CommandPanel({ commands, onSelect }: CommandPanelProps) {
  return (
    <div className={styles.root}>
      <div className={styles.commands}>
        {commands.map((cmd) => (
          <button
            key={cmd.id}
            className={styles.cmd}
            onClick={() => onSelect(cmd.id)}
            title={cmd.description}
          >
            {cmd.label}
          </button>
        ))}
      </div>
    </div>
  );
}
