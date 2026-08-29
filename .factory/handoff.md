# Review 2 handoff — Code Listen Cursor

Date: 2026-08-29
Work order: `code-listen-cursor-review-2`
Reviewed commit: `bd80e8204701efe573c0fdcb8e798ac78dd53524`

## Outcome

No product code was changed. The adversarial review is recorded in
`.factory/review-2.md` and the result is **FAIL** with five findings:

- F-2-1: the landing preview says it saves a pronunciation but it only retains
  it in memory until reload.
- F-2-2: the hero does not state what the primary demo action opens.
- F-2-3: “Ready to listen” is not a self-describing reader-panel heading.
- F-2-4: README claims support for named access needs without a claims-ledger
  entry.
- F-2-5: the footer says artwork was reviewed without evidence in the claims
  ledger.

## Verification performed

- Cold live Chromium checks at 390 × 844 and 1440 × 900.
- One-click live demo, demo-storage namespace/reset, request-origin log, and
  route focus/Back behavior.
- Fresh local clone with `npm ci --include=dev`; every exact claims-ledger
  command passed. The full Playwright suite passed 32/32, and `npm run lint`,
  `npm run test:package`, installed-ZIP, and packaged-VSIX checks passed.
- Public routes, 404, metadata, sitemap/robots, all internal downloads, and
  GitHub links returned expected statuses.
- Earlier review/polish/handoff findings were reconfirmed against live output
  and current source; their repairs remain in place.

## Reproduce

```sh
npm ci --include=dev
npm run test:e2e
npm run test:installed
npm run test:vscode-installed
npm run lint
npm run test:package
```

Use <https://code-listen-cursor.sociobot.in/demo/> for the isolated sample
workspace.

## Next steps

Implement the five concrete fixes in `.factory/review-2.md`, add their
regression coverage, then repeat the full claims ledger from a clean clone.
