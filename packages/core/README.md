# @novel-engine/core

ReactJS + YAML で作るアドベンチャー/ノベルゲームエンジン。

YAML とアセットを用意するだけでノベルゲームが動きます。

---

## インストール

```bash
npm install @novel-engine/core react react-dom zustand js-yaml
```

---

## クイックスタート

### 1. YAML ファイルを用意する

`src/data/` に 6 種類の YAML ファイルを作成します。

```
src/data/
  scenes.yaml
  characters.yaml
  locations.yaml
  flags.yaml
  items.yaml
  commands.yaml
```

スキーマの詳細は [CLAUDE.md](../../CLAUDE.md) を参照してください。

### 2. YAML を読み込んでゲームを起動する

{% raw %}
```tsx
// src/App.tsx
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

### 3. アセットを配置する

```
public/assets/
  backgrounds/   背景画像 *.jpg / *.webp
  characters/    キャラクタースプライト {id}/*.png
  cg/            一枚絵・CG *.jpg / *.png
  audio/bgm/     BGM *.mp3
  audio/se/      SE *.mp3
  voicevox/      事前生成音声 {hash}.wav
```

---

## API

### `parseMasterData(inputs: RawYamlInputs): MasterData`

6 種類の YAML 文字列を受け取り、ゲームエンジンが使う `MasterData` を返します。

```typescript
interface RawYamlInputs {
  scenes:     string;
  flags:      string;
  items:      string;
  locations:  string;
  characters: string;
  commands:   string;
}
```

### `<NovelApp>`

| プロップ | 型 | 説明 |
|---|---|---|
| `masterData` | `MasterData` | `parseMasterData()` の返り値 |
| `assetsBaseUrl` | `string` | アセットのベース URL（末尾スラッシュ不要） |
| `config.initialSceneId` | `string` | ゲーム開始シーン ID |
| `config.initialLocationId` | `string` | ゲーム開始ロケーション ID |

### `AssetProvider` / `useAssets()`

`NovelApp` 内部で使用する Context。アセット URL の解決に使います。

```tsx
import { AssetProvider, useAssets } from '@novel-engine/core';

// カスタムコンポーネント内で
const { resolveAsset, resolveVoicePath } = useAssets();
const src = resolveAsset('characters/hero/normal.png');
```

---

## ゲームエンジン設計

エンジンの詳細な設計・YAML スキーマ・開発フローは [CLAUDE.md](../../CLAUDE.md) を参照してください。
