# Tutorial series guidelines (each 60–600s)

**Job:** after watching, the viewer can perform the task themselves, unaided, in their own account.
**Success test:** a new user follows along with the video paused at each step and finishes the task.

## Series design
- **One task (learning objective) per episode.** Title episodes as verb phrases that match what users search for: "Invite your team", "Create your first report", "Set up SSO".
- **Map the curriculum before scripting.** List the tasks, mark the dependencies, and group them into tiers:
  1. **Get started:** setup and the first win, within the first episode.
  2. **Core tasks:** daily workflows.
  3. **Advanced/admin:** configuration, integrations, permissions.
- **Every episode stands alone,** for viewers who pick one. State its prerequisites in the first 10s ("You'll need a workspace — see episode 1"), but never require the earlier episode to understand this one.
- **Shared assets:**
  - the same intro (≤3s, since people skip repeated intros)
  - the same outro, naming the next episode
  - the same voice, music bed, lower-thirds, cursor style, demo account and data
- **Length:** 2–5 minutes is the sweet spot. Split anything heading past 8–10 minutes into two episodes.

## Episode structure

| Beat | Rules |
|---|---|
| Goal (≤10s) | "In this video you'll <outcome>." Show the **finished result first**, so the viewer knows what "done" looks like. |
| Prerequisites (≤10s, optional) | The plan, role or permissions needed, and the earlier episodes. |
| Steps | One scene per step, with the step number on screen ("Step 2 of 5"). Each step covers where to go, what to do, and what you'll see. |
| Recap (≤15s) | A bulleted list of the steps. This is the cheat-sheet screen viewers pause on. |
| Next (≤5s) | Name the next episode, plus a link to the docs. |

## Script
- **Imperative, concrete and spatial:** "Click **New Report** in the top-right corner." Name the exact UI label in bold on screen, and say where it is. Never say "click here".
- **Narrate the why at decision points:** "Choose *Weekly* — daily digests get noisy for most teams."
- **Warn about common mistakes inline,** at the step where they happen.
- **Pace:** about 2.0–2.3 words/sec, slower than marketing. Pause about 0.5–1s after each click result appears. Set the scene `minSec` to give room.
- Spell out keyboard shortcuts in both VO and on screen ("Command-K").

## Visuals
- **Real screen recordings, at 1920×1080 with an enlarged cursor and slow, deliberate mouse moves.** Record one clip per step, so retakes and edits are local.
- **Zoom to 150–200%** on the interaction region for every click and form entry. Pull back for orientation when moving to a new screen.
- **Click highlight:** a ripple or ring on every click, plus a keystroke overlay for shortcuts.
- **Show the result of each step** before moving on. Don't cut away the moment you click.
- **Clean environment:**
  - a fresh demo account and realistic data
  - no notifications, personal bookmarks or real customer data
  - a consistent browser window size
- **Mask sensitive fields** (API keys, emails) with a blur scene overlay.
- **Show the app version** in the outro or the description, because UI drift is the #1 reason tutorials go stale.

## Audio
- Music should be very quiet or absent during the instruction steps (the coherence principle: it competes with learning). Bring it up only for the intro, the recap and the outro. Use the same bed across the series.
- Use subtle, consistent UI sounds for clicks, or none at all.

## Delivery
- **Files:** `out/NN-<slug>.mp4` (zero-padded, in curriculum order), `out/NN-<slug>.srt`, and `out/NN-<slug>.chapters.txt` (steps become chapters for episodes longer than about 3 minutes).
- **`out/index.md`:** a table of #, title, duration, "you'll learn", prerequisites and tier, plus a "start here" pointer, so viewers can go in order or jump in.
- **Thumbnails:** a consistent template showing the episode number and a ≤4-word task title.
- **Maintenance:** record the product version per episode in `index.md`. When the UI changes, re-record only the affected step clips, then re-render. `tts.mjs` only regenerates the steps whose text changed.

## Pitfalls
- Several tasks in one episode, which hurts searchability and makes it hard to follow.
- Fast or jittery cursor movement, or clicking before the narration names the target.
- Cutting away before the result is visible.
- Assuming the viewer has watched earlier episodes.
- Silent configuration ("I'll just set a few things up off-camera").
- Long intros. Get to step 1 within 20s.

## Pre-render checklist (per episode)
- [ ] One task, a verb-phrase title, and the finished result shown in the first 10s.
- [ ] Prerequisites stated, and the episode makes sense on its own.
- [ ] Every step has a number, a spoken location plus label, a zoom, a click highlight, and a visible result.
- [ ] No PII, secrets or notifications visible.
- [ ] Music is quiet or absent during the steps.
- [ ] A recap screen holds long enough to read, and the next episode is named.
- [ ] Files `.mp4`, `.srt` and `chapters.txt` exist, and `index.md` is updated.
