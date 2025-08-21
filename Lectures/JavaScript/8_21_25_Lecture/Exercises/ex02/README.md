# Exercise: Task list (add/remove by id)

## Goal

Build a small task list that adds tasks, prevents duplicates, and removes by id.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Step 1: Add a helper `makeId(prefix)` that returns ids like `t_ab12`.
- Step 2: Create a `TaskList` object with an array `tasks` and methods `addTask(title)` and `removeTask(id)`.
- Step 3: Render tasks into `#task-list` and a text summary into `#list-info`. Wire a remove button per task.

## How to run

- Use VS Code Live Server (Right‑click `index.html` → "Open with Live Server").
- Expected behavior: Adding a task updates the list; removing a task deletes the correct row.

## What good looks like

- Duplicate titles (case-insensitive) are rejected.
- Remove deletes by id, not by text.
- No console errors.

## Stretch goal (optional)

- Make `addTask` return `{ ok, message }` and show any message in an element with id `message`.
