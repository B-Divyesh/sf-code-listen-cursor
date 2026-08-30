# Adversarial first-read review 3 — Code Listen Cursor

Date: 2026-08-30

Work order: `code-listen-cursor-review-3`

Candidate: `8c1273d0c65c45b4831a112bfed9539754c40ebf`

Live URL: <https://code-listen-cursor.sociobot.in/>

Reviewer mode: fresh Chromium contexts at 390 × 844 and 1440 × 900,
plus a clean local clone.

## Verdict: FAIL

The landing page passes the cold first-read check, and every command in the
claims ledger exits successfully. The product still fails this review. The
mobile demo does not show the product result in its first post-click viewport,
and the test assigned to the demo-reader claim neither enters the demo nor
asserts that speech occurs. Six further major or minor findings remain. PASS
requires zero findings and no untested claim.

## Cold first read

Before scrolling, the reviewer could answer all three questions on both phone
and desktop:

- **What it does:** reads selected code or the current line aloud and names
  code structure.
- **For whom:** developers who read better by ear.
- **What to click first:** **Try it with sample data**.

The exact first-screen text was “Listen to code without losing your place” and
“For developers who read better by ear, it reads a selection or current line
as spoken structure.” The primary action was followed by “Opens an editable
reader with sample code and spoken output.” At 390 px, the headline, audience
sentence, action, action outcome, and all three facts ended at 664 px in an
844 px viewport. There was no horizontal overflow, external request, console
error, or page error. This part is not blocking.

## Findings

### F-3-1 — BLOCKING — The mobile demo hides the product result below the first screen

**Location:** live `/demo/` at 390 × 844; [demo page](../site/demo/index.html),
lines 56–170.

**Exact copy and evidence:** after one click, the first screen shows “Demo —
sample data, nothing is saved,” “Listen to sample code,” and “Try the code
reader.” The editor starts at 793 px and only its top 51 px enters the 844 px
viewport. **Listen to code** starts at 1,115 px. The realistic spoken result,
“const describe Plant gets a sink open paren fern close paren arrow open
brace,” starts at 1,447 px. It is about 603 px below the fold. Desktop also
cuts off both the editor and spoken result and does not show the controls.

**Why this fails:** the required first screen after the demo click must already
show the product being used with realistic sample data. A phone visitor sees
two introductions and almost none of the actual reader. They must scroll far
enough to discover whether the promised output exists. This is a weak demo and
therefore blocking.

**Concrete fix:** remove or collapse the duplicate demo and station
introductions. At 390 × 844, keep the persistent banner and H1 while also
showing readable sample code, **Listen to code**, and the precomputed spoken
output. Add a 390 px test that asserts those four elements intersect the first
viewport after the landing action is clicked.

### F-3-2 — BLOCKING — The demo-reader claim test does not test the demo or speech

**Location:** [claims ledger](claims.json), `demo-reader`; [claim test](../tests/e2e/site.spec.ts),
lines 42–55.

**Exact claim:** “The demo reads a selection or current line and applies a
personal pronunciation.”

**Evidence:** the declared command passes, but its tagged test opens
`/#field-station`, not `/demo/`. It activates **Preview sample pronunciation**,
which exists only on the landing preview. It never activates **Listen to code**,
never supplies a local voice, and never asserts construction or delivery of a
`SpeechSynthesisUtterance`. The test proves deterministic preview text on the
landing page, not that the isolated demo reads either input case.

**Why this fails:** the ledger promises an audible behavior in the demo. A
passing test for a different route and a text preview leaves that claim
untested. A passing exit code is not evidence for the listed outcome.

**Concrete fix:** change the tagged test to open a fresh `/demo/` context,
install a mock voice with `localService: true`, save a pronunciation, select an
identifier, click **Listen to code**, and assert one utterance and one `speak`
call with the mapped words. Collapse the selection, move the cursor, listen
again, and assert the current-line utterance. Keep this test in its own browser
context.

