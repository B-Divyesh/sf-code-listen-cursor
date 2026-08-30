# Polish round 4 — cumulative finding closure

Repair commit: 10f6ea8b37210c606fe466f7ce24baa2bd73ed29
Reviewed candidate: c711109c25cdbee37a4ec0338bb35d72c7d8fedf
Deployment: a3cfec3d-9c7a-4944-831f-8257616f3fda
Live URL: <https://code-listen-cursor.sociobot.in/>

All review and earlier-polish findings were rechecked from a clean clone and
against the deployed site. The live audit is at
test-results/live-polish-4/live-audit.json; it has no failures, console errors,
Axe violations, phone overflow, or hidden footer one-liners.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained destination-H1 focus and polite route announcement, including Back navigation. | @regression:landing-privacy-navigation; live / → /privacy/ → Back records focused H1s and announcements in live-audit.json. |
| F-1-2 | Kept the informative section heading “How the code reader works.” | @regression:review-1-copy; live / Axe and screenshot live-home-mobile.png. |
| F-1-3 | Kept “Set pronunciations for project words.” | @regression:review-1-copy; clean-clone npm test. |
| F-1-4 | Kept “Code stays on your device.” | @regression:review-1-copy; live /privacy/ zero-violation scan. |
| F-1-5 | Retained the truthful action split: the landing previews and /demo/ saves only in demo: storage. | @claim:landing-preview-ephemeral, @claim:demo-sandbox; live demo storage evidence in live-audit.json. |
| F-1-6 | Kept the short, plain build instructions. | @regression:review-1-copy; clean-clone npm test. |
| V-9-1 | Retained the labelled, focusable, keyboard-scrollable spoken-preview region. | @regression:spoken-preview-keyboard-scroll; clean-clone 40-case browser suite. |
| F-2-1 | Retained the landing preview notice and reload-only behavior; added its public claim to the ledger. | @claim:landing-preview-ephemeral; live landing/demo storage check in live-audit.json. |
| F-2-2 | Kept the adjacent result text for the first-screen demo action. | @regression:review-2-first-screen; mobile screenshot live-home-mobile.png. |
| F-2-3 | Retained “Spoken preview” as the output heading and readiness as live status. | @regression:review-2-copy; live Axe audit. |
| F-2-4 | Kept the README audience statement without an untested health-outcome claim. | @regression:review-2-copy; clean-clone npm test. |
| F-2-5 | Kept untestable artwork-review-process wording absent. | @regression:review-2-copy and @claim:generated-artwork-provenance. |
| F-3-1 | Retained the compact 390px demo layout where editable code, Listen, and spoken output appear in the first post-click viewport. | @regression:review-3-demo-first-screen; live-_demo_-mobile.png. |
| F-3-2 | Retained the isolated /demo/ local-voice selection/current-line claim test. | @claim:demo-reader; clean-clone desktop and 390px runs pass. |
| F-3-3 | Moved the Start-for-real clearing/preservation assertions into the sole demo-sandbox claim test. | expanded @claim:demo-sandbox; live demo shows demo key null and real sentinel keep after exit. |
| F-3-4 | Retained shared version-1 local pronunciation export/import in both packaged extensions. | @claim:portable-pronunciations: clean npm run test:installed && npm run test:vscode-installed. |
| F-3-5 | Rewrote the first-screen headline to “Listen to selected code, symbols, and indentation” and retained concrete symbol/indentation wording elsewhere. | @regression:review-3-closure, @regression:review-4-closure; live / and live-home-mobile.png. |
| F-3-6 | Kept the unused “Fig. A” label absent. | @regression:review-3-closure; live / screenshot. |
| F-3-7 | Kept the README heading “Use the code reader.” | @regression:review-3-closure; clean-clone npm test. |
| F-3-8 | Removed both responsive rules that hid .product-line; every shared footer now wraps it visibly on phones. | new @regression:review-3-footer-mobile; live 390px audit of /, /demo/, /privacy/, /terms/, and /404.html, plus five mobile screenshots. |
| F-4-1 | Rebuilt the isolated offline claim: after a service-worker-controlled reload with networking disabled, it edits code, updates the preview, and calls a mocked local voice. Bumped the service-worker cache to v6 for the changed shell. | strengthened @claim:offline-reload; live offline result in live-audit.json is preview and voice call “const offline Fern gets 3”. |
| F-4-2 | Expanded the demo-sandbox claim text and its sole tagged test to cover Start-for-real clearing every demo: key while preserving real keys. | @claim:demo-sandbox; live ?demo=1 sandbox flow in live-audit.json. |
| F-4-3 | Added landing-preview-ephemeral to .factory/claims.json and retagged the existing reload/storage behavior test as its sole claim test. | @claim:landing-preview-ephemeral; clean-clone exact ledger command passes. |
| F-4-4 | Rewrote README test jargon as “Tests run both packaged extensions with separate local data.” | @regression:review-4-closure; clean-clone npm test. |
| F-4-5 | Rewrote README “settings surfaces” as “Both extensions.” | @regression:review-4-closure; clean-clone npm test. |

## Verification

- A fresh clone at 10f6ea8 ran npm ci --include=dev, every one of the 17 exact
  commands in .factory/claims.json (including repeated package commands), and
  npm run check; all passed. The aggregate gate reports 20/20 Vitest tests and
  40/40 Playwright desktop/mobile tests.
- The production build produces dist/site; first-party landing JavaScript is
  2.98 kB gzip and CSS is 3.77 kB gzip.
- Deployment a3cfec3d-9c7a-4944-831f-8257616f3fda completed to the production
  URL. /opt/fleet/lib/verify-url.sh recorded a 643 ms cold root load with no
  console or page errors; see test-results/live-polish-4/verify.json.
- The deployed live audit ran Axe through Playwright on five public documents
  at 1440px and 390px, then rechecked demo storage isolation, the ?demo=1
  redirect, Start for real, offline local speech, focused route headings, and
  the HTTP 404. Every check passed; see live-audit.json.
- Mobile Lighthouse against the live root scored 100 Performance, 100
  Accessibility, 100 Best Practices, and 100 SEO (FCP 0.8s, LCP 1.1s, CLS 0).
