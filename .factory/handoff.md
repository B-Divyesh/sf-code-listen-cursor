# Code Listen Cursor — polish 5 handoff

Date: 2026-08-30

Repair commit: `b4142b78a4ecc5813bff4f0162d07e8f432418be`

Work order: `code-listen-cursor-polish-5`

Live URL: <https://code-listen-cursor.sociobot.in/>

## Result

**PASS.** The shared header now says **Download browser ZIP** before directly
downloading the Chrome/Edge package. It no longer ambiguously sends VS Code
visitors to the browser ZIP. The catalog sentence is now verb-first and 69
characters: “Listen to selected code and hear its symbols and indentation
locally.”

## What changed

- Updated the shared header on `/`, `/demo/`, `/privacy/`, `/terms/`, and the
  designed 404 page. Each direct action names the browser ZIP and still points
  to `/downloads/code-listen-cursor-chrome.zip`.
- Added `@regression:review-5-header-download` to assert the label, target,
  `download` attribute, and real filename across all five routes. Added a
  source-level companion regression.
- Rechecked every earlier review and polish finding, including demo isolation,
  offline reader behavior, route focus, metadata, legal routes, phone layout,
  package transfer, claims, and the product-specific botanical field-guide
  identity. The complete mapping is in `.factory/polish-5.md`.

## How verified

- Fresh clone: `npm ci --include=dev`, every 17 exact commands in
  `.factory/claims.json` separately, then `npm run check`. All passed.
- Aggregate clean-clone gate: 21/21 Vitest tests; packaged browser and VS Code
  harnesses; 42/42 desktop/mobile Playwright cases; build output in `dist/site`.
- Deployed through `/opt/fleet/lib/deploy-static.sh code-listen-cursor
  /work/repo/dist/site`. Deployment ID:
  `0065e0fc-7253-46bf-95de-7cfad8a5a4e4`.
- Cold production check: 695 ms root load, no console/page errors, correct
  title, language, H1, main landmark, and image alternatives. Live Axe scans
  had zero violations on all public routes at 1440 px and 390 px.
- Live demo verification covered `?demo=1`, banner, sample code, local speech,
  Reset demo, Start for real, namespace isolation, and offline reload. Route
  navigation/Back focused and announced the destination H1; an unknown route
  returned the designed HTTP 404.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  and 100 SEO (FCP 0.9 s, LCP 1.1 s, CLS 0).

Evidence is in `test-results/live-polish-5/` for this work order. There are no
known gaps or pending product changes.
