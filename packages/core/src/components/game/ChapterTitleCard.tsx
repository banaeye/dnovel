import { useEffect } from 'react';
import type { ChapterConfig } from '../../types/chapter';

const JP_NUMS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

const AUTO_DISMISS_MS = 4500;

interface ChapterTitleCardProps {
  chapter: ChapterConfig;
  chapterIndex: number;
  onDismiss: () => void;
}

export function ChapterTitleCard({ chapter, chapterIndex, onDismiss }: ChapterTitleCardProps) {
  const num = JP_NUMS[chapterIndex] ?? String(chapterIndex + 1);

  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDismiss]);

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#06060a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        cursor: 'pointer',
        userSelect: 'none',
        animation: 'chapterFadeIn 0.9s ease-out both',
      }}
    >
      <style>{`
        @keyframes chapterFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* 上飾り線 */}
      <div style={{
        width: 160,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(204,170,102,0.5), transparent)',
        marginBottom: 28,
      }} />

      {/* 章番号 */}
      <div style={{
        fontFamily: 'serif',
        fontSize: 14,
        letterSpacing: '0.5em',
        color: 'rgba(204,170,102,0.65)',
        marginBottom: 20,
      }}>
        第{num}章
      </div>

      {/* 章タイトル */}
      <div style={{
        fontFamily: 'serif',
        fontSize: 34,
        letterSpacing: '0.18em',
        color: '#ede0c0',
        textShadow: '0 0 40px rgba(204,170,102,0.25)',
        marginBottom: chapter.subtitle ? 14 : 0,
      }}>
        {chapter.chapterTitle}
      </div>

      {/* サブタイトル */}
      {chapter.subtitle && (
        <div style={{
          fontFamily: 'serif',
          fontSize: 13,
          letterSpacing: '0.25em',
          color: 'rgba(204,170,102,0.55)',
          marginTop: 4,
        }}>
          {chapter.subtitle}
        </div>
      )}

      {/* 下飾り線 */}
      <div style={{
        width: 160,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(204,170,102,0.5), transparent)',
        marginTop: 28,
      }} />

      {/* 操作ヒント */}
      <div style={{
        position: 'absolute',
        bottom: 22,
        fontSize: 11,
        letterSpacing: '0.08em',
        color: 'rgba(204,170,102,0.28)',
      }}>
        クリック / [Enter] で続ける
      </div>
    </div>
  );
}
