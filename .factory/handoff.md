# Code Listen Cursor — polish 6 handoff

Date: 2026-08-30

Work order: `code-listen-cursor-polish-6`
Repair commit: `8a64b94352d88a2461db4ebc8dccc04b76fb7c16`
Documentation commit: `86a67e489f763bf65bd10bd6fcbef0df34fa41f0`
Deployment: `b88b9c97-b410-4c4a-85a5-409ef3f7a8ee`
Live URL: <https://code-listen-cursor.sociobot.in/>

## Result

**PASS.** The MV3 browser extension, VS Code extension, and static landing
site remain the shipped artifact class. No review finding remains open.

## What changed

- Reset demo now restores the complete isolated reader state: it cancels active
  speech, clears the listening state and errors, restores the original sample
  and cursor selection, resets settings/form/map/rate, recomputes the initial
  spoken preview, and removes only `demo:` storage.
- The `demo-sandbox` public claim and its one tagged browser test now prove the
  full reset transition with a local speech mock, including real-data sentinel
  preservation.
- The landing and demo controls now say **Stop speech**. Source and browser
  regressions cover both routes.
- The service-worker cache was advanced to v7 for the changed shell. The demo
  record, copy audit, claims ledger, catalog description, and polish record are
  current.

## Run and verify

```sh
npm ci
npm run check
npm run build:site
```

Open `/demo/` or `/?demo=1` for the isolated sample. It stores only
`demo:code-listen-cursor:pronunciation`; Reset demo and Start for real clear
that namespace without touching real extension data.

## Evidence

- A final clean clone at `86a67e4` ran all 17 exact claim commands from
  `.factory/claims.json` separately; all exited 0. Log:
  `/tmp/code-listen-cursor-round6-final-claims.log`.
- Clean `npm run check` passed after retry: 22/22 Vitest tests, package and
  installed-extension harnesses, and 44/44 desktop/mobile Playwright tests.
  A prior Chromium process crash occurred while closing the desktop focus test;
  its standalone retry and the complete retry passed.
- Live `verify-url.sh` passed: HTTP 200, 1,340 ms load, title/lang/H1/main,
  images, labels, and zero console/page errors.
- `test-results/live-polish-6/live-audit.json` records 12 live Axe route scans
  with zero violations, zero overflow, `?demo=1` redirect, reset state,
  offline local speech, and route focus/Back results. Screenshots are in the
  same directory.
- Production mobile Lighthouse scores are 100 Performance, 100 Accessibility,
  100 Best Practices, and 100 SEO (FCP 0.8 s, LCP 1.1 s, TBT 0 ms, CLS 0).

## Known gaps

None.
