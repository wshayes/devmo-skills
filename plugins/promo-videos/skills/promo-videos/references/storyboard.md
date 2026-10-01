# Storyboarding

## Process
1. **One-sentence message.** Write down what the viewer should remember. Every scene must serve it.
2. **Beat sheet.** List the structural beats for the type (see `video-types.md`), with target seconds per beat.
3. **VO script.** Write it for the ear. Use short sentences, contractions, and active voice, with one idea per sentence. Read it aloud in your head. If you'd stumble, rewrite it.
4. **Visual per line.** Every VO line gets a visual that *shows* what's said. If the VO and visual say the same thing, cut the on-screen text.
5. **Count words** against the budget, and cut until it fits.
6. **Check it muted.** Read only the on-screen text column. The message should still land, since most social views are muted.

## Scene craft
- Change the visual every 2–4s in promos and teasers, every 4–8s in overviews, and every step in tutorials.
- **Camera moves:**
  - `zoom-in` to the UI region being discussed
  - `pan` across wide screens
  - `tilt-2.5d` (subtle perspective + shadow) for hero shots
  - `none` for dense UI
- **Transitions:** use one consistent style per video, either `cut`, `crossfade`, `slide`, or `zoom-through`. A cut on a beat beats a fancy transition.
- **On-screen text:** ≤7 words per card. Keep it inside the safe area (5% margin, or 10% top and bottom for 9:16).
- **Highlight** the exact UI element when the VO names it. That's what word timestamps are for. Set `emphasis` to the trigger word.

## storyboard.json schema

```jsonc
{
  "type": "teaser | promo | overview | tutorial",
  "product": { "name": "Acme", "url": "https://acme.com", "cta": "Start free at acme.com" },
  "width": 1920, "height": 1080, "fps": 30,
  "voice": { "voiceId": "JBFqnCBsd6RMkjVDRZzb", "modelId": "eleven_multilingual_v2" },
  "music": { "source": "elevenlabs | garageband | file", "prompt": "upbeat minimal electronic, 110 bpm, warm synths, no vocals", "loops": [] },
  "videos": [                     // one entry for teaser/promo/overview; one per episode for tutorials
    {
      "id": "promo",              // composition id; tutorials: "01-create-project"
      "title": "Acme in 30 seconds",
      "targetSec": [15, 45],
      "scenes": [
        {
          "id": "hook",
          "purpose": "hook",       // hook | problem | solution | feature | proof | step | recap | cta | intro | outro
          "vo": "Still digging through ten tabs to find one file?",
          "onScreenText": "10 tabs. 1 file.",
          "assets": ["assets/tabs-chaos.png"],
          "camera": "zoom-in",
          "transition": "cut",
          "emphasis": ["ten"],    // words whose startMs triggers a visual beat
          "minSec": 2             // floor; actual = max(minSec, VO + 0.5s)
        }
      ]
    }
  ]
}
```

- Asset paths are relative to the Remotion `public/` folder, so use them with `staticFile()`.
- A scene with no `vo` is music-only and lasts exactly `minSec`.
- Keep the `id`s stable. `tts.mjs` caches VO per scene id and text.

## storyboard.md (for review)

| # | Purpose | VO | On-screen | Visual / camera | Sec |
|---|---|---|---|---|---|
| 1 | hook | Still digging through ten tabs…? | 10 tabs. 1 file. | tabs-chaos.png, zoom-in | 2.5 |

Put the total word count and estimated runtime under the table.
