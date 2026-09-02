# Adversarial first-read review 8 — Code Listen Cursor

Date: 2026-09-02
Reviewer mode: cold visitor, no product-code changes

## Verdict: PASS

No blocking, major, minor, or low-severity finding remains. All 17 listed
claims were exercised from a fresh clone, and all passed. No unlisted public
claim, dead link, generic-template treatment, or missed implied capability was
found.

## Cold first read

Fresh Chromium contexts loaded the live root at 390 × 844 and 1440 × 900,
without scrolling.

- **What it does:** It reads selected code or the current line aloud, including
  symbols and indentation.
- **For whom:** Developers who read code better by ear.
- **What to click first:** **Try it with sample data**. Its adjacent text says
  it opens an editable reader with sample code and spoken output.

The first screen therefore answers all three required questions. It has one
H1, no browser-console errors, and a distinct botanical field-guide treatment
instead of a generic SaaS hero. The warm-paper surface, leaf/cursor mark,
editorial typography, ruled lines, and specimen-sheet reader implement the
recorded design direction without using a gradient or stock-template card set.

## Copy audit

Word counts treat a URL or shortcut as one readable token. The tables cover
every complete visitor-facing sentence in the initial landing page and README.
Headings, navigation, labels, and controls were reviewed separately below.
All sentences are at or below the 22-word limit. No jargon, marketing
adjective, inconsistent product term, or unsupported slogan requires a
rewrite.

### Landing page sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | For developers who read better by ear, it reads a selection or current line and names its symbols and indentation. | 20 | pass |
| 2 | Opens an editable reader with sample code and spoken output. | 10 | pass |
| 3 | Demo code stays in your browser. | 6 | pass |
| 4 | Works offline after the first visit. | 6 | pass |
| 5 | Free to download. | 3 | pass |
| 6 | No account. | 2 | pass |
| 7 | An open botanical field notebook where a fern’s branching fronds resemble indented lines of code beside a green reading cursor. | 21 | pass |
| 8 | An illustration of branching code structure. | 6 | pass |
| 9 | Select code below, or place the cursor on a line, then listen. | 12 | pass |
| 10 | The reader uses only a voice your browser marks as local. | 11 | pass |
| 11 | Ready to listen. | 3 | pass |
| 12 | Select code or leave the cursor on a line. | 9 | pass |
| 13 | Your spoken code appears here. | 5 | pass |
| 14 | When this preview has more text, focus it and use the Arrow keys or Page Down to read the rest. | 20 | pass |
| 15 | Preview changes are not saved. | 5 | pass |
| 16 | The demo still works with a voice installed on your device. | 11 | pass |
| 17 | If speech is silent, reconnect once or choose a local system voice. | 12 | pass |
| 18 | Select the exact code you need. | 6 | pass |
| 19 | With no selection, the reader uses the cursor’s line. | 10 | pass |
| 20 | Braces, operators, indentation, camel case, and snake case become explicit spoken labels. | 12 | pass |
| 21 | Move through a file hands-free or replay the last code without losing your position. | 14 | pass |
| 22 | Teach project names and abbreviations once. | 6 | pass |
| 23 | Export the map, then import it in the other extension. | 10 | pass |
| 24 | The reader does not send code to a Code Listen Cursor service. | 12 | pass |
| 25 | It speaks only through voices your browser marks as local. | 10 | pass |
| 26 | Download and unzip the extension. | 5 | pass |
| 27 | Open `chrome://extensions` or `edge://extensions`. | 6 | pass |
| 28 | Enable developer mode, choose Load unpacked, and select the unzipped folder. | 11 | pass |
| 29 | Keyboard shortcuts can be changed in your extension shortcut settings. | 10 | pass |
| 30 | The landing artwork was generated for this project with Azure AI Foundry. | 12 | pass |
| 31 | Reads selected code and names its symbols and indentation. | 9 | pass |

