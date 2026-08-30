# Copy audit

Audit date: 2026-08-30

Landing source SHA-256: `8414f782b26d8c681beadb14027e9fce67fa05739fed2efc1b1a8ca52164b3cf`

Every visitor-facing sentence in `site/index.html` is listed below. Headings,
controls, navigation, image text, and footer destinations were also reviewed.
No sentence exceeds 22 words. No sentence uses a banned marketing word or an
undefined task metaphor.

| Surface | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Hero | For developers who read better by ear, it reads a selection or current line and names its symbols and indentation. | 20 | pass |
| Demo action help | Opens an editable reader with sample code and spoken output. | 10 | pass |
| Fact | Demo code stays in your browser. | 6 | pass |
| Fact | Works offline after the first visit. | 6 | pass |
| Fact | Free to download. | 3 | pass |
| Fact | No account. | 2 | pass |
| Image alt | An open botanical field notebook where a fern’s branching fronds resemble indented lines of code beside a green reading cursor. | 20 | pass |
| Figure | An illustration of branching code structure. | 6 | pass |
| Preview instruction | Select code below, or place the cursor on a line, then listen. | 11 | pass |
| Local voice | The reader uses only a voice your browser marks as local. | 11 | pass |
| Preview status | Ready to listen. | 3 | pass |
| Preview status | Select code or leave the cursor on a line. | 9 | pass |
| Preview output | Your spoken code appears here. | 5 | pass |
| Preview keyboard instruction | When this preview has more text, focus it and use the Arrow keys or Page Down to read the rest. | 20 | pass |
| Preview notice | Preview changes are not saved. | 5 | pass |
| Reader control | Stop speech | 2 | pass |
| Offline state | The demo still works with a voice installed on your device. | 11 | pass |
| Offline recovery | If speech is silent, reconnect once or choose a local system voice. | 11 | pass |
| Selection | Select the exact code you need. | 7 | pass |
| Current line | With no selection, the reader uses the cursor’s line. | 9 | pass |
| Symbols | Braces, operators, indentation, camel case, and snake case become explicit spoken labels. | 12 | pass |
| Controls | Move through a file hands-free or replay the last code without losing your position. | 14 | pass |
| Pronunciation | Teach project names and abbreviations once. | 6 | pass |
| Pronunciation transfer | Export the map, then import it in the other extension. | 9 | pass |
| Privacy | The reader does not send code to a Code Listen Cursor service. | 11 | pass |
| Voice | It speaks only through voices your browser marks as local. | 10 | pass |
| Install | Download and unzip the extension. | 5 | pass |
| Install | Open `chrome://extensions` or `edge://extensions`. | 4 | pass |
| Install | Enable developer mode, choose “Load unpacked,” and select the unzipped folder. | 11 | pass |
| Shortcut | Keyboard shortcuts can be changed in your extension shortcut settings. | 10 | pass |
| Artwork provenance | The landing artwork was generated for this project with Azure AI Foundry. | 12 | pass |
| Footer | Reads selected code and names its symbols and indentation. | 9 | pass |

## First screen check

- Headline: “Listen to selected code, symbols, and indentation” — 7 words.
- Audience and result: “For developers who read better by ear, it reads a selection or current line and names its symbols and indentation.” — 20 words.
- Primary action: “Try it with sample data.”
- Action outcome: “Opens an editable reader with sample code and spoken output.”
- The three facts state demo privacy, offline availability, and price/account requirements.

## Terminology

| Concept | One term used |
| --- | --- |
| Editable example | sample code |
| Spoken result | spoken preview |
| Browser or VS Code package | extension |
| User-specific word replacement | pronunciation |
| Transfer file | pronunciation file |
| Isolated trial | demo |
| Text being read | selection or current line |

The public interface does not use “specimen,” “observation,” or “anatomy” as
task terminology. Those words remain only in internal style class names and the
visual-design thesis.
