# Exercise: Grocery list with quantities

## Goal
Add grocery items with name and quantity, show a running total, remove by id, and render after each change.

## Files you will create
- index.html
- styles.css
- app.js

## What to build
- Step 1: Add `#grocery-info` and a form with `#grocery-name` and `#grocery-qty` (number, min=1) and a submit button.
- Step 2: Make `makeId('g')` and an array `groceries` of `{ id, name, qty }`.
- Step 3: On submit, trim name, coerce qty with `parseInt`; if name is empty or qty < 1, show an error and return.
- Step 4: Push into `groceries` and call `render()`; reset inputs and focus name.
- Step 5: `render()` lists items and shows a summary line `Total items: X` (sum of qty); each row has a Remove button.
- Step 6: A single click handler on `#grocery-info` removes by id and re-renders.

## How to run
- Use Live Server.
- Expected: Valid adds render; invalid inputs show error; Remove deletes correct item; summary updates.

## What good looks like
- Input validation works; list updates immediately; total reflects the array.

## Stretch goal (optional)
- Prevent duplicate names (case-insensitive) by merging quantities instead of rejecting.
