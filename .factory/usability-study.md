# 20-snippet acceptance audit

Date: 2026-08-29. This repository now carries deterministic coverage for the code-to-speech rules used by the product. It does **not** claim to replace the brief's requested participant usability study with screen-reader and auditory-workflow users.

The release gate that can be run in this environment is `npm test`; it covers indentation, braces, operators, camel case, snake case, custom pronunciation, JavaScript/TypeScript, Python, Rust, shell, cursor-boundary selection, and local voice preference. A participant study remains external research and must be recorded with consent before claiming the 16/20 human-comprehension result.

The candidate deliberately makes no public 16/20 comprehension claim until that study exists.
