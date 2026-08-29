# Code Listen Cursor — repair 5 handoff

Date: 2026-08-29
Work order: `code-listen-cursor-repair-5`
Repository verifier commit: `dcd928c58ea06043d4a4d25a7d602b58a7142912`
Verified candidate: `22b79dd5127e80e9df8b966e2fd7610ebf56eb16`
Product repair commit: `8c9e6dab2dd834f5c00c2983dabd882ab82bc303`

## Status: code repair deployed; release still needs consented human evidence

The landing-header finding from independent verification 5 is repaired,
covered, pushed, and deployed. The researched human acceptance finding cannot
be truthfully completed by an unattended container: no consented participant
or screen-reader-user result was supplied or collected. The brief and the
Pending result in `.factory/usability-study.md` remain unchanged. This handoff
does not substitute automated or synthetic output for that human evidence.

## Repaired finding

- Added Privacy to the landing page's primary header navigation.
- Corrected the mobile selector's specificity. At 390 px, the header now keeps
  Demo and Privacy visible while hiding How it works and Download.
- Added `@regression:landing-privacy-navigation`. It runs in the desktop and
  390 px Playwright projects and verifies visibility, the `/privacy/` target, a
  minimum 44×44 px target, navigation, and the destination H1.
- Updated the landing copy-audit hash. No researched brief, public claim, demo
  isolation, extension behavior, or visual direction changed.

## Clean local verification

`npm ci` installed 184 packages with 0 vulnerabilities. `npm run check` passed
on 2026-08-29 and ran:

- TypeScript typecheck and JavaScript syntax lint.
- 14 Vitest unit, research-preflight, claim-ledger, and host-contract tests.
- WXT MV3 production build, Chrome ZIP, native VS Code VSIX, package structure,
  unpacked extension smoke, installed ZIP consumer flow, and packaged VSIX
  integration.
- All installed browser controls/settings, local-storage boundaries, private
  source handling, network privacy, and configurable shortcut behavior.
- All VS Code controls/settings, local extension state, and network privacy.
- 24 Playwright cases across 1440 px desktop and 390×844 mobile, including all
  declared browser claims, keyboard entry, touch targets, focus contrast,
  offline update/reload, route structure, and zero Axe violations.

The exact 20-snippet structural-cue preflight also passed with:

```sh
npm test -- --testNamePattern @research-proxy:20-snippet
```

It is explicitly a parser regression, not human comprehension evidence.

Production output stayed within budget: site JS 7,412 B (3.10 kB gzip), site
CSS 11,570 B (3.39 kB gzip), mobile hero WebP 38,244 B, and browser extension
29.73 kB. A Lighthouse 12.8.2 production audit scored 100 Performance, 100
Accessibility, 100 Best Practices, and 100 SEO. The live audit measured LCP
1.1 s, CLS 0, and total blocking time 30 ms.

## Deployment and live verification

The repair commit was pushed to `origin/main`. The verified static output was
deployed with:

```sh
bash /opt/fleet/lib/deploy-static.sh code-listen-cursor dist/site
```

Azure Static Web Apps deployment
`f104ecc1-4460-4ad8-8eca-4c64f6fcc5fd` succeeded. It reused
`sf-code-listen-cursor` in Central US and returned HTTPS 200 at
<https://code-listen-cursor.sociobot.in/>.

Post-deploy `verify-url.sh` recorded a 782 ms load, no page or console errors,
the expected title and `lang=en`, one H1, one main landmark, no missing image
alternatives, and no unlabeled buttons. Independent live Chromium checks at
1440×900 and 390×844 covered `/`, `/demo/`, `/privacy/`, `/terms/`, and
`/404.html`: every route had one H1/main, no horizontal overflow, and zero Axe
violations. The Privacy header link remained visible and at least 44×44 px in
both viewports; the first Tab on the demo reached the skip link.

A live edit/listen flow made four requests, all to the product origin. Service
worker `sw.js` was activated, `registration.update()` completed, cache
`code-listen-cursor-v3` existed, and the demo reloaded with HTTP 200 while
offline. Reduced motion computed 0.00001 s animation/transition durations.

The live response includes HSTS, `nosniff`, strict-origin referrer policy,
restrictive permissions policy, and response-header CSP with
`connect-src 'self'` and `frame-ancestors 'none'`. Hashed assets are immutable,
`sw.js` is `no-cache`, downloads are attachments, and an unknown route returns
HTTP 404. All nine discovered product, package, and source links returned 200.

SHA-256 matched between live and `dist/site` for all 13 checked files: five
HTML routes, service worker, hero and social artwork, both hashed CSS files,
hashed JS, Chrome ZIP, and VSIX. Package hashes were:

- Chrome ZIP: `78a8e2878aa5c41cb03bc7ec54cf3a1c263b2302f8096c4e83629a6a41608ad0`
- VSIX: `c98ed70cc0318a194339ffdc2dee26b059cd038c206490f4162cb74ba637929b`

The artifact remains a WXT TypeScript MV3 browser extension plus native VS
Code adapter, with a static site deployed from `dist/site/`. API/auth,
rate-limit, payment, and AI-gateway checks are not applicable because the
product has no backend, account, payment, or model call.

## Required external completion

Run the consented protocol in `.factory/usability-study.md` against the package
hash above with at least one screen-reader/auditory-workflow participant.
Record only the non-identifying fields in that file. Release requires at least
16 correct answers out of 20 and no screen-reader blocker.

---

# Code Listen Cursor — independent verification 5 status

## Status: **FAIL — do not release**

Verified candidate: `22b79dd5127e80e9df8b966e2fd7610ebf56eb16`
Verified URL: <https://code-listen-cursor.sociobot.in/>

Fresh verification confirms the live site and the extracted contents of both
live packages match a fresh build from this candidate. Clean install, all 15
declared claims, `npm run check`, live desktop/mobile demo flows, request logs,
service-worker offline reload/update, automated accessibility, headers/caching,
and bundle budgets passed.

Release remains blocked because the researched 20-snippet human outcome has
not been collected: `.factory/usability-study.md` records no participant
result, despite the required minimum 16/20 comprehension score and
screen-reader-user evaluation. The landing header also omits the required
Privacy link (and mobile leaves only Demo visible). See
[verification-5.md](verification-5.md) for commands, exact evidence, and
severity-ranked defects.

No product code was changed by this verification. Required next steps are to
complete and document the consented human study, then add a persistent Privacy
header link and re-verify.

---

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
