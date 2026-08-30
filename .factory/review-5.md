# Adversarial first-read review 5 — Code Listen Cursor

Date: 2026-08-30

Work order: `code-listen-cursor-review-5`

Candidate: `0cc26493d2c29d65e4627353c85c979ff262725c`

Live URL: <https://code-listen-cursor.sociobot.in/>

Reviewer mode: fresh Chromium contexts at 390 × 844 and 1440 × 900,
plus a clean clone of the candidate.

## Verdict: FAIL

The product is clear, tryable, private in the tested paths, and functionally
complete. Every declared claim command and the full quality gate pass. This is
still a **FAIL** because the shared header has one ambiguous direct-download
action. It does not name which of the two advertised extensions it downloads.
PASS requires zero findings.

## Findings

### F-5-1 — Minor — The header download action does not name its result

**Location:** every live route at desktop width; `site/index.html:59-62`,
`site/demo/index.html:56`, `site/privacy/index.html:58`,
`site/terms/index.html:58`, and `site/404.html:58`.

**Exact text:** “Download”.

**Evidence:** the site offers both a Chrome/Edge ZIP and a VS Code VSIX. The
shared header action says only **Download**, but it immediately downloads
`code-listen-cursor-chrome.zip`. It does not open the two-package installation
section or identify the browser package. The landing installation actions do
name their results: “Download Chrome or Edge ZIP” and “Download VS Code
extension.”

**Why this fails:** a first-time visitor cannot know which package the header
will download. The label is a verb without its result, and a VS Code visitor
can receive the wrong package without warning.

**Concrete fix:** change the direct action to **“Download browser ZIP”** on all
routes. Alternatively, link to `/#install-title` and label it **“Choose an
extension”**. Add a regression that checks the shared label, target, and
download filename on every route.

## Cold first read

Before scrolling, the reviewer could answer all three questions on phone and
desktop:

- **What it does:** reads selected code or the current line aloud and names
  symbols and indentation.
- **For whom:** developers who read better by ear.
- **What to click first:** **Try it with sample data**.

The exact supporting text was “For developers who read better by ear, it reads
a selection or current line and names its symbols and indentation.” The action
was immediately followed by “Opens an editable reader with sample code and
spoken output.”

At 390 px, the headline, audience sentence, primary action, outcome, and all
three facts ended at 692 px in the 844 px viewport. At 1440 px, they ended at
899 px in the 900 px viewport. Neither layout overflowed horizontally. Both
fresh contexts had only same-origin requests and no console or page errors.
The first-read check passes.

## Copy audit

Counts use whitespace-separated visible words. URLs and code paths count as
one word when rendered as one token. Headings, controls, navigation, image
alternatives, and non-sentence fragments were reviewed separately. No sentence
exceeds 22 words, contains a banned marketing adjective, or uses an undefined
task metaphor.

### Landing page sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | For developers who read better by ear, it reads a selection or current line and names its symbols and indentation. | 20 | Pass |
| 2 | Opens an editable reader with sample code and spoken output. | 10 | Pass |
| 3 | Demo code stays in your browser. | 6 | Pass |
| 4 | Works offline after the first visit. | 6 | Pass |
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
| 15 | Preview changes are not saved. | 5 | Pass |
| 16 | The demo still works with a voice installed on your device. | 11 | Pass |
| 17 | If speech is silent, reconnect once or choose a local system voice. | 12 | Pass |
| 18 | Select the exact code you need. | 7 | Pass |
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
| 5 | Tests run both packaged extensions with separate local data. | 9 | Pass |
| 6 | Open `https://code-listen-cursor.sociobot.in/demo/` or run the site locally and open `/demo/`. | 10 | Pass |
| 7 | The demo has sample code, a persistent sandbox banner, and reset controls. | 12 | Pass |
| 8 | It stores only a demo-prefixed pronunciation setting. | 7 | Pass |
| 9 | Start for real clears the demo setting; see `.factory/demo.md`. | 9 | Pass |
| 10 | Run `npm ci && npm run build`, or download a package from the live site. | 15 | Pass |
| 11 | Unzip `dist/site/downloads/code-listen-cursor-chrome.zip`. | 2 | Pass |
| 12 | Open `chrome://extensions` or `edge://extensions`. | 4 | Pass |
| 13 | Enable Developer mode, choose Load unpacked, and select the unzipped directory. | 11 | Pass |
| 14 | The unpacked browser build is at `dist/extension/chrome-mv3`. | 7 | Pass |
| 15 | `dist/site/downloads/code-listen-cursor-vscode.vsix` is the native VS Code package; install it with Extensions: Install from VSIX. | 14 | Pass |
| 16 | The VS Code extension reads the active selection or current line. | 11 | Pass |
| 17 | It provides listen, repeat, follow, stop, and Code Listen Cursor: Open Reading Settings commands. | 14 | Pass |
| 18 | Its settings panel includes language, punctuation, voice, rate, pitch, indentation, and personal pronunciations. | 13 | Pass |
| 19 | Both extensions export and import the same versioned JSON pronunciation file. | 11 | Pass |
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

