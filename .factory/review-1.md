# Adversarial first-read review 1 — Code Listen Cursor

Date: 2026-08-29  
Reviewer mode: fresh, unauthenticated Chromium contexts at 390 × 844 and
1440 × 900; live URL <https://code-listen-cursor.sociobot.in/>.

## Verdict: FAIL

The real job is clear and the sample sandbox works. A cold visitor can identify
what it does, who it is for, and the first action from the initial viewport.
All listed claims passed from a clean dependency install. This is nevertheless
**FAIL**: the product has six unresolved findings, including a route-change
screen-reader failure and five required plain-words copy failures. PASS requires
zero findings.

## Cold first read

Before scrolling, on both phone and desktop, the reviewer understood:

- **What it does:** it reads a selected piece of code or the current line aloud,
  describing code structure.
- **For whom:** “developers who read better by ear.”
- **What to click first:** **Try it with sample data**.

The 390 px viewport showed the headline, audience/result sentence, primary
action, and all three plain facts without horizontal overflow. The desktop
viewport additionally showed the illustration and full header. There were no
console or page errors and all initial requests were same-origin.

## Findings

### F-1-1 — Major — Route navigation leaves a screen reader at the document body

**Location:** live `/` → `/privacy/` and browser Back; all public HTML routes.

**Evidence:** after activating the live **Privacy** link, `document.activeElement`
was `BODY`, not the destination `<h1>`. After browser Back it was again `BODY`.
The public documents have no route-announcement region. This was reproduced in a
new browser context; it is not a SPA-only test artefact.

**Why this fails:** a keyboard or screen-reader visitor receives no focused
destination heading after moving between real places. They must rediscover the
content after every page navigation, contrary to the route-change focus and
announcement requirement.

**Concrete fix:** make each route's sole `<h1>` programmatically focusable and,
after navigation/page load, focus it without changing restored scroll position.
Provide a polite live route announcement (or an equivalently announced focused
heading), and add a Playwright test that follows a header link and Back and
asserts the correct route heading is focused/announced.

### F-1-2 — Minor — A section heading is a benefit slogan, not its section name

**Location:** landing, [site/index.html](/work/repo/site/index.html:229):
“Control at the scale of a line” (6 words).

**Why this fails:** read out of context in a heading list, it does not identify
the section. It does not tell a first-time visitor that the following list
explains selection, symbols, repeat, and pronunciation.

**Concrete fix:** replace it with **“Choose code, hear symbols, and repeat it”**
(8 words), or simply **“How the code reader works”** (5 words).

### F-1-3 — Minor — The pronunciation section heading does not name the setting

**Location:** landing, [site/index.html](/work/repo/site/index.html:268):
“Your own vocabulary” (3 words).

**Why this fails:** it is a metaphorical label; it does not identify a
pronunciation map to someone scanning headings or using a screen reader.

**Concrete fix:** replace it with **“Set pronunciations for project words”**
(5 words).

### F-1-4 — Minor — The privacy heading uses an unexplained technical noun

**Location:** landing, [site/index.html](/work/repo/site/index.html:285):
“See how each version handles source.” (6 words).

**Why this fails:** “source” is incomplete outside the adjacent privacy label
and “handles” does not say what happens. The heading must carry the privacy
fact on its own.

**Concrete fix:** replace it with **“Code stays on your device”** (5 words),
with the existing local-voice qualification in the paragraph below.

### F-1-5 — Minor — The demo save action does not name its result

**Location:** landing and demo,
[site/index.html](/work/repo/site/index.html:211) and
[site/demo/index.html](/work/repo/site/demo/index.html:159): **Use
pronunciation** (2 words).

**Why this fails:** the action writes a sample pronunciation entry; “Use” does
not say whether it previews, reads, or saves that mapping. This violates the
result-naming button requirement.

**Concrete fix:** label it **“Save sample pronunciation”**. Keep the existing
post-save status message, and update the demo-reader test to invoke the renamed
control by accessible name.

### F-1-6 — Minor — README has a 26-word sentence and unnecessary deployment jargon

**Location:** [README.md](/work/repo/README.md:47): “It produces the complete
static deployment at `dist/site/`, including `/demo/`, `/privacy/`, `/terms/`,
`/404.html`, both extension packages, service worker, and Static Web Apps
response configuration.” (26 words).

