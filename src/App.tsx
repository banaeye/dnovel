import { getMasterData } from './loaders/demoLoader';
import { GameHub, NovelEngineAdapter } from '@novel-engine/hub';
import { MazeRpgEngine } from '@novel-engine/maze-rpg';
import { RunnerActionEngine } from '@novel-engine/runner-action';
import { MemoryGameEngine } from '@novel-engine/memory-game';
import { FlashCalcEngine } from '@novel-engine/flash-calc';
import { SpotDifferenceEngine } from '@novel-engine/spot-difference';
import { TimingGameEngine } from '@novel-engine/timing-game';
import type { ChapterConfig } from '@novel-engine/core';

const masterData = getMasterData();
const chapter2MasterData = getMasterData('chapter2');
const chapter3MasterData = getMasterData('chapter3');
const chapter4MasterData = getMasterData('chapter4');
const chapter5MasterData = getMasterData('chapter5');
const ASSETS_BASE = `${import.meta.env.BASE_URL}assets`;

const CHAPTERS: ChapterConfig[] = [
  {
    id: 'chapter1',
    title: '第1章へ',
    chapterTitle: '赤羽の一日',
    masterData,
    initialSceneId: 'scene_danchi_morning',
    initialLocationId: 'loc_danchi',
    initialFlags: {
      flag_chapter: 1,
    },
  },
  {
    id: 'chapter2',
    title: '第2章へ',
    chapterTitle: '一番街の怨霊',
    masterData: chapter2MasterData,
    initialSceneId: 'scene_ch2_start',
    initialLocationId: 'loc_danchi',
    unlockFlag: 'flag_chapter1_cleared',
    initialFlags: {
      flag_chapter: 2,
      flag_chapter1_cleared: true,
    },
  },
  {
    id: 'chapter3',
    title: '第3章へ',
    chapterTitle: 'アーケード街の死闘',
    masterData: chapter3MasterData,
    initialSceneId: 'scene_ch3_start',
    initialLocationId: 'loc_danchi',
    unlockFlag: 'flag_ch2_cleared',
    initialFlags: {
      flag_chapter: 3,
      flag_chapter1_cleared: true,
      flag_ch2_cleared: true,
    },
  },
  {
    id: 'chapter4',
    title: '第4章へ',
    chapterTitle: '七つのグミ',
    masterData: chapter4MasterData,
    initialSceneId: 'scene_ch4_start',
    initialLocationId: 'loc_danchi',
    unlockFlag: 'flag_ch3_cleared',
    initialFlags: {
      flag_chapter: 4,
      flag_chapter1_cleared: true,
      flag_ch2_cleared: true,
      flag_ch3_cleared: true,
      flag_station_explored: true,
      flag_visited_slope: true,
      flag_ch3_museum_unlocked: true,
    },
  },
  {
    id: 'chapter5',
    title: '第5章へ',
    chapterTitle: '美術館の迷宮',
    masterData: chapter5MasterData,
    initialSceneId: 'scene_ch5_start',
    initialLocationId: 'loc_danchi',
    unlockFlag: 'flag_ch4_cleared',
    initialFlags: {
      flag_chapter: 5,
      flag_chapter1_cleared: true,
      flag_ch2_cleared: true,
      flag_ch3_cleared: true,
      flag_ch4_cleared: true,
      flag_station_explored: true,
      flag_visited_slope: true,
      flag_ch3_museum_unlocked: true,
    },
  },
];

export default function App() {
  return (
    <GameHub
      engines={{
        novel: NovelEngineAdapter,
        maze_rpg: MazeRpgEngine,
        runner_action: RunnerActionEngine,
        memory_game: MemoryGameEngine,
        flash_calc: FlashCalcEngine,
        spot_difference: SpotDifferenceEngine,
        timing_game: TimingGameEngine,
      }}
      initial={{
        engineId: 'novel',
        config: {
          masterData,
          assetsBaseUrl: ASSETS_BASE,
          chapterId: 'chapter1',
          initialSceneId: 'scene_danchi_morning',
          initialLocationId: 'loc_danchi',
          chapters: CHAPTERS,
        },
      }}
      initialContext={{ flags: {}, inventory: [], playerStats: {} }}
    />
  );
}
