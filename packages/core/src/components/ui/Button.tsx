import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
}

export function Button({ label, onClick, disabled, size = 'normal' }: ButtonProps) {
  const sizeClass =
    size === 'large' ? styles.btnLarge : size === 'small' ? styles.btnSmall : '';

  return (
    <button
      className={`${styles.btn} ${sizeClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
