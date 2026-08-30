# Adversarial first-read review 4 — Code Listen Cursor

Date: 2026-08-30

Work order: `code-listen-cursor-review-4`

Candidate: `c711109c25cdbee37a4ec0338bb35d72c7d8fedf`

Live URL: <https://code-listen-cursor.sociobot.in/>

Reviewer mode: fresh Chromium contexts at 390 × 844 and 1440 × 900,
plus a clean clone of the candidate.

## Verdict: FAIL

The cold landing screen is clear, the one-click demo works, and all 16 declared
claim commands exit successfully. This review still fails. The official
offline test can pass when the reader JavaScript is unavailable, and the
required footer one-liner is hidden from phone users. Four additional copy and
claim-ledger findings remain. PASS requires zero findings and no untested
claim.

## Cold first read

Before scrolling, the reviewer could answer all three questions on both phone
and desktop:

- **What it does:** reads a selection or current code line aloud and names its
  symbols and indentation.
- **For whom:** developers who read better by ear.
- **What to click first:** **Try it with sample data**.

The exact first-screen text was “Listen to code without losing your place” and
“For developers who read better by ear, it reads a selection or current line
and names its symbols and indentation.” The primary action was followed by
“Opens an editable reader with sample code and spoken output.” All three plain
facts were visible by 692 px in the 844 px phone viewport. There was no
horizontal overflow, third-party request, console error, or page error.

## Findings

### F-3-8 — BLOCKING — The required footer one-liner is still hidden on phones

**Location:** every live route at 390 px; `site/style.css` under
`@media (max-width: 900px)` and `site/legal.css` under
`@media (max-width: 600px)`.

**Exact text:** “Reads selected code and names its symbols and indentation.”

**Evidence:** the line is present in each HTML footer and visible at 1440 px,
but both responsive styles set `.product-line { display: none; }`. In fresh
390 px contexts, `innerText` for every footer omitted the line. This is a
half-fix of the earlier finding: the footer markup is shared, but the required
content is unavailable visually and to assistive technology on the reviewer's
phone.

**Why this fails:** the site-structure contract requires the product one-liner
in the footer on every route. The round-three repair explicitly promised that
same one-liner. Hiding it at the required phone width leaves F-3-8 incomplete,
so the history rule makes it blocking again under the same ID.

**Concrete fix:** remove both responsive `display: none` rules and let the line
wrap in the one-column footer. Extend `@regression:review-3-closure` with a
390 px visibility assertion for `.product-line` on `/`, `/demo/`, `/privacy/`,
`/terms/`, and `/404.html`.

### F-4-1 — BLOCKING — The offline claim test proves only that a static heading loads

**Location:** `.factory/claims.json`, claim `offline-reload`; and
`tests/e2e/claims.spec.ts:69-93`.

**Exact claim:** “Works offline after the first visit.”

**Evidence:** the declared command exits 0, but after setting the browser
offline its only product assertion is that the static heading “Try the code
reader” is visible. It never checks that the cached JavaScript initializes,
that the sample produces spoken output, or that **Listen to code** reaches a
local voice. The test would still pass if the offline shell loaded while the
reader script or its dependencies failed.

An independent live check did confirm the current deployment works: after an
offline reload, editing the sample to `const offlineFern = 3;` produced
“const offline Fern gets 3” and sent that text to a mocked local voice. That
manual result does not make the ledger regression adequate.

**Why this fails:** the claims contract requires the test to assert the
promised observable outcome, not merely page chrome. The public claim remains
unguarded and therefore untested for release purposes.

**Concrete fix:** install a local speech mock before the first visit, go
offline after service-worker control, reload, edit or select sample code,
activate **Listen to code**, and assert the new preview plus one local
`speak()` call. Keep the test in its own browser context.

### F-4-2 — Major — “Start for real” storage clearing is an unlisted claim

**Location:** `README.md:11` and live `/privacy/`:
“Start for real clears the demo setting” / “Start for real clears demo keys
before opening installation.”

**Evidence:** `.factory/claims.json` has no entry that states this behavior.
The `demo-sandbox` entry promises isolated settings and Reset behavior only.
Its tagged test also stops after Reset. A separate test tagged
`@regression:review-3-demo-leave` proves the current behavior, but it is not a
listed claim test.

**Why this fails:** a visitor can rely on the privacy statement when leaving
the sandbox. The claims ledger must enumerate every such statement, even when
an unlisted regression happens to cover it.

**Concrete fix:** expand `demo-sandbox` to state that **Start for real** clears
demo keys and preserves real keys. Add those assertions to its sole tagged
test, or add a distinct claim entry and retag the existing regression.

### F-4-3 — Major — The landing preview's no-save promise is an unlisted claim

