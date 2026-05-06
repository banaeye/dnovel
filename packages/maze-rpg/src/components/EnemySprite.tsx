import type { Enemy } from '../engine/types.js';

interface EnemySpriteProps {
  enemy: Enemy;
  assetsBaseUrl: string;
  defeated?: boolean;
  onClick?: () => void;
}

export function EnemySprite({ enemy, assetsBaseUrl, defeated = false, onClick }: EnemySpriteProps) {
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
          transition: 'opacity 0.5s, transform 0.45s, filter 0.45s',
          imageRendering: 'pixelated',
          transform: defeated ? 'scale(1.18) rotate(-3deg)' : undefined,
          pointerEvents: onClick && !defeated ? 'auto' : 'none',
          cursor: onClick && !defeated ? 'crosshair' : 'default',
          filter: defeated
            ? 'brightness(2.3) saturate(0) blur(2px) drop-shadow(0 0 28px rgba(220,180,255,0.95))'
            : isBoss ? `drop-shadow(0 0 18px rgba(200,0,0,${0.3 + hpRatio * 0.5}))` : undefined,
        }}
        title={onClick && !defeated ? `${enemy.name}を攻撃` : undefined}
        onClick={onClick}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      {defeated && (
        <div
          style={{
            position: 'absolute',
            width: isBoss ? 360 : 250,
            height: isBoss ? 300 : 210,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(180,120,255,0.5) 26%, transparent 68%)',
            mixBlendMode: 'screen',
            animation: 'maze-enemy-burst 650ms ease-out forwards',
          }}
        />
      )}
    </div>
  );
}
