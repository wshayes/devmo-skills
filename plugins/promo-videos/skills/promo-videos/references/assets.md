# Assets

All assets go in `<project>/public/assets/` with descriptive kebab-case names (`dashboard-overview.png`, not `Screenshot 2026-…png`).

## From a website
Use Playwright. If it's missing, use the `playwright-cli` / `agent-browser` skill, or run `npx playwright install chromium` with the user's OK.

**Quick 1× capture** (the CLI has no pixel-density flag):
```bash
npx playwright screenshot --viewport-size=1920,1080 --wait-for-timeout=1500 https://acme.com public/assets/home-hero.png
npx playwright screenshot --full-page --viewport-size=1920,1080 https://acme.com public/assets/home-full.png   # for pans
```

**2× capture.** Prefer this, so zooms stay crisp. Run `npm i -D playwright` in the Remotion project, then:
```bash
node -e '
const { chromium } = require("playwright");
const [url, out, w = 1920, h = 1080] = process.argv.slice(1);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: "networkidle" });
  await p.screenshot({ path: out });
  await b.close();
})();' https://acme.com public/assets/home-hero.png
```

- Use the target aspect ratio for the viewport: `1080,1920` for 9:16.
- Before capturing, dismiss cookie banners and chat widgets. Use a small Playwright script with a click or `page.addStyleTag`.
- For app pages behind login, ask the user to log in. Either use their running browser (`claude-in-chrome`) or save a storage state: `npx playwright codegen --save-storage=auth.json <url>`, then `--load-storage=auth.json`. Never ask for, or store, their password.
- Also pull the logo (an SVG from the site header if possible), brand colors, and font names from the page's CSS, so the video matches the brand.

**Screen recordings for tutorials and overviews.** Record a scripted flow with Playwright `recordVideo` (`size: {width:1920,height:1080}`), one clip per step. Alternatively, ask the user for a QuickTime/CleanShot recording (`.mov`/`.mp4`). Then convert it:

```bash
ffmpeg -i in.mov -c:v libx264 -crf 18 -pix_fmt yuv420p -an public/assets/step-03-invite.mp4
```

In Remotion, use `<OffthreadVideo>` (or what `/remotion-best-practices` recommends) and trim with `startFrom`/`endAt`.

## From the user
- Accept paths, a folder, or a drag-and-drop into the terminal, then copy the files into `public/assets/` and rename them.
- **Check resolution.** Anything under 1920px wide will look soft when zoomed, so warn the user.
- **Check rights.** For stock imagery or customer logos, confirm the user has the rights.

## Checklist before VO
- Every `assets[]` path in `storyboard.json` exists.
- No personal data, real customer names, or secrets are visible in the screenshots. Blur them or use demo data.
- There's a logo with a transparent background for the CTA card.
