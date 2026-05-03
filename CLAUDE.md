# Novel Game Engine — CLAUDE.md

ReactJS + YAML で作るアドベンチャー/ノベルゲームエンジン。
このファイルはエンジンの設計・スキーマ・開発フローを記述する。

別のゲームを作るには `@novel-engine/core` をインストールし、
`parseMasterData()` に YAML 文字列を渡して `<NovelApp>` を使う（詳細は [packages/core/README.md](packages/core/README.md)）。

---

## 技術スタック

| 項目 | 採用技術 |
|------|---------|
| フレームワーク | React 18 + TypeScript (Vite) |
| 状態管理 | Zustand |
| データ定義 | YAML (js-yaml、Vite `?raw` import) |
| スタイリング | CSS Modules |
| 音声 | VOICEVOX Engine (ローカル) + 事前生成 wav |
| デプロイ | GitHub Pages (`/dojonovel/` base path) |

---

## プロジェクト構造（モノレポ）

```
novel/
├── packages/
│   ├── core/          @novel-engine/core  ← エンジン本体（npm パッケージ）
│   │   ├── src/index.ts                    公開 API エントリ
│   │   ├── src/components/NovelApp.tsx     最上位コンポーネント
│   │   ├── src/engine/                     純粋関数コアロジック
│   │   ├── src/store/gameStore.ts          Zustand ストアファクトリ
│   │   ├── src/loaders/dataLoader.ts       YAML パーサ（?raw なし）
│   │   ├── vite.config.ts                  library mode ビルド設定
│   │   └── README.md                       利用者向けドキュメント
│   ├── editor/        @novel-engine/editor ← 開発エディタ（npm パッケージ）
│   │   ├── src/index.ts
│   │   └── vite.config.ts
│   ├── hub/           @novel-engine/hub   ← マルチエンジンハブ（npm パッケージ）
│   │   ├── src/types.ts                    共通インターフェース定義
│   │   ├── src/GameHub.tsx                 エンジン切り替えコンポーネント
│   │   ├── src/novel/NovelEngineAdapter.tsx @novel-engine/core のアダプタ
│   │   ├── src/index.ts                    公開 API エントリ
│   │   └── vite.config.ts
│   └── maze-rpg/      @novel-engine/maze-rpg ← ウィザードリィ風迷路エンジン
│       ├── src/index.ts
│       ├── src/MazeApp.tsx                 800×600 コンテナ・入力ハンドリング
│       ├── src/engine/types.ts             Dir / Vec2 / MazeState
│       ├── src/engine/maps.ts              BUILT_IN_MAPS（dungeon_01 など）
│       ├── src/engine/mazeEngine.ts        純粋関数（移動・壁判定・視野計算）
│       ├── src/components/MazeView.tsx     Canvas 480×320 一人称透視レンダラ
│       └── src/components/MiniMap.tsx      Canvas 俯瞰マップ
├── src/               「赤羽の一日」本体ゲーム（packages/core の参照実装）
│   ├── data/          YAMLゲームデータ（シナリオ・マスター・フラグ定義）
│   ├── loaders/       demoLoader.ts（?raw import あり、デモ専用）
│   ├── editor/        ゲーム管理エディタ（ローカル開発専用）
│   └── App.tsx        エントリ（NovelApp を直接使用）
├── demo/              ローカル統合デモ（GameHub を使ったサンプル）
│   ├── src/
│   │   ├── App.tsx    GameHub + NovelEngineAdapter + スタブRPG
│   │   └── data/      簡易ゲームデータ（「ある日の古本屋」4シーン）
│   ├── vite.config.ts  ← packages/core・hub をソースエイリアスで参照
│   └── package.json    独立した npm プロジェクト（ワークスペース外）
└── public/assets/
    ├── backgrounds/   背景画像
    ├── characters/    キャラクタースプライト {id}/*.png
    ├── cg/            一枚絵・CG
    ├── audio/         BGM / SE / voicevox
    └── voicevox/      事前生成音声 {hash}.wav
```

### パッケージ間の依存関係

```
demo/  ──uses──▶  @novel-engine/hub      ──uses──▶  @novel-engine/core
demo/  ──uses──▶  @novel-engine/maze-rpg ──uses──▶  @novel-engine/hub
src/   ──uses──▶  @novel-engine/core
packages/editor/  ──uses──▶  @novel-engine/core
```

