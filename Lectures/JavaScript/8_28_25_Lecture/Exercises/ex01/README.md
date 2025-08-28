# Exercise: Product search (name contains)

## Goal

Search products by name (case-insensitive) and render matches.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Step 1: Add a search input `#search` and a results container `#product-info`.
- Step 2: Keep a `products` array of `{ id, name, price }` (seed a few items).
- Step 3: Add UI state `{ searchText: '' }`.
- Step 4: Implement `getVisibleProducts()` that filters products whose `name` includes the lowercased `searchText`.
- Step 5: In `render()`, show "No products match" when list is empty; else list items.
- Step 6: On `input` event of `#search`, update `searchText` and call `render()`.

## How to run

- Use Live Server.
- Expected: Typing in search narrows the list immediately.

## What good looks like

- Query is case-insensitive.
- Empty state message shows correctly when no matches.

## Stretch goal (optional)

- Highlight matching text portion in each product name.
