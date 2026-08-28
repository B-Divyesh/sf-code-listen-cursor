# Code Listen Cursor — visual thesis

## Direction: botanical field guide for audible code

Code Listen Cursor treats a source file like a specimen page: syntax is the specimen, the active selection is a pressed leaf under glass, and spoken structure is the field note that makes it identifiable. The visual system borrows the quiet authority of a working botanist’s notebook—cream stock, ink, accession labels, ruled annotations, and one chlorophyll green—without turning the utility into costume. Decoration is useful: branching stems explain indentation, specimen labels explain pronunciation, and the listening cursor is always the most vivid mark.

The product is intentionally single-light-mode. Warm paper reduces glare without introducing a second set of semantic colors, and the extension popup must remain immediately recognizable across host sites. The paper background is painted explicitly.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#F3EFDF` | Page background |
| Herbarium | `#E6E0C9` | Recessed surfaces and code beds |
| Pulp | `#FCFAF1` | Raised sheets and popup surface |
| Carbon | `#17231D` | Primary text |
| Moss | `#315B43` | Primary action and listening state |
| Deep moss | `#214332` | Hover / active action |
| Fern | `#6F8B68` | Rules and diagram detail |
| Rust | `#A2462E` | Warnings and errors, paired with icon/text |
| Ochre | `#8B641D` | Offline/not-supported notices |
| Hairline | `#B9B39E` | Dividers and input outlines |

Carbon on Paper is approximately 13.5:1. Pulp on Moss is approximately 7.5:1. Rust is only used for large/icon accents; error copy remains Carbon so meaning and contrast never depend on color alone.

## Typography

- **Field notes:** Georgia, Cambria, `Times New Roman`, serif. The warm, highly differentiated letterforms suit longer explanatory passages and require no network font.
- **Specimen labels and code:** `ui-monospace`, SFMono-Regular, Consolas, `Liberation Mono`, monospace. It connects controls directly to code and keeps punctuation unambiguous.
- Scale: 13px label, 16px body, 20px section title, 32px display, clamp(44px–72px) hero. Body leading is 1.55 and readable measure is capped at 68 characters.

No font files or third-party font services are loaded. The system pairing makes the extension fast and familiar while retaining a deliberate editorial voice.

## Spacing and shape

- Base rhythm: 4px. Core steps: 4, 8, 12, 16, 24, 32, 48, 72, 96.
- Page content: max 1180px, 24px mobile gutters, 48px desktop gutters.
- Controls are at least 44px high with 8px between targets.
- Corners are restrained: 2px labels, 8px controls, 16px specimen sheets. The hierarchy comes from paper layering and offset ink shadows, not a grid of interchangeable cards.
- Rules are 1px; focus uses a 3px Rust outline with 3px offset.

## Interaction grammar

- **Listen:** a vertical green cursor appears beside the selected specimen and the status label changes immediately.
- **Follow:** represented as a pinned field observation; the pin state is expressed by copy and control state, not color alone.
- **Repeat:** returns to the last collected specimen, echoing an accession record.
- **Pronunciation:** entries read like label pairs (`=>` visually; “is spoken as” to assistive tech).
- Main keyboard path: `Alt+Shift+S` listen to selection/current line, `Alt+Shift+F` toggle follow, `Alt+Shift+R` repeat, `Escape` stop. These avoid common native screen-reader single-key commands and remain configurable in the extension manager.

## Motion policy

UI transitions last 180–240ms and animate opacity or transform only. The listening cursor grows once from its origin when speech begins; the popup status fades between states. Nothing loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and state changes are immediate. Listening never depends on animation.

## Responsive intent

At 390px, navigation copy collapses to the two essential anchors, the hero becomes one column, specimen metadata is hidden, and controls stack at full width. The field-station demo remains fully operable by touch and keyboard. The generated hero image moves below the introductory copy and is cropped by its own composition rather than shrinking text into illegibility.

## Asset plan and provenance

- `site/public/hero-field-guide.webp` plus a 640px responsive derivative and JPEG fallbacks: original generated editorial illustration, used as the explanatory hero specimen. The browser selects the 38 KB mobile WebP or 148 KB desktop WebP; explicit dimensions prevent layout shift. The PNG source is retained under `assets/src/`.
- Extension icons and interface glyphs are original hand-authored SVGs based on a leaf vein / text cursor motif. They are MIT-licensed with the repository.
- No stock imagery, brand marks, or third-party icon library.

### Prompt sheet

- **Use case:** stylized-concept
- **Asset type:** wide landing-page hero illustration
- **Subject/world:** an open vintage botanical field notebook documenting a branching fern whose fronds subtly resemble indented lines of source code; one slim dark-green reading cursor traces a single frond; small blank specimen tabs and ruled annotations with no legible writing
- **Materials:** fibrous cream paper, graphite, faded botanical ink, pressed leaf, linen binding
- **Light/lens:** soft north-window daylight, overhead three-quarter view, editorial still life, shallow physical layering but crisp specimen details
- **Palette words:** warm paper, carbon ink, moss, fern, restrained rust registration marks
- **Composition:** landscape, subject weighted right with calm paper negative space on the left for nearby page copy; no interface mockup
- **Negative list:** no people, no hands, no screens, no logos, no brands, no readable text, no letters, no watermark, no neon, no gradients, no glossy 3D, no generic technology symbols

Prompt executed through the factory Azure image generator (`factory-image`), 2026-08-28. Generated artwork is original for this product under the repository’s MIT license. The final candidate is visually reviewed for fake writing, unwanted brands, seams, and palette consistency before use.
