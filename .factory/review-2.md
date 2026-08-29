# Adversarial first-read review 2 — Code Listen Cursor

Date: 2026-08-29
Reviewer mode: fresh Chromium contexts at 390 × 844 and 1440 × 900; live
URL: <https://code-listen-cursor.sociobot.in/>; clean local clone at
`bd80e8204701efe573c0fdcb8e798ac78dd53524`.

## Verdict: FAIL

The core job, audience, and first action are clear in the first viewport, and
the isolated demo is real. This is still a **FAIL** because five findings
remain, including one control that says it saves something but deliberately
does not persist it on the landing page. PASS requires zero findings.

## Cold first read

Before scrolling, on both phone and desktop, the reviewer understood:

- **What it does:** reads selected code, or the current line, aloud with code
  structure spoken explicitly.
- **For whom:** developers who read better by ear.
- **What to click first:** **Try it with sample data**.

At 390 px the first viewport had no horizontal overflow and showed the
headline, audience sentence, both actions, and all three facts. Desktop showed
the same content plus the product-specific illustration. The exact text that
made the job clear was “Listen to code without losing your place” and “For
developers who read better by ear, it reads a selection or current line as
spoken structure.” This part is not blocking.

## Findings

### F-2-1 — Major — The landing action claims to save, but only changes memory until reload

**Location:** landing reader preview, [site/index.html](/work/repo/site/index.html:220),
**“Save sample pronunciation.”**

**Evidence:** on the live landing page, entering `fern` → `frond` changed the
spoken preview and reported “fern will now be spoken as frond.” `localStorage`
remained empty. Reloading restored `fern`. Source confirms that the form writes
to `demo:code-listen-cursor:pronunciation` only when `isDemo` is true
([site/main.ts](/work/repo/site/main.ts:116)). The isolated `/demo/` version
does save and reset that demo key correctly; this finding is the identically
labelled landing control.

**Why this fails:** a visitor can reasonably rely on “Save” meaning the
pronunciation is retained. The landing preview silently loses it, so the
result-naming label is inaccurate.

**Concrete fix:** rename only the landing control to **“Preview sample
pronunciation”** and change its status to “This preview will say …”; keep
**“Save sample pronunciation”** on `/demo/`, where it actually persists in
the demo namespace. Add a regression test that reloads the landing preview and
asserts the non-persistent label/notice, and that `/demo/` remains persistent.

### F-2-2 — Minor — The primary demo action does not say what opens after the click

**Location:** hero actions, [site/index.html](/work/repo/site/index.html:76),
**“Try it with sample data.”**

**Why this fails:** the first-screen rule requires the primary action and its
immediate outcome. “Sample data” does not tell a cold visitor that it opens an
editable code reader already producing spoken output. The separate “Preview
the reader” action is not that explanation.

**Concrete fix:** add adjacent helper copy: **“Opens an editable reader with
sample code and spoken output.”** Keep the existing action label and add a
small-screen screenshot/assertion that the helper remains beside or directly
below the primary action.

### F-2-3 — Minor — A reader-panel heading is a state label, not a section name

**Location:** landing and demo reader panels,
[site/index.html](/work/repo/site/index.html:166) and
[site/demo/index.html](/work/repo/site/demo/index.html:117), **“Ready to
listen.”**

**Why this fails:** in a heading list it does not identify what is ready. The
nearby visual eyebrow “Spoken preview” is not a heading. This is a mood/state
heading rather than the name of the panel whose output follows.

**Concrete fix:** make the heading **“Spoken preview”** and put the state in
the existing live status text, for example **“Ready to listen.”** Update the
heading assertion in the E2E suite.

### F-2-4 — Minor — README makes an unlisted accessibility-effect claim

**Location:** [README.md](/work/repo/README.md:3), **“It supports reading
fatigue, dyslexia, low vision, and auditory coding workflows.”**

**Why this fails:** this is a visitor-reliance claim, not just a description
of the intended audience. `.factory/claims.json` has no entry or observable
test for support of those conditions. The existing reader, keyboard, and
reflow tests do not establish this broad outcome.

**Concrete fix:** use an audience statement instead: **“It is for developers
with reading fatigue, dyslexia, low vision, or auditory workflows.”** If the
stronger outcome claim is retained, add a narrowly stated, observable claim
and an appropriate assistive-technology acceptance test.

### F-2-5 — Minor — The artwork footer includes an untested review-process claim

**Location:** landing footer, [site/index.html](/work/repo/site/index.html:351),
**“The landing artwork was generated for this project with Azure AI Foundry and
reviewed before use.”**

**Why this fails:** `generated-artwork-provenance` proves the project asset,
prompt sidecar, generator record, and social derivative. It does not cover the
separate assertion “reviewed before use.” That claim has no ledger entry or
testable evidence.

**Concrete fix:** remove **“and reviewed before use”**. Alternatively, record
the review in a versioned provenance file and add a distinct claim test that
asserts that record exists and names the shipped asset.

