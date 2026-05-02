import { useAudioStore } from '../../store/audioStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useAudioStore();

  return (
    <Modal title="設定" onClose={onClose}>
      <div className={styles.body}>
        <div className={styles.row}>
          <label className={styles.label}>BGM 音量</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.bgmVolume}
            className={styles.slider}
            onChange={(e) => updateSettings({ bgmVolume: Number(e.target.value) })}
          />
          <span className={styles.val}>{Math.round(settings.bgmVolume * 100)}</span>
        </div>
        <div className={styles.row}>
          <label className={styles.label}>SE 音量</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.seVolume}
            className={styles.slider}
            onChange={(e) => updateSettings({ seVolume: Number(e.target.value) })}
          />
          <span className={styles.val}>{Math.round(settings.seVolume * 100)}</span>
        </div>
        <div className={styles.footer}>
          <Button label="閉じる" onClick={onClose} size="small" />
        </div>
      </div>
    </Modal>
  );
}