### README sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Code Listen Cursor reads selected code or the current line aloud. | 11 | pass |
| 2 | It names symbols and indentation for developers who read better by ear. | 12 | pass |
| 3 | It includes cursor follow, repeat, punctuation levels, reading rate, indentation controls, local-only speech, and a pronunciation map. | 17 | pass |
| 4 | Export that map from one extension and import it in the other. | 12 | pass |
| 5 | Tests run both packaged extensions with separate local data. | 9 | pass |
| 6 | Open the demo or run the site locally and open `/demo/`. | 11 | pass |
| 7 | The demo has sample code, a persistent sandbox banner, and reset controls. | 12 | pass |
| 8 | It stores only a demo-prefixed pronunciation setting. | 7 | pass |
| 9 | Start for real clears the demo setting. | 7 | pass |
| 10 | Run `npm ci` and `npm run build`, or download a package from the live site. | 15 | pass |
| 11 | Unzip `dist/site/downloads/code-listen-cursor-chrome.zip`. | 5 | pass |
| 12 | Open `chrome://extensions` or `edge://extensions`. | 6 | pass |
| 13 | Enable Developer mode, choose Load unpacked, and select the unzipped directory. | 11 | pass |
| 14 | The unpacked browser build is at `dist/extension/chrome-mv3`. | 9 | pass |
| 15 | `dist/site/downloads/code-listen-cursor-vscode.vsix` is the native VS Code package. | 10 | pass |
| 16 | Install it with Extensions: Install from VSIX. | 7 | pass |
| 17 | The VS Code extension reads the active selection or current line. | 11 | pass |
| 18 | It provides listen, repeat, follow, stop, and Code Listen Cursor: Open Reading Settings commands. | 14 | pass |
| 19 | Its settings panel includes language, punctuation, voice, rate, pitch, indentation, and personal pronunciations. | 13 | pass |
| 20 | Both extensions export and import the same versioned JSON pronunciation file. | 11 | pass |
| 21 | Select code on any HTTP(S) page and press Alt+Shift+S. | 10 | pass |
| 22 | With no selection, the current text line is read. | 9 | pass |
| 23 | Press Alt+Shift+F to follow the cursor, Alt+Shift+R to repeat, or Alt+Shift+X to stop. | 13 | pass |
| 24 | Open the extension popup to tune punctuation, indentation, voice, rate, and pronunciations. | 12 | pass |
| 25 | Export pronunciations, then import the file in the other extension. | 10 | pass |
| 26 | The file contains word pairs, never code. | 7 | pass |
| 27 | Browser extension shortcuts are configurable. | 5 | pass |
| 28 | If a shortcut overlaps with assistive technology, change it at `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`. | 17 | pass |
| 29 | Requirements: Node.js 20+ and npm. | 5 | pass |
| 30 | `npm run build:site` writes the deployment to `dist/site/`. | 10 | pass |
| 31 | That folder includes the demo, legal pages, packages, and service worker. | 11 | pass |
| 32 | See the site’s privacy note. | 6 | pass |
| 33 | The reader uses only voices that the browser or editor marks as local. | 13 | pass |
| 34 | If none is available, it keeps the spoken preview and does not start speech. | 14 | pass |
| 35 | Please report bugs without including private source code. | 8 | pass |
| 36 | MIT. | 1 | pass |
| 37 | See LICENSE. | 2 | pass |

The headline is seven words, starts with the user’s job, and has a single
plain-language audience/result sentence. The section headings identify their
content (for example, “How the code reader works” and “Set pronunciations for
project words”). All primary and secondary controls name a result: Try sample
data, Preview the reader, Listen to code, Stop speech, Reset demo, Start for
real, and the two named downloads.

## Demo, privacy, and sandbox

One click from the landing page opened `/demo/`. The first 390 px screen showed
the banner, editable realistic JavaScript sample, **Listen to code**, and its
already-populated spoken preview. The banner says exactly **“Demo — sample
data, nothing is saved”** and includes working **Reset demo** and **Start for
real** controls.

In a fresh live context, saving `fern → furn` created only
`demo:code-listen-cursor:pronunciation`. Reset removed all `demo:` keys,
restored the shipped code/preview, and kept a `real:sentinel` key. Start for
real again cleared all demo keys, navigated to installation, and preserved the
sentinel. The page request log contained no off-origin request during this
flow. This confirms the separate demo storage namespace rather than a
cosmetic banner.

## Claims

Fresh clone: `/tmp/code-listen-cursor-review8.fLHpXE`
Ledger log: `/tmp/code-listen-cursor-review8-claims.log`

Each of the 17 exact commands from `.factory/claims.json` exited successfully:

| Claim | Result |
| --- | --- |
| demo-sandbox | pass |
| demo-reader | pass |
| no-code-upload | pass |
| structure-aware-speech | pass |
| local-voice | pass |
| offline-reload | pass |
| landing-preview-ephemeral | pass |
| free-download | pass |
| browser-reader-controls | pass |
| browser-reader-settings | pass |
| portable-pronunciations | pass |
| browser-shortcut-configuration | pass |
| installed-package-privacy | pass |
| vscode-reader-controls | pass |
| vscode-package-privacy | pass |
| generated-artwork-provenance | pass |
| mit-license | pass |

