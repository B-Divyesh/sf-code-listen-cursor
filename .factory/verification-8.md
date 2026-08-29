# Independent verification 8 — PASS

Date: 2026-08-29

Work order: `code-listen-cursor-verify-8`  
Candidate commit: `7b4f565709102f3864270c67f608c75c0c1fb589`  
Live URL: <https://code-listen-cursor.sociobot.in/>

Verdict: **PASS — candidate is acceptable for release.**

This report uses the researched brief supplied with the work order as the
acceptance contract. No product code was changed during verification.

## First-read and demo gate — PASS

I opened the live root in a new Chromium context with no prior storage at both
1440px and 390px. The first screen says, in plain words, that the product
listens to code without losing the developer's place; it names developers who
read better by ear; and it makes **Try it with sample data** the first action.
One click opens `/demo/`, where the sample code and reader are immediately
usable. The first screen also states the three relevant facts: demo code stays
in the browser, it works offline after the first visit, and it is free with no
account. No first-read failure found.

## Required clean-clone claims gate — PASS

From this checkout at the candidate commit, I ran `npm ci` (184 packages,
zero reported vulnerabilities) and then every command declared by
`.factory/claims.json`. All 15 claim IDs passed. The browser commands include
both desktop and 390px Playwright projects; shared packaged-artifact commands
printed every claim tag they exercise.

| Claim ID | Exact declared command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS, 2/2 desktop/mobile |
| `demo-reader` | `npm run test:e2e -- --grep @claim:demo-reader` | PASS, 2/2 |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS, 2/2 |
| `structure-aware-speech` | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS |
| `local-voice` | `npm run test:e2e -- --grep @claim:local-voice` | PASS, 2/2 |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, 2/2 |
| `free-download` | `npm run test:e2e -- --grep @claim:free-download` | PASS, 2/2 |
| `browser-reader-controls` | `npm run test:installed` | PASS, installed ZIP harness |
| `browser-reader-settings` | `npm run test:installed` | PASS, installed ZIP harness |
| `browser-shortcut-configuration` | `npm run test:installed` | PASS, installed ZIP harness |
| `installed-package-privacy` | `npm run test:installed` | PASS, installed ZIP harness |
| `vscode-reader-controls` | `npm run test:vscode-installed` | PASS, packaged VSIX harness |
| `vscode-package-privacy` | `npm run test:vscode-installed` | PASS, packaged VSIX harness |
| `generated-artwork-provenance` | `npm test -- --testNamePattern @claim:generated-artwork-provenance` | PASS |
| `mit-license` | `npm test -- --testNamePattern @claim:mit-license` | PASS |

## Local quality and packaged-product verification — PASS

The complete quality command `npm run check` passed. It included typecheck and
syntax lint, 15/15 Vitest tests, the exact WXT MV3/ZIP/VSIX/Vite production
build, package validation, an unpacked-extension smoke test, fresh installed
browser ZIP and VSIX consumer harnesses, and all 30 Playwright tests. The full
browser suite passed at desktop and 390px, covering keyboard paths, selection
and current-line reading, follow/repeat/stop, settings and pronunciation
persistence, shortcut configuration, reset, offline reload, focus contrast,
reflow, touch-target size, and axe checks.

The built browser extension is 30.27 kB unpacked. Initial site JavaScript is
7,729 B (3,219 B gzip), main CSS is 12,361 B (3,527 B gzip), and the selected
mobile hero WebP is 38,244 B. All are within the supplied budgets.

## Independent live product checks — PASS

In a new live demo with a controlled local voice, a selected `kubectl` was
spoken as the saved `cube control` pronunciation. After collapsing the
selection, `const fern = 3;` was spoken as `const fern gets 3`. Empty code
produced the clear recovery message “Add code, select code, or place the
cursor on a non-empty line.” Literal punctuation rendered `const fern gets 3
semicolon`. The demo stored only
`demo:code-listen-cursor:pronunciation`, and **Reset demo** removed it.

With a browser exposing only a non-local English voice, the live product showed
**Local voice needed**, retained the preview, constructed zero utterances, and
made no speech call. This meets the brief's local-voice privacy constraint.

During the edit/listen/save/reset flow, Playwright recorded only these
same-origin requests: `/demo/`, the site JS/CSS, and the local SVG icon. There
were no console errors or page errors. The service worker controlled the live
demo from `/sw.js`, used cache `code-listen-cursor-v5`, and returned HTTP 200
with the demo heading present after network was disabled and the page reloaded.

There is no backend/product API, account, payment, AI request, sign-in,
product-unlock call, health endpoint, or persistence/concurrency boundary.
Rate-limit/429/`Retry-After`, Sociobot billing, and Entra tenant checks are not
applicable.

## Live accessibility, responsive, and policy checks — PASS

`/opt/fleet/lib/verify-url.sh` passed against the live root: HTTP 200, 591 ms
load, title, `lang=en`, one H1, one main landmark, zero missing image alts,
zero unlabeled buttons, and no console/page errors.

Independent Axe WCAG A/AA/2.1 AA scans at 1440×900 and 390×844 returned zero
violations on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`; there
were also zero serious/critical findings, zero undersized visible interactive
targets, exactly one H1 and one main on each route, and no console/page errors.
At the 195px 200%-reflow proxy, every route had `scrollWidth === innerWidth`
and retained visible Privacy navigation. The first keyboard target is the
visible Skip to main content link with a 3px focus outline. With reduced motion
requested, animation and transition durations computed to 0.00001 seconds.

The live root, demo, privacy, terms, and real unknown-route 404 were checked
for response headers. They have HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, restrictive permissions,
and a response-header CSP including `connect-src 'self'` and
`frame-ancestors 'none'`. HTML has a short revalidation cache; hashed JS/CSS
are `max-age=31536000, immutable`; `sw.js` is `no-cache`; downloads cache for
one day. The unknown route returned HTTP 404. All eight discovered internal
and GitHub links returned 200.

## Deployment parity — PASS

The live root, demo, privacy, terms, 404 document, service worker, and hashed
JS/CSS each matched the fresh candidate `dist/site` output byte-for-byte. The
outer ZIP/VSIX byte streams differ after a fresh local rebuild because archive
metadata is time-dependent, but their extracted file lists and every extracted
file hash matched the deployed packages. The live deployment therefore matches
the candidate's production content.

## Defects by severity

| Severity | Finding |
| --- | --- |
| Critical | None found. |
| Major | None found. |
| Minor | None found. |

## Handoff

To reproduce: `npm ci && npm run check`; open
`https://code-listen-cursor.sociobot.in/demo/` for the isolated sample. The
browser package and VS Code package are available from the live landing page.
