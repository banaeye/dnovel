import { useState, useEffect } from 'react';
import { useYamlFs, findScene, updateSceneInTree, addSceneToTree, collectAllSceneIds } from '../hooks/useYamlFs';
import type { RawScene, RawCharacterDisplay, RawFlagSet, RawChoice, RawItemGive, RawItem } from '../hooks/useYamlFs';
import { SceneList } from '../components/SceneList';
import { MessageEditor } from '../components/MessageEditor';

const POSITIONS = ['left', 'center', 'right'] as const;

interface SceneEditorPageProps {
  sharedDirHandle?: FileSystemDirectoryHandle | null;
  onDirOpen?: () => void;
}

export function SceneEditorPage({ sharedDirHandle, onDirOpen }: SceneEditorPageProps) {
  const { dirHandle, rawScenes, rawCharacters, rawLocations, rawItems, error, openDirectory, saveScenes } = useYamlFs();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RawScene | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const effectiveDirHandle = sharedDirHandle ?? dirHandle;
  const allSceneIds = collectAllSceneIds(rawScenes);

  useEffect(() => {
    if (!selectedId) { setDraft(null); setDirty(false); return; }
    const scene = findScene(rawScenes, selectedId);
    setDraft(scene ? { ...scene } : null);
    setDirty(false);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  function patch(p: Partial<RawScene>) {
    setDraft((d) => d ? { ...d, ...p } : d);
    setDirty(true);
  }

  async function handleAddScene(parentId: string | null) {
    const newId = `scene_new_${Date.now()}`;
    const newScene: RawScene = { id: newId, messages: [] };
    const updated = addSceneToTree(rawScenes, newScene, parentId);
    await saveScenes(updated);
    setSelectedId(newId);
  }

  async function handleSave() {
    if (!draft || !selectedId) return;
    const updated = updateSceneInTree(rawScenes, draft, selectedId);
    await saveScenes(updated);
    if (draft.id !== selectedId) setSelectedId(draft.id);
    setDirty(false);
    setSaveStatus('保存しました ✓');
    setTimeout(() => setSaveStatus(''), 2500);
  }

  const open = onDirOpen ?? openDirectory;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* ツールバー */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        background: '#16213e',
        borderBottom: '1px solid #333',
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 'bold', color: '#5c6bc0' }}>シーンエディタ</span>
        <button className="primary" onClick={open}>
          {effectiveDirHandle ? '📂 再読み込み' : '📂 フォルダを開く'}
        </button>
        <button className="primary" onClick={handleSave} disabled={!dirty || !effectiveDirHandle}>
          💾 保存
        </button>
        {saveStatus && <span style={{ color: '#66bb6a', fontSize: 12 }}>{saveStatus}</span>}
        {error && <span style={{ color: '#ef5350', fontSize: 12 }}>エラー: {error}</span>}
        {dirty && !saveStatus && <span style={{ color: '#ffb300', fontSize: 12 }}>● 未保存</span>}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左: シーンツリー */}
        <div style={{
          width: 220, flexShrink: 0,
          background: '#16213e',
          borderRight: '1px solid #333',
          padding: 8,
          overflow: 'auto',
        }}>
          {rawScenes.length === 0
            ? <div style={{ color: '#444', fontSize: 12, padding: 8 }}>フォルダを開いてください</div>
            : <SceneList scenes={rawScenes} selectedId={selectedId} onSelect={setSelectedId} onAddScene={handleAddScene} />
          }
        </div>

        {/* 右: 編集エリア */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#0f0f1a' }}>
          {!draft ? (
            <div style={{ color: '#444', textAlign: 'center', marginTop: 80 }}>
              左のシーンを選択してください
            </div>
          ) : (
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              {/* 基本情報 */}
              <Section title="基本情報">
                <Row label="ID">
                  <input value={draft.id} onChange={(e) => patch({ id: e.target.value })} />
                </Row>
                <Row label="ロケーション">
                  <select value={draft.location_id ?? ''} onChange={(e) => patch({ location_id: e.target.value || undefined })}>
                    <option value="">（なし）</option>
                    {rawLocations.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.id})</option>)}
                  </select>
                </Row>
                <Row label="背景画像">
                  <input value={draft.background ?? ''} placeholder="backgrounds/xxx.jpg" onChange={(e) => patch({ background: e.target.value || undefined })} />
                </Row>
                <Row label="BGM">
                  <input value={draft.bgm ?? ''} placeholder="audio/bgm/xxx.mp3" onChange={(e) => patch({ bgm: e.target.value || undefined })} />
                </Row>
                <Row label="一枚絵 (overlay_image)">
                  <input value={draft.overlay_image ?? ''} placeholder="cg/xxx.jpg" onChange={(e) => patch({ overlay_image: e.target.value || undefined })} />
                </Row>
                <Row label="次のシーン (next_scene)">
                  <select value={draft.next_scene ?? ''} onChange={(e) => patch({ next_scene: e.target.value || null })}>
                    <option value="">（なし）</option>
                    {allSceneIds.map((id) => <option key={id} value={id}>{id}</option>)}
                  </select>
                </Row>
              </Section>

              {/* メッセージ */}
              <Section title="メッセージ">
                <MessageEditor
                  messages={draft.messages ?? []}
                  characters={rawCharacters}
                  onChange={(msgs) => patch({ messages: msgs })}
                />
              </Section>

              {/* 表示キャラクター */}
              <Section title="表示キャラクター（シーン開始時）">
                <CharacterDisplayEditor
                  displays={draft.characters ?? []}
                  characters={rawCharacters}
                  onChange={(chars) => patch({ characters: chars.length ? chars : undefined })}
                />
              </Section>

              {/* 分岐 */}
              <Section title="分岐">
                <BranchEditor
                  branches={draft.branches}
                  allSceneIds={allSceneIds}
                  onChange={(b) => patch({ branches: b })}
                />
              </Section>

              {/* フラグ設定 */}
              <Section title="フラグ設定 (flags_set)">
                <FlagsSetEditor
                  flags={draft.flags_set ?? []}
                  onChange={(f) => patch({ flags_set: f.length ? f : undefined })}
                />
              </Section>

              {/* アイテム付与 */}
              <Section title="アイテム付与 (item_give)">
                <ItemGiveEditor
                  items={draft.item_give ?? []}
                  allItems={rawItems}
                  onChange={(items) => patch({ item_give: items.length ? items : undefined })}
                />
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 汎用セクション ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 13, fontWeight: 'bold', color: '#7986cb',
        borderBottom: '1px solid #2a2a4e', paddingBottom: 4, marginBottom: 12,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8, marginBottom: 8, alignItems: 'center' }}>
      <label style={{ margin: 0, color: '#aaa', fontSize: 12 }}>{label}</label>
      {children}
    </div>
  );
}

