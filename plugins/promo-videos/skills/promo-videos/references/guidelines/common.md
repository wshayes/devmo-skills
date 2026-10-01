# Guidelines for all video types

Read this file first, then read the guideline file for the chosen type.

## Message
- **One message per video.** Write it as a single sentence before storyboarding. Cut any scene that doesn't serve it.
- **Benefits over features.** Say what the viewer gets ("Close the books in a day"), not what the product has ("Automated reconciliation engine").
- **Speak the audience's language.** Use their words for the problem, not internal product names. Use product names only when the viewer has to find them in the UI (tutorials).
- **Personalization principle.** Use a conversational second person ("you", "your team"). Avoid "users" and "customers".

## Picture
- **Show the product early.** Real UI beats illustrations for credibility. Use clean demo data with no lorem ipsum, no "Test User 1", and no real customer PII.
- **Signal what matters.** Zoom, highlight or dim the rest of the screen so the eye lands where the VO points. A full-screen UI screenshot is unreadable at video size, so crop to the region that matters.
- **Coherence.** Remove anything that doesn't support the message: decorative motion, extra UI chrome, browser bookmarks bars, notification badges.
- **Brand consistency.** Use one font family, the product's palette and logo, and the same lower-third and title-card style across a series.
- **Motion with purpose.** Ease in and out (no linear moves). One camera move per scene. Hold still for at least 0.5s after a move so the viewer can read.

## Text on screen
- **Readability:** ≤7 words per card. Use at least about 48px at 1080p for body text and 80px+ for headlines. Keep text-to-background contrast at 4.5:1 or better.
- **Safe areas:** keep text inside a 5% margin. For 9:16, also keep clear of the top 10% and the bottom 20%, where platform UI overlays sit.
- **Don't duplicate the narration verbatim** in large on-screen text (the redundancy principle). Use short keywords instead. Word-level captions are the exception, because they serve accessibility and muted viewing.
- **Captions:** burn them in for social and muted autoplay. Also export a sidecar `.srt` for YouTube, LinkedIn and LMS uploads (`/remotion-captions` can serialize one from `timing.json` captions).

## Audio
- **Voice is king.** Music sits well under the VO (duck to about 10–15% while words are spoken). If the viewer has to strain to hear a word, the mix is wrong.
- **Loudness:** master at about -14 LUFS integrated with peaks ≤ -1 dBTP. That's what YouTube and most social platforms normalize to.
  ```bash
  ffmpeg -i out/<id>.mp4 -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"
  ```
- **Silence is a tool.** A half-second gap before the key line or the CTA lands harder than a constant wall of sound.
- **Sound effects:** sparing and consistent, with one whoosh style and one click style per video.

## Accessibility and safety
- **No flashing** more than 3 times per second (WCAG 2.3.1). This matters most in fast-cut teasers.
- **Never rely on color alone** to show state ("click the green button"). Name the label instead.
- **Captions and audio description.** Provide captions for every video. Tutorials should describe actions verbally ("click **Save** in the top right"), not just "click here".

## Delivery
- **Formats:** render 16:9 as the master. Make 9:16 and 1:1 cuts from the same storyboard by re-composing the frame, not by letterboxing.
- **Poster or thumbnail:** export one strong still (`npx remotion still`) at 1280×720 for YouTube/LMS, or at the composition size. Use the product UI plus ≤4 words. No raw first frame.
- **File naming:** `out/<id>.mp4`. Add the aspect ratio to the name if there are several (`promo-9x16.mp4`).
- **Versioning:** put the product version or date in `storyboard.json` (`product.version`). UI changes make videos stale, and tutorials go stale first.
