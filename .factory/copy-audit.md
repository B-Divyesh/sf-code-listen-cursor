# Copy audit

Audit date: 2026-08-29

Landing source SHA-256: `c831d4dbfa731214d4b1c63115120ac045114b55f21e36a026adf1244bd44ad3`

Every sentence in `site/index.html` is listed below. Headings, labels, buttons, and navigation were also reviewed. No sentence exceeds 22 words, and none uses a banned marketing word or metaphorical task term.

| Surface | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Hero | For developers who read better by ear, it reads a selection or current line as spoken structure. | 16 | pass |
| Fact | Demo code stays in your browser. | 6 | pass |
| Fact | Works offline after the first visit. | 6 | pass |
| Fact | Free to download. | 3 | pass |
| Fact | No account. | 2 | pass |
| Figure | An illustration of branching code structure. | 7 | pass |
| Preview instruction | Select code below, or place the cursor on a line, then listen. | 11 | pass |
| Preview instruction | The browser chooses a local voice first. | 7 | pass |
| Preview status | Select code or leave the cursor on a line. | 9 | pass |
| Preview output | Your spoken code appears here. | 5 | pass |
| Offline state | The demo still works with a voice installed on your device. | 11 | pass |
| Offline recovery | If speech is silent, reconnect once or choose a local system voice. | 11 | pass |
| Selection | Select the exact code you need. | 7 | pass |
| Current line | With no selection, the reader uses the cursor’s line. | 9 | pass |
| Structure | Braces, operators, indentation, camel case, and snake case become language you can distinguish. | 13 | pass |
| Controls | Move through a file hands-free or replay the last code without losing your position. | 14 | pass |
| Pronunciation | Teach project names and abbreviations once. | 6 | pass |
| Pronunciation | The pronunciation map stays in extension storage. | 7 | pass |
| Privacy heading | See how each version handles source. | 6 | pass |
| Privacy | The reader does not send code to a Code Listen Cursor service. | 11 | pass |
| Voice | It asks the browser to speak and prefers voices marked local. | 10 | pass |
| Install | Download and unzip the extension. | 5 | pass |
| Install | Open `chrome://extensions` or `edge://extensions`. | 4 | pass |
| Install | Enable developer mode, choose “Load unpacked,” and select the unzipped folder. | 11 | pass |
| Shortcut | Keyboard shortcuts can be changed in your extension shortcut settings. | 10 | pass |
| Footer | Reads selected code as spoken structure. | 6 | pass |
| Artwork | The landing artwork was generated for this project with Azure AI Foundry and reviewed before use. | 16 | pass |

## First screen check

- Headline: “Listen to code without losing your place” — 8 words.
- Audience and result: “For developers who read better by ear, it reads a selection or current line as spoken structure.” — 16 words.
- Primary action: “Try it with sample data.”
- The three facts state demo privacy, offline availability, and price/account requirements.

## Terminology

| Concept | One term used |
| --- | --- |
| Editable example | sample code |
| Spoken result | spoken preview |
| Browser or VS Code package | extension |
| User-specific word replacement | pronunciation |
| Isolated trial | demo |
| Text being read | selection or current line |

The public interface does not use “specimen,” “observation,” or “anatomy” as task terminology. Those words remain only in internal style class names and the visual-design thesis.