/* ── キャラクター表示エディタ ── */
function CharacterDisplayEditor({ displays, characters, onChange }: {
  displays: RawCharacterDisplay[];
  characters: { id: string; name: string }[];
  onChange: (d: RawCharacterDisplay[]) => void;
}) {
  function update(i: number, patch: Partial<RawCharacterDisplay>) {
    onChange(displays.map((d, idx) => idx === i ? { ...d, ...patch } : d));
  }
  function remove(i: number) { onChange(displays.filter((_, idx) => idx !== i)); }
  function add() { onChange([...displays, { character_id: characters[0]?.id ?? '', position: 'left', expression: 'normal' }]); }

  return (
    <div>
      {displays.map((d, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <select value={d.character_id} onChange={(e) => update(i, { character_id: e.target.value })} style={{ flex: 2 }}>
            {characters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={d.position} onChange={(e) => update(i, { position: e.target.value as typeof POSITIONS[number] })} style={{ flex: 1 }}>
            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input value={d.expression} placeholder="expression" onChange={(e) => update(i, { expression: e.target.value })} style={{ flex: 1 }} />
          <button className="danger" onClick={() => remove(i)}>×</button>
        </div>
      ))}
      <button className="primary" onClick={add} style={{ width: '100%' }}>＋ キャラ追加</button>
    </div>
  );
}

/* ── 分岐エディタ ── */
function BranchEditor({ branches, allSceneIds, onChange }: {
  branches: RawScene['branches'];
  allSceneIds: string[];
  onChange: (b: RawScene['branches']) => void;
}) {
  const type = branches?.type ?? 'none';
  const choices = branches?.choices ?? [];

  function updateChoice(i: number, p: Partial<RawChoice>) {
    const next = choices.map((c, idx) => idx === i ? { ...c, ...p } : c);
    onChange({ type, choices: next });
  }
  function addChoice() { onChange({ type, choices: [...choices, { label: '', condition: null, next_scene: null }] }); }
  function removeChoice(i: number) { onChange({ type, choices: choices.filter((_, idx) => idx !== i) }); }

  return (
    <div>
      <Row label="分岐タイプ">
        <select value={type} onChange={(e) => onChange({ type: e.target.value as 'choice' | 'auto' | 'none', choices })}>
          <option value="none">none</option>
          <option value="choice">choice（選択肢）</option>
          <option value="auto">auto（条件自動）</option>
        </select>
      </Row>

      {(type === 'choice' || type === 'auto') && (
        <div style={{ marginTop: 8 }}>
          {choices.map((c, i) => (
            <div key={i} style={{ background: '#1e1e30', border: '1px solid #333', borderRadius: 6, padding: 8, marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: 11 }}>#{i + 1}</span>
                <select value={c.next_scene ?? ''} onChange={(e) => updateChoice(i, { next_scene: e.target.value || null })} style={{ flex: 1 }}>
                  <option value="">（なし）</option>
                  {allSceneIds.map((id) => <option key={id} value={id}>{id}</option>)}
                </select>
                <button className="danger" onClick={() => removeChoice(i)}>×</button>
              </div>
              {type === 'choice' && (
                <input value={c.label} placeholder="選択肢ラベル" onChange={(e) => updateChoice(i, { label: e.target.value })} />
              )}
            </div>
          ))}
          <button className="primary" onClick={addChoice} style={{ width: '100%' }}>＋ 選択肢追加</button>
        </div>
      )}
    </div>
  );
}

/* ── アイテム付与エディタ ── */
function ItemGiveEditor({ items, allItems, onChange }: {
  items: RawItemGive[];
  allItems: RawItem[];
  onChange: (items: RawItemGive[]) => void;
}) {
  function update(i: number, item_id: string) {
    onChange(items.map((it, idx) => idx === i ? { ...it, item_id } : it));
  }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function add() { onChange([...items, { item_id: allItems[0]?.id ?? '', condition: null }]); }

  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <select
            value={it.item_id}
            style={{ flex: 1 }}
            onChange={(e) => update(i, e.target.value)}
          >
            {allItems.map((item) => (
              <option key={item.id} value={item.id}>{item.name} ({item.id})</option>
            ))}
            {!allItems.find((item) => item.id === it.item_id) && (
              <option value={it.item_id}>{it.item_id}</option>
            )}
          </select>
          {it.condition != null && (
            <span style={{ color: '#ffb300', fontSize: 11, flexShrink: 0 }}>条件あり</span>
          )}
          <button className="danger" onClick={() => remove(i)}>×</button>
        </div>
      ))}
      <button className="primary" onClick={add} style={{ width: '100%' }} disabled={allItems.length === 0}>
        ＋ アイテム追加
      </button>
      {allItems.length === 0 && (
        <div style={{ color: '#666', fontSize: 11, marginTop: 4 }}>items.yaml が読み込まれていません</div>
      )}
    </div>
  );
}

/* ── フラグ設定エディタ ── */
function FlagsSetEditor({ flags, onChange }: { flags: RawFlagSet[]; onChange: (f: RawFlagSet[]) => void }) {
  function update(i: number, p: Partial<RawFlagSet>) {
    onChange(flags.map((f, idx) => idx === i ? { ...f, ...p } : f));
  }
  function remove(i: number) { onChange(flags.filter((_, idx) => idx !== i)); }
  function add() { onChange([...flags, { flag: '', value: true }]); }

  return (
    <div>
      {flags.map((f, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <input value={f.flag} placeholder="flag_xxx" onChange={(e) => update(i, { flag: e.target.value })} style={{ flex: 2 }} />
          <select
            value={String(f.value)}
            style={{ flex: 1 }}
            onChange={(e) => {
              const v = e.target.value;
              update(i, { value: v === 'true' ? true : v === 'false' ? false : v });
            }}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
          <button className="danger" onClick={() => remove(i)}>×</button>
        </div>
      ))}
      <button className="primary" onClick={add} style={{ width: '100%' }}>＋ フラグ追加</button>
    </div>
  );
}