開発中は `vite.config.ts` の `resolve.alias` でビルド済みパッケージを使わず
ソースファイルを直接参照する（HMR が即効く）。

### loaders 分離ルール

- `packages/core/src/loaders/dataLoader.ts` — `parseMasterData(RawYamlInputs)` のみ。`?raw` import なし。ライブラリに含める。
- `src/loaders/demoLoader.ts` — `getMasterData()` のみ。`?raw` import あり。本体ゲーム専用。パッケージに含めない。
- `demo/src/App.tsx` — `?raw` import を直接持つ（demo は独立したアプリ）。

---

## 設計原則

### コアエンジン（純粋関数）
`packages/core/src/engine/` 内のすべての関数は `GameState → GameState` の純粋関数で実装。
副作用（ストレージ・DOM・音声）は持たない。React をインポートしない。

### YAMLデータ
`src/data/*.yaml` をゲームコンテンツとして管理。
Vite の `?raw` suffix でテキスト読み込み → `js-yaml` でパース。
全定義は `packages/core/src/loaders/dataLoader.ts` 経由で取得する。

### ストレージ抽象化
フラグ・セーブデータの保存先は `packages/core/src/storage/IStorage` を通じてのみアクセスする。
現在の実装は `LocalStorageAdapter`。切り替えは `VITE_STORAGE_BACKEND` 環境変数で行う。

```
VITE_STORAGE_BACKEND=localStorage  # デフォルト
VITE_STORAGE_BACKEND=indexeddb     # 将来
VITE_STORAGE_BACKEND=server        # 将来
```

### 画面サイズ
ゲーム画面は **800×600px 固定**。
クリッカブルエリア座標は 800×600 基準で定義する。
スケーリングは `packages/core/src/components/NovelApp.tsx` の `useGameScale()` が `transform: scale()` で処理。
フルスクリーン時はスケール上限を外して画面いっぱいに拡大する。

### child_scenes（入れ子シーン）
シーンは `child_scenes` 配列を持てる。`packages/core/src/loaders/dataLoader.ts` の `flattenScenes()` がロード時にフラット辞書へ展開する。
子シーンは親から `location_id`・`background`・`bgm` を継承する（子に明示すれば上書き可）。

### ChoiceList のインデックス
`ChoiceList` は `originalIndex`（元配列のインデックス）を `onSelect` に渡す。
`SceneEngine.selectChoice` は `scene.branches.choices[choiceIndex]` で元配列を直接参照する。
フィルタ後の配列にインデックスしてはいけない。

---

## シーン実行フロー

```
transitionTo(sceneId)
  └─ flags_set 適用 → item_give 付与 → item_remove 削除
  └─ messages が空か？
       YES → game_end: true     → phase: 'ending'
           → cg_sequence あり  → phase: 'cg_sequence'
           → resolveAfterMessages へ
       NO  → phase: 'message'（メッセージ再生）

resolveAfterMessages（全メッセージ読了後）
  └─ game_end: true             → phase: 'ending'
  └─ next_engine あり           → phase: 'engine_transition'（GameHub へ制御を返す）
  └─ branches.type === 'choice' → phase: 'choice'
  └─ branches.type === 'auto'   → 条件を上から評価
       next_scene あり    → transitionTo(next_scene)
       next_scene === null → goBack（history pop）
       next_scene なし    → phase: 'command'
  └─ next_scene あり            → transitionTo(next_scene)
  └─ next_scene === null        → goBack
  └─ （それ以外）               → phase: 'command'
```

**ディスパッチャーシーン**：`messages: []` ＋ `branches.type: auto` の組み合わせで、
メッセージなしに即条件分岐する入り口シーンを作れる。

---

## GamePhase

`packages/core/src/types/gameState.ts` の `GamePhase` union が表示する UI を制御する。

