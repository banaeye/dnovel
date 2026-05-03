import type { Enemy } from '../engine/types.js';

interface EnemySpriteProps {
  enemy: Enemy;
}

export function EnemySprite({ enemy }: EnemySpriteProps) {
  const hpRatio = enemy.maxHp > 0 ? enemy.hp / enemy.maxHp : 1;
  const opacity = 0.4 + hpRatio * 0.6;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* ダークハロー */}
      <div
        style={{
          position: 'absolute',
          width: 250,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,0,0,0.70) 0%, transparent 68%)',
        }}
      />
      <div style={{ position: 'relative', opacity, transition: 'opacity 0.5s' }}>
        {enemy.id === 'ghost'  && <GhostSvg />}
        {enemy.id === 'bat'    && <BatSvg />}
        {enemy.id === 'wraith' && <WraithSvg />}
        {!['ghost', 'bat', 'wraith'].includes(enemy.id) && <DefaultSvg />}
      </div>
    </div>
  );
}

function GhostSvg() {
  return (
    <svg width="110" height="118" viewBox="0 0 100 108">
      {/* 外周アウラ */}
      <ellipse cx="50" cy="52" rx="42" ry="48" fill="rgba(140,170,255,0.10)" />
      {/* ボディ — 丸い頭部 + スカラップ裾 */}
      <path
        d="M 18,80 L 18,44 Q 18,10 50,10 Q 82,10 82,44 L 82,80
           Q 74,95 65,80 Q 57,65 50,80 Q 43,95 34,80 Q 26,65 18,80 Z"
        fill="rgba(190,215,255,0.88)"
      />
      {/* 目ソケット */}
      <ellipse cx="36" cy="50" rx="10" ry="12" fill="rgba(12,6,28,0.95)" />
      <ellipse cx="64" cy="50" rx="10" ry="12" fill="rgba(12,6,28,0.95)" />
      {/* 紫の瞳 */}
      <ellipse cx="37" cy="51" rx="6"  ry="7"  fill="rgba(140,80,255,0.92)" />
      <ellipse cx="65" cy="51" rx="6"  ry="7"  fill="rgba(140,80,255,0.92)" />
      {/* ハイライト */}
      <circle cx="34" cy="47" r="2" fill="rgba(255,255,255,0.50)" />
      <circle cx="62" cy="47" r="2" fill="rgba(255,255,255,0.50)" />
    </svg>
  );
}

function BatSvg() {
  return (
    <svg width="190" height="108" viewBox="0 0 200 120">
      {/* 左翼 */}
      <path d="M 78,80 C 55,52 18,48 8,68 C 20,84 50,94 78,88 Z" fill="#2a0a3a" />
      {/* 右翼 */}
      <path d="M 122,80 C 145,52 182,48 192,68 C 180,84 150,94 122,88 Z" fill="#2a0a3a" />
      {/* 翼の膜スジ */}
      <path d="M 78,84 C 54,56 22,54 10,70" stroke="rgba(70,30,90,0.55)" strokeWidth="1.5" fill="none" />
      <path d="M 122,84 C 146,56 178,54 190,70" stroke="rgba(70,30,90,0.55)" strokeWidth="1.5" fill="none" />
      {/* 胴体 */}
      <ellipse cx="100" cy="84" rx="22" ry="26" fill="#1a0a2a" />
      {/* 頭 */}
      <circle cx="100" cy="60" r="16" fill="#1a0a2a" />
      {/* 耳 */}
      <polygon points="87,54 80,32 96,52" fill="#1a0a2a" />
      <polygon points="113,54 120,32 104,52" fill="#1a0a2a" />
      {/* 目 */}
      <circle cx="93"  cy="60" r="5" fill="#cc1010" />
      <circle cx="107" cy="60" r="5" fill="#cc1010" />
      <circle cx="92"  cy="58" r="2" fill="rgba(255,100,100,0.8)" />
      <circle cx="106" cy="58" r="2" fill="rgba(255,100,100,0.8)" />
    </svg>
  );
}

function WraithSvg() {
  return (
    <svg width="106" height="140" viewBox="0 0 100 132">
      {/* 外周アウラ */}
      <ellipse cx="50" cy="66" rx="46" ry="62" fill="rgba(50,0,70,0.22)" />
      {/* ローブ裾（ぼろぼろ） */}
      <path
        d="M 22,56
           Q 10,88  8,120 Q 17,112 22,122 Q 28,108 34,120
           Q 40,105 45,118 Q 50,128 55,118
           Q 60,105 66,120 Q 72,108 78,122 Q 83,112 92,120
           Q 90,88 78,56 Z"
        fill="#0d001e"
      />
      {/* フード（大きな暗い楕円） */}
      <ellipse cx="50" cy="38" rx="28" ry="32" fill="#0d001e" />
      {/* フード奥の影 */}
      <ellipse cx="50" cy="44" rx="20" ry="22" fill="rgba(3,0,10,0.65)" />
      {/* 橙の目 */}
      <ellipse cx="40" cy="38" rx="8" ry="6" fill="rgba(255,120,0,0.92)" />
      <ellipse cx="60" cy="38" rx="8" ry="6" fill="rgba(255,120,0,0.92)" />
      {/* 目の中心輝点 */}
      <ellipse cx="40" cy="38" rx="4" ry="3" fill="rgba(255,210,60,0.90)" />
      <ellipse cx="60" cy="38" rx="4" ry="3" fill="rgba(255,210,60,0.90)" />
    </svg>
  );
}

function DefaultSvg() {
  return (
    <svg width="90" height="110" viewBox="0 0 90 110">
      <rect x="15" y="15" width="60" height="80" rx="6" fill="rgba(180,160,100,0.70)" />
      <text x="45" y="68" textAnchor="middle" fontSize="42" fill="rgba(50,30,10,0.90)">?</text>
    </svg>
  );
}
