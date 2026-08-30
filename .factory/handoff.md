# Code Listen Cursor — polish 4 handoff

Date: 2026-08-30
Repair commit: 10f6ea8b37210c606fe466f7ce24baa2bd73ed29
Pushed branch: origin/main
Deployment: a3cfec3d-9c7a-4944-831f-8257616f3fda
Live URL: <https://code-listen-cursor.sociobot.in/>

Result: PASS. All findings from review rounds 1–4 and all retained polish
findings have executable and live evidence in .factory/polish-4.md.

## What changed

- Replaced the first-screen headline with the direct job statement: “Listen to
  selected code, symbols, and indentation.”
- Kept the one-click ?demo=1 sandbox, banner, Reset demo, and Start for real;
  its claim now proves that only demo keys are cleared and real keys remain.
- Added the landing preview’s no-save/reload promise to the claim ledger with
  its sole tagged browser test.
- Strengthened the offline claim so the cached reader edits code, produces the
  expected spoken preview, and calls a local voice after offline reload.
- Bumped the service-worker cache to v6 so the repaired shell reaches existing
  visitors.
- Restored the required footer product one-liner at 390px on every route.
- Rewrote the two README jargon phrases and updated the catalog description.

## Verification

Fresh clone at the repair commit:

1. npm ci --include=dev
2. Every one of the 17 exact commands listed in .factory/claims.json,
   including repeated installed-package commands
3. npm run check

All passed. The full check includes typecheck, lint, 20/20 Vitest tests,
production build, package smoke checks, installed ZIP and VSIX harnesses, and
40/40 Playwright desktop/mobile cases. The build writes dist/site; its
first-party landing JavaScript is 2.98 kB gzip and CSS is 3.77 kB gzip.

After deployment, the live root verifier passed in 643 ms with title, lang,
one H1, main landmark, image alternatives, and no console/page errors. The
Playwright Axe live audit has zero violations on /, /demo/, /privacy/, /terms/,
and /404.html at 1440px and 390px. It also proves focused route headings,
phone footer visibility, same-origin demo requests, demo key clearing with a
real-data sentinel preserved, the ?demo=1 redirect, an offline local-speech
interaction, and HTTP 404 behavior. Evidence is under
test-results/live-polish-4/ (verify.json, live-audit.json, and mobile
screenshots).

Mobile Lighthouse against the live root: Performance 100, Accessibility 100,
Best Practices 100, SEO 100; FCP 0.8s, LCP 1.1s, CLS 0.

## Run locally

Run npm ci, then npm run check. For the isolated sample, open /demo/ locally
or use https://code-listen-cursor.sociobot.in/?demo=1.

## Known gaps and next steps

None. The product remains a local-first MV3 browser extension plus static
landing site; no backend, tracking, external font, or cloud-code path was
added.