| フェーズ | 表示 UI |
|---------|---------|
| `title` | タイトル画面 |
| `message` | DialogueBox（セリフ） |
| `choice` | ChoiceList（選択肢） |
| `command` | CommandPanel（コマンドメニュー） |
| `examine` | ClickableAreaOverlay（調べる） |
| `map` | MapView（移動） |
| `inventory` | InventoryPanel（アイテム） |
| `talk_select` | ChoiceList（話しかけるキャラ選択） |
| `cg_sequence` | CgSequencePlayer（クリック送り CG） |
| `ending` | EndingSequence（エンドロール＋CG 演出） |
| `engine_transition` | なし（GameHub に制御を返す中間状態） |
| `system_menu` | SystemMenu |

---

## YAML スキーマ

### scenes.yaml

```yaml
scenes:
  - id: scene_xxx              # ユニークID（scene_ プレフィックス）
    location_id: loc_xxx       # 場所ID（child_scenes では親から継承）
    background: backgrounds/xxx.jpg   # 背景画像パス（省略可）
    bgm: audio/bgm/xxx.mp3            # BGMパス（省略可）
    overlay_image: cg/xxx.jpg         # 一枚絵オーバーレイ（message フェーズ中に全面表示）
    characters:                        # シーン開始時の表示キャラ（省略可）
      - character_id: char_xxx
        position: left | center | right
        expression: normal | happy | sad | ...
    messages:                          # セリフ配列（空配列可 → 即 resolve）
      - text: "セリフ本文"
        voice_character_id: char_xxx | null
        voice_style: normal | ...      # VOICEVOX スタイル（省略可）
        characters:                    # このメッセージ時点でキャラを差し替え（省略可）
          - character_id: char_xxx
            position: left
            expression: happy
    commands: [cmd_examine, ...]       # 使えるコマンドID（省略時は location の default）
    clickable_areas:                   # examine フェーズのクリック領域（省略可）
      - id: area_xxx
        x: 100
        y: 200
        width: 80
        height: 60
        label: "郵便受け"
        next_scene: scene_xxx
        condition: ...
    talkable:                          # cmd_talk で話しかけられるキャラ（省略可）
      - character_id: char_xxx
        scene_id: scene_talk_xxx
        condition: ...                 # 省略可（条件付き出現）
    branches:                          # 分岐（省略可）
      type: choice | auto | none
      choices:
        - label: "選択肢テキスト"       # choice 型のみ必要
          next_scene: scene_xxx | null  # null → goBack
          condition: ...               # 省略可
    next_scene: scene_xxx | null       # 直進先（null → goBack、省略 → command フェーズ）
    next_engine:                       # 別エンジンへ遷移（省略可）
      id: maze_rpg                     # エンジン ID（GameHub の engines キー）
      config:                          # エンジン固有の設定（任意）
        map: dungeon_01
      return_scene: scene_xxx          # エンジン終了後に戻るシーン ID（省略可）
    flags_set:                         # 遷移時に設定するフラグ
      - flag: flag_xxx
        value: true | false | 数値 | 文字列
    item_give:                         # 付与アイテム（条件付き可）
      - item_id: item_xxx
        condition: ...                 # null = 無条件
    item_remove:                       # 削除アイテム
      - item_xxx
    cg_sequence:                       # CG フレーム（messages 空 + game_end なし 時に有効）
      - src: cg/xxx.jpg
        position: left | right | center
    game_end: true                     # true → ending フェーズ（cg_sequence より優先）
    child_scenes:                      # 入れ子シーン（ロード時フラット展開）
      - id: scene_child_xxx
        ...
```

### locations.yaml

```yaml
locations:
  - id: loc_xxx                        # ユニークID（loc_ プレフィックス）
    name: "表示名"
    description: "説明文"
    background_default: backgrounds/xxx.jpg   # シーン未指定時の背景
    default_commands:
      - cmd_examine
      - cmd_talk
      - cmd_move
      - cmd_inventory
    connections:                       # 移動可能な隣接ロケーション
      - location_id: loc_yyy
        label: "yyy へ"
        condition: ...                 # null = 常時表示
    entry_scene: scene_xxx             # このロケーションへ移動時の入口シーン
```

### characters.yaml

