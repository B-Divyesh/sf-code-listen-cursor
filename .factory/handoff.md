# Code Listen Cursor — polish 3 handoff

Date: 2026-08-30
Work order: `code-listen-cursor-polish-3`
Base: `98d345c56215c3952439458d821396c0049c3b37`
Product repair commits: `eeded67e6f0060737620445406a57c4b71d23f73` and
`882f714016014e4250aef2547dafc166ef6cea92` and
`ba4be74205220ad3349d5aa6ea5d7a85a4f27533`

Live URL: <https://code-listen-cursor.sociobot.in/>

## Result

All findings from `.factory/review-1.md`, `.factory/review-2.md`, and
`.factory/review-3.md` are closed. The complete finding-to-evidence map is in
[`.factory/polish-3.md`](polish-3.md).

The repair keeps the botanical field-notebook visual system. It makes the
mobile demo show a working reader in its first viewport, proves real demo
speech, clears isolated data on exit, adds cross-extension pronunciation-file
transfer, uses concrete copy, and standardizes all public routes.

## Verification evidence

- A fresh clone installed with `npm ci --include=dev` without vulnerabilities.
  Every exact command listed in `.factory/claims.json` passed, including four
  separate installed-ZIP runs, two packaged-VSIX runs, and the combined
  portable-pronunciations command.
- `npm run check` passed: lint and typecheck; 19/19 Vitest tests; production
  build; browser and VS Code package smoke tests; installed ZIP/VSIX tests;
  and 40/40 Playwright desktop/mobile tests.
- The built site has 2.98 KB gzip main JavaScript plus 0.65 KB route-focus
  JavaScript, and 3.79 KB gzip main CSS.
- Production was deployed with `swa deploy dist/site --app-name
  sf-code-listen-cursor --resource-group sociobot --env production
  --no-use-keychain`.
- `/opt/fleet/lib/verify-url.sh https://code-listen-cursor.sociobot.in/
  test-results/live-polish-3` passed: HTTP 200, 791 ms load, correct title and
  language, one H1, main, no missing image alt, no unlabelled button, and no
  console error.
- Cold live Chromium checks at 1280 px and 390 px found zero Axe violations
  on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`. Route focus/Back,
  `?demo=1`, local mocked speech, demo cleanup, same-origin requests, and
  mobile first-viewport geometry were rechecked. See
  `test-results/live-polish-3/live-audit.json` and
  `test-results/live-polish-3/route-focus-live.json`.
- `https://code-listen-cursor.sociobot.in/does-not-exist` returns HTTP 404 with
  the designed not-found document and security headers.

## Run locally

```sh
npm ci --include=dev
npm run check
# Run each exact test command recorded in .factory/claims.json
```

Build output is `dist/site`; the browser ZIP and VS Code VSIX are in
`dist/site/downloads/`.

## Known gaps

None.
