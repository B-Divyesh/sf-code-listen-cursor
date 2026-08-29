# Code Listen Cursor — polish 1 handoff

Date: 2026-08-29  
Work order: `code-listen-cursor-polish-1`  
Base review commit: `74893694c801ee6cf84d9f2ef11296f33a064aaf`  
Repair commit: `0e427295a21d5d2268887c057b16e6f1e967b0e0`  
Live URL: <https://code-listen-cursor.sociobot.in/>

## Result

All six findings in `.factory/review-1.md` are closed. See
`.factory/polish-1.md` for the required finding-by-finding mapping and live
evidence. No known product gaps remain.

## What changed

- Every public route now includes an accessible route destination handler.
  Same-site navigation and browser Back focus the new H1 without changing
  scroll position and announce the route. Cold visits still start with the
  skip link.
- Rewrote all four reviewed landing labels and the reviewed demo action in
  plain task language. The README deployment sentence is now two short,
  direct sentences.
- Added `@regression:review-1-copy`, which locks those wording repairs, and
  expanded the existing navigation regression to assert forward and Back focus
  plus its live announcement.
- Updated `.factory/catalog-description.txt` with a 78-character verb-first
  product description.

## Verification

Fresh local clone at `/tmp/code-listen-cursor-clean.VPhyeQ`:

- `npm ci`: 184 packages, 0 vulnerabilities.
- Every one of the 15 exact `.factory/claims.json` commands passed; the ledger
  ended with `CLAIM LEDGER PASS`. This covers demo isolation, reader behavior,
  same-origin privacy, local-only voice refusal, offline reload, downloads,
  browser ZIP controls/settings/shortcuts/privacy, VS Code controls/privacy,
  structural cues, art provenance, and MIT licensing.
- `npm run check` completed typecheck, 16 Vitest tests, production build,
  package smoke, unpacked extension smoke, installed ZIP, packaged VSIX, and
  30 Playwright desktop/390px tests including Axe, keyboard, 200% reflow,
  privacy, and offline coverage.
- Build output: route-focus JS 1.18 kB (0.65 kB gzip), main JS 7.02 kB
  (2.89 kB gzip), main CSS 12.49 kB (3.57 kB gzip), well inside the budget.
- Lighthouse mobile JSON at
  `test-results/live-polish-1/lighthouse-mobile.json`: Performance 99,
  Accessibility 100, Best Practices 100, SEO 100; FCP 1.5 s, LCP 1.6 s,
  TBT 0 ms, CLS 0.

Deployment used:

```sh
bash /opt/fleet/lib/deploy-static.sh code-listen-cursor dist/site
```

Azure Static Web Apps deployment `5242dd70-168a-4d40-93d3-78b10652600b`
succeeded. `/opt/fleet/lib/verify-url.sh` passed on the live root: 200 in
917 ms, expected title/lang/one H1/main, no missing alts or unlabeled buttons,
and no console/page errors. A separate cold live Chromium check verified all
five routes with Axe, titles, focus/back announcement, `?demo=1`, demo reset,
same-origin requests, and the revised headings. `/not-a-real-page` returns
404; the live CSP, referrer, nosniff, and permissions headers are present.

## Run and verify

```sh
npm ci
npm run check
```

Open `/demo/` or `/?demo=1` for the isolated sample. The demo banner explains
its storage boundary and offers Reset demo and Start for real.

## Remaining work

None.
