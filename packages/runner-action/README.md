# @novel-engine/runner-action

800x600 固定画面のランナーアクションエンジンです。`collect` と `chase` モードを持ち、`@novel-engine/hub` に登録して使います。

## Install

```bash
npm install @novel-engine/runner-action @novel-engine/hub react react-dom
```

## Register

```tsx
import { RunnerActionEngine } from '@novel-engine/runner-action';

<GameHub
  engines={{
    novel: NovelEngineAdapter,
    runner_action: RunnerActionEngine,
  }}
  ...
/>
```

## YAML

```yaml
next_engine:
  id: runner_action
  config:
    stageId: park_chase
    mode: chase
    durationMs: 30000
    bgm: audio/bgm/chase.mp3
    backgroundImage: backgrounds/park.jpg
    playerImage: characters/hero/normal.png
  return_scene: scene_after_runner
```

画像と BGM は利用側アプリの assets に置き、`assetsBaseUrl` からの相対パスで指定します。

## Result Flags

- `cleared_runner_action` / `cleared_runner_action_{stageId}`: プレイ完了。
- `runner_action_score` / `runner_action_score_{stageId}`: スコア。
- `runner_action_penalties` / `runner_action_penalties_{stageId}`: ミス数。
- `runner_action_result` / `runner_action_result_{stageId}`: `complete` / `win` / `lose`。
- `runner_action_distance` / `runner_action_distance_{stageId}`: chase モードの残り距離。
