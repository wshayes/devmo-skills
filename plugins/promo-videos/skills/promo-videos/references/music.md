# Background music

## Sources, ranked for this pipeline

| Source | When | How |
|---|---|---|
| **ElevenLabs Music** (default) | Always try first: same API key, exact length, instrumental | `scripts/music.mjs "<prompt>" <sec> public/music/<id>.mp3` |
| **GarageBand Apple Loops** | Offline or free, macOS only | `scripts/loops.sh` |
| User file | They have a licensed track (Epidemic Sound, Artlist, Soundraw, Suno export) | Copy it to `public/music/` and trim/fade with ffmpeg |
| Stock APIs (Epidemic Sound, HookSounds) | Teams producing at volume who need platform whitelisting / Content ID clearance | Needs a partner account, so mention it as an upgrade path only |

**Licensing:** check before publishing. Each source has its own terms, and the user is responsible for confirming them.
- **ElevenLabs Music:** commercial use depends on the ElevenLabs plan tier, so the user should check theirs.
- **Apple Loops:** may be used royalty-free inside your own productions, but must not be redistributed as standalone loops. Never commit loop files to a public repo.

## ElevenLabs Music prompts
Describe genre, tempo, mood, instruments, and energy arc. Always say "instrumental" (the script also forces it).

| Type | Prompt style |
|---|---|
| Teaser | "punchy cinematic electronic hit, 120 bpm, big drop at 2 seconds, instrumental" |
| Promo | "upbeat modern tech, 110 bpm, warm synths and light percussion, builds to a lift in the final third, instrumental" |
| Overview | "calm optimistic ambient electronic, 95 bpm, steady and unobtrusive, instrumental" |
| Tutorial | "soft lo-fi minimal background, 85 bpm, very low energy, no melody hooks, instrumental" |

Generate the bed at the exact `timing.json` `seconds` of each video. A tutorial series reuses one bed per episode-length, or one longer bed trimmed per episode, so the series sounds consistent.

## GarageBand Apple Loops
Loops live in `/Library/Audio/Apple Loops/Apple/<genre>/*.caf`. Download the full set with GarageBand → Settings → Sound Library → Download All Available Sounds.

Each loop is **one instrument, a few bars long**. A usable bed is 2–3 loops from the *same genre folder*, and the same "song family" prefix (e.g. `Disco Delight …`), so tempo and key match.

```bash
L="$SKILL_DIR/scripts/loops.sh"
$L genres                       # e.g. "07 Chillwave"
$L list "chillwave"             # pick a family, e.g. "… Beat", "… Bass", "… Keys"
$L bed 32 public/music/promo.mp3 "07 Chillwave/<Family> Beat.caf" "07 Chillwave/<Family> Bass.caf"
afplay public/music/promo.mp3   # audition
```

`bed` loops each file to length, mixes the loops, fades in 0.5s and out 2s, and normalizes to -20 LUFS. Remotion/Chromium can't play `.caf`, so always use the generated mp3.

- **Promos and teasers:** beat + bass + one melodic layer.
- **Tutorials:** pads or keys only (no drums), so they stay out of the way.

## Ducking under VO (Remotion)
Derive the music volume from `timing.json` captions, so it dips while words are spoken and swells in the gaps. Don't hardcode frames.

```tsx
import { Audio, staticFile, useVideoConfig } from "remotion";
import timing from "./timing.json";

const MusicBed: React.FC<{ id: keyof typeof timing.videos }> = ({ id }) => {
  const { fps } = useVideoConfig();
  const words = timing.videos[id].scenes.flatMap((s) => s.captions);
  const duck = (f: number) => {
    const ms = (f / fps) * 1000;
    // ponytail: linear scan; fine for <2k words, index by scene if tutorials get huge
    return words.some((w) => ms >= w.startMs - 150 && ms <= w.endMs + 300) ? 0.12 : 0.4;
  };
  return <Audio src={staticFile(`music/${id}.mp3`)} volume={duck} />;
};
```

For smoother ramps, ask `/remotion-best-practices` to wrap this in `interpolate` over a 6-frame window.
