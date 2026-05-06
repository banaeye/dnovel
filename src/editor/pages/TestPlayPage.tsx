import { useEffect, useRef, useState } from 'react';
import type { RawFlag, RawItem, RawLocation, RawScene } from '../hooks/useYamlFs';
import { collectAllSceneIds } from '../hooks/useYamlFs';

const DEBUG_START_KEY = '__novel_debug_start__';
const DEBUG_STATE_KEY = '__novel_debug_state__';
const DEBUG_CMD_KEY   = '__novel_debug_cmd__';

interface DebugGameState {
  flags: Record<string, boolean | number | string>;
  inventory: string[];
  currentSceneId: string;
  currentLocationId: string;
  phase: string;
}

function sendCmd(cmd: Record<string, unknown>) {
  localStorage.setItem(DEBUG_CMD_KEY, JSON.stringify({ ...cmd, _id: Date.now() }));
}

// ────────────────────────────────────────────────
// 章別プリセット定義
// ────────────────────────────────────────────────
interface TestPreset {
  label: string;
  chapter: string;
  sceneId: string;
  locationId: string;
  flags?: Record<string, boolean | number | string>;
  inventory?: string[];
}

const PRESETS: TestPreset[] = [
  // ── 第1章 ──
  {
    label: '開始',
    chapter: '第1章',
    sceneId: 'scene_danchi_morning',
    locationId: 'loc_danchi',
    flags: { flag_chapter: 1 },
  },
  {
    label: '駅前探索',
    chapter: '第1章',
    sceneId: 'scene_station_default',
    locationId: 'loc_station',
    flags: { flag_chapter: 1, flag_left_danchi: true, flag_station_explored: true },
  },
  {
    label: 'CoderDojo',
    chapter: '第1章',
    sceneId: 'scene_coderdojo_default',
    locationId: 'loc_coderdojo',
    flags: {
      flag_chapter: 1, flag_left_danchi: true,
      flag_station_explored: true, flag_arrived_coderdojo: true, flag_met_mentor: true,
    },
  },
  {
    label: '一番街',
    chapter: '第1章',
    sceneId: 'scene_ichibangai_default',
    locationId: 'loc_ichibangai',
    flags: { flag_chapter: 1, flag_left_danchi: true, flag_station_explored: true },
  },
  // ── 第2章 ──
  {
    label: '開始',
    chapter: '第2章',
    sceneId: 'scene_ch2_start',
    locationId: 'loc_danchi',
    flags: { flag_chapter: 2, flag_chapter1_cleared: true },
  },
  {
    label: '迷宮前（ユイと合流）',
    chapter: '第2章',
    sceneId: 'scene_ichibangai_maze_ready',
    locationId: 'loc_ichibangai',
    flags: {
      flag_chapter: 2, flag_chapter1_cleared: true,
      flag_left_danchi: true, flag_station_explored: true, flag_met_yui: true,
    },
  },
  {
    label: 'ボス前（メンターの御札あり）',
    chapter: '第2章',
    sceneId: 'scene_ichibangai_boss_ready',
    locationId: 'loc_ichibangai',
    flags: {
      flag_chapter: 2, flag_chapter1_cleared: true,
      flag_met_yui: true, flag_maze_defeated: true, flag_boss_challenged: true,
    },
    inventory: ['item_kinchu_hikari'],
  },
  {
    label: 'CoderDojo（メンター登場）',
    chapter: '第2章',
    sceneId: 'scene_coderdojo_default',
    locationId: 'loc_coderdojo',
    flags: {
      flag_chapter: 2, flag_chapter1_cleared: true,
      flag_maze_defeated: false, flag_boss_challenged: true,
    },
  },
  {
    label: 'エンディング直前',
    chapter: '第2章',
    sceneId: 'scene_ch2_after_maze',
    locationId: 'loc_ichibangai',
    flags: {
      flag_chapter: 2, flag_chapter1_cleared: true,
      flag_maze_defeated: true, flag_boss_challenged: true,
    },
  },
  // ── 第3章 ──
  {
    label: '開始',
    chapter: '第3章',
    sceneId: 'scene_ch3_start',
    locationId: 'loc_danchi',
    flags: { flag_chapter: 3, flag_chapter1_cleared: true, flag_ch2_cleared: true },
  },
  {
    label: '駅前（大学生）',
    chapter: '第3章',
    sceneId: 'scene_station_default',
    locationId: 'loc_station',
    flags: {
      flag_chapter: 3, flag_chapter1_cleared: true, flag_ch2_cleared: true,
      flag_ch3_helping_obachan: true,
    },
  },
  {
    label: 'ミュージアム受付',
    chapter: '第3章',
    sceneId: 'scene_museum_default',
    locationId: 'loc_museum',
    flags: {
      flag_chapter: 3, flag_chapter1_cleared: true, flag_ch2_cleared: true,
      flag_ch3_helping_obachan: true, flag_ch3_museum_unlocked: true,
    },
  },
  {
    label: '神経衰弱（チケット争奪）',
    chapter: '第3章',
    sceneId: 'scene_ch3_talk_museum_staff',
    locationId: 'loc_museum',
    flags: {
      flag_chapter: 3, flag_chapter1_cleared: true, flag_ch2_cleared: true,
      flag_ch3_helping_obachan: true, flag_ch3_museum_unlocked: true,
    },
  },
  {
    label: 'アーケード（チェイス）',
    chapter: '第3章',
    sceneId: 'scene_arcade_default',
    locationId: 'loc_arcade',
    flags: {
      flag_chapter: 3, flag_chapter1_cleared: true, flag_ch2_cleared: true,
      flag_ch3_helping_obachan: true, flag_ch3_museum_unlocked: true,
      flag_ch3_got_ticket: true, flag_ch3_ticket_given: true,
    },
  },
];