### F-3-3 — Major — “Start for real” leaves demo data behind

**Location:** live demo banner, “Start for real”; [demo page](../site/demo/index.html),
line 60; [demo logic](../site/main.ts), lines 102–136.

**Evidence:** saving `fern` → `frond` created
`demo:code-listen-cursor:pronunciation`. Activating **Start for real** navigated
to `/`, but that demo key and value remained in local storage. Only **Reset
demo** removes it.

**Why this fails:** the demo contract requires demo data to be discarded when
leaving demo mode unless the visitor explicitly keeps it. The retained key is
isolated from real extension settings, so no real data was overwritten, but
the demo lifecycle is incomplete and “Start for real” does not actually start
installation.

**Concrete fix:** make **Start for real** remove every `demo:` key before
navigating to the real installation action, such as `/#install-title`. Add a
test that seeds a real-storage sentinel and a demo key, activates the link, and
asserts that the demo key is gone while the sentinel is unchanged.

### F-3-4 — Major — Pronunciation maps cannot move between the two advertised extensions

**Location:** browser popup personal-pronunciation controls and VS Code reading
settings; [browser popup](../entrypoints/popup/index.html), lines 85–95;
[VS Code settings](../vscode-extension/extension.ts), lines 77–87.

**Evidence:** both packages let a person add and remove pronunciations. Neither
has import, export, or local transfer. Repository search found no import,
export, or sync path for settings.

**Why this fails:** the README advertises both browser and VS Code packages and
a personal pronunciation map. A developer who teaches project names in one
package must type the same map again in the other. Import/export is the obvious
privacy-preserving completion of that brief; cloud sync is not required.

**Concrete fix:** add **Export pronunciations** and **Import pronunciations**
to both settings surfaces using the same versioned JSON format. Validate the
file locally, preview replacements before applying them, keep source code out
of the export, and add a claim plus an installed-package round-trip test for
both packages.

### F-3-5 — Minor — “Spoken structure” is undefined product jargon

**Location:** landing hero, feature heading, and footer: “as spoken structure,”
“Structure-aware speech,” and “Reads selected code as spoken structure.”

**Why this fails:** a first-time visitor must infer that “structure” means
symbols and indentation. The feature paragraph eventually explains it, but the
headline support and heading must work without surrounding copy.

**Concrete fix:** use the concrete terms everywhere. Rewrite the hero sentence
as **“For developers who read better by ear, it reads a selection or current
line and names its symbols and indentation.”** Rename the heading **“Hear
symbols and indentation.”** Rewrite the footer as **“Reads selected code and
names its symbols and indentation.”**

### F-3-6 — Minor — “Fig. A” is a decorative label with no reference

**Location:** landing illustration caption, “Fig. A”.

**Why this fails:** no copy refers to Figure A. The label is field-guide mood
rather than information a visitor can use.

**Concrete fix:** remove **“Fig. A”** and retain the informative caption, “An
illustration of branching code structure.”

### F-3-7 — Minor — The README heading “Use it” does not name the section

**Location:** [README](../README.md), line 22, “Use it”.

**Why this fails:** in a heading list, “it” has no referent. The section is
specifically about reader shortcuts and popup controls.

**Concrete fix:** rename it **“Use the code reader”**.

### F-3-8 — Minor — Header and footer destinations change between routes

