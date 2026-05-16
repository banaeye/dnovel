# @novel-engine/core クイックスタート

このガイドでは、ゼロから新しいノベルゲームプロジェクトを作る手順を説明します。

---

## 前提

- Node.js 18+
- `novel` リポジトリがローカルにある（パッケージがまだ npm 未公開のため）

---

## 1. 新しい Vite プロジェクトを作成

```bash
npm create vite@latest my-novel -- --template react-ts
cd my-novel
npm install
```

---

## 2. @novel-engine/core をインストール

npm 未公開のため、ローカルの `dist/` を直接参照します。

```bash
# novel リポジトリのパスを自分の環境に合わせて変更してください
npm install ../novel/packages/core
```

`package.json` に以下が追加されます：

```json
{
  "dependencies": {
    "@novel-engine/core": "file:../novel/packages/core",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

依存ライブラリも追加します：

```bash
npm install js-yaml zustand
npm install -D @types/js-yaml
```

---

## 3. ディレクトリ構造を作成

```
my-novel/
├── public/
│   └── assets/
│       ├── backgrounds/    ← 背景画像
│       ├── characters/     ← キャラクタースプライト
│       └── cg/             ← 一枚絵・CG
├── src/
│   ├── data/
│   │   ├── scenes.yaml
│   │   ├── characters.yaml
│   │   ├── locations.yaml
│   │   ├── flags.yaml
│   │   ├── items.yaml
§   │   └── commands.yaml
│   ├── App.tsx
│   └── main.tsx
└── vite.config.ts
```

---

## 4. vite.config.ts を設定

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ?raw で YAML を文字列として読み込む（Vite 標準機能、設定不要）
})
```

---

## 5. 最小構成の YAML を作成

### `src/data/flags.yaml`
```yaml
flags:
  - id: flag_started
    type: boolean
    default: false
    description: "ゲーム開始フラグ"
```

### `src/data/items.yaml`
```yaml
items: []
```

### `src/data/commands.yaml`
```yaml
commands:
  - id: cmd_examine
    label: "調べる"
    icon: null
    description: "周囲を調べる"
    action_type: examine
  - id: cmd_move
    label: "移動"
    icon: null
    description: "別の場所へ移動する"
    action_type: move
```

### `src/data/characters.yaml`
```yaml
characters:
  - id: char_hero
    name: "主人公"
    voicevox_speaker_id: null
    y_offset: 0
    sprites:
      normal: characters/hero/normal.png
```

### `src/data/locations.yaml`
```yaml
locations:
  - id: loc_start
    name: "はじまりの場所"
    description: "物語の始まり"
    default_commands:
      - cmd_examine
      - cmd_move
    connections: []
    entry_scene: scene_opening
```

### `src/data/scenes.yaml`
```yaml
scenes:
  - id: scene_opening
    location_id: loc_start
    background: backgrounds/start.jpg
    messages:
      - text: "ここから物語が始まる。"
        voice_character_id: null
    next_scene: null
```

---

## 6. App.tsx を実装

{% raw %}
```typescript
import scenesRaw    from './data/scenes.yaml?raw';
import flagsRaw     from './data/flags.yaml?raw';
import itemsRaw     from './data/items.yaml?raw';
import locationsRaw from './data/locations.yaml?raw';
import charsRaw     from './data/characters.yaml?raw';
import cmdsRaw      from './data/commands.yaml?raw';

import { NovelApp, parseMasterData } from '@novel-engine/core';
import '@novel-engine/core/style.css';

const masterData = parseMasterData({
  scenes:     scenesRaw,
  flags:      flagsRaw,
  items:      itemsRaw,
  locations:  locationsRaw,
  characters: charsRaw,
  commands:   cmdsRaw,
});

export default function App() {
  return (
    <NovelApp
      masterData={masterData}
      assetsBaseUrl={`${import.meta.env.BASE_URL}assets`}
      config={{
        initialSceneId:    'scene_opening',
        initialLocationId: 'loc_start',
      }}
    />
  );
}
```
{% endraw %}

---

## 7. 起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開くとゲームが起動します。

---

## YAML スキーマリファレンス

詳細なスキーマや設計原則は `novel/CLAUDE.md` を参照してください。

主要な概念：

| YAML ファイル | 役割 |
|---|---|
| `scenes.yaml` | ストーリー・セリフ・分岐・フラグ操作 |
| `characters.yaml` | キャラクター名・スプライト・音声設定 |
| `locations.yaml` | 場所・移動先・入場シーン |
| `flags.yaml` | ゲームフラグ定義（boolean / integer / string） |
| `items.yaml` | アイテム定義 |
| `commands.yaml` | コマンドメニュー定義 |

---

## トラブルシューティング

### `Cannot find module '@novel-engine/core'`
```bash
npm install ../novel/packages/core
```
パスが正しいか確認してください。

### `Cannot find module './data/scenes.yaml?raw'`
Vite の `?raw` サフィックスは `.yaml` ファイルに対してデフォルトで動作します。
TypeScript の型エラーが出る場合は `vite-env.d.ts` に以下を追加：
```typescript
/// <reference types="vite/client" />
```

### 画面が真っ暗 / 背景が表示されない
`public/assets/backgrounds/start.jpg` を配置してください。
画像がなくても場所名がフォールバック表示されます。

### ゲームが 800×600 より大きく表示したい
`<NovelApp>` はデフォルトで 800×600 固定です。
フルスクリーンボタン（右下）または画面を広げて使用してください。
