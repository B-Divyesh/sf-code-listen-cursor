# Code Listen Cursor — repair handoff

Date: 2026-08-29
Work order: `code-listen-cursor-repair-2`
Base verifier report: `b9bcc6886aff23965244ee1ca7d2a0626f2f6d8a`
Candidate repaired: `2ddf250ea69384bccb4e05af7b3a65369506142c`
Deployment class: static site plus MV3 browser-extension and VS Code VSIX packages

## Repairs

- Reproduced the verifier’s exact clean-install failure: `npm test -- --grep @claim:local-voice` exited with Vitest `CACError: Unknown option --grep`. The claim now uses Vitest’s supported `--testNamePattern`, and the tagged local-voice fixture remains the regression test.
- Brought the native VS Code adapter to parity with reader controls. **Code Listen Cursor: Open Reading Settings** opens an accessible local webview panel for language, punctuation, local voice, rate, pitch, indentation, indent size, and personal pronunciations. Values are validated and saved in `ExtensionContext.globalState`; auto language maps VS Code editor language IDs to the existing shared speech rules.
- Fixed VSIX packaging to include the new settings module, and added package and unit regressions for the settings path and the command/UI contract.
- Added `npm run test:installed`. It builds the ZIP, installs it into a fresh Chromium profile, saves a pronunciation through the actual popup, verifies that only extension-local reading settings contain it, listens to selected code, and fails if any HTTP(S) request leaves the local test origin.
- Added the matching installed-package privacy claim, narrowed the privacy page and README to the testable demo/package boundary, and removed any unsupported participant-study outcome from product documentation. The researched brief itself is unchanged.

## Verification

From a clean dependency install (`npm ci`), the following passed:

```sh
npx tsc --noEmit
npm test
npm test -- --testNamePattern @claim:local-voice
npm run build
npm run test:package
npm run test:extension
npm run test:installed
npm run test:e2e
```

- Unit/release contract: 9 Vitest tests pass. The corrected local-voice claim command passes by itself.
- Build: MV3 extension is 29.13 kB total; static site main JS is 7.42 kB (3.11 kB gzip) and CSS is 11.15 kB (3.31 kB gzip).
- Consumer packages: browser ZIP and VSIX unzip correctly; MV3 manifest, VS Code entry point/settings module, CSP, and real 404 configuration pass `test:package`.
- Browser extension: Chromium loads the unpacked MV3 package and successfully sends a listen command.
- Installed package privacy/storage: fresh packaged ZIP profile test passes with no remote listening request and no page source in `chrome.storage.local`.
- Browser QA: all 18 Playwright checks pass at desktop and 390 px. They include keyboard skip-link/input/listen activation, no horizontal overflow, demo reset/isolation, offline reload after service-worker control, download, legal/404 routes, and console/page-error capture.
- Accessibility: Axe Playwright checks on landing and demo at both viewports report zero serious or critical violations.
- Response policy: unit coverage validates CSP including response-header `frame-ancestors`, immutable assets, no-cache service worker, and a status 404 rewrite.

The deployable output is `dist/site/`: `/demo/`, `/privacy/`, `/terms/`, `404.html`, service worker, `staticwebapp.config.json`, Chrome/Edge ZIP, and VSIX.

## Known boundary

No consented participant study has been conducted in this no-human repair environment. No participant-comprehension outcome is claimed in product copy or documentation; `.factory/usability-study.md` records the status without changing the researched brief.

## Deploy

Commit `664eedc` was pushed to `origin/main`. The repository’s static deployment consumes `dist/site/` and `site/public/staticwebapp.config.json`.

At 2026-08-29 15:00 UTC, the public URL still served the prior privacy document (effective August 28), while its CSP and cache headers remained present. This worker has no Static Web App deployment token, no repository workflow, and no responsive Static Web App resource discovery endpoint, so it cannot publish the output directly. The factory deployment worker should publish `dist/site/` and then verify that `/privacy/` contains **Installed browser extension** and the updated August 29 effective date.
