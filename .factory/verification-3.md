# Independent verification 3 — FAIL

Date: 2026-08-29

Work order: `code-listen-cursor-verify-3`

Candidate: `e60b299492153af74806e1b34235ccd939e5bf60`

Live URL: <https://code-listen-cursor.sociobot.in/>
Verdict: **FAIL — do not release.**

The deployment is healthy and matches the candidate, and the declared commands
pass after installation. The candidate still fails the acceptance contract: one
claim has no required tagged test, important public claims are absent from the
claims ledger, installed popup controls receive no response and show a false
protected-page error, mobile targets miss the accessibility minimum, and the
brief's participant outcome remains unverified.

## Mandatory first-read gate — PASS

In a new 1440×900 browser context, the first viewport says **“Listen to code
without losing your place.”** It names **“developers who read better by ear,”**
explains that it reads a selection or current line as spoken structure, and
shows **“Try it with sample data”** at y=523. At 390×844 the same action is at
y=393. Clicking it once opens `/demo/`, already seeded with realistic JavaScript,
and displays the persistent **“Demo — sample data, nothing is saved”** banner,
Reset demo, and Start for real.

## Mandatory claims gate

The commands were invoked first in the dependency-free clone as requested. They
could not start because `wxt` and `vitest` were not yet installed. After the
required clean `npm ci` (184 packages, 0 vulnerabilities), every exact command
from `.factory/claims.json` was rerun and passed:

| Claim | Exact command | Result | Fresh evidence |
| --- | --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS | 2/2, desktop and 390px; demo key created and reset. |
| `no-code-upload` | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS | 2/2; all observed demo requests were same-origin. |
| `local-voice` | `npm test -- --testNamePattern @claim:local-voice` | PASS | One tagged fixture passed; local English beat network English. |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS | 2/2 offline reloads after service-worker control. |
| `free-download` | `npm run test:e2e -- --grep @claim:free-download` | PASS | 2/2 unauthenticated downloads. |
| `installed-package-privacy` | `npm run test:installed` | PASS command / **FAIL contract** | Installed ZIP test passed, but the repository contains zero `@claim:installed-package-privacy` tags. The claims contract requires exactly one. |

The claims gate therefore fails structurally even though its shell commands exit
zero after installation.

## Release-blocking defects

| Severity | Finding | Evidence and impact |
| --- | --- | --- |
| Critical | `installed-package-privacy` has no required claim-tagged test. | `rg "@claim:"` finds the other five IDs exactly once and this ID zero times. `.factory/claims.json` therefore violates the mandatory one-test-tag-per-claim contract. |
| High | The installed MV3 popup cannot obtain state or success responses for Follow, Stop, GET_STATE, or Repeat-before-first-listen. | Against the installed live ZIP, `chrome.tabs.sendMessage` returned a state object for async `LISTEN`, but returned `undefined` for the content listener's synchronous branches. `entrypoints/popup/main.ts` passes that value to `display`, which dereferences it; its catch then shows **“This browser page is protected”** even on a valid HTTP page. Keyboard-command side effects may occur, but the popup's state and feedback are wrong and the primary controls are not end-to-end reliable. Existing smoke tests exercise only `LISTEN`, so they miss this. |
| High | Public product promises are not exhaustively listed and proved in `.factory/claims.json`. | Landing/README promises include selection/current-line reading, structure-aware braces/operators/indentation/camel/snake output, cursor follow, repeat, user-tunable controls, VS Code state, and personal pronunciation. Several have ordinary unit/source checks, but no corresponding claim IDs and sandbox tests. The general **“Your source stays on this device”** statement is broader than the demo-only request claim and browser-only installed claim; no installed VSIX privacy flow is exercised. The claims contract says an unlisted claim fails review. |
| High | The researched success measure and screen-reader-user validation remain absent. | `.factory/usability-study.md` explicitly says no participant study occurred. There is no consented 20-snippet result showing at least 16 correct symbol/indentation identifications and no screen-reader-user output evaluation, both required by the brief. Automated parsing/axe checks do not establish that user outcome. |
| High | Mobile interactive targets fail the non-negotiable 44×44px baseline. | At 390px, visible header Home/Demo-style links measure about 31×15px, footer Privacy 50×14px and Terms 36×14px, the wordmark is 36px high, and the range input is 16px high. The demo's larger buttons pass. Small targets are especially consequential for the low-vision audience. |
| Medium | The designed rust focus ring misses 3:1 contrast on dark reader surfaces. | `#A2462E` against `#17231D` measures 2.67:1; the requirement is at least 3:1. Fresh keyboard checks otherwise found a visible 3px ring, no trap, and a working first-tab skip link. |
| Medium | Required site metadata and handoff identity remain incomplete. | No page has an Apple touch icon; privacy, terms, and 404 lack canonical/Open Graph/Twitter metadata; demo lacks social metadata; the root OG asset is 1280×854 instead of a purpose-made 1200×630 card. Footers omit “Built by Param Factory” and a version/build ID, including the previous report's still-unfixed footer finding. |
| Medium | The plain-words audit is incomplete and later landing copy uses the prohibited field-guide metaphor as UI terminology. | `.factory/copy-audit.md` audits only five first-screen sentences, not every landing sentence as required. “Specimen,” “observation,” and “anatomy of a listening cursor” appear in task instructions/status copy, despite the requirement for headings and terms that name the actual action without brand lore. |
| Low | Axe reports one moderate landmark issue on the landing and demo routes. | `landmark-complementary-is-top-level` is reported for the observation `aside` nested in the main section at both viewports. There are zero serious/critical axe findings. |

