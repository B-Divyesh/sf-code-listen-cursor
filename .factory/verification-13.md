# Independent verification 13 — PASS

Date: 2026-08-30

Work order: `code-listen-cursor-verify-13`

Candidate commit: `bfc78b6fd12e83b7a28997fe9d6cd4111a3d33a4`

Live URL: <https://code-listen-cursor.sociobot.in/>

Verdict: **PASS — candidate accepted with one low-severity wording defect.**

No product code was changed during verification.

## First read and demo gate — PASS

The cold production screen says what the product does: **“Listen to selected
code, symbols, and indentation.”** It identifies the audience as developers who
read better by ear, and the primary action is **“Try it with sample data.”** The
adjacent sentence says the action opens editable sample code and spoken output.

One keyboard-operable click opened `/demo/`. The resulting first screen already
contained editable JavaScript, a spoken preview, reader controls, the persistent
**“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start
for real**. The same first screen at 390 px had no horizontal overflow.

## Required claims — PASS

`.factory/claims.json` exists and contains 17 unique claim IDs. The initial
uninstalled invocation could not start WXT because a clean clone has no
`node_modules`; this was a missing test-runner prerequisite, not a claim
assertion. `npm ci` then installed 184 packages with zero audit vulnerabilities.
Every manifest command was rerun exactly from the candidate checkout and exited
0. Repeated package commands were invoked separately as listed.

| Claim | Exact command | Evidence |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS, 2/2 desktop and 390 px |
| `demo-reader` | `npm run test:e2e -- --grep @claim:demo-reader` | PASS, 2/2 |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS, 2/2 |
| `structure-aware-speech` | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS |
| `local-voice` | `npm run test:e2e -- --grep @claim:local-voice` | PASS, 2/2 |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, 2/2 |
| `landing-preview-ephemeral` | `npm run test:e2e -- --grep @claim:landing-preview-ephemeral` | PASS, 2/2 |
| `free-download` | `npm run test:e2e -- --grep @claim:free-download` | PASS, 2/2 |
| `browser-reader-controls` | `npm run test:installed` | PASS, installed ZIP |
| `browser-reader-settings` | `npm run test:installed` | PASS, installed ZIP |
| `portable-pronunciations` | `npm run test:installed && npm run test:vscode-installed` | PASS, installed ZIP and VSIX |
| `browser-shortcut-configuration` | `npm run test:installed` | PASS, installed ZIP |
| `installed-package-privacy` | `npm run test:installed` | PASS, installed ZIP |
| `vscode-reader-controls` | `npm run test:vscode-installed` | PASS, packaged VSIX |
| `vscode-package-privacy` | `npm run test:vscode-installed` | PASS, packaged VSIX |
| `generated-artwork-provenance` | `npm test -- --testNamePattern @claim:generated-artwork-provenance` | PASS |
| `mit-license` | `npm test -- --testNamePattern @claim:mit-license` | PASS |

The landing page, legal pages, and README claims map to this ledger. No material
unlisted public promise was found.

## Clean build and automated gates — PASS

`npm run check` passed in full:

- TypeScript typecheck, script syntax checks, and lint passed.
- Vitest passed 22/22 unit and release-contract tests.
- The exact production build produced `dist/site/`, the MV3 ZIP, and the VSIX.
- Browser package, CSP, 404, unpacked-extension, installed-ZIP, and packaged-VSIX
  checks passed.
- Playwright passed 44/44 tests across desktop and 390 px projects. Coverage
  includes Axe, keyboard operation, focus contrast, 44 px targets, 195 CSS px
  reflow, route semantics, demo isolation, local voice enforcement, and offline
  reload.

## Independent production exercise — PASS

With an explicitly mocked voice marked local, production read a selected,
indented `subtotal += price;` line as **“indent 1 levels, sub total plus gets
price semicolon”**, applied the saved pronunciation, and passed the selected
1.5× rate to speech. Both rate boundaries, 0.5× and 1.5×, were accepted.

