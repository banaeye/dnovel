# @novel-engine/code-lab

HTML / CSS / JavaScript の基礎をノベルゲーム内で学ぶためのコーディングエンジンです。
`@novel-engine/hub` の `IGameEngine` として登録し、ノベルの `next_engine` から呼び出します。

## Install

```bash
npm install @novel-engine/code-lab @novel-engine/hub react react-dom
```

## Register

```tsx
import { CodeLabEngine } from '@novel-engine/code-lab';

<GameHub
  engines={{
    novel: NovelEngineAdapter,
    code_lab: CodeLabEngine,
  }}
  ...
/>
```

## YAML

```yaml
next_engine:
  id: code_lab
  config:
    stageId: html_first_button
    title: "ボタンを作ろう"
    mission: "HTMLにbuttonタグを追加しよう"
    files:
      html: "<h1>CoderDojo</h1>\n<!-- ここにbuttonを書く -->"
      css: "body { font-family: sans-serif; }"
      js: ""
    checks:
      - type: selector_exists
        selector: "button"
      - type: text_includes
        target: html
        value: "button"
      - type: click_text_includes
        clickSelector: "button"
        targetSelector: "#message"
        value: "ようこそ"
    hints:
      - speaker: mentor
        text: "まずこれを試してみ。<button>開始</button> だね。"
  return_scene: scene_after_code_lab
```

## Checks

- `selector_exists`: preview DOM に CSS selector が存在する。
- `text_includes`: `html` / `css` / `js` のコードに文字列が含まれる。
- `css_property`: selector の computed style が期待値を含む。
- `js_console_includes`: `console.log` 出力に文字列が含まれる。
- `click_text_includes`: 指定要素をクリックした後、対象要素のテキストに指定文字列が含まれる。

## Result Flags

- `code_lab_result_{stageId}`: `clear` / `give_up`
- `code_lab_attempts_{stageId}`: チェック回数
- `code_lab_completed_{stageId}`: クリアしたかどうか
