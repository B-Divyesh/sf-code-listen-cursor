# Code Listen Cursor — review 4 handoff

Date: 2026-08-30

Candidate reviewed: `c711109c25cdbee37a4ec0338bb35d72c7d8fedf`

Live URL: <https://code-listen-cursor.sociobot.in/>

Result: **FAIL — two blocking, two major, and two minor findings.**

This was an independent review only; no product code was changed. The complete
findings and evidence are in [`.factory/review-4.md`](review-4.md).

## Verification performed

- Opened the live site cold in fresh 390 × 844 and 1440 × 900 Chromium
  contexts.
- Exercised demo speech, save, reset, exit, storage isolation, same-origin
  requests, and a real offline interaction with a mocked local voice.
- Crawled all public links and checked every route's status, metadata,
  headings, console, responsive overflow, route focus, and browser Back.
- Ran Axe on all five public documents at both widths; zero violations were
  reported.
- Ran `/opt/fleet/lib/verify-url.sh`; it passed with no console/page errors or
  basic accessibility defects.
- Created a clean clone at the candidate SHA, installed locked dependencies,
  and ran all 16 exact commands from `.factory/claims.json`; every command
  exited 0.
- Ran `npm run check` in that clone: 19/19 Vitest and 40/40 Playwright tests
  passed with all build and installed-package checks.
- Confirmed the live root HTML and landing JavaScript match the clean build by
  SHA-256.

## Work left

1. Reopen F-3-8: keep the footer product one-liner visible at 390 px and test
   it on every route.
2. F-4-1: make the offline claim test operate the reader and local speech after
   reload, rather than checking only the static H1.
3. F-4-2 and F-4-3: list the Start-for-real clearing promise and the temporary
   landing-preview promise in `.factory/claims.json` with exact tagged tests.
4. F-4-4 and F-4-5: replace “installed-package tests ... flows” and “settings
   surfaces” with the proposed plain wording.

The repository remains buildable. Run `npm ci && npm run check`, then execute
each command in `.factory/claims.json` separately after the repairs.
