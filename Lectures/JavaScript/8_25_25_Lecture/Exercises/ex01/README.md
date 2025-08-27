# Exercise: Todo list add/remove by id

## Goal
Build a tiny todo list with an id helper, add via form, remove via button, and render from state.

## Files you will create
- index.html
- styles.css
- app.js

## What to build
- Step 1: Add a container section with id `todo-info` and a simple form with an input `#todo-title` and a submit button labeled "Add Todo".
- Step 2: In `app.js`, create a `makeId(prefix)` helper that returns strings like `t_1`, `t_2`, etc.
- Step 3: Keep todos in an array `todos` (objects with `id` and `title`).
- Step 4: Handle form submit: trim the title, if empty show an error in `#error-message` and return early.
- Step 5: Push a new todo `{ id: makeId('t'), title }` and then call `render()`.
- Step 6: Implement `render()` to clear `#todo-info` and render a list of todos; each item has a "Remove" button with `data-id`.
- Step 7: Add a single click handler on `#todo-info` that removes the todo by id (use `findIndex` + `splice`) and calls `render()` again.

## How to run
- Use VS Code Live Server (Right‑click `index.html` → "Open with Live Server").
- Expected behavior: Page loads with an empty list; adding shows the item; clicking Remove deletes it.

## What good looks like
- Adding a todo shows immediately in the list.
- Empty input shows a short error message and adds nothing.
- Remove deletes the matching item only.

## Stretch goal (optional)
- Disable the Add button when the input is empty (enable only when there’s text).