**Location:** live landing reader and `site/index.html:222`:
“Preview changes are not saved.”

**Evidence:** no `.factory/claims.json` entry states that landing-preview
changes are temporary. The behavior is covered only by
`@regression:review-2-landing-preview`, not by a declared claim test.

**Why this fails:** this is a direct storage/privacy promise. A visitor can
rely on it, so it must appear in the claim ledger and have exactly one tagged
test.

**Concrete fix:** add a `landing-preview-ephemeral` claim for the landing
reader. Retag the existing regression so its clean reload and empty-storage
assertions are the claim's exact test.

### F-4-4 — Minor — The README uses internal test jargon

**Location:** `README.md:5`: “Installed-package tests verify the browser and VS
Code flows against isolated local data.”

**Why this fails:** “installed-package tests” and “flows” describe the test
harness rather than the observable check. “Flows” does not tell a reader what
was exercised.

**Concrete fix:** rewrite it as: **“Tests run both packaged extensions with
separate local data.”**

### F-4-5 — Minor — “Settings surfaces” is jargon and breaks the extension terminology

**Location:** `README.md:20`: “Both settings surfaces export and import the
same versioned JSON pronunciation file.”

**Why this fails:** the README and landing page otherwise call these products
“extensions.” “Settings surfaces” is interface-design jargon and creates a
second term for the same two places.

**Concrete fix:** rewrite it as: **“Both extensions export and import the same
versioned JSON pronunciation file.”**

## Copy audit

Counts use whitespace-separated visible words; a URL or code path is one word.
Image alternative text is included. Code blocks, headings, labels, navigation,
and list fragments that are not sentences were reviewed separately. No
sentence exceeds 22 words and no banned marketing adjective appears.

### Landing sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | For developers who read better by ear, it reads a selection or current line and names its symbols and indentation. | 20 | Pass |
| 2 | Opens an editable reader with sample code and spoken output. | 10 | Pass |
| 3 | Demo code stays in your browser. | 6 | Pass |
| 4 | Works offline after the first visit. | 6 | F-4-1 |
| 5 | Free to download. | 3 | Pass |
| 6 | No account. | 2 | Pass |
| 7 | An open botanical field notebook where a fern’s branching fronds resemble indented lines of code beside a green reading cursor. | 20 | Pass |
| 8 | An illustration of branching code structure. | 6 | Pass |
| 9 | Select code below, or place the cursor on a line, then listen. | 12 | Pass |
| 10 | The reader uses only a voice your browser marks as local. | 11 | Pass |
| 11 | Ready to listen. | 3 | Pass |
| 12 | Select code or leave the cursor on a line. | 9 | Pass |
| 13 | Your spoken code appears here. | 5 | Pass |
| 14 | When this preview has more text, focus it and use the Arrow keys or Page Down to read the rest. | 20 | Pass |
| 15 | Preview changes are not saved. | 5 | F-4-3 |
| 16 | The demo still works with a voice installed on your device. | 11 | F-4-1 |
| 17 | If speech is silent, reconnect once or choose a local system voice. | 12 | Pass |
| 18 | Select the exact code you need. | 6 | Pass |
| 19 | With no selection, the reader uses the cursor’s line. | 9 | Pass |
| 20 | Braces, operators, indentation, camel case, and snake case become explicit spoken labels. | 12 | Pass |
| 21 | Move through a file hands-free or replay the last code without losing your position. | 14 | Pass |
| 22 | Teach project names and abbreviations once. | 6 | Pass |
| 23 | Export the map, then import it in the other extension. | 10 | Pass |
| 24 | The reader does not send code to a Code Listen Cursor service. | 12 | Pass |
| 25 | It speaks only through voices your browser marks as local. | 10 | Pass |
| 26 | Download and unzip the extension. | 5 | Pass |
| 27 | Open `chrome://extensions` or `edge://extensions`. | 4 | Pass |
| 28 | Enable developer mode, choose “Load unpacked,” and select the unzipped folder. | 11 | Pass |
| 29 | Keyboard shortcuts can be changed in your extension shortcut settings. | 10 | Pass |
| 30 | The landing artwork was generated for this project with Azure AI Foundry. | 12 | Pass |
| 31 | Reads selected code and names its symbols and indentation. | 9 | Pass |

