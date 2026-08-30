# Independent verification 12 — PASS

Date: 2026-08-30
Work order: `code-listen-cursor-verify-12`
Candidate commit: `6aabc1612efa96e090207c3ac3537d5af1144419`
Live URL: <https://code-listen-cursor.sociobot.in/>
Verdict: **PASS — candidate accepted.**

No product code was changed during this verification.

## First read and demo gate — PASS

Cold live-page reading at the root answers all three required questions in
plain words: it **listens to selected/current-line code**, it is for
**developers who read better by ear**, and the first action is **“Try it with
sample data.”** The adjacent text says it opens editable sample code and spoken
output. One click opened `/demo/`, already containing realistic code, the
reader, a persistent **“Demo — sample data, nothing is saved”** banner,
**Reset demo**, and **Start for real**. The same route fit within a 390px-wide
viewport with no horizontal overflow.

## Required claims — PASS

The clean checkout was exactly the candidate commit. `.factory/claims.json`
exists and contains 16 entries. `npm ci` installed 184 packages with zero audit
vulnerabilities. Every command in the manifest was run exactly, including
repeated packaged-consumer commands and the combined portable-pronunciations
command. All exited successfully.

| Claim IDs | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS, desktop + 390px |
| `demo-reader` | `npm run test:e2e -- --grep @claim:demo-reader` | PASS, desktop + 390px |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS, desktop + 390px |
| `structure-aware-speech` | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS |
| `local-voice` | `npm run test:e2e -- --grep @claim:local-voice` | PASS, desktop + 390px |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, desktop + 390px |
| `free-download` | `npm run test:e2e -- --grep @claim:free-download` | PASS, desktop + 390px |
| `browser-reader-controls`, `browser-reader-settings` | `npm run test:installed` (separate invocation for each claim) | PASS, fresh installed ZIP |
| `portable-pronunciations` | `npm run test:installed && npm run test:vscode-installed` | PASS, fresh ZIP + VSIX |
| `browser-shortcut-configuration`, `installed-package-privacy` | `npm run test:installed` (separate invocation for each claim) | PASS, fresh installed ZIP |
| `vscode-reader-controls`, `vscode-package-privacy` | `npm run test:vscode-installed` (separate invocation for each claim) | PASS, packaged VSIX |
| `generated-artwork-provenance` | `npm test -- --testNamePattern @claim:generated-artwork-provenance` | PASS |
| `mit-license` | `npm test -- --testNamePattern @claim:mit-license` | PASS |

The installed ZIP harness exercised selection/current-line reading, follow,
repeat, stop, configurable shortcut, settings, local extension storage, and
network privacy. The packaged VSIX harness exercised its commands, local state,
and network block. The claim ledger was also cross-checked against the landing
page, legal pages, and README; no material unlisted promise was found.

## Local build and test gates — PASS

- `npm run lint` and `npm run typecheck` passed.
- `npm test` passed: 19/19 Vitest tests.
- `npm run build` produced `dist/site/`, the browser ZIP, and the VSIX.
- `npm run test:package` and `npm run test:extension` passed.
- The full Playwright suite passed with one worker after build: desktop and
  390px projects, semantic/axe checks, demo flow, offline claim, keyboard,
  195px reflow, focus contrast, touch target, and long-preview keyboard-scroll
  coverage.

## Independent live functional QA — PASS

At desktop size, a controlled voice marked local read the selected indented
`total += price;` as **“indent 1 level, total plus gets price”** and entered
the listening state. Saving `kubectl → cube control` worked in demo storage.
The reader exposed both rate boundaries (0.5× and 1.5×). Empty code recovered
with “Nothing to read. Add code, select code, or place the cursor on a
non-empty line.” Empty required pronunciation input stayed focused and exposed
the native “Please fill out this field.” message. In a normal headless browser
with no local voice, speech was blocked and the visible recovery explained that
a local voice is needed while leaving the preview available.

Keyboard testing put the skip link first (`#main`), and the live demo action
was operable by keyboard. The 390px audit found no overflow on `/`, `/demo/`,
`/privacy/`, `/terms/`, or `/404.html`; each had one H1, one main landmark, and
zero Axe serious/critical findings. Reduced-motion computed scroll behavior as
`auto`. There were no console errors or page errors.

`/opt/fleet/lib/verify-url.sh` passed the live root (HTTP 200; 654ms load;
correct title/lang; one H1; main; zero missing image alts and unlabelled
buttons; no console error).

## Privacy, offline, headers, performance, and deployment parity — PASS

The live request log across root, all public routes, and the demo save/reset
flow contained only `https://code-listen-cursor.sociobot.in` documents, assets,
and images. No code upload, analytics, third-party font/script, account,
payment, or product server endpoint exists. This static product has no rate
allowance, 429/Retry-After behavior, server persistence, health endpoint, or
sign-in to test.

The live service worker controlled `/demo/`; after a first visit, an offline
reload returned HTTP 200 and retained the “Try the code reader” view. Its
versioned cache is `code-listen-cursor-v5`, activates with `skipWaiting`, claims
clients, and deletes prior product caches. Response headers include restrictive
same-origin CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin
referrer policy, and disabled camera/microphone/geolocation. The service worker
is `no-cache`; hashed JS/CSS assets are one-year immutable cached.

The browser JS is 8,385 bytes raw in total (3.63 KiB gzip reported by Vite),
main CSS is 13,835 bytes raw (3.79 KiB gzip), no web fonts load, and the mobile
hero WebP is 38,244 bytes: all well within the stated budgets. A direct
Lighthouse 12.8.2 run could not produce a score because the supplied Chromium
tab crashed in Lighthouse; this was an environment/tool failure. Browser-based
live Axe, console, responsive, request, header, offline, and static-budget
checks above completed successfully.

The live root HTML SHA-256 is
`a3c98ae615724baddf68b5be3cf180ca0744a3c81847e6774306bc3fd3bbc290` both
locally and live. The executable landing module
`assets/main-CrVHFBGb.js` SHA-256 is
`0a0dfc4501770e90c832fbf3488610c4e4ddb3425fa1a24a39cb27808e39be2e` in both
places. The deployed core executable content therefore matches this candidate.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None. |
| High | None. |
| Medium | None. |
| Low | None. |
