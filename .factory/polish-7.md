# Polish round 7 — cumulative finding closure

Repair commit: `4bcca298570da225fe66e116d59a4950d9779667`
Reviewed release candidate: `bfc78b6fd12e83b7a28997fe9d6cd4111a3d33a4`
Review record: `049b35a56823187ebb0169bae498abbfe62ef60a`
Live URL: <https://code-listen-cursor.sociobot.in/>

All review and polish records were read. The clean-clone check ran every claim
command, and the deployed site was cold-checked again at desktop and 390 px.
Evidence screenshots are under `test-results/live-polish-7/`; every live URL
below refers to the production URL above.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept destination-H1 focus and polite route announcement for navigation and Back. | `@regression:landing-privacy-navigation`; live `/` → `/privacy/` → Back focused the H1s and announced both routes. |
| F-1-2 | Kept “How the code reader works.” | `@regression:review-1-copy`; live `/`, `screenshot-desktop.png`. |
| F-1-3 | Kept “Set pronunciations for project words.” | `@regression:review-1-copy`; live `/`, `screenshot-desktop.png`. |
| F-1-4 | Kept “Code stays on your device.” | `@regression:review-1-copy`; live `/privacy/`, zero-Axe route audit. |
| F-1-5 | Kept temporary landing preview and demo-only saved pronunciation. | `@claim:landing-preview-ephemeral`, `@claim:demo-sandbox`; live `/demo/` reset audit. |
| F-1-6 | Kept the short README build explanation. | `@regression:review-1-copy`; clean-clone `npm test`. |
| V-9-1 | Kept named, focusable, keyboard-scrollable spoken preview. | `@regression:spoken-preview-keyboard-scroll`; clean 44-case browser suite and live `/demo/` Axe audit. |
| F-2-1 | Kept landing preview's no-save notice and reload behavior. | `@claim:landing-preview-ephemeral`; live `/` and `/demo/` storage audit. |
| F-2-2 | Kept the first-screen helper that says what the demo opens. | `@regression:review-2-first-screen`; live `/` at 390 px, `screenshot-mobile.png`. |
| F-2-3 | Kept “Spoken preview” as the output heading and readiness as status text. | `@regression:review-2-copy`; live `/demo/` zero-Axe audit. |
| F-2-4 | Kept README audience wording without a health-outcome claim. | `@regression:review-2-copy`; clean-clone `npm test`. |
| F-2-5 | Kept unsupported artwork-review-process wording absent. | `@regression:review-2-copy`, `@claim:generated-artwork-provenance`; live `/` footer audit. |
| F-3-1 | Kept the compact phone demo with sample, Listen, and spoken output in its first viewport. | `@regression:review-3-demo-first-screen`; live `/?demo=1` at 390 px and `live-demo-partial-indent-mobile.png`. |
| F-3-2 | Kept the isolated demo selection/current-line local-speech test. | `@claim:demo-reader`; clean desktop/mobile test and live `/demo/` speech recheck. |
| F-3-3 | Kept Start for real clearing all `demo:` keys while preserving real keys. | `@claim:demo-sandbox`; live `/demo/` reset/exit audit. |
| F-3-4 | Kept the shared version-1 local pronunciation import/export format in both packages. | `@claim:portable-pronunciations`; clean `npm run test:installed && npm run test:vscode-installed`. |
| F-3-5 | Kept concrete symbols-and-indentation copy across product surfaces. | `@regression:review-3-closure`; live `/`, `screenshot-desktop.png`. |
| F-3-6 | Kept the unused “Fig. A” label absent. | `@regression:review-3-closure`; live `/`, `screenshot-desktop.png`. |
| F-3-7 | Kept the README heading “Use the code reader.” | `@regression:review-3-closure`; clean-clone `npm test`. |
| F-3-8 | Kept shared header/footer and the visible mobile product one-liner. | `@regression:review-3-footer-mobile`; live all five routes at 390 px. |
| F-4-1 | Kept the real offline reload that edits code, updates preview, and speaks locally. | `@claim:offline-reload`; live `/demo/` offline output and speech: `const offline Fern gets 3`. |
| F-4-2 | Kept Start-for-real clearing as a listed and tested demo-sandbox behavior. | `@claim:demo-sandbox`; live `/demo/` exit audit. |
| F-4-3 | Kept the listed and tested ephemeral landing-preview claim. | `@claim:landing-preview-ephemeral`; clean exact ledger command and live `/` check. |
| F-4-4 | Kept plain README language for separate local extension test data. | `@regression:review-4-closure`; clean-clone `npm test`. |
| F-4-5 | Kept “Both extensions” terminology. | `@regression:review-4-closure`; clean-clone `npm test`. |
| F-5-1 | Kept “Download browser ZIP” and the direct browser ZIP target on every route. | `@regression:review-5-header-download`; clean browser suite and live header route audit. |
| F-6-1 | Kept complete Reset demo behavior: speech cancellation, initial cursor/preview/settings, cleared demo data, and preserved real data. | `@claim:demo-sandbox`; live `/demo/`, `live-demo-reset-and-partial-indent-mobile.png`. |
| F-6-2 | Kept “Stop speech” on both reader controls. | `@regression:review-6-stop-speech`; clean browser suite and live `/demo/`. |
| LOW-1 / F-7-1 | Calculated `displayedLevel` once and used it for both the spoken number and grammar; added a one/two/three-space regression. | `@regression:partial-indentation-singular`; live `/?demo=1` output `indent 1 level, fern`, `live-demo-partial-indent-mobile.png`. |

## Final verification

- Fresh clone `/tmp/code-listen-cursor-round7.bNI9ls`: `npm ci --include=dev`,
  all 17 exact `.factory/claims.json` commands, and `npm run check` passed.
  The aggregate gate reports 23/23 Vitest and 44/44 Playwright tests.
- Build produced `dist/site/` with 3.02 kB gzip landing JavaScript and 3.77 kB
  gzip CSS.
- `/opt/fleet/lib/verify-url.sh` passed cold on live `/` in 836 ms; see
  `test-results/live-polish-7/verify.json`.
- Live Axe found zero violations on `/`, `/demo/`, `/privacy/`, `/terms/`, and
  `/404.html` at desktop and 390 px. Each had its route-specific title, one H1,
  main landmark, no horizontal overflow, and no console/page errors. An unknown
  production route returned the designed document with HTTP 404.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.8 s, LCP 1.1 s, CLS 0. See
  `test-results/live-polish-7/lighthouse-mobile.json`.

No finding remains unresolved.
