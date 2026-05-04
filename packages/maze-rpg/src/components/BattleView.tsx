import { useState } from 'react';
import type { MazeState } from '../engine/types.js';
import type { MazeTheme } from '../MazeApp.js';

const COMMANDS = ['攻撃', '防御', '逃げる'];

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
  onAdvance?: () => void;
  font: string;
}

export function BattleView({ state, theme, onSelectCommand, onCommand, onAdvance, font }: BattleViewProps) {
  const { battle } = state;
  if (!battle) return null;

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

      {/* コマンドボタン or 続けるヒント */}
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
      ) : (
        <div
          onClick={() => onAdvance?.()}
          style={{ fontSize: 12, color: theme.uiAccent, opacity: 0.8, cursor: 'pointer', userSelect: 'none' }}
        >
          {battle.phase === 'win' || battle.phase === 'lose'
            ? '▶ クリック / [Enter] で続ける'
            : '▶ クリック / [Enter] でログを閉じる'}
        </div>
      )}

      {/* バトルログ */}
      <div
        onClick={battle.phase !== 'select' ? () => onAdvance?.() : undefined}
        style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          cursor: battle.phase !== 'select' ? 'pointer' : 'default',
          borderTop: `1px solid ${theme.uiBorder}`,
          paddingTop: 4,
        }}
      >
        {battle.log.slice(-3).map((line, i, arr) => (
          <div key={i} style={{ fontSize: 12, opacity: i === arr.length - 1 ? 1 : 0.5 }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
