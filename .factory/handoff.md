# Code Listen Cursor — verification 12 handoff

Date: 2026-08-30
Candidate: `6aabc1612efa96e090207c3ac3537d5af1144419`
Live URL: <https://code-listen-cursor.sociobot.in/>
Result: **PASS — accepted for release.**

Independent clean-clone QA passed every one of the 16 exact claim commands,
lint, typecheck, all 19 Vitest tests, the production build, package and
extension smoke tests, the installed Chrome ZIP and VSIX consumer harnesses,
and the full desktop/390px Playwright suite. The live deployment matches the
candidate root HTML and landing JS byte-for-byte.

The cold first screen plainly explains the job, audience, and first action; its
one-click demo is isolated and resettable. Live functional checks covered local
voice speech, pronunciation, rate boundaries, blank-code recovery, invalid
pronunciation recovery, keyboard skip navigation, 390px layout, reduced motion,
same-origin requests, offline service-worker reload, console/page errors, Axe,
security headers, cache policy, and bundle budgets. No defects were found at
any severity.

Run locally:

```sh
npm ci
npm run check
# Also run each exact command in .factory/claims.json.
```

Build output is `dist/site`; extension packages are in `dist/site/downloads/`.
The complete evidence and one non-product tooling limitation (Lighthouse's
supplied Chromium crashed) are in [`.factory/verification-12.md`](verification-12.md).

Known product gaps: none.
