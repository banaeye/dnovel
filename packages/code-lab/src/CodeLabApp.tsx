import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { EngineProps, GameContext, IGameEngine } from '@novel-engine/hub';
import { EditorView, basicSetup } from 'codemirror';
import { StateEffect, StateField } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import { html as htmlLanguage } from '@codemirror/lang-html';
import { css as cssLanguage } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';

export type CodeLabFileKey = 'html' | 'css' | 'js';

export interface CodeLabHint {
  speaker?: 'ken' | 'yui' | 'mentor';
  text: string;
  focus?: {
    file: CodeLabFileKey;
    line?: number;
  };
}

export type CodeLabCheck =
  | {
      type: 'selector_exists';
      selector: string;
      label?: string;
    }
  | {
      type: 'text_includes';
      target: CodeLabFileKey;
      value: string;
      label?: string;
    }
  | {
      type: 'css_property';
      selector: string;
      property: string;
      value: string;
      match?: 'includes' | 'equals';
      label?: string;
    }
  | {
      type: 'js_console_includes';
      value: string;
      label?: string;
    }
  | {
      type: 'click_text_includes';
      clickSelector: string;
      targetSelector: string;
      value: string;
      label?: string;
    };

export interface CodeLabConfig {
  stageId: string;
  title?: string;
  mission: string;
  files: Partial<Record<CodeLabFileKey, string>>;
  readonlyFiles?: CodeLabFileKey[];
  checks: CodeLabCheck[];
  hints?: CodeLabHint[];
  successMessage?: string;
}

interface CheckResult {
  index: number;
  passed: boolean;
  label: string;
  detail: string;
}

interface PreviewMessage {
  source: 'code-lab-result';
  stageId: string;
  results?: CheckResult[];
  logs?: string[];
  error?: string | null;
}

interface CodeFiles {
  html: string;
  css: string;
  js: string;
}

const W = 800;
const H = 600;
const FILE_LABELS: Record<CodeLabFileKey, string> = {
  html: 'HTML',
  css: 'CSS',
  js: 'JS',
};

const SPEAKER_LABELS: Record<NonNullable<CodeLabHint['speaker']>, string> = {
  ken: 'ケン',
  yui: 'ユイ',
  mentor: '田中メンター',
};

const DEFAULT_FILES: CodeFiles = {
  html: '<h1>Hello</h1>',
  css: 'body { font-family: sans-serif; }',
  js: '',
};

const PREVIEW_REFRESH_REMINDER = 'コードを直したら、Preview の「更新」ボタンも忘れずに押そう。';

const setHintLine = StateEffect.define<number | null>();
const hintLineField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(value, transaction) {
    for (const effect of transaction.effects) {
      if (!effect.is(setHintLine)) continue;
      const lineNumber = effect.value;
      if (!lineNumber) return Decoration.none;
      const safeLine = Math.max(1, Math.min(transaction.state.doc.lines, lineNumber));
      const line = transaction.state.doc.line(safeLine);
      return Decoration.set([Decoration.line({ class: 'cm-hintLine' }).range(line.from)]);
    }
    return value.map(transaction.changes);
  },
  provide: (field) => EditorView.decorations.from(field),
});

