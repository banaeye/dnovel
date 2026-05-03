import type { MazeState, BattleState } from './types.js';
import { findStart } from './mazeEngine.js';
import { randomEnemy } from './enemies.js';

export function startBattle(state: MazeState): MazeState {
  const enemy = randomEnemy(state.mapId);
  if (!enemy) return state;
  const battle: BattleState = {
    enemy,
    phase: 'select',
    log: [`${enemy.name} が現れた！`],
    cursorIndex: 0,
    guarding: false,
  };
  return { ...state, battle };
}

function enemyAttack(state: MazeState): MazeState {
  const { battle } = state;
  if (!battle) return state;
  const dmg = Math.max(1, battle.enemy.atk - (battle.guarding ? state.playerDef * 2 : state.playerDef));
  const newHp = state.playerHp - dmg;
  const log = [...battle.log, `${battle.enemy.name} の攻撃！ ケン に ${dmg} ダメージ！`];
  if (newHp <= 0) {
    return {
      ...state,
      playerHp: 0,
      battle: { ...battle, phase: 'lose', log: [...log, 'ケン は倒れた……'], guarding: false },
    };
  }
  return {
    ...state,
    playerHp: newHp,
    battle: { ...battle, phase: 'log', log, guarding: false },
  };
}

function executeCommand(state: MazeState): MazeState {
  const { battle } = state;
  if (!battle) return state;

  if (battle.cursorIndex === 2) {
    if (Math.random() < 0.5) {
      return { ...state, battle: null };
    }
    const log = [...battle.log, '逃げられなかった！'];
    return enemyAttack({ ...state, battle: { ...battle, log, guarding: false } });
  }

  if (battle.cursorIndex === 1) {
    const log = [...battle.log, 'ケン は身を守った！'];
    return enemyAttack({ ...state, battle: { ...battle, log, guarding: true } });
  }

  const dmg = Math.max(1, state.playerAtk - battle.enemy.def);
  const newEnemyHp = battle.enemy.hp - dmg;
  const log = [...battle.log, `ケン の攻撃！ ${battle.enemy.name} に ${dmg} ダメージ！`];

  if (newEnemyHp <= 0) {
    const enemy = { ...battle.enemy, hp: 0 };
    return {
      ...state,
      battle: { ...battle, enemy, phase: 'win', log: [...log, `${battle.enemy.name} を倒した！`], guarding: false },
    };
  }

  const enemy = { ...battle.enemy, hp: newEnemyHp };
  return enemyAttack({ ...state, battle: { ...battle, enemy, log, guarding: false } });
}

function resetMaze(state: MazeState): MazeState {
  const pos = findStart(state.map);
  return {
    ...state,
    pos,
    dir: 'N',
    visited: new Set([`${pos.x},${pos.y}`]),
    atExit: false,
    steps: 0,
    playerHp: state.playerMaxHp,
    battle: null,
  };
}

export function handleBattleKey(state: MazeState, key: string): MazeState {
  const { battle } = state;
  if (!battle) return state;

  const confirm = key === 'Enter' || key === ' ';
  const up   = key === 'ArrowUp'   || key === 'w' || key === 'W';
  const down = key === 'ArrowDown' || key === 's' || key === 'S';

  if (battle.phase === 'select') {
    if (up)      return { ...state, battle: { ...battle, cursorIndex: (battle.cursorIndex + 2) % 3 } };
    if (down)    return { ...state, battle: { ...battle, cursorIndex: (battle.cursorIndex + 1) % 3 } };
    if (confirm) return executeCommand(state);
    return state;
  }

  if (!confirm) return state;

  if (battle.phase === 'log')  return { ...state, battle: { ...battle, phase: 'select', log: [] } };
  if (battle.phase === 'win')  return { ...state, battle: null };
  if (battle.phase === 'lose') return resetMaze(state);
  return state;
}
