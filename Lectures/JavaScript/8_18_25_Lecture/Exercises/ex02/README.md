# Exercise: Grocery list — validation + duplicate guard

## Goal

Practice input validation and a simple duplicate check before adding to an array, then render.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Step 1: In `index.html`, add an input with id `item-input`, a button with id `add-btn`, a paragraph with id `error` (for messages), and a list container with id `grocery-list`.
- Step 2: In `app.js`, create `const items = []`.
- Step 3: Implement `addItem(name)` that trims the name and returns a small result object:
  - `{ ok: false, message: "Name required" }` when blank
  - `{ ok: false, message: "Duplicate item" }` when a case-insensitive duplicate exists
  - `{ ok: true }` after pushing a valid item
- Step 4: Implement `render()` that writes each item as a `<div>` inside `#grocery-list`.
- Step 5: On Add click, read `#item-input`, call `addItem(value)`. If `result.ok` is `false`, set `#error.textContent = result.message`; if `true`, clear `#error`, clear the input, and call `render()`.

## How to run

- Use VS Code Live Server (Right‑click `index.html` → "Open with Live Server").
- Expected behavior: Adding blanks shows “Name required”; adding an existing item shows “Duplicate item”; valid items append to the list.

## What good looks like

- Blank names are prevented and show the correct message.
- Duplicate names (case-insensitive) are prevented and show the correct message.
- Valid adds clear the message and append a new row.

## Stretch goal (optional)

- After a successful add, focus the input and select its content so you can type quickly (`input.focus(); input.select();`).
