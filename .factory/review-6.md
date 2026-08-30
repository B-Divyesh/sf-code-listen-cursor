# Adversarial first-read review 6 — Code Listen Cursor

Date: 2026-08-30

Work order: `code-listen-cursor-review-6`

Candidate: `34f6abfa3078b394c381728e36d64d8d70ef5bd2`

Live URL: <https://code-listen-cursor.sociobot.in/>

Reviewer mode: fresh Chromium contexts at 390 × 844 and 1440 × 900,
plus a clean clone of the candidate.

## Verdict: FAIL

The first screen is clear, the sample reader opens in one click, every listed
claim command passes, and the site/package quality gate passes. This review
still fails because **Reset demo does not reset the complete reader state**.
It can leave old speech running and replace the original spoken preview with
only “close brace.” A second plain-words finding remains on the unnamed
**Stop** actions. PASS requires zero findings.

## Findings

### F-6-1 — BLOCKING — Reset demo leaves stale speech and the wrong preview

**Location:** live `/demo/`; `site/main.ts:136-149`; the storage-only Reset
assertions at `tests/e2e/claims.spec.ts:12-15`.

**Exact text/state:** the action says **“Reset demo.”** The initial spoken
preview is “const describe Plant gets a sink open paren fern close paren arrow
open brace.” After editing the sample, selecting `kubectl`, listening to “cube
control,” and activating Reset, the code and controls returned to their
defaults but the preview became only **“close brace.”** An active utterance was
not cancelled, and the reader's listening class was not removed.

**Code evidence:** the handler assigns `sample.value = originalSample` and then
calls `updatePreview()`. It does not restore `selectionStart` and
`selectionEnd`. Assigning the value leaves the caret at the end, so the preview
is generated from the final `};` line. The handler also does not call
`speechSynthesis.cancel()` or clear `.is-listening`.

**Why this fails:** Reset must return the sandbox to a predictable clean state.
Instead, a first-time visitor can see the original sample beside an unrelated
one-line preview while stale speech continues. The demo requirement explicitly
asks whether Reset works; an incomplete reset is therefore blocking.

**Concrete fix:** in the Reset handler, cancel speech, remove the listening
class, restore the original code and control values, set the selection/caret to
the original position (currently `0, 0`), and only then rebuild the initial
preview. Extend `@claim:demo-sandbox` to assert the restored code, selection,
spoken preview, status, controls, stopped speech, removed demo keys, and
preserved real-data sentinel.

### F-6-2 — Minor — “Stop” does not name what the button stops

**Location:** landing reader at `site/index.html:153-159` and demo reader at
`site/demo/index.html:88-94`.

**Exact text:** **“Stop.”**

**Why this fails:** the plain-words rule requires a button to use a verb that
names its result. “Stop” is ambiguous when heard in a screen-reader button list
or encountered away from the adjacent Listen action.

**Concrete fix:** rename both buttons **“Stop speech”** and update their
accessible-name selectors in the browser tests.

## Cold first read

Before scrolling, the reviewer could answer all three required questions on
phone and desktop:

- **What it does:** reads selected code or the current line aloud and names
  symbols and indentation.
- **For whom:** developers who read better by ear.
- **What to click first:** **Try it with sample data**.

The exact first-screen text was “Listen to selected code, symbols, and
indentation” and “For developers who read better by ear, it reads a selection
or current line and names its symbols and indentation.” The primary action was
immediately followed by “Opens an editable reader with sample code and spoken
output.” All three facts were fully visible at 390 × 844 and 1440 × 900. Both
layouts had no horizontal overflow, third-party request, console error, or page
error. The cold first-read check passes.

## Copy audit

Counts use visible whitespace-separated words. A rendered URL, file path, or
keyboard chord counts as one word. No sentence exceeds 22 words, contains a
banned marketing adjective, or uses inconsistent product terminology. F-6-2
is the only action-label flag.

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

### Headings, actions, and terminology

Landing and README headings identify their sections without metaphor or brand
lore. Terminology is consistent: **sample code**, **spoken preview**,
**extension**, **pronunciation**, **pronunciation file**, **demo**, and
**selection or current line** retain one meaning. Actions name their result
except the two **Stop** buttons in F-6-2.

## Demo and sandbox result

**FAIL because of F-6-1.** One click from the first screen opened `/demo/`.
At 390 × 844, the persistent banner occupied 69–193 px, the H1 205–245 px,
the realistic editable sample 358–462 px, **Listen to code** 470–514 px, and
the initial spoken result 702–781 px. Every required part was in the first
post-click viewport.

With a mocked local voice, selecting `kubectl`, saving `kubectl` → `cube
control`, and activating **Listen to code** produced one local utterance:
“cube control.” The only stored item was
`demo:code-listen-cursor:pronunciation`. Start for real removed all `demo:`
keys, preserved `real:sentinel`, and opened `/#install-title`. The entire flow
made same-origin requests only. The independent offline flow reloaded the
cached demo, changed the sample to `const offlineFern = 3;`, and locally spoke
“const offline Fern gets 3.”

Reset removed the demo key and restored the code and form values, but it did
not restore the reader's derived and active state; see F-6-1.

## Claims result

Every exact command in `.factory/claims.json` ran separately after `npm ci
--include=dev` in clean clone
`/tmp/code-listen-cursor-review6.NQZxoV`. Repeated package commands were run
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

