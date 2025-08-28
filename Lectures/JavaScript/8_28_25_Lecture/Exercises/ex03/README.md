# Exercise: Books open-only filter + sort by pages

## Goal

Filter by in-stock status and sort by page count.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Step 1: Checkbox `#only-in-stock`, select `#sort-by` with options `pages-desc`, `pages-asc`, `title-asc`, and a results container `#book-info`.
- Step 2: Keep `books` array `{ id, title, pages, inStock }`.
- Step 3: UI state `{ onlyInStock: false, sortBy: 'pages-desc' }`.
- Step 4: `getVisibleBooks()` filters in-stock when checked, then sorts based on `sortBy`.
- Step 5: Render derived list with an empty message when none.
- Step 6: Wire `change` handlers to update state and re-render.

## How to run

- Use Live Server.
- Expected: Toggling the checkbox hides out-of-stock items; sort updates order.

## What good looks like

- Checkbox correctly filters; comparator returns yield consistent ordering.

## Stretch goal (optional)

- Add a search box to combine with the filters and sort.