```yaml
characters:
  - id: char_xxx                       # ユニークID（char_ プレフィックス）
    name: "表示名"
    name_flag: flag_xxx | null         # フラグで名前を切り替える場合
    voicevox_speaker_id: 2             # VOICEVOX スピーカーID
    y_offset: -250                     # スプライト縦位置調整（負 = 上方向）
    sprites:
      normal:  characters/xxx/normal.png
      happy:   characters/xxx/happy.png
      sad:     characters/xxx/sad.png
      talking: characters/xxx/talking.png
      # キー名は expression に対応（任意追加可）
```

### items.yaml

```yaml
items:
  - id: item_xxx                       # ユニークID（item_ プレフィックス）
    name: "表示名"
    description: "説明文"
    icon: null                         # アイコン画像パス（未実装）
    usable: true | false
    use_scene: scene_xxx | null        # 使用時に遷移するシーン
    use_condition: ...                 # 使用条件（null = 常時）
    stackable: false
    category: key_item | consumable
```

### flags.yaml

```yaml
flags:
  - id: flag_xxx                       # ユニークID（flag_ プレフィックス）
    type: boolean | integer | string
    default: false | 0 | ""
    description: "フラグの用途"
```

### commands.yaml

```yaml
commands:
  - id: cmd_xxx                        # ユニークID（cmd_ プレフィックス）
    label: "表示名"
    icon: null
    description: "説明"
    action_type: examine | talk | move | inventory | ...
```

### 条件式（condition）

```yaml
condition:
  flag: flag_xxx          # フラグ条件
  value: true             # 期待値
  negate: true            # 反転（省略可）

condition:
  has_item: item_xxx      # アイテム所持条件

condition:
  location_id: loc_xxx    # 場所条件

condition:
  and:
    - flag: flag_a
      value: true
    - has_item: item_b

condition:
  or:
    - flag: flag_a
      value: true
    - flag: flag_b
      value: true

condition: null           # 常に真
```

---

## ID 命名規則

| 種類 | プレフィックス | 例 |
|------|-------------|-----|
| フラグ | `flag_` | `flag_met_mentor` |
| シーン | `scene_` | `scene_danchi_morning` |
| 会話シーン（慣例） | `scene_talk_` | `scene_talk_mentor` |
| ロケーション | `loc_` | `loc_danchi` |
| アイテム | `item_` | `item_candy` |
| キャラクター | `char_` | `char_hero` |
| コマンド | `cmd_` | `cmd_examine` |
| クリッカブルエリア | `area_` | `area_mailbox` |

---

## 新しいコンテンツの追加

### キャラクターを追加する
1. `src/data/characters.yaml` にエントリ追加
2. `public/assets/characters/{id}/` にスプライト画像配置
3. シーンの `characters` や `talkable` から参照する

### ロケーションを追加する
1. `src/data/locations.yaml` にエントリ追加（`entry_scene` を必ず設定）
2. 既存ロケーションの `connections` に接続先として追加（`condition` で出現制御）
3. 背景画像を `public/assets/backgrounds/` に配置
4. 対応する `entry_scene` を `scenes.yaml` に追加

### アイテムを追加する
1. `src/data/items.yaml` にエントリ追加
2. シーンの `item_give` で入手、`item_remove` で消費する
3. 使用アクションが必要なら `use_scene` に遷移先シーンを指定

### フラグを追加する
1. `src/data/flags.yaml` にエントリ追加（`type` と `default` を明記）
2. シーンの `flags_set` でセット、`condition` で参照する

### エンディングを作る
1. 最後のシーンに `game_end: true` を設定
2. 同シーンに `cg_sequence` を定義すると EndingSequence で演出される
   - frames[0–2] → Phase1 右パネル（クレジット前半が左）
   - frames[3–4] → Phase2 左パネル（クレジット後半が右）
   - frames[最後] → Phase3 フルスクリーン（Fin）
3. `packages/core/src/components/game/EndingSequence.tsx` の `PART1` / `PART2` でクレジット内容を編集する

### 新しいコマンドタイプを追加する
1. `src/data/commands.yaml` に新コマンド追加（`action_type` を定義）
2. `packages/core/src/types/command.ts` の `CommandActionType` に型追加
3. `packages/core/src/engine/CommandEngine.ts` の `executeCommand()` に switch case 追加
4. 必要なら `packages/core/src/types/gameState.ts` に `GamePhase` 追加
5. `packages/core/src/components/game/GameScreen.tsx` に対応 UI 描画追加

---

