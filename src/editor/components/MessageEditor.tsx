import type { RawMessage, RawCharacter } from '../hooks/useYamlFs';

interface MessageEditorProps {
  messages: RawMessage[];
  characters: RawCharacter[];
  onChange: (messages: RawMessage[]) => void;
}

const NULL_VOICE = '__null__';

export function MessageEditor({ messages, characters, onChange }: MessageEditorProps) {
  function update(index: number, patch: Partial<RawMessage>) {
    onChange(messages.map((m, i) => i === index ? { ...m, ...patch } : m));
  }

  function remove(index: number) {
    onChange(messages.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...messages, { text: '', voice_character_id: null }]);
  }

  function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= messages.length) return;
    const arr = [...messages];
    [arr[index], arr[next]] = [arr[next], arr[index]];
    onChange(arr);
  }

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} style={{
          background: '#1e1e30',
          border: '1px solid #333',
          borderRadius: 6,
          padding: 10,
          marginBottom: 6,
        }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 6, alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: 11, marginRight: 4 }}>#{i + 1}</span>

            <select
              style={{ flex: '0 0 160px' }}
              value={msg.voice_character_id ?? NULL_VOICE}
              onChange={(e) => update(i, { voice_character_id: e.target.value === NULL_VOICE ? null : e.target.value })}
            >
              <option value={NULL_VOICE}>（ナレーション）</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
              ))}
            </select>

            <input
              style={{ flex: '0 0 100px' }}
              value={msg.voice_style ?? ''}
              placeholder="voice_style"
              onChange={(e) => update(i, { voice_style: e.target.value || undefined })}
            />

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} title="上へ">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === messages.length - 1} title="下へ">↓</button>
              <button className="danger" onClick={() => remove(i)} title="削除">×</button>
            </div>
          </div>

          <textarea
            value={msg.text}
            rows={2}
            style={{ resize: 'vertical' }}
            onChange={(e) => update(i, { text: e.target.value })}
          />

          <input
            value={msg.focus_overlay_image ?? ''}
            placeholder="注目画像 cg/xxx.png"
            onChange={(e) => update(i, { focus_overlay_image: e.target.value || undefined })}
            style={{ marginTop: 6 }}
          />
        </div>
      ))}

      <button className="primary" onClick={add} style={{ width: '100%', marginTop: 4 }}>
        ＋ メッセージ追加
      </button>
    </div>
  );
}
