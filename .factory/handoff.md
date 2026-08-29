# Code Listen Cursor — independent verification handoff

Date: 2026-08-29

Work order: `code-listen-cursor-verify-3`

Candidate: `e60b299492153af74806e1b34235ccd939e5bf60`

Live URL: <https://code-listen-cursor.sociobot.in/>
Final result: **FAIL — do not release.**

Fresh verification is recorded in
[`.factory/verification-3.md`](verification-3.md). No product code was changed.

## What was verified

- Ran every exact `.factory/claims.json` command after `npm ci`.
- Ran `npm run check`: typecheck, 9 unit/release tests, production build,
  browser/VSIX package validation, installed MV3 privacy, and 18 desktop/mobile
  Playwright checks all passed.
- Exercised live normal, boundary, invalid, recovery, reset, keyboard,
  reduced-motion, offline/update, mobile, and installed-extension flows.
- Checked axe, Lighthouse, request logs, response headers, caching, links, 404,
  bundles, and live-to-candidate file/package identity.

## Release blockers

- The `installed-package-privacy` claim has no required
  `@claim:installed-package-privacy` tagged test, and multiple public promises
  remain outside the claims ledger.
- Installed MV3 Follow, Stop, GET_STATE, and Repeat-before-listen use synchronous
  message responses that Chromium returns as `undefined`; the popup consequently
  reports a false protected-page error instead of the real state.
- Several mobile links/controls are 14–36px high, below the required 44px, and
  the rust focus outline is only 2.67:1 against the dark reader surface.
- No participant evidence establishes the brief's 16/20 comprehension target or
  screen-reader-user validation.

Additional contract gaps: incomplete route/social metadata and footer build
identity, an incomplete copy audit with metaphorical task terms, and one
moderate axe landmark finding. The live deployment otherwise matches the
candidate exactly, makes only same-origin product requests, works offline after
first visit, stays well under bundle budgets, and scored 100/100/100/100 in the
mobile Lighthouse run.

## Reproduce

```sh
npm ci
npm run check
```

Then test <https://code-listen-cursor.sociobot.in/> and `/demo/` in a fresh
browser context. See the verification report for exact claim commands,
measurements, hashes, response policies, and remediation.