const CHAPTERS = [...new Set(PRESETS.map(p => p.chapter))];

// ────────────────────────────────────────────────
// デバッグパネル（ゲームの右カラム）
// ────────────────────────────────────────────────
function DebugPanel({
  gameState,
  rawFlags,
  rawItems,
  allSceneIds,
  rawLocations,
}: {
  gameState: DebugGameState | null;
  rawFlags: RawFlag[];
  rawItems: RawItem[];
  allSceneIds: string[];
  rawLocations: RawLocation[];
}) {
  const [jumpScene, setJumpScene] = useState(allSceneIds[0] ?? '');
  const [jumpLoc, setJumpLoc] = useState(rawLocations[0]?.id ?? '');

  useEffect(() => {
    if (allSceneIds.length && !jumpScene) setJumpScene(allSceneIds[0] ?? '');
  }, [allSceneIds]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rawLocations.length && !jumpLoc) setJumpLoc(rawLocations[0]?.id ?? '');
  }, [rawLocations]); // eslint-disable-line react-hooks/exhaustive-deps

  const SEL: React.CSSProperties = {
    background: '#16213e', border: '1px solid #2a2a4e', color: '#ccc',
    borderRadius: 3, fontSize: 11, padding: '3px 5px', width: '100%',
  };
  const sep = <div style={{ borderTop: '1px solid #1a1a2e', margin: '10px 0' }} />;

  if (!gameState) {
    return (
      <div style={{ padding: 16, fontSize: 12, color: '#445' }}>
        ゲームの起動を待っています…
      </div>
    );
  }

  return (
    <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* フェーズ / 現在シーン */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: '#556', marginBottom: 3 }}>phase</div>
        <div style={{ fontSize: 12, color: '#8bc34a', letterSpacing: '0.04em' }}>{gameState.phase}</div>
        <div style={{ fontSize: 10, color: '#556', marginTop: 6, marginBottom: 2 }}>scene / location</div>
        <div style={{ fontSize: 11, color: '#c5cae9', wordBreak: 'break-all' }}>{gameState.currentSceneId}</div>
        <div style={{ fontSize: 10, color: '#778', wordBreak: 'break-all' }}>{gameState.currentLocationId}</div>
      </div>

      {sep}

      {/* シーンジャンプ */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: '#7986cb', marginBottom: 6 }}>シーンジャンプ</div>
        <select value={jumpScene} onChange={e => setJumpScene(e.target.value)} style={{ ...SEL, marginBottom: 4 }}>
          {allSceneIds.map(id => <option key={id} value={id}>{id}</option>)}
        </select>
        <select value={jumpLoc} onChange={e => setJumpLoc(e.target.value)} style={{ ...SEL, marginBottom: 6 }}>
          {rawLocations.map(l => <option key={l.id} value={l.id}>{l.name}（{l.id}）</option>)}
        </select>
        <button
          onClick={() => sendCmd({ type: 'jumpToScene', sceneId: jumpScene, locationId: jumpLoc })}
          style={{
            width: '100%', padding: '5px 0', fontSize: 12,
            background: '#1a2a4a', border: '1px solid #3a4a7a', color: '#8ab4f8',
            borderRadius: 3, cursor: 'pointer',
          }}
        >
          ↗ ジャンプ
        </button>
      </div>

      {sep}

      {/* フラグ */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: '#7986cb', marginBottom: 6 }}>フラグ</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {rawFlags.map(f => {
            const cur = gameState.flags[f.id] ?? f.default;
            return (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: '#aab', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.description ?? f.id}
                  </div>
                </div>
                {f.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={!!cur}
                    onChange={e => sendCmd({ type: 'setFlag', flagId: f.id, value: e.target.checked })}
                    style={{ width: 14, height: 14, cursor: 'pointer', accentColor: '#7986cb', flexShrink: 0 }}
                  />
                ) : f.type === 'integer' ? (
                  <input
                    type="number"
                    value={cur as number}
                    onChange={e => sendCmd({ type: 'setFlag', flagId: f.id, value: parseInt(e.target.value, 10) || 0 })}
                    style={{ ...SEL, width: 56, textAlign: 'right', flexShrink: 0 }}
                  />
                ) : (
                  <input
                    type="text"
                    value={cur as string}
                    onChange={e => sendCmd({ type: 'setFlag', flagId: f.id, value: e.target.value })}
                    style={{ ...SEL, width: 72, flexShrink: 0 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {sep}

      {/* アイテム */}
      <div>
        <div style={{ fontSize: 11, color: '#7986cb', marginBottom: 6 }}>アイテム</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {rawItems.map(item => {
            const has = gameState.inventory.includes(item.id);
            const toggle = () => {
              const next = has
                ? gameState.inventory.filter(id => id !== item.id)
                : [...gameState.inventory, item.id];
              sendCmd({ type: 'setInventory', inventory: next });
            };
            return (
              <div
                key={item.id}
                onClick={toggle}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '3px 4px',
                  cursor: 'pointer', borderRadius: 3,
                  background: has ? '#1a2540' : 'transparent',
                }}
              >
                <input
                  type="checkbox" readOnly checked={has}
                  style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#7986cb', flexShrink: 0 }}
                />
                <span style={{ fontSize: 11, color: has ? '#c5cae9' : '#667' }}>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// TestPlayPage 本体
// ────────────────────────────────────────────────
export function TestPlayPage({
  gameAppUrl,
  rawScenes = [],
  rawItems = [],
  rawFlags = [],
  rawLocations = [],
}: {
  gameAppUrl: string;
  rawScenes?: RawScene[];
  rawItems?: RawItem[];
  rawFlags?: RawFlag[];
  rawLocations?: RawLocation[];
}) {
  const allSceneIds = collectAllSceneIds(rawScenes);

  // 起動設定
  const [sceneId, setSceneId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [startFlags, setStartFlags] = useState<Record<string, boolean | number | string>>({});
  const [startInventory, setStartInventory] = useState<string[]>([]);
  const [defaultsApplied, setDefaultsApplied] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // 実行状態
  const [launched, setLaunched] = useState(false);
  const [launchKey, setLaunchKey] = useState(0);
  const [gameState, setGameState] = useState<DebugGameState | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // データ読み込み後に初期値を1回だけセット
  useEffect(() => {
    if (defaultsApplied || rawFlags.length === 0 || rawLocations.length === 0 || rawScenes.length === 0) return;
    const ids = collectAllSceneIds(rawScenes);
    setSceneId(ids[0] ?? '');
    setLocationId(rawLocations[0]?.id ?? '');
    setDefaultsApplied(true);
  }, [rawFlags, rawLocations, rawScenes, defaultsApplied]);

  // ゲーム(iframe)からの状態通知を受信
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== DEBUG_STATE_KEY || !e.newValue) return;
      try { setGameState(JSON.parse(e.newValue)); } catch { /* ignore */ }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  function doLaunch(sid: string, lid: string, flags?: Record<string, boolean | number | string>, inv?: string[]) {
    localStorage.setItem(DEBUG_START_KEY, JSON.stringify({
      sceneId: sid,
      locationId: lid,
      flags:     flags     ?? startFlags,
      inventory: inv       ?? startInventory,
    }));
    localStorage.removeItem(DEBUG_STATE_KEY);
    localStorage.removeItem(DEBUG_CMD_KEY);
    setGameState(null);
    setLaunched(true);
    setLaunchKey(k => k + 1);
  }

  function applyPreset(preset: TestPreset) {
    setSceneId(preset.sceneId);
    setLocationId(preset.locationId);
    setStartFlags(preset.flags ?? {});
    setStartInventory(preset.inventory ?? []);
    setActivePreset(preset.label + preset.chapter);
    doLaunch(preset.sceneId, preset.locationId, preset.flags ?? {}, preset.inventory ?? []);
  }

  const SEL: React.CSSProperties = {
    background: '#16213e', border: '1px solid #2a2a4e', color: '#ccc',
    borderRadius: 4, fontSize: 12, padding: '5px 8px',
  };

  // ──── 未起動: 起動フォーム ────
  if (!launched) {
    const hasData = allSceneIds.length > 0;
    return (
      <div style={{
        height: '100%', overflowY: 'auto',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        background: '#0f0f1a', fontFamily: 'monospace', padding: '32px 16px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 480 }}>
          <div style={{ fontSize: 15, fontWeight: 'bold', color: '#7986cb' }}>テストプレイ</div>

          {/* ── プリセット ── */}
          <div style={{ background: '#0d0d1a', borderRadius: 6, border: '1px solid #1a1a2e', padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#7986cb', marginBottom: 12 }}>プリセット（クリックで即起動）</div>
            {CHAPTERS.map(ch => (
              <div key={ch} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: '#556', marginBottom: 6, letterSpacing: '0.05em' }}>{ch}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {PRESETS.filter(p => p.chapter === ch).map(preset => {
                    const isActive = activePreset === preset.label + preset.chapter;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => applyPreset(preset)}
                        style={{
                          fontSize: 11, padding: '5px 10px',
                          background: isActive ? '#1e3a5a' : '#16213e',
                          border: `1px solid ${isActive ? '#4a7ab8' : '#2a2a4e'}`,
                          color: isActive ? '#8ab4f8' : '#aab',
                          borderRadius: 4, cursor: 'pointer',
                          transition: 'background 0.15s, border-color 0.15s',
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── カスタム起動 ── */}
          <div style={{ background: '#0d0d1a', borderRadius: 6, border: '1px solid #1a1a2e', padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#7986cb', marginBottom: 12 }}>カスタム起動</div>

            {!hasData && (
              <div style={{ fontSize: 12, color: '#445', padding: '10px 14px', background: '#12121e', borderRadius: 6, border: '1px solid #2a2a4e', marginBottom: 10 }}>
                フォルダを開くとシーン一覧が使えます。
              </div>
            )}

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#556', marginBottom: 5 }}>開始シーン</div>
              {hasData ? (
                <select
                  value={sceneId}
                  onChange={e => { setSceneId(e.target.value); setActivePreset(null); }}
                  style={{ ...SEL, width: '100%' }}
                >
                  {allSceneIds.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
              ) : (
                <input
                  type="text" value={sceneId} placeholder="scene_danchi_morning"
                  onChange={e => { setSceneId(e.target.value); setActivePreset(null); }}
                  style={{ ...SEL, width: '100%', boxSizing: 'border-box' }}
                />
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#556', marginBottom: 5 }}>場所</div>
              {rawLocations.length > 0 ? (
                <select
                  value={locationId}
                  onChange={e => { setLocationId(e.target.value); setActivePreset(null); }}
                  style={{ ...SEL, width: '100%' }}
                >
                  {rawLocations.map(l => <option key={l.id} value={l.id}>{l.name}（{l.id}）</option>)}
                </select>
              ) : (
                <input
                  type="text" value={locationId} placeholder="loc_danchi"
                  onChange={e => { setLocationId(e.target.value); setActivePreset(null); }}
                  style={{ ...SEL, width: '100%', boxSizing: 'border-box' }}
                />
              )}
            </div>

            <button
              className="primary"
              style={{ padding: '9px 0', fontSize: 13, width: '100%' }}
              onClick={() => doLaunch(sceneId, locationId)}
              disabled={!sceneId || !locationId}
            >
              ▶ 起動
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──── 起動中: iframe + デバッグパネル ────
  const iframeSrc = `${gameAppUrl}${gameAppUrl.includes('?') ? '&' : '?'}_t=${launchKey}`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0a12', fontFamily: 'monospace' }}>

      {/* トップバー */}
      <div style={{
        height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px', borderBottom: '1px solid #1a1a2e', background: '#0d0d1a',
      }}>
        <button
          onClick={() => setLaunched(false)}
          style={{
            fontSize: 11, padding: '3px 10px', background: '#16213e',
            border: '1px solid #2a2a4e', color: '#aab', borderRadius: 3, cursor: 'pointer',
          }}
        >
          ← 設定へ
        </button>
        <button
          onClick={() => doLaunch(sceneId, locationId)}
          style={{
            fontSize: 11, padding: '3px 10px', background: '#16213e',
            border: '1px solid #2a2a4e', color: '#aab', borderRadius: 3, cursor: 'pointer',
          }}
        >
          ⟳ 再起動
        </button>
        {/* プリセットクイック切り替え */}
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', flex: 1 }}>
          {PRESETS.map(preset => {
            const isActive = activePreset === preset.label + preset.chapter;
            return (
              <button
                key={preset.chapter + preset.label}
                onClick={() => applyPreset(preset)}
                title={`${preset.chapter} ${preset.label}`}
                style={{
                  fontSize: 10, padding: '2px 7px', flexShrink: 0,
                  background: isActive ? '#1e3a5a' : '#12121e',
                  border: `1px solid ${isActive ? '#4a7ab8' : '#1a1a2e'}`,
                  color: isActive ? '#8ab4f8' : '#557',
                  borderRadius: 3, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {preset.chapter.replace('第', '').replace('章', 'ch')} {preset.label}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: '#445', flexShrink: 0 }}>
          {gameState
            ? <span style={{ color: '#778' }}>{gameState.currentSceneId}　<span style={{ color: '#556' }}>({gameState.phase})</span></span>
            : <span style={{ color: '#334' }}>起動中…</span>
          }
        </div>
      </div>

      {/* メイン: iframe + パネル */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ゲーム iframe */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <iframe
            key={launchKey}
            ref={iframeRef}
            src={iframeSrc}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            title="game preview"
          />
        </div>

        {/* デバッグパネル */}
        <div style={{
          width: 280, flexShrink: 0, borderLeft: '1px solid #1a1a2e',
          overflowY: 'auto', background: '#0d0d1a',
        }}>
          <DebugPanel
            gameState={gameState}
            rawFlags={rawFlags}
            rawItems={rawItems}
            allSceneIds={allSceneIds}
            rawLocations={rawLocations}
          />
        </div>
      </div>
    </div>
  );
}
