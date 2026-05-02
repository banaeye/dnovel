import { useState, useEffect, useRef } from 'react';
import styles from './TextWriter.module.css';

interface TextWriterProps {
  text: string;
  speed: number;
  onComplete?: () => void;
  instant?: boolean;
}

export function TextWriter({ text, speed, onComplete, instant }: TextWriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    if (instant || speed === 0) {
      setDisplayed(text);
      setDone(true);
      onComplete?.();
      return;
    }

    const ms = Math.max(1, Math.floor(1000 / speed));
    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
        onComplete?.();
      }
    }, ms);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, instant]);

  void done;

  return <span className={styles.root}>{displayed}</span>;
}
