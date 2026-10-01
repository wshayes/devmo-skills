---
name: promo-videos
description: "Produce product marketing and education videos end to end from the terminal: teaser (5-10s), promo (15-45s hook/problem/solution), overview (60-300s feature tour), or a tutorial series (multiple 60-600s episodes). Storyboard-first workflow with approval gates, assets captured from a website or supplied by the user, ElevenLabs voiceover with word-level timestamps for caption/animation sync, background music from ElevenLabs Music or GarageBand Apple Loops, rendered with Remotion to MP4. Triggers: 'promo video', 'teaser video', 'product video', 'launch video', 'overview video', 'tutorial videos', 'explainer', 'demo video', 'video from screenshots', 'voiceover video', 'Remotion promo'."
license: Proprietary
metadata:
  version: 1.0.0
  composes_with:
    - remotion-best-practices
    - remotion-captions
---

# Promo Videos

Storyboard first, voice second, pixels last. Every expensive step (TTS, music, render) sits behind a cheap, reviewable artifact the user approves.

This skill owns: the video taxonomy, storyboarding, assets, voiceover timing, music, and output layout. **Remotion code is delegated** to the official Remotion skills (`/remotion-best-practices`, `/remotion-captions`, `/remotion-render`). Don't re-derive Remotion APIs from memory.

`SKILL_DIR` below is this skill's base directory, the folder containing this file, which is shown when the skill loads. Set it in each shell command, e.g. `SKILL_DIR=<base dir>`.

## 0. Preflight (run once, report in one short block)

```bash
node --version; ffmpeg -version | head -1; [ -n "$ELEVENLABS_API_KEY" ] && echo "ELEVENLABS_API_KEY set" || echo "ELEVENLABS_API_KEY missing"
```

- Node ≥ 18 and ffmpeg are required (`brew install node ffmpeg`).
- `ELEVENLABS_API_KEY` must come from the environment. Never write it into files, the storyboard, or the Remotion project. If it's missing, ask the user to `export` it. They can still storyboard without it.
- Remotion skills: if `/remotion-best-practices` isn't available, tell the user to run
  `claude plugin marketplace add remotion-dev/claude-code-plugin && claude plugin install remotion@remotion`
  (or `npx skills add remotion-dev/skills`), then `/reload-plugins`.
- Remotion licensing: free for teams of up to 3 people. Larger companies need a company license (remotion.pro/license). Mention this once and don't block on it.

## 1. Brief: ask what to make

Use AskUserQuestion. Ask everything in one call where possible:

1. **Type**: Teaser / Promo / Overview / Tutorial series (see [`references/video-types.md`](references/video-types.md) for the comparison and the "which type?" table).
2. **Product**: name, URL, and the one-line value proposition.
3. **Audience and CTA**: who it's for, and what they should do afterwards (URL, "start free trial").
4. **Format**: 16:9 1920×1080 (default), 9:16 1080×1920 (Reels/Shorts/TikTok), or 1:1 1080×1080. Use 30 fps unless asked otherwise.
5. **Tone and voice**: energetic, calm/premium, technical, or friendly. Pick a voice in step 4.

For a **tutorial series**, also get the list of tasks/features to cover. Propose an episode order, simplest and most-needed first.

## 2. Storyboard: Gate 1

**Scaffold the Remotion project first.** `create-video` refuses non-empty directories and is interactive without `--yes`. Create it under the user's cwd, never inside this plugin:

```bash
mkdir -p videos && npx -y create-video@latest --yes --blank --no-tailwind videos/<product-slug> && (cd videos/<product-slug> && npm i)
```

Add `"resolveJsonModule": true` to its `tsconfig.json` `compilerOptions`, so `src/timing.json` can be imported.

**Before drafting, read the best-practice guidelines:**
- [`references/guidelines/common.md`](references/guidelines/common.md), which applies to every type.
- The chosen type's file: [`teaser.md`](references/guidelines/teaser.md), [`promo.md`](references/guidelines/promo.md), [`overview.md`](references/guidelines/overview.md), or [`tutorial.md`](references/guidelines/tutorial.md).

The structure, beat timings, script rules and pitfalls there are requirements, not suggestions. Load only the type being made.

Read [`references/storyboard.md`](references/storyboard.md) and write two files in the project folder `./videos/<product-slug>/`:

- `storyboard.json`: the single source of truth (schema in the reference).
- `storyboard.md`: a human-readable table with #, purpose, VO, on-screen text, visual, camera move, and duration.

Hard rules:
- **Word budget** uses the type's VO pace (`video-types.md`). Count words per video, and if a draft is over budget, cut it before showing the user.
- Follow the type's beat structure and timings from its guideline file. One idea per scene.
- When you present the storyboard, flag any deviation from the guidelines and say why.
- Every scene names the asset(s) it needs, even ones not captured yet.

