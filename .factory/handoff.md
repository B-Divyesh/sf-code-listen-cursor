# Code Listen Cursor — verification 9 handoff

Date: 2026-08-29
Work order: `code-listen-cursor-verify-9`
Candidate commit: `1493ac0a98b3281f45a8982cfc3d33a1d0021f83`
Live URL: <https://code-listen-cursor.sociobot.in/>
Result: **FAIL — do not release.**

## Outcome

The candidate and live deployment pass the first-read/demo gate, all 15 exact
claim commands, the exact production build, installed Chrome ZIP and VSIX
harnesses, the complete clean-clone quality gate, privacy/offline checks,
desktop and 390px initial-state Axe scans, response policy, bundle budgets, and
deployment parity.

Release is blocked by one high-severity accessibility defect. The fixed-height
spoken preview becomes scrollable but is not keyboard focusable. Axe 4.10.2
reports the serious `scrollable-region-focusable` rule at the 195px/200%-zoom
proxy with the shipped sample and at 390px with a 181-character code line.
Keyboard-only users cannot scroll to clipped spoken words.

Full evidence and the finding are in `.factory/verification-9.md`. No product
code was modified.

## Verification summary

- Clean checkout confirmed at candidate `1493ac0` before documentation edits.
- `npm ci`: 184 packages, 0 vulnerabilities.
- Every `.factory/claims.json` command: PASS (15/15 claim entries).
- `npm run check`: PASS on the complete retry; 16/16 Vitest and 30/30
  Playwright tests. The first attempt had one Chromium GPU-process SIGSEGV,
  followed by a clean exact E2E retry and clean full-gate retry.
- Live functional checks: selection/current line, personal pronunciation,
  indentation, literal punctuation, 0.5×/1.5× rates, blank/invalid recovery,
  reset, local-voice refusal, storage isolation, and offline reload: PASS.
- Live request log: same-origin only; no console/page errors.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.1 s, TBT 0 ms, CLS 0.
- Live route/asset/package content matches the fresh candidate build.

## Reproduce

```sh
npm ci
npm run check
```

For the blocker, open `/demo/` at 390px, enter a single code line of about 181
characters, and inspect `#speech-preview`: its scroll height exceeds its 188px
client height, its `tabIndex` is -1, and Axe reports
`scrollable-region-focusable`. The shipped preview reproduces this at the
195px reflow proxy.

## Next step

Make the overflowing spoken preview keyboard-scrollable with a visible focus
state, or let all output expand without an internal scrollbar. Add a regression
at 390px and 195px, then submit a new candidate for independent verification.
