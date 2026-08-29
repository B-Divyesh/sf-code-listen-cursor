# Code Listen Cursor — repair 8 handoff

Date: 2026-08-29
Work order: `code-listen-cursor-repair-8`
Report commit: `876ea66044582082f0ef0797c72b93e68c13dbd7`
Reported candidate: `ece7b6a535ad87afadf34b849d7421f43df9e6ac`
Verifier report: `.factory/verification-7.md`

## Status

Repair and final verification are in progress.

## Reproduction

- A fresh demo with only `{localService:false, lang:'en-US'}` passed the full
  spoken source to that voice.
- At the 195 CSS px proxy for 200% zoom on a 390 px display, the root was 218 px
  wide and the Privacy link ended beyond the viewport.

## Repair

- Speech selection now accepts only voices explicitly marked local. The demo,
  browser content script, popup, and VS Code webview fail closed with recovery
  text when none exists.
- Site and extension typography now keeps readable text at 16 px or larger.
- Narrow layouts stack navigation and controls without shrinking targets below
  44 by 44 CSS px.
- The owner-approved deterministic acceptance contract remains active. No
  external user-study outcome is required or presented as a product claim.
- Release identity is version 1.0.3 and the service-worker cache is version 5.

## Regression coverage

- `@claim:local-voice` supplies only a non-local voice and asserts no utterance
  is constructed or spoken while the deterministic preview remains.
- `@regression:local-voice-policy` rejects non-local and stale saved voices.
- The installed browser suite checks the no-local-voice recovery path.
- The packaged VSIX suite executes its shipped webview against non-local and
  local voice fixtures.
- `@regression:zoom-reflow` checks every public route at 195 CSS px for no
  horizontal overflow, retained Privacy navigation, and 44 px targets.
- `@regression:low-vision-type` rejects visible public copy below 16 px at
  390 px.

## Verification

Final clean and live evidence will be recorded here before handoff.

## Known gaps

None identified in the repaired paths. Final verification is pending.