The claim-like landing, README, Privacy, and package copy maps to the ledger's
demo, reader, offline, privacy, controls, settings, transfer, shortcut,
download, artwork, and license entries. No unlisted claim was found. F-6-1 is
a missing full-reset acceptance assertion, not a failing listed claim: the
current `demo-sandbox` wording and test cover storage removal but not the rest
of the reader state.

The full clean-clone `npm run check` also passed: lint/typecheck, 21/21 Vitest
tests, build, package checks, installed browser and VS Code harnesses, and
42/42 desktop/mobile Playwright tests. `dist/site/` was produced. The built
landing JavaScript is 3.63 kB gzip in total.

## History check

Every earlier review, polish report, and handoff was read. Each earlier finding
was checked in current source, in the clean full suite, and against production
where applicable.

| Earlier ID | Current verification |
| --- | --- |
| F-1-1 | Fixed: live Privacy navigation and Back focus and announce the destination H1 at both widths. |
| F-1-2 | Fixed: “How the code reader works” remains the landing section heading. |
| F-1-3 | Fixed: “Set pronunciations for project words” remains the pronunciation heading. |
| F-1-4 | Fixed: “Code stays on your device” remains the privacy heading. |
| F-1-5 | Fixed: landing previews only; `/demo/` saves only to its `demo:` key. |
| F-1-6 | Fixed: the README build explanation remains two short sentences. |
| V-9-1 | Fixed: spoken output is still a named, focusable, keyboard-scrollable region. |
| F-2-1 | Fixed: landing changes are labelled temporary, write no key, and disappear on reload. |
| F-2-2 | Fixed: the demo-action outcome remains adjacent and visible in the phone first screen. |
| F-2-3 | Fixed: “Spoken preview” names both output panels; readiness is status text. |
| F-2-4 | Fixed: README names the audience without claiming a health outcome. |
| F-2-5 | Fixed: the untested “reviewed before use” wording remains absent. |
| F-3-1 | Fixed: banner, sample, Listen, and spoken output fit in the first phone demo viewport. |
| F-3-2 | Fixed: `@claim:demo-reader` enters `/demo/` and asserts selection and current-line speech. |
| F-3-3 | Fixed: Start for real clears every demo key while preserving a real-data sentinel. |
| F-3-4 | Fixed: the installed ZIP and VSIX round-trip the same version-1 pronunciation JSON. |
| F-3-5 | Fixed: public copy names symbols and indentation instead of “spoken structure.” |
| F-3-6 | Fixed: “Fig. A” remains absent. |
| F-3-7 | Fixed: the README heading remains “Use the code reader.” |
| F-3-8 | Fixed: the shared header/footer and product one-liner are visible on every route at 390 px. |
| F-4-1 | Fixed: the offline claim edits code and asserts the preview plus local speech after offline reload. |
| F-4-2 | Fixed: `demo-sandbox` lists and tests Start-for-real clearing with real-data preservation. |
| F-4-3 | Fixed: `landing-preview-ephemeral` lists and tests the no-save/reload behavior. |
| F-4-4 | Fixed: README says tests run both packaged extensions with separate local data. |
| F-4-5 | Fixed: README consistently says “Both extensions.” |
| F-5-1 | Fixed: every shared header says “Download browser ZIP” and downloads that file. |

No earlier finding is reopened. F-6-1 exposes a distinct reset-state case that
the prior storage checks did not exercise.

## Structure, accessibility, privacy, and visual review

- `/`, `/demo/`, `/privacy/`, `/terms/`, both downloads, `robots.txt`, and
  `sitemap.xml` returned 200. Every discovered internal and GitHub link
  returned 200. An unknown URL returned the designed 404 document with HTTP
  404 and links to Home and Demo.
- Every public document has `lang=en`, one H1, one main landmark, an appropriate
  route title, a description, canonical URL, Open Graph/Twitter metadata,
  product social image, SVG favicon, and Apple touch icon. Heading order is
  valid.
- The shared four-link header and footer appear on all routes. The product
  one-liner remains visible on phones. Deep links work. Production Privacy
  navigation and browser Back focus and announce the destination H1.
- Live Axe scans found zero violations on all five documents at 1440 px and
  390 px. The worker URL verifier loaded the root in 873 ms with no console or
  page errors, missing image alternatives, or unlabelled buttons.
- Security headers include a same-origin CSP, `frame-ancestors 'none'`,
  `X-Content-Type-Options`, and `Referrer-Policy`. No third-party font, script,
  analytics, or runtime model request was observed.
- The botanical field-guide artwork, warm paper palette, serif/monospace type,
  specimen layout, and leaf-cursor motif are recognizably specific to this
  code-listening product rather than a generic SaaS template.

## Missed leverage

No missing AI feature is justified. The job is deterministic, local code
speech; sending source to a model would weaken the central privacy boundary.
The obvious privacy-preserving transfer feature is present: the browser and VS
Code extensions import and export the same pronunciation file. Cloud sync is
not implied by the brief.

## What would make this perfect

Make Reset demo restore and stop the complete reader state, not only storage
and form values. Add the full-state assertion to its claim test. Rename both
**Stop** buttons **Stop speech**. Then repeat the live reset sequence, all 17
claim commands, the full clean-clone quality gate, and the cold phone/desktop
review. PASS is appropriate only if no new finding remains.
