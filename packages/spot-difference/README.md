# @novel-engine/spot-difference

間違い探しミニゲームエンジンです。記号グリッドまたは利用側 assets の画像プールを使って出題します。

## Install

```bash
npm install @novel-engine/spot-difference @novel-engine/hub react react-dom
```

## Register

```tsx
import { SpotDifferenceEngine } from '@novel-engine/spot-difference';

<GameHub
  engines={{
    novel: NovelEngineAdapter,
    spot_difference: SpotDifferenceEngine,
  }}
  ...
/>
```

## YAML

```yaml
next_engine:
  id: spot_difference
  config:
    stageId: museum_spot
    title: 間違い探し
    targetCount: 5
    timeLimitMs: 45000
    imagePool:
      - cg/spot/base_01.png
      - cg/spot/base_02.png
  return_scene: scene_after_spot_difference
```

画像は利用側アプリの assets に置き、`assetsBaseUrl` からの相対パスで指定します。

## Result Flags

- `spot_difference_result` / `spot_difference_result_{stageId}`: `win` / `lose`。
- `spot_difference_score` / `spot_difference_score_{stageId}`: 発見数。
