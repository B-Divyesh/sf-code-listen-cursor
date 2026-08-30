# Adversarial first-read review 7 — Code Listen Cursor

Date: 2026-08-30
Work order: `code-listen-cursor-review-7`
Reviewed commit: `0800b73995e8f079434862535cf8d4333d75f297`
Live URL: <https://code-listen-cursor.sociobot.in/>

## Verdict: FAIL

One minor, reproducible product-output defect remains. All other reviewed
behavior, including the first read, one-click demo, privacy boundary, claim
ledger, routes, and quality gate, passed. A PASS requires zero findings.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 opened the live root at
scroll position zero. Before scrolling, the reviewer understood:

- **What it does:** reads selected code or the current line aloud, naming
  symbols and indentation.
- **For whom:** developers who read better by ear.
- **What to click first:** **Try it with sample data**.

The exact copy that established this was “Listen to selected code, symbols, and
indentation,” “For developers who read better by ear, it reads a selection or
current line and names its symbols and indentation,” and “Opens an editable
reader with sample code and spoken output.” The phone viewport had no horizontal
overflow or console/page error. This check is not blocking.

## Findings

### F-7-1 — Minor — Partial indentation is spoken with incorrect plural grammar

**Location:** generated reader output; [core/code-to-speech.ts](../core/code-to-speech.ts)
line 55. The existing handoff records this as `LOW-1`.

**Evidence:** a selected line with fewer leading spaces than the configured
indent width produces **“indent 1 levels”**. The code displays the fallback
number `level || 1`, but chooses `level === 1 ? 'level' : 'levels'`; when
`level` is zero, the displayed number and the plural rule disagree. This was
also independently reproduced in the preceding verification record.

**Why this fails:** the product's central output is speech. A person using it
to reduce reading effort hears an avoidable grammar error in a structural cue.
The cue is understandable, so this is minor rather than blocking, but it is
not finished quality.

**Concrete fix:** assign `const displayedLevel = level || 1`, then use
`displayedLevel` for both the number and singular/plural choice. Add a unit
test for one to three leading spaces with `indentSize: 4`, expecting
`indent 1 level`.

## Copy audit

Word counts use visible whitespace-separated words; a URL, code path, or
keyboard chord is one word. Image alternative text is included. No landing or
README sentence exceeds 22 words. No banned marketing adjective, undefined
metaphor heading, inconsistent term, or non-result-naming button was found.

