import type { ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        )}
        {title && <div className={styles.title}>{title}</div>}
        {children}
      </div>
    </div>
  );
}
