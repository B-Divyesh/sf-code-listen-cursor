# Code Listen Cursor — repair 7 handoff

Date: 2026-08-29
Work order: `code-listen-cursor-repair-7`
Report commit: `c764d8aae1ea2fbc689910b4b4252060203f7dff`
Reported candidate: `6feb3f375fcae7c00cdce1eecdab49b12fb382f1`
Verifier report: `.factory/verification-6.md`

## Status

The release blocker is repaired and every local release gate passes. Deployment and live verification evidence will be appended after the repair commit is pushed.

## Reproduction and root cause

A hidden-file wording scan reproduced the controller finding in the active brief, the former research protocol, and the inherited handoff. The landing page also promised a listener-comprehension outcome that the automated sandbox could not establish.

The first run of `@regression:verifiable-acceptance` failed against that unchanged contract. Its assertion output included the brief’s unsupported outcome and the pending evidence record. This red run occurred before the product wording was changed.

## Repair

- Replaced the unsupported outcome in `.factory/brief.json` with a deterministic result: every shipped structural-cue fixture must contain its expected spoken symbol and indentation cue.
- Reworded the brief constraints as local-voice, source privacy, keyboard-operation, and configurable-shortcut requirements. Existing package and browser tests directly exercise each requirement.
- Reworded the public structure statement to “become explicit spoken labels.”
- Replaced the pending research protocol with `.factory/acceptance.md`, which describes the clean sandbox gate.
- Made the full 20-item, five-language fixture set the exact `structure-aware-speech` claim test and renamed it `tests/fixtures/structural-cues.json`.
- Added `@regression:verifiable-acceptance`. It scans active product, public, and factory contract files for the removed promises, checks the brief’s executable wording, and verifies the claim command.
- Bumped both extension packages and the visible build identity to `1.0.2`.
- Bumped the service-worker cache to `code-listen-cursor-v4`. The offline test now seeds the former cache, reinstalls the worker, proves the stale cache is removed, and then reloads the demo offline.

Historical independent verifier reports remain unchanged as evidence of what each prior candidate was assessed against. They are excluded from the active-contract regression because they are records, not current promises.

## Clean local evidence

`npm ci` installed 184 packages and reported 0 vulnerabilities. `npm run check` passed and covered:

- TypeScript typecheck and JavaScript syntax lint.
- 15 Vitest unit, claim-ledger, host-policy, metadata, copy, and acceptance-contract tests.
- Production WXT MV3 build plus Chrome ZIP and native VS Code VSIX packaging.
- Browser package structure, unpacked-extension smoke, a fresh installed-ZIP consumer flow, and the isolated packaged-VSIX integration.
- Browser/VS Code selection and current-line reading, follow, repeat, stop, all reading settings, local storage boundaries, configurable shortcuts, and no listening-time network request.
- 24 Playwright cases at desktop and 390×844. They cover all site routes, keyboard entry, visible focus, 44 px targets, no horizontal overflow, the demo sandbox/reset, same-origin privacy, worker update/cache replacement, offline reload, downloads, and zero Axe violations.

The exact replacement acceptance command passed:

```sh
npm test -- --testNamePattern @claim:structure-aware-speech
```

The full active-wording audit returned no matches for the removed promise or the old public comprehension sentence.

## Build and performance evidence

- Site JavaScript: 7,412 B (3.10 kB gzip).
- Main site CSS: 11,570 B (3.39 kB gzip).
- Mobile hero WebP: 38,244 B.
- Browser extension total: 29.73 kB.
- Chrome ZIP SHA-256: `af84c47f2f18a8bfbafdf2d74c16f44d52e5a9b728c828bfc6c0438a60d79fc9`.
- VS Code VSIX SHA-256: `556b3a40bfdec7bd80636c1487b6eb3191d3ce47734c174cbfa3294be69c77a2`.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, CLS 0, total blocking time 0 ms.

Fresh screenshots of the landing page at 1440×900 and 390×844, plus the 390×844 demo, showed no overflow, clipping, or obscured controls. The product retains its WXT + TypeScript MV3 browser-extension artifact and static `dist/site` deployment class.

## Response and service applicability

The release-contract and package checks verify response-header CSP, `frame-ancestors 'none'`, same-origin connections, immutable hashed assets, `no-cache` for `sw.js`, attachment headers for downloads, and a status-preserving 404 rewrite. Live header and identity checks are pending deployment.

The product has no backend, account, payment, AI request, tenant boundary, or dynamic response endpoint. Rate-limit, retry, auth, payment, and gateway checks are therefore not applicable.

## Deployment

Pending the repair commit and static deployment. This section will be replaced with the deployment identifier and live evidence before final handoff.
