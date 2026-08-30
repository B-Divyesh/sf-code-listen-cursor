# Polish round 6 — cumulative finding closure

Repair commit: `8a64b94352d88a2461db4ebc8dccc04b76fb7c16`
Reviewed candidate: `34f6abfa3078b394c381728e36d64d8d70ef5bd2`
Deployment: `b88b9c97-b410-4c4a-85a5-409ef3f7a8ee`
Live URL: <https://code-listen-cursor.sociobot.in/>

Every finding in review rounds 1–6 and every earlier polish record was checked
again. The live audit is `test-results/live-polish-6/live-audit.json`; its
screenshots include `screenshot-desktop.png`, `screenshot-mobile.png`,
`live-demo-mobile.png`, and `live-demo-reset-mobile.png`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained H1 focus and polite route announcement for in-site navigation and Back. | `@regression:landing-privacy-navigation`; `live-audit.json`; live `/` → `/privacy/` → Back pass. |
| F-1-2 | Kept the descriptive “How the code reader works” section heading. | `@regression:review-1-copy`; `screenshot-desktop.png`; live `/` pass. |
| F-1-3 | Kept “Set pronunciations for project words.” | `@regression:review-1-copy`; `screenshot-desktop.png`; live `/` pass. |
| F-1-4 | Kept “Code stays on your device.” | `@regression:review-1-copy`; `screenshot-desktop.png`; live `/privacy/` pass. |
| F-1-5 | Retained the honest split: landing previews only and `/demo/` saves only in `demo:` storage. | `@claim:landing-preview-ephemeral`, `@claim:demo-sandbox`; `live-demo-reset-mobile.png`; live `/demo/` pass. |
| F-1-6 | Retained the two short README build sentences. | `@regression:review-1-copy`; clean-clone `npm test`; repository evidence. |
| V-9-1 | Retained the labelled, focusable, keyboard-scrollable spoken preview. | `@regression:spoken-preview-keyboard-scroll`; clean 44-case browser suite; live `/demo/` Axe pass. |
| F-2-1 | Retained the landing preview notice and reload-only behavior. | `@claim:landing-preview-ephemeral`; `live-audit.json`; live `/` pass. |
| F-2-2 | Retained the adjacent explanation of what the demo action opens. | `@regression:review-2-first-screen`; `screenshot-mobile.png`; live `/` pass. |
| F-2-3 | Retained “Spoken preview” as the panel heading and readiness as live status. | `@regression:review-2-copy`; `live-demo-mobile.png`; live `/demo/` pass. |
| F-2-4 | Retained README audience wording without an untested outcome claim. | `@regression:review-2-copy`; clean-clone `npm test`; repository evidence. |
| F-2-5 | Kept the untestable artwork-review-process wording absent. | `@regression:review-2-copy`, `@claim:generated-artwork-provenance`; `screenshot-desktop.png`; live `/` pass. |
| F-3-1 | Retained the compact phone demo where banner, sample, Listen, and output appear after one click. | `@regression:review-3-demo-first-screen`; `live-demo-mobile.png`; live `/demo/` pass. |
| F-3-2 | Retained the isolated demo selection/current-line local-speech claim. | `@claim:demo-reader`; clean-clone claim ledger; live `/demo/` pass. |
| F-3-3 | Retained Start-for-real clearing all `demo:` keys while preserving real data. | `@claim:demo-sandbox`; `live-audit.json`; live `/demo/` pass. |
| F-3-4 | Retained the shared version-1 local pronunciation export/import format in both packages. | `@claim:portable-pronunciations`; clean `npm run test:installed && npm run test:vscode-installed`; packaged-artifact evidence. |
| F-3-5 | Retained concrete symbols-and-indentation wording across public copy. | `@regression:review-3-closure`; `screenshot-desktop.png`; live `/` pass. |
| F-3-6 | Kept the unused “Fig. A” label absent. | `@regression:review-3-closure`; `screenshot-desktop.png`; live `/` pass. |
| F-3-7 | Kept the README heading “Use the code reader.” | `@regression:review-3-closure`; clean-clone `npm test`; repository evidence. |
| F-3-8 | Retained the shared header/footer and phone-visible product one-liner. | `@regression:review-3-footer-mobile`; `live-demo-mobile.png`; all live routes pass. |
| F-4-1 | Retained a real offline reload that edits sample code and speaks it locally. | `@claim:offline-reload`; live `offline` result in `live-audit.json`; live `/demo/` pass. |
| F-4-2 | Retained the Start-for-real clearing promise in the ledger and its sole claim test. | `@claim:demo-sandbox`; `live-audit.json`; live `/demo/` pass. |
| F-4-3 | Retained the ledger entry and reload test for ephemeral landing previews. | `@claim:landing-preview-ephemeral`; clean-clone ledger; live `/` pass. |
| F-4-4 | Retained plain README language for separate local packaged-extension data. | `@regression:review-4-closure`; clean-clone `npm test`; repository evidence. |
| F-4-5 | Retained “Both extensions” terminology. | `@regression:review-4-closure`; clean-clone `npm test`; repository evidence. |
| F-5-1 | Retained the exact “Download browser ZIP” action and direct ZIP target on every route. | `@regression:review-5-header-download-source`, `@regression:review-5-header-download`; live route audit pass. |
| F-6-1 | Reset now cancels speech, removes the listening class, restores shipped code and selection `(0,0)`, resets map/form/settings/rate, rebuilds the initial preview, clears error state, and clears only `demo:` data. The sandbox claim now proves the complete state transition. | strengthened `@claim:demo-sandbox`; `live-demo-reset-mobile.png`; live `/demo/` reset pass in `live-audit.json`. |
| F-6-2 | Renamed both reader controls to “Stop speech” and added source and browser regressions. | `@regression:review-6-stop-speech-source`, `@regression:review-6-stop-speech`; `live-demo-mobile.png`; live `/` and `/demo/` pass. |

## Verification

- Final clean clone at `86a67e489f763bf65bd10bd6fcbef0df34fa41f0`: `npm ci` installed 184 packages with zero reported vulnerabilities, then all 17 exact commands in `.factory/claims.json` exited 0. Log: `/tmp/code-listen-cursor-round6-final-claims.log`.
- Clean `npm run check` passed on retry: 22/22 Vitest tests, package and extension harnesses, and 44/44 Playwright desktop/mobile tests. The first aggregate pass encountered a Chromium process crash while closing the desktop focus test; that exact test passed on its own and the complete retry passed.
- Static deployment `b88b9c97-b410-4c4a-85a5-409ef3f7a8ee` succeeded. The production root verifier passed in 1,340 ms with no console/page errors.
- Live production audit: zero Axe violations across `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and a genuine 404 at desktop and 390 px; no overflow, one H1/main per route, working query demo entry, offline reader, and route focus/announcement.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 1.1 s, TBT 0 ms, CLS 0, 50 KiB transfer.