Print the `storyboard.md` table in the terminal and **ask for approval or edits before any API spend.** Iterate on the files until the user approves.

## 3. Assets

Follow [`references/assets.md`](references/assets.md). Captures go to `public/assets/`:
- **Website**: Playwright screenshots at 1920×1080 @2x, or clip recordings for tutorials.
- **User-provided**: copy the files in with descriptive names.

Afterwards, check that every `assets[]` ref in `storyboard.json` exists under `public/`, and list anything missing.

## 4. Voiceover: Gate 2

Read [`references/voiceover.md`](references/voiceover.md) to pick the voice and model, and to handle pronunciation.

```bash
node "$SKILL_DIR/scripts/tts.mjs" videos/<slug>/storyboard.json videos/<slug>
```

This writes `public/vo/<video>/<scene>.mp3` and `src/timing.json`, which holds per-scene `from`, `durationInFrames`, `audio`, and `captions` (`@remotion/captions` `Caption[]`, with ms absolute within the video). **VO length drives scene length.** Re-runs regenerate only the scenes whose text changed.

Show per-scene durations plus the total against the type's target range. Have the user listen (`afplay videos/<slug>/public/vo/<video>/<scene>.mp3`). Get approval before rendering. If a video runs over the target, trim VO text, not pacing.

## 5. Music

Follow [`references/music.md`](references/music.md).
- **Default:** ElevenLabs Music, at the exact video length from `timing.json`:
  ```bash
  node "$SKILL_DIR/scripts/music.mjs" "<prompt>" <seconds> videos/<slug>/public/music/<video>.mp3
  ```
- **Offline/free:** GarageBand Apple Loops via `"$SKILL_DIR/scripts/loops.sh"` (`genres`, `list <query>`, `bed <seconds> <out> <loops...>`).
- Duck the music under VO using `timing.json` captions (snippet in `music.md`).

## 6. Build and render

Hand off to `/remotion-best-practices` (and `/remotion-captions` for word captions), with this spec:

- One `<Composition>` per `storyboard.videos[]` entry. Take `id` and `durationInFrames` from `timing.json` (import it statically, no `calculateMetadata` needed), and `width`/`height`/`fps` from the storyboard.
- Wrap each scene in a `<Sequence from={scene.from} durationInFrames={scene.durationInFrames}>` with `<Audio src={staticFile(scene.audio)} />`, so VO is placed per scene.
- Drive visual beats from caption timings: highlight or zoom when a key word's `startMs` hits. Don't use hardcoded frames.
- Camera moves, transitions, and on-screen text come from the storyboard scene fields.
- **`timing.json` is authoritative. Never overlap scenes.** Build transitions (crossfade, slide, zoom-through) as enter/exit animations inside each scene's own `[from, from + durationInFrames)` window. Do **not** use `@remotion/transitions` `TransitionSeries`: it overlaps scenes and shortens the video, which makes every later caption drift out of sync.
- Brand colors and fonts come from the product's site or the user's `DESIGN.md`, if present.

Preview: `npx remotion studio` (opens a browser, so tell the user). Then render each video:

```bash
cd videos/<slug> && npx remotion render <video-id> out/<video-id>.mp4
```

**Tutorial series:**
- Composition ids and outputs are numbered: `01-<slug>`, `02-<slug>`, and so on.
- Use shared `Intro`/`Outro` components, with the outro naming the next episode.
- Write `out/index.md` listing #, title, duration, what you'll learn, and prerequisites, so viewers can watch in order or pick one.

## 7. Verify and deliver

```bash
ffprobe -v error -show_entries format=duration:stream=codec_type -of compact videos/<slug>/out/<id>.mp4
```

- The duration must match `timing.json` `seconds` (±0.1s), and the file must contain both `video` and `audio` streams.
- Extract one still per scene midpoint (`npx remotion still <id> --frame=<n>`) and look at them.
- Run the type's **pre-render checklist** (end of its guideline file) against the stills and `timing.json`, check loudness (`common.md`), and report each item as pass or fail. Fix the failures before delivering.
- Overview and tutorial videos: write `out/<id>.chapters.txt` from scenes with a `chapter` field, using `timing.json` `from`/fps for the times, and export `out/<id>.srt` via `/remotion-captions`.
- Export a poster still (`npx remotion still <id> out/<id>-poster.png --frame=<best frame>`).
- Deliver the paths: the Remotion project (`videos/<slug>/`, which includes `storyboard.json`, so it can be edited and re-rendered) and `videos/<slug>/out/*.mp4`.
- Suggest that the user add `out/` and `public/vo/` to `.gitignore` if the project is under git.
