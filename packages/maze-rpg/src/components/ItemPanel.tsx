import type { MazeTheme } from '../MazeApp.js';
import type { ItemEffect } from '../engine/mazeEngine.js';

export interface MazeItemDef {
  id: string;
  name: string;
  usable: boolean;
  description?: string;
  category?: string;
}

interface ItemPanelProps {
  inventory: string[];
  itemDefs: MazeItemDef[];
  theme: Required<MazeTheme>;
  mode: 'explore' | 'battle';
  itemEffects?: Record<string, ItemEffect>;
  selectedItemId: string | null;
  onSelect: (itemId: string | null) => void;
  onUse: (itemId: string, itemName: string) => void;
  notification?: string;
  font: string;
}

function effectLabel(effect?: ItemEffect): string {
  if (!effect) return '迷路内で特別な効果はない';
  const labels: string[] = [];
  if (effect.healHp === 'full') labels.push('HP全回復');
  else if (typeof effect.healHp === 'number') labels.push(`HP+${effect.healHp}`);
  if (typeof effect.attackEnemy === 'number') labels.push(`敵に${effect.attackEnemy}ダメージ`);
  return labels.length > 0 ? labels.join(' / ') : '迷路内で特別な効果はない';
}

function categoryLabel(category?: string): string {
  switch (category) {
    case 'key_item': return '大事なもの';
    case 'consumable': return '消耗品';
    case 'tool': return '道具';
    case 'misc': return 'その他';
    default: return 'アイテム';
  }
}

function getUseState(item: MazeItemDef | undefined, effect: ItemEffect | undefined, mode: 'explore' | 'battle') {
  if (!item?.usable) return { canUse: false, reason: '使用できない' };
  if (mode === 'explore' && effect?.attackEnemy !== undefined) return { canUse: false, reason: '戦闘中のみ使用可' };
  if (mode === 'battle' && !effect?.healHp && effect?.attackEnemy === undefined) return { canUse: false, reason: '戦闘中は効果なし' };
  return { canUse: true, reason: '使用可能' };
}

function ItemRow({
  name, selected, usable, count, theme, font, onSelect,
}: { name: string; selected: boolean; usable: boolean; count: number; theme: Required<MazeTheme>; font: string; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        fontSize: 12,
        padding: '5px 8px',
        borderRadius: 3,
        cursor: 'pointer',
        background: selected ? theme.uiBorder : 'transparent',
        border: `1px solid ${selected ? theme.uiAccent : theme.uiBorder}`,
        color: usable ? theme.uiAccent : theme.uiBorder,
        opacity: usable ? 1 : 0.55,
        fontFamily: font,
        userSelect: 'none',
        transition: 'background 0.12s, border-color 0.12s',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      <span style={{ fontSize: 10, opacity: 0.6 }}>
        {count > 1 ? `x${count}` : ''}
      </span>
    </button>
  );
}

export function ItemPanel({
  inventory,
  itemDefs,
  theme,
  mode,
  itemEffects,
  selectedItemId,
  onSelect,
  onUse,
  notification,
  font,
}: ItemPanelProps) {
  const defMap = new Map(itemDefs.map(d => [d.id, d]));
  const counts = new Map<string, number>();
  for (const id of inventory) counts.set(id, (counts.get(id) ?? 0) + 1);
  const uniqueIds = [...counts.keys()];
  const selectedId = selectedItemId && counts.has(selectedItemId) ? selectedItemId : null;
  const selectedDef = selectedId ? defMap.get(selectedId) : undefined;
  const selectedName = selectedDef?.name ?? selectedId ?? '';
  const selectedEffect = selectedId ? itemEffects?.[selectedId] : undefined;
  const useState = getUseState(selectedDef, selectedEffect, mode);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minHeight: 0, flex: 1 }}>
      <div style={{
        borderTop: `1px solid ${theme.uiBorder}`,
        paddingTop: 8,
        fontSize: 10,
        color: theme.uiBorder,
        letterSpacing: '0.08em',
        fontFamily: font,
      }}>
        アイテム
        <span style={{ marginLeft: 8, color: theme.uiAccent, opacity: 0.7 }}>
          {mode === 'battle' ? '戦闘中' : '探索中'}
        </span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 96, overflow: 'auto', paddingRight: 2 }}>
          {uniqueIds.map(itemId => {
            const def = defMap.get(itemId);
            const effect = itemEffects?.[itemId];
            const state = getUseState(def, effect, mode);
            return (
              <ItemRow
                key={itemId}
                name={def?.name ?? itemId}
                selected={selectedId === itemId}
                usable={state.canUse}
                count={counts.get(itemId) ?? 1}
                theme={theme}
                font={font}
                onSelect={() => onSelect(itemId)}
              />
            );
          })}
        </div>
      )}

      <div
        style={{
          minHeight: 118,
          border: `1px solid ${theme.uiBorder}`,
          borderRadius: 3,
          background: 'rgba(0,0,0,0.18)',
          padding: '7px 8px',
          fontFamily: font,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        {selectedId ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
              <strong style={{ color: theme.uiAccent, fontSize: 13, fontWeight: 700 }}>{selectedName}</strong>
              <span style={{ color: theme.uiBorder, fontSize: 10, whiteSpace: 'nowrap' }}>
                {categoryLabel(selectedDef?.category)} {counts.get(selectedId)! > 1 ? `x${counts.get(selectedId)}` : ''}
              </span>
            </div>
            <div style={{ color: '#e8d5aa', fontSize: 11, lineHeight: 1.45, minHeight: 31 }}>
              {selectedDef?.description ?? '説明はない。'}
            </div>
            <div style={{ color: theme.uiAccent, fontSize: 11, opacity: 0.85 }}>
              効果: {effectLabel(selectedEffect)}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 'auto' }}>
              <button
                type="button"
                disabled={!useState.canUse}
                onClick={() => onUse(selectedId, selectedName)}
                style={{
                  flex: '0 0 76px',
                  padding: '6px 0',
                  borderRadius: 3,
                  border: `1px solid ${useState.canUse ? theme.uiAccent : theme.uiBorder}`,
                  background: useState.canUse ? theme.uiBorder : 'transparent',
                  color: useState.canUse ? theme.uiAccent : theme.uiBorder,
                  cursor: useState.canUse ? 'pointer' : 'default',
                  fontFamily: font,
                  fontSize: 12,
                }}
              >
                使う
              </button>
              <span style={{ color: useState.canUse ? theme.uiAccent : theme.uiBorder, fontSize: 10, opacity: 0.8 }}>
                {useState.reason}
              </span>
            </div>
          </>
        ) : (
          <div style={{ color: theme.uiBorder, opacity: 0.55, fontSize: 11, lineHeight: 1.5 }}>
            アイテムを選ぶと、説明と効果を確認できます。
          </div>
        )}
      </div>
    </div>
  );
}