## マルチエンジンハブ（@novel-engine/hub）

複数のゲームエンジンを組み合わせ、実行中に切り替えるための仕組み。
ノベル → 迷路RPG → ノベルへ戻る、といった遷移を `scenes.yaml` の `next_engine:` 一行で実現する。

### アーキテクチャ

```
GameHub
  ├── context: GameContext      ← flags / inventory / playerStats を全エンジンで共有
  ├── engines['novel']  → NovelEngineAdapter  → NovelApp
  ├── engines['maze_rpg']       → IGameEngine 実装
  └── engines['shooting']       → IGameEngine 実装（将来）
```

### 共通インターフェース（packages/hub/src/types.ts）

```typescript
interface GameContext {
  flags:       Record<string, boolean | number | string>;
  inventory:   string[];
  playerStats: Record<string, number>;   // HP, EXP, score など
}

interface EngineTransition {
  engineId:        string;    // 遷移先エンジン ID
  config?:         unknown;   // エンジン固有設定
  returnEngineId?: string;    // 終了後に戻るエンジン ID
  returnConfig?:   unknown;
}

interface IGameEngine<TConfig = unknown> {
  component: React.ComponentType<EngineProps<TConfig>>;
}
```

### GameHub の return 処理

エンジンが `onExit(updatedContext)` を `next` なしで呼ぶと、
`GameHub` は `current.returnEngineId` / `current.returnConfig` に従って元のエンジンへ戻る。
`returnEngineId` は `NovelEngineAdapter` が `next_engine.return_scene` を見て自動設定する。

### autoStart — タイトルスキップ

`NovelApp` の `autoStart?: boolean` prop が `true` のとき、マウント時に `startNewGame()` を自動呼び出しして
タイトル画面をスキップし `initialSceneId` のシーンから直接開始する。

`NovelEngineAdapter` は `returnConfig` に `autoStart: true` を注入するため、
別エンジンから `return_scene` へ戻る際は常にタイトルをスキップして指定シーンへ直行する。
初回起動時（`App.tsx` の `initial` config）は `autoStart` を指定しないのでタイトル画面が表示される。

```typescript
// NovelAdapterConfig の autoStart フィールド
export interface NovelAdapterConfig {
  masterData: MasterData;
  assetsBaseUrl: string;
  initialSceneId: string;
  initialLocationId: string;
  autoStart?: boolean;  // returnConfig にのみ true を入れる
}
```

### 利用例（App.tsx）

```tsx
import { GameHub, NovelEngineAdapter } from '@novel-engine/hub';

<GameHub
  engines={{
    novel:   NovelEngineAdapter,
    maze_rpg: MazeRpgEngine,
  }}
  initial={{
    engineId: 'novel',
    config: { masterData, assetsBaseUrl, initialSceneId, initialLocationId },
  }}
  initialContext={{ flags: {}, inventory: [], playerStats: {} }}
/>
```

---

## demo/ ローカル統合デモ

`demo/` は `@novel-engine/hub` + `@novel-engine/maze-rpg` を使ったマルチエンジン統合の動作確認用プロジェクト。
「ある日の古本屋」という 5 シーンのノベル＋ウィザードリィ風迷路RPG で構成される。

### 起動方法

```bash
cd demo
npm install   # 初回のみ
npm run dev   # http://localhost:5173（または 5174）
```

### demo/ と packages/ の関係

`demo/` は npm ワークスペース外の独立プロジェクト。
`packages/core` や `packages/hub` はビルド済みパッケージを使わず、
`vite.config.ts` の `resolve.alias` でソースを直接参照する。

```typescript
// demo/vite.config.ts
resolve: {
  dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'zustand'],
  alias: {
    '@novel-engine/core':     path.resolve(__dirname, '../packages/core/src/index.ts'),
    '@novel-engine/hub':      path.resolve(__dirname, '../packages/hub/src/index.ts'),
    '@novel-engine/maze-rpg': path.resolve(__dirname, '../packages/maze-rpg/src/index.ts'),
  },
},
server: {
  fs: { allow: ['..'] },  // packages/ へのアクセスを許可
},
```

### モノレポ特有の注意点

