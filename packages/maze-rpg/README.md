# @novel-engine/maze-rpg

ウィザードリィ風の一人称ダンジョン探索エンジンです。`@novel-engine/hub` の `IGameEngine` として登録して使います。

## Install

```bash
npm install @novel-engine/maze-rpg @novel-engine/hub react react-dom
```

## Register

```tsx
import { MazeRpgEngine } from '@novel-engine/maze-rpg';

<GameHub
  engines={{
    novel: NovelEngineAdapter,
    maze_rpg: MazeRpgEngine,
  }}
  ...
/>
```

## YAML

```yaml
next_engine:
  id: maze_rpg
  config:
    map: dungeon_01
    name: 地下迷宮
    bgm: audio/bgm/dungeon.mp3
    battleBgm: audio/bgm/battle.mp3
  return_scene: scene_after_maze
```

`assetsBaseUrl`、ノベル側アイテム一覧、キャラクター復帰情報は `NovelEngineAdapter` が自動注入します。
敵画像を使う場合は利用側アプリの assets に `enemies/{enemyId}.png` を配置してください。

## Result Flags

- `explored_{map}`: 迷宮を探索した。
- `maze_floor_{map}`: 最後の階層。
- `maze_pos_{map}` / `maze_dir_{map}`: 再開用の座標と向き。
- `maze_visited_{map}` / `maze_triggered_{map}`: 探索済みマスと発火済みイベント。
- `maze_opened_seals_{map}` / `maze_opened_treasures_{map}`: 開封済みギミック。
