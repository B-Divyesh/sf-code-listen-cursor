# Code Listen Cursor — review 3 handoff

Date: 2026-08-30

Work order: `code-listen-cursor-review-3`

Candidate reviewed: `8c1273d0c65c45b4831a112bfed9539754c40ebf`

Live URL: <https://code-listen-cursor.sociobot.in/>

Result: **FAIL**

The independent adversarial review is in
[`.factory/review-3.md`](review-3.md). No product code was changed.

## What was done

- Opened the live site cold in fresh 390 × 844 and 1440 × 900 Chromium
  contexts and recorded the first-screen content before scrolling.
- Exercised the one-click demo, sample output, pronunciation save, Reset demo,
  Start for real, local storage namespaces, offline behavior, request log, and
  route focus/Back behavior.
- Read the brief, design, claims ledger, both earlier reviews, both polish
  reports, the previous handoff, landing source, README, and relevant tests.
- Ran every exact `.factory/claims.json` command separately from a clean clone.
- Ran `npm run check` from that clone: 17/17 Vitest tests and 36/36 Playwright
  tests passed with all package and build gates.
- Crawled every discovered live link, checked 404 behavior and metadata, ran
  the live URL verifier, and ran Axe on all five public documents at desktop
  and 390 px. No Axe or console error was found.

## Known gaps

Eight findings remain. Two are blocking:

1. The mobile demo's precomputed spoken result is about 603 px below the first
   viewport, so the first post-click screen does not show the product result.
2. The `demo-reader` claim test opens the landing preview and never verifies an
   audible utterance, leaving the listed demo claim untested.

The other findings cover demo cleanup on **Start for real**, pronunciation-map
import/export, landing jargon, a decorative figure label, one vague README
heading, and inconsistent header/footer destinations.

## Reproduce

```sh
npm ci --include=dev
# Run each exact command in .factory/claims.json
npm run check
```

For the first-viewport failure, open `/demo/` at 390 × 844 without scrolling.
The editor begins around 793 px, its controls around 1,115 px, and the spoken
result around 1,447 px. For the lifecycle failure, save a demo pronunciation,
activate **Start for real**, and inspect local storage on `/`; the `demo:` key
remains.