### Headings and actions

The landing headings name their sections: “Listen before you install,” “Spoken
preview,” “How the code reader works,” “Selection or current line,” “Hear
symbols and indentation,” “Follow and repeat,” “Set pronunciations for project
words,” “Code stays on your device,” and “Install the extension.” README
headings also identify their sections.

The primary and in-page actions name results: “Try it with sample data,”
“Preview the reader,” “Listen to code,” “Stop,” “Preview sample pronunciation,”
“Read the privacy note,” “Download Chrome or Edge ZIP,” and “Download VS Code
extension.” The shared header’s bare “Download” is the sole flag, F-5-1.

Terminology is consistent: **sample code**, **spoken preview**, **extension**,
**pronunciation**, **pronunciation file**, **demo**, and **selection or current
line** retain one meaning each.

## Demo and sandbox result

**PASS.** One click from the landing page opened `/demo/`. At 390 × 844, the
persistent banner occupied 69–193 px, the realistic editable JavaScript sample
358–462 px, **Listen to code** 470–514 px, and the precomputed spoken result
702–781 px. All appeared in the first post-click viewport.

With a mocked local voice, selecting `fern`, saving `fern` → `frond`, and
activating **Listen to code** produced and spoke exactly `frond`. The only
stored item was `demo:code-listen-cursor:pronunciation`. **Reset demo** removed
it and restored the sample. After adding `demo:extra` and a `real:sentinel`,
**Start for real** removed the demo key, preserved the real sentinel, and opened
`/#install-title`. The complete landing, demo, and exit flow made only
same-origin requests.

An independent live offline context loaded `/demo/`, waited for service-worker
control, disabled networking, reloaded, changed the sample to
`const offlineFern = 3;`, and activated **Listen to code**. The cached reader
produced and spoke “const offline Fern gets 3.”

The landing pronunciation preview created no storage key. Reload restored the
shipped `furn` value. Demo mode did not read or write an extension namespace.

## Claims result

Every exact command in `.factory/claims.json` ran separately from clean clone
`0cc26493d2c29d65e4627353c85c979ff262725c`. Repeated package commands were run
again for every ledger entry that names them.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| demo-sandbox | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS |
| demo-reader | `npm run test:e2e -- --grep @claim:demo-reader` | PASS |
| no-code-upload | `npm run test:e2e -- --grep @claim:no-code-upload` | PASS |
| structure-aware-speech | `npm test -- --testNamePattern @claim:structure-aware-speech` | PASS |
| local-voice | `npm run test:e2e -- --grep @claim:local-voice` | PASS |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| landing-preview-ephemeral | `npm run test:e2e -- --grep @claim:landing-preview-ephemeral` | PASS |
| free-download | `npm run test:e2e -- --grep @claim:free-download` | PASS |
| browser-reader-controls | `npm run test:installed` | PASS |
| browser-reader-settings | `npm run test:installed` | PASS |
| portable-pronunciations | `npm run test:installed && npm run test:vscode-installed` | PASS |
| browser-shortcut-configuration | `npm run test:installed` | PASS |
| installed-package-privacy | `npm run test:installed` | PASS |
| vscode-reader-controls | `npm run test:vscode-installed` | PASS |
| vscode-package-privacy | `npm run test:vscode-installed` | PASS |
| generated-artwork-provenance | `npm test -- --testNamePattern @claim:generated-artwork-provenance` | PASS |
| mit-license | `npm test -- --testNamePattern @claim:mit-license` | PASS |

The claim-like landing and README copy maps to the ledger’s demo, reader,
privacy, offline, package-control, settings, pronunciation-transfer, shortcut,
artwork, download, and license entries. Build paths and commands are developer
instructions and were independently exercised by `npm run check`. No unlisted
product claim or untested listed claim was found.