Empty code produced the actionable error **“Nothing to read. Add code, select
code, or place the cursor on a non-empty line.”** Blank required pronunciation
input stayed focused and exposed **“Please fill out this field.”** Replacing it
with `fallback → fall back` recovered without reload and produced a successful
spoken preview. Reset restored the original sample and removed the only
`demo:` storage key.

With the unmodified headless browser, production exposed no local voices. The
reader blocked speech, retained the deterministic preview, and explained how to
install or enable a local voice. It logged no console or page error.

Keyboard traversal reached every demo link, button, editor, spoken-preview
region, select, range, checkbox, and form input without a trap. The first Tab
focused the skip link with a 3 px designed outline; the sample-data action opened
the demo with Enter. Under reduced motion, computed animation and transition
durations were 0.01 ms and scrolling was `auto`.

## Accessibility, responsive behavior, and presentation — PASS

Independent Axe scans ran on `/`, `/demo/`, `/privacy/`, `/terms/`, and the
designed 404 at desktop and 390 px. All ten scans returned zero violations,
including zero serious or critical findings. Each route had `lang="en"`, one
H1, one main landmark, no missing image alt attributes, no unlabeled buttons,
and no horizontal overflow.

`/opt/fleet/lib/verify-url.sh` passed the live root: HTTP 200, 615 ms measured
load, title/lang/H1/main present, and zero console/page errors. The botanical
field-guide visual system is consistent with `.factory/design.md` on desktop
and mobile; the main action and reader state remain visually clear.

## Privacy, headers, caching, offline, and server scope — PASS

The complete production route and demo request logs contained only
`https://code-listen-cursor.sociobot.in` GETs. Saving pronunciations, listening,
error recovery, and reset generated no non-GET request. No analytics,
third-party font/script, account, payment, or code-upload request was observed.

Production sends the restrictive same-origin CSP with `frame-ancestors 'none'`,
HSTS, `nosniff`, `strict-origin-when-cross-origin`, and disabled geolocation,
camera, and microphone policies. HTML revalidates after 30 seconds. Hashed
assets and images are cached for one year as immutable, while `sw.js` is
`no-cache`.

The live service worker was activated from `/sw.js` with the
`code-listen-cursor-v7` cache. After its update check, a network-disabled reload
returned HTTP 200, displayed the demo, edited code, and invoked the local speech
mock successfully. The offline notice was visible.

This is a static site plus downloadable local extensions. It exposes no
server-side product, unlock, AI, payment, or authentication endpoint, so there
is no request allowance, 429/`Retry-After`, persistence boundary, health
identity, concurrency, or Entra sign-in path to test.

## Performance and deployment parity — PASS

Mobile Lighthouse 12.8.2 scored **99 Performance, 100 Accessibility, 100 Best
Practices, and 100 SEO**. FCP and LCP were 1.6 s, TBT 0 ms, CLS 0. The first
load transferred 50,958 bytes across six same-origin requests with no font or
third-party request.

The first-load JavaScript is 8,302 bytes raw and 3,696 bytes gzip. Main CSS is
13,801 bytes raw and 3,783 bytes gzip. The mobile hero WebP is 38,244 bytes.
All are comfortably inside the product budgets.

Live HTML for all routes, executable JS, CSS, service worker, crawler files,
and responsive images matched the candidate byte for byte. The root HTML hash
is `ef3a14f5d7e33220e186f1459350cdd258163d27867051d2cee5064229eea0ca`;
the main JS hash is
`b93073db4133c38369d33ad39a734ec84ed9b47ad8d2ce55ff1ffa1b43ca6879`.
The live ZIP and VSIX container hashes differ from a fresh build only because
their ZIP timestamps differ; every archive path and every unpacked file hash
matches, with zero payload mismatches.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None. |
| High | None. |
| Medium | None. |
| Low | **LOW-1:** A selection with fewer leading spaces than the configured indent width says “indent 1 levels.” The cue remains understandable, normal full-line indentation says “indent 1 level,” and all structural fixtures pass. Correct pluralization should use the displayed fallback level. |
