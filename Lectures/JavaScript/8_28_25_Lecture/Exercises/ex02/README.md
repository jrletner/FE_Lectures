# Exercise: Movies filter + sort

## Goal

Filter movies by minimum rating and sort by year or title.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Step 1: Add controls: number input `#min-rating` (0–10), select `#sort-by` with options `year-desc`, `year-asc`, `title-asc`.
- Step 2: Keep a `movies` array `{ id, title, year, rating }` (seed several).
- Step 3: UI state `{ minRating: 0, sortBy: 'year-desc' }`.
- Step 4: `getVisibleMovies()`: filter `rating >= minRating`, then `sort` per `sortBy`.
- Step 5: Render derived list with a message on empty.
- Step 6: Wire `change/input` handlers to update state and re-render.

## How to run

- Use Live Server.
- Expected: Changing rating and sort updates the list.

## What good looks like

- Movies below the threshold disappear.
- Sort order reflects the selected option.

## Stretch goal (optional)

- Add a search input to combine with filter and sort.