function useGameScale() {
  const get = () => Math.min(1, Math.min(window.innerWidth / W, window.innerHeight / H));
  const [scale, setScale] = useState(get);
  useEffect(() => {
    const update = () => setScale(get());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function checkLabel(check: CodeLabCheck): string {
  if (check.label) return check.label;
  switch (check.type) {
    case 'selector_exists':
      return `${check.selector} がある`;
    case 'text_includes':
      return `${FILE_LABELS[check.target]} に ${check.value} がある`;
    case 'css_property':
      return `${check.selector} の ${check.property}`;
    case 'js_console_includes':
      return `console.log に ${check.value} が出る`;
    case 'click_text_includes':
      return `${check.clickSelector} で ${check.targetSelector} が変わる`;
  }
}

function createInitialResults(checks: CodeLabCheck[]): CheckResult[] {
  return checks.map((check, index) => ({
    index,
    passed: false,
    label: checkLabel(check),
    detail: '未チェック',
  }));
}

function buildPreviewSrcDoc(files: CodeFiles, checks: CodeLabCheck[], stageId: string): string {
  const payload = JSON.stringify({ checks, files, stageId }).replace(/</g, '\\u003c');
  const userJs = files.js.replace(/<\/script/gi, '<\\/script');
  const baseStyle = `
      html, body { min-height: 100%; margin: 0; }
      body { padding: 16px; box-sizing: border-box; color: #1c2230; background: #fffdf7; }
  `;
  const cssBlock = `<style>${baseStyle}\n${files.css}</style>`;
  const setupScript = `<script>
      window.__codeLabLogs = [];
      window.__codeLabError = null;
      const __originalLog = console.log.bind(console);
      console.log = (...args) => {
        window.__codeLabLogs.push(args.map((arg) => String(arg)).join(' '));
        __originalLog(...args);
      };
      window.addEventListener('error', (event) => {
        window.__codeLabError = event.message || String(event.error || 'JavaScript error');
      });
    </script>`;
  const userScript = `<script>
      try {
        ${userJs}
      } catch (error) {
        window.__codeLabError = error instanceof Error ? error.message : String(error);
      }
    </script>`;
  const checkScript = `<script>
      (() => {
        const payload = ${payload};
        const labelOf = (check) => {
          if (check.label) return check.label;
          if (check.type === 'selector_exists') return check.selector + ' がある';
          if (check.type === 'text_includes') return check.target.toUpperCase() + ' に ' + check.value + ' がある';
          if (check.type === 'css_property') return check.selector + ' の ' + check.property;
          if (check.type === 'js_console_includes') return 'console.log に ' + check.value + ' が出る';
          return check.clickSelector + ' で ' + check.targetSelector + ' が変わる';
        };
        const result = (index, passed, label, detail) => ({ index, passed, label, detail });
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const runCheck = async (check, index) => {
          try {
            if (check.type === 'selector_exists') {
              const ok = !!document.querySelector(check.selector);
              return result(index, ok, labelOf(check), ok ? '見つかった' : '見つからない');
            }
            if (check.type === 'text_includes') {
              const text = String(payload.files[check.target] || '');
              const ok = text.includes(check.value);
              return result(index, ok, labelOf(check), ok ? '含まれている' : 'まだ含まれていない');
            }
            if (check.type === 'css_property') {
              const el = document.querySelector(check.selector);
              if (!el) return result(index, false, labelOf(check), check.selector + ' が見つからない');
              const actual = getComputedStyle(el).getPropertyValue(check.property).trim();
              const ok = check.match === 'equals' ? actual === check.value : actual.includes(check.value);
              return result(index, ok, labelOf(check), actual || '値なし');
            }
            if (check.type === 'js_console_includes') {
              const ok = window.__codeLabLogs.some((line) => line.includes(check.value));
              return result(index, ok, labelOf(check), ok ? '出力された' : 'まだ出力されていない');
            }
            if (check.type === 'click_text_includes') {
              const clickTarget = document.querySelector(check.clickSelector);
              if (!clickTarget) return result(index, false, labelOf(check), check.clickSelector + ' が見つからない');
              clickTarget.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
              await wait(80);
              const textTarget = document.querySelector(check.targetSelector);
              if (!textTarget) return result(index, false, labelOf(check), check.targetSelector + ' が見つからない');
              const text = textTarget.textContent || '';
              const ok = text.includes(check.value);
              return result(index, ok, labelOf(check), ok ? '文字が変わった' : 'まだ "' + check.value + '" が見つからない');
            }
          } catch (error) {
            return result(index, false, labelOf(check), error instanceof Error ? error.message : String(error));
          }
          return result(index, false, labelOf(check), 'unknown check');
        };
        setTimeout(async () => {
          const results = await Promise.all(payload.checks.map(runCheck));
          parent.postMessage({
            source: 'code-lab-result',
            stageId: payload.stageId,
            results,
            logs: window.__codeLabLogs,
            error: window.__codeLabError,
          }, '*');
        }, 0);
      })();
    </script>`;

  if (/<!doctype|<html[\s>]/i.test(files.html)) {
    let doc = files.html;
    const linkPattern = /<link\b(?=[^>]*\brel=["']?stylesheet["']?)(?=[^>]*\bhref=["']?(?:\.\/)?style\.css["']?)[^>]*>/i;
    doc = linkPattern.test(doc)
      ? doc.replace(linkPattern, cssBlock)
      : doc.replace(/<\/head>/i, `${cssBlock}</head>`);
    if (!doc.includes(cssBlock)) doc = `${cssBlock}${doc}`;

    const setupTarget = /<body[^>]*>/i;
    doc = setupTarget.test(doc)
      ? doc.replace(setupTarget, (match) => `${match}${setupScript}`)
      : `${setupScript}${doc}`;

    const scriptPattern = /<script\b(?=[^>]*\bsrc=["']?(?:\.\/)?script\.js["']?)[^>]*>\s*<\/script>/i;
    doc = scriptPattern.test(doc) ? doc.replace(scriptPattern, '') : doc;
    doc = doc.replace(/<\/body>/i, `${userScript}</body>`);
    if (!doc.includes(userScript)) doc = `${doc}${userScript}`;

    return /<\/body>/i.test(doc)
      ? doc.replace(/<\/body>/i, `${checkScript}</body>`)
      : `${doc}${checkScript}`;
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    ${cssBlock}
  </head>
  <body>
    ${files.html}
    ${setupScript}
    ${userScript}
    ${checkScript}
  </body>
</html>`;
}

function finishContext(
  context: GameContext,
  stageId: string,
  attempts: number,
  result: 'clear' | 'give_up',
): GameContext {
  return {
    ...context,
    flags: {
      ...context.flags,
      [`code_lab_result_${stageId}`]: result,
      [`code_lab_attempts_${stageId}`]: attempts,
      [`code_lab_completed_${stageId}`]: result === 'clear',
    },
  };
}

function CodeEditor({
  value,
  fileKey,
  readOnly,
  hintLine,
  onChange,
}: {
  value: string;
  fileKey: CodeLabFileKey;
  readOnly: boolean;
  hintLine?: number;
  onChange: (value: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!hostRef.current) return;
    const language = fileKey === 'html'
      ? htmlLanguage()
      : fileKey === 'css'
        ? cssLanguage()
        : javascript();
    const view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        language,
        hintLineField,
        EditorView.editable.of(!readOnly),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChangeRef.current(update.state.doc.toString());
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '13px',
            backgroundColor: '#101725',
            color: '#e8edf7',
          },
          '.cm-scroller': {
            fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
          },
          '.cm-gutters': {
            backgroundColor: '#0b111d',
            color: '#7c8aa8',
            borderRightColor: '#25304a',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(86, 138, 255, 0.12)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(86, 138, 255, 0.16)',
          },
          '.cm-hintLine': {
            backgroundColor: 'rgba(255, 216, 102, 0.28)',
            boxShadow: 'inset 4px 0 0 #ffd866',
            animation: 'codeLabHintPulse 1s ease-in-out infinite',
          },
          '@keyframes codeLabHintPulse': {
            '0%, 100%': {
              backgroundColor: 'rgba(255, 216, 102, 0.18)',
              boxShadow: 'inset 4px 0 0 rgba(255, 216, 102, 0.7)',
            },
            '50%': {
              backgroundColor: 'rgba(255, 216, 102, 0.42)',
              boxShadow: 'inset 4px 0 0 #ffd866, 0 0 18px rgba(255, 216, 102, 0.28)',
            },
          },
        }),
      ],
      parent: hostRef.current,
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [fileKey, readOnly]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current === value) return;
    view.dispatch({ changes: { from: 0, to: current.length, insert: value } });
  }, [value]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({ effects: setHintLine.of(hintLine ?? null) });
    if (hintLine) {
      const safeLine = Math.max(1, Math.min(view.state.doc.lines, hintLine));
      view.dispatch({ selection: { anchor: view.state.doc.line(safeLine).from }, scrollIntoView: true });
    }
  }, [hintLine]);

  return <div ref={hostRef} style={{ height: '100%', minHeight: 0 }} />;
}

function CodeLabComponent({ context, config, onExit }: EngineProps<CodeLabConfig>) {
  const scale = useGameScale();
  const stageId = config.stageId || 'default';
  const checks = useMemo(() => config.checks ?? [], [config.checks]);
  const hints = config.hints ?? [];
  const [files, setFiles] = useState<CodeFiles>({
    ...DEFAULT_FILES,
    ...(config.files ?? {}),
  });
  const [previewFiles, setPreviewFiles] = useState<CodeFiles>({
    ...DEFAULT_FILES,
    ...(config.files ?? {}),
  });
  const [activeFile, setActiveFile] = useState<CodeLabFileKey>('html');
  const [hintIndex, setHintIndex] = useState(0);
  const [hintFocusActive, setHintFocusActive] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'editing' | 'clear' | 'give_up'>('editing');
  const [results, setResults] = useState<CheckResult[]>(() => createInitialResults(checks));
  const [logs, setLogs] = useState<string[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  const readonlyFiles = config.readonlyFiles ?? [];
  const srcDoc = useMemo(() => buildPreviewSrcDoc(previewFiles, checks, stageId), [checks, previewFiles, stageId]);
  const hasPreviewChanges = files.html !== previewFiles.html || files.css !== previewFiles.css || files.js !== previewFiles.js;
  const allPassed = results.length > 0 && results.every((result) => result.passed);
  const currentHint = hints.length > 0 ? hints[hintIndex % hints.length] : undefined;
  const footerHintText = status === 'clear'
    ? config.successMessage ?? 'できた！ノベルに戻ります。'
    : currentHint?.text
      ? `${currentHint.text} ${PREVIEW_REFRESH_REMINDER}`
      : `コードを書いたら、Preview の「更新」ボタンを押してからチェックしてみよう。`;
  const focusedFile = hintFocusActive ? currentHint?.focus?.file : undefined;
  const focusedLine = focusedFile === activeFile ? currentHint?.focus?.line : undefined;

  useEffect(() => {
    setResults(createInitialResults(checks));
    setLogs([]);
    setRuntimeError(null);
    setHintFocusActive(false);
  }, [checks]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.data?.source !== 'code-lab-result') return;
      if (event.data.stageId !== stageId) return;
      setResults(Array.isArray(event.data.results) ? event.data.results : createInitialResults(checks));
      setLogs(Array.isArray(event.data.logs) ? event.data.logs : []);
      setRuntimeError(typeof event.data.error === 'string' ? event.data.error : null);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [checks, stageId]);

  useEffect(() => {
    if (focusedFile) setActiveFile(focusedFile);
  }, [focusedFile]);

  const updateFile = useCallback((fileKey: CodeLabFileKey, value: string) => {
    setFiles((prev) => ({ ...prev, [fileKey]: value }));
  }, []);

  const refreshPreview = useCallback(() => {
    setPreviewFiles({ ...files });
    setResults(createInitialResults(checks));
    setLogs([]);
    setRuntimeError(null);
  }, [checks, files]);

  const complete = useCallback((result: 'clear' | 'give_up', nextAttempts = attempts) => {
    if (status !== 'editing') return;
    setStatus(result);
    const updatedContext = finishContext(context, stageId, nextAttempts, result);
    window.setTimeout(() => onExit(updatedContext), result === 'clear' ? 1700 : 500);
  }, [attempts, context, onExit, stageId, status]);

  const checkAnswer = useCallback(() => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (allPassed) complete('clear', nextAttempts);
  }, [allPassed, attempts, complete]);

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05070d',
      overflow: 'hidden',
      color: '#e8edf7',
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif",
	    }}>
	      <style>{`
	        @keyframes codeLabTabPulse {
	          0%, 100% {
	            background-color: #3b2b11;
	            box-shadow: 0 0 0 2px rgba(255,216,102,0.18);
	          }
	          50% {
	            background-color: #6a4a12;
	            box-shadow: 0 0 0 2px rgba(255,216,102,0.48), 0 0 18px rgba(255,216,102,0.42);
	          }
	        }
          @keyframes codeLabClearPop {
            0% {
              opacity: 0;
              transform: scale(0.72) translateY(10px);
              filter: blur(3px);
            }
            48% {
              opacity: 1;
              transform: scale(1.08) translateY(0);
              filter: blur(0);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
              filter: blur(0);
            }
          }
          @keyframes codeLabClearGlow {
            0%, 100% {
              box-shadow: 0 0 18px rgba(88, 214, 141, 0.38), inset 0 0 22px rgba(255,255,255,0.08);
            }
            50% {
              box-shadow: 0 0 52px rgba(114, 213, 255, 0.78), inset 0 0 38px rgba(255,255,255,0.16);
            }
          }
          @keyframes codeLabSpark {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(0.4);
            }
            18% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-170px) scale(1);
            }
          }
	      `}</style>
	      <div style={{
        width: W,
        height: H,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        display: 'grid',
        gridTemplateRows: '48px 1fr 66px',
        background: '#0b1020',
        border: '1px solid #263251',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        position: 'relative',
      }}>
        {status === 'clear' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(4, 8, 18, 0.48)',
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'relative',
              width: 360,
              height: 220,
              display: 'grid',
              placeItems: 'center',
            }}>
              {Array.from({ length: 18 }, (_, index) => (
                <span
                  key={index}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: index % 3 === 0 ? 10 : 7,
                    height: index % 3 === 0 ? 32 : 22,
                    borderRadius: 999,
                    background: index % 4 === 0 ? '#72d5ff' : index % 4 === 1 ? '#ffd866' : index % 4 === 2 ? '#58d68d' : '#ff9ecb',
                    transformOrigin: 'center bottom',
                    animation: `codeLabSpark ${900 + (index % 5) * 90}ms ease-out ${index * 24}ms both`,
                    ['--angle' as string]: `${index * 20}deg`,
                  }}
                />
              ))}
              <div style={{
                minWidth: 284,
                padding: '28px 36px',
                border: '2px solid rgba(156,255,194,0.86)',
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(13,38,44,0.96), rgba(28,70,44,0.96))',
                color: '#f4fff8',
                textAlign: 'center',
                animation: 'codeLabClearPop 420ms cubic-bezier(.2,1.35,.3,1) both, codeLabClearGlow 900ms ease-in-out infinite',
              }}>
                <div style={{
                  fontSize: 54,
                  lineHeight: 1,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textShadow: '0 4px 18px rgba(0,0,0,0.35)',
                }}>
                  CLEAR
                </div>
                <div style={{
                  marginTop: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#caffdc',
                }}>
                  {config.successMessage ?? 'できた！ノベルに戻ります。'}
                </div>
              </div>
            </div>
          </div>
        )}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          borderBottom: '1px solid #263251',
          background: 'linear-gradient(90deg, #111a2e, #13223d)',
        }}>
          <div>
            <div style={{ fontSize: 10, color: '#90a4d4', letterSpacing: '0.12em' }}>CODE LAB</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{config.title ?? 'コーディング練習'}</div>
          </div>
          <div style={{ color: '#aebde3', fontSize: 13 }}>チェック {attempts} 回</div>
        </header>

        <main style={{ display: 'grid', gridTemplateColumns: '1fr 318px', minHeight: 0 }}>
          <section style={{ display: 'grid', gridTemplateRows: '42px 1fr', minWidth: 0, minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderBottom: '1px solid #263251' }}>
              {(['html', 'css', 'js'] as CodeLabFileKey[]).map((fileKey) => (
                <button
                  key={fileKey}
                  type="button"
                  onClick={() => setActiveFile(fileKey)}
                  style={{
                    width: 78,
                    height: 28,
                    border: `1px solid ${focusedFile === fileKey ? '#ffd866' : activeFile === fileKey ? '#72d5ff' : '#334263'}`,
                    background: focusedFile === fileKey ? '#4a3714' : activeFile === fileKey ? '#193653' : '#121a2d',
                    boxShadow: focusedFile === fileKey ? '0 0 0 2px rgba(255,216,102,0.28)' : 'none',
                    animation: focusedFile === fileKey ? 'codeLabTabPulse 1s ease-in-out infinite' : undefined,
                    color: activeFile === fileKey ? '#f8fcff' : '#b7c4e6',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {FILE_LABELS[fileKey]}
                </button>
              ))}
            </div>
            <CodeEditor
              fileKey={activeFile}
              value={files[activeFile]}
              readOnly={readonlyFiles.includes(activeFile)}
              hintLine={focusedLine}
              onChange={(value) => updateFile(activeFile, value)}
            />
          </section>

          <aside style={{
            display: 'grid',
            gridTemplateRows: '286px 1fr',
            borderLeft: '1px solid #263251',
            minHeight: 0,
          }}>
            <div style={{ display: 'grid', gridTemplateRows: '28px 1fr 58px', minHeight: 0, background: '#f8f5ec' }}>
              <div style={{
                color: '#25304a',
                background: '#e8decc',
                padding: '3px 8px',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <span>Preview{hasPreviewChanges ? ' *' : ''}</span>
                <button
                  type="button"
                  onClick={refreshPreview}
                  style={{
                    height: 22,
                    minWidth: 54,
                    border: '1px solid #9ba785',
                    background: hasPreviewChanges ? '#fff2b8' : '#f8f3e7',
                    color: '#25304a',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  更新
                </button>
              </div>
              <iframe
                title="Code preview"
                srcDoc={srcDoc}
                sandbox="allow-scripts"
                style={{ width: '100%', height: '100%', border: 0, background: '#fff' }}
              />
              <div style={{
                borderTop: '1px solid #2b3449',
                background: '#0b111d',
                color: '#b9e9ff',
                fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
                fontSize: 11,
                lineHeight: 1.45,
                padding: '6px 8px',
                overflow: 'auto',
              }}>
                <div style={{ color: '#7f91b3', fontFamily: 'inherit', marginBottom: 2 }}>Console</div>
                {runtimeError
                  ? <div style={{ color: '#ff9ea4' }}>JS Error: {runtimeError}</div>
                  : logs.length > 0
                    ? logs.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)
                    : <div style={{ color: '#64718c' }}>console.log の結果がここに出ます</div>}
              </div>
            </div>
            <div style={{ padding: 12, overflow: 'auto', minHeight: 0 }}>
              <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: 8 }}>Mission</div>
              <div style={{ color: '#d6def8', fontSize: 13, lineHeight: 1.55, marginBottom: 12 }}>{config.mission}</div>
              <div style={{ display: 'grid', gap: 6 }}>
                {results.map((result) => (
                  <div
                    key={result.index}
                    style={{
                      border: `1px solid ${result.passed ? '#58d68d' : '#465575'}`,
                      background: result.passed ? 'rgba(45, 160, 96, 0.16)' : 'rgba(255,255,255,0.04)',
                      padding: '7px 8px',
                      fontSize: 12,
                    }}
                  >
                    <div style={{ color: result.passed ? '#9cffc2' : '#dbe4ff', fontWeight: 700 }}>
                      {result.passed ? 'OK' : 'TODO'}: {result.label}
                    </div>
                    <div style={{ color: '#9ba8c8', marginTop: 3 }}>{result.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>

        <footer style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 12,
          padding: 12,
          borderTop: '1px solid #263251',
          background: '#090e1a',
        }}>
          <div style={{
            border: '1px solid #2f3c5d',
            background: '#101725',
            padding: '6px 10px',
            minWidth: 0,
          }}>
            <div style={{ color: '#8eb6ff', fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
              {currentHint?.speaker ? SPEAKER_LABELS[currentHint.speaker] : 'ヒント'}
            </div>
            <div style={{ color: '#edf3ff', fontSize: 13, lineHeight: 1.35 }}>
              {footerHintText}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                if (hints.length === 0) return;
                setHintFocusActive(true);
                setHintIndex((i) => i + 1);
              }}
              disabled={hints.length === 0}
              style={buttonStyle('#243553', '#dce8ff')}
            >
              ヒント
            </button>
              <button
                type="button"
                onClick={checkAnswer}
                disabled={status !== 'editing' || hasPreviewChanges}
                style={buttonStyle(allPassed ? '#1d7c48' : '#31507f', '#ffffff')}
                title={hasPreviewChanges ? '先にPreviewを更新してください' : undefined}
              >
                チェック
              </button>
            <button
              type="button"
              onClick={() => complete('give_up')}
              disabled={status !== 'editing'}
              style={buttonStyle('#4b2734', '#ffd8df')}
            >
              戻る
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function buttonStyle(background: string, color: string): CSSProperties {
  return {
    minWidth: 78,
    height: 32,
    border: '1px solid rgba(255,255,255,0.22)',
    background,
    color,
    fontWeight: 700,
    cursor: 'pointer',
  };
}

export const CodeLabEngine: IGameEngine<CodeLabConfig> = {
  component: CodeLabComponent,
};
