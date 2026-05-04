# @novel-engine/memory-game

神経衰弱（神経衰弱カードゲーム）エンジン。  
`@novel-engine/hub` の `IGameEngine` を実装し、ノベルシーンから呼び出して遊べます。

---

## 概要

| 項目 | 内容 |
|------|------|
| グリッド | 4 列 × 3 行（6 ペア・12 枚）デフォルト |
| ペア数 | `pairs` で変更可（最大 8 ペアまで）|
| 手数制限 | `maxTurns` 手以内に全ペアを揃えると勝利（0 = 無制限） |
| カード絵柄 | 飴・花・星・月・家・鐘・鳥・波（漢字） |

---

## YAML からの呼び出し

```yaml
next_engine:
  id: memory_game
  config:
    stageId: museum_challenge   # 必須 — 結果フラグのサフィックスになる
    pairs: 6                    # 省略可（デフォルト 6）
    maxTurns: 20                # 省略可（デフォルト 20、0 = 無制限）
    title: 神経衰弱              # 省略可（画面上部に表示するタイトル）
  return_scene: scene_result    # ゲーム終了後に遷移するシーン
```

---

## 終了時に書き込まれるフラグ

| フラグ名 | 値 | 意味 |
|---------|-----|------|
| `memory_game_result_{stageId}` | `'win'` | 全ペアを手数制限内に揃えた |
| `memory_game_result_{stageId}` | `'lose'` | 手数を使い切った |

---

## 勝敗による分岐（YAML 例）

`return_scene` に指定したシーンで `branches.type: auto` を使って振り分けます。

```yaml
- id: scene_result
  location_id: loc_museum
  background: backgrounds/museum.jpg
  messages: []
  branches:
    type: auto
    choices:
      - condition:
          flag: memory_game_result_museum_challenge
          value: win
        next_scene: scene_win
      - condition: null
        next_scene: scene_lose
```

---

## 操作

| 操作 | 動作 |
|------|------|
| カードをクリック | 表向きにする |
| 2 枚めくって一致 | そのまま表向きを維持（ペア成立） |
| 2 枚めくって不一致 | 0.9 秒後に裏に戻る（1 手消費） |
| 全ペア成立 | 勝利オーバーレイ → 2.5 秒後に `return_scene` へ |
| 手数上限到達 | 敗北オーバーレイ → 2.5 秒後に `return_scene` へ |

---

## App.tsx への組み込み

```tsx
import { MemoryGameEngine } from '@novel-engine/memory-game';

<GameHub
  engines={{
    novel:        NovelEngineAdapter,
    memory_game:  MemoryGameEngine,
    // ...
  }}
  ...
/>
```

---

## vite.config.ts のエイリアス（モノレポ開発時）

```typescript
'@novel-engine/memory-game': path.resolve(__dirname, 'packages/memory-game/src/index.ts'),
```
