import type { Enemy } from '../engine/types.js';

interface EnemySpriteProps {
  enemy: Enemy;
  assetsBaseUrl: string;
}

export function EnemySprite({ enemy, assetsBaseUrl }: EnemySpriteProps) {
  const hpRatio = enemy.maxHp > 0 ? enemy.hp / enemy.maxHp : 1;
  const opacity = 0.4 + hpRatio * 0.6;
  const src = `${assetsBaseUrl}/enemies/${enemy.id}.png`;

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
      <img
        src={src}
        alt={enemy.name}
        style={{
          position: 'relative',
          maxHeight: 180,
          maxWidth: 220,
          objectFit: 'contain',
          opacity,
          transition: 'opacity 0.5s',
          imageRendering: 'pixelated',
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </div>
  );
}
