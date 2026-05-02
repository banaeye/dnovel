import type { DebugStartConfig } from '@novel-engine/core';

const DEBUG_KEY = '__novel_debug_start__';

interface Preset {
  label: string;
  description: string;
  config: DebugStartConfig;
}

const PRESETS: Preset[] = [
  {
    label: 'ゲーム開始（通常）',
    description: '最初から普通にプレイ',
    config: {
      sceneId: 'scene_danchi_morning',
      locationId: 'loc_danchi',
    },
  },
  {
    label: 'CoderDojo 到着後',
    description: 'メンターに会う前の状態',
    config: {
      sceneId: 'scene_coderdojo_default',
      locationId: 'loc_coderdojo',
      flags: { flag_left_danchi: true, flag_station_explored: true },
      inventory: ['item_suica', 'item_candy'],
    },
  },
  {
    label: '団地への坂（初回）',
    description: 'CoderDojo 全イベント完了後',
    config: {
      sceneId: 'scene_slope_default',
      locationId: 'loc_slope',
      flags: {
        flag_left_danchi: true,
        flag_met_mentor: true,
        flag_examined_whiteboard: true,
        flag_examined_kids: true,
      },
      inventory: ['item_suica', 'item_candy'],
    },
  },
  {
    label: '大学生との会話',
    description: '坂で大学生に会うシーン',
    config: {
      sceneId: 'scene_slope_with_student',
      locationId: 'loc_slope',
      flags: {
        flag_left_danchi: true,
        flag_visited_slope: true,
        flag_met_mentor: true,
      },
      inventory: ['item_suica', 'item_candy'],
    },
  },
  {
    label: 'グミ入手後（駅へ）',
    description: 'グミを持って駅に行くと大学生がいる',
    config: {
      sceneId: 'scene_station_default',
      locationId: 'loc_station',
      flags: {
        flag_left_danchi: true,
        flag_visited_slope: true,
        flag_met_college_student: true,
        flag_yui_told_gummy: true,
      },
      inventory: ['item_suica', 'item_gummy'],
    },
  },
  {
    label: 'エンディング CGシーケンス',
    description: '左右交互5枚のCG演出から',
    config: {
      sceneId: 'scene_ending_cg_sequence',
      locationId: 'loc_station',
      flags: { flag_left_danchi: true },
      inventory: [],
    },
  },
  {
    label: 'エンディング 感動シーン',
    description: 'グミを渡した後の一枚絵セリフから',
    config: {
      sceneId: 'scene_gummy_joy_cg',
      locationId: 'loc_station',
      flags: { flag_left_danchi: true },
      inventory: [],
    },
  },
  {
    label: 'エンドロール',
    description: 'スタッフロールのみ確認',
    config: {
      sceneId: 'scene_ending_credits',
      locationId: 'loc_station',
      flags: {},
      inventory: [],
    },
  },
];

function launch(config: DebugStartConfig, gameAppUrl: string) {
  localStorage.setItem(DEBUG_KEY, JSON.stringify(config));
  window.open(gameAppUrl, '_blank');
}

export function TestPlayPage({ gameAppUrl }: { gameAppUrl: string }) {
  return (
    <div style={{ padding: 24, background: '#0f0f1a', minHeight: '100%', color: '#ccc' }}>
      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#7986cb', marginBottom: 20 }}>
        テストプレイ
      </div>
      <div style={{ fontSize: 12, color: '#555', marginBottom: 24 }}>
        プリセットを選んでゲームを別タブで起動します。
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 480 }}>
        {PRESETS.map((p) => (
          <div
            key={p.label}
            style={{
              background: '#16213e',
              border: '1px solid #2a2a4e',
              borderRadius: 8,
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: '#c5cae9', marginBottom: 2 }}>{p.label}</div>
              <div style={{ fontSize: 11, color: '#556' }}>{p.description}</div>
            </div>
            <button
              className="primary"
              style={{ flexShrink: 0, padding: '6px 16px', fontSize: 12 }}
              onClick={() => launch(p.config, gameAppUrl)}
            >
              ▶ 起動
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
