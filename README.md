# Code Listen Cursor

Code Listen Cursor reads selected code or the current line aloud for developers who work better by listening. It supports reading fatigue, dyslexia, low vision, and auditory coding workflows.

It includes cursor follow, repeat, punctuation levels, reading rate, indentation controls, a local-voice preference, and a pronunciation map. Installed-package tests verify the browser and VS Code flows against isolated local data.

Live site: <https://code-listen-cursor.sociobot.in>

## Try the demo

Open <https://code-listen-cursor.sociobot.in/demo/> or run the site locally and open `/demo/`. The demo has sample code, a persistent sandbox banner, and reset controls. It stores only a demo-prefixed pronunciation setting; see [.factory/demo.md](.factory/demo.md).

## Install the packaged extensions

1. Run `npm ci && npm run build`, or download a package from the live site.
2. Unzip `dist/site/downloads/code-listen-cursor-chrome.zip`.
3. Open `chrome://extensions` or `edge://extensions`.
4. Enable **Developer mode**, choose **Load unpacked**, and select the unzipped directory.

The unpacked browser build is at `dist/extension/chrome-mv3`. `dist/site/downloads/code-listen-cursor-vscode.vsix` is the native VS Code package; install it with **Extensions: Install from VSIX**. The VS Code extension reads the active selection or current line. It provides listen, repeat, follow, stop, and **Code Listen Cursor: Open Reading Settings** commands. Its settings panel includes language, punctuation, voice, rate, pitch, indentation, and personal pronunciations.

## Use it

- Select code on any HTTP(S) page and press `Alt+Shift+S`. With no selection, the current text line is read.
- Press `Alt+Shift+F` to follow the cursor, `Alt+Shift+R` to repeat, or `Alt+Shift+X` to stop.
- Open the extension popup to tune punctuation, indentation, voice, rate, and pronunciations.

Browser extension shortcuts are configurable. If a shortcut overlaps with assistive technology, change it at `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`.

## Develop

Requirements: Node.js 20+ and npm.

```sh
npm ci
npm run dev          # WXT extension development server
npm run dev:site     # landing site at localhost
npm test             # unit tests
npm run build        # extension + ZIP + static site
npm run test:extension # load the unpacked extension and invoke speech in Chromium
npm run test:installed # install the packaged ZIP and verify local settings/no remote listening requests
npm run test:vscode-installed # exercise commands and local storage from the packaged VSIX
npm run test:e2e     # desktop and 390 px browser/a11y checks
npm run check        # typecheck and all gates
```

`npm run build:site` is the deploy command. It produces the complete static deployment at `dist/site/`, including `/demo/`, `/privacy/`, `/terms/`, `/404.html`, both extension packages, service worker, and Static Web Apps response configuration.

## Project map

- `core/` — deterministic code-to-speech transformation and shared settings
- `entrypoints/` — WXT MV3 background, content, and popup entry points
- `site/` — static landing site, live speech station, privacy, and terms
- `tests/` — parser tests and Playwright accessibility/responsive checks
- `.factory/design.md` — botanical field-guide visual thesis and asset provenance
- `.factory/claims.json` — tested public claims and their exact commands
- `.factory/demo.md` — demo route, sample data, and isolated storage details
- `.factory/handoff.md` — verification results and known gaps

## Privacy and support

See the site’s [privacy note](site/privacy/index.html). The reader prefers voices that the browser marks as local. Installed voice behavior is controlled by the browser and operating system. Please report bugs without including private source code.

## License

MIT. See [LICENSE](LICENSE).
