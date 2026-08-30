# Independent verification 11 — PASS

Date: 2026-08-30
Work order: `code-listen-cursor-verify-11`
Candidate commit: `1701285307ab74acf264ecd8d48485df657e7721`
Live URL: <https://code-listen-cursor.sociobot.in/>
Verdict: **PASS — release candidate accepted.**

This was a fresh verification of the candidate and live deployment. No product
code was modified.

## First-read and demo gate — PASS

I opened the live root cold in a new 1440×900 Chromium context. The first screen
says **“Listen to code without losing your place,”** names **developers who read
better by ear**, and explains that it reads a selection or current line as
spoken structure. The primary action is **“Try it with sample data,”** followed
by **“Opens an editable reader with sample code and spoken output.”** One click
opens `/demo/`, already populated with realistic JavaScript and showing the
persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and
**Start for real**. The same required copy and action fit in the first 390×844
mobile viewport. The mandatory first-read and one-click-demo gate passes.

## Required claims — PASS

The checkout began clean and exactly at the candidate commit.
`.factory/claims.json` exists with 15 entries. `npm ci` installed 184 packages
and reported zero vulnerabilities. I ran every listed test entry exactly as
recorded, including each repeated installed-package command. Every invocation
exited zero.

| Claim ID | Exact command | Fresh result |
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

The landing page, legal pages, README, and package descriptions were
cross-checked against the claim ledger. No unlisted material product promise
was found.

## Clean local gates and packaged consumers — PASS

`npm run check` passed end to end:

- TypeScript/typecheck, lint, and JavaScript syntax checks passed.
- Vitest passed 17/17 unit and release-contract tests.
- The exact production build produced `dist/site`, the Chrome ZIP, and VSIX.
- Package/CSP/404 policy checks and the unpacked extension smoke passed.
- The installed Chrome ZIP and packaged VSIX integration harnesses passed.
- Playwright passed 36/36 cases across desktop and 390px, including 195px
  reflow, keyboard scrolling, touch targets, focus contrast, and Axe.

As a separate consumer check, I downloaded the live VSIX and installed it into
clean `--user-data-dir` and `--extensions-dir` directories with the official
VS Code 1.135.0 Linux client. Installation exited zero with **“Extension
'live.vsix' was successfully installed”**, and `--list-extensions
--show-versions` returned `param-factory.code-listen-cursor@1.0.3`.

## Independent live functional QA — PASS

The live demo completed the smallest useful flow under a controlled voice
marked local:

- Saving `kubectl → cube control`, selecting `kubectl`, and listening produced
  exactly `cube control` at rate 0.9.
- Moving to the indented line `total += price;` with literal punctuation
  produced `indent 1 level, total plus gets price semicolon`.
- Reading-rate boundaries displayed 0.5× and 1.5×.
- Submitting blank pronunciation fields focused `demo-written` and exposed
  the native **“Please fill out this field.”** recovery message.
- Blank code produced **“Nothing to read. Add code, select code, or place the
  cursor on a non-empty line.”** Adding `const fern = 3;` restored the spoken
  output `const fern gets 3 semicolon`.
- Demo storage contained only
  `demo:code-listen-cursor:pronunciation`; **Reset demo** removed it.

The installed browser harness independently exercised listen, current line,
follow, repeat, stop, shortcut reconfiguration, all reading settings, storage,
and request privacy. The packaged VS Code harness activated all five commands,
exercised selection/current-line/follow/repeat/stop/settings, and blocked a
non-local voice without constructing an utterance.

## Accessibility, responsive layout, and visual QA — PASS

The supplied `verify-url.sh` passed the live root: HTTP 200, 855 ms load,
correct title and `lang=en`, one H1, a main landmark, no missing image alt, no
unlabelled button, and no console/page error.

Independent live Axe WCAG A/AA/2.1 AA scans of `/`, `/demo/`, `/privacy/`,
`/terms/`, and `/404.html` at both 1440×900 and 390×844 found zero violations,
including zero serious/critical findings. Keyboard checks found the skip link
first, Enter opened the demo, and the primary action had a visible 3px
`rgb(181, 84, 53)` focus ring. At 390px there was no horizontal overflow and no
visible interactive target under 44px.

With long spoken output at 390px, the preview measured 188px high with 450px of
scroll content, had `tabIndex=0`, accepted focus, and Page Down moved its scroll
position from 0 to 30. The 195px/200%-reflow regression also passed. Reduced
motion computed animation and transition durations to `0.00001s`. Desktop and
mobile screenshots were visually inspected; content remained legible and the
primary state/action hierarchy was clear.

## Privacy, offline behavior, routes, and headers — PASS

The full live edit/listen/save/reset flow requested only same-origin documents,
hashed JS/CSS, and product images. It made no cross-origin request and produced
no console or page error. Source inspection found no analytics, telemetry,
remote model, raw Azure key, runtime third-party font/script, sign-in, payment,
or product API.

The live service worker controlled `/demo/` from `/sw.js`; an update check
reported `active: activated`, no waiting worker, and cache
`code-listen-cursor-v5`. With the context offline, reloading `/demo/` returned
HTTP 200 with the sample heading and demo banner.

Root, demo, privacy, terms, downloads, `robots.txt`, and `sitemap.xml` returned
200. Every discovered internal fragment existed, and every internal/external
link returned 200. A genuinely unknown route returned 404 with the designed
404 body.

Responses include a restrictive CSP (`connect-src 'self'`, `frame-ancestors
'none'`), HSTS, `nosniff`, strict-origin referrer policy, and disabled camera,
microphone, and geolocation. HTML revalidates after 30 seconds, hashed JS/CSS
use one-year immutable caching, downloads cache for one day, and `sw.js` uses
`no-cache`.

This is a static, local-first extension with no server-side endpoint,
product-unlock call, account, payment, sign-in, server persistence, or health
endpoint. API concurrency, persistence, rate allowance/429/`Retry-After`, build
identity, billing, and Entra authority checks do not apply.

## Performance and deployment parity — PASS

Lighthouse 12.8.2 mobile scored Performance 99, Accessibility 100, Best
Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.1 s, TBT 140 ms, CLS 0, and
total transfer 50 KiB.

Fresh production assets remain far below the supplied budgets: 8,051 bytes raw
JavaScript across the two landing modules (about 3.55 KiB gzip), 13,017 bytes
raw main CSS (3.68 KiB gzip), no downloaded fonts, and a 38,244-byte mobile
WebP hero. The MV3 extension is 30.27 kB unpacked.

Fresh local bytes matched live for root, demo, privacy, terms, designed 404,
both hashed JS modules, both CSS files, service worker, hero assets, social
image, robots, and sitemap. ZIP/VSIX outer bytes vary with archive timestamps,
but every extracted browser-extension and VS Code file matched. The live
executable content therefore matches candidate
`1701285307ab74acf264ecd8d48485df657e7721`.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None found. |
| High | None found. |
| Medium | None found. |
| Low | None found. |
