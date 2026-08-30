# Code Listen Cursor — polish 7 handoff

Date: 2026-08-30
Work order: `code-listen-cursor-polish-7`
Repair commit: `4bcca298570da225fe66e116d59a4950d9779667`
Live URL: <https://code-listen-cursor.sociobot.in/>

## Result

**PASS.** F-7-1 is fixed. Partial indentation below the configured indent
width now says `indent 1 level`, not `indent 1 levels`. The regression covers
one, two, and three leading spaces with an indent width of four.

## What changed

- `core/code-to-speech.ts` calculates `displayedLevel` once and uses it for
  both the number and singular/plural wording.
- `tests/code-to-speech.test.ts` adds
  `@regression:partial-indentation-singular`.
- `.factory/catalog-description.txt` now starts with the verb “Hear” and is
  72 characters long.
- `.factory/polish-7.md` maps all cumulative review findings to current
  implementation and evidence.

## Verification

Fresh local clone: `/tmp/code-listen-cursor-round7.bNI9ls` at the repair
commit.

- `npm ci --include=dev` installed 184 packages with zero reported
  vulnerabilities.
- Every one of the 17 exact commands in `.factory/claims.json` passed from the
  clean clone, including each repeated installed-ZIP and VSIX command.
- `npm run check` passed: lint/typecheck, 23/23 Vitest tests, production build,
  package checks, installed browser and VS Code harnesses, and 44/44 Playwright
  desktop/mobile tests (`test-results/.last-run.json` reports `passed`).
- Production build outputs `dist/site/`; landing JavaScript is 3.02 kB gzip and
  CSS is 3.77 kB gzip.
- `/opt/fleet/lib/verify-url.sh` passed cold against the live root in 836 ms:
  title, `lang`, one H1, main landmark, image alternatives, labels, and console
  state all passed. Evidence: `test-results/live-polish-7/verify.json`.
- Live Axe scans found zero violations on `/`, `/demo/`, `/privacy/`, `/terms/`,
  and `/404.html` at 1440 px and 390 px. The same audit found no horizontal
  overflow or console/page errors; an unknown route returned HTTP 404.
- Live demo recheck covered query entry, first-screen mobile content, same-origin
  requests, complete reset, route focus/Back, offline reload plus local speech,
  and the repaired partial indent. It returned `indent 1 level, fern`.
  Screenshots: `test-results/live-polish-7/live-demo-partial-indent-mobile.png`
  and `test-results/live-polish-7/live-demo-reset-and-partial-indent-mobile.png`.
- Mobile Lighthouse on the live root: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.8 s, LCP 1.1 s, CLS 0. Evidence:
  `test-results/live-polish-7/lighthouse-mobile.json`.

## Deployment

Built `dist/site/` was deployed to the existing `sf-code-listen-cursor` static
app with the Static Web Apps CLI. The deploy returned
`https://purple-dune-08f27c610.7.azurestaticapps.net`; the production custom
domain above was then cold-checked successfully. No DNS, billing, or unrelated
service resource was changed.

## Known gaps / next steps

None. The product remains local-first by design; no AI or remote source-code
feature was added because it would contradict the brief's privacy boundary.

## Run again

```sh
npm ci
npm run check
```

Open <https://code-listen-cursor.sociobot.in/demo/> or
`https://code-listen-cursor.sociobot.in/?demo=1` for the isolated sample.
