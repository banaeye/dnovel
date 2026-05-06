import type { Enemy } from '../engine/types.js';

interface EnemySpriteProps {
  enemy: Enemy;
  assetsBaseUrl: string;
}

export function EnemySprite({ enemy, assetsBaseUrl }: EnemySpriteProps) {
  const hpRatio = enemy.maxHp > 0 ? enemy.hp / enemy.maxHp : 1;
  const opacity = 0.4 + hpRatio * 0.6;
  const src = `${assetsBaseUrl}/enemies/${enemy.id}.png`;
  const isBoss = enemy.id === 'maze_boss';

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
          width: isBoss ? 380 : 250,
          height: isBoss ? 340 : 220,
          borderRadius: '50%',
          background: isBoss
            ? 'radial-gradient(circle, rgba(80,0,0,0.80) 0%, rgba(0,0,0,0.60) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,0,0,0.70) 0%, transparent 68%)',
        }}
      />
      <img
        src={src}
        alt={enemy.name}
        style={{
          position: 'relative',
          maxHeight: isBoss ? 280 : 180,
          maxWidth: isBoss ? 300 : 220,
          objectFit: 'contain',
          opacity,
          transition: 'opacity 0.5s',
          imageRendering: 'pixelated',
          filter: isBoss ? `drop-shadow(0 0 18px rgba(200,0,0,${0.3 + hpRatio * 0.5}))` : undefined,
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </div>
  );
}
