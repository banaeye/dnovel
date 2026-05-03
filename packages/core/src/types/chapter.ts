import type { MasterData } from '../loaders/dataLoader';

export interface ChapterConfig {
  /** 章の識別子（セーブデータにも保存する） */
  id: string;
  /** タイトル画面に表示するボタンラベル（例: "第2章へ"） */
  title: string;
  /** この章で使用するマスターデータ */
  masterData: MasterData;
  /** この章の開始シーン ID */
  initialSceneId: string;
  /** この章の開始ロケーション ID */
  initialLocationId: string;
  /** このフラグが true のときボタンを表示する。省略時は常に表示する */
  unlockFlag?: string;
  /** この章から開始するときにセットする前提フラグ */
  initialFlags?: Record<string, boolean | number | string>;
}