### README sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Code Listen Cursor reads selected code or the current line aloud. | 11 | Pass |
| 2 | It names symbols and indentation for developers who read better by ear. | 12 | Pass |
| 3 | It includes cursor follow, repeat, punctuation levels, reading rate, indentation controls, local-only speech, and a pronunciation map. | 17 | Pass |
| 4 | Export that map from one extension and import it in the other. | 12 | Pass |
| 5 | Installed-package tests verify the browser and VS Code flows against isolated local data. | 13 | F-4-4 |
| 6 | Open `https://code-listen-cursor.sociobot.in/demo/` or run the site locally and open `/demo/`. | 10 | Pass |
| 7 | The demo has sample code, a persistent sandbox banner, and reset controls. | 12 | Pass |
| 8 | It stores only a demo-prefixed pronunciation setting. | 7 | Pass |
| 9 | Start for real clears the demo setting; see `.factory/demo.md`. | 9 | F-4-2 |
| 10 | Run `npm ci && npm run build`, or download a package from the live site. | 15 | Pass |
| 11 | Unzip `dist/site/downloads/code-listen-cursor-chrome.zip`. | 2 | Pass |
| 12 | Open `chrome://extensions` or `edge://extensions`. | 4 | Pass |
| 13 | Enable Developer mode, choose Load unpacked, and select the unzipped directory. | 11 | Pass |
| 14 | The unpacked browser build is at `dist/extension/chrome-mv3`. | 7 | Pass |
| 15 | `dist/site/downloads/code-listen-cursor-vscode.vsix` is the native VS Code package; install it with Extensions: Install from VSIX. | 14 | Pass |
| 16 | The VS Code extension reads the active selection or current line. | 11 | Pass |
| 17 | It provides listen, repeat, follow, stop, and Code Listen Cursor: Open Reading Settings commands. | 14 | Pass |
| 18 | Its settings panel includes language, punctuation, voice, rate, pitch, indentation, and personal pronunciations. | 13 | Pass |
| 19 | Both settings surfaces export and import the same versioned JSON pronunciation file. | 13 | F-4-5 |
| 20 | Select code on any HTTP(S) page and press `Alt+Shift+S`. | 9 | Pass |
| 21 | With no selection, the current text line is read. | 9 | Pass |
| 22 | Press `Alt+Shift+F` to follow the cursor, `Alt+Shift+R` to repeat, or `Alt+Shift+X` to stop. | 13 | Pass |
| 23 | Open the extension popup to tune punctuation, indentation, voice, rate, and pronunciations. | 12 | Pass |
| 24 | Export pronunciations, then import the file in the other extension. | 10 | Pass |
| 25 | The file contains word pairs, never code. | 7 | Pass |
| 26 | Browser extension shortcuts are configurable. | 5 | Pass |
| 27 | If a shortcut overlaps with assistive technology, change it at `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`. | 13 | Pass |
| 28 | Requirements: Node.js 20+ and npm. | 5 | Pass |
| 29 | `npm run build:site` writes the deployment to `dist/site/`. | 8 | Pass |
| 30 | That folder includes the demo, legal pages, packages, and service worker. | 11 | Pass |
| 31 | See the site’s privacy note. | 5 | Pass |
| 32 | The reader uses only voices that the browser or editor marks as local. | 13 | Pass |
| 33 | If none is available, it keeps the spoken preview and does not start speech. | 14 | Pass |
| 34 | Please report bugs without including private source code. | 8 | Pass |
| 35 | MIT. | 1 | Pass |
| 36 | See LICENSE. | 2 | Pass |

Landing and README headings identify their sections. The landing and demo
actions use result-naming verbs in context. The only terminology failure is
F-4-5; the only other plain-language failure is F-4-4.

## Demo and sandbox result

The demo itself passes the live behavior check. One click from `/` opened
`/demo/`. At 390 × 844, the persistent banner occupied 69–193 px, the editable
sample 358–462 px, **Listen to code** 470–514 px, and the realistic spoken
output 702–781 px. All were in the first post-click viewport. Desktop also
showed the complete reader and output.

With a mocked local voice, selecting `fern`, saving `fern` → `frond`, and
activating **Listen to code** produced one utterance containing “frond.” Only
`demo:code-listen-cursor:pronunciation` was written. **Reset demo** removed it
and restored the sample. After reseeding that setting and a real-data sentinel,
**Start for real** removed the demo key, retained the sentinel, and opened
`/#install-title`. Every observed request used the product origin. The product
behavior passes; F-4-2 and F-4-3 concern the required claim ledger.

## Claims result

A clean clone at the candidate SHA ran `npm ci --include=dev` and every exact
command from `.factory/claims.json`, including repeated package commands.
Every command exited 0. The offline row fails coverage review under F-4-1.

