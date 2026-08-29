# Independent verification 7 — FAIL

Date: 2026-08-29

Work order: `code-listen-cursor-verify-7`

Candidate: `ece7b6a535ad87afadf34b849d7421f43df9e6ac`

Live URL: <https://code-listen-cursor.sociobot.in/>

Verdict: **FAIL — do not release.**

The first-read gate, all declared claim commands, the clean local quality gate,
the packaged browser and VS Code extension harnesses, live accessibility
automation, offline behavior, response policy, budgets, and deployment parity
pass. The release still fails the original researched brief supplied with this
work order. The candidate replaces an unmet human comprehension and
screen-reader evaluation with an automated fixture contract, and the runtime
can automatically give source text to a voice explicitly marked non-local.

## Mandatory first-read gate — PASS

I opened the live root in a new Chromium context with no prior storage. From
the first 1440×900 viewport I understood that the product reads selected code
or the current line as spoken structure, that it is for developers who read
better by ear, and that the first action is **Try it with sample data**. That
one click opens `/demo/`. The first screen also states that demo code stays in
the browser, it works offline after the first visit, and it is free with no
account. The same content and action remain visible at 390×844.

## Mandatory claims gate — PASS, with a privacy-test blind spot

`.factory/claims.json` exists with 15 claims. Starting from a clean worktree, I
ran `npm ci` (184 packages, zero reported vulnerabilities), then every declared
claim test through the demo or packaged artifact. All commands exited zero.

| Claim | Exact command | Fresh result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS — 2/2 desktop/mobile cases. |
| `demo-reader` | `npm run test:e2e -- --grep @claim:demo-reader` | PASS — 2/2. |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS — 2/2 page-request checks. See Critical 2. |
| `structure-aware-speech` | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS — all 20 fixtures. This is not the original human outcome. |
| `local-voice` | `npm test -- --testNamePattern @claim:local-voice` | PASS — local English is preferred when present. It does not reject a network voice. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS — 2/2. |
| `free-download` | `npm run test:e2e -- --grep @claim:free-download` | PASS — 2/2. |
| `browser-reader-controls` | `npm run test:installed` | PASS in the shared installed-ZIP suite. |
| `browser-reader-settings` | `npm run test:installed` | PASS in the same suite. |
| `browser-shortcut-configuration` | `npm run test:installed` | PASS in the same suite. |
| `installed-package-privacy` | `npm run test:installed` | PASS in the same suite's observable HTTP log. See Critical 2. |
| `vscode-reader-controls` | `npm run test:vscode-installed` | PASS in the packaged-VSIX harness. |
| `vscode-package-privacy` | `npm run test:vscode-installed` | PASS in the same harness. See Critical 2. |
| `generated-artwork-provenance` | `npm test -- --testNamePattern @claim:generated-artwork-provenance` | PASS. |
| `mit-license` | `npm test -- --testNamePattern @claim:mit-license` | PASS. |

The installed-package commands explicitly printed every shared claim tag, so
each ledger entry was exercised. The claim wording across the live site and
README otherwise maps to the ledger. The accessibility-benefit statement in
the README remains unproven by target-user evidence described in Critical 1.

## Clean local verification — PASS

`npm run check` passed after the clean install. It covered:

- TypeScript typecheck and JavaScript syntax lint.
- 15/15 Vitest unit/release-contract tests.
- The exact WXT MV3 production build, Chrome ZIP, native VS Code VSIX, and
  Vite static build into `dist/site/`.
- Package structure, unpacked-extension smoke, a fresh installed-ZIP Chromium
  consumer, and the isolated packaged-VSIX integration harness.
- Selection/current-line reading, follow, repeat, stop, shortcut replacement,
  settings persistence, pronunciation, and observable request/storage limits.
- 24/24 Playwright cases at desktop and 390 px, including all routes, demo
  reset, offline reload, keyboard entry, target size, focus contrast, and Axe.

The browser extension build is 29.73 kB. The initial site JS is 7,412 B
(3,123 B gzip), main CSS 11,570 B (3,403 B gzip), no fonts are downloaded, and
the selected mobile hero WebP is 38,244 B. These are below the supplied 200 kB
JS, 50 kB CSS, 120 kB font, and 300 kB mobile-hero budgets.

## Independent live functional checks — PASS except reported defects

In a fresh live demo, selecting the first line produced:

`const describe Plant gets a sink open paren fern close paren arrow open brace`

A controlled local voice received that exact text at rate 0.9 and completed the
status cycle. Literal punctuation with indentation disabled produced
`total plus gets price semicolon`. Keyboard input clamped the rate at 0.5× and
1.5×. Empty code produced **Nothing to read** plus a concrete recovery action.
A blank required pronunciation field was rejected, focused, and exposed the
browser message **Please fill out this field.** A saved pronunciation created
only `demo:code-listen-cursor:pronunciation`; Reset removed it and restored the
sample. A deliberately corrupt demo value was removed safely on reload.

Request recording for the edit/listen/save/reset flow found only
`https://code-listen-cursor.sociobot.in`. There were no normal-route console or
page errors. This page-level observation cannot see traffic performed inside a
browser or operating-system network speech service; that limitation is
material to Critical 2.

The live service worker was active at `/sw.js`. After seeding the former
`code-listen-cursor-v3` cache, unregistering, and reloading, only
`code-listen-cursor-v4` remained. With the browser offline, `/demo/` reloaded
with HTTP 200 and rendered **Listen to sample code**.

