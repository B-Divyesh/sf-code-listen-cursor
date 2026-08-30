# Polish round 5 — cumulative finding closure

Repair commit: `b4142b78a4ecc5813bff4f0162d07e8f432418be`  
Reviewed candidate: `0cc26493d2c29d65e4627353c85c979ff262725c`  
Deployment: `0065e0fc-7253-46bf-95de-7cfad8a5a4e4`  
Live URL: <https://code-listen-cursor.sociobot.in/>

Every finding from review rounds 1–5 was rechecked in the shipped source, a
clean clone, and production. The current repair changes the shared direct
download label from **Download** to **Download browser ZIP** on every public
route. It names the Chrome/Edge package before a visitor downloads it.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained destination-H1 focus and polite announcement for navigation and Back. | `@regression:landing-privacy-navigation`; live `/` → `/privacy/` → Back focus in `test-results/live-polish-5/live-audit.json`; `live-privacy_-desktop.png`. |
| F-1-2 | Retained “How the code reader works.” | `@regression:review-1-copy`; live root `live-home-desktop.png`. |
| F-1-3 | Retained “Set pronunciations for project words.” | `@regression:review-1-copy`; live root `live-home-desktop.png`. |
| F-1-4 | Retained “Code stays on your device.” | `@regression:review-1-copy`; live `/privacy/` `live-privacy_-desktop.png`. |
| F-1-5 | Retained the truthful split: landing previews only and `/demo/` saves only in `demo:` storage. | `@claim:landing-preview-ephemeral`, `@claim:demo-sandbox`; live demo storage evidence and `live-demo-interaction-mobile.png`. |
| F-1-6 | Retained the two short README build sentences. | `@regression:review-1-copy`; clean-clone `npm test`. |
| V-9-1 | Retained the labelled, focusable, keyboard-scrollable spoken preview. | `@regression:spoken-preview-keyboard-scroll`; clean-clone 42-case browser suite. |
| F-2-1 | Retained the landing preview’s no-save notice and reload behavior. | `@claim:landing-preview-ephemeral`; live root/demo storage audit. |
| F-2-2 | Retained the adjacent outcome text for the first-screen demo action. | `@regression:review-2-first-screen`; `live-home-mobile.png`. |
| F-2-3 | Retained “Spoken preview” as the reader panel heading and readiness as live status. | `@regression:review-2-copy`; live Axe result in `live-audit.json`. |
| F-2-4 | Retained the README audience statement without an untestable health-outcome promise. | `@regression:review-2-copy`; clean-clone `npm test`. |
| F-2-5 | Kept untestable artwork-review-process wording absent. | `@regression:review-2-copy`, `@claim:generated-artwork-provenance`; live root footer in `live-home-desktop.png`. |
| F-3-1 | Retained the compact phone demo: banner, sample code, Listen, and spoken output all fit after one click. | `@regression:review-3-demo-first-screen`; `live-demo_-mobile.png` and live demo audit. |
| F-3-2 | Retained the isolated demo selection/current-line speech test with a mocked local voice. | `@claim:demo-reader`; clean-clone browser suite and live `demo.speech` evidence. |
| F-3-3 | Retained Start-for-real clearing every `demo:` key while preserving real data. | `@claim:demo-sandbox`; live `demo.exit` evidence in `live-audit.json`. |
| F-3-4 | Retained version-1 local pronunciation export/import in both packages. | `@claim:portable-pronunciations`: clean `npm run test:installed && npm run test:vscode-installed`. |
| F-3-5 | Retained concrete symbols-and-indentation wording in the first screen and public copy. | `@regression:review-3-closure`, `@regression:review-4-closure`; live root in `live-home-mobile.png`. |
| F-3-6 | Kept the unused “Fig. A” label absent. | `@regression:review-3-closure`; live `live-home-desktop.png`. |
| F-3-7 | Retained the README heading “Use the code reader.” | `@regression:review-3-closure`; clean-clone `npm test`. |
| F-3-8 | Retained one shared header/footer and the phone-visible product one-liner. | `@regression:review-3-footer-mobile`; all-route live phone screenshots and Axe audit. |
| F-4-1 | Retained the offline reload that edits code, updates the preview, and calls a local voice. | `@claim:offline-reload`; live `offline.preview` and `offline.speech` in `live-audit.json`. |
| F-4-2 | Retained the expanded demo-sandbox ledger claim and its Start-for-real assertion. | `@claim:demo-sandbox`; live demo exit audit. |
| F-4-3 | Retained `landing-preview-ephemeral` in the claim ledger and its sole tagged test. | `@claim:landing-preview-ephemeral`; clean-clone exact ledger command. |
| F-4-4 | Retained plain README wording for separate local extension test data. | `@regression:review-4-closure`; clean-clone `npm test`. |
| F-4-5 | Retained “Both extensions” terminology in the README. | `@regression:review-4-closure`; clean-clone `npm test`. |
| F-5-1 | Changed every shared direct-download action to “Download browser ZIP”; it still targets and downloads `code-listen-cursor-chrome.zip`. Added source and browser regressions across `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`. | `@regression:review-5-header-download-source`, `@regression:review-5-header-download`; live route audit, `browser-zip-headers.txt`, and `live-home-desktop.png`. |

## Verification

- Fresh clone of `b4142b7`: `npm ci --include=dev`, then every one of the 17
  exact commands in `.factory/claims.json` separately. All completed with no
  failures, including repeated installed-ZIP and packaged-VSIX commands.
- Fresh-clone `npm run check` passed: 21/21 Vitest tests, package checks,
  browser and VS Code package harnesses, and 42/42 desktop/mobile Playwright
  cases. Its log is `/tmp/code-listen-cursor-clean-check.eR7IFE.log` for this
  work order.
- Production deployment `0065e0fc-7253-46bf-95de-7cfad8a5a4e4` succeeded.
  `/opt/fleet/lib/verify-url.sh` recorded a 695 ms cold root load with no
  console or page errors; evidence is `test-results/live-polish-5/verify.json`.
- The live browser audit found zero Axe violations on `/`, `/demo/`,
  `/privacy/`, `/terms/`, and `/404.html` at 1440 px and 390 px. It also
  rechecked the demo, offline speech, route focus/Back, all five desktop
  headers, and the HTTP 404; see `test-results/live-polish-5/live-audit.json`.
- The live root HTML SHA-256 matches `dist/site/index.html`. Mobile Lighthouse
  scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO
  (FCP 0.9 s, LCP 1.1 s, CLS 0); see
  `test-results/live-polish-5/lighthouse-mobile.json`.

No review finding remains open.
