import { useState } from 'react';
import { AreaEditorPage } from './pages/AreaEditorPage';
import { SceneEditorPage } from './pages/SceneEditorPage';
import { TestPlayPage } from './pages/TestPlayPage';

type Tab = 'scene' | 'area' | 'test';

export interface EditorConfig {
  gameAppUrl: string;
}

export function EditorApp({ gameAppUrl }: EditorConfig) {
  const [tab, setTab] = useState<Tab>('scene');

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
      <div style={{ display: 'flex', background: '#0d0d1a', borderBottom: '1px solid #222', flexShrink: 0 }}>
        <button style={tabStyle('scene')} onClick={() => setTab('scene')}>シーンエディタ</button>
        <button style={tabStyle('area')} onClick={() => setTab('area')}>エリアエディタ</button>
        <button style={tabStyle('test')} onClick={() => setTab('test')}>テストプレイ</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'scene' && <SceneEditorPage />}
        {tab === 'area' && <AreaEditorPage />}
        {tab === 'test' && <TestPlayPage gameAppUrl={gameAppUrl} />}
      </div>
    </div>
  );
}
