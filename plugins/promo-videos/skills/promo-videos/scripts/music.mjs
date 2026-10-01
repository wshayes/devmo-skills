#!/usr/bin/env node
// Generate an instrumental background bed with ElevenLabs Music at an exact length.
//   node music.mjs "<prompt>" <seconds> <out.mp3>
import { writeFileSync } from "node:fs";

const [prompt, seconds, out] = process.argv.slice(2);
if (!prompt || !seconds || !out) { console.error('usage: music.mjs "<prompt>" <seconds> <out.mp3>'); process.exit(2); }
if (!process.env.ELEVENLABS_API_KEY) { console.error("ELEVENLABS_API_KEY is not set"); process.exit(2); }

const ms = Math.min(600000, Math.max(3000, Math.round(+seconds * 1000))); // API range 3s–10min
const res = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", {
  method: "POST",
  headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "content-type": "application/json" },
  body: JSON.stringify({ prompt, music_length_ms: ms, force_instrumental: true }),
});
if (!res.ok) { console.error(`ElevenLabs ${res.status}: ${await res.text()}`); process.exit(1); }
writeFileSync(out, Buffer.from(await res.arrayBuffer()));
console.log(`wrote ${out} (${ms / 1000}s)`);
