# Code Listen Cursor — repair 8 handoff

Date: 2026-08-29
Work order: `code-listen-cursor-repair-8`
Report commit: `876ea66044582082f0ef0797c72b93e68c13dbd7`
Reported candidate: `ece7b6a535ad87afadf34b849d7421f43df9e6ac`
Verifier report: `.factory/verification-7.md`
Repair commit: `3cd216cb1c6cd61f94319293545d594078f377ba`
Live URL: <https://code-listen-cursor.sociobot.in/>

## Status

**PASS — release blockers repaired, pushed, deployed, and verified live.**

The owner-approved deterministic contract in `.factory/acceptance.md` remains
the active acceptance source. The obsolete external study is not required or
presented as a current or public product promise. Historical independent
verifier reports remain unchanged as audit evidence only.

## Reproduction before repair

- A clean demo exposing only
  `{localService:false, lang:'en-US', voiceURI:'network-only'}` passed
  `const describe Plant gets a sink open paren fern close paren arrow open brace`
  to that non-local voice automatically.
- At the 195 CSS px proxy for 200% zoom on a 390 px display, the root measured
  218 px wide. The header Privacy link ended at x=197 and was off-screen.
- Focused red regressions also exposed a 35.6 px flex-shrunk checkbox and a
  positional mobile-nav rule that hid Privacy on `/demo/`.

## Root-cause repair

- `preferredLocalVoice` now filters to `localService === true` before honoring
  a saved voice, choosing English, or choosing any fallback. A stale saved
  non-local URI cannot bypass the filter.
- The demo and browser content script resolve a local voice before constructing
  an utterance. With none available, speech stays off, source is not given to
  the speech API, the deterministic preview remains, and recovery text is
  announced.
- Browser and VS Code voice pickers list only local voices and show the missing
  local-voice state. The packaged VS Code webview applies the same check before
  constructing or speaking an utterance.
- Public privacy copy and the claim ledger now state the fail-closed behavior.
- Public, popup, toast, and VS Code text was raised to at least 16 px; mobile
  body text is 17 px. Controls remain at least 44 by 44 CSS px.
- At narrow reflow widths, headers stack, long installation URLs wrap, Privacy
  remains present, and the checkbox cannot flex below 44 px.
- The responsive nav now hides only an explicitly optional landing link instead
  of whichever link happens to be second.
- Package identity is version 1.0.3. The service-worker cache is
  `code-listen-cursor-v5`, with a regression that removes v4.

## Exact regression coverage

- `@claim:local-voice`: only a non-local voice is exposed; no utterance is
  constructed or spoken, the preview remains, and recovery is visible.
- `@regression:local-voice-policy`: non-local-only and stale saved voice
  fixtures return no non-local voice.
- Installed ZIP smoke: no installed local voice produces a safe recovery state
  while selection, current-line, repeat, follow, stop, settings, storage, and
  shortcut paths remain covered.
- Packaged VSIX integration: the shipped webview is executed against non-local
  and local fixtures. The former records no constructor or speech call; the
  latter speaks through the marked-local fixture.
- `@regression:zoom-reflow`: every public route at 195 CSS px must have no
  horizontal overflow, retain Privacy, and keep all targets at least 44 px.
- `@regression:low-vision-type`: visible public text below 16 px fails at the
  390 px viewport.

## Clean local evidence

`npm ci` installed 184 packages with zero reported vulnerabilities.

`npm run check` passed:

- TypeScript typecheck and JavaScript syntax lint.
- 15 Vitest unit and release-contract tests.
- WXT MV3 build, Chrome ZIP, native VS Code VSIX, and Vite static build.
- Package structure, unpacked extension smoke, installed ZIP consumer, and
  packaged VSIX consumer.
- Browser and editor reading controls, settings, configurable shortcuts,
  storage boundaries, request boundaries, and local-voice refusal.
- 30 Playwright cases: all routes at desktop and 390 px, keyboard, focus,
  reduced motion, 44 px targets, 195 px reflow, privacy, offline/update,
  downloads, and Axe.

All 11 unique commands in `.factory/claims.json` passed for all 15 claims.
The local Playwright Axe integration returned zero violations for every route
at 1440 by 900 and 390 by 844.

## Build and package evidence

- Initial site JS: 7,729 B (3.20 kB gzip).
- Main site CSS: 12,361 B (3.51 kB gzip).
- Legal CSS: 2,202 B (0.99 kB gzip).
- Mobile hero WebP: 38,244 B.
- Browser extension: 30.27 kB unpacked build output.
- Chrome ZIP SHA-256:
  `8aeca2d8d87bb52d670c3b4e02e70c15107db0c0d0504e55054e42fdb65ff34b`.
- VS Code VSIX SHA-256:
  `82ee4e7c7619541029eac99bba51b392d4bd87c1d9037226605e5b0b57067eb4`.
- Both packaged manifests report version 1.0.3; the browser artifact is MV3 and
  the VSIX resolves `./extension/extension.js`.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.892 s, LCP 1.079 s, total blocking time 0 ms, CLS 0.

## Deployment and live verification

Deployed with:

```sh
bash /opt/fleet/lib/deploy-static.sh code-listen-cursor dist/site
```

Azure Static Web Apps deployment
`cc344cd0-eeee-4bae-9bfb-9a7924df49ea` succeeded. It reused
`sf-code-listen-cursor` in Central US, and the custom domain returned HTTPS 200.

`verify-url.sh` measured a 713 ms load with no console or page errors. It found
the correct title, `lang=en`, one H1, one main landmark, no missing image
alternatives, and no unlabeled buttons.

Independent live Chromium checks found:

- Zero Axe WCAG A/AA/2.1 AA violations, console errors, page errors, overflow,
  missing landmarks, or targets below 44 px across five routes at both 1440 px
  and 390 px.
- At 195 CSS px, all five routes measured exactly 195 px wide and retained the
  Privacy navigation link.
- With only a non-local voice, the deployed demo recorded zero utterance
  constructor or speech calls, showed **Local voice needed**, and retained the
  complete spoken preview.
- The first keyboard target was **Skip to main content**. Reduced motion
  computed `animation: none` and a 0.00001 s transition.
- The demo edit/save/reset flow contacted only the product origin, wrote only
  `demo:code-listen-cursor:pronunciation`, and removed it on reset.
- After seeding cache v4 and reinstalling the worker, only
  `code-listen-cursor-v5` remained. `/demo/` then reloaded offline.
- All nine discovered product, package, source, and issue links returned 200.
- All 20 deployable files, including both downloadable packages, matched local
  `dist/site` byte-for-byte.

Live response checks confirmed HSTS, `nosniff`, strict-origin referrer policy,
the restrictive permissions policy, and response-header CSP with
`connect-src 'self'` and `frame-ancestors 'none'`. Hashed assets are immutable,
`sw.js` is `no-cache`, downloads are attachments, and an unknown route returns
HTTP 404.

## Applicability and known gaps

The product has no backend, account, payment, AI request, tenant boundary, or
dynamic API. Rate-limit, retry, authentication-authority, billing, and gateway
checks are not applicable. No release gap remains.
