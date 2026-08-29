# Independent verification 9 — FAIL

Date: 2026-08-29
Work order: `code-listen-cursor-verify-9`
Candidate commit: `1493ac0a98b3281f45a8982cfc3d33a1d0021f83`
Live URL: <https://code-listen-cursor.sociobot.in/>
Verdict: **FAIL — do not release.**

The deployment is healthy, matches the candidate, and all declared claims and
repository quality gates pass. The release remains blocked by a serious
keyboard-access defect in the core spoken preview when it becomes scrollable.
No product code was changed during verification.

## Mandatory first-read and demo gate — PASS

I opened the live root cold in a new 1440×900 Chromium context with no stored
state. The first screen says **“Listen to code without losing your place,”**
names **developers who read better by ear**, explains that it reads a selection
or current line as spoken structure, and presents **Try it with sample data** as
the primary action. One click opens `/demo/`, already populated with realistic
sample code and a persistent **“Demo — sample data, nothing is saved”** banner,
**Reset demo**, and **Start for real**. The mandatory first-read gate passes.

## Mandatory clean-clone claims gate — PASS

The checkout began clean at the exact candidate commit. `npm ci` installed 184
packages and reported zero vulnerabilities. I then ran all 15 test commands in
`.factory/claims.json` exactly as recorded, including each repeated command for
installed packages. Every invocation exited zero.

| Claim ID | Exact command | Fresh result |
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

The live landing, privacy page, and README claims map to the ledger. No
unlisted material product promise was found.

## Clean local gates and production artifacts — PASS

The first `npm run check` attempt completed typecheck, lint, 16/16 Vitest tests,
the exact production build, package checks, installed ZIP/VSIX harnesses, and
29 Playwright cases. Chromium's GPU process then crashed with SIGSEGV while the
desktop focus-contrast test was closing; no product assertion failed. The exact
`npm run test:e2e` retry passed 30/30, and a second complete `npm run check`
passed end to end with 30/30 Playwright cases. The transient browser-process
failure is recorded here rather than treated as product evidence.

The production build produced `dist/` and these initial-load assets:

- JavaScript: 8,203 bytes raw across both landing modules; 3,576 bytes gzip.
- Main CSS: 12,492 bytes raw; 3,585 bytes gzip.
- Mobile hero WebP: 38,244 bytes; no downloaded font.
- Browser extension: 30.27 kB unpacked.

All are well below the supplied 200 kB JS, 50 kB CSS, 120 kB font, and 300 kB
mobile-hero limits.

## Independent live functional and privacy checks — PASS

Fresh desktop and 390×844 contexts completed the representative job:

- Selecting `kubectl`, saving `cube control`, and listening sent exactly
  `cube control` to a controlled voice marked local at rate 0.9.
- Moving to the indented second line with literal punctuation produced
  `indent 1 level, total plus gets price semicolon`.
- Rate boundaries displayed 0.5× and 1.5×.
- Submitting blank pronunciation fields focused the invalid field and exposed
  `Please fill out this field.`
- Blank code produced **Nothing to read** and a concrete recovery instruction;
  replacing it with `const fern = 3;` recovered immediately.
- Demo storage contained only
  `demo:code-listen-cursor:pronunciation`; Reset demo removed it.
- With only a voice marked non-local, the product constructed and spoke zero
  utterances, showed **Local voice needed**, and retained the spoken preview.

The full edit/listen/save/reset flow made only same-origin requests for the
document, hashed JS/CSS, and local icon. There were no console or page errors.
Source inspection found no analytics, telemetry, remote model, raw Azure key,
or runtime third-party script/font.

The live service worker controlled `/demo/` from `/sw.js`, exposed only cache
`code-listen-cursor-v5`, and returned HTTP 200 with **Listen to sample code**
after the context was taken offline and reloaded. The declared update test also
seeded the stale v4 cache and proved it was replaced by v5.

## Accessibility, responsive, and visual checks — FAIL

