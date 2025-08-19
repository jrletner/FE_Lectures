# Exercise: Grocery list (add and render)

## Goal

Practice reading input, validating, pushing into an array, and rendering the list.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Step 1: In `index.html`, add an input with id `item-input`, a button with id `add-btn`, and a list container with id `grocery-list`.
- Step 2: In `app.js`, create an empty array `items = []`.
- Step 3: Implement `addItem(name)` that trims the name and only pushes non-empty items.
- Step 4: Implement `render()` that writes each item as a `<div>` inside `#grocery-list`.
- Step 5: Wire up the button click to read from `#item-input`, call `addItem(value)`, clear the input, and call `render()`.

## How to run

- Use VS Code Live Server (Right‑click `index.html` → "Open with Live Server").
- Expected behavior: Enter a name and click Add to see it appended to the list.
- Console check: `addItem('Milk'); render();` appends to the list.

## What good looks like

- Blank names are ignored (no new rows).
- Each new item appears at the bottom.
- Refreshing the page shows an empty list (no persistence yet).

## Stretch goal (optional)

- Prevent duplicate names (case-insensitive). If a duplicate is added, ignore it.
