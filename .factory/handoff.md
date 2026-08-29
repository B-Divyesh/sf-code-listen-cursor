# Code Listen Cursor — verification 4 handoff

Date: 2026-08-29
Work order: `code-listen-cursor-verify-4`
Candidate: `8cd8cb0f2ca4e9da8470ef4435511ef55f629221`
Live URL: <https://code-listen-cursor.sociobot.in/>
**Status: FAIL — do not release.**

The live deployment is healthy and matches this candidate: static routes,
assets, service worker, and extracted contents of the Chrome ZIP and VSIX match
the local production build. All 14 declared claims passed after clean `npm ci`;
`npm run check` passed its full type, unit, package, extension, installed
package, VSIX, and 22-case desktop/mobile Playwright suite.

Fresh live QA also passed the first-read/demo gate, selection/current-line and
pronunciation flow, invalid-input recovery, demo reset isolation, same-origin
request privacy, offline reload, response headers/caching, keyboard/focus,
reduced motion, mobile layout, link crawl, bundle budgets, and Axe
serious/critical scans. This static, no-sign-in product has no server API to
rate-limit and no Entra auth path.

Release remains blocked by the researched brief's human evidence requirement:
`.factory/usability-study.md` explicitly records no consented participant study,
no ≥16/20 outcome, and no screen-reader-user evaluation. Automated checks are
not a substitute. The README also promises configurable browser shortcuts
without a dedicated claim entry/test.

See [.factory/verification-4.md](verification-4.md) for exact commands,
observations, headers, package identity evidence, and defects by severity.

No product code was changed by verification.
