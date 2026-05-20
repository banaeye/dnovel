# @novel-engine/hub

複数のゲームエンジンを 1 つの React アプリ内で切り替えるためのハブです。
`@novel-engine/core` の `NovelEngineAdapter` と、`IGameEngine` を実装したミニゲームを登録して使います。

## Install

```bash
npm install @novel-engine/hub @novel-engine/core react react-dom
```

## Basic Usage

{% raw %}
```tsx
import { GameHub, NovelEngineAdapter } from '@novel-engine/hub';
import { MazeRpgEngine } from '@novel-engine/maze-rpg';

<GameHub
  engines={{
    novel: NovelEngineAdapter,
    maze_rpg: MazeRpgEngine,
  }}
  initial={{
    engineId: 'novel',
    config: {
      masterData,
      assetsBaseUrl: '/assets',
      initialSceneId: 'scene_opening',
      initialLocationId: 'loc_start',
    },
  }}
  initialContext={{ flags: {}, inventory: [], playerStats: {} }}
/>
```
{% endraw %}

ノベルのシーンからは `next_engine` で登録済みエンジン ID を指定します。

```yaml
next_engine:
  id: maze_rpg
  config:
    map: dungeon_01
  return_scene: scene_after_maze
```

## Public API

- `GameHub`: 現在のエンジン、共有 `GameContext`、戻り先を管理する React コンポーネント。
- `NovelEngineAdapter`: `@novel-engine/core` の `NovelApp` を `IGameEngine` として扱うアダプタ。
- `IGameEngine<TConfig>`: 外部エンジンが実装するインターフェース。
- `EngineProps<TConfig>`: エンジンコンポーネントが受け取る `context` / `config` / `onExit`。
- `GameContext`: 全エンジンで共有する `flags` / `inventory` / `playerStats`。

## Custom Engine

```tsx
import type { IGameEngine, EngineProps } from '@novel-engine/hub';

interface MyConfig {
  stageId: string;
}

function MyEngineComponent({ context, config, onExit }: EngineProps<MyConfig>) {
  return (
    <button
      onClick={() => onExit({
        ...context,
        flags: { ...context.flags, [`my_engine_clear_${config.stageId}`]: true },
      })}
    >
      Finish
    </button>
  );
}

export const MyEngine: IGameEngine<MyConfig> = {
  component: MyEngineComponent,
};
```

`onExit(updatedContext)` を呼ぶと、`return_scene` がある場合はノベルへ戻ります。
別エンジンへ進めたい場合は `onExit(updatedContext, nextTransition)` を渡します。
