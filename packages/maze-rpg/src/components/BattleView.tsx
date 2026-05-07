import { useState } from 'react';
import type { MazeState } from '../engine/types.js';
import type { MazeTheme } from '../MazeApp.js';

const COMMANDS = ['攻撃', '防御', 'アイテム', '逃げる'];

function HpBar({ hp, maxHp, color }: { hp: number; maxHp: number; color: string }) {
  const pct = Math.max(0, Math.min(1, maxHp > 0 ? hp / maxHp : 0));
  return (
    <div style={{ height: 8, background: '#2a2020', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${pct * 100}%`, height: '100%', background: color, transition: 'width 0.2s', borderRadius: 4 }} />
    </div>
  );
}

function CmdButton({ label, active, font, theme, onHover, onClick }: {
  label: string; active: boolean; font: string; theme: Required<MazeTheme>;
  onHover: () => void; onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const hi = active || hover;
  return (
    <div
      onMouseEnter={() => { setHover(true); onHover(); }}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        flex: 1,
        fontSize: 13,
        padding: '8px 0',
        background: hi ? theme.uiBorder : '#1a1008',
        color: theme.uiAccent,
        border: `1px solid ${hi ? theme.uiAccent : theme.uiBorder}`,
        borderRadius: 3,
        cursor: 'pointer',
        userSelect: 'none',
        textAlign: 'center' as const,
        fontFamily: font,
        transition: 'background 0.1s, border-color 0.1s',
      }}
    >
      {label}
    </div>
  );
}

interface BattleViewProps {
  state: MazeState;
  theme: Required<MazeTheme>;
  onSelectCommand?: (index: number) => void;
  onCommand?: (index: number) => void;
  font: string;
}

export function BattleView({ state, theme, onSelectCommand, onCommand, font }: BattleViewProps) {
  const { battle } = state;
  if (!battle) return null;
  const latest = battle.log.at(-1);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, fontFamily: font }}>
      {/* 敵HP */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: theme.uiAccent }}>
          <span>{battle.enemy.name}</span>
          <span style={{ opacity: 0.65 }}>HP {battle.enemy.hp}/{battle.enemy.maxHp}</span>
        </div>
        <HpBar hp={battle.enemy.hp} maxHp={battle.enemy.maxHp} color="#e05050" />
      </div>

      {/* コマンドボタン */}
      {battle.phase === 'select' ? (
        <div style={{ display: 'flex', gap: 6 }}>
          {COMMANDS.map((cmd, i) => (
            <CmdButton
              key={cmd}
              label={cmd}
              active={battle.cursorIndex === i}
              font={font}
              theme={theme}
              onHover={() => onSelectCommand?.(i)}
              onClick={() => { onSelectCommand?.(i); onCommand?.(i); }}
            />
          ))}
        </div>
      ) : battle.phase === 'win' ? (
        <div
          style={{ fontSize: 12, color: '#d8b8ff', opacity: 0.95, userSelect: 'none', textShadow: '0 0 8px rgba(180,120,255,0.65)' }}
        >
          撃破！
        </div>
      ) : (
        <div
          style={{ fontSize: 12, color: '#ff9090', opacity: 0.95, userSelect: 'none' }}
        >
          倒れてしまった……
        </div>
      )}

      {/* バトルログ */}
      <div style={{ borderTop: `1px solid ${theme.uiBorder}`, paddingTop: 6 }}>
        {latest && (
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              marginBottom: 5,
              color: '#f3dfaa',
              textShadow: '0 0 6px rgba(204,170,102,0.35)',
            }}
          >
            {latest}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxHeight: 74,
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.18)',
            border: `1px solid ${theme.uiBorder}`,
            borderRadius: 3,
            padding: '5px 6px',
          }}
        >
          {battle.log.slice(-5).map((line, i, arr) => (
            <div key={`${line}-${i}`} style={{ fontSize: 11, lineHeight: 1.35, opacity: 0.36 + ((i + 1) / arr.length) * 0.5 }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
