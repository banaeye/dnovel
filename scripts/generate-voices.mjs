/**
 * VOICEVOXで全セリフの音声を事前生成し public/assets/voicevox/{hash}.wav に保存する
 * 使い方: npm run gen:voice
 * 前提: VOICEVOX エンジンが起動中 (http://localhost:50021)
 */

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const VOICEVOX_URL = process.env.VOICEVOX_URL ?? 'http://localhost:50021';
const OUT_DIR = path.join(ROOT, 'public/assets/voicevox');

function hashKey(text, speakerId) {
  return createHash('sha1').update(`${text}_${speakerId}`, 'utf8').digest('hex');
}

// YAML読み込み（全章分）
const SCENE_FILES = ['scenes.yaml', 'scenes_ch1.yaml', 'scenes_ch2.yaml', 'scenes_ch3.yaml'];
const scenes = SCENE_FILES.flatMap(file => {
  const fullPath = path.join(ROOT, 'src/data', file);
  if (!fs.existsSync(fullPath)) return [];
  return yaml.load(fs.readFileSync(fullPath, 'utf8')).scenes ?? [];
});
const characters = yaml.load(fs.readFileSync(path.join(ROOT, 'src/data/characters.yaml'), 'utf8')).characters;

// キャラID → speakerId マップ
const speakerMap = Object.fromEntries(
  characters
    .filter(c => c.voicevox_speaker_id != null)
    .map(c => [c.id, c.voicevox_speaker_id])
);

// 全メッセージから (text, speakerId) を収集（重複なし・child_scenes を再帰処理）
const jobs = new Map();
function collectJobs(sceneList) {
  for (const scene of sceneList) {
    for (const msg of scene.messages ?? []) {
      if (!msg.voice_character_id) continue;
      const speakerId = speakerMap[msg.voice_character_id];
      if (speakerId == null) continue;
      const key = hashKey(msg.text, speakerId);
      if (!jobs.has(key)) {
        jobs.set(key, { text: msg.text, speakerId, key });
      }
    }
    if (scene.child_scenes?.length) collectJobs(scene.child_scenes);
  }
}
collectJobs(scenes);

console.log(`対象: ${jobs.size} 件\n`);

// エンジン疎通確認
try {
  const res = await fetch(`${VOICEVOX_URL}/version`);
  if (!res.ok) throw new Error();
  const ver = await res.text();
  console.log(`VOICEVOX version: ${ver.trim()}\n`);
} catch {
  console.error(`エラー: VOICEVOXエンジンに接続できません (${VOICEVOX_URL})`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

let generated = 0, skipped = 0, errors = 0;

for (const { text, speakerId, key } of jobs.values()) {
  const outPath = path.join(OUT_DIR, `${key}.wav`);
  const label = `"${text.slice(0, 24)}${text.length > 24 ? '…' : ''}" (speaker:${speakerId})`;

  if (fs.existsSync(outPath)) {
    console.log(`  skip  ${label}`);
    skipped++;
    continue;
  }

  try {
    const queryRes = await fetch(
      `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
      { method: 'POST' }
    );
    if (!queryRes.ok) throw new Error(`audio_query ${queryRes.status}`);

    const synthRes = await fetch(
      `${VOICEVOX_URL}/synthesis?speaker=${speakerId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: await queryRes.text(),
      }
    );
    if (!synthRes.ok) throw new Error(`synthesis ${synthRes.status}`);

    fs.writeFileSync(outPath, Buffer.from(await synthRes.arrayBuffer()));
    console.log(`  gen   ${label} → ${key}.wav`);
    generated++;
  } catch (e) {
    console.error(`  error ${label}: ${e.message}`);
    errors++;
  }
}

console.log(`\n完了: ${generated}件生成, ${skipped}件スキップ, ${errors}件エラー`);
