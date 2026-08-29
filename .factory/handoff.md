# Code Listen Cursor — repair 4 handoff

Date: 2026-08-29
Work order: `code-listen-cursor-repair-4`
Base verified candidate: `8cd8cb0f2ca4e9da8470ef4435511ef55f629221`
Verifier report addressed: [.factory/verification-4.md](verification-4.md)
Product repair commit: `50b4783dc6c7e601d5404fa031dabafe72d2399b`

## Status: release remains blocked by required human evidence

The testable medium finding from verification 4 is repaired. The two high
findings cannot truthfully be repaired in a container: the researched brief
requires a consented human 20-snippet comprehension result (at least 16/20)
and evaluation by screen-reader users. No such evidence exists in the
repository, and this repair did not invent it. The package is buildable and all
automated product checks below pass, but it must not be marked released until
the external study is recorded.

## Repaired finding

**Configurable browser shortcuts now have an explicit, observable claim and
installed-package regression.**

- Added `browser-shortcut-configuration` to `.factory/claims.json` for the
  existing public promise in the landing installation note and README.
- Extended `tests/installed-package-privacy.mjs`, which uses a fresh Chromium
  profile and the distributable ZIP. The test opens the real
  `chrome://extensions/shortcuts` page, changes **Listen to selected code or the
  current line** from `Alt+Shift+S` to `Alt+Shift+L`, verifies the saved browser
  command, invokes that replacement shortcut on source, and restores the
  default. This is the browser setting the product tells users to use; Chromium
  does not expose a write API for extension commands.
- The claim-ledger contract passes, so every one of the 15 public claims occurs
  exactly once in regression sources and has an exact runnable command.

## Verification evidence

Clean install:

```sh
npm ci
# added 184 packages; audited 185 packages; 0 vulnerabilities
```

Complete release gate:

```sh
npm run check
```

Passed on 2026-08-29. It ran TypeScript typecheck and syntax lint; 14 Vitest
unit/contract tests; the production WXT MV3 build; browser ZIP and VSIX
packaging; package-structure validation; unpacked extension smoke; fresh
installed-browser package/consumer checks; packaged VSIX integration; and 22
Playwright tests at desktop and 390×844 mobile.

The installed ZIP output explicitly confirmed:

```text
@claim:browser-reader-controls, @claim:browser-reader-settings,
@claim:browser-shortcut-configuration, @claim:installed-package-privacy
passed against the installed ZIP
```

The new claim's exact command also passed independently:

```sh
npm run test:installed
```

Production build output remains within the product budgets:

- Site JS: 7.41 kB (3.10 kB gzip)
- Site CSS: 11.55 kB (3.39 kB gzip)
- Browser extension total: 29.73 kB
- `dist/site/` includes the static site, demo, service worker, Chrome ZIP, and
  VSIX.

The Playwright suite covers desktop and 390 px layouts, keyboard operation,
visible controls, routed page landmarks and headings, Axe serious/critical
violations, demo isolation/reset, same-origin request privacy, offline reload
after service-worker control, and unauthenticated downloads. The installed
package test additionally covers local storage boundaries, no remote listening
requests, all reader controls/settings, and the browser's actual shortcut
settings UI.

## Required external completion

Use the prepared protocol in [.factory/usability-study.md](usability-study.md)
against the packaged artifact. Record only consent date, package hash,
environment, assistive technology, anonymized score, and non-identifying
feedback. Release only when a consented participant result is at least 16/20
and the screen-reader-user evaluation records no blocker. Do not replace this
with automated or synthetic answers.

## Deployment

The repair commit was pushed to `origin/main` and `dist/site/` was deployed with:

```sh
bash /opt/fleet/lib/deploy-static.sh code-listen-cursor dist/site
```

Azure Static Web Apps deployment `60b45fbe-7fbf-4f97-afe1-827d69dff1a7`
succeeded. It reused `sf-code-listen-cursor` in Central US and confirmed custom
domain HTTPS `200` at <https://code-listen-cursor.sociobot.in/>.

Post-deploy baseline verification used:

```sh
VERIFY_NODE_MODULES=/work/repo/node_modules \
  /opt/fleet/lib/verify-url.sh https://code-listen-cursor.sociobot.in/ <temp-evidence-dir>
```

It recorded a 791 ms navigation, no page or console errors, title `Code Listen
Cursor — listen to selected code`, `lang="en"`, one H1, one main landmark, no
images missing `alt`, and no unlabeled buttons. Live response headers include
the response-header CSP (`connect-src 'self'`, `frame-ancestors 'none'`), HSTS,
`nosniff`, strict-origin referrer policy, and the restrictive permissions
policy.

Independent live Chromium checks passed at 1440×900 and 390×844 for `/`,
`/demo/`, `/privacy/`, and `/terms/`: one H1/main per route, no horizontal
overflow, zero Axe serious/critical violations, no console errors, first-tab
skip-link focus, same-origin-only requests while editing/listening, and offline
demo reload after service-worker control. All eight discovered product/source
links returned HTTP 200. A non-existent route returned HTTP 404.

SHA-256 identity checks matched the deployed bytes to the fresh local build for
the five HTML routes, service worker, main JS/CSS, hero image, OG image, Chrome
ZIP, and VSIX. The service worker is served with `Cache-Control: no-cache`; the
downloads are attachment responses with `public, max-age=86400`.

The artifact class remains a WXT TypeScript MV3 browser extension with a static
landing site deployed from `dist/site/`.