## Copy audit

All listed sentences are at or below 22 words. Word counts treat URLs and code
paths as one visible token. F-2-4 and F-2-5 are the claim flags above; F-2-3
is the heading flag. No banned marketing adjective was found. The landing
heading **“Structure-aware speech”** is technical, but its adjacent sentence
immediately defines the symbols and indentation it means, so it is not a
separate finding.

### Landing sentences

| # | Sentence | Words |
| ---: | --- | ---: |
| 1 | For developers who read better by ear, it reads a selection or current line as spoken structure. | 17 |
| 2 | Demo code stays in your browser. | 6 |
| 3 | Works offline after the first visit. | 6 |
| 4 | Free to download. | 3 |
| 5 | No account. | 2 |
| 6 | An illustration of branching code structure. | 6 |
| 7 | Select code below, or place the cursor on a line, then listen. | 12 |
| 8 | The reader uses only a voice your browser marks as local. | 11 |
| 9 | Select code or leave the cursor on a line. | 9 |
| 10 | Your spoken code appears here. | 5 |
| 11 | When this preview has more text, focus it and use the Arrow keys or Page Down to read the rest. | 20 |
| 12 | The demo still works with a voice installed on your device. | 11 |
| 13 | If speech is silent, reconnect once or choose a local system voice. | 12 |
| 14 | Select the exact code you need. | 6 |
| 15 | With no selection, the reader uses the cursor’s line. | 9 |
| 16 | Braces, operators, indentation, camel case, and snake case become explicit spoken labels. | 12 |
| 17 | Move through a file hands-free or replay the last code without losing your position. | 14 |
| 18 | Teach project names and abbreviations once. | 6 |
| 19 | The pronunciation map stays in extension storage. | 7 |
| 20 | The reader does not send code to a Code Listen Cursor service. | 12 |
| 21 | It speaks only through voices your browser marks as local. | 10 |
| 22 | Download and unzip the extension. | 5 |
| 23 | Open `chrome://extensions` or `edge://extensions`. | 6 |
| 24 | Enable developer mode, choose “Load unpacked,” and select the unzipped folder. | 11 |
| 25 | Keyboard shortcuts can be changed in your extension shortcut settings. | 10 |
| 26 | Reads selected code as spoken structure. | 6 |
| 27 | The landing artwork was generated for this project with Azure AI Foundry and reviewed before use. | 16 |

### README sentences

| # | Sentence | Words |
| ---: | --- | ---: |
| 1 | Code Listen Cursor reads selected code or the current line aloud for developers who work better by listening. | 18 |
| 2 | It supports reading fatigue, dyslexia, low vision, and auditory coding workflows. | 11 |
| 3 | It includes cursor follow, repeat, punctuation levels, reading rate, indentation controls, local-only speech, and a pronunciation map. | 17 |
| 4 | Installed-package tests verify the browser and VS Code flows against isolated local data. | 13 |
| 5 | Open <https://code-listen-cursor.sociobot.in/demo/> or run the site locally and open `/demo/`. | 14 |
| 6 | The demo has sample code, a persistent sandbox banner, and reset controls. | 12 |
| 7 | It stores only a demo-prefixed pronunciation setting; see `.factory/demo.md`. | 11 |
| 8 | Run `npm ci && npm run build`, or download a package from the live site. | 14 |
| 9 | Unzip `dist/site/downloads/code-listen-cursor-chrome.zip`. | 6 |
| 10 | Open `chrome://extensions` or `edge://extensions`. | 6 |
| 11 | Enable Developer mode, choose Load unpacked, and select the unzipped directory. | 11 |
| 12 | The unpacked browser build is at `dist/extension/chrome-mv3`. | 9 |
| 13 | `dist/site/downloads/code-listen-cursor-vscode.vsix` is the native VS Code package; install it with Extensions: Install from VSIX. | 18 |
| 14 | The VS Code extension reads the active selection or current line. | 11 |
| 15 | It provides listen, repeat, follow, stop, and Code Listen Cursor: Open Reading Settings commands. | 14 |
| 16 | Its settings panel includes language, punctuation, voice, rate, pitch, indentation, and personal pronunciations. | 13 |
| 17 | Select code on any HTTP(S) page and press `Alt+Shift+S`. | 12 |
| 18 | With no selection, the current text line is read. | 9 |
| 19 | Press `Alt+Shift+F` to follow the cursor, `Alt+Shift+R` to repeat, or `Alt+Shift+X` to stop. | 19 |
| 20 | Open the extension popup to tune punctuation, indentation, voice, rate, and pronunciations. | 12 |
| 21 | Browser extension shortcuts are configurable. | 5 |
| 22 | If a shortcut overlaps with assistive technology, change it at `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`. | 17 |
| 23 | Requirements: Node.js 20+ and npm. | 6 |
| 24 | `npm run build:site` writes the deployment to `dist/site/`. | 10 |
| 25 | That folder includes the demo, legal pages, packages, and service worker. | 11 |
| 26 | See the site’s privacy note. | 5 |
| 27 | The reader uses only voices that the browser or editor marks as local. | 13 |
| 28 | If none is available, it keeps the spoken preview and does not start speech. | 14 |
| 29 | Please report bugs without including private source code. | 8 |
| 30 | MIT. | 1 |
| 31 | See LICENSE. | 2 |

