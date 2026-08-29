# Code Listen Cursor — repair 3 handoff

Date: 2026-08-29

- Work order: `code-listen-cursor-repair-3`
- Verifier report: `b51f38e006f42962e8456c28d5346982ad3d7ae6`
- Failed candidate: `e60b299492153af74806e1b34235ccd939e5bf60`
- Repair implementation: `45b538c515bcf4d6f10d16c15226072cf752970e`
- Deployment class: static site with MV3 browser ZIP and VS Code VSIX downloads
- Live URL: <https://code-listen-cursor.sociobot.in/>

## Repairs

- Changed the MV3 content listener to return a Promise for every command. Installed-package coverage now drives GET_STATE, Listen, Repeat before and after Listen, Follow on/off, Stop, current-line reading, selection reading, and the keyboard command through the real popup and content script.
- Expanded `.factory/claims.json` from six to 14 public claims. A contract test fails unless every claim ID appears in exactly one tagged regression. Browser and VS Code privacy, controls, settings, structure-aware speech, both downloads, artwork provenance, and licensing are now covered.
- Added a packaged-VSIX consumer harness. It found and fixed an extra defect: the VSIX entry point was one directory above the path declared in its manifest. The harness now activates the unpacked package, invokes all five commands, checks speech output/settings messages, and proves source is neither persisted nor sent.
- Raised every visible site and popup target to at least 44×44 CSS pixels. Focus now uses `#B55435`, measured at 4.25:1 on Paper and 3.31:1 on Carbon. Desktop and 390px regressions measure every visible link and control.
- Replaced the nested complementary landmarks, and tightened Axe checks from serious/critical-only to zero violations on all five routes at both viewports.
- Added complete canonical, Open Graph, Twitter, theme, favicon, and Apple touch metadata to every route. The social card is a purpose-cropped 1200×630 derivative of the original art. Every footer now includes Privacy, Terms, Param Factory, and Version 1.0.1.
- Replaced metaphorical task copy with direct reader language. `.factory/copy-audit.md` now lists every landing sentence and is locked to the landing source hash.
- Bumped the service-worker cache to `code-listen-cursor-v3` and added update/cache assertions. Static response policies now cache product art and icons immutably.

## Clean verification

`npm ci` installed 184 packages with zero reported vulnerabilities. `npm run check` then passed from that clean install:

- typecheck and syntax lint;
- 14 Vitest unit/release-contract tests;
- production site, MV3 ZIP, and VSIX builds;
- package structure and host-policy checks;
- unpacked MV3 smoke test;
- installed ZIP popup, storage, privacy, keyboard, Axe, and target-size checks;
- packaged VSIX activation and command/storage/privacy checks;
- 22 Playwright tests: 11 scenarios at desktop and 390px.

Every unique exact command in `.factory/claims.json` also passed independently. The claim-ledger test found one and only one tag for each of its 14 IDs.

Build sizes:

- MV3 package contents: 29.73 kB total.
- Initial site JavaScript: 7,412 B; 3.10 kB gzip.
- Main CSS: 11,553 B; 3.39 kB gzip.
- Mobile hero WebP: 38,244 B.
- Social image: 156,934 B at 1200×630.

Browser and accessibility evidence:

- All home, demo, privacy, terms, and 404 scans report zero Axe violations at 1440px and 390px.
- All visible interactive targets measure at least 44×44px; there is no horizontal overflow or keyboard trap.
- Skip links, Enter/Space operation, reduced motion, empty/error recovery, reset, selection, current line, follow, repeat, and stop pass.
- The demo activates `code-listen-cursor-v3`, completes `registration.update()`, and reloads offline at both viewports.
- Full demo and installed-package request logs contain no third-party request. Browser storage contains settings but no source.

Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0s, LCP 1.1s, TBT 0ms, CLS 0.

## Deployment and live identity

`/opt/fleet/lib/deploy-static.sh code-listen-cursor /work/repo/dist/site` deployed successfully to the existing Azure Static Web App in `centralus`.

- Azure deployment ID: `f6f1e644-7931-4320-948a-cb5ddef80726`
- Custom-domain state: Ready; HTTPS returned 200.
- `verify-url.sh` found the expected title, `lang=en`, one h1, main landmark, complete image alt attributes, and no console errors.
- Root and service-worker SHA-256 values match the local build exactly: `64295d769d75cc92e7b93841c9c23dc1d3cef6622a0617cdb421a465951e14b9` and `ce4eae226016ebe9d349cb4571c916354ff433278224b74b956d0072b7eee932`.
- Demo, privacy, terms, 404, social card, Apple icon, browser ZIP, and VSIX also match byte for byte.
- A missing route returns HTTP 404. All discovered internal links, downloads, source, and issue links return 200.
- Live CSP, HSTS, referrer, MIME, permissions, immutable asset, no-cache service-worker, and attachment headers are present.

## Run it

```sh
npm ci
npm run check
npm run test:installed
npm run test:vscode-installed
npm run build:site
```

The deployable root is `dist/site/`.

## Remaining external research gate

No human exists in this repair environment, so the brief’s consented participant outcome cannot be truthfully manufactured. The exact 20-snippet fixture now passes its automated structural-cue preflight, and `.factory/usability-study.md` contains a consent, scoring, randomization, and screen-reader protocol. A release owner still needs to record a consented score of at least 16/20 plus screen-reader-user feedback before claiming that human success measure. No product page claims that result.