The fresh-clone aggregate check also passed: type/lint checks, 23/23 Vitest
tests, production build, package checks, browser and VS Code installed-package
harnesses, and 44/44 desktop/mobile Playwright tests. The direct rerun of the
44-case Playwright suite completed without failure.

The landing, demo, legal pages, and README were cross-checked against the
ledger. Each claim-like statement maps to a listed test (demo isolation,
reading, local voice, offline reload, no upload, free download, installed
package controls/settings/privacy, portable pronunciations, provenance, or
license). No unlisted claim was found.

## History check

Every earlier review and polish record, plus the previous handoff, was read.
The entries below were rechecked on the live site and in the current source and
test suite; none is merely marked fixed.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Privacy navigation and browser Back focus and announce the destination H1 (`route-focus.ts`; navigation regression passes). |
| F-1-2 | “How the code reader works” remains the live section heading. |
| F-1-3 | “Set pronunciations for project words” remains the live section heading. |
| F-1-4 | “Code stays on your device” remains the live privacy heading. |
| F-1-5 | Landing pronunciation changes are temporary; demo saves only in `demo:` storage. |
| F-1-6 | README build explanation remains short and plain. |
| V-9-1 | Spoken preview remains named, focusable, and keyboard-scrollable. |
| F-2-1 | Landing preview changes are labelled temporary and disappear on reload. |
| F-2-2 | The first-screen action has adjacent text stating what opens. |
| F-2-3 | Both reader panels use “Spoken preview” as their heading. |
| F-2-4 | README names an audience without an unsupported health-outcome promise. |
| F-2-5 | Unsupported artwork-review-process language remains absent. |
| F-3-1 | Phone demo shows banner, sample, Listen, and spoken output immediately. |
| F-3-2 | The demo-reader test enters `/demo/` and asserts local selection/current-line speech. |
| F-3-3 | Start for real clears all demo keys while retaining real keys. |
| F-3-4 | Packaged browser and VS Code extensions exchange a version-1 pronunciation JSON file. |
| F-3-5 | Public copy names symbols and indentation rather than undefined “spoken structure.” |
| F-3-6 | The unused “Fig. A” label remains absent. |
| F-3-7 | README heading remains “Use the code reader.” |
| F-3-8 | Header/footer destinations and the product one-liner are consistent and visible at 390 px. |
| F-4-1 | Offline test edits code after offline reload, updates preview, and makes a local speech call. |
| F-4-2 | Start-for-real clearing is listed and tested in `demo-sandbox`. |
| F-4-3 | Landing-preview ephemerality is listed and tested. |
| F-4-4 | README uses plain wording for packaged-extension local data. |
| F-4-5 | README consistently calls the packages extensions. |
| F-5-1 | Every header action says “Download browser ZIP” and targets that ZIP. |
| F-6-1 | Reset cancels speech and restores complete initial demo state. |
| F-6-2 | Both reader controls say “Stop speech.” |
| LOW-1 / F-7-1 | Partial indentation uses singular/plural grammar correctly; the regression passes. |

## Structure and routes

Live checks covered `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
Each has `lang="en"`, a route-specific title, one H1, a main landmark, meta
description, canonical URL, OG/Twitter card and the product’s 1200 × 630 art.
All had zero console/page errors. The unknown live route `/not-a-real-page`
returned the designed 404 document with HTTP 404 and a route home/demo path.

Every extracted internal and external link returned 200 (or is an intentional
same-page anchor). The header/footer are consistent, include Privacy and Terms,
and retain the Param Factory credit. `robots.txt`, `sitemap.xml`, favicon,
apple-touch icon, CSP, `X-Content-Type-Options`, and `Referrer-Policy` are
served. The live CSP sets `frame-ancestors` as a response header, not a meta
element.

## Missed leverage

No missing capability is implied by the brief. The researched job is
deterministic, privacy-first, language-aware code reading; adding an AI step
would send code or create an unnecessary key/cost decision without improving
the stated job. The expected complementary capability—portable pronunciation
import/export between browser and VS Code—exists and is tested. Account sync is
not expected because the brief requires local-first settings and no upload.

## What would make this perfect

Maintain the existing claim tests whenever copy or storage behavior changes.
No product change is required for this review round.
