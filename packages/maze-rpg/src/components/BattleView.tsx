import type { MazeState } from '../engine/types.js';
import type { MazeTheme } from '../MazeApp.js';

const COMMANDS = ['攻撃', '防御', '逃げる'];

function HpBar({ hp, maxHp, color }: { hp: number; maxHp: number; color: string }) {
  const pct = Math.max(0, Math.min(1, maxHp > 0 ? hp / maxHp : 0));
  return (
    <div style={{ height: 6, background: '#2a2020', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${pct * 100}%`, height: '100%', background: color, transition: 'width 0.2s' }} />
    </div>
  );
}

interface BattleViewProps {
  state: MazeState;
  theme: Required<MazeTheme>;
  playerName?: string;
  onSelectCommand?: (index: number) => void;
  onCommand?: (index: number) => void;
  onAdvance?: () => void;
}

export function BattleView({
  state,
  theme,
  playerName = 'ケン',
  onSelectCommand,
  onCommand,
  onAdvance,
}: BattleViewProps) {
  const { battle } = state;
  if (!battle) return null;

  const sep = <div style={{ borderTop: `1px solid ${theme.uiBorder}`, flexShrink: 0 }} />;

  return (
    <div
      style={{
        width: '100%',
        background: theme.uiBg,
        color: theme.uiAccent,
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flexShrink: 0,
      }}
    >
      {sep}

      {/* HP バー 2列 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
            <span>{battle.enemy.name}</span>
            <span style={{ opacity: 0.65 }}>HP {battle.enemy.hp}/{battle.enemy.maxHp}</span>
          </div>
          <HpBar hp={battle.enemy.hp} maxHp={battle.enemy.maxHp} color="#e05050" />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
            <span>{playerName}</span>
            <span style={{ opacity: 0.65 }}>HP {state.playerHp}/{state.playerMaxHp}</span>
          </div>
          <HpBar hp={state.playerHp} maxHp={state.playerMaxHp} color="#50c050" />
        </div>
      </div>

      {sep}

      {/* コマンドボタン（select フェーズ）or フェーズ送りヒント */}
      {battle.phase === 'select' ? (
        <div style={{ display: 'flex', gap: 8 }}>
          {COMMANDS.map((cmd, i) => (
            <div
              key={cmd}
              onMouseEnter={() => onSelectCommand?.(i)}
              onClick={() => { onSelectCommand?.(i); onCommand?.(i); }}
              style={{
                flex: 1,
                fontSize: 13,
                padding: '5px 0',
                background: battle.cursorIndex === i ? theme.uiBorder : 'transparent',
                color: battle.cursorIndex === i ? theme.uiAccent : theme.uiBorder,
                border: `1px solid ${battle.cursorIndex === i ? theme.uiAccent : theme.uiBorder}`,
                borderRadius: 3,
                cursor: 'pointer',
                userSelect: 'none',
                textAlign: 'center' as const,
              }}
            >
              {cmd}
            </div>
          ))}
        </div>
      ) : (
        <div
          onClick={() => onAdvance?.()}
          style={{ fontSize: 12, color: theme.uiBorder, cursor: 'pointer', userSelect: 'none' }}
        >
          {battle.phase === 'win' || battle.phase === 'lose'
            ? '▶ クリック / [Enter] で続ける'
            : '▶ クリック / [Enter] でログを閉じる'}
        </div>
      )}

      {sep}

      {/* バトルログ */}
      <div
        onClick={battle.phase !== 'select' ? () => onAdvance?.() : undefined}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          cursor: battle.phase !== 'select' ? 'pointer' : 'default',
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
