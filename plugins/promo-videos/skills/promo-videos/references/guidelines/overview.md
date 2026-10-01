# Overview guidelines (60–300s)

**Job:** give an evaluator a confident mental model of what the product does, who it's for, and how it fits their workflow. It should be enough to decide whether to try it or book a demo.
**Success test:** the viewer can name the 3–5 core capabilities and picture themselves using them.

## Structure

| Beat | 2-min example | Rules |
|---|---|---|
| Hook | 0–5s | The outcome or the pain, the same as in a promo. Skip any long intro. |
| Why (value prop) | 5–20s | Who it's for, plus the one-sentence promise. |
| What (map) | 20–30s | A quick "here's what we'll see" with the 3–5 capability names on screen. These become the chapters. |
| How (tour) | 30–105s | One chapter per capability, in **workflow order** (the order a real user hits them), not menu order. |
| Recap + CTA | 105–120s | Repeat the 3–5 capabilities as a list, then one CTA: trial, demo, or docs. |

**Length guide:**
- 60–90s for a landing page
- 2–3 minutes for a sales enablement or YouTube overview
- up to 5 minutes for complex platforms

Longer than 5 minutes means it should be a tutorial series instead.

## Script
- **Use the rule of three.** Pick 3–5 capabilities, never 12. Leave the rest to the docs and tutorials, and mention that they exist ("plus integrations, audit trail, and SSO").
- **Each chapter follows "what it is → watch it work → why it matters"**, about 15–30s each.
- **Narrate a realistic scenario with a named persona and task** ("Maya needs to onboard 20 vendors before Friday"). Narrative is easier to follow and remember than a feature list.
- Put a sentence or a title card between chapters as a transition. These are the segmenting principle in action.
- Keep the pace slower than a promo, at about 2.2–2.5 words/sec, with a brief pause after each chapter.

## Visuals
- **Chapter title cards:** 1.5–2s each, consistent style, with the capability name in ≤4 words. Give the scene a `chapter` field (see `storyboard.md`).
- **Prefer screen recordings to stills for flows.** Use stills plus zoom for single-screen concepts.
- **Signal with zoom-ins (150–200%)** on the active region, and pull back to give context between actions.
- **Keep persona and data consistent** across the whole video: the same account, records and names.
- **Show the "aha" result of each capability,** whether a report generated, an approval routed, or an insight surfaced. Don't stop at the configuration screens.

## Audio
- Use a calm, steady, unobtrusive bed, and avoid strong melodic hooks that compete with the VO for minutes. Swell it only on title cards and the CTA.

## Delivery
- **YouTube chapters.** Write `out/<id>.chapters.txt` from the `timing.json` scene `from` values. List the first chapter at `0:00`, include at least 3 chapters, and make each one ≥10s, then paste the list into the video description.
- Make the thumbnail the product's best screen with a ≤4-word promise.
- For landing-page embeds, also export a 60–90s cut, made by dropping chapters, not by speeding up.

## Pitfalls
- Touring menus ("Under Settings you'll find…") instead of solving a task.
- Showing empty states or setup screens instead of results.
- Too many capabilities, which leaves none remembered.
- A long branded intro, or a talking-head preamble before any product appears.
- Inconsistent demo data that breaks the story.

## Pre-render checklist
- [ ] Hook ≤5s, value prop stated by 20s.
- [ ] 3–5 capabilities, in workflow order, each with a chapter card.
- [ ] Each chapter shows a result, not just configuration.
- [ ] One persona and dataset throughout.
- [ ] The recap repeats the capabilities, and there's one CTA.
- [ ] Chapters file generated and valid: starts at 0:00, ≥3 entries, each ≥10s.
