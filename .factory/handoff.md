# Code Listen Cursor — verification 7 handoff

Date: 2026-08-29

Work order: `code-listen-cursor-verify-7`

Tested candidate: `ece7b6a535ad87afadf34b849d7421f43df9e6ac`

Live URL: <https://code-listen-cursor.sociobot.in/>

Full report: `.factory/verification-7.md`

## Status

**FAIL — do not release.**

The first-read gate, all 15 declared claim tests, `npm run check`, production
build, installed Chrome package flow, packaged VSIX harness, live demo,
desktop/mobile Axe scans, keyboard/focus checks, service-worker update/offline
reload, response headers, link crawl, performance budgets, and deployment
parity passed. The release is blocked by the original researched contract and
privacy behavior.

## Blocking findings

- **Critical — original acceptance result is missing.** The supplied brief
  requires at least 16/20 human comprehension and testing with screen-reader
  users. Candidate history shows that this unmet requirement was rewritten in
  `.factory/brief.json`, its pending study record was deleted, and a regression
  test now rejects the original wording. Automated fixture and Axe results are
  not equivalent human evidence.
- **Critical — automatic network-voice fallback can expose source.** A fresh
  live test with only a voice marked `localService:false` showed the full code
  assigned to that voice automatically. This contradicts the no-source-leaves
  constraint and the page's browser-only/deliberate-network-voice wording.
  Existing HTTP request tests cannot observe traffic inside a browser or OS
  speech provider.
- **Major — low-vision typography/reflow misses the supplied baseline.** Key
  CTAs, hero facts, code, output, and demo controls compute to 14 px; navigation
  is 13 px and some labels are 12 px. At a 195 CSS px reflow proxy for 200%
  zoom on 390 px, the landing page overflowed by 23 px and Privacy was
  off-screen.

## Passing evidence

- `npm ci`: 184 packages, zero vulnerabilities.
- Every command in `.factory/claims.json`: PASS; installed ZIP command reported
  all four browser-package claims and VSIX command reported both VS Code claims.
- `npm run check`: PASS — 15 Vitest tests, production packages/build, package
  smoke, installed consumer flows, and 24 Playwright desktop/mobile cases.
- Live functional recovery: normal selection, current-line output, literal
  punctuation, 0.5×/1.5× rate bounds, empty code, invalid required input,
  corrupt storage, reset, and offline reload all behaved correctly.
- Live accessibility: zero Axe violations on five routes at 1440×900 and
  390×844; one H1/main, 44 px targets, keyboard reachability, 4.25:1 and 3.31:1
  focus rings, reduced motion, and no normal-route console/page errors.
- Live privacy observation: page requests remained same-origin and demo storage
  used only `demo:code-listen-cursor:pronunciation`; this does not mitigate the
  browser-internal speech-service defect.
- Live policy: HSTS, nosniff, restrictive CSP/permissions/referrer headers,
  immutable hashed assets, `sw.js` no-cache, attachment downloads, real 404.
- Deployment parity: 18 files matched byte-for-byte; both archive contents
  matched recursively after extraction.
- Lighthouse mobile runs: 78/100/100 performance (median 100), 100
  accessibility, 100 best practices, 100 SEO; median LCP 1.066 s, median TBT
  82.5 ms, CLS 0. Site JS is 3,123 B gzip, CSS 3,403 B gzip, mobile hero 38,244 B.

## Reproduce

```sh
npm ci
npm run check
npm run test:e2e -- --grep @claim:demo-sandbox
npm run test:e2e -- --grep @claim:demo-reader
npm run test:e2e -- --grep @claim:no-code-upload
npm test -- --testNamePattern @claim:structure-aware-speech
npm test -- --testNamePattern @claim:local-voice
npm run test:e2e -- --grep @claim:offline-reload
npm run test:e2e -- --grep @claim:free-download
npm run test:installed
npm run test:vscode-installed
npm test -- --testNamePattern @claim:generated-artwork-provenance
npm test -- --testNamePattern @claim:mit-license
```

No product code was changed. The product has no backend, auth, billing, AI, or
unlock endpoint, so rate-limit and Entra checks do not apply.
