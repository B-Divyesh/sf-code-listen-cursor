# Sandbox acceptance contract

This owner-approved contract supersedes the earlier research draft. The release outcome is deterministic and can be checked from a clean clone without accounts, private data, or external participants. No external user-study result is required or promised.

`npm test -- --testNamePattern @claim:structure-aware-speech` runs every fixture in `tests/fixtures/structural-cues.json`. The set covers JavaScript, TypeScript, Python, Rust, shell, indentation, common operators, delimiters, identifier splitting, and a personal pronunciation. The test passes only when every generated utterance includes every expected spoken cue.

Keyboard operation, focus, semantic structure, live status, responsive layout, and automated accessibility rules run in both desktop Chromium and the 390 px Playwright project. Installed-package checks exercise the browser shortcuts and extension controls from clean browser and editor harnesses.

`npm run test:e2e -- --grep @claim:local-voice` exposes only a non-local voice. It passes only when no utterance is constructed or spoken, the deterministic preview remains, and the page explains how to install or enable a local voice. Packaged browser and VS Code tests apply the same fail-closed rule.

The responsive suite also checks every public route at 195 CSS px, the reflow equivalent of 200% zoom at 390 px. It rejects horizontal overflow, missing navigation, text below 16 px, and interactive targets below 44 by 44 CSS px.

The exact commands for all public promises remain in `.factory/claims.json`.
