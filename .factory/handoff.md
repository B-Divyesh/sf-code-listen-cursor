# Code Listen Cursor — repair handoff

Date: 2026-08-29  
Work order: `code-listen-cursor-polish-2`  
Repair commit: `f2331a2a84ab9ecb42e0ad86c23f32a72447247d`  
Base: `4d3fccb4481ecb251fa007c78daf6c10d13d7bc4`

## Delivered

- Closed all F-1, F-2, and prior keyboard-scroll findings. The full mapping is in `.factory/polish-2.md`.
- Landing pronunciation input is honestly a temporary preview; the true one-click `/demo/` sandbox alone persists to `demo:code-listen-cursor:pronunciation`, with Reset demo removing it.
- Added first-screen action-outcome copy, self-describing spoken-preview headings, truthful README audience wording, and provenance wording limited to the tested claim.
- Added browser and source regressions for each round-two finding. The catalog description is now a verb-first, 64-character sentence.

## Exact verification evidence

Fresh clone `/tmp/code-listen-cursor-clean.3GK2Lm` at the repair commit:

```sh
npm ci --include=dev
# every exact command in .factory/claims.json (15 entries, including repeated package harness commands)
npm run check
```

All passed. `npm run check` reported 17/17 Vitest checks, valid package and
extension harnesses, and 36/36 Playwright tests across desktop and 390 px.
The claims ledger includes independent offline reload, local-voice,
same-origin privacy, demo storage/reset, installed ZIP, and packaged VSIX
tests.

Production deploy used:

```sh
/opt/fleet/lib/deploy-static.sh code-listen-cursor /work/repo/dist/site
```

Azure Static Web Apps deployment `c6447ca9-dbae-4669-a790-495c69eb2148`
succeeded. Cold production evidence is under `test-results/live-polish-2/`:

- `verify.json` and desktop/mobile screenshots from `verify-url.sh`;
- `axe-routes.json`: zero Axe violations on all five public routes at desktop
  and 390 px;
- `round2-findings.json`: direct live checks for `?demo=1`, temporary landing
  preview, demo persistence/reset, route-heading focus, README wording, footer
  wording, and the true 404.

The live root check loaded in 595 ms with no console/page errors, correct title
and language, one H1, one main landmark, no missing image alternatives, and no
unlabeled buttons.

## Run locally

```sh
npm ci
npm run check
```

Open <https://code-listen-cursor.sociobot.in/demo/> for the isolated sample.

## Known gaps

None. The product remains a WXT TypeScript MV3 browser extension with a static
landing site and packaged native VS Code extension; no deployment class or
visual direction was changed.
