# Independent verification 4 — FAIL

Date: 2026-08-29

Work order: `code-listen-cursor-verify-4`
Candidate: `8cd8cb0f2ca4e9da8470ef4435511ef55f629221`
Live URL: <https://code-listen-cursor.sociobot.in/>
Verdict: **FAIL — do not release.**

The previous deployment-only concern is resolved. Fresh, independent checks show
that the live static site and the logical contents of both downloadable packages
match this candidate, the complete automated suite passes, and the product works
in the tested browser flows. It still does not meet the researched brief's human
acceptance criterion: no consented 20-snippet result (minimum 16/20) or
screen-reader-user output evaluation exists. The repository explicitly records
that this evidence is pending, so it cannot be treated as passed.

## Mandatory first-read gate — PASS

In a new uncached 1440×900 Chromium context, the first screen said:

- **What:** “Listen to code without losing your place.”
- **For whom:** “For developers who read better by ear...”
- **First action:** “Try it with sample data.”

One click opened `/demo/` with realistic editable code and the persistent
“Demo — sample data, nothing is saved” banner, Reset demo, and Start for real.
The same hierarchy/action was present at 390×844. This satisfies the plain-words
and one-click-demo gate.

## Mandatory claims gate — PASS after clean install

The first required command was attempted before dependency installation and
stopped at `wxt: not found`, as expected in a dependency-free Node checkout.
After the required `npm ci` (184 packages, 0 vulnerabilities), every exact
unique command listed in `.factory/claims.json` passed against the shipped demo
or packaged artifact:

| Claims covered | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS, desktop + 390px |
| `demo-reader` | `npm run test:e2e -- --grep @claim:demo-reader` | PASS, desktop + 390px |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS, desktop + 390px |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, desktop + 390px |
| `free-download` | `npm run test:e2e -- --grep @claim:free-download` | PASS, desktop + 390px |
| `structure-aware-speech` | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS |
| `local-voice` | `npm test -- --testNamePattern @claim:local-voice` | PASS |
| `browser-reader-controls`, `browser-reader-settings`, `installed-package-privacy` | `npm run test:installed` | PASS against a fresh installed ZIP |
| `vscode-reader-controls`, `vscode-package-privacy` | `npm run test:vscode-installed` | PASS against packaged VSIX harness |
| `generated-artwork-provenance` | `npm test -- --testNamePattern @claim:generated-artwork-provenance` | PASS |
| `mit-license` | `npm test -- --testNamePattern @claim:mit-license` | PASS |

`tests/release-contract.test.ts` also passed its claim-ledger assertion: each of
the 14 declared IDs occurs exactly once in test sources.

## Automated build and product verification — PASS

- `npm run check` passed from the clean install: typecheck, syntax lint, 14
  Vitest tests, exact production build, package structure test, unpacked MV3
  smoke test, installed ZIP test, packaged VSIX test, and all 22 Playwright
  tests at desktop and 390px (`test-results/.last-run.json`: `passed`).
- `npm run build` produced `dist/site/`, Chrome ZIP, and VSIX successfully.
- Live demo normal flow: a pronunciation entry changed the current-line preview
  to “indent 1 level, return cube control.” Empty code returned “Add code,
  select code, or place the cursor on a non-empty line”; entering `const fern =
  1;` recovered to “const fern gets 1.” Native required validation blocked an
  empty pronunciation field and recovered after a valid value.
- Demo reset removed `demo:code-listen-cursor:pronunciation`; no real-data
  namespace was created. Offline reload after service-worker control showed
  “Listen to sample code.”
- A fresh installed-package suite exercised selection/current-line reading,
  follow, repeat-before/after-listen, stop, settings persistence, shortcuts,
  local storage, and the VSIX's five commands.

## Live deployment, privacy, accessibility, and performance — PASS

- Candidate identity: local `HEAD` equals the requested commit. SHA-256 matched
  live versus `dist/site` for `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`,
  `/sw.js`, the main JS/CSS, hero artwork, and OG card. The live ZIP/VSIX outer
  bytes differ because ZIP timestamps are nondeterministic; every extracted file
  in each live package matched the fresh candidate package exactly.
- Live browser request logs for cold landing and full demo editing/listening
  flows contained only `https://code-listen-cursor.sociobot.in` requests. There
  were no analytics, CDN, AI, or other third-party calls. Source inspection
  found no product network client; the service worker only fetches same-origin
  cache misses. No regular-page console or page errors occurred.
- Live response headers include HSTS, `nosniff`, strict-origin referrer policy,
  permissions policy, and a response-header CSP with `connect-src 'self'` and
  `frame-ancestors 'none'`. JS/CSS/art are immutable for one year; `/sw.js` is
  `no-cache`; downloads are attachment responses cached one day. The static
  product exposes no server/product-unlock API and no sign-in, so 429 allowance
  and Entra-tenant checks are not applicable.
- Independent Axe scans of home, demo, privacy, terms, and the live 404 at
  desktop and 390px found zero serious/critical violations. Every route had one
  `main` and one `h1`, no horizontal overflow, and no visible target below
  44×44px. Keyboard testing found the first-tab skip link and a visible 3px
  `rgb(181,84,53)` focus ring. Reduced-motion media produced no cursor animation
  and a `0.00001s` transition. The expected HTTP 404 navigation alone logs the
  browser's failed-resource message; normal routes log no errors.
- Initial site JS is 7,412 B (3,123 B gzip), CSS 11,553 B (3,401 B gzip), and
  mobile hero WebP 38,244 B—within the stated 200 KB JS/50 KB CSS/300 KB hero
  budgets. All discovered product links, downloads, source link, and issue link
  returned HTTP 200; a made-up route returned the designed HTTP 404.

`verify-url.sh` is not present in this repository. Equivalent live checks for
title, language, landmarks, image alternatives, console, headers, links, and
Axe were performed directly with Playwright/curl.

## Release-blocking defects

| Severity | Finding | Evidence and required action |
| --- | --- | --- |
| High | The researched success measure is unverified. | `.factory/usability-study.md` states “participant evidence not yet collected” and its results table is Pending. The brief requires users to identify the requested symbol/indentation relationship correctly in at least 16 of 20 snippets. Run and record a consented study against this package; do not invent results. |
| High | Required screen-reader-user output testing is unverified. | The same study document says screen-reader-user evaluation is pending. Automated Axe and keyboard checks do not prove speech comprehension, control announcements, focus order, voice conflicts, or shortcut conflicts for the target audience. Record consented screen-reader-user evidence and resolve any blocker. |
| Medium | The README's shortcut-configurability promise is not independently declared as a public claim. | README says “Browser extension shortcuts are configurable.” The 14-entry ledger proves shortcut operation but contains no explicit configurable-shortcut claim/sandbox test. Add a claim and installed-browser test that verifies browser shortcut configuration, or remove/narrow the promise. This is a claims-contract gap. |

No product code was modified during this verification.
