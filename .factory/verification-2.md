# Independent verification 2 — FAIL

Date: 2026-08-29
Work order: `code-listen-cursor-verify-2`
Candidate: `2ddf250ea69384bccb4e05af7b3a65369506142c` (`fix: repair verifier release blockers`)
Live URL: <https://code-listen-cursor.sociobot.in/>
Verdict: **FAIL — do not release.**

This is a fresh verification of the candidate, not a repetition of the prior
deployment report. The production deployment is healthy and is the candidate;
the remaining blockers are acceptance-contract defects.

## Cold first read — PASS

In a new browser context, the first screen says: **“Listen to code without
losing your place.”** It explains that it is for “developers who read better by
ear” and that it reads a selection/current line as spoken structure. The first
primary action is the visible **“Try it with sample data”** link to `/demo/`.
Thus the visitor can tell what it does, for whom, and what to click first in
plain words. The one-click demo and persistent “Demo — sample data, nothing is
saved” banner were present.

## Mandatory claims gate — FAIL

Dependencies were freshly installed with `npm ci` before executing every exact
command in `.factory/claims.json` through the shipped demo entry point.

| Claim | Exact recorded command | Result | Evidence |
| --- | --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS | 2/2 desktop and 390px tests passed. |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS | 2/2 tests passed. |
| `local-voice` | `npm test -- --grep @claim:local-voice` | **FAIL** | Vitest 3.2.7 exits before tests: `CACError: Unknown option --grep`. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS | 2/2 tests passed. |
| `free-download` | `npm run test:e2e -- --grep @claim:free-download` | PASS | 2/2 tests passed. |

For diagnosis only, `npx vitest run --testNamePattern @claim:local-voice`
passes the one tagged test. It does **not** repair the required recorded
command. A claims command failure is release-blocking under the claims contract.

## Fresh checks that passed

| Check | Result | Evidence |
| --- | --- | --- |
| Clean install | PASS | `npm ci`: 184 packages installed; audit reported 0 vulnerabilities. |
| Typecheck, unit tests, exact build, package smoke, MV3 smoke, full E2E | PASS | `npm run check` passed: 8 Vitest tests, production build, ZIP/VSIX package smoke, Chromium MV3 speech smoke, and 18 Playwright tests across desktop and 390px. |
| Production budgets | PASS | Built MV3 total 29.13 kB; landing JS 7.42 kB (3.11 kB gzip); CSS 11.15 kB (3.31 kB gzip). |
| Live first-read/demo flow | PASS | Blank code reported “Nothing to read” with recovery instructions; selected `kubectl` was changed to “cube control”; demo storage reset to `null`. |
| Desktop, 390px, keyboard, focus | PASS | No horizontal overflow (390/390 at mobile); first Tab reached the skip link with a designed 3px rust focus outline. |
| Accessibility | PASS | Live axe scans of landing and demo at desktop and 390px found 0 serious/critical violations; title, `lang`, one `h1`, `main`, labels, and skip link were present; no console or page errors. |
| Reduced motion and offline | PASS | Reduced-motion transition/animation duration was `1e-05s`; after service-worker control, live `/demo/` reloaded offline with HTTP 200 and “Listen to sample code.” |
| Privacy/network smoke | PASS, limited | During full live demo use at both sizes, every recorded request was same-origin; no analytics/third-party request appeared. Root and checked responses use a restrictive CSP with `connect-src 'self'`. |
| Headers/caching/404 | PASS | Live hashed JS is `public, max-age=31536000, immutable`; `/sw.js` is `no-cache`; download is attachment/max-age 86400; `/no-such-route` returns HTTP 404; CSP, HSTS, `nosniff`, and strict-origin referrer policy are sent. |
| Live candidate identity | PASS | SHA-256 of live root, `main-DCNgawOo.js`, and `sw.js` exactly matched this candidate’s build. The live Chrome ZIP passed `unzip -t`; every unpacked entry’s SHA-256 matched the locally built ZIP. |
| Server allowance/sign-in | N/A | This static product exposes no product API or sign-in endpoint, so no documented rate allowance/429 or identity-provider flow applies. |

`verify-url.sh` is not present in this repository, so its requested invocation
could not be performed; equivalent title/lang/main/alt/console checks were run
in live Playwright and axe checks above.

## Release-blocking defects

| Severity | Finding | Evidence and impact |
| --- | --- | --- |
| Critical | The executable claim command for local voice is invalid. | `.factory/claims.json` records Vitest’s unsupported `--grep`; the exact command exits non-zero. The required all-claims gate therefore fails. |
| High | The packaged VS Code product does not supply the brief’s personal pronunciation map or user-tunable language-aware reading settings. | `vscode-extension/extension.ts` always invokes `mergeSettings()` defaults and has no storage/UI for pronunciation, rate, punctuation, indentation, language, or voice choice. `vscode-extension/package.json` contributes only commands/keybindings and no configuration. The VSIX package is structurally valid, but the brief requires a VS Code extension with a personal pronunciation map and language-aware punctuation rules; the supplied adapter cannot complete that real job end to end. |
| High | Public claims remain broader than the executable claims ledger/proof. | The privacy page says “Nothing” is collected and lists no analytics, ads, tracking pixels, cookies, account system, or crash reporting; it also says extension preferences/page content are local. README says the pronunciation map is included. None has its own claims entry/test. `no-code-upload` observes only the landing demo’s requests, not the installed MV3/VS Code extension flows. The claims contract requires every visitor-reliant claim to have one demo-sandbox assertion. |
| High | The brief’s participant outcome and screen-reader validation are still absent. | `.factory/usability-study.md` explicitly says the consented 20-snippet study has not occurred. The researched acceptance metric is at least 16/20 correct identifications and asks for screen-reader-user testing. Deterministic parser tests do not prove that outcome. |
| Medium | Required standard-site handoff metadata is absent from the live footer. | The site-structure contract asks for a version/build id in the footer. Live landing/demo footers have product identity and legal links but no version/build identifier, making production identity less visible to users. |

## Required remediation

1. Change the `local-voice` entry to a valid Vitest filter command and rerun every exact claims command from a clean clone.
2. Bring the actual VS Code extension to feature parity for the brief: persisted local pronunciation map, exposed settings, and language-aware processing; then test the installed VSIX behavior, not only its ZIP structure.
3. Either add sandbox tests/claims for every public privacy/storage/telemetry assertion (including installed extension flows) or narrow the copy to what the current tests demonstrate.
4. Conduct and record the consented 20-snippet screen-reader/auditory-workflow study before claiming the brief success measure.
5. Add a visible build/version id to the standard footer.

No product code was changed during this verification.
