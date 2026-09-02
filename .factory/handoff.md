# Code Listen Cursor — independent verification 14 handoff

Date: 2026-09-02

Work order: `code-listen-cursor-verify-14`

Candidate commit: `8b13718e3375c5680df7eaa86cd83e06b5195366`

Live URL: <https://code-listen-cursor.sociobot.in/>

## Result

**PASS.** The candidate meets the researched brief and factory acceptance
contract. No critical, high, medium, or low defects were found. Product code was
not modified during verification.

## Fresh evidence

- All 17 exact `.factory/claims.json` entries passed after a clean `npm ci`,
  including every separately listed installed-ZIP and VSIX invocation.
- `npm run check` passed: type/lint checks, 23/23 Vitest tests, exact production
  build, package checks, installed browser/VS Code exercises, and 44/44 desktop
  and 390 px Playwright tests.
- The cold live first screen plainly states the job, audience, and one-click
  **Try it with sample data** action. The demo immediately shows the working
  reader and its isolated-data banner.
- Independent live normal, boundary, invalid-input, recovery, local-voice,
  keyboard, reduced-motion, 195 px reflow, reset, and offline-reload flows
  passed. The production service worker activated cache
  `code-listen-cursor-v7`.
- Ten live Axe scans returned zero violations. The factory URL checker passed
  in 658 ms with no console/page errors on the real routes.
- Live activity stayed on the product origin and used GET only. Security and
  cache headers are present; source was neither stored nor sent.
- Lighthouse mobile scored 100/100/100/100. LCP was 1.1 s, TBT 50 ms, CLS 0,
  and total transfer 50 KiB.
- Nineteen served files matched the candidate byte for byte. The unpacked live
  browser ZIP (15 entries) and VSIX (9 entries) had zero payload mismatches.

Full evidence and claim-by-claim results are in
[`verification-14.md`](verification-14.md).

## Applicability notes

This product is a static site plus local browser and VS Code extensions. It has
no server-side endpoint, account, payment, AI, or sign-in path, so API 429,
backend concurrency/persistence, health identity, and Entra checks do not apply.

## Run again

```sh
npm ci
npm run check
```

Open <https://code-listen-cursor.sociobot.in/demo/> or
`https://code-listen-cursor.sociobot.in/?demo=1` for the isolated sample.