## Demo and sandbox

**PASS.** From a fresh live context, one click opened `/demo/`; its first
product screen already showed editable fern JavaScript and the deterministic
spoken result “const describe Plant gets a sink open paren fern close paren
arrow open brace.” The persistent banner was exactly **“Demo — sample data,
nothing is saved”** and had **Reset demo** and **Start for real**.

Saving `kubectl` → `cube control` on `/demo/` created only
`demo:code-listen-cursor:pronunciation`. Reset removed that key and restored
the sample. The live edit/listen/save/reset request log contained only
`https://code-listen-cursor.sociobot.in`; no real-storage key was read or
written. `/?demo=1` was also covered by the full E2E suite and enters `/demo/`.

## Claims and local verification

**PASS.** In a fresh clone, `npm ci --include=dev` completed without reported
vulnerabilities. Every exact command from `.factory/claims.json` was run. All
15 claim entries passed; repeated commands were invoked for each entry that
declares the same command.

| Claim ID | Result |
| --- | --- |
| demo-sandbox | PASS |
| demo-reader | PASS |
| no-code-upload | PASS |
| structure-aware-speech | PASS |
| local-voice | PASS |
| offline-reload | PASS |
| free-download | PASS |
| browser-reader-controls | PASS |
| browser-reader-settings | PASS |
| browser-shortcut-configuration | PASS |
| installed-package-privacy | PASS |
| vscode-reader-controls | PASS |
| vscode-package-privacy | PASS |
| generated-artwork-provenance | PASS (generated provenance only; F-2-5 remains) |
| mit-license | PASS |

Additional clean-clone checks passed: `npm run lint`, `npm run test:package`,
the three unit claim tests together (3/3), the installed ZIP harness, the
packaged VSIX harness, and the full Playwright suite (32/32 desktop and 390 px
tests). The Playwright request capture confirms the privacy claim during demo
interaction. Offline reload is independently covered by its dedicated claim
test after service-worker control.

## History check

The reviewer read `.factory/review-1.md`, `.factory/polish-1.md`, and the
handoff. Every earlier finding was checked live and in current source:

| Earlier ID | Current result |
| --- | --- |
| F-1-1 route focus/announcement | Fixed: live Privacy navigation and browser Back focus the sole `<h1>` and set `#route-announcement`; regression passes. |
| F-1-2 heading “Control at the scale of a line” | Fixed: now “How the code reader works.” |
| F-1-3 heading “Your own vocabulary” | Fixed: now “Set pronunciations for project words.” |
| F-1-4 privacy heading | Fixed: now “Code stays on your device.” |
| F-1-5 non-result demo action | Fixed as stated: both demo controls are named “Save sample pronunciation.” F-2-1 is a new landing-behaviour mismatch, not the old naming defect. |
| F-1-6 overlong README build sentence | Fixed: two short deployment sentences replace it. |
| Verification-9 keyboard-scroll defect | Fixed: the spoken preview is a named, focusable scroll region; the full suite confirms Page Down scrolls it at 390 px and the 200% proxy. |

## Structure, accessibility, and visual review

- Root, demo, privacy, terms, downloads, `robots.txt`, and `sitemap.xml` all
  returned 200. Both GitHub targets returned 200. `/no-such-route` returned a
  designed 404 with a route home link.
- Every public route has a route-appropriate title, one `<h1>`, a main
  landmark, meta description, canonical, Open Graph/Twitter data, SVG
  favicon, and Apple touch icon. The sitemap lists every public HTML route.
- Header/footer, legal links, skip link, visible focus, mobile target sizes,
  deep links, Back focus, and reduced-motion coverage were verified in the
  source and full suite. No live console or page errors appeared.
- The deployed CSP is same-origin by default and its demo request log had only
  the product origin. No third-party font or script was observed.
- The botanical field-guide art, warm paper palette, serif/monospace pairing,
  and specimen-sheet reader are distinct from a generic SaaS template and
  match `.factory/design.md`.
- No missing AI feature was found. This product’s core task is deterministic,
  local accessibility behavior; the brief does not imply an AI step, sync, or
  import/export flow.

## What would make this perfect

Make the landing pronunciation action honest, state exactly what the primary
demo link opens, replace the non-descriptive panel heading, and remove or
ledger-test the two unproved claims. Add the specified regressions, rerun the
full claim ledger from a fresh clone, and return PASS only when those checks
leave no findings.
