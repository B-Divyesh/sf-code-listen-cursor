# Polish round 2 — cumulative finding closure

Repair commit: `f2331a2a84ab9ecb42e0ad86c23f32a72447247d`  
Base review commit: `4d3fccb4481ecb251fa007c78daf6c10d13d7bc4`  
Live URL: <https://code-listen-cursor.sociobot.in/>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained route focus: in-site navigation or Back focuses the sole destination H1 and announces it. | `@regression:landing-privacy-navigation`; live mobile focus evidence in `test-results/live-polish-2/round2-findings.json`. |
| F-1-2 | Kept “How the code reader works.” | `@regression:review-1-copy`; live root Axe scan. |
| F-1-3 | Kept “Set pronunciations for project words.” | `@regression:review-1-copy`; clean-clone `npm test`. |
| F-1-4 | Kept “Code stays on your device.” | `@regression:review-1-copy`; live root scan. |
| F-1-5 | Split the truthful actions: landing says “Preview sample pronunciation”; `/demo/` says “Save sample pronunciation.” | `@regression:review-2-landing-preview`; live storage evidence. |
| F-1-6 | Kept the README build text as two short sentences. | `@regression:review-1-copy`; clean-clone `npm test`. |
| V-9-1 | Retained the named, focusable scroll region and keyboard hint for spoken output. | `@regression:spoken-preview-keyboard-scroll`; 36-case browser suite and live Axe scan. |
| F-2-1 | Landing pronunciation changes now explicitly preview only, state that they are not saved, and say they last until reload. Demo persistence and Reset demo remain in the isolated `demo:` namespace. | `@regression:review-2-landing-preview`; live landing storage `null`, demo storage `{"fern":"frond"}`, and reset `null`. |
| F-2-2 | Added primary-action help: “Opens an editable reader with sample code and spoken output.” It stacks directly under the action on phones. | `@regression:review-2-first-screen`; [live mobile landing screenshot](../test-results/live-polish-2/landing-mobile-round2.png). |
| F-2-3 | Changed both reader-panel H3s to “Spoken preview” and moved “Ready to listen” into the polite status region. | `@regression:review-2-copy`; live root/demo Axe scans. |
| F-2-4 | Rewrote the README as an audience statement. | `@regression:review-2-copy`; live GitHub source check in `round2-findings.json`. |
| F-2-5 | Removed “reviewed before use”; the remaining provenance is covered by the generated-artwork claim. | `@regression:review-2-copy` and `@claim:generated-artwork-provenance`; live footer check. |

## Verification

- Fresh clone of `f2331a2`: `npm ci --include=dev`, every one of the 15 exact commands in `.factory/claims.json`, and `npm run check` passed.
- Full check: 17/17 Vitest tests, package and extension checks, installed ZIP and packaged VSIX harnesses, then 36/36 Playwright desktop/mobile cases.
- Static Web Apps deployment `c6447ca9-dbae-4669-a790-495c69eb2148` succeeded.
- `/opt/fleet/lib/verify-url.sh` passed on the live root: HTTP 200, 595 ms cold load, title, `lang=en`, one H1, one main, valid image alternatives, and no console/page errors.
- Live Axe scans at 1440 × 900 and 390 × 844 on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` had zero violations; see `test-results/live-polish-2/axe-routes.json`.
