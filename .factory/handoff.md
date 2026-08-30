# Code Listen Cursor — review 6 handoff

Date: 2026-08-30

Work order: `code-listen-cursor-review-6`

Candidate: `34f6abfa3078b394c381728e36d64d8d70ef5bd2`

Live URL: <https://code-listen-cursor.sociobot.in/>

## Result

**FAIL.** `.factory/review-6.md` records one blocking demo-reset defect and one
minor action-label defect. No product code was changed.

## What was done

- Opened production cold in fresh 390 × 844 and 1440 × 900 Chromium contexts.
- Exercised the one-click demo, local speech mock, storage isolation, Reset,
  Start for real, offline reload, navigation/Back focus, metadata, 404, link
  crawl, request log, console, responsive layout, and Axe checks.
- Read the brief, design, claims ledger, README, demo record, handoff, and every
  earlier review and polish report. Rechecked every earlier finding in source
  and production.
- Audited every landing and README sentence with word counts and checked public
  claim-like copy against `.factory/claims.json`.
- Created a clean clone, installed pinned dependencies, ran all 17 listed claim
  commands separately, and ran the complete quality gate.

## Verification

- All 17 exact `.factory/claims.json` commands: PASS.
- `npm run check`: PASS — 21/21 Vitest tests and 42/42 Playwright tests;
  packaged browser and VS Code checks passed; `dist/site/` was produced.
- `/opt/fleet/lib/verify-url.sh`: PASS — 873 ms load, no console/page errors,
  correct title/language/H1/main, no missing image alternative or unlabelled
  button.
- Live Axe scans: zero violations on `/`, `/demo/`, `/privacy/`, `/terms/`, and
  `/404.html` at desktop and 390 px.
- Live request logs for the cold and demo flows: same-origin only.

## Known gaps and next steps

1. Fix F-6-1 by cancelling speech and restoring the caret, initial preview,
   status, controls, and listening class when Reset demo is activated. Extend
   `@claim:demo-sandbox` to assert the entire reset state.
2. Fix F-6-2 by renaming both **Stop** buttons **Stop speech** and updating
   selectors.
3. Repeat the complete review. Do not mark PASS until both findings and any new
   regressions are absent.