**React の多重インスタンス問題**
`demo/node_modules/react` と `(root)/node_modules/react` が別インスタンスになると、
Zustand のフック呼び出しで "Invalid hook call" が発生する。
`resolve.dedupe` で全モジュールの React を demo の node_modules に統一すること。

**FS 制限**
Vite のデフォルトではプロジェクトルート外のファイルを配信しない。
`server.fs.allow: ['..']` でモノレポルートへのアクセスを許可する。

**TypeScript パス解決**
```jsonc
// demo/tsconfig.app.json
{
  "compilerOptions": {
    "paths": {
      "@novel-engine/core":     ["../packages/core/src/index.ts"],
      "@novel-engine/hub":      ["../packages/hub/src/index.ts"],
      "@novel-engine/maze-rpg": ["../packages/maze-rpg/src/index.ts"]
    }
  },
  "include": ["src", "../packages/core/src", "../packages/hub/src", "../packages/maze-rpg/src"]
}
```

---

## @novel-engine/maze-rpg

ウィザードリィ初代風の一人称視点ダンジョン探索エンジン。`IGameEngine<MazeRpgConfig>` を実装し、`GameHub` に登録して使う。

### レンダリング

`MazeView`（Canvas 480×320）が painter's algorithm で一人称透視図法を描画。
`FRAMES[d]` テーブル（5段階）で各深さのスクリーン上「窓枠」を定義し、遠→近の順に前面壁・側面壁を塗る。

| 深さ d | FRAME [left, top, right, bottom] | 明度 |
|-------|----------------------------------|------|
| 1 | [60, 40, 420, 280] | 100% |
| 2 | [120, 80, 360, 240] | 78% |
| 3 | [172, 110, 308, 210] | 56% |
| 4 | [207, 128, 273, 192] | 38% |

### マップ形式

`packages/maze-rpg/src/engine/maps.ts` の `BUILT_IN_MAPS` に `string[]` で定義する。

| 文字 | 意味 |
|------|------|
| `#` | 壁（歩行不可） |
| `.` | 床 |
| `S` | スタート位置 |
| `X` | 出口（ゴール） |

**注意**: BFS で S から X に到達できることを必ず確認すること（孤立した通路は見つかっても進めない）。

```typescript
// 追加例
BUILT_IN_MAPS['dungeon_02'] = [
  '#########',
  '#S.....X#',
  '#########',
];
```

### 操作

| キー | 動作 |
|------|------|
| ↑ / W | 前進 |
| ↓ / S | 後退 |
| ← / A | 左回転（90°） |
| → / D | 右回転（90°） |
| Enter / Space | 出口（X）到達後に脱出確認 |

### 設定とフラグ

```typescript
// scenes.yaml での呼び出し例
next_engine:
  id: maze_rpg
  config:
    map: dungeon_01        # BUILT_IN_MAPS のキー
  return_scene: scene_xxx  # クリア後に戻るシーン

// 脱出時に GameContext へ追加されるフラグ
explored_dungeon_01: true  // explored_{mapId} の形式
```

---

## ゲーム管理エディタ

`http://localhost:5173/editor.html` でアクセスできるローカル開発専用ツール。
GitHub Pages にはデプロイしない。

**機能**
- **シーンエディタ**: ID・ロケーション・背景・BGM・一枚絵・メッセージ・キャラ・分岐・フラグ・アイテムを GUI 編集
- **エリアエディタ**: 背景画像上でドラッグしてクリッカブルエリア座標を視覚的に編集
- **テストプレイ**: プリセットを選んで任意シーンからゲームを別タブで起動

**YAML 読み書き**
File System Access API（Chrome/Edge のみ）で `src/data/` フォルダを直接読み書き。
「フォルダを開く」→ `src/data/` を選択 → Vite HMR でゲームに即反映。

```
src/editor/
  main.tsx              エントリポイント
  EditorApp.tsx         タブ切り替えルート
  pages/
    SceneEditorPage.tsx
    AreaEditorPage.tsx
    TestPlayPage.tsx
  components/
    SceneList.tsx       ツリー表示
    MessageEditor.tsx
    AreaCanvas.tsx      ドラッグ矩形描画
    AreaPanel.tsx
  hooks/
    useYamlFs.ts        File System Access API ラッパー
```

---

## VOICEVOX 音声

