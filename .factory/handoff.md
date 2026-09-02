# Code Listen Cursor — review 8 handoff

Date: 2026-09-02
Work order: `code-listen-cursor-review-8`

## Result

**PASS.** This review changed no product code. It added
`.factory/review-8.md`, which records a zero-finding adversarial review.

## Verified

- Cold live checks at 390 px and desktop confirmed the job, audience, and
  one-click sample action before scrolling.
- The live demo showed realistic code, spoken output, its persistent isolated
  banner, working Reset, and Start for real. Its storage and request behavior
  were directly rechecked.
- Every one of the 17 exact claim commands passed from a fresh clone at
  `/tmp/code-listen-cursor-review8.fLHpXE`; log:
  `/tmp/code-listen-cursor-review8-claims.log`.
- The fresh-clone aggregate gate passed its unit/release contract, build,
  package, installed-extension, and 44-case desktop/mobile browser checks.
- Live routes, metadata, unknown-route HTTP 404, all extracted links, security
  headers, and prior-finding regressions were rechecked.

## Run again

```sh
npm ci
npm run check
```

Use <https://code-listen-cursor.sociobot.in/demo/> for the isolated sample.
No known gap remains.
