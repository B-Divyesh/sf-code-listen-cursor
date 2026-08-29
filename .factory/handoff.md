# Code Listen Cursor — repair 9 handoff

Date: 2026-08-29
Work order: `code-listen-cursor-repair-9`
Base verified candidate: `1493ac0a98b3281f45a8982cfc3d33a1d0021f83`
Verifier report: `.factory/verification-9.md`

## Outcome

The one release-blocking finding is repaired. A spoken preview that exceeds its
190px maximum height is now a labelled keyboard-focusable region on both the
landing reader and the isolated demo. It has the existing designed three-pixel
focus ring and an assistive instruction explaining Arrow/Page Down scrolling.

The product remains a local-first MV3 browser extension with its static landing
site. No reader, speech, storage, network, package, or deployment behavior was
removed or broadened.

## Root cause and repair

Before the repair, `#speech-preview` was an overflowing `<output>` element with
`tabIndex === -1`. At the verifier's 195 CSS-pixel reflow proxy its 188px client
height had 239px of content, and Axe reported the serious
`scrollable-region-focusable` violation. A 390px view with a long code line
reproduced the same defect.

Both reader templates now use a `<div role="region">` named **Words that will
be spoken**, with `tabindex="0"` and an `aria-describedby` instruction. The
reader updates its text with `textContent`. `.speech-preview:focus-visible`
uses the established 3px Focus clay outline.

`@regression:spoken-preview-keyboard-scroll` covers the exact cases:

- `/demo/` at 390×844 with an overflowing long code line;
- `/` at 195×844, the 390px-at-200%-zoom proxy;
- Tab order from Listen → Stop → spoken preview, visible focus, and Page Down
  changing the preview's `scrollTop`;
- a whole-page Axe scan for each case.

The copy audit was updated with the new hidden keyboard instruction and the
current landing SHA-256.

## Verification evidence

- Clean install: `npm ci` installed 184 packages; `npm audit` reported 0
  vulnerabilities.
- Complete gate: `npm run check` passed type/lint, 16/16 Vitest unit/contract
  tests, production extension/site/VSIX builds, package smoke, installed ZIP
  and VSIX consumer harnesses, and 32/32 Playwright desktop + 390px tests.
- Every one of the 15 commands in `.factory/claims.json` was invoked after the
  clean install. All passed, including the six browser claim commands in both
  Playwright projects, four fresh installed-ZIP runs, and two fresh VSIX runs.
- Direct repaired-state browser probe: at 195px, preview metrics were
  `tabIndex: 0`, `clientHeight: 188`, `scrollHeight: 239`; keyboard focus was
  true and Page Down changed `scrollTop` from 0 to 51. At 390px with the long
  line, metrics were `0`, `188`, and `450`; Page Down changed `scrollTop` from
  0 to 164. Axe returned no violations in either state.
- `verify-url.sh http://127.0.0.1:4173/` passed: HTTP 200, title, `lang=en`,
  one H1, main landmark, zero missing image alt, zero unlabelled buttons, and
  zero console/page errors.
- Response policy and package checks passed through `npm run test:package`:
  browser/VSIX packages, CSP/caching policy, and designed 404 are valid.
- Privacy and offline/update checks passed through the exact no-code-upload,
  local-voice, installed-package-privacy, and offline-reload claims. The
  offline claim starts in a separate browser context, replaces a seeded v4
  cache with v5, then reloads `/demo/` while offline.
- Lighthouse mobile (local production output): Performance 100, Accessibility
  100, Best Practices 100, SEO 100; FCP 0.9s, LCP 1.4s, TBT 0ms, CLS 0.
- Current production build: landing JS 7.03kB raw / 2.89kB gzip, CSS 12.71kB
  raw / 3.59kB gzip, mobile hero 38.2kB, and extension 30.27kB unpacked.

## Run and deploy

```sh
npm ci
npm run check
npm run build:site
```

Deploy the static product root with the work-order configuration:

```sh
/opt/fleet/lib/deploy-static.sh code-listen-cursor dist/site
```

## Known gaps

None. There is no backend, account, payment, external identity, AI, or remote
data boundary for this free, local-first extension.