**Location:** live `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.

**Evidence:** the landing header contains Demo, How it works, Privacy, and
Download. The demo header contains only Home and Privacy. Legal and 404 headers
contain Demo, Privacy, and Terms. The landing footer contains Source on GitHub;
the other footers do not. The demo footer also replaces the product one-liner
with “Sample code is not saved.”

**Why this fails:** the site skeleton requires a consistent header and footer.
Available destinations currently depend on the route, so a visitor who enters
through the demo or a legal deep link loses the direct Download and Source
paths.

**Concrete fix:** use one header destination set across routes, with the
wordmark as Home and no more than four navigation links. Use one footer with
the same product one-liner, Privacy, Terms, Source, factory credit, and version;
keep demo privacy information in the persistent banner.

## Demo and sandbox result

**FAIL because of F-3-1 and F-3-3.** The one-click entry itself works. A fresh
context opened `/demo/`, loaded realistic fern JavaScript, and precomputed the
spoken result. The persistent banner, **Reset demo**, and **Start for real**
were present. Saving `kubectl` → `cube control` wrote only
`demo:code-listen-cursor:pronunciation`. Reset removed it and restored the
sample and controls. The full edit, save, reset, and leave flow made requests
only to `https://code-listen-cursor.sociobot.in`; no third-party request was
observed. The demo never read or wrote an extension storage namespace.

The first post-click viewport remains inadequate on phone, and leaving through
**Start for real** retains the demo-prefixed key.

## Claims result

The exact command for every ledger entry was run separately from a clean clone
of `8c1273d0`. All 15 commands exited 0, including all repeated installed ZIP
and packaged VSIX commands. F-3-2 still makes `demo-reader` an untested claim:
the test's assertions do not match its route or audible outcome.

| Claim ID | Command | Coverage result |
| --- | --- | --- |
| demo-sandbox | PASS | PASS for isolated save/reset |
| demo-reader | PASS | **FAIL — F-3-2** |
| no-code-upload | PASS | PASS |
| structure-aware-speech | PASS | PASS |
| local-voice | PASS | PASS |
| offline-reload | PASS | PASS |
| free-download | PASS | PASS |
| browser-reader-controls | PASS | PASS |
| browser-reader-settings | PASS | PASS |
| browser-shortcut-configuration | PASS | PASS |
| installed-package-privacy | PASS | PASS |
| vscode-reader-controls | PASS | PASS |
| vscode-package-privacy | PASS | PASS |
| generated-artwork-provenance | PASS | PASS |
| mit-license | PASS | PASS |

No additional claim-like landing or README sentence lacked a plausible ledger
entry. The issue is the inadequate observable coverage for the listed
`demo-reader` claim, not a missing ledger row.

## Copy audit

Counts use visible whitespace-separated words; each displayed URL or path is
one word. No sentence exceeds 22 words and no banned marketing adjective is
present. F-3-5, F-3-6, and F-3-7 are the jargon, decorative-label, and heading
findings. Landing action labels otherwise name their result.

### Landing sentences

| # | Sentence | Words |
| ---: | --- | ---: |
| 1 | For developers who read better by ear, it reads a selection or current line as spoken structure. | 17 |
| 2 | Opens an editable reader with sample code and spoken output. | 10 |
| 3 | Demo code stays in your browser. | 6 |
| 4 | Works offline after the first visit. | 6 |
| 5 | Free to download. | 3 |
| 6 | No account. | 2 |
| 7 | An open botanical field notebook where a fern’s branching fronds resemble indented lines of code beside a green reading cursor. | 20 |
| 8 | An illustration of branching code structure. | 6 |
| 9 | Select code below, or place the cursor on a line, then listen. | 12 |
| 10 | The reader uses only a voice your browser marks as local. | 11 |
| 11 | Ready to listen. | 3 |
| 12 | Select code or leave the cursor on a line. | 9 |
| 13 | Your spoken code appears here. | 5 |
| 14 | When this preview has more text, focus it and use the Arrow keys or Page Down to read the rest. | 20 |
| 15 | Preview changes are not saved. | 5 |
| 16 | The demo still works with a voice installed on your device. | 11 |
| 17 | If speech is silent, reconnect once or choose a local system voice. | 12 |
| 18 | Select the exact code you need. | 6 |
| 19 | With no selection, the reader uses the cursor’s line. | 9 |
| 20 | Braces, operators, indentation, camel case, and snake case become explicit spoken labels. | 12 |
| 21 | Move through a file hands-free or replay the last code without losing your position. | 14 |
| 22 | Teach project names and abbreviations once. | 6 |
| 23 | The pronunciation map stays in extension storage. | 7 |
| 24 | The reader does not send code to a Code Listen Cursor service. | 12 |
| 25 | It speaks only through voices your browser marks as local. | 10 |
| 26 | Download and unzip the extension. | 5 |
| 27 | Open `chrome://extensions` or `edge://extensions`. | 4 |
| 28 | Enable developer mode, choose “Load unpacked,” and select the unzipped folder. | 11 |
| 29 | Keyboard shortcuts can be changed in your extension shortcut settings. | 10 |
| 30 | Reads selected code as spoken structure. | 6 |
| 31 | The landing artwork was generated for this project with Azure AI Foundry. | 12 |

