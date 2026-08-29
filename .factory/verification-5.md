# Independent verification 5 — FAIL

Date: 2026-08-29
Work order: `code-listen-cursor-verify-5`
Candidate: `22b79dd5127e80e9df8b966e2fd7610ebf56eb16`
Live URL: <https://code-listen-cursor.sociobot.in/>  
Verdict: **FAIL — do not release.**

The prior deployment-only concern is resolved by fresh evidence: the live static
site matches a build from this candidate and the logical contents of both live
downloadable packages match the candidate packages. The product nevertheless
does not meet the researched brief's required human acceptance outcome. Its own
study record says that no participant evidence or screen-reader-user evaluation
has been collected, so the required 16/20 comprehension result cannot be
claimed.

## Mandatory cold first read — PASS

In a new 1440×900 Chromium context, the live first viewport had title **“Code
Listen Cursor — listen to selected code”**, heading **“Listen to code without
losing your place”**, and the plain explanation **“For developers who read
better by ear, it reads a selection or current line as spoken structure.”** The
visible primary action was **“Try it with sample data”** and it linked directly
to `/demo/`. One click opens an editable, realistic JavaScript sample with the
persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, and
Start for real. This answers what it does, for whom, and what to click first.

## Mandatory claims gate — PASS

`node_modules` was absent initially. I ran `npm ci` in this clean checkout
(184 packages; 0 vulnerabilities), then ran every exact command recorded in
`.factory/claims.json`. All 15 declared claims passed.

| Claims | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — desktop and 390px, isolated key/reset. |
| `demo-reader` | `npm run test:e2e -- --grep @claim:demo-reader` | PASS — selection/current-line plus pronunciation. |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS — desktop and 390px request checks. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — desktop and 390px. |
| `free-download` | `npm run test:e2e -- --grep @claim:free-download` | PASS — both package downloads without account. |
| `structure-aware-speech` | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS. |
| `local-voice` | `npm test -- --testNamePattern @claim:local-voice` | PASS. |
| `browser-reader-controls`, `browser-reader-settings`, `browser-shortcut-configuration`, `installed-package-privacy` | `npm run test:installed` | PASS — fresh installed ZIP, controls/settings/local storage/shortcut configuration/privacy. |
| `vscode-reader-controls`, `vscode-package-privacy` | `npm run test:vscode-installed` | PASS — packaged VSIX harness. |
| `generated-artwork-provenance` | `npm test -- --testNamePattern @claim:generated-artwork-provenance` | PASS. |
| `mit-license` | `npm test -- --testNamePattern @claim:mit-license` | PASS. |

The complete local gate also passed: `npm run check` ran typecheck, syntax
checks, 14 Vitest tests, the exact production build, browser/VSIX packaging and
consumer smoke checks, and all 22 Playwright tests at desktop and 390px.

## Independent product and live checks

| Area | Result and evidence |
| --- | --- |
| Representative demo flow | PASS. `kubectl → cube control` produced `indent 1 level, return cube control`; blank code produced “Nothing to read” with recovery text; `const fern = 1;` recovered to `const fern gets 1`; Reset removed `demo:code-listen-cursor:pronunciation`. |
| Privacy/network | PASS. During a fresh live mobile demo edit/listen/reset flow, all recorded requests had only the `https://code-listen-cursor.sociobot.in` origin; no console/page errors occurred. The live CSP has `connect-src 'self'`. |
| PWA/offline/update | PASS. The controlled live demo reported active service worker `sw.js`, cache `code-listen-cursor-v3`, and `registration.update()` completed. With network disabled, reload returned HTTP 200 and rendered “Listen to sample code.” |
| Accessibility | PASS automated baseline. Fresh Axe scans of `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at 1440×900 and 390×844 found zero serious/critical findings (indeed zero findings). Each had `lang=en`, one `h1`, one `main`, no horizontal overflow, and no normal-route console/page errors. The worker `verify-url.sh` passed (771ms load; title/lang/main/alt/button checks). |
| Keyboard/motion/touch | PASS. First Tab on live demo focused the Skip to main content link; controls were operable by Enter in the tested flow; no visible interactive target measured under 44×44px at 390px. Reduced-motion computed transition/animation duration was `0.00001s`. |
| Headers, caching, routes | PASS. Live root sends HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and response-header CSP including `frame-ancestors 'none'`. Hashed JS/CSS are immutable for one year, `/sw.js` is `no-cache`, and downloads are attachments cached one day. `/no-such-route` returns HTTP 404. All 15 discovered site/source/download links returned 2xx. |
| Bundle budgets | PASS. Fresh build: initial JS 7,412 B / 3,102 B gzip; CSS 11,553 B / 3,388 B gzip; mobile hero WebP 38,244 B. All are below the specified budgets. |
| Deployment identity | PASS. SHA-256 matched live and `dist/site` for root, demo, privacy, terms, 404, service worker, main JS/CSS, hero artwork, and social art. ZIP/VSIX outer archives differ due to archive metadata, but `unzip -t` passed and all extracted Chrome (11) and VSIX (6) files had zero content differences from the fresh candidate packages. |
| API/auth applicability | N/A. This is a static site plus local extensions; it exposes no product or product-unlock server endpoint and no sign-in flow. There is therefore no documented allowance/429/`Retry-After` or Entra tenant flow to exercise. |

## Release-blocking defects

| Severity | Finding | Evidence and impact |
| --- | --- | --- |
| Critical | The researched human success measure and screen-reader-user validation are absent. | `.factory/usability-study.md` says **“participant evidence not yet collected”** and its results table is Pending. The brief requires participants to identify the requested symbol/indentation relationship in at least 16 of 20 snippets and asks for testing output with screen-reader users. Parser fixtures, Axe, and the installed-package automation do not establish that human outcome. |
| Medium | The landing header omits the required Privacy navigation link. | Its only header links are Demo, How it works, and Download. The standard site skeleton requires Privacy in the consistent header navigation; at 390px the CSS leaves only Demo visible. Privacy remains reachable in the footer, but this misses the stated standard and makes a key policy harder to find for the accessibility audience. |

## Required remediation

1. Conduct the consented 20-snippet study using the recorded protocol with at
   least one screen-reader/auditory-workflow participant. Record only the
   non-identifying evidence required by `.factory/usability-study.md`; release
   only after a score of at least 16/20 and no screen-reader blocker.
2. Add Privacy to the landing header navigation and retain a clear, reachable
   Privacy link in the mobile header treatment.

No product code was modified during this verification.