The full clean-clone `npm run check` also passed: lint and typecheck, 20/20
Vitest tests, production build, package checks, installed browser and VS Code
harnesses, and 40/40 desktop/mobile Playwright tests. The live root HTML exactly
matched the clean build by SHA-256.

## History check

Every earlier review, polish report, and handoff was read. Each earlier finding
was checked in current source, by its regression in the clean full suite, and
against the live site where applicable.

| Earlier ID | Current verification |
| --- | --- |
| F-1-1 | Fixed: Privacy navigation and Back focus the destination H1 and announce it at both widths. |
| F-1-2 | Fixed: “How the code reader works” remains the section heading. |
| F-1-3 | Fixed: “Set pronunciations for project words” remains the heading. |
| F-1-4 | Fixed: “Code stays on your device” remains the privacy heading. |
| F-1-5 | Fixed: landing previews; `/demo/` saves only in the demo namespace. |
| F-1-6 | Fixed: the README build explanation remains two short sentences. |
| V-9-1 | Fixed: spoken output remains a named, focusable, keyboard-scrollable region. |
| F-2-1 | Fixed: landing changes are labelled temporary, create no key, and disappear on reload. |
| F-2-2 | Fixed: the demo action outcome is adjacent and visible in the phone first screen. |
| F-2-3 | Fixed: “Spoken preview” names both output panels; readiness is status copy. |
| F-2-4 | Fixed: README names the audience without claiming a health outcome. |
| F-2-5 | Fixed: the untested “reviewed before use” wording remains absent. |
| F-3-1 | Fixed: banner, sample, Listen, and spoken output all fit in the first phone demo viewport. |
| F-3-2 | Fixed: `@claim:demo-reader` enters `/demo/` and asserts selection and current-line speech. |
| F-3-3 | Fixed: leaving clears every demo key while preserving a real-data sentinel. |
| F-3-4 | Fixed: the installed ZIP and VSIX round-trip the same version-1 pronunciation JSON. |
| F-3-5 | Fixed: public copy names symbols and indentation instead of “spoken structure.” |
| F-3-6 | Fixed: “Fig. A” remains absent. |
| F-3-7 | Fixed: the README heading remains “Use the code reader.” |
| F-3-8 | Fixed: the shared header/footer and product one-liner are visible on every route at 390 px. |
| F-4-1 | Fixed: the offline claim edits code and asserts preview plus local speech after offline reload. |
| F-4-2 | Fixed: `demo-sandbox` lists and tests Start-for-real clearing with real-data preservation. |
| F-4-3 | Fixed: `landing-preview-ephemeral` lists and tests the no-save/reload behavior. |
| F-4-4 | Fixed: README says tests run both packaged extensions with separate local data. |
| F-4-5 | Fixed: README consistently says “Both extensions.” |

No earlier finding is reopened.

## Structure, accessibility, privacy, and visual review

- `/`, `/demo/`, `/privacy/`, `/terms/`, both downloads, assets,
  `robots.txt`, and `sitemap.xml` returned 200. Both GitHub destinations
  returned 200. An unknown route returned the designed 404 document with HTTP
  404 and routes home and to the demo.
- Every public document has `lang=en`, exactly one H1, one main landmark, a
  route-specific title, description, canonical, Open Graph and Twitter data,
  product social image, SVG favicon, and Apple touch icon. Heading order is
  valid.
- The same four-link header and same footer destinations appear on every route.
  The only shared-navigation issue is the ambiguous label in F-5-1.
- Live Axe scans found zero violations on all five documents at 1440 px and
  390 px. The worker URL verifier passed in 772 ms with no console error, page
  error, missing image alternative, or unlabelled button.
- Security headers include a same-origin CSP, `frame-ancestors 'none'`,
  `X-Content-Type-Options`, and `Referrer-Policy`. No third-party font, script,
  analytics request, or runtime model endpoint was observed.
- The botanical field-guide artwork, paper palette, serif/monospace pairing,
  specimen layout, and cursor motif are product-specific. The page does not
  use a generic SaaS hero or feature-card template.

## Missed leverage

No missing AI feature is justified. The job is deterministic local code
speech; sending source to a model would weaken the central privacy boundary.
The obvious privacy-preserving transfer feature is already present: both
extensions import and export the same pronunciation file. Cloud sync is not
required by the brief.

## What would make this perfect

Resolve F-5-1 by naming the browser ZIP in the shared header action or linking
to the two-package chooser. Add the cross-route label/target regression, then
repeat the cold read and link crawl. With that sole finding removed and no new
regression, the review can pass.
