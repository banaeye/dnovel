import { useState } from 'react';
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
  font: string;
}

function ItemRow({
  itemId, name, usable, count, theme, font, onUse,
}: { itemId: string; name: string; usable: boolean; count: number; theme: Required<MazeTheme>; font: string; onUse: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={usable ? onUse : undefined}
      onMouseEnter={() => usable && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 12,
        padding: '5px 8px',
        borderRadius: 3,
        cursor: usable ? 'pointer' : 'default',
        background: hover ? theme.uiBorder : 'transparent',
        border: `1px solid ${usable ? (hover ? theme.uiAccent : theme.uiBorder) : 'transparent'}`,
        color: usable ? theme.uiAccent : theme.uiBorder,
        opacity: usable ? 1 : 0.55,
        fontFamily: font,
        userSelect: 'none',
        transition: 'background 0.12s',
      }}
    >
      <span>{name}</span>
      <span style={{ fontSize: 10, opacity: 0.6 }}>
        {usable ? '使う' : '　'}{count > 1 ? ` ×${count}` : ''}
      </span>
    </div>
  );
}

export function ItemPanel({ inventory, itemDefs, theme, onUse, notification, font }: ItemPanelProps) {
  const defMap = new Map(itemDefs.map(d => [d.id, d]));
  const counts = new Map<string, number>();
  for (const id of inventory) counts.set(id, (counts.get(id) ?? 0) + 1);
  const uniqueIds = [...counts.keys()];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{
        borderTop: `1px solid ${theme.uiBorder}`,
        paddingTop: 8,
        fontSize: 10,
        color: theme.uiBorder,
        letterSpacing: '0.08em',
        fontFamily: font,
      }}>
        アイテム
      </div>

      {notification && (
        <div style={{
          fontSize: 11,
          color: theme.uiAccent,
          padding: '3px 6px',
          background: `${theme.uiBorder}55`,
          borderRadius: 3,
          fontFamily: font,
        }}>
          {notification}
        </div>
      )}

      {uniqueIds.length === 0 ? (
        <div style={{ fontSize: 11, color: theme.uiBorder, opacity: 0.4, padding: '2px 4px', fontFamily: font }}>
          持ち物なし
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {uniqueIds.map(itemId => {
            const def = defMap.get(itemId);
            return (
              <ItemRow
                key={itemId}
                itemId={itemId}
                name={def?.name ?? itemId}
                usable={def?.usable ?? false}
                count={counts.get(itemId) ?? 1}
                theme={theme}
                font={font}
                onUse={() => onUse(itemId, def?.name ?? itemId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