### Landing page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For developers who read better by ear, it reads a selection or current line and names its symbols and indentation. | 20 | Pass |
| Opens an editable reader with sample code and spoken output. | 10 | Pass |
| Demo code stays in your browser. | 6 | Claimed: `no-code-upload` |
| Works offline after the first visit. | 6 | Claimed: `offline-reload` |
| Free to download. | 3 | Claimed: `free-download` |
| No account. | 2 | Claimed: `free-download` |
| An open botanical field notebook where a fern’s branching fronds resemble indented lines of code beside a green reading cursor. | 20 | Pass (alt text) |
| An illustration of branching code structure. | 6 | Pass |
| Select code below, or place the cursor on a line, then listen. | 12 | Pass |
| The reader uses only a voice your browser marks as local. | 11 | Claimed: `local-voice` |
| Ready to listen. | 3 | Pass (status) |
| Your spoken code appears here. | 5 | Pass |
| When this preview has more text, focus it and use the Arrow keys or Page Down to read the rest. | 20 | Pass |
| Preview changes are not saved. | 5 | Claimed: `landing-preview-ephemeral` |
| The demo still works with a voice installed on your device. | 11 | Claimed: `offline-reload` |
| If speech is silent, reconnect once or choose a local system voice. | 12 | Pass |
| Select the exact code you need. | 6 | Pass |
| With no selection, the reader uses the cursor’s line. | 9 | Claimed: `demo-reader` |
| Braces, operators, indentation, camel case, and snake case become explicit spoken labels. | 12 | Claimed: `structure-aware-speech` |
| Move through a file hands-free or replay the last code without losing your position. | 14 | Claimed: `browser-reader-controls` |
| Teach project names and abbreviations once. | 6 | Claimed: `browser-reader-settings` |
| Export the map, then import it in the other extension. | 10 | Claimed: `portable-pronunciations` |
| The reader does not send code to a Code Listen Cursor service. | 12 | Claimed: `no-code-upload` |
| It speaks only through voices your browser marks as local. | 10 | Claimed: `local-voice` |
| Download and unzip the extension. | 5 | Pass (instruction) |
| Open `chrome://extensions` or `edge://extensions`. | 4 | Pass (instruction) |
| Enable developer mode, choose “Load unpacked,” and select the unzipped folder. | 11 | Pass (instruction) |
| Keyboard shortcuts can be changed in your extension shortcut settings. | 10 | Claimed: `browser-shortcut-configuration` |
| The landing artwork was generated for this project with Azure AI Foundry. | 12 | Claimed: `generated-artwork-provenance` |
| Reads selected code and names its symbols and indentation. | 9 | Pass |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Code Listen Cursor reads selected code or the current line aloud. | 11 | Claimed: `browser-reader-controls` |
| It names symbols and indentation for developers who read better by ear. | 12 | Claimed: `structure-aware-speech` |
| It includes cursor follow, repeat, punctuation levels, reading rate, indentation controls, local-only speech, and a pronunciation map. | 17 | Claimed: installed-package control/settings claims |
| Export that map from one extension and import it in the other. | 12 | Claimed: `portable-pronunciations` |
| Tests run both packaged extensions with separate local data. | 9 | Pass (test documentation) |
| Open <https://code-listen-cursor.sociobot.in/demo/> or run the site locally and open `/demo/`. | 10 | Pass (instruction) |
| The demo has sample code, a persistent sandbox banner, and reset controls. | 12 | Claimed: `demo-sandbox` |
| It stores only a demo-prefixed pronunciation setting. | 7 | Claimed: `demo-sandbox` |
| Start for real clears the demo setting; see [.factory/demo.md](demo.md). | 10 | Claimed: `demo-sandbox` |
| Run `npm ci && npm run build`, or download a package from the live site. | 14 | Pass (instruction) |
| The unpacked browser build is at `dist/extension/chrome-mv3`. | 7 | Pass (build documentation) |
| `dist/site/downloads/code-listen-cursor-vscode.vsix` is the native VS Code package; install it with **Extensions: Install from VSIX**. | 18 | Pass (instruction) |
| The VS Code extension reads the active selection or current line. | 11 | Claimed: `vscode-reader-controls` |
| It provides listen, repeat, follow, stop, and **Code Listen Cursor: Open Reading Settings** commands. | 14 | Claimed: `vscode-reader-controls` |
| Its settings panel includes language, punctuation, voice, rate, pitch, indentation, and personal pronunciations. | 13 | Claimed: `vscode-reader-controls` |
| Both extensions export and import the same versioned JSON pronunciation file. | 11 | Claimed: `portable-pronunciations` |
| Select code on any HTTP(S) page and press `Alt+Shift+S`. | 9 | Claimed: `browser-reader-controls` |
| With no selection, the current text line is read. | 9 | Claimed: `browser-reader-controls` |
| Press `Alt+Shift+F` to follow the cursor, `Alt+Shift+R` to repeat, or `Alt+Shift+X` to stop. | 13 | Claimed: `browser-reader-controls` |
| Open the extension popup to tune punctuation, indentation, voice, rate, and pronunciations. | 12 | Claimed: `browser-reader-settings` |
| Export pronunciations, then import the file in the other extension. | 10 | Claimed: `portable-pronunciations` |
| The file contains word pairs, never code. | 7 | Claimed: `portable-pronunciations` |
| Browser extension shortcuts are configurable. | 5 | Claimed: `browser-shortcut-configuration` |
| If a shortcut overlaps with assistive technology, change it at `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`. | 17 | Pass (instruction) |
| Requirements: Node.js 20+ and npm. | 6 | Pass |
| `npm run build:site` writes the deployment to `dist/site/`. | 8 | Pass (build documentation) |
| That folder includes the demo, legal pages, packages, and service worker. | 11 | Pass (build documentation) |
| See the site’s privacy note. | 5 | Pass |
| The reader uses only voices that the browser or editor marks as local. | 13 | Claimed: `local-voice` |
| If none is available, it keeps the spoken preview and does not start speech. | 14 | Claimed: `local-voice` |
| Please report bugs without including private source code. | 8 | Pass |
| MIT. | 1 | Claimed: `mit-license` |
| See LICENSE. | 2 | Claimed: `mit-license` |

Headings are informative in isolation. The action labels name outcomes,
including **Try it with sample data**, **Listen to code**, **Stop speech**,
**Save sample pronunciation**, and **Download browser ZIP**. No unlisted
claim-like sentence was found on the landing, README, or legal copy.

## Demo, privacy, and claims

