# Code Listen Cursor — review 7 handoff

Date: 2026-08-30
Work order: `code-listen-cursor-review-7`
Reviewed commit: `0800b73995e8f079434862535cf8d4333d75f297`

## Result

**FAIL:** no product code was changed, but review 7 found one remaining minor
defect, documented in `.factory/review-7.md` as F-7-1.

## What was verified

- Fresh live mobile and desktop first reads clearly identify job, audience, and
  the demo action.
- The live demo is one-click, shows working sample input/output above the phone
  fold, uses only `demo:` storage, resets completely, and preserves real data
  on exit. Its request log was same-origin only.
- A fresh clone installed dependencies successfully. All 17 exact claim
  commands and `npm run check` passed (22/22 Vitest; 44/44 Playwright).
- Live Axe checks on root, demo, privacy, terms, and 404 passed at desktop and
  390 px. Metadata, links, route focus/Back, CSP, downloads, and the designed
  404 were checked.
- All earlier review findings were rechecked. Only the pre-recorded LOW-1
  spoken-indent grammar issue remains.

## Known gap / next step

For partial indentation below the configured indent width, output says
“indent 1 levels.” Update `core/code-to-speech.ts` so the fallback displayed
level controls pluralization too, add a unit regression, then rerun `npm run
check` and review the live demo.

## Run again

```sh
npm ci
npm run check
```

Open <https://code-listen-cursor.sociobot.in/demo/> for the production sandbox.