## Checks that passed

| Check | Result and evidence |
| --- | --- |
| Repository identity | `HEAD`, `origin/main`, and the requested candidate are all `e60b299492153af74806e1b34235ccd939e5bf60`. |
| Full local gate | `npm run check` passed: TypeScript, 9 Vitest tests, exact build, package validation, extension smoke, installed-package privacy, and all 18 Playwright cases over desktop/390px. |
| Build and budgets | MV3 output totals 29.13kB. Initial site JS is 7,420B (3.11kB gzip), CSS is 11,150B (3.31kB gzip), and mobile hero WebP is 38,244B: all below contract budgets. |
| Independent live flow | Normal operator input produced “a strictly not equals b and c greater than or equal to 3.” Empty input produced “Nothing to read” plus recovery instructions, then recovered. Required pronunciation fields blocked empty submission. Rate endpoints displayed 0.5× and 1.5×. Reset restored the sample and removed the demo key. No horizontal overflow at 1440px or 390px. |
| Installed browser package | Live ZIP installed in a fresh Chromium profile. Popup axe found no serious/critical issue; normal and 12,001-character boundary responses were correct; pronunciation persisted under `chrome.storage.local.settings`; source was not stored; no remote request occurred. |
| Accessibility automation | Live landing, demo, privacy, terms, and 404 were scanned at 1440px and 390px: 0 serious/critical axe violations. Each has `lang=en`, one `h1`, a `main`, labels, and visible focus. Reduced-motion duration was `0.00001s`. |
| Lighthouse mobile | Performance 100, accessibility 100, best practices 100, SEO 100; FCP 1.0s, LCP 1.1s, TBT 0ms, CLS 0, interactive 1.1s. Report: `/tmp/code-listen-lighthouse.json`. |
| Privacy/request log | Full live landing/demo flows made only requests to `code-listen-cursor.sociobot.in`; no analytics, CDN, AI, or third-party runtime request appeared. CSP limits `connect-src` to self. |
| Headers/caching | CSP with response-header `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and permissions policy are live. Hashed JS/CSS are `max-age=31536000, immutable`; `/sw.js` is `no-cache`; downloads are attachments with `max-age=86400`. |
| PWA/offline | Live service worker was activated, `registration.update()` completed, cache `code-listen-cursor-v2` existed, and `/demo/` reloaded offline with its banner and offline notice. |
| Routes and links | All internal/external links crawled returned 200; downloads returned 200. A made-up path returned HTTP 404 with the designed “This page was not found” body. |
| Deployment identity | SHA-256 matched between live and local candidate for root, demo, privacy, terms, service worker, hashed JS/CSS, and hero WebP. Every unpacked file in both live ZIP and VSIX matched the local build. Outer archive hashes differ only because packaging timestamps are nondeterministic. |
| API/auth applicability | This is a static site plus local extensions. It exposes no server-side product/unlock endpoint and no sign-in, so rate allowance/429/Retry-After and Entra authority checks are not applicable. |

`verify-url.sh` is not present in the repository. Equivalent live title, lang,
main, image-alt, route, console, header, axe, and link checks were performed.

## Required remediation

1. Give every claims entry exactly one matching `@claim:<id>` test and add
   sandbox claims for every promise in landing/README/privacy copy.
2. Make every MV3 message branch return a Promise (or otherwise use Chrome's
   response contract), then exercise every popup control from the installed ZIP.
3. Increase all interactive hit areas to 44×44px and use a focus color with at
   least 3:1 contrast on both paper and dark reader surfaces.
4. Complete the brief's consented 20-snippet screen-reader/auditory-workflow
   study, or revise the acceptance contract outside this verification.
5. Complete route metadata, social art, standard footer identity, and the full
   copy audit; replace metaphorical task terms with direct action language.

No product code was changed during verification.
