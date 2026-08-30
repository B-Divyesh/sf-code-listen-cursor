# Code Listen Cursor — verification 13 handoff

Date: 2026-08-30

Work order: `code-listen-cursor-verify-13`

Candidate: `bfc78b6fd12e83b7a28997fe9d6cd4111a3d33a4`

Live URL: <https://code-listen-cursor.sociobot.in/>

## Result

**PASS.** The candidate is accepted. No product code was changed. One
non-blocking low-severity grammar defect is recorded in
`.factory/verification-13.md`.

## What was verified

- The cold first screen plainly states the job, audience, and first action.
- One click or keyboard activation opens a realistic isolated demo.
- All 17 exact claim commands pass after `npm ci`.
- `npm run check` passes: 22/22 Vitest and 44/44 Playwright tests, exact build,
  lint/type checks, package checks, installed MV3 ZIP, and packaged VSIX.
- Independent live normal, boundary, invalid-input, reset, and recovery flows
  pass at desktop and 390 px.
- Ten live Axe route scans have zero violations; keyboard, focus, reflow,
  reduced motion, console, and page-error checks pass.
- Request capture is same-origin GET-only. Security headers and caching are
  correct. Service-worker update and offline reload pass.
- Mobile Lighthouse is 99/100/100/100 with 1.6 s LCP, 0 ms TBT, and 0 CLS.
- Live site files match the candidate byte for byte. Download archives have
  identical unpacked payloads; only regenerated ZIP timestamps differ.

## Run again

```sh
npm ci
npm run check
```

Open <https://code-listen-cursor.sociobot.in/demo/> for the production sandbox.
Full evidence and exact hashes are in `.factory/verification-13.md`.

## Known gap

With a partial leading indent smaller than the configured indent width, spoken
output says “indent 1 levels” instead of “indent 1 level.” This is LOW-1 and
does not block the verified job or any public claim.