The live one-click demo passed. At 390 px, its banner, H1, editable realistic
sample, **Listen to code**, and precomputed spoken preview all intersected the
first viewport. It displays **“Demo — sample data, nothing is saved”** with
**Reset demo** and **Start for real**.

With a fresh mocked local voice, saving `fern → frond` wrote only
`demo:code-listen-cursor:pronunciation`; listening spoke `frond`. Reset cleared
that key, restored code, selection `(0, 0)`, controls, preview, and cancelled
speech. Start for real removed the demo key while preserving a `real:sentinel`.
The complete landing/demo/reset/exit request log used only the product origin.

After `npm ci` in a clean clone at the reviewed commit, all 17 exact commands
from `.factory/claims.json` exited 0. The clean `npm run check` also passed:
22/22 Vitest tests, package and extension smoke checks, and 44/44 Playwright
desktop/mobile tests. The initial uninstalled claim command failed only because
the clone had no dependencies; it was rerun after `npm ci` and passed.

## History check

Every earlier review, polish record, and handoff was read. Each prior finding
was confirmed against current live behavior and source/tests:

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | Fixed: Privacy navigation and Back focus/announce the destination H1. |
| F-1-2 | Fixed: landing heading is “How the code reader works.” |
| F-1-3 | Fixed: pronunciation heading names project-word pronunciations. |
| F-1-4 | Fixed: privacy heading is “Code stays on your device.” |
| F-1-5 | Fixed: landing previews while demo saves in `demo:` storage. |
| F-1-6 | Fixed: README build explanation is two short sentences. |
| V-9-1 | Fixed: spoken preview is named, focusable, and keyboard-scrollable. |
| F-2-1 | Fixed: landing pronunciation preview is labelled temporary and reloads cleanly. |
| F-2-2 | Fixed: adjacent text states what the demo action opens. |
| F-2-3 | Fixed: output panel heading is “Spoken preview.” |
| F-2-4 | Fixed: README names an audience rather than a health outcome. |
| F-2-5 | Fixed: untested artwork-review wording is absent. |
| F-3-1 | Fixed: phone demo shows input, action, and output above the fold. |
| F-3-2 | Fixed: claim test enters `/demo/` and asserts local speech. |
| F-3-3 | Fixed: Start for real clears all demo keys and preserves real keys. |
| F-3-4 | Fixed: packaged browser and VS Code extensions exchange version-1 pronunciation JSON. |
| F-3-5 | Fixed: public copy names symbols and indentation. |
| F-3-6 | Fixed: unused “Fig. A” label is absent. |
| F-3-7 | Fixed: README heading is “Use the code reader.” |
| F-3-8 | Fixed: shared footer one-liner is visible at 390 px. |
| F-4-1 | Fixed: offline test edits code and asserts preview plus local speech. |
| F-4-2 | Fixed: Start-for-real clearing is listed and tested by `demo-sandbox`. |
| F-4-3 | Fixed: ephemeral landing preview is a listed claim with a reload test. |
| F-4-4 | Fixed: README avoids internal test jargon. |
| F-4-5 | Fixed: README consistently calls them extensions. |
| F-5-1 | Fixed: every direct header action says “Download browser ZIP.” |
| F-6-1 | Fixed: Reset restores the complete reader state and cancels speech. |
| F-6-2 | Fixed: both controls say “Stop speech.” |
| LOW-1 | **Unfixed:** re-opened as F-7-1 above. |

## Structure and presentation

The live root, demo, privacy, terms, 404 document, downloads, sitemap, robots
file, and all discovered internal/external links returned expected statuses;
an unknown route returned HTTP 404 with the designed recovery page. The five
public documents passed Axe at desktop and 390 px with zero violations, no
horizontal overflow, no console/page errors, correct route-specific titles,
descriptions, canonical/OG/Twitter metadata, favicon, `lang`, one H1, and one
main landmark. CSP is same-origin with response-header `frame-ancestors`.

The warm-paper botanical field-guide system, generated specimen art,
serif/monospace pairing, and leaf-cursor controls are visibly specific to this
product and match `.factory/design.md`; they do not resemble a generic SaaS
template. The brief does not imply a valuable AI step: sending source to a
model would undermine the local-only job. Shared local pronunciation
import/export already supplies the implied transfer feature.

## What would make this perfect

Fix F-7-1 and add its unit regression. Then rerun the exact claim ledger,
`npm run check`, and the live partial-indentation demo. With no findings left,
the next review can return PASS.
