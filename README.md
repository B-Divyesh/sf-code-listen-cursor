# Code Listen Cursor

Code Listen Cursor is a free, local-first Chrome/Edge extension for developers who work better by listening: people with reading fatigue, dyslexia, low vision, or an auditory workflow. It reads selected code—or the cursor’s current line—with useful names for indentation, braces, operators, camel case, and snake case.

The extension includes cursor-follow and repeat shortcuts, three punctuation levels, reading-rate and indentation controls, local voice preference, and a personal pronunciation map. Source text is handled on the page and is never sent to a Code Listen Cursor server.

Live site: <https://code-listen-cursor.sociobot.in>

## Install the packaged extension

1. Run `npm install && npm run build`, or download the ZIP from the live site.
2. Unzip `dist/site/downloads/code-listen-cursor-chrome.zip`.
3. Open `chrome://extensions` or `edge://extensions`.
4. Enable **Developer mode**, choose **Load unpacked**, and select the unzipped directory.

The unpacked build is also available directly at `dist/extension/chrome-mv3`.

## Use it

- Select code on any HTTP(S) page and press `Alt+Shift+S`. With no selection, the current text line is read.
- Press `Alt+Shift+F` to follow the cursor, `Alt+Shift+R` to repeat, or `Alt+Shift+X` to stop.
- Right-click a selection and choose **Listen to selected code**.
- Open the extension popup to tune punctuation, indentation, voice, rate, and pronunciations.

Browser extension shortcuts are configurable. If a shortcut overlaps with assistive technology, change it at `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`.

## Develop

Requirements: Node.js 20+ and npm.

```sh
npm install
npm run dev          # WXT extension development server
npm run dev:site     # landing site at localhost
npm test             # unit tests
npm run build        # extension + ZIP + static site
npm run test:extension # load the unpacked extension and invoke speech in Chromium
npm run test:e2e     # desktop and 390 px browser/a11y checks
npm run check        # typecheck and all gates
```

`npm run build:site` is the deploy command. It produces the complete static deployment at `dist/site/`, including `index.html`, `/privacy/`, `/terms/`, and the browser-extension ZIP.

## Project map

- `core/` — deterministic code-to-speech transformation and shared settings
- `entrypoints/` — WXT MV3 background, content, and popup entry points
- `site/` — static landing site, live speech station, privacy, and terms
- `tests/` — parser tests and Playwright accessibility/responsive checks
- `.factory/design.md` — botanical field-guide visual thesis and asset provenance
- `.factory/handoff.md` — verification results and known gaps

## Privacy and support

See the site’s [privacy note](site/privacy/index.html). The extension prefers voices that the browser marks as local. Installed voice behavior is ultimately controlled by the browser/operating system. Please report bugs without including private source code.

## License

MIT. See [LICENSE](LICENSE).
