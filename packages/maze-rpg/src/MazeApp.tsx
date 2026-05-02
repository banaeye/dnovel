import { useCallback, useEffect, useState } from 'react';
import type { IGameEngine, EngineProps, GameContext } from '@novel-engine/hub';
import { initMaze, handleKey } from './engine/mazeEngine.js';
import { MazeView } from './components/MazeView.js';
import { MiniMap } from './components/MiniMap.js';

export interface MazeRpgConfig {
  map: string;
}

const DIR_LABEL: Record<string, string> = { N: '北', E: '東', S: '南', W: '西' };

function useGameScale() {
  const get = () => Math.min(1, Math.min(window.innerWidth / 800, window.innerHeight / 600));
  const [scale, setScale] = useState(get);
  useEffect(() => {
    const update = () => setScale(get());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return scale;
}

function MazeAppComponent({ context, config, onExit }: EngineProps<MazeRpgConfig>) {
  const scale = useGameScale();
  const [state, setState] = useState(() => initMaze(config.map));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
      }
      setState(prev => handleKey(prev, e.key));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleExitKey = useCallback(
    (e: KeyboardEvent) => {
      if (!state.atExit) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const updatedContext: GameContext = {
        ...context,
        flags: { ...context.flags, [`explored_${config.map}`]: true },
      };
      onExit(updatedContext);
    },
    [state.atExit, context, config.map, onExit],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleExitKey);
    return () => window.removeEventListener('keydown', handleExitKey);
  }, [handleExitKey]);

  return (
    // NovelApp と同じ centering wrapper パターン
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#04030a',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 800,
          height: 600,
          flexShrink: 0,
          transformOrigin: 'center center',
          transform: `scale(${scale})`,
          background: '#080504',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'monospace',
          color: '#ccaa66',
          userSelect: 'none',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* タイトルバー */}
        <div
          style={{
            background: '#1a0f05',
            borderBottom: '1px solid #443322',
            padding: '4px 12px',
            fontSize: 13,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <span>⚔ 地下迷宮 — {config.map}</span>
          <span style={{ color: '#887755', fontSize: 11 }}>歩数: {state.steps}</span>
        </div>

        {/* メインエリア */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* 左: 3D ビュー */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 520px',
              padding: '0 20px',
              gap: 8,
            }}
          >
            <div
              style={{
                border: '2px solid #443322',
                boxShadow: '0 0 12px rgba(100,60,10,0.4)',
              }}
            >
              <MazeView state={state} />
            </div>

            <div style={{ fontSize: 11, color: '#665544', textAlign: 'center', lineHeight: 1.6 }}>
              <span>↑ 前進</span>
              {'　'}
              <span>↓ 後退</span>
              {'　'}
              <span>← 左回転</span>
              {'　'}
              <span>→ 右回転</span>
            </div>

            {state.atExit && (
              <div
                style={{
                  background: '#1a2a0a',
                  border: '1px solid #44aa22',
                  borderRadius: 4,
                  padding: '8px 16px',
                  color: '#88ff44',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                階段を見つけた！ [Enter] で地上へ戻る
              </div>
            )}
          </div>

          {/* 右: ミニマップ + コンパス */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              borderLeft: '1px solid #2a1a0a',
              padding: '8px 0',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '28px 28px 28px',
                gridTemplateRows: '28px 28px 28px',
                gap: 2,
                textAlign: 'center',
              }}
            >
              {['', 'N', ''].map((d, i) => <CompassCell key={`t${i}`} label={d} dir={state.dir} />)}
              {['W', '', 'E'].map((d, i) => <CompassCell key={`m${i}`} label={d} dir={state.dir} />)}
              {['', 'S', ''].map((d, i) => <CompassCell key={`b${i}`} label={d} dir={state.dir} />)}
            </div>

            <div style={{ fontSize: 13, color: '#aa8844' }}>
              向き: {DIR_LABEL[state.dir]}
            </div>

            <div style={{ border: '1px solid #332211' }}>
              <MiniMap state={state} />
            </div>

            <div style={{ fontSize: 10, color: '#554433' }}>
              ({state.pos.x}, {state.pos.y})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompassCell({ label, dir }: { label: string; dir: string }) {
  const active = label === dir;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? '#664400' : label ? '#1a1005' : 'transparent',
        border: label ? `1px solid ${active ? '#aa7722' : '#332211'}` : 'none',
        borderRadius: 2,
        color: active ? '#ffcc44' : '#554422',
        fontWeight: active ? 'bold' : 'normal',
        fontSize: 11,
      }}
    >
      {label}
    </div>
  );
}

export const MazeRpgEngine: IGameEngine<MazeRpgConfig> = {
  component: MazeAppComponent,
};
