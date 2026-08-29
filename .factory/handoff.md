# Code Listen Cursor — repair handoff

Date: 2026-08-29
Work order: `code-listen-cursor-repair-1`
Base verifier candidate: `50dd4bcf428381fb93112ee317676c8519dfac1b`
Deployment class: static landing site plus browser-extension artifacts

## Repairs made

- Added the required executable claims contract at `.factory/claims.json`. Each public privacy, local-voice, offline, demo-isolation, and free-download claim has one exact tagged test.
- Added `/demo/` and `/?demo=1` entry. The page has a persistent **Demo — sample data, nothing is saved** banner, Reset demo, Start for real, shipped code sample, and a separate `demo:code-listen-cursor:pronunciation` local-storage namespace. `.factory/demo.md` documents the boundary.
- Rewrote the first screen with the plain-language heading **Listen to code without losing your place** and the exact **Try it with sample data** action. `.factory/copy-audit.md` records the copy review.
- Preserved the WXT MV3 Chrome/Edge extension and added a native VS Code adapter. The build emits `code-listen-cursor-vscode.vsix`; it reads the active selection/current line through a local webview voice and supplies listen, repeat, follow, and stop commands.
- Removed the clean-checkout dependency on generated `.wxt/tsconfig.json`. Direct `npx tsc --noEmit` and `npm test` now work immediately after `npm ci`.
- Added `staticwebapp.config.json` and matching `_headers`: an effective CSP (including response-header `frame-ancestors`), immutable hashed assets, no-cache service worker, security headers, and a status-404 rewrite to a designed `404.html` page.
- Added regression coverage for every repaired product behavior, packaging both extension consumers, the static-host policy, desktop/mobile/keyboard/axe checks, demo isolation, network privacy, and offline reload.

## Verification evidence

From a fresh dependency install in this checkout:

```sh
npm ci
npx tsc --noEmit
npm test
npm run check
```

All passed. `npm run check` completed:

- 8 Vitest tests, including static policy and VS Code command regressions.
- Production build: browser MV3 total **29.13 kB**; site JS **7.42 kB** (**3.11 kB gzip**); site CSS **11.15 kB** (**3.31 kB gzip**).
- `npm run test:package`: browser ZIP and VSIX unzip cleanly; MV3 manifest, VS Code entry point, CSP, and status-404 configuration validated.
- `npm run test:extension`: Chromium loaded the unpacked MV3 extension and invoked speech.
- 18 Playwright checks across desktop and 390×844 mobile: demo/query route, keyboard path, no horizontal overflow, visible focus path, no console/page errors, live code-pronunciation behavior, legal pages, and designed 404 document.
- Axe Playwright scans at desktop and 390px: zero serious/critical violations on landing and demo.
- Offline regression: after first `/demo/` visit and service-worker control, network was disabled and a reload rendered the demo heading.
- Privacy regression: sample edit/listen traffic was recorded and every request stayed on the product origin.
- Lighthouse 13.4.1 against the built local `/demo/`: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.0 s**, LCP **1.0 s**, CLS **0**. The headless Chromium process exited after report generation, but Lighthouse wrote and parsed the complete result at `/tmp/code-listen-cursor-lighthouse.json`.

The build output for static deployment is `dist/site/`. It contains `/demo/`, `/privacy/`, `/terms/`, `404.html`, service worker, `staticwebapp.config.json`, the MV3 ZIP, and the VSIX.

## Deployment evidence

Commit `2ddf250` was pushed to `origin/main` and `dist/site/` was deployed to the production Static Web App. The custom domain <https://code-listen-cursor.sociobot.in> served the new deployment at 2026-08-29 14:29 UTC:

- `/demo/` returned 200 with the deployed demo document (4,193 bytes).
- `/no-such-route` returned the designed 404 document with HTTP **404** (1,184 bytes).
- `/downloads/code-listen-cursor-chrome.zip` returned 200, `Content-Disposition: attachment`, and `Cache-Control: public, max-age=86400`.
- `/sw.js` returned `Cache-Control: no-cache`.
- Every checked response included the deployed Content-Security-Policy and `frame-ancestors 'none'` response directive.
- The live browser ZIP SHA-256 exactly matched the local build: `8fda03fcbf23656f693c9a35a1dde32c31f9193f7b9ed86382fd601db999b299`.
- A hashed production JS asset returned `Cache-Control: public, max-age=31536000, immutable`.

## Known external evidence gap

The researched brief requires a consented 20-snippet study with screen-reader/auditory-workflow participants and a 16/20 comprehension result. A disposable no-human repair container cannot recruit or impersonate participants, so this has not been fabricated. `.factory/usability-study.md` documents the honest boundary and the existing deterministic coverage. Do not make the 16/20 human-comprehension claim until that study is conducted and recorded.

## Next steps

1. Conduct the consented participant study and record its method and result before treating the brief success measure as proven.