開発時: `http://localhost:50021` で VOICEVOX Engine を起動しておく。
本番(GitHub Pages): `public/assets/voicevox/{hash}.wav` を事前生成・配置する。

ハッシュキー: `sha1(text + "_" + speakerId)` → `packages/core/src/utils/hashUtils.ts` の `voiceHashKey()` で計算。

```bash
npm run gen:voice   # 全メッセージの音声を一括生成
```

`scripts/generate-voices.mjs` が `child_scenes` を再帰的にたどって全メッセージの音声を生成する。

---

## セーブデータ形式

```typescript
interface SaveData {
  version: number;
  timestamp: number;
  currentSceneId: string;
  currentLocationId: string;
  flags: Record<string, boolean | number | string>;
  inventory: string[];        // item_id の配列
  sceneHistory: string[];     // goBack 用スタック
  currentCharacters: CharacterDisplay[];
  playtime: number;           // 秒
}
```

---

## 開発フロー

タスクは必ず feature ブランチで進め、動作確認後に master へマージする。

```bash
git checkout -b feature/<task-name>
# 実装・コミット
npx tsc --noEmit && npm run build   # 最低限のチェック
git checkout master
git merge --no-ff feature/<task-name>
git branch -d feature/<task-name>
```

---

## ビルド・デプロイ

```bash
# 本体ゲーム（赤羽の一日）開発サーバ
npm run dev

# 本体ゲーム GitHub Pages 用ビルド
VITE_BASE_PATH=/dojonovel/ VITE_VOICEVOX_PREBUILT_ONLY=true npm run build

# プレビュー（GitHub Pages 想定）
npm run preview:gh

# パッケージビルド
cd packages/core     && npm run build      # @novel-engine/core
cd packages/hub      && npm run build      # @novel-engine/hub
cd packages/editor   && npm run build      # @novel-engine/editor
cd packages/maze-rpg && npx tsc --noEmit   # @novel-engine/maze-rpg（型チェックのみ）

# demo/ 統合デモ
cd demo && npm install && npm run dev
```

GitHub Actions が `master` ブランチへの push で自動デプロイ。

---

## 別プロジェクトへの流用

### NovelApp 単体（ノベルのみ）

```bash
npm install @novel-engine/core react react-dom zustand js-yaml
```

```tsx
import { NovelApp, parseMasterData } from '@novel-engine/core';

const masterData = parseMasterData({ scenes: scenesRaw, /* ... */ });

export default function App() {
  return (
    <NovelApp
      masterData={masterData}
      assetsBaseUrl={`${import.meta.env.BASE_URL}assets`}
      config={{ initialSceneId: 'scene_opening', initialLocationId: 'loc_start' }}
    />
  );
}
```

### GameHub（マルチエンジン）

```bash
npm install @novel-engine/core @novel-engine/hub @novel-engine/maze-rpg react react-dom zustand js-yaml
```

```tsx
import { GameHub, NovelEngineAdapter } from '@novel-engine/hub';
import { MazeRpgEngine } from '@novel-engine/maze-rpg';

export default function App() {
  return (
    <GameHub
      engines={{ novel: NovelEngineAdapter, maze_rpg: MazeRpgEngine }}
      initial={{ engineId: 'novel', config: { masterData, assetsBaseUrl, initialSceneId, initialLocationId } }}
      initialContext={{ flags: {}, inventory: [], playerStats: {} }}
    />
  );
}
```

独自エンジンを作る場合は `IGameEngine<TConfig>` を実装する:

```tsx
import type { IGameEngine, EngineProps } from '@novel-engine/hub';

const MyEngine: IGameEngine<{ level: number }> = {
  component({ context, config, onExit }) {
    // 終了時: onExit(updatedContext)                        ← return_scene へ戻る
    // 他エンジンへ: onExit(updatedContext, { engineId: 'novel', config: ... })
    return <div>Level {config.level}</div>;
  },
};
```

ソースエイリアスで開発する場合は `vite.config.ts` に `resolve.dedupe` と `server.fs.allow` を追加すること（「demo/ ローカル統合デモ」節参照）。

クレジット内容は `packages/core/src/components/game/EndingSequence.tsx` の `PART1` / `PART2` で編集する。
