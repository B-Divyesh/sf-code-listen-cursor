# Polish round 3 — cumulative finding closure

Reviewed base: `98d345c56215c3952439458d821396c0049c3b37`
Product repairs: `eeded67e6f0060737620445406a57c4b71d23f73`,
`882f714016014e4250aef2547dafc166ef6cea92`
Live URL: <https://code-listen-cursor.sociobot.in/>

Every finding from review rounds 1–3 was checked again. “Retained” means the
previous fix remains in the shipped product and was retested in this round.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained route focus and polite announcement on every route. Header navigation and browser Back focus the destination H1. | `@regression:landing-privacy-navigation`; live `/` → `/privacy/` → Back in `test-results/live-polish-3/route-focus-live.json` and `route-focus-live.png`. |
| F-1-2 | Retained the plain section heading “How the code reader works.” | `@regression:review-1-copy`; live `/` check in `live-audit.json`. |
| F-1-3 | Retained “Set pronunciations for project words.” | `@regression:review-1-copy`; clean-clone `npm test`. |
| F-1-4 | Retained “Code stays on your device”; also rewrote the Privacy metadata to state the local behavior directly. | `@regression:review-1-copy`; live `/privacy/` metadata scan in `live-audit.json`. |
| F-1-5 | Retained the truthful split: landing previews a pronunciation and `/demo/` saves it in `demo:` storage. | `@regression:review-2-landing-preview`, `@claim:demo-sandbox`; live `/demo/` storage check in `live-audit.json`. |
| F-1-6 | Retained the short README build instructions. | `@regression:review-1-copy`; clean-clone `npm test`. |
| V-9-1 | Retained the labelled, focusable spoken-preview scroll region and keyboard hint. | `@regression:spoken-preview-keyboard-scroll`; full `npm run test:e2e` (40 cases). |
| F-2-1 | Retained the non-persistent landing preview label and its reload notice. | `@regression:review-2-landing-preview`; live landing storage is empty in `live-audit.json`. |
| F-2-2 | Retained the adjacent demo-action outcome text. | `@regression:review-2-first-screen`; live mobile screenshot `demo-mobile-cold.png`. |
| F-2-3 | Retained “Spoken preview” as the reader-panel heading and moved readiness into a live status. | `@regression:review-2-copy`; live Axe result in `live-audit.json`. |
| F-2-4 | Retained the README audience wording without an unsupported outcome claim. | `@regression:review-2-copy`; clean-clone `npm test`. |
| F-2-5 | Retained provenance wording that omits the untestable review-process claim. | `@regression:review-2-copy`, `@claim:generated-artwork-provenance`. |
| F-3-1 | Reworked `/demo/` for 390 px: a compact banner, shorter sample, and compact reader place editable code, Listen, and spoken output in the first viewport after one click. | `@regression:review-3-demo-first-screen`; live `demo-mobile-cold.png` shows banner 69–193 px, editor 358–462 px, Listen 470–514 px, and output 702–781 px. |
| F-3-2 | Replaced the landing-only demo-reader test with an isolated `/demo/` context and local speech mock. It saves `kubectl` → `cube control`, asserts the selection utterance, then asserts the current-line utterance. | `@claim:demo-reader` (desktop and mobile); live `/demo/` check records `selectionSpeech: ["cube control"]` in `live-audit.json`. |
| F-3-3 | `Start for real` now clears every `demo:` key before opening the install section. Demo defaults are held separately from user demo storage. | `@regression:review-3-demo-leave`; live `/demo/` → Start for real gives `demo: null`, while a non-demo sentinel remains, in `live-audit.json`. |
| F-3-4 | Added a shared version-1 JSON pronunciation format plus local Export, validated preview, and explicit Apply controls in both the browser popup and VS Code settings. Export excludes source code. | `@claim:portable-pronunciations`: `npm run test:installed && npm run test:vscode-installed`; packaged ZIP/VSIX harnesses export, preview, apply, and persist the same fixture. |
| F-3-5 | Replaced the unclear promise with named symbols and indentation in the hero, feature, footer, catalog description, VS Code description, and privacy metadata. | `@regression:review-3-closure`; `.factory/copy-audit.md`; live `/` and `/privacy/` metadata checks. |
| F-3-6 | Removed the unreferenced “Fig. A” label and kept the useful illustration caption. | `@regression:review-3-closure`; live `/` screenshot in `screenshot-desktop.png`. |
| F-3-7 | Renamed the README section to “Use the code reader.” | `@regression:review-3-closure`; clean-clone `npm test`. |
| F-3-8 | Applied the same four-link header and the same footer one-liner, Privacy, Terms, Source, factory credit, and version to `/`, `/demo/`, legal routes, and 404. | `@regression:review-3-closure`; live all-route audit in `live-audit.json`. |

## Live re-check

After deployment to `sf-code-listen-cursor` production, a cold Chromium audit
checked `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at 1280 px and
390 px. Each route returned 200, had its own title, description, canonical,
one H1, and main landmark; Axe returned no violations and the console had no
errors. An unknown live route returned the designed document with HTTP 404;
its response headers are in `test-results/live-polish-3/unknown-headers.txt`.

The root verifier passed at 774 ms with no missing image alternative or
unlabelled button. Evidence is in `test-results/live-polish-3/verify.json`,
`live-audit.json`, `demo-mobile-cold.png`, and `route-focus-live.png`.
