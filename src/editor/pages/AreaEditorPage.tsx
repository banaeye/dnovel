import { useState, useEffect } from 'react';
import { collectAllSceneIds, findScene, updateSceneInTree } from '../hooks/useYamlFs';
import type { RawArea, RawScene, SharedFsProps } from '../hooks/useYamlFs';
import { AreaCanvas } from '../components/AreaCanvas';
import { AreaPanel } from '../components/AreaPanel';

export function AreaEditorPage({ dirHandle, rawScenes, error, saveScenes }: SharedFsProps) {
  const [selectedSceneId, setSelectedSceneId] = useState<string>('');
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [localAreas, setLocalAreas] = useState<RawArea[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const allSceneIds = collectAllSceneIds(rawScenes);
  const currentScene: RawScene | null = selectedSceneId ? findScene(rawScenes, selectedSceneId) : null;

  // 背景画像は Vite devサーバーの /assets/ か、window.location.origin 基準で取得
  const backgroundSrc = currentScene?.background
    ? `${window.location.origin}/assets/${currentScene.background}`
    : null;

  useEffect(() => {
    const areas = (currentScene?.clickable_areas as RawArea[] | undefined) ?? [];
    setLocalAreas(areas);
    setSelectedAreaId(null);
    setDirty(false);
  }, [selectedSceneId, rawScenes]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAreasChange(areas: RawArea[]) {
    setLocalAreas(areas);
    setDirty(true);
  }

  async function handleSave() {
    if (!currentScene) return;
    const updatedScene: RawScene = { ...currentScene, clickable_areas: localAreas };
    const updatedScenes = updateSceneInTree(rawScenes, updatedScene);
    await saveScenes(updatedScenes);
    setDirty(false);
    setSaveStatus('保存しました ✓');
    setTimeout(() => setSaveStatus(''), 2500);
  }

  // シーン選択肢: 全IDを表示し、エリア数を付記
  function sceneLabel(id: string): string {
    const scene = findScene(rawScenes, id);
    const count = (scene?.clickable_areas as RawArea[] | undefined)?.length ?? 0;
    return count > 0 ? `${id}  [エリア ${count}]` : id;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* ツールバー */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        background: '#16213e',
        borderBottom: '1px solid #333',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 'bold', color: '#5c6bc0', marginRight: 4 }}>エリアエディタ</span>

        <select
          style={{ width: 300 }}
          value={selectedSceneId}
          onChange={(e) => setSelectedSceneId(e.target.value)}
          disabled={rawScenes.length === 0}
        >
          <option value="">
            {rawScenes.length === 0 ? '（フォルダを開いてください）' : '― シーンを選択 ―'}
          </option>
          {allSceneIds.map((id) => (
            <option key={id} value={id}>{sceneLabel(id)}</option>
          ))}
        </select>

        <button
          className="primary"
          onClick={handleSave}
          disabled={!dirty || !dirHandle}
        >
          💾 保存
        </button>

        {saveStatus && (
          <span style={{ color: '#66bb6a', fontSize: 12 }}>{saveStatus}</span>
        )}
        {error && (
          <span style={{ color: '#ef5350', fontSize: 12 }}>エラー: {error}</span>
        )}
        {dirty && !saveStatus && (
          <span style={{ color: '#ffb300', fontSize: 12 }}>● 未保存の変更あり</span>
        )}
      </div>

      {/* メインエリア */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* キャンバス */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 16,
          overflow: 'auto',
          background: '#0f0f1a',
        }}>
          {!dirHandle ? (
            <div style={{ color: '#555', margin: 'auto', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
              <div>「フォルダを開く」で <code>src/data/</code> を選択してください</div>
              <div style={{ fontSize: 12, color: '#444', marginTop: 6 }}>Chrome / Edge のみ対応</div>
            </div>
          ) : !selectedSceneId ? (
            <div style={{ color: '#555', margin: 'auto', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>↑</div>
              <div>上のドロップダウンからシーンを選択してください</div>
              <div style={{ fontSize: 12, color: '#444', marginTop: 6 }}>
                <code>[エリア N]</code> と表示されているシーンにクリッカブルエリアがあります
              </div>
            </div>
          ) : (
            <AreaCanvas
              backgroundSrc={backgroundSrc}
              areas={localAreas}
              selectedId={selectedAreaId}
              onSelect={setSelectedAreaId}
              onAreaChange={handleAreasChange}
            />
          )}
        </div>

        {/* サイドパネル */}
        {dirHandle && selectedSceneId && (
          <div style={{
            width: 280,
            padding: 12,
            background: '#16213e',
            borderLeft: '1px solid #333',
            overflow: 'auto',
            flexShrink: 0,
          }}>
            <AreaPanel
              areas={localAreas}
              selectedId={selectedAreaId}
              allSceneIds={allSceneIds}
              onSelect={setSelectedAreaId}
              onAreaChange={handleAreasChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