The supplied `/opt/fleet/lib/verify-url.sh` passed: live HTTP 200 in 633 ms,
correct title and `lang=en`, one H1, a main landmark, no missing image alt, no
unlabelled button, and no console/page errors.

Independent Axe WCAG A/AA/2.1 AA scans of `/`, `/demo/`, `/privacy/`, `/terms/`,
and the real 404 returned zero violations at both 1440×900 and 390×844. Every
route had one H1/main, no undersized visible control, no viewport overflow, and
visible Privacy navigation. Keyboard traversal reached every demo control in
order with a designed 3 px focus ring and no trap. Reduced motion computed to
0.00001-second animation and transition durations.

However, the spoken preview fails when its content exceeds its fixed 190 px
maximum height. At the repository's own 195 CSS px proxy for 200% zoom, the
default preview measured 188 px client height versus 239 px scroll height on
both `/` and `/demo/`. It has `overflow:auto` but `tabIndex=-1` and no focusable
descendant. Axe 4.10.2 reports one **serious**
`scrollable-region-focusable` violation against `#speech-preview` on both
routes. A normal 390px mobile viewport reproduces the same defect with a
181-character code line: spoken output is 212 characters, client height is
188 px, scroll height is 266 px, and the region remains unreachable by
keyboard. A longer line also reproduces it on desktop. Sighted keyboard-only
users cannot scroll to the clipped words.

This violates the attached non-negotiable keyboard baseline and the requirement
that text resize to 200% without loss. It is release-blocking even though the
initial-state desktop/mobile Axe checks pass.

Screenshots and machine-readable live evidence were captured under
`test-results/verification-9/` (gitignored), including desktop/mobile demo
screenshots, route Axe results, the functional request/storage log, factory URL
verification, and Lighthouse JSON.

## Performance, routes, headers, and deployment parity — PASS

Lighthouse 12.8.2 mobile scored Performance 100, Accessibility 100, Best
Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, and total
transfer 49 KiB.

Root, demo, privacy, terms, and a real unknown route returned the expected
200/404 statuses. Routes have distinct titles, metadata, one H1, one main,
working skip links, legal navigation, and the designed 404. All intended
internal links, downloads, and GitHub links returned 200. `robots.txt` and
`sitemap.xml` returned 200 and list all public routes.

Live HTML has a 30-second revalidation policy; hashed JS/CSS use one-year
immutable caching; `sw.js` is `no-cache`; downloads cache for one day. Every
checked response includes HSTS, `nosniff`, strict-origin referrer policy,
restrictive permissions policy, and a response-header CSP with
`connect-src 'self'` and `frame-ancestors 'none'`.

Fresh local root, demo, privacy, terms, 404, service worker, and hashed asset
bytes exactly matched live. Extracted file lists and every extracted file byte
in the live Chrome ZIP and VSIX matched the fresh candidate build. The live
deployment therefore matches candidate commit `1493ac0`.

There is no backend/product-unlock endpoint, account, payment, AI request,
sign-in, or server persistence boundary. API rate allowance/429/`Retry-After`,
concurrency, health identity, billing, and Entra authority checks do not apply.

## Defects by severity

| Severity | Finding | Evidence and impact |
| --- | --- | --- |
| High / release-blocking | Scrollable spoken preview is not keyboard accessible. | `#speech-preview` uses `max-height: 190px; overflow: auto` but is not focusable. Axe reports `scrollable-region-focusable` as serious at the 195px/200%-zoom proxy with the shipped sample and at 390px with a 181-character line. Content is clipped and cannot be scrolled by a sighted keyboard-only user. |
| Critical | None found. | — |
| Medium | None found. | — |
| Low | None found. | — |

## Required remediation

Make the spoken preview keyboard-scrollable when it overflows, with an
appropriate accessible role/name and visible focus treatment, or remove the
fixed-height scrolling behavior so all spoken text remains available. Add an
Axe regression using overflowing spoken output at 390px and the 195px reflow
proxy. Then rerun every claims command and `npm run check` from a clean clone.
