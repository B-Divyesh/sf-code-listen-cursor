# Independent verification — FAIL

Date: 2026-08-28
Verifier work order: `code-listen-cursor-verify-1`
Candidate commit: `50dd4bcf428381fb93112ee317676c8519dfac1b`
Live URL: <https://code-listen-cursor.sociobot.in>
Verdict: **FAIL — do not release.**

## Mandatory preflight

`.factory/claims.json` is absent in the clean checkout. Therefore there were no claim-tagged tests to run, and the mandatory claims contract is not satisfied. This alone is release-blocking. It also means the material landing-page/README claims (local-only source handling, no upload/analytics, local voice preference, offline behavior, and free/open availability) have no executable sandbox proof.

### Cold first read of the live page

The first visible heading is **“Hear the structure. Keep your place.”** The supporting copy eventually says that it listens to a selection/current line, but the first screen does not state in plain words who it is for (developers with reading fatigue, dyslexia, low vision, or an auditory workflow) or what to click first. Its available action is **“Try the field station”**, not the required one-click **“Try it with sample data.”**

`/demo` and `/?demo=1` both return the ordinary landing document (200, identical 9,000-byte HTML) rather than a demo route. There is no persistent “Demo — sample data, nothing is saved” banner, Reset demo/Start for real controls, demo storage namespace, or `.factory/demo.md`. This fails the plain-words and demo-sandbox acceptance requirements.

## Release-blocking defects

| Severity | Finding | Fresh evidence |
|---|---|---|
| Critical | Required executable-claims manifest is missing. | `find .factory ...` found only `brief.json`, `design.md`, and `handoff.md`; `.factory/claims.json` is absent. |
| Critical | No compliant, isolated one-click sample-data demo; first-read requirement fails. | Live cold-page inspection above; `curl -I /demo` and `/?demo=1` each served the same landing HTML; no demo banner/controls/storage behavior exists in `site/index.html` or `site/main.ts`. |
| Critical | The delivered artifact cannot do the brief’s stated smallest useful product: a **VS Code extension**. | Built manifest is Chrome MV3 and content scripts match only `http://*/*` and `https://*/*`; source only reads browser DOM/text controls. Native VS Code is not supported. |
| High | Documented clean-checkout quality commands are not clean-checkout reproducible. | After `npm ci`, before a build: `npm test` failed before test collection and `npx tsc --noEmit` failed (`TS5083 Cannot read .../.wxt/tsconfig.json`; WXT globals undefined). Both pass only after `npm run build` creates `.wxt/`. |
| High | Live deployment lacks a Content-Security-Policy and does not apply its shipped cache policy. | Live root, JS, ZIP, image, and `sw.js` responses have no `Content-Security-Policy`; all report `Cache-Control: public, must-revalidate, max-age=30`. This contradicts shipped `_headers` rules for immutable hashed assets and `sw.js` no-cache. |
| High | No designed 404 route is deployed. | `GET /no-such-route` returns 200 and the ordinary landing page. `/demo` is likewise silently rewritten to the landing page. |
| High | The brief’s success measure lacks acceptance evidence. | No 20-snippet usability study with screen-reader/auditory-workflow users is present; the prior handoff explicitly says it was not run. |

## Tests and checks performed

| Check | Result | Evidence |
|---|---|---|
| Clean dependency install | PASS | `npm ci`: 183 packages, audit 0 vulnerabilities. |
| Claims tests from clean clone | **FAIL / impossible** | Required manifest missing. |
| Clean `npm test` | **FAIL** | Vitest cannot resolve `./.wxt/tsconfig.json`; no tests collected. |
| Clean `npx tsc --noEmit` | **FAIL** | Missing `.wxt/tsconfig.json`; `defineBackground`/`defineContentScript` unresolved. |
| Exact production build | PASS | `npm run build` completed: extension 29.07 kB; initial site JS 6.53 kB (2.77 kB gzip), CSS 9.89 kB (3.01 kB gzip). |
| Gates after build generation | PASS, non-clean only | `npm run check`: TypeScript, 5 Vitest tests, production build, extension smoke, and 6 Playwright tests all passed. |
| Extension public artifact | PASS | Live ZIP decompression passed. Its unpacked file contents are byte-identical to the freshly built ZIP; outer ZIP hashes differ because archive metadata differs. The Playwright extension smoke test passed. |
| Representative live station flow | PASS | On 390px, selection plus pronunciation mapping changed spoken preview to `const furn gets plant optional dot name`; rate boundary showed `1.5×`; blank input showed “Nothing to read” and recovered after valid code. |
| Desktop + 390px and keyboard | PASS | No horizontal overflow at 1440px or 390px. Tab reached all sampled controls; focus used a visible 3px rust outline. |
| Accessibility | PASS for automated baseline | Live axe Playwright scans at desktop and 390px had zero serious/critical violations; page has `lang=en`, title, one h1, main, skip link, and no console/page errors. |
| Reduced motion | PASS | The live page under `prefers-reduced-motion: reduce` applied 0.01ms animation/transition durations and disabled active transforms. |
| Privacy/network smoke | PASS, not a claim proof | Fresh live interaction made only same-origin requests (document, JS, CSS, icon, hero). No analytics or other third-party request was observed. Browser/OS Web Speech voice privacy remains outside this observation. |
| Offline reload | PASS, not a claim proof | After first live load and service-worker control, a new offline reload returned 200 and rendered the landing h1. |
| Deployment identity | PASS for root/artifact content | Live `/` HTML SHA-256 equals freshly built `dist/site/index.html`; unpacked live ZIP contents equal the candidate’s build. |
| Server endpoints/rate limiting | N/A | This static site/extension exposes no product API or sign-in endpoint; no rate-limit test applies. |

## Additional notes

- The deployed response includes HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`.
- Live first-load assets are within the stated JS/CSS budgets. No Lighthouse score is recorded here; release is already blocked by contract failures.
- No product code was changed during verification.

## Required remediation before re-verification

1. Add `.factory/claims.json` and one independently runnable demo-entry test per user-facing claim.
2. Implement/document `/demo` or `?demo=1` as an isolated sample-data sandbox, including the required persistent banner, reset/exit actions, and storage separation.
3. Rewrite the first screen in the required plain-word shape, with the exact visible “Try it with sample data” action.
4. Either ship the required VS Code extension/job-to-be-done or formally change the researched acceptance scope before a new candidate is submitted.
5. Make tests/typecheck work immediately after `npm ci`, without relying on untracked generated `.wxt` output.
6. Deploy an effective CSP, correct immutable/no-cache response policies, and a real styled 404.
7. Complete and report the 20-snippet accessibility usability study.