**Why this fails:** it exceeds the 22-word hard cap and makes an ordinary
developer decode implementation terminology rather than learn where the build
went.

**Concrete fix:** replace it with two sentences: **“It writes the deployment to
`dist/site/`. That folder includes the demo, legal pages, packages, and service
worker.”** (6 and 14 words).

## Demo and sandbox result — PASS

From a fresh context, one click on **Try it with sample data** opened `/demo/`.
Its first rendered product screen already contained realistic editable JavaScript
and the deterministic preview “const describe Plant gets a sink open paren fern
close paren arrow open brace.” The persistent banner read exactly **“Demo —
sample data, nothing is saved”** and included **Reset demo** and **Start for
real**.

Saving `kubectl` → `cube control` created only
`demo:code-listen-cursor:pronunciation`. Reset removed it and restored the
sample. `/?demo=1` redirected to `/demo/`. The observed demo edit/listen/save/
reset request log contained only same-origin site resources. No real-extension
storage namespace was read or written. The local-voice test also passed: with
only a non-local fixture voice, no utterance was constructed or spoken and the
preview/recovery state remained visible.

## Claims result — PASS

After `npm ci` (184 packages; zero reported vulnerabilities), every command in
`.factory/claims.json` exited 0. Repeated package commands were run once for
each claim entry that declares them.

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
| generated-artwork-provenance | PASS |
| mit-license | PASS |

The associated clean commands were the exact ledger commands: the six
claim-filtered E2E commands, the two claim-filtered Vitest commands, four runs
of `npm run test:installed`, and two runs of `npm run test:vscode-installed`.
No live landing or README product claim was found without a corresponding
ledger entry. The delivery-provenance statement maps to
`generated-artwork-provenance`; package/privacy statements map to their
respective installed-package claims.

## Copy audit

This audit counts words as visible words/paths are rendered. Headings, controls,
and navigation were also checked for plain wording. The landing has no
over-22-word sentence. The flagged headings and button are Findings F-1-2 to
F-1-5. The README has one over-cap sentence, Finding F-1-6.

### Landing sentences

| Copy | Words |
| --- | ---: |
| For developers who read better by ear, it reads a selection or current line as spoken structure. | 17 |
| Demo code stays in your browser. | 6 |
| Works offline after the first visit. | 6 |
| Free to download. | 3 |
| No account. | 2 |
| An illustration of branching code structure. | 7 |
| Select code below, or place the cursor on a line, then listen. | 11 |
| The reader uses only a voice your browser marks as local. | 11 |
| Select code or leave the cursor on a line. | 9 |
| Your spoken code appears here. | 5 |
| The demo still works with a voice installed on your device. | 11 |
| If speech is silent, reconnect once or choose a local system voice. | 11 |
| Select the exact code you need. | 7 |
| With no selection, the reader uses the cursor’s line. | 9 |
| Braces, operators, indentation, camel case, and snake case become explicit spoken labels. | 12 |
| Move through a file hands-free or replay the last code without losing your position. | 14 |
| Teach project names and abbreviations once. | 6 |
| The pronunciation map stays in extension storage. | 7 |
| The reader does not send code to a Code Listen Cursor service. | 11 |
| It speaks only through voices your browser marks as local. | 10 |
| Download and unzip the extension. | 5 |
| Open `chrome://extensions` or `edge://extensions`. | 4 |
| Enable developer mode, choose “Load unpacked,” and select the unzipped folder. | 11 |
| Keyboard shortcuts can be changed in your extension shortcut settings. | 10 |
| Reads selected code as spoken structure. | 6 |
| The landing artwork was generated for this project with Azure AI Foundry and reviewed before use. | 16 |

### README sentences

