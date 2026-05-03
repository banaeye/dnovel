import { useState } from 'react';
import { useYamlFs } from './hooks/useYamlFs';
import { AreaEditorPage } from './pages/AreaEditorPage';
import { SceneEditorPage } from './pages/SceneEditorPage';
import { FlowPage } from './pages/FlowPage';
import { TestPlayPage } from './pages/TestPlayPage';

type Tab = 'scene' | 'area' | 'flow' | 'test';

export interface EditorConfig {
  gameAppUrl: string;
}

export function EditorApp({ gameAppUrl }: EditorConfig) {
  const fs = useYamlFs();
  const [tab, setTab] = useState<Tab>('scene');
  const [flowTargetId, setFlowTargetId] = useState<string | null>(null);
  const [flowHighlightId, setFlowHighlightId] = useState<string | null>(null);

  function handleSelectScene(id: string) {
    setFlowTargetId(id);
    setTab('scene');
  }

  function handleShowInFlow(id: string) {
    setFlowHighlightId(id);
    setTab('flow');
  }

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '8px 20px',
    cursor: 'pointer',
    fontWeight: tab === t ? 'bold' : 'normal',
    color: tab === t ? '#c5cae9' : '#666',
    borderBottom: tab === t ? '2px solid #5c6bc0' : '2px solid transparent',
    background: 'none',
    fontSize: 14,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: '#0d0d1a', borderBottom: '1px solid #222', flexShrink: 0 }}>
        <button style={tabStyle('scene')} onClick={() => setTab('scene')}>シーンエディタ</button>
        <button style={tabStyle('area')} onClick={() => setTab('area')}>エリアエディタ</button>
        <button style={tabStyle('flow')} onClick={() => setTab('flow')}>フロー図</button>
        <button style={tabStyle('test')} onClick={() => setTab('test')}>テストプレイ</button>
        <div style={{ flex: 1 }} />
        <button
          className="primary"
          style={{ margin: '0 12px', fontSize: 13 }}
          onClick={fs.openDirectory}
        >
          {fs.dirHandle ? '📂 再読み込み' : '📂 フォルダを開く'}
        </button>
        {fs.error && (
          <span style={{ color: '#ef5350', fontSize: 12, marginRight: 12 }}>エラー: {fs.error}</span>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'scene' && <SceneEditorPage {...fs} initialSelectedId={flowTargetId} onShowInFlow={handleShowInFlow} />}
        {tab === 'area' && <AreaEditorPage {...fs} />}
        {tab === 'flow' && <FlowPage rawScenes={fs.rawScenes} onSelectScene={handleSelectScene} initialSelectedId={flowHighlightId} />}
        {tab === 'test' && <TestPlayPage gameAppUrl={gameAppUrl} />}
      </div>
    </div>
  );
}
