# @novel-engine/timing-game

タイミング入力ミニゲームエンジンです。バーの成功範囲に合わせて入力し、必要ヒット数を目指します。

## Install

```bash
npm install @novel-engine/timing-game @novel-engine/hub react react-dom
```

## Register

```tsx
import { TimingGameEngine } from '@novel-engine/timing-game';

<GameHub
  engines={{
    novel: NovelEngineAdapter,
    timing_game: TimingGameEngine,
  }}
  ...
/>
```

## YAML

```yaml
next_engine:
  id: timing_game
  config:
    stageId: shrine_timing
    title: タイミング勝負
    rounds: 6
    targetHits: 4
    bgm: audio/bgm/tension.mp3
  return_scene: scene_after_timing
```

BGM は利用側アプリの assets に置き、`assetsBaseUrl` からの相対パスで指定します。

## Result Flags

- `timing_game_result` / `timing_game_result_{stageId}`: `win` / `lose`。
- `timing_game_hits` / `timing_game_hits_{stageId}`: 成功回数。
