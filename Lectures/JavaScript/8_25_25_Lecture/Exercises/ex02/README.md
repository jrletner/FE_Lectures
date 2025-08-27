# Exercise: Bookshelf add/remove with validation

## Goal

Add books with title and author; reject empty titles; prevent duplicates by title; remove by id; render after each change.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Step 1: Add a container `#book-info` and a form with `#book-title` and `#book-author` inputs and a submit button.
- Step 2: Make `makeId('b')` and a `books` array of objects `{ id, title, author }`.
- Step 3: On submit, trim inputs, if `title` is empty show an error in `#error-message`.
- Step 4: Prevent duplicates: if `books.some(b => b.title.toLowerCase() === title.toLowerCase())`, show an error.
- Step 5: Push into `books` then `render()`; reset inputs and focus title.
- Step 6: `render()` lists each book with a Remove button; a single click handler removes by id and re-renders.

## How to run

- Use Live Server.
- Expected: Adding valid unique titles shows them; duplicate/empty shows an error; Remove deletes the right one.

## What good looks like

- Validation prevents empty/duplicate titles.
- Remove works by id.
- UI matches the array.

## Stretch goal (optional)

- Show a small note: `N books total` under the list.
