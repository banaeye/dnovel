import type { LocationConnection } from '../../types/location';
import { Modal } from '../ui/Modal';
import styles from './MapView.module.css';

interface MapViewProps {
  connections: LocationConnection[];
  onMove: (locationId: string) => void;
  onClose: () => void;
}

export function MapView({ connections, onMove, onClose }: MapViewProps) {
  return (
    <Modal title="移動先を選択" onClose={onClose}>
      <div className={styles.list}>
        {connections.length === 0 ? (
          <p className={styles.empty}>移動できる場所がありません</p>
        ) : (
          connections.map((conn) => (
            <button
              key={conn.location_id}
              className={styles.item}
              onClick={() => onMove(conn.location_id)}
            >
              {conn.label}
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}
