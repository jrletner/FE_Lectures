# Exercise: Upcoming releases (future filter + sort)

## Goal

Render only future-dated items from a list, sorted by date ascending. Include a watched toggle and an optional "hide watched" control.

## Files you will create

- index.html
- styles.css
- app.js

## What to build

- Data: Create an array `all` of objects with shape `{ id, title, dateStr, watched }`.
  - Example: `{ id: makeId('r'), title: 'Web APIs Deep Dive', dateStr: '2025-10-05', watched: false }`.
- Parse once: Convert each `dateStr` to a real `Date` and store it on the object as `date` (e.g., `x.date = new Date(x.dateStr)`).
- Derived view: Write a function `getUpcoming()` that returns only items with `date > now`, sorted ascending by date.
- Render:
  - Put a count into `#release-info` like `Upcoming: N`.
  - Render list items into `#release-list` as: `Title — <localized date>`.
  - Add a button per item to toggle `watched` and re-render.
- Optional control: Add a checkbox with id `hide-watched`. When checked, hide items where `watched === true`.

## Expected HTML ids

- `#release-info` — summary text
- `#release-list` — the `<ul>` for items
- `#hide-watched` — optional checkbox (stretch)

## How to run

- Use VS Code Live Server (Right‑click `index.html` → "Open with Live Server").
- You should see only future items, in date order, with a working watched toggle.

## What good looks like

- Past dates do not render at all.
- Future items are sorted ascending by date.
- Toggling watched updates the button label and the summary count.
- Checking "Hide watched" removes watched items from the list.
- No console errors.

## Hints

- Compute and store `date` once to avoid repeated parsing.
- `Array.prototype.filter` then `sort((a, b) => a.date - b.date)` works well.
- Re-render after every state change to keep UI and count in sync.
