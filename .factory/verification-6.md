# Independent verification 6 — FAIL

Date: 2026-08-29
Work order: `code-listen-cursor-verify-6`
Candidate: `6feb3f375fcae7c00cdce1eecdab49b12fb382f1`
Live URL: <https://code-listen-cursor.sociobot.in/>
Verdict: **FAIL — do not release.**

The earlier deployment-only concern is not reproducible. A fresh local
production build matches the deployed HTML, JS, CSS, and extracted browser and
VS Code package contents. All executable claims and automated product checks
pass. Release nevertheless fails the researched acceptance contract because
the required human 20-snippet comprehension result and screen-reader-user
evaluation are still absent.

## Mandatory cold first read — PASS

In a new live Chromium context, the first screen says **“Listen to code without
losing your place”** and explains: **“For developers who read better by ear, it
reads a selection or current line as spoken structure.”** It identifies the
product, intended user, and job in plain words. The visible primary action is
**“Try it with sample data”**; one click opens `/demo/`, an editable JavaScript
sample with the persistent **“Demo — sample data, nothing is saved”** banner,
**Reset demo**, and **Start for real**. The first-read and one-click sandbox
requirements pass at desktop and 390 px.

## Mandatory claims gate — PASS

`.factory/claims.json` exists and contains 15 declared claims. From this clean
checkout I installed dependencies with `npm ci` (184 packages; audit: 0
vulnerabilities), then exercised every listed claim test through the built demo
or packaged public artifact. All passed.

| Claims | Declared command | Result |
| --- | --- | --- |
| `demo-sandbox`, `demo-reader`, `no-code-upload`, `offline-reload`, `free-download` | `npm run test:e2e -- --grep @claim:<id>` | PASS — the selected claim suite produced 10 passing desktop/390px cases after a fresh production build. |
| `structure-aware-speech` | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS. |
| `local-voice` | `npm test -- --testNamePattern @claim:local-voice` | PASS. |
| `browser-reader-controls`, `browser-reader-settings`, `browser-shortcut-configuration`, `installed-package-privacy` | `npm run test:installed` | PASS — fresh Chromium profile, installed distributable ZIP, controls/settings/local storage/shortcut configuration/privacy. |
| `vscode-reader-controls`, `vscode-package-privacy` | `npm run test:vscode-installed` | PASS — packaged VSIX in an isolated host harness. |
| `generated-artwork-provenance` | `npm test -- --testNamePattern @claim:generated-artwork-provenance` | PASS. |
| `mit-license` | `npm test -- --testNamePattern @claim:mit-license` | PASS. |

## Local build and consumer verification — PASS

`npm run check` passed from the clean install. It ran TypeScript typecheck and
JavaScript syntax checks, all 14 Vitest unit/release-contract tests, the exact
production WXT MV3 build, Chrome ZIP and VS Code VSIX packaging, package smoke,
unpacked extension smoke, installed-browser consumer/privacy flow, packaged
VSIX integration, and the 24-case Playwright suite at desktop and 390×844.
I also ran `npx playwright test` after the final build; all 24 local browser
checks completed. This covers selection/current-line reading, personal
pronunciation, rate/indentation/punctuation settings, follow/repeat/stop,
browser shortcut configuration, local storage, and the isolated demo reset.

The exact production output is `dist/site/`. Initial site JS is 7,412 B
(3,123 B gzip), CSS is 11,570 B (3,403 B gzip), the 640 px hero WebP is
38,244 B, and the browser extension is 29.73 kB: all within the stated static
budgets.

## Independent live product verification — PASS

| Area | Fresh evidence |
| --- | --- |
| Normal, boundary, and invalid demo paths | A live selected first line produced the structure-aware preview `const describe Plant gets a sink open paren fern close paren arrow open brace`. Saving `fern → furn` stored only `demo:code-listen-cursor:pronunciation`; Reset removed it. A blank required pronunciation field was rejected with the native recovery message “Please fill out this field.” In this headless environment with no system English voice, Listen displayed its explicit recovery message to install/select an English system voice. |
| Privacy | During a clean live demo edit/listen/save/reset flow, request recording found only `https://code-listen-cursor.sociobot.in`; no external request, console error, or page error occurred. The live CSP is response-header CSP with `connect-src 'self'`. |
| Desktop/mobile, keyboard, motion | At 1440 px and 390 px, landing and demo had no horizontal overflow. All measured visible controls were at least 44×44 px. Tab began at Skip to main content and every sampled focused control had a visible `rgb(181, 84, 53) solid 3px` outline. With `prefers-reduced-motion: reduce`, computed animation was `none` and transition duration was `0.00001s`. |
| Accessibility | Fresh Playwright Axe WCAG 2 A/AA/2.1 AA scans found zero serious or critical findings on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at both viewports. Every normal route had `lang=en`, its expected title, one H1, and one main landmark. No normal-route console/page errors occurred. |
| Service worker/offline | Live `/demo/` was controlled by active `sw.js` with no waiting update. After first load, disabling network and reloading returned HTTP 200 and rendered “Listen to sample code.” |
| Headers, caching, and links | Root, demo, privacy, and terms send HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP including `frame-ancestors 'none'`. Hashed JS/CSS are `max-age=31536000, immutable`; `sw.js` is `no-cache`; unknown routes return actual HTTP 404. Every discovered product, policy, 404, and package link returned 200. |
| Deployment identity | Live root, demo, privacy, terms, main JS, and main CSS SHA-256 exactly matched fresh `dist/site`. The downloaded Chrome ZIP and VSIX outer hashes differed from the fresh archives, but `diff -rq` found **zero** differences after extraction in either package; the difference is container metadata only, not deployed product content. |

There is no server-side product endpoint, account, payment, AI call, or
product-unlock call. Rate-limit/429/`Retry-After` and Entra tenant checks are
therefore not applicable.

## Release-blocking defect

| Severity | Finding | Evidence and impact |
| --- | --- | --- |
| Critical | The brief's human success measure and screen-reader validation remain unproven. | `.factory/usability-study.md` states **“participant evidence not yet collected”** and the only result row is Pending. The brief requires users to identify requested symbol/indentation relationships in at least 16 of 20 snippets and requires screen-reader-user testing. Automated parser fixtures, Axe, package harnesses, and a headless browser cannot establish this outcome. |

## Required resolution

Conduct and record the consented protocol in `.factory/usability-study.md`
against the release package. Record only the requested non-identifying fields.
Release can be reconsidered only with an anonymized score of at least 16/20
and no screen-reader blocker. No product code was changed by this verification.
