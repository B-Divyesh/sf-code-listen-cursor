# Independent verification 14 — PASS

Date: 2026-09-02

Work order: `code-listen-cursor-verify-14`

Candidate commit: `8b13718e3375c5680df7eaa86cd83e06b5195366`

Live URL: <https://code-listen-cursor.sociobot.in/>

Verdict: **PASS — candidate accepted with no defects found.**

No product code was changed during verification.

## First read and demo gate — PASS

The production page was opened cold before the broader QA run. Its first screen
answers all three required questions in plain words:

- What it does: **“Listen to selected code, symbols, and indentation.”**
- Who it is for: **“For developers who read better by ear…”**
- What to click first: **“Try it with sample data.”** The adjacent sentence
  says it opens an editable reader with sample code and spoken output.

The action opened `/demo/` in one keyboard-operated click. At both desktop and
390 px, the first demo screen showed editable JavaScript, the spoken preview,
Listen and Stop controls, and the persistent **“Demo — sample data, nothing is
saved”** banner with **Reset demo** and **Start for real**. `/?demo=1` also
redirected to the same working sandbox.

## Required claims — PASS

`.factory/claims.json` exists and contains 17 unique claim IDs. After `npm ci`
installed 184 locked packages with zero audit vulnerabilities, every manifest
entry was invoked exactly as written, including repeated installed-package
commands. All 17 commands exited 0.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS, 2/2 desktop and 390 px |
| `demo-reader` | `npm run test:e2e -- --grep @claim:demo-reader` | PASS, 2/2 |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS, 2/2 |
| `structure-aware-speech` | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS, all 20 fixtures |
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

The landing page, README, privacy page, terms, and extension descriptions were
cross-checked against the ledger. No material unlisted public claim was found.

## Clean install, tests, and production build — PASS

The checkout began at the exact candidate with no tracked changes. `npm run
check` passed in full:

- TypeScript type checking and JavaScript syntax/lint checks passed.
- Vitest passed 23/23 tests.
- The exact production build produced `dist/site/`, the MV3 browser ZIP, and
  the VSIX.
- Package/CSP/404 validation, unpacked-extension smoke, installed ZIP, and
  packaged VSIX integration passed.
- Playwright passed 44/44 cases across desktop and 390 px projects.

The installed browser test used a fresh Chromium profile and the packaged ZIP.
It exercised selection/current-line reading, repeat, follow, stop, all reading
settings, import/export, extension-local storage, and a shortcut changed from
`Alt+Shift+S` to `Alt+Shift+L` through Chromium's shortcut page. The VSIX was
unpacked into an isolated consumer harness and exercised its public commands,
settings, pronunciation transfer, local-voice policy, and network boundary.

## Independent live product exercise — PASS

A separate production browser flow used a locally marked speech voice and
representative code. It produced **“indent 1 level, subtotal plus gets price
semicolon”** for a selected indented line, passed the selected 1.5× rate to
speech, and applied `kubectl` → `cube control`. The repaired partial-indent cue
is therefore present in production.

The lower 0.5× rate boundary also reached speech. Empty/whitespace code returned
**“Nothing to read. Add code, select code, or place the cursor on a non-empty
line.”** A blank required pronunciation field remained focused with **“Please
fill out this field.”** Entering `fallback` → `fall back` recovered without a
reload and updated the spoken output. Stop retained the code. Reset restored
the original reader state and removed every `demo:` key.

With only a non-local voice exposed, production constructed and spoke no
utterance, kept the deterministic preview, and displayed the local-voice
recovery instruction.

## Accessibility, responsive behavior, and presentation — PASS

Independent live Axe scans covered `/`, `/demo/`, `/privacy/`, `/terms/`, and
an unknown route at 1440 px and 390 px. All ten scans returned zero violations,
including zero serious or critical findings. Every route had `lang="en"`, one
H1, one main landmark, image alternatives, labeled buttons, and no horizontal
overflow. The unknown route returned HTTP 404 and a designed page back home.

Keyboard traversal reached 20 interactive elements on the desktop demo and 18
on mobile without a trap. Every focused control had a designed 3 px outline;
the first Tab reached the skip link, and Enter opened the demo from the landing
page. Visible controls met the 44 px target baseline. At the 195 CSS px reflow
proxy for 200% zoom, all five checked routes had zero overflow or clipped main
content. Under reduced motion, scrolling was `auto` and the maximum computed
animation/transition duration was 0.01 ms.

`/opt/fleet/lib/verify-url.sh` passed the live root in 658 ms with title, lang,
one H1, main landmark, image alternatives, button names, and zero console/page
errors. The captured desktop and mobile screens matched the documented
botanical field-guide visual system.

## Privacy, service worker, and response policy — PASS

The cold landing and complete live demo exercise made only same-origin GET
requests. Editing, listening, pronunciation storage, invalid-input recovery,
Stop, and Reset made no non-GET or third-party request. Source code appeared in
neither product storage nor an outgoing request. No analytics, remote font,
payment, sign-in, or AI endpoint was present.

Production sends a same-origin CSP with `frame-ancestors 'none'`, HSTS,
`nosniff`, `strict-origin-when-cross-origin`, and disabled geolocation, camera,
and microphone policies. HTML uses 30-second revalidation and returned 304 for
its ETag. Hashed assets and images use one-year immutable caching; downloads use
one-day caching; `sw.js` uses `no-cache`.

The live service worker updated successfully, activated `/sw.js`, and exposed
only cache `code-listen-cursor-v7`. With the network disabled, `/demo/` reloaded
with HTTP 200, showed its offline notice, accepted edited sample code, generated
the correct preview, and invoked the local speech mock.

This is a static site plus local extension downloads. It has no server-side
product/unlock API, account, payment, AI, or authentication path. API
rate-limiting/429, backend concurrency, persistence, health identity, and Entra
checks are therefore not applicable.

## Performance, links, and deployment parity — PASS

Lighthouse 12.8.2 mobile results were **100 Performance, 100 Accessibility,
100 Best Practices, and 100 SEO**. FCP was 1.0 s, LCP 1.1 s, TBT 50 ms, CLS 0,
and total transfer was 50 KiB across seven requests.

Initial JavaScript is 8,302 bytes raw / 3,697 bytes gzip. Main CSS is 13,801
bytes raw / 3,777 bytes gzip. The mobile hero WebP is 38,244 bytes. These are
well inside the JavaScript, CSS, and image budgets. Every discovered internal
and GitHub link returned HTTP 200; the two downloads had the expected MIME
types.

Nineteen served candidate files—every HTML route, executable JS, CSS, image,
crawler file, and the service worker—matched production byte for byte. Root
HTML SHA-256 was
`0020645028a5865c3d07b0a2a00cd2c500235d2573613f27c8f4a9bf12c5daea`;
main JS SHA-256 was
`ea3278e1065bbec8bdbd5727d3b97de01a123a197ce69e8eb92c8fa51af8c0df`.
The live ZIP and VSIX had zero unpacked path or payload mismatches against the
fresh candidate build (15 browser entries and 9 VSIX entries). This proves the
live deployment matches the candidate despite archive timestamp metadata.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None. |
| High | None. |
| Medium | None. |
| Low | None. |

## Evidence and rerun

Local transient evidence is under `test-results/verification-14/` (factory URL
report, screenshots, and Lighthouse JSON). Rerun the complete repository gate
with:

```sh
npm ci
npm run check
```
