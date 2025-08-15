# Class 8 Upgrade Walkthrough — Step by Step
**From:** Class 7 (single JS file with helpers)  
**To:** Class 8 (ES Modules + folders)

This guide walks you through splitting your code cleanly into modules.

---

## Step 0 — Create folders
Make these folders:
```
src/
  app.js
  models/
    Club.js
    Member.js
    EventItem.js
  store/
    data.js
    filters.js
  utils/
    debounce.js
    pipe.js
  ui/
    render.js
```

---

## Step 1 — Update `index.html` to use modules
Replace your old script tag with:
```html
<script type="module" src="src/app.js"></script>
```

---

## Step 2 — Move your classes
Cut your `Member`, `EventItem`, and `Club` classes into separate files:
- `src/models/Member.js`
- `src/models/EventItem.js`
- `src/models/Club.js` (import `Member` inside this file)

Export each class with `export class ... {}` and update imports where needed.

---

## Step 3 — Create a tiny data store
Add `src/store/data.js`:
```js
import { Club } from '../models/Club.js';

export let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club",    current: 8, capacity: 8 }),
  Club.fromPlain({ name: "Book Club",   current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics",    current: 5, capacity: 6 }),
];

export function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
}

export function findClubById(id) {
  return clubs.find(c => c.id === id);
}
```

---

## Step 4 — Move filter/sort into a module
Add `src/store/filters.js`:
```js
import { pipe } from '../utils/pipe.js';

export const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };

const applySearch = (list) => { /* ... */ };
const applyOnlyOpen = (list) => { /* ... */ };
const applySort = (list) => { /* ... */ };

export const getVisibleClubs = pipe(
  (arr) => arr.slice(),
  applySearch,
  applyOnlyOpen,
  applySort
);
```

---

## Step 5 — Utilities as modules
- `src/utils/debounce.js` → `export function debounce(...) { ... }`
- `src/utils/pipe.js`     → `export function pipe(...) { ... }`

---

## Step 6 — Rendering in `src/ui/render.js`
Create a `renderClubs(visibleClubs)` function that builds the DOM.  
Export a small `setStatus(clubId, message)` helper for inline feedback.

---

## Step 7 — Wire everything in `src/app.js`
- Import `clubs`, `addClub`, `findClubById` from the store.
- Import `ui` and `getVisibleClubs` for toolbar behavior.
- Import `debounce` and the rendering functions.
- Keep **event delegation** in `app.js` (click handler on `#club-info`).

---

## Step 8 — Serve over HTTP
Use **Live Server**, `python -m http.server`, or `npx http-server` so module imports work in the browser.

That’s it! You now have a clean, modular structure that’s easy to grow in future classes.
