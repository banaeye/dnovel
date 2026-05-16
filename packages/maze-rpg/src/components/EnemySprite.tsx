import type { Enemy } from '../engine/types.js';
import { useState } from 'react';

interface EnemySpriteProps {
  enemy: Enemy;
  assetsBaseUrl: string;
  defeated?: boolean;
  onClick?: () => void;
}

export function EnemySprite({ enemy, assetsBaseUrl, defeated = false, onClick }: EnemySpriteProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hpRatio = enemy.maxHp > 0 ? enemy.hp / enemy.maxHp : 1;
  const opacity = 0.4 + hpRatio * 0.6;
  const src = `${assetsBaseUrl}/enemies/${enemy.id}.png`;
  const isBoss = enemy.id === 'maze_boss' || enemy.id === 'abyss_boss';
  const fallback = fallbackStyle(enemy.id, isBoss);

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
      {imageFailed && (
        <>
          <div
            aria-hidden="true"
            onClick={onClick && !defeated ? onClick : undefined}
            style={{
              position: 'absolute',
              width: isBoss ? 250 : 174,
              height: isBoss ? 270 : 188,
              clipPath: fallback.shape,
              background: fallback.body,
              opacity: opacity * 0.76,
              boxShadow: isBoss ? '0 0 34px rgba(210,60,120,0.72)' : '0 0 24px rgba(190,210,255,0.32)',
              transform: defeated ? 'scale(1.18) rotate(-3deg)' : undefined,
              transition: 'opacity 0.5s, transform 0.45s',
              pointerEvents: onClick && !defeated ? 'auto' : 'none',
              cursor: onClick && !defeated ? 'crosshair' : 'default',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: isBoss ? 112 : 70,
              height: isBoss ? 82 : 54,
              background: fallback.core,
              backgroundSize: enemy.id === 'skeleton' ? '50% 100%' : undefined,
              backgroundPosition: enemy.id === 'skeleton' ? '0 0, 100% 0' : undefined,
              backgroundRepeat: 'no-repeat',
              opacity: opacity * 0.72,
              color: 'rgba(255,255,255,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isBoss ? 46 : 28,
              fontFamily: 'serif',
              textShadow: '0 0 10px rgba(255,255,255,0.55)',
              pointerEvents: 'none',
            }}
          >
            {fallback.mark}
          </div>
        </>
      )}
      <img
        src={src}
        alt={enemy.name}
        style={{
          position: 'relative',
          display: imageFailed ? 'none' : 'block',
          maxHeight: isBoss ? 330 : 224,
          maxWidth: isBoss ? 360 : 270,
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
        onError={() => setImageFailed(true)}
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

function fallbackStyle(enemyId: string, isBoss: boolean): { body: string; core: string; shape: string; mark: string } {
  if (enemyId === 'skeleton') {
    return {
      body: 'linear-gradient(180deg, rgba(235,235,220,0.92), rgba(120,120,110,0.78))',
      core: 'radial-gradient(circle, rgba(40,40,35,0.92) 0 18%, transparent 20%), radial-gradient(circle, rgba(40,40,35,0.92) 0 18%, transparent 20%)',
      shape: 'polygon(50% 0%, 76% 22%, 68% 55%, 88% 100%, 50% 82%, 12% 100%, 32% 55%, 24% 22%)',
      mark: '☠',
    };
  }
  if (enemyId === 'zombie') {
    return {
      body: 'linear-gradient(180deg, rgba(115,145,95,0.96), rgba(45,65,38,0.86))',
      core: 'radial-gradient(circle, rgba(145,30,45,0.8) 0 12%, transparent 14%)',
      shape: 'polygon(43% 0%, 70% 8%, 88% 42%, 78% 100%, 50% 86%, 20% 100%, 10% 42%)',
      mark: 'Z',
    };
  }
  if (enemyId === 'slime') {
    return {
      body: 'radial-gradient(circle at 44% 32%, rgba(180,255,220,0.95), rgba(40,180,135,0.82) 42%, rgba(8,64,52,0.88))',
      core: 'radial-gradient(circle, rgba(255,255,255,0.85) 0 12%, transparent 14%)',
      shape: 'ellipse(48% 42% at 50% 58%)',
      mark: '●',
    };
  }
  return {
    body: isBoss
      ? 'radial-gradient(circle, rgba(120,0,30,0.95), rgba(25,0,18,0.9) 64%, rgba(0,0,0,0.7))'
      : 'radial-gradient(circle, rgba(100,80,140,0.88), rgba(10,8,25,0.82))',
    core: 'radial-gradient(circle, rgba(255,210,255,0.85) 0 10%, transparent 12%)',
    shape: 'ellipse(42% 48% at 50% 50%)',
    mark: isBoss ? '怨' : '影',
  };
}
