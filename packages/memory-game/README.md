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
| 対戦 | `mode: duel` で相手と取得ペア数を競う |
| カード絵柄 | 飴・花・星・月・家・鐘・鳥・波（漢字） |

---

## インストール

```bash
npm install @novel-engine/memory-game @novel-engine/hub react react-dom
```

## GameHub への登録

{% raw %}
```tsx
import { MemoryGameEngine } from '@novel-engine/memory-game';

<GameHub
  engines={{
    novel: NovelEngineAdapter,
    memory_game: MemoryGameEngine,
  }}
  ...
/>
```
{% endraw %}

画像、BGM、VOICEVOX 音声はパッケージに同梱されません。利用側アプリの assets に置き、`assetsBaseUrl` からの相対パスで指定します。

---

## YAML からの呼び出し

```yaml
next_engine:
  id: memory_game
  config:
    stageId: museum_challenge   # 必須 — 結果フラグのサフィックスになる
    mode: duel                  # solo | duel（デフォルト solo）
    pairs: 6                    # 省略可（デフォルト 6）
    maxTurns: 20                # 省略可（デフォルト 20、0 = 無制限）
    title: 神経衰弱              # 省略可

    # --- duel 用キャラクター設定（characters.yaml と共用） ---
    # ID を指定すると name / faceImage / VoicevoxSpeakerId を自動解決
    playerCharacterId: char_hero
    opponentCharacterId: char_museum_staff
    # 個別に上書きしたい場合のみ指定（省略可）
    # playerName: ケン
    # playerFaceImage: characters/hero/hero_normal.png
    # playerVoicevoxSpeakerId: 2

    # --- セリフ（省略時はデフォルト文言） ---
    playerDialogue:             # ターン開始時
      - "どこだっけ……"
      - "えーと……"
    opponentDialogue:
      - "どれかしら……"
      - "ふふ、覚えてるかな"
      - "少し考えさせてね"
    playerMatchDialogue:        # ペア成立時
      - "やった！"
      - "そろった！"
    opponentMatchDialogue:
      - "いただき"
      - "ふふふ"
    playerMissDialogue:         # 不一致時
      - "あれ……"
      - "ちがった"
    opponentMissDialogue:
      - "おや"
      - "むむ……"

    backgroundImage: backgrounds/table.jpg  # テーブル背景画像（省略可）
  return_scene: scene_result    # ゲーム終了後に遷移するシーン
```

---

## セリフの仕組み（duel モード）

ゲーム中のイベントに応じてセリフが自動で切り替わります。

| イベント | 使われる設定キー |
|---------|----------------|
| ターン開始（思考中） | `playerDialogue` / `opponentDialogue` |
| ペア成立 | `playerMatchDialogue` / `opponentMatchDialogue` |
| 不一致（めくり失敗） | `playerMissDialogue` / `opponentMissDialogue` |

- 各配列からランダムに 1 行選んで下部のセリフ欄に表示します
- 省略した場合はデフォルト文言が表示されます
- セリフ欄はノベルと同じ形式（話者名タブ＋本文）

---

## 画面レイアウト（duel モード）

```
┌────────────────────────────────────┐
│         タイトルバー (36px)         │
├──────┬─────────────────────┬───────┤
│ プレイ│                     │  相手 │
│ ヤー │   カードグリッド     │       │
│  絵  │   4×3（120px高）    │  絵   │
│      │                     │       │
│ スコア│                     │ スコア│
├──────┴─────────────────────┴───────┤
│ 「話者名」                          │
│  セリフテキスト（イベント別）        │
└────────────────────────────────────┘
```

- 左右パネル：キャラクター画像大きめ表示、アクティブ時は明るく、非アクティブは暗く
- 下部セリフ欄：ターン開始・成功・失敗で自動更新

---

## 終了時に書き込まれるフラグ

| フラグ名 | 値 | 意味 |
|---------|-----|------|
| `memory_game_result_{stageId}` | `'win'` | 全ペアを揃えた（duel は取得数で判定） |
| `memory_game_result_{stageId}` | `'lose'` | 手数切れ、または相手に負けた |
| `memory_game_player_pairs_{stageId}` | 数値 | プレイヤーが取得したペア数 |
| `memory_game_opponent_pairs_{stageId}` | 数値 | 対戦相手が取得したペア数 |

`mode: duel` では全ペア取得後、プレイヤーの取得数が相手より多い場合に `win`、同点以下は `lose` になります。

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