### README sentences

| # | Sentence | Words |
| ---: | --- | ---: |
| 1 | Code Listen Cursor reads selected code or the current line aloud. | 11 |
| 2 | It is for developers with reading fatigue, dyslexia, low vision, or auditory workflows. | 13 |
| 3 | It includes cursor follow, repeat, punctuation levels, reading rate, indentation controls, local-only speech, and a pronunciation map. | 17 |
| 4 | Installed-package tests verify the browser and VS Code flows against isolated local data. | 13 |
| 5 | Open `https://code-listen-cursor.sociobot.in/demo/` or run the site locally and open `/demo/`. | 10 |
| 6 | The demo has sample code, a persistent sandbox banner, and reset controls. | 12 |
| 7 | It stores only a demo-prefixed pronunciation setting; see `.factory/demo.md`. | 9 |
| 8 | Run `npm ci && npm run build`, or download a package from the live site. | 15 |
| 9 | Unzip `dist/site/downloads/code-listen-cursor-chrome.zip`. | 2 |
| 10 | Open `chrome://extensions` or `edge://extensions`. | 4 |
| 11 | Enable Developer mode, choose Load unpacked, and select the unzipped directory. | 11 |
| 12 | The unpacked browser build is at `dist/extension/chrome-mv3`. | 7 |
| 13 | `dist/site/downloads/code-listen-cursor-vscode.vsix` is the native VS Code package; install it with Extensions: Install from VSIX. | 14 |
| 14 | The VS Code extension reads the active selection or current line. | 11 |
| 15 | It provides listen, repeat, follow, stop, and Code Listen Cursor: Open Reading Settings commands. | 14 |
| 16 | Its settings panel includes language, punctuation, voice, rate, pitch, indentation, and personal pronunciations. | 13 |
| 17 | Select code on any HTTP(S) page and press `Alt+Shift+S`. | 9 |
| 18 | With no selection, the current text line is read. | 9 |
| 19 | Press `Alt+Shift+F` to follow the cursor, `Alt+Shift+R` to repeat, or `Alt+Shift+X` to stop. | 13 |
| 20 | Open the extension popup to tune punctuation, indentation, voice, rate, and pronunciations. | 12 |
| 21 | Browser extension shortcuts are configurable. | 5 |
| 22 | If a shortcut overlaps with assistive technology, change it at `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`. | 13 |
| 23 | Requirements: Node.js 20+ and npm. | 5 |
| 24 | `npm run build:site` writes the deployment to `dist/site/`. | 8 |
| 25 | That folder includes the demo, legal pages, packages, and service worker. | 11 |
| 26 | See the site’s privacy note. | 5 |
| 27 | The reader uses only voices that the browser or editor marks as local. | 13 |
| 28 | If none is available, it keeps the spoken preview and does not start speech. | 14 |
| 29 | Please report bugs without including private source code. | 8 |
| 30 | MIT. | 1 |
| 31 | See LICENSE. | 2 |

### Headings and actions

