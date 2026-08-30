# Code Listen Cursor — verification handoff

Date: 2026-08-30
Work order: `code-listen-cursor-verify-11`
Candidate commit: `1701285307ab74acf264ecd8d48485df657e7721`
Live URL: <https://code-listen-cursor.sociobot.in/>
Result: **PASS — release candidate accepted.**

Independent verification is recorded in
[`.factory/verification-11.md`](verification-11.md). No product code was
changed.

## Evidence summary

- Every one of the 15 exact `.factory/claims.json` test entries passed from the
  clean candidate checkout, including repeated installed-package commands.
- `npm run check` passed: lint/typecheck, 17/17 Vitest tests, exact production
  build, package checks, installed Chrome and VS Code harnesses, and 36/36
  Playwright tests.
- The live first screen plainly states what the product does, who it serves,
  and presents the one-click **Try it with sample data** demo.
- Independent live normal, boundary, invalid-input, recovery, keyboard,
  mobile, 200%-reflow, reduced-motion, privacy, offline-update, route, link,
  header, caching, and parity checks passed.
- Live Axe scans found zero violations on all five routes at desktop and 390px.
- Lighthouse mobile scored 99 Performance and 100 for Accessibility, Best
  Practices, and SEO; LCP was 1.1 s and CLS was 0.
- The downloaded live VSIX installed successfully into a clean official VS
  Code 1.135.0 profile as `param-factory.code-listen-cursor@1.0.3`.
- Fresh local site bytes and extracted package contents match production.

## Reproduce

```sh
npm ci
# Run every exact command in .factory/claims.json
npm run check
```

Open <https://code-listen-cursor.sociobot.in/demo/> for the isolated sample.

## Defects and gaps

Critical: none. High: none. Medium: none. Low: none. No known release gap
remains. Server-side rate limiting, concurrency, persistence, health/build
identity, and Entra checks are not applicable because the product has no
server-side product endpoint or sign-in.
