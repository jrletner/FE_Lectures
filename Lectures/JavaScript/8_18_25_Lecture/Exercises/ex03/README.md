# Exercise: Empty state + footer year

## Goal

Practice showing an empty state when a list is empty, and rendering the current year in the footer.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Step 1: In `index.html`, add a list container with id `grocery-list` and a footer with `&copy; <span id="year"></span>`.
- Step 2: In `app.js`, create `let items = []` (empty) and implement `render()` so that:
  - When `items.length === 0`, `#grocery-list` shows a single line: `No items yet. Add your first item!`
  - Otherwise, render one `<div>` per item.
- Step 3: Set the footer year by writing the current year into `#year` using `new Date().getFullYear()`.

## How to run

- Use VS Code Live Server (Right‑click `index.html` → "Open with Live Server").
- Expected behavior: The page shows the empty-state message and the footer year is the current year.

## What good looks like

- With `items = []`, the empty-state text appears and no other rows are present.
- If you set `items = ['Example']` in code and call `render()`, the empty state disappears and the item row appears.
- The footer displays the current year number.

## Stretch goal (optional)

- Style the empty-state line with a lighter color (e.g., gray) via a class `empty`.
