# CSV2JSON

A browser-based tool for converting between CSV and JSON, in either direction, with no external parsing libraries.

## Features

- **Bidirectional conversion** — paste or load CSV or JSON, convert to the other format
- **Hand-written parsers** — no third-party CSV/JSON conversion libraries; both `csvToJson` and `jsonToCsv` are implemented from scratch
- **Quoted-field support** — CSV fields containing commas, quotes, or newlines are parsed and escaped correctly (e.g. `"Smith, John",NYC`)
- **Validation with clear errors** — empty input, invalid JSON, and mismatched CSV row/column counts are caught and surfaced as readable messages, not crashes
- **File system integration** — open and save `.csv` / `.json` files directly from disk using the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API), including writing back to a previously opened file without re-prompting
- **Light/dark theme** — toggle persisted in `localStorage`, respects the OS-level `prefers-color-scheme` on first visit
- **Single-input, single-output UI** — one input box, one output box, and direction is decided by which convert button you click (no separate mode toggle to manage)

## Tech stack

Vanilla JavaScript (ES Modules), HTML, CSS. No frameworks, no build step, no dependencies.

## Project structure

```
.
├── index.html
├── style.css
└── scripts/
    ├── main.js          # Event wiring, orchestrates everything below
    ├── dom.js            # DOM element references, warning/file-status UI helpers
    ├── theme.js          # Light/dark theme toggle + persistence
    ├── jsonToCsv.js      # Pure function: JSON array → CSV string
    ├── csvToJson.js      # Pure function: CSV string → JSON array
    ├── validators.js     # JSON validation helper
    └── fileIO.js         # File System Access API wrapper (open/save, per-type handles)
```

Logic is kept separate from DOM and event handling throughout: `jsonToCsv.js`, `csvToJson.js`, and `validators.js` have no DOM references and can be unit tested in isolation.

## Running locally

This project uses ES Modules, which browsers block over `file://`. Serve it with any local server:

```bash
npx serve .
```

or use VS Code's Live Server extension. Then open the served URL in **Chrome or Edge** (see browser support note below).

## Usage

1. Paste CSV or JSON into the input box, or click **Upload CSV / JSON** to load a file directly
2. Click **To CSV** or **To JSON** to convert
3. Click **Download Result** to save the output, writes back to the originally opened file if there is one, otherwise prompts a save location
4. Click **Clear** to reset both boxes and any tracked file handles

## Scope and known limitations

- **Nested JSON is not supported.** Converting an object with nested objects or arrays to CSV will stringify them rather than flatten them (e.g. `[object Object]`). This was an explicit project constraint, flattening nested structures into flat CSV rows is ambiguous (dot-notation columns? JSON-in-a-cell? row expansion?) and was left out of scope.
- **A single JSON object (not wrapped in an array) is auto-wrapped** into a one-element array before conversion, since this is the more common shape for real-world API responses.
- **File System Access API is Chromium-only** (Chrome, Edge). Firefox and Safari users will see a graceful warning instead of a crash, but cannot use Open/Save.
