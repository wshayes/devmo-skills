#!/usr/bin/env node
// Generate per-scene ElevenLabs voiceover + word timings for a Remotion project.
//   node tts.mjs <storyboard.json> <remotion-project-dir>
//   node tts.mjs --selftest
// Writes <project>/public/vo/<video>/<scene>.mp3 and <project>/src/timing.json.
// Re-runs skip scenes whose text/voice hash is unchanged.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const PAD_SEC = 0.5; // breathing room after each scene's VO

// ElevenLabs character alignment -> @remotion/captions Caption[] (ms, offset by scene start).
// Non-first words carry a leading space, matching @remotion/captions' whitespace convention.
export function charsToCaptions({ characters, character_start_times_seconds: s, character_end_times_seconds: e }, offsetMs = 0) {
  const out = [];
  let cur = null;
  characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { cur = null; return; }
    if (!cur) {
      cur = { text: (out.length ? " " : "") + ch, startMs: s[i] * 1000 + offsetMs, endMs: 0, timestampMs: null, confidence: 1 };
      out.push(cur);
    } else cur.text += ch;
    cur.endMs = e[i] * 1000 + offsetMs;
  });
  out.forEach((c) => { c.startMs = Math.round(c.startMs); c.endMs = Math.round(c.endMs); c.timestampMs = Math.round((c.startMs + c.endMs) / 2); });
  return out;
}

async function tts({ voiceId, modelId, text, previous_text, next_text }) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: modelId, previous_text, next_text }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  return res.json(); // { audio_base64, alignment, normalized_alignment }
}

async function main([sbPath, projectDir]) {
  if (!sbPath || !projectDir) { console.error("usage: tts.mjs <storyboard.json> <project-dir> | --selftest"); process.exit(2); }
  if (!process.env.ELEVENLABS_API_KEY) { console.error("ELEVENLABS_API_KEY is not set"); process.exit(2); }
  const sb = JSON.parse(readFileSync(sbPath, "utf8"));
  const fps = sb.fps ?? 30;
  const voiceId = sb.voice?.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? "JBFqnCBsd6RMkjVDRZzb";
  const modelId = sb.voice?.modelId ?? "eleven_multilingual_v2";
  const timingPath = join(projectDir, "src", "timing.json");
  const prev = existsSync(timingPath) ? JSON.parse(readFileSync(timingPath, "utf8")) : { videos: {} };
  const timing = { fps, videos: {} };

  for (const video of sb.videos) {
    const dir = join(projectDir, "public", "vo", video.id);
    mkdirSync(dir, { recursive: true });
    let fromMs = 0;
    const scenes = [];
    for (const [i, scene] of video.scenes.entries()) {
      const vo = scene.vo?.trim();
      const minMs = (scene.minSec ?? 2) * 1000;
      let captions = [], audio = null, voMs = 0;
      const hash = vo ? createHash("sha1").update([voiceId, modelId, vo].join("|")).digest("hex").slice(0, 12) : null;
      if (vo) {
        audio = `vo/${video.id}/${scene.id}.mp3`;
        const old = prev.videos?.[video.id]?.scenes?.find((s) => s.id === scene.id);
        let rel; // scene-relative captions
        if (old?.hash === hash && existsSync(join(projectDir, "public", audio))) {
          rel = old.captions.map((c) => ({ ...c, startMs: c.startMs - old.fromMs, endMs: c.endMs - old.fromMs, timestampMs: c.timestampMs - old.fromMs }));
          voMs = old.voMs;
          console.log(`= ${video.id}/${scene.id} (unchanged)`);
        } else {
          const r = await tts({ voiceId, modelId, text: vo, previous_text: video.scenes[i - 1]?.vo, next_text: video.scenes[i + 1]?.vo });
          writeFileSync(join(projectDir, "public", audio), Buffer.from(r.audio_base64, "base64"));
          rel = charsToCaptions(r.alignment);
          voMs = Math.round(r.alignment.character_end_times_seconds.at(-1) * 1000);
          console.log(`+ ${video.id}/${scene.id} ${(voMs / 1000).toFixed(2)}s`);
        }
        captions = rel.map((c) => ({ ...c, startMs: c.startMs + fromMs, endMs: c.endMs + fromMs, timestampMs: c.timestampMs + fromMs }));
      }
      const durMs = Math.max(minMs, voMs + (vo ? PAD_SEC * 1000 : 0));
      const durationInFrames = Math.ceil((durMs / 1000) * fps);
      scenes.push({ id: scene.id, hash, audio, voMs, fromMs, from: Math.round((fromMs / 1000) * fps), durationInFrames, captions });
      fromMs += (durationInFrames / fps) * 1000;
    }
    const durationInFrames = scenes.reduce((n, s) => n + s.durationInFrames, 0);
    timing.videos[video.id] = { title: video.title, durationInFrames, seconds: +(durationInFrames / fps).toFixed(2), scenes };
    console.log(`${video.id}: ${timing.videos[video.id].seconds}s total`);
  }
  mkdirSync(join(projectDir, "src"), { recursive: true });
  writeFileSync(timingPath, JSON.stringify(timing, null, 2));
  console.log(`wrote ${timingPath}`);
}

function selftest() {
  const c = charsToCaptions({
    characters: [..."Hi  there."],
    character_start_times_seconds: [0, 0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55],
    character_end_times_seconds: [0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6],
  }, 1000);
  assert.deepEqual(c.map((w) => w.text), ["Hi", " there."]);
  assert.equal(c[0].startMs, 1000);
  assert.equal(c[0].endMs, 1200);
  assert.equal(c[1].startMs, 1300);
  assert.equal(c[1].endMs, 1600);
  assert.equal(c[1].timestampMs, 1450);
  console.log("selftest ok");
}

if (process.argv[2] === "--selftest") selftest();
else main(process.argv.slice(2)).catch((e) => { console.error(e.message); process.exit(1); });