| Claim ID | Command result | Coverage result |
| --- | --- | --- |
| demo-sandbox | PASS | PASS for save/reset isolation; does not list the Start-for-real copy (F-4-2) |
| demo-reader | PASS | PASS |
| no-code-upload | PASS | PASS |
| structure-aware-speech | PASS | PASS |
| local-voice | PASS | PASS |
| offline-reload | PASS | **FAIL — F-4-1** |
| free-download | PASS | PASS |
| browser-reader-controls | PASS | PASS |
| browser-reader-settings | PASS | PASS |
| portable-pronunciations | PASS | PASS |
| browser-shortcut-configuration | PASS | PASS |
| installed-package-privacy | PASS | PASS |
| vscode-reader-controls | PASS | PASS |
| vscode-package-privacy | PASS | PASS |
| generated-artwork-provenance | PASS | PASS |
| mit-license | PASS | PASS |

The full clean-clone `npm run check` also passed: typecheck, lint, 19/19
Vitest tests, production build, package checks, installed browser and VS Code
harnesses, and 40/40 desktop/mobile Playwright cases. The build emitted 3.63 kB
of first-party JavaScript gzip. Live root HTML and JavaScript hashes matched
the clean build.

## History check

Every earlier review, polish report, and handoff was read. Each finding was
checked against both current source and the live deployment.

| Earlier ID | Current verification |
| --- | --- |
| F-1-1 | Fixed: Privacy navigation and Back focus and announce the destination H1 at both widths. |
| F-1-2 | Fixed: “How the code reader works” remains live. |
| F-1-3 | Fixed: “Set pronunciations for project words” remains live. |
| F-1-4 | Fixed: “Code stays on your device” remains live. |
| F-1-5 | Fixed: landing previews; the demo saves in its isolated namespace. |
| F-1-6 | Fixed: the README build explanation remains two short sentences. |
| F-2-1 | Fixed: landing pronunciation changes are explicitly temporary and disappear on reload. |
| F-2-2 | Fixed: the demo action outcome is adjacent and visible in the phone first screen. |
| F-2-3 | Fixed: both output panels use “Spoken preview”; readiness is status copy. |
| F-2-4 | Fixed: the README uses an audience statement, not a health-outcome claim. |
| F-2-5 | Fixed: the untested “reviewed before use” wording remains absent. |
| V-9-1 | Fixed: spoken output remains a named, focusable scroll region; keyboard and reflow checks pass. |
| F-3-1 | Fixed: banner, sample, Listen, and spoken output are all in the first 390 px demo viewport. |
| F-3-2 | Fixed: `@claim:demo-reader` enters `/demo/` and asserts selection and current-line speech calls. |
| F-3-3 | Fixed: leaving clears demo keys and retains a real-data sentinel. |
| F-3-4 | Fixed: both packages import and export the same version-1 pronunciation JSON. |
| F-3-5 | Fixed: public copy names symbols and indentation instead of “spoken structure.” |
| F-3-6 | Fixed: “Fig. A” remains absent. |
| F-3-7 | Fixed: the README heading remains “Use the code reader.” |
| F-3-8 | **Reopened:** headers are consistent, but the promised footer one-liner is hidden at 390 px. |

## Structure, accessibility, privacy, and visual checks

- `/`, `/demo/`, `/privacy/`, `/terms/`, downloads, `robots.txt`, and
  `sitemap.xml` returned 200. Every discovered internal and GitHub link returned
  200. An unknown URL returned the designed 404 document with HTTP 404 and a
  way home.
- Every public document has `lang=en`, one H1, one main landmark, a
  route-specific title under 60 characters, description, canonical URL,
  Open Graph/Twitter metadata, SVG favicon, Apple touch icon, and product social
  image. Headings are ordered.
- Security headers include same-origin CSP, `frame-ancestors 'none'`,
  `X-Content-Type-Options`, and `Referrer-Policy`. No third-party font or script
  loaded.
- Live Axe scans found zero violations on all five documents at both widths.
  The worker URL verifier passed in 908 ms with no console error, page error,
  missing image alternative, or unlabelled button. The full suite also passed
  touch-target, focus-contrast, reduced-motion, keyboard-scroll, and 200% reflow
  checks.
- The botanical field-guide art, paper palette, specimen layout, and
  serif/monospace pairing are specific to this code-listening product. It does
  not look like a generic SaaS template.
- Header destinations are now consistent. Footer destinations are consistent,
  but F-3-8 remains because the phone footer suppresses required content.

## Missed leverage

No missing AI feature is justified. The core job is deterministic, local code
speech; sending source to a model would weaken the product's central privacy
boundary. The previously missing high-value transfer feature is now present:
both packages import and export a shared pronunciation file. Cloud sync is not
implied by the brief and would add storage risk without being necessary.

## What would make this perfect

Show the shared product one-liner in every phone footer. Make the offline claim
test exercise the reader and local speech after the network is disabled. Add
the two storage promises to the claim ledger with exactly tagged tests. Replace
the two README jargon phrases. Then rerun every claim command and the complete
live review from fresh contexts; PASS is appropriate only if nothing else
remains.
