import type { MazeTheme } from '../MazeApp.js';

export interface MazeItemDef {
  id: string;
  name: string;
  usable: boolean;
}

interface ItemPanelProps {
  inventory: string[];
  itemDefs: MazeItemDef[];
  theme: Required<MazeTheme>;
  onUse: (itemId: string, itemName: string) => void;
  notification?: string;
}

export function ItemPanel({ inventory, itemDefs, theme, onUse, notification }: ItemPanelProps) {
  const defMap = new Map(itemDefs.map(d => [d.id, d]));

  // 重複IDを折り畳んで個数付きで表示
  const counts = new Map<string, number>();
  for (const id of inventory) counts.set(id, (counts.get(id) ?? 0) + 1);
  const uniqueIds = [...counts.keys()];

  const sep = <div style={{ borderTop: `1px solid ${theme.uiBorder}`, flexShrink: 0 }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontFamily: 'monospace' }}>
      {sep}
      <div style={{ fontSize: 11, color: theme.uiBorder }}>アイテム</div>

      {notification && (
        <div style={{ fontSize: 11, color: theme.uiAccent, opacity: 0.85 }}>{notification}</div>
      )}

      {uniqueIds.length === 0 ? (
        <div style={{ fontSize: 10, color: theme.uiBorder, opacity: 0.5 }}>なし</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {uniqueIds.map(itemId => {
            const def = defMap.get(itemId);
            const name = def?.name ?? itemId;
            const usable = def?.usable ?? false;
            const count = counts.get(itemId) ?? 1;
            return (
              <div
                key={itemId}
                onClick={usable ? () => onUse(itemId, name) : undefined}
                style={{
                  fontSize: 12,
                  padding: '3px 6px',
                  color: usable ? theme.uiAccent : theme.uiBorder,
                  border: `1px solid ${usable ? theme.uiBorder : 'transparent'}`,
                  borderRadius: 2,
                  cursor: usable ? 'pointer' : 'default',
                  opacity: usable ? 1 : 0.5,
                  userSelect: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{usable ? '▶ ' : '　'}{name}</span>
                {count > 1 && <span style={{ fontSize: 10, opacity: 0.7 }}>×{count}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
