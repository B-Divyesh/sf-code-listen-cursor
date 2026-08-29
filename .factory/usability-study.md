# 20-snippet participant study

Status: **participant evidence not yet collected**

Protocol prepared: 2026-08-29

The researched brief requires people to identify the requested symbol or indentation relationship in at least 16 of 20 snippets. It also requires output evaluation with screen-reader users. This repair ran in a container with no human participants, so it does not invent consent or comprehension results.

## Automated preflight

`npm test -- --testNamePattern @research-proxy:20-snippet` runs the exact 20-item fixture in `tests/fixtures/comprehension-snippets.json`. It verifies that each generated utterance contains its intended structural cues. This catches reader regressions before a participant hears the set, but it is not a substitute for human comprehension evidence.

## Participant protocol

1. Recruit at least one consenting screen-reader user and participants who use auditory coding workflows. Do not record names, source files, or disability details.
2. Explain that the test measures the tool, not the participant. Let each person stop at any time.
3. Use a fresh installed package, an installed local voice, and the 20 fixtures in randomized order. Do not show the source until after each answer.
4. Ask the participant to identify the named symbol or indentation relationship from audio alone. Record only correct, incorrect, skipped, and optional wording feedback.
5. Test the popup and VS Code settings panels with the participant’s normal screen reader. Record focus order, control names, state announcements, speech conflicts, and shortcut conflicts.
6. Pass only when at least 16 of 20 answers are correct and no screen-reader blocker remains. Record the package hash, voice, browser/editor, screen reader, anonymized score, and consent date below.

## Results record

No participant result exists yet. The release owner must append consented evidence here without personal information before treating the brief’s human success measure as met.

| Package SHA-256 | Environment | Assistive technology | Score | Consent date | Result |
| --- | --- | --- | ---: | --- | --- |
| Pending | Pending | Pending | —/20 | Pending | Not run |