## Accessibility and responsive checks

The required `/opt/fleet/lib/verify-url.sh` passed when invoked with its
required evidence directory: live HTTP 200, 741 ms load, title, `lang=en`, one
H1, one main landmark, no missing image alternatives, no unlabeled buttons,
and no console/page errors.

Fresh Playwright Axe WCAG 2 A/AA/2.1 AA scans on `/`, `/demo/`, `/privacy/`,
`/terms/`, and a real HTTP 404 returned zero violations at both 1440×900 and
390×844. Every route has one H1, one main, no missing image alternative, no
unlabeled form control, no target below 44×44 px, and no horizontal overflow at
those two viewports. The expected DevTools failed-resource message appeared
only for the intentionally requested HTTP 404 document.

Keyboard traversal reached every demo control without a trap. The first target
was **Skip to main content**. Focus rings measured 4.25:1 on paper and 3.31:1
on the dark reader surface. With reduced motion requested, animation was
`none` and transitions were effectively instant. See Major 3 for text sizing
and narrow reflow.

## Live response, link, and deployment checks — PASS

Root, demo, privacy, terms, assets, service worker, downloads, and a missing
route were checked directly. Responses include HSTS,
`X-Content-Type-Options: nosniff`, strict-origin referrer policy, a restrictive
permissions policy, and a response-header CSP with `connect-src 'self'` and
`frame-ancestors 'none'`. Hashed JS/CSS are
`public, max-age=31536000, immutable`; `sw.js` is `no-cache`; downloads are
attachments; and an unknown route remains HTTP 404. All 15 discovered internal
and GitHub links returned 200 (browser-internal installation URLs excluded).

Eighteen non-container deployed files matched fresh `dist/site` files
byte-for-byte. Fresh ZIP/VSIX outer hashes differed because packaging embeds
container metadata; extraction and recursive comparison found no file-content
difference in either artifact. The live product therefore matches the
candidate's production source output.

Three Lighthouse 12.8.2 mobile runs scored Performance 78/100/100,
Accessibility 100/100/100, Best Practices 100/100/100, and SEO 100/100/100.
The median performance score was 100; median LCP was 1.066 s, median total
blocking time 82.5 ms, and CLS 0. The 78 outlier attributed a 1.04 s task to
“Unattributable”; it did not recur.

There is no server-side product endpoint, account, payment, AI request,
product-unlock call, or sign-in flow. Rate-limit/429/`Retry-After`, persistence
concurrency, health/build identity, Sociobot billing, and Entra authority checks
are not applicable. AI is not useful to the local deterministic reading job,
so there is no missed AI leverage finding.

## Release-blocking defects

| Severity | Finding | Fresh evidence and impact |
| --- | --- | --- |
| Critical | The candidate does not satisfy the original 16/20 human comprehension result or screen-reader-user test requirement. | The supplied researched brief requires users to identify requested symbol/indentation relationships in at least 16 of 20 snippets and requires testing with screen-reader users. No participant result exists in the candidate. Commit `3da3445` instead changed `.factory/brief.json`, deleted the pending `.factory/usability-study.md`, added `.factory/acceptance.md` saying no external participants are needed, and added a regression assertion that rejects the original requirement's wording. Automated cue-presence, Axe, and mocked host tests do not measure what a person understands or detect real screen-reader/speech/shortcut interaction. |
| Critical | Source can be sent to a non-local speech provider automatically, contradicting the original privacy constraint and public demo/privacy claims. | With a fresh live demo and a browser exposing only `{localService:false, lang:'en-US'}`, clicking Listen assigned that network voice the full selected source without consent. `core/voice.ts` falls back from local English to any English voice. The VS Code webview has the same fallback. Yet the first screen says demo code stays in the browser, and the privacy page says network-voice handling applies when the user “deliberately” chooses one. The popup actually lists only local voices, so this fallback is automatic. Page request logs cannot observe browser-internal speech-provider traffic, making the current privacy claim tests false reassurance. |
| Major | Essential text is below the supplied low-vision typography baseline, and narrow reflow loses navigation. | Live computed sizes are 14 px for the primary CTA, the three hero facts, demo code, spoken preview, and primary demo buttons; navigation is 13 px and several labels/footer items are 12 px. The supplied design baseline requires body text at least 16 px on web and 17 pt on mobile. At 195 CSS px—the reflow equivalent of 200% zoom on a 390 px viewport—the landing page had 23 px horizontal overflow and the Privacy link extended off-screen. This is especially material for a product explicitly aimed at developers with low vision and reading fatigue. |

## Required resolution

1. Restore the original researched acceptance contract and collect a consented,
   anonymized 20-snippet result of at least 16/20 with a real screen-reader-user
   smoke test and no assistive-shortcut blocker. Do not redefine the contract
   to make the unmet requirement disappear.
2. Refuse to speak unless the chosen voice is marked local. When none exists,
   keep the deterministic spoken preview and show a clear local-voice recovery
   message. Add a claim test with only a non-local voice and assert that source
   is never passed to it; apply the same policy in VS Code.
3. Raise essential interface copy and controls to the supplied type baseline
   and verify 200% text/reflow without clipped or off-screen navigation.

No product code was modified during verification.
