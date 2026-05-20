# @novel-engine/flash-calc

フラッシュ暗算ミニゲームエンジンです。`@novel-engine/hub` に登録し、ノベルの `next_engine` から呼び出します。

## Install

```bash
npm install @novel-engine/flash-calc @novel-engine/hub react react-dom
```

## Register

```tsx
import { FlashCalcEngine } from '@novel-engine/flash-calc';

<GameHub
  engines={{
    novel: NovelEngineAdapter,
    flash_calc: FlashCalcEngine,
  }}
  ...
/>
```

## YAML

```yaml
next_engine:
  id: flash_calc
  config:
    difficulty: normal
    rounds: 5
  return_scene: scene_after_flash_calc
```

## Result Flags

- `flash_calc_score`: 正解数。
- `flash_calc_rounds`: 出題数。
- `flash_calc_passed`: 合格ラインを超えたかどうか。
