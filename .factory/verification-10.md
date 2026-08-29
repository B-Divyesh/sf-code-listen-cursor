# Independent verification 10 — PASS

Date: 2026-08-29
Work order: `code-listen-cursor-verify-10`
Candidate commit: `97ba80a9f6857c6a9cb4718de22285281a6fd4aa`
Live URL: <https://code-listen-cursor.sociobot.in/>
Verdict: **PASS — release candidate accepted.**

No product code was modified during this verification. The only committed changes
from this work order are this report and the handoff update.

## First-read and one-click demo gate — PASS

I opened the live root cold in a new 1440×900 Chromium context with no stored
state. The first screen says **“Listen to code without losing your place,”**
then says it is **for developers who read better by ear** and reads a selection
or current line as spoken structure. Its clear first action is **“Try it with
sample data.”** One keyboard Enter or mouse click opens `/demo/`, already
populated with realistic code and showing the persistent **“Demo — sample data,
nothing is saved”** banner with **Reset demo** and **Start for real**. This
meets the plain-words and demo-sandbox acceptance gates.

## Required claims — PASS

`.factory/claims.json` exists and contains 15 claims. From the clean candidate
checkout, `npm ci` installed 184 packages with zero reported vulnerabilities.
I invoked every listed test entry; repeated package commands were run once per
claim entry, not merely deduplicated. All passed.

| Claim ID | Required command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS, desktop + 390px |
| `demo-reader` | `npm run test:e2e -- --grep @claim:demo-reader` | PASS, desktop + 390px |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS, desktop + 390px |
| `structure-aware-speech` | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS |
| `local-voice` | `npm run test:e2e -- --grep @claim:local-voice` | PASS, desktop + 390px |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, desktop + 390px |
| `free-download` | `npm run test:e2e -- --grep @claim:free-download` | PASS, desktop + 390px |
| `browser-reader-controls` | `npm run test:installed` | PASS, fresh installed ZIP |
| `browser-reader-settings` | `npm run test:installed` | PASS, fresh installed ZIP |
| `browser-shortcut-configuration` | `npm run test:installed` | PASS, fresh installed ZIP |
| `installed-package-privacy` | `npm run test:installed` | PASS, fresh installed ZIP |
| `vscode-reader-controls` | `npm run test:vscode-installed` | PASS, packaged VSIX |
| `vscode-package-privacy` | `npm run test:vscode-installed` | PASS, packaged VSIX |
| `generated-artwork-provenance` | `npm test -- --testNamePattern @claim:generated-artwork-provenance` | PASS |
| `mit-license` | `npm test -- --testNamePattern @claim:mit-license` | PASS |

The live landing page, privacy page, and README were cross-checked against the
manifest. No unlisted material claim was found.

## Clean local quality gates — PASS

- `npm run lint`: PASS (`tsc --noEmit` and JavaScript syntax checks).
- `npm test`: PASS, 16/16 Vitest tests.
- `npm run build`: PASS; produces `dist/site`, the Chrome ZIP, and VSIX.
- `npm run test:package`: PASS (package, CSP, and 404 policy).
- `npm run test:extension`: PASS (extension smoke and non-local-voice recovery).
- `npm run test:e2e`: PASS, 32/32 Playwright tests across desktop and 390px.

Production initial assets are well within the supplied limits: 8,215 bytes raw
JavaScript across the two landing modules (3,544 bytes gzip reported by Vite),
12,706 bytes raw main CSS (3,590 bytes gzip), no downloaded fonts, and a
38,244-byte mobile hero WebP. The MV3 extension is 30.27 kB unpacked.

## Independent live product QA — PASS

On the deployed `/demo/` I selected sample code and observed structure-aware
speech preview text (`const describe Plant gets a sink ... arrow open brace`).
I added `result → result value`, received the confirmation, emptied the editor,
and received the actionable **Nothing to read** recovery state. **Reset demo**
restored the sample and left no storage keys. The edit/listen/reset flow made
only same-origin requests for the page, local JS/CSS, and icon; it produced no
console or page errors.

The previously reported keyboard defect is repaired. With 1,242px of generated
spoken preview at 390px on both `/` and `/demo/`, the preview is a named
`role=region`, has `tabIndex=0`, receives keyboard focus, and has no
serious/critical Axe finding. A focused `PageDown` changed its scroll position
from 0 to 119; repeated Arrow Down reached 915. The 195px reflow proxy is also
focusable and Axe-clean.

At 390×844 there is no horizontal overflow (`scrollWidth=390`), and no visible
interactive target is under 44px high. Keyboard Tab traversal reaches the skip
link, navigation, sample action, editor, controls, and preview with a visible
3px `#B55435` focus outline. Enter on the sample action navigates to `/demo/`.
Reduced-motion mode computes the animation duration to `0.00001s`.

Axe WCAG A/AA scans of live `/`, `/demo/`, `/privacy/`, `/terms/`, and
`/404.html` found zero serious or critical violations. Each has exactly one H1,
one main landmark, a distinct appropriate title, and no console/page errors.
All discovered internal links and both download URLs returned 200; an unknown
route returned 404. `robots.txt` and `sitemap.xml` returned 200.

## Privacy, offline, headers, caching, and deployment parity — PASS

The live response headers include a restrictive response-header CSP
(`connect-src 'self'`, `frame-ancestors 'none'`), HSTS, `nosniff`, strict-origin
referrer policy, and disabled camera/microphone/geolocation. HTML uses
30-second revalidation, hashed JS/CSS use one-year immutable caching, and
`sw.js` is `no-cache`.

The live service worker controls `/demo/` from `/sw.js`; after an explicit
registration update check it remained active with no waiting worker. Taking the
context offline then reloading `/demo/` returned HTTP 200 and retained the demo
content.

Freshly built live parity checks found byte-for-byte matches for root HTML,
hashed JS/CSS, route-focus module, and service worker. The downloaded ZIP and
VSIX archive byte streams differ because archive metadata is regenerated, but
their fully decompressed contents match the candidate build exactly. The live
deployment therefore matches candidate `97ba80a` in all executable content.

This is a static, local-first extension. It has no backend/product-unlock API,
account, payment, sign-in, AI request, server persistence, or server-side rate
allowance; 429/Retry-After, concurrency, health/build-identity, billing, and
Entra checks do not apply.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None found. |
| High | None found. |
| Medium | None found. |
| Low | None found. |
