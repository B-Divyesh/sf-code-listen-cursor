# Polish round 1 — review finding closure

Candidate repaired: `7b4f565709102f3864270c67f608c75c0c1fb589`  
Review closed: `74893694c801ee6cf84d9f2ef11296f33a064aaf`  
Live URL: <https://code-listen-cursor.sociobot.in/>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added `site/route-focus.ts` to every public page. An in-site navigation or browser Back focuses the new route’s sole H1 without scrolling and sets a polite `#route-announcement`; cold visits retain Skip to main content as the first Tab target. | `@regression:landing-privacy-navigation` (desktop + 390px) asserts Privacy and Back focus plus announcement. Live Chromium check repeated both transitions; [privacy route screenshot](../test-results/live-polish-1/privacy-route-focus.png), live `/` → `/privacy/` → Back: pass. |
| F-1-2 | Replaced “Control at the scale of a line” with “How the code reader works.” | `@regression:review-1-copy`; [landing screenshot](../test-results/live-polish-1/home-mobile.png), live `/`: heading present. |
| F-1-3 | Replaced “Your own vocabulary” with “Set pronunciations for project words.” | `@regression:review-1-copy`; [landing screenshot](../test-results/live-polish-1/home-mobile.png), live `/`: heading present. |
| F-1-4 | Replaced “See how each version handles source.” with “Code stays on your device.” | `@regression:review-1-copy`; [landing screenshot](../test-results/live-polish-1/home-mobile.png), live `/`: heading present. |
| F-1-5 | Renamed both demo save controls to “Save sample pronunciation”; updated the isolated-demo claim and reader test selectors. | `@claim:demo-sandbox`, `@claim:demo-reader`, and `@regression:review-1-copy`; [demo screenshot](../test-results/live-polish-1/demo-mobile.png), live `/?demo=1`: banner, save, and reset pass. |
| F-1-6 | Split the README deployment sentence into two plain sentences and removed the unnecessary deployment jargon. | `@regression:review-1-copy` reads `README.md` and rejects the old sentence. Screenshot/live URL: not applicable because this is repository documentation; source check passed in the clean clone. |

## Cumulative acceptance re-check

The existing demo, claims ledger, routes, metadata, 404, legal links, mobile
reflow, local-voice refusal, privacy boundary, and package tests were retained
and rerun. A clean clone ran `npm ci`, every exact command in
`.factory/claims.json`, and `npm run check` successfully. The live browser
check found correct titles, one H1, one main, zero Axe violations on `/`,
`/demo/`, `/privacy/`, `/terms/`, and `/404.html`; it recorded only the product
origin and no console or page errors.