| Copy | Words |
| --- | ---: |
| Code Listen Cursor reads selected code or the current line aloud for developers who work better by listening. | 18 |
| It supports reading fatigue, dyslexia, low vision, and auditory coding workflows. | 11 |
| It includes cursor follow, repeat, punctuation levels, reading rate, indentation controls, local-only speech, and a pronunciation map. | 17 |
| Installed-package tests verify the browser and VS Code flows against isolated local data. | 13 |
| Open <https://code-listen-cursor.sociobot.in/demo/> or run the site locally and open `/demo/`. | 14 |
| The demo has sample code, a persistent sandbox banner, and reset controls. | 12 |
| It stores only a demo-prefixed pronunciation setting; see [.factory/demo.md](.factory/demo.md). | 14 |
| Run `npm ci && npm run build`, or download a package from the live site. | 14 |
| Unzip `dist/site/downloads/code-listen-cursor-chrome.zip`. | 6 |
| Open `chrome://extensions` or `edge://extensions`. | 6 |
| Enable **Developer mode**, choose **Load unpacked**, and select the unzipped directory. | 11 |
| The unpacked browser build is at `dist/extension/chrome-mv3`. | 9 |
| `dist/site/downloads/code-listen-cursor-vscode.vsix` is the native VS Code package; install it with **Extensions: Install from VSIX**. | 18 |
| The VS Code extension reads the active selection or current line. | 11 |
| It provides listen, repeat, follow, stop, and **Code Listen Cursor: Open Reading Settings** commands. | 14 |
| Its settings panel includes language, punctuation, voice, rate, pitch, indentation, and personal pronunciations. | 13 |
| Select code on any HTTP(S) page and press `Alt+Shift+S`. | 10 |
| With no selection, the current text line is read. | 9 |
| Press `Alt+Shift+F` to follow the cursor, `Alt+Shift+R` to repeat, or `Alt+Shift+X` to stop. | 13 |
| Open the extension popup to tune punctuation, indentation, voice, rate, and pronunciations. | 12 |
| Browser extension shortcuts are configurable. | 5 |
| If a shortcut overlaps with assistive technology, change it at `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`. | 17 |
| Requirements: Node.js 20+ and npm. | 6 |
| `npm run build:site` is the deploy command. | 8 |
| It produces the complete static deployment at `dist/site/`, including `/demo/`, `/privacy/`, `/terms/`, `/404.html`, both extension packages, service worker, and Static Web Apps response configuration. | 26 — **F-1-6** |
| See the site’s [privacy note](site/privacy/index.html). | 10 |
| The reader uses only voices that the browser or editor marks as local. | 13 |
| If none is available, it keeps the spoken preview and does not start speech. | 14 |
| Please report bugs without including private source code. | 8 |
| MIT. | 1 |
| See LICENSE. | 3 |

## Structure, accessibility, and visual review

- Live root, demo, privacy, terms, assets/downloads, and 404 returned expected
  status codes. A crawl of all discovered internal links and the two GitHub links
  returned 200; no dead link was found.
- Titles, descriptions, canonical URLs, Open Graph/Twitter metadata, favicon,
  language, one `<h1>`, and one `<main>` were present on each public route.
  The live root title was `Code Listen Cursor — listen to selected code`.
- `/no-such-route` returned HTTP 404 with the designed 404 document. Privacy
  and Terms appear in every footer; header navigation remained within four
  links. The header/footer visual system is consistent enough across routes.
- `/opt/fleet/lib/verify-url.sh` passed against the live root: 597 ms load,
  no console errors, `lang=en`, title, one H1, main landmark, no missing image
  alternative, and no unlabeled button. The repository E2E suite's Axe tests
  passed for all public routes; 30/30 E2E tests passed.
- The botanical field-guide art, warm-paper palette, and type system are
  visibly product-specific rather than a generic SaaS-template treatment. The
  artwork provenance is present and its claim test passed.
- No missing AI feature was found. This deterministic, local accessibility
  reader does not benefit from a model request. The brief does not imply a
  necessary import/export or synchronization capability beyond the existing
  local pronunciation setting.

## History check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
The existing handoff and verification history described the previous
non-local-voice and low-vision/reflow defects. Both were checked again in live
and code evidence: `preferredLocalVoice` is called before constructing an
utterance, its non-local-only claim test passed, and the full mobile/200% reflow
suite passed. No historical finding is re-opened.

## What would make this perfect

Implement F-1-1 through F-1-6, then add the route-focus regression and the
renamed-button coverage. A fresh review should confirm the rewritten headings
and README sentence, re-run the full ledger and E2E suite, and return PASS only
if no new finding remains.