Landing headings identify their sections except **“Structure-aware speech”**
(F-3-5). The decorative **“Fig. A”** label is F-3-6. The landing actions—**Try
it with sample data**, **Preview the reader**, **Listen to code**, **Stop**,
**Preview sample pronunciation**, **Read the privacy note**, and both Download
links—use result-oriented verbs in context. README headings are clear except
**“Use it”** (F-3-7). Demo **Start for real** uses the required banner label,
but its behavior is incomplete under F-3-3.

## History check

Every earlier review, polish report, and handoff was read. Each earlier finding
was checked against both the live site and current source rather than accepted
from its closure note.

| Earlier ID | Current verification |
| --- | --- |
| F-1-1 | Fixed: live Privacy navigation and Back focus and announce the destination H1; the regression passes at both widths. |
| F-1-2 | Fixed: “How the code reader works” is live and in source. |
| F-1-3 | Fixed: “Set pronunciations for project words” is live and in source. |
| F-1-4 | Fixed: “Code stays on your device” is live and in source. |
| F-1-5 | Fixed in intent: the landing action says Preview; the persistent demo action says Save and actually writes its demo key. |
| F-1-6 | Fixed: the README build explanation is two short sentences. |
| F-2-1 | Fixed: landing preview changes are labelled temporary and vanish on reload; demo saves remain isolated. |
| F-2-2 | Fixed: the demo action outcome is adjacent and above the fold at 390 px. |
| F-2-3 | Fixed: both output panels use the “Spoken preview” heading; readiness is status copy. |
| F-2-4 | Fixed: the README names the audience without claiming a health outcome. |
| F-2-5 | Fixed: “reviewed before use” is absent; the remaining provenance claim test passes. |
| V-9-1, retained in polish history | Fixed: the spoken output is a named, focusable scroll region and the 390 px/200% regression passes. |

No earlier finding is reopened under its old ID. The demo first-viewport and
claim-coverage defects are new findings that the earlier checks did not test.

## Structure, accessibility, privacy, and visual checks

- Root, demo, privacy, terms, downloads, `robots.txt`, `sitemap.xml`, and every
  discovered internal and GitHub link returned 200. An unknown path returned a
  designed 404 document with HTTP 404 and ways back to Home and Demo.
- Each public document has `lang=en`, one H1, one main landmark, route-specific
  title, description, canonical URL, Open Graph/Twitter metadata, SVG favicon,
  Apple touch icon, and product social image. Security headers include the
  same-origin CSP, `X-Content-Type-Options`, and `Referrer-Policy`.
- Live Axe scans found zero violations on all five documents at desktop and
  390 px. The live verifier found no missing alt text, unlabeled button,
  console error, or page error. Route focus, Back, 195 px reflow, touch targets,
  focus contrast, keyboard scrolling, and reduced-motion checks pass in the
  full suite.
- `npm run check` passed from the clean clone: typecheck, 17/17 Vitest tests,
  build, package checks, installed browser and VS Code harnesses, and 36/36
  Playwright tests. The built landing JavaScript is 3.52 kB gzip in total.
- Demo requests were same-origin only. Offline reload passed. Demo data used
  only its `demo:` key, but F-3-3 remains because leaving does not discard it.
- The botanical field-guide art, paper palette, serif/monospace type, specimen
  layout, and cursor motif are product-specific rather than a generic SaaS
  template. F-3-6 concerns one non-informative label, not the identity itself.
- Header/footer consistency fails under F-3-8; other routing and metadata
  requirements pass.

## What would make this perfect

Put realistic input, controls, and spoken output in the first mobile demo
viewport; make the demo-reader test exercise real demo speech; clear demo data
when leaving; add local pronunciation import/export across both packages;
replace the jargon and decorative label; rename the README heading; and use
one header/footer skeleton. Then rerun every ledger command and the full live
check from a fresh context. PASS is appropriate only if that new review finds
nothing else.
