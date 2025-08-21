# Exercise: Book progress card

## Goal

Build a small progress card for a book using a class with a getter for percent complete.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Step 1: Create `class Book` with `title`, `pagesTotal`, `pagesRead` and a getter `percentComplete` that returns a rounded percentage (0–100).
- Step 2: Create one `book` instance (e.g., "Clean Code", 464, 120). Render a simple card into an element with id `book-info` showing title and `X% complete`.
- Step 3: Add a function `addReadPages(n)` that increases `pagesRead` but never exceeds `pagesTotal`. Re-render after calling it.

## How to run

- Use VS Code Live Server (Right‑click `index.html` → "Open with Live Server").
- Expected behavior: You see the card with the title and the correct percent complete.

## What good looks like

- `percentComplete` is computed from `pagesRead/pagesTotal` and rounded.
- Calling `addReadPages(50)` updates the UI and never exceeds 100%.
- No console errors.

## Stretch goal (optional)

- Add `resetProgress()` method that sets `pagesRead` back to 0 and re-render.
