# Code Listen Cursor — review 5 handoff

Date: 2026-08-30

Reviewed commit: `0cc26493d2c29d65e4627353c85c979ff262725c`

Work order: `code-listen-cursor-review-5`

Live URL: <https://code-listen-cursor.sociobot.in/>

## Result

**FAIL.** `.factory/review-5.md` records one minor finding: the shared header
action says only “Download” while directly downloading the Chrome/Edge ZIP,
even though the product also offers a VS Code package. No product code was
changed.

## What was done

- Repeated the cold first read in fresh 390 × 844 and 1440 × 900 Chromium
  contexts.
- Audited every landing and README sentence, plus headings and actions.
- Exercised the one-click demo, local speech, reset, exit, storage isolation,
  landing-preview ephemerality, same-origin request boundary, and offline
  reload.
- Ran every exact command in `.factory/claims.json` separately from a clean
  clone.
- Rechecked every finding from reviews and polish rounds 1–4 in live behavior,
  current source, and the complete regression suite.
- Crawled public links, inspected metadata and security headers, tested route
  focus and Back, scanned all public routes with Axe at both widths, and ran
  the worker URL verifier.

## Verification

From clean clone `0cc2649`:

1. `npm ci --include=dev`
2. All 17 exact claim commands, including every repeated ZIP/VSIX command
3. `npm run check`

All passed. The aggregate gate reports 20/20 Vitest tests and 40/40 Playwright
tests, plus successful builds and installed-package harnesses. The built live
root matches production by SHA-256. Live Axe scans found zero violations on
`/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at desktop and phone
widths. `/opt/fleet/lib/verify-url.sh` passed with a 772 ms load and no console
or page errors.

## Known gap and next step

Change the shared direct-download label to “Download browser ZIP,” or make it a
“Choose an extension” link to the install section. Add a cross-route regression
for the action label, target, and filename. Then rerun review 6 from scratch.
