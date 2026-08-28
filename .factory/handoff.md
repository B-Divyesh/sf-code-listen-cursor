# Code Listen Cursor — build handoff

Date: 2026-08-28  
Work order: `code-listen-cursor-build-1`  
Deploy root: `dist/site/`

## What shipped

- A WXT + TypeScript Manifest V3 extension for Chrome/Edge. It reads the active selection or cursor line with language-aware rules for JavaScript, TypeScript, Python, Rust, and shell, plus a general fallback.
- Keyboard commands for listen (`Alt+Shift+S`), cursor follow (`Alt+Shift+F`), repeat (`Alt+Shift+R`), and stop (`Alt+Shift+X`), plus a selection context-menu action. Browser shortcut settings can override these defaults.
- A popup with local voice selection, speech rate, indentation size, punctuation detail, language override, and an editable personal pronunciation map. Preferences use extension-local storage.
- First-class empty, selection-too-long, unsupported speech, restricted browser page, speech failure, repeat-empty, and site offline states.
- A responsive static site with a working code-to-speech field station, install instructions, privacy and terms pages, and a direct extension ZIP download.
- An original botanical field-guide system and generated hero artwork. Prompt, model path, review, palette, typography, motion, and asset rationale are documented in `.factory/design.md`; source and sidecar are under `assets/src/`.
- Responsive WebP/JPEG hero delivery (38 KB mobile WebP; 148 KB desktop WebP), hashed CSS/JS caching headers, and a versioned offline shell service worker.

The extension and site have no analytics, accounts, remote fonts/scripts, backend, or code upload. The popup only presents voices marked local by Chrome; automatic speech prefers a local English voice.

## Build and verification

From a clean checkout:

```sh
npm install
npm run check
```

`npm run build:site` is the deploy command. It builds the extension, packages `dist/site/downloads/code-listen-cursor-chrome.zip`, copies the unpacked artifact to `dist/extension/chrome-mv3`, and emits the site with `dist/site/index.html` at its root.

Verified locally:

- `npx tsc --noEmit` — passed.
- `npm test` — 5 unit tests passed (operators, indentation, pronunciation, language rules, current line).
- `npm run build` — passed; extension bundle 29.07 KB total; site initial JS 6.53 KB and CSS 9.89 KB.
- `npm run test:extension` — passed in the pinned Playwright Chromium: MV3 service worker started, popup loaded, a textarea selection reached the content script, and listening entered the speaking state.
- `npm run test:e2e` — 6 desktop/mobile tests passed at 390 px, including interaction, one-h1/landmark checks, legal routes, console/page errors, and axe. No serious or critical axe findings.
- `npm audit --omit=dev` and `npm audit` — 0 vulnerabilities.
- Lighthouse 12.8.2, default mobile throttling against the production preview: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**. FCP **0.9 s**, LCP **1.3 s**, CLS **0**, TBT **0 ms**, Speed Index **0.9 s**.
- Manual responsive capture at 390 × 844: no horizontal overflow; code controls stack and remain usable.
- Generated image visually reviewed: no legible fake text, brands, people, seams, or misleading UI.

## Known gaps and honest deviations

- The researched smallest product mentions VS Code, but the work order mandates WXT/MV3 and classifies the artifact as a browser extension. This v1 therefore works on HTTP(S) code pages and browser-based editors rather than native VS Code. A native VS Code adapter can reuse `core/` later.
- Complex canvas-rendered editors that do not expose their active line in an input, selection, or DOM row may only support explicit browser text selections. Protected pages such as `chrome://` cannot run content scripts.
- The brief’s 20-snippet, screen-reader-user success measure has not been run with recruited participants. Automated accessibility, keyboard, screen-reader semantics, and speech transformation are covered, but a human study remains the most important next step.
- Installed voice availability and whether an operating-system voice uses a network service are controlled by the browser/OS. The UI exposes only voices marked local and the privacy page explains this boundary.

## Next steps

1. Run the documented 20-snippet study with screen-reader and auditory-workflow users; tune phrases against errors.
2. Add native VS Code command/selection adapters around the shared parser if the artifact scope expands.
3. Test additional web editors and add targeted current-line adapters where their accessible DOM permits it.
