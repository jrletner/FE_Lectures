# Class 10 — Persistence (localStorage) + Import/Export

## At a glance (optional)

- What you’ll build: Persist clubs/members/events to localStorage; export/import JSON; reset to default seed
- Files touched: index.html, styles.css, src/app.js, src/store/data.js, src/store/persist.js, src/models/{Club,Member,EventItem}.js
- Est. time: 60–90 min
- Prereqs: Finished Class 9

## How to run

- Use the VS Code Live Server extension (Right‑click `index.html` → "Open with Live Server").
- Requires internet for the CDN (dayjs + nanoid). Avoid opening via `file://`.

## How to use

- Live-code friendly. Paste small snippets in order and verify the ✅ Check after each step.
- Keep the browser and console open; test both good and bad inputs.

## Before you start

- Open: `JS_Mini_Project/class_code/class_10`
- Baseline: Compare Class 9 vs Class 10 files to author accurate diffs.
- Files to diff: `index.html`, `styles.css`, `src/app.js`, `src/store/data.js`, `src/models/*.js`
- Reset plan: If things drift, use the Appendix versions as a known-good end state.

## What changed since last class

Structural note: Added `src/store/persist.js` with `saveState/loadState/clearState`. Models gained `.toPlain()` and `.fromPlain()` to safely serialize/restore data.

```diff
# index.html
- <title>Campus Club Manager — Class 9</title>
+ <title>Campus Club Manager — Class 10</title>
-     <p>Events with Dates & IDs (Day.js + nanoid)</p>
+     <p>Persistence with <code>localStorage</code> + Import/Export</p>
+
+     <!-- NEW: persistence controls in the toolbar -->
+     <div class="spacer"></div>
+     <button id="export-json" class="btn" type="button">Export JSON</button>
+     <input id="import-file" type="file" accept="application/json" hidden />
+     <button id="import-json" class="btn" type="button">Import JSON</button>
+     <button id="reset-data" class="btn" type="button">Reset Data</button>
```

```diff
# styles.css
+ .spacer { flex: 1; }
```

```diff
# src/store/persist.js (new)
+ // saveState, loadState, clearState using localStorage
```

```diff
# src/models/Member.js
+ constructor(name, role = "member", id = nanoid()) { this.id = id; ... }
+ toPlain() { return { id, name, role } }
+ static fromPlain(obj) { return new Member(obj.name, obj.role || "member", obj.id); }
```

```diff
# src/models/EventItem.js
+ constructor(..., id = nanoid()) { this.id = id; ... }
+ toPlain() { return { id, title, dateISO, description, capacity, rsvps: [...] } }
+ static fromPlain(obj) { const e = new EventItem(..., obj.id); e.rsvps = new Set(obj.rsvps || []); return e; }
```

```diff
# src/models/Club.js
- constructor(name, capacity = 1) { this.id = nanoid(); ... }
+ constructor(name, capacity = 1, id = nanoid()) { this.id = id; ... }
+ toPlain() { return { id, name, capacity, members: [...], events: [...] } }
+ static fromPlain(obj) { /* rebuild members/events from plain; support legacy current */ }
```

```diff
# src/store/data.js
- export let clubs = [ Club.fromPlain({ name: "Coding Club", current: 3, ... }) , ... ]
+ import { loadState } from './persist.js';
+ const defaultSeed = [ Club.fromPlain({ name: "Coding Club", members: [...], events: [...] }), ... ];
+ const saved = loadState();
+ export let clubs = Array.isArray(saved) ? saved.map(Club.fromPlain) : defaultSeed;
+ export function setClubs(plainArray) { clubs.splice(0, clubs.length, ...plainArray.map(Club.fromPlain)); }
+ export function toPlainArray(currentClubs) { return currentClubs.map(c => c.toPlain()); }
```

```diff
# src/app.js
+ import { saveState, loadState, clearState } from './store/persist.js';
+ // call saveState(clubs) after mutations and at startup
+ // add handlers: Export JSON, Import JSON (hidden file input), Reset Data
```

## File tree (current class)

```text
class_10/
  index.html
  styles.css
  campus-club-manager-data.json
  src/
    app.js
    models/
      Club.js
      Member.js
      EventItem.js
    store/
      data.js
      filters.js
      persist.js
    ui/
      render.js
    utils/
      debounce.js
      externals.js
      pipe.js
```

> Note: Path references below are relative to `class_10/`.

## Live-coding steps

### 1) index.html — add persistence controls and update labels

> 📍 Where: `index.html` → `<head>` title; toolbar section inside `<section class="toolbar">`
>
> ℹ️ What: Change title/subtitle for Class 10 and add Export/Import/Reset buttons (with a hidden file input).
>
> 💡 Why: Buttons provide a simple UX for saving and restoring app data.
>
> ✅ Check: Toolbar shows three new buttons; clicking Export downloads a JSON file.

```diff
# DO NOT PASTE — REMOVE EXACTLY THESE LINES (prior subtitle)
-     <p>Events with Dates & IDs (Day.js + nanoid)</p>
```

```html
<!-- (Required) Commented context — exact anchors in header -->
<!-- <h1>Campus Club Manager</h1> -->
<!-- <p>Events with Dates & IDs (Day.js + nanoid)</p> -->

<!-- Add/Update -->
<title>Campus Club Manager — Class 10</title>

<!-- header subtitle -->
<p>Persistence with <code>localStorage</code> + Import/Export</p>
```

```html
<!-- (Required) Commented context — toolbar anchors -->
<!-- <section class="toolbar"> -->
<!--   <select id="sort-by" class="select" aria-label="Sort clubs"> -->

<!-- Add persistence controls at end of the toolbar -->
<div class="spacer"></div>
<button id="export-json" class="btn" type="button">Export JSON</button>
<input id="import-file" type="file" accept="application/json" hidden />
<button id="import-json" class="btn" type="button">Import JSON</button>
<button id="reset-data" class="btn" type="button">Reset Data</button>
```

### 2) styles.css — add a flexible spacer in toolbar

> 📍 Where: `styles.css` → near other toolbar utility styles
>
> ℹ️ What: Add `.spacer { flex: 1; }` to push controls to the right.
>
> 💡 Why: Keeps the toolbar readable on small screens.
>
> ✅ Check: New buttons align to the right on wide screens.

```css
/* (Required) Commented context — toolbar block */
/* .toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin: 12px 0 16px; } */

/* Add */
.spacer {
  flex: 1;
}
```

> Checkpoint 1
>
> - Visual: Buttons appear and align nicely.
> - Console: No errors.

### 3) persist.js — create save/load/clear helpers

> 📍 Where: `src/store/persist.js` (new file)
>
> ℹ️ What: Store arrays of “plain” objects in localStorage to survive reloads.
>
> 💡 Why: Serializing classes directly will drop methods; plain shape is robust.
>
> ✅ Check: Open DevTools → Application → Local Storage; see a `ccm:v1` key after interactions.

```js
// New file: src/store/persist.js
// Save/load to localStorage. Stores plain objects so we can revive into classes.
const STORAGE_KEY = "ccm:v1";

export function saveState(clubs) {
  try {
    const plain = clubs.map((c) =>
      typeof c.toPlain === "function" ? c.toPlain() : c
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  } catch (e) {
    console.error("Failed to save:", e);
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load:", e);
    return null;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear state:", e);
  }
}
```

### 4) Models — add serialization and stable IDs

#### 4.1 Member: id param + toPlain/fromPlain

> 📍 Where: `src/models/Member.js` → constructor and class statics
>
> ℹ️ What: Accept an optional `id` for restores; implement `toPlain()` and `fromPlain()`.
>
> 💡 Why: Enables lossless save/restore of members.
>
> ✅ Check: `new Member('A').toPlain()` returns `{ id, name, role }`.

```js
// (Required) Commented context — prior constructor
// export class Member {
//   constructor(name, role = "member") {
//     this.id = nanoid();
//     this.name = name;
//     this.role = role;
//   }
// }

// Add/Update — constructor + serializers
constructor(name, role = "member", id = nanoid()) {
  this.id = id;
  this.name = name;
  this.role = role;
}

toPlain() {
  return { id: this.id, name: this.name, role: this.role };
}

static fromPlain(obj) {
  return new Member(obj.name, obj.role || "member", obj.id);
}
```

#### 4.2 EventItem: id param + toPlain/fromPlain + RSVPs

> 📍 Where: `src/models/EventItem.js` → constructor and serializers
>
> ℹ️ What: Accept optional `id`; implement `toPlain()` and `fromPlain()`; persist `rsvps`.
>
> 💡 Why: Keeps event identity and attendance across reloads.
>
> ✅ Check: After save+reload, events render with the same IDs and friendly dates.

```js
// (Required) Commented context — prior constructor head
// export class EventItem {
//   constructor(title, dateISO, description = "", capacity = 100) {
//     this.id = nanoid();
//     this.title = title;
//     this.dateISO = dateISO;
//     this.description = description;
//     this.capacity = capacity;
//     this.rsvps = new Set();
//   }
// }

// Add/Update — constructor + serializers
constructor(title, dateISO, description = "", capacity = 100, id = nanoid()) {
  this.id = id;
  this.title = title;
  this.dateISO = dateISO;
  this.description = description;
  this.capacity = capacity;
  this.rsvps = Array.isArray(this.rsvps) ? new Set(this.rsvps) : new Set();
}

toPlain() {
  return { id: this.id, title: this.title, dateISO: this.dateISO, description: this.description, capacity: this.capacity, rsvps: Array.from(this.rsvps) };
}

static fromPlain(obj) {
  const evt = new EventItem(obj.title, obj.dateISO, obj.description || "", obj.capacity || 100, obj.id);
  evt.rsvps = new Set(Array.isArray(obj.rsvps) ? obj.rsvps : []);
  return evt;
}
```

#### 4.3 Club: id param + toPlain/fromPlain

> 📍 Where: `src/models/Club.js` → constructor and serializers
>
> ℹ️ What: Accept optional `id`; implement `toPlain()` and `fromPlain()`; sort events on rebuild.
>
> 💡 Why: Supports stable identities and complete round-trips.
>
> ✅ Check: Export JSON → Reset → Import JSON results in identical state.

```js
// (Required) Commented context — prior constructor head
// export class Club {
//   constructor(name, capacity = 1) {
//     this.id = nanoid();
//     this.name = name;
//     this.capacity = capacity;
//     this.members = [];
//     this.events = [];
//   }
// }

// Add/Update — constructor + serializers
constructor(name, capacity = 1, id = nanoid()) {
  this.id = id;
  this.name = name;
  this.capacity = capacity;
  this.members = [];
  this.events = [];
}

toPlain() {
  return { id: this.id, name: this.name, capacity: this.capacity, members: this.members.map(m => m.toPlain()), events: this.events.map(e => e.toPlain()) };
}

static fromPlain(obj) {
  const c = new Club(obj.name, obj.capacity, obj.id);
  (obj.members || []).forEach(m => c.members.push(Member.fromPlain(m)));
  (obj.events || []).forEach(e => c.events.push(EventItem.fromPlain(e)));
  if (!obj.members && typeof obj.current === 'number') {
    for (let i = 0; i < obj.current; i++) c.addMember(`Member ${i + 1}`);
  }
  c.sortEvents();
  return c;
}
```

> Checkpoint 2
>
> - Console: `new Club('X',1).toPlain()` returns a plain object with empty arrays.
> - Visual: No UI change yet.

### 5) data.js — load from saved state or default seed; expose helpers

> 📍 Where: `src/store/data.js` → top imports and export body
>
> ℹ️ What: Add `loadState` and seed as an array of `Club.fromPlain` with members/events; expose `setClubs` and `toPlainArray`.
>
> 💡 Why: Centralizes shape and abstracts the serialization.
>
> ✅ Check: Reload keeps your clubs/members/events; Reset (later) will restore defaults.

```diff
# DO NOT PASTE — REMOVE EXACTLY THESE LINES (Class 9 seeds)
- export let clubs = [
-   Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10, events: [...] }),
-   ...
- ];
```

```js
// (Required) Commented context — top of file
// import { Club } from '../models/Club.js';

// Add/Update — saved state + default seed + helpers
import { loadState } from "./persist.js";

const defaultSeed = [
  Club.fromPlain({
    name: "Coding Club",
    capacity: 10,
    members: [{ name: "Ava" }, { name: "Ben" }, { name: "Kai" }],
    events: [
      {
        title: "Hack Night",
        dateISO: "2025-09-10",
        description: "Bring a project.",
        capacity: 30,
      },
      {
        title: "Intro to Git",
        dateISO: "2025-09-03",
        description: "Hands-on basics.",
      },
    ],
  }),
  Club.fromPlain({
    name: "Art Club",
    capacity: 8,
    members: [
      { name: "Riley" },
      { name: "Sam" },
      { name: "Noah" },
      { name: "Maya" },
      { name: "Ivy" },
      { name: "Leo" },
      { name: "Zoe" },
      { name: "Owen" },
    ],
    events: [{ title: "Open Studio", dateISO: "2025-08-30" }],
  }),
  Club.fromPlain({
    name: "Book Club",
    capacity: 12,
    members: [{ name: "Elle" }, { name: "Quinn" }],
  }),
  Club.fromPlain({
    name: "Robotics",
    capacity: 6,
    members: [
      { name: "Jo" },
      { name: "Pat" },
      { name: "Max" },
      { name: "Ada" },
      { name: "Ray" },
    ],
  }),
];

const saved = loadState();
export let clubs = Array.isArray(saved)
  ? saved.map(Club.fromPlain)
  : defaultSeed;

export function setClubs(plainArray) {
  clubs.splice(0, clubs.length, ...plainArray.map(Club.fromPlain));
}

export function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
}

export function findClubById(id) {
  return clubs.find((c) => c.id === id);
}

export function toPlainArray(currentClubs) {
  return currentClubs.map((c) => c.toPlain());
}
```

### 6) app.js — wire persistence and import/export/reset

#### 6.1 Import helpers and save on startup

> 📍 Where: `src/app.js` → top imports and after bootstrap
>
> ℹ️ What: Import `saveState/clearState`; call `saveState(clubs)` once on load (so seed is written).
>
> 💡 Why: Ensures we always have a saved state, even before first interaction.
>
> ✅ Check: After reload, localStorage has `ccm:v1`.

```js
// (Required) Commented context — prior imports
// import { renderClubs, setStatus } from './ui/render.js';
// import { debounce } from './utils/debounce.js';

// Add
import { saveState, loadState, clearState } from "./store/persist.js";

// (Required) Commented context — before any user actions
// document.getElementById('year').textContent = new Date().getFullYear();

// Add — persist immediately on startup
saveState(clubs);
```

#### 6.2 Save after member add/remove

> 📍 Where: `src/app.js` → inside the click listener after mutations
>
> ℹ️ What: Call `saveState(clubs)` after `addMember` and `removeMember`.
>
> 💡 Why: Persist on every state change.
>
> ✅ Check: Add/remove a member; localStorage updates (value changes length).

```js
// (Required) Commented context — prior block tail
// setStatus(clubId, 'Member added.');
// paint();

// Add
saveState(clubs);
paint();
```

```js
// (Required) Commented context — prior remove
// club.removeMember(memberId);
// paint();

// Add
club.removeMember(memberId);
saveState(clubs);
paint();
```

#### 6.3 Save after event add/remove

> 📍 Where: `src/app.js` → inside the click listener for `add-event`/`remove-event`
>
> ℹ️ What: Call `saveState(clubs)` after successful add/remove.
>
> 💡 Why: Keep events in sync.
>
> ✅ Check: Add an event; refresh page; event stays.

```js
// (Required) Commented context — after setStatus 'Event added.'
// setStatus(clubId, 'Event added.');
// paint();

// Add
setStatus(clubId, "Event added.");
saveState(clubs);
paint();
```

```js
// (Required) Commented context — remove-event branch
// club.removeEvent(eventId);
// paint();

// Add
club.removeEvent(eventId);
saveState(clubs);
paint();
```

#### 6.4 Add Export / Import / Reset handlers

> 📍 Where: `src/app.js` → bottom, after toolbar wiring
>
> ℹ️ What: Implement click handlers for export/import/reset; import uses hidden `<input type="file">` and `setClubs`.
>
> 💡 Why: Students learn basic file export via Blob and safe imports with validation.
>
> ✅ Check: Export downloads; Import of that file restores; Reset prompts and restores defaults.

```js
// (Required) Commented context — toolbar listeners end
// document.getElementById('sort-by').addEventListener('change', (e) => {
//   ui.sortBy = e.target.value;
//   paint();
// });

// Add — buttons and handlers
const exportBtn = document.getElementById("export-json");
const importBtn = document.getElementById("import-json");
const importFile = document.getElementById("import-file");
const resetBtn = document.getElementById("reset-data");

exportBtn.addEventListener("click", () => {
  const data = toPlainArray(clubs);
  const text = JSON.stringify(data, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "campus-club-manager-data.json";
  a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Invalid JSON format");
    setClubs(parsed);
    saveState(clubs);
    paint();
    alert("Import complete!");
  } catch (err) {
    console.error(err);
    alert("Import failed: " + err.message);
  } finally {
    importFile.value = "";
  }
});

resetBtn.addEventListener("click", () => {
  if (
    !confirm(
      "Reset data to the default seed? This will erase your saved changes."
    )
  )
    return;
  clearState();
  location.reload();
});
```

> Checkpoint 3 — Persistence working
>
> - Visual: Export/Import/Reset buttons function.
> - Persistence: Reload keeps changes; Reset reverts to defaults.
> - Console: No errors after import/export.

## Troubleshooting

- JSON import fails: Ensure the file is an array of clubs (exported by this app). The error message will show why.
- Nothing persists: Confirm you called `saveState(clubs)` after mutations and at startup; check DevTools → Application → Local Storage.
- Download blocked: Some browsers block auto downloads in certain contexts; click Export again or allow downloads.
- Date rendering off after import: Ensure events use `dateISO` in `YYYY-MM-DD` format; `fromPlain` restores correctly.
- Missing IDs after import: Verify models accept `id` in constructors and `fromPlain` passes it through.

## Appendix — Full Source After This Class

### index.html

<details>
<summary>index.html</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 10</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Persistence with <code>localStorage</code> + Import/Export</p>
    </header>

    <main>
      <!-- Create Club Form -->
      <form id="club-form" class="form">
        <div class="form-row">
          <label for="club-name">Club Name</label>
          <input type="text" id="club-name" placeholder="e.g., Chess Club" />
        </div>
        <div class="form-row">
          <label for="club-capacity">Max Capacity</label>
          <input
            type="number"
            id="club-capacity"
            placeholder="e.g., 20"
            min="1"
          />
        </div>
        <button type="submit" class="btn">Add Club</button>
        <p id="error-message" class="error" role="alert" aria-live="polite"></p>
      </form>

      <!-- Toolbar -->
      <section class="toolbar">
        <input
          id="search"
          class="input"
          type="search"
          placeholder="Search clubs..."
          aria-label="Search clubs by name"
        />
        <label class="checkbox">
          <input id="only-open" type="checkbox" />
          Has seats only
        </label>
        <label for="sort-by">Sort by:</label>
        <select id="sort-by" class="select" aria-label="Sort clubs">
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="seats-desc">Seats left (High→Low)</option>
          <option value="capacity-desc">Capacity (High→Low)</option>
        </select>

        <!-- NEW: persistence controls -->
        <div class="spacer"></div>
        <button id="export-json" class="btn" type="button">Export JSON</button>
        <input id="import-file" type="file" accept="application/json" hidden />
        <button id="import-json" class="btn" type="button">Import JSON</button>
        <button id="reset-data" class="btn" type="button">Reset Data</button>
      </section>

      <!-- Clubs render here -->
      <section id="club-info" class="cards"></section>
    </main>

    <footer>
      <small>&copy; <span id="year"></span> Campus Club Manager</small>
    </footer>

    <!-- IMPORTANT: type=module to enable ES module imports -->
    <script type="module" src="src/app.js"></script>
  </body>
</html>
```

</details>

### styles.css

<details>
<summary>styles.css</summary>

```css
/* Class 10 — Persistence (localStorage) + Import/Export
   Styles remain simple and consistent with previous classes.
*/

* {
  box-sizing: border-box;
}
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
  color: #333;
}

header h1 {
  margin: 0;
}
header p {
  margin: 4px 0 16px;
  color: #555;
}

main {
  max-width: 1000px;
  margin: 0 auto;
}

/* Form */
.form {
  background: #fff;
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 6px;
}
.form-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}
.form-row label {
  width: 120px;
}
.form-row input,
.form-row textarea,
.form-row select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  padding: 8px 12px;
  border: 1px solid #999;
  background: #fafafa;
  cursor: pointer;
  border-radius: 4px;
}
.btn:hover {
  background: #f0f0f0;
}
.btn:focus {
  outline: 2px solid #4a90e2;
  outline-offset: 2px;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin: 12px 0 16px;
}
.input,
.select {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}
.checkbox {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: #444;
}
.spacer {
  flex: 1;
}

/* Cards */
.cards {
  display: grid;
  gap: 10px;
}
.club-card {
  border: 1px solid #ccc;
  background: #fff;
  padding: 12px;
  border-radius: 6px;
}

.member-section,
.event-section {
  margin-top: 10px;
}
.member-section h4,
.event-section h4 {
  margin: 0 0 6px;
  font-size: 16px;
}

.member-list,
.event-list {
  list-style: disc;
  padding-left: 20px;
  margin: 6px 0;
}
.member-list li,
.event-list li {
  margin: 2px 0;
}

.inline-form {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 6px;
  flex-wrap: wrap;
}
.inline-form input,
.inline-form textarea,
.inline-form select {
  flex: 1;
  min-width: 200px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.link-btn {
  background: none;
  border: none;
  color: #0b5bd3;
  cursor: pointer;
  padding: 0;
}
.link-btn:hover {
  text-decoration: underline;
}

.badge {
  display: inline-block;
  padding: 2px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
  font-size: 12px;
  margin-left: 8px;
}

.error {
  color: #c00;
  margin-top: 8px;
}
.note {
  color: #666;
  font-size: 12px;
  margin-left: 8px;
}

footer {
  margin-top: 20px;
  color: #666;
}
```

</details>

### src/app.js

<details>
<summary>app.js</summary>

```javascript
// src/app.js — Class 10 entry
// New this class: persistence with localStorage + import/export/reset
import {
  clubs,
  setClubs,
  addClub,
  findClubById,
  toPlainArray,
} from "./store/data.js";
import { ui, getVisibleClubs } from "./store/filters.js";
import { renderClubs, setStatus } from "./ui/render.js";
import { debounce } from "./utils/debounce.js";
import { saveState, loadState, clearState } from "./store/persist.js";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// ---- Render + Re-render helper ----
function paint() {
  const visible = getVisibleClubs(clubs);
  renderClubs(visible);
}

// Persist immediately on startup (in case we loaded from seed)
saveState(clubs);

// ---- Event Delegation for club & event actions ----
const clubContainer = document.getElementById("club-info");

clubContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = findClubById(clubId);
  if (!club) return;

  // Members
  if (action === "add-member") {
    const input = document.getElementById(`member-name-${clubId}`);
    const name = (input?.value || "").trim();
    if (name === "") {
      setStatus(clubId, "Please enter a member name.");
      return;
    }
    const result = club.addMember(name);
    if (!result.ok) {
      const msg =
        result.reason === "full"
          ? "Club is at capacity."
          : result.reason === "duplicate"
          ? "Member name already exists."
          : "Invalid member name.";
      setStatus(clubId, msg);
      return;
    }
    setStatus(clubId, "Member added.");
    saveState(clubs);
    paint();
  }

  if (action === "remove-member") {
    const memberId = btn.dataset.memberId;
    club.removeMember(memberId);
    saveState(clubs);
    paint();
  }

  // Events
  if (action === "add-event") {
    const titleEl = document.getElementById(`event-title-${clubId}`);
    const dateEl = document.getElementById(`event-date-${clubId}`);
    const capEl = document.getElementById(`event-capacity-${clubId}`);
    const descEl = document.getElementById(`event-desc-${clubId}`);

    const title = (titleEl?.value || "").trim();
    const dateISO = (dateEl?.value || "").trim();
    const cap = parseInt(capEl?.value || "0", 10);
    const desc = (descEl?.value || "").trim();

    if (!title || !dateISO || isNaN(cap) || cap <= 0) {
      setStatus(clubId, "Enter a title, date, and capacity (>0).");
      return;
    }

    const added = club.addEvent({
      title,
      dateISO,
      description: desc,
      capacity: cap,
    });
    if (!added.ok) {
      setStatus(
        clubId,
        added.reason === "invalid-date"
          ? "Please pick a valid future date."
          : "Could not add event."
      );
      return;
    }
    setStatus(clubId, "Event added.");
    saveState(clubs);
    paint();
  }

  if (action === "remove-event") {
    const eventId = btn.dataset.eventId;
    club.removeEvent(eventId);
    saveState(clubs);
    paint();
  }
});

// ---- Create Club form ----
document.getElementById("club-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent =
      "Please enter a valid club name and capacity (min 1).";
    return;
  }

  const exists = clubs.some((c) => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    errorMessage.textContent = "A club with this name already exists.";
    return;
  }

  errorMessage.textContent = "";
  addClub(name, capacity);
  saveState(clubs);
  paint();

  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// ---- Toolbar wiring ----
const onSearchInput = debounce((value) => {
  ui.searchText = value;
  paint();
}, 300);

document.getElementById("search").addEventListener("input", (e) => {
  onSearchInput(e.target.value);
});

document.getElementById("only-open").addEventListener("change", (e) => {
  ui.onlyOpen = e.target.checked;
  paint();
});

document.getElementById("sort-by").addEventListener("change", (e) => {
  ui.sortBy = e.target.value;
  paint();
});

// ---- NEW: Import / Export / Reset ----
const exportBtn = document.getElementById("export-json");
const importBtn = document.getElementById("import-json");
const importFile = document.getElementById("import-file");
const resetBtn = document.getElementById("reset-data");

exportBtn.addEventListener("click", () => {
  const data = toPlainArray(clubs);
  const text = JSON.stringify(data, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "campus-club-manager-data.json";
  a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    // Expecting an array of clubs (plain objects)
    if (!Array.isArray(parsed)) throw new Error("Invalid JSON format");
    setClubs(parsed); // rebuilds classes from plain
    saveState(clubs);
    paint();
    alert("Import complete!");
  } catch (err) {
    console.error(err);
    alert("Import failed: " + err.message);
  } finally {
    importFile.value = ""; // reset input
  }
});

resetBtn.addEventListener("click", () => {
  if (
    !confirm(
      "Reset data to the default seed? This will erase your saved changes."
    )
  )
    return;
  clearState();
  location.reload();
});

// Initial paint
paint();
```

</details>

### src/store/data.js

<details>
<summary>data.js</summary>

```javascript
// src/store/data.js
import { Club } from "../models/Club.js";
import { loadState } from "./persist.js";

// Default seed (used if no saved state exists)
const defaultSeed = [
  Club.fromPlain({
    name: "Coding Club",
    capacity: 10,
    members: [{ name: "Ava" }, { name: "Ben" }, { name: "Kai" }],
    events: [
      {
        title: "Hack Night",
        dateISO: "2025-09-10",
        description: "Bring a project.",
        capacity: 30,
      },
      {
        title: "Intro to Git",
        dateISO: "2025-09-03",
        description: "Hands-on basics.",
      },
    ],
  }),
  Club.fromPlain({
    name: "Art Club",
    capacity: 8,
    members: [
      { name: "Riley" },
      { name: "Sam" },
      { name: "Noah" },
      { name: "Maya" },
      { name: "Ivy" },
      { name: "Leo" },
      { name: "Zoe" },
      { name: "Owen" },
    ],
    events: [{ title: "Open Studio", dateISO: "2025-08-30" }],
  }),
  Club.fromPlain({
    name: "Book Club",
    capacity: 12,
    members: [{ name: "Elle" }, { name: "Quinn" }],
  }),
  Club.fromPlain({
    name: "Robotics",
    capacity: 6,
    members: [
      { name: "Jo" },
      { name: "Pat" },
      { name: "Max" },
      { name: "Ada" },
      { name: "Ray" },
    ],
  }),
];

// Initialize from saved state if present
const saved = loadState();
export let clubs = Array.isArray(saved)
  ? saved.map(Club.fromPlain)
  : defaultSeed;

// Helpers
export function setClubs(plainArray) {
  clubs.splice(0, clubs.length, ...plainArray.map(Club.fromPlain));
}

export function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
}

export function findClubById(id) {
  return clubs.find((c) => c.id === id);
}

export function toPlainArray(currentClubs) {
  return currentClubs.map((c) => c.toPlain());
}
```

</details>

### src/store/persist.js

<details>
<summary>persist.js</summary>

```javascript
// src/store/persist.js
// Save/load to localStorage. Stores plain objects so we can revive into classes.
const STORAGE_KEY = "ccm:v1";

export function saveState(clubs) {
  try {
    const plain = clubs.map((c) =>
      typeof c.toPlain === "function" ? c.toPlain() : c
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  } catch (e) {
    console.error("Failed to save:", e);
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load:", e);
    return null;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear state:", e);
  }
}
```

<details>

### src/models/Club.js

<details>
<summary>Club.js</summary>

```javascript
// src/models/Club.js
import { nanoid, dayjs } from "../utils/externals.js";
import { Member } from "./Member.js";
import { EventItem } from "./EventItem.js";

export class Club {
  constructor(name, capacity = 1, id = nanoid()) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.members = []; // Member[]
    this.events = []; // EventItem[]
  }

  // ---- Derived ----
  get current() {
    return this.members.length;
  }
  get seatsLeft() {
    return Math.max(0, this.capacity - this.current);
  }
  get percentFull() {
    return this.capacity > 0
      ? Math.round((this.current / this.capacity) * 100)
      : 0;
  }

  // ---- Members ----
  addMember(name, role = "member") {
    if (!name || typeof name !== "string")
      return { ok: false, reason: "invalid-name" };
    if (this.seatsLeft <= 0) return { ok: false, reason: "full" };
    if (this.members.some((m) => m.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, reason: "duplicate" };
    }
    const m = new Member(name, role);
    this.members.push(m);
    return { ok: true, member: m };
  }

  removeMember(memberId) {
    const i = this.members.findIndex((m) => m.id === memberId);
    if (i >= 0) {
      this.members.splice(i, 1);
      return true;
    }
    return false;
  }

  // ---- Events ----
  addEvent({ title, dateISO, description = "", capacity = 100 }) {
    const d = dayjs(dateISO);
    if (!d.isValid()) return { ok: false, reason: "invalid-date" };
    const evt = new EventItem(title, dateISO, description, capacity);
    this.events.push(evt);
    this.sortEvents();
    return { ok: true, event: evt };
  }

  removeEvent(eventId) {
    const i = this.events.findIndex((e) => e.id === eventId);
    if (i >= 0) {
      this.events.splice(i, 1);
      return true;
    }
    return false;
  }

  sortEvents() {
    this.events.sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }

  upcomingEvents() {
    return this.events
      .filter((e) => !e.isPast)
      .sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }

  // ---- Serialization ----
  toPlain() {
    return {
      id: this.id,
      name: this.name,
      capacity: this.capacity,
      members: this.members.map((m) => m.toPlain()),
      events: this.events.map((e) => e.toPlain()),
    };
  }

  // Migration helper from plain objects
  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity, obj.id);
    // Members
    (obj.members || []).forEach((m) => c.members.push(Member.fromPlain(m)));
    // Events
    (obj.events || []).forEach((e) => c.events.push(EventItem.fromPlain(e)));
    // If legacy format {current: n} exists, seed placeholder members:
    if (!obj.members && typeof obj.current === "number") {
      for (let i = 0; i < obj.current; i++) c.addMember(`Member ${i + 1}`);
    }
    c.sortEvents();
    return c;
  }
}
```

<details>

### src/models/Member.js

<details>
<summary>Member.js</summary>

```javascript
// src/models/Member.js
import { nanoid } from "../utils/externals.js";

export class Member {
  constructor(name, role = "member", id = nanoid()) {
    this.id = id;
    this.name = name;
    this.role = role;
  }
  toPlain() {
    return { id: this.id, name: this.name, role: this.role };
  }
  static fromPlain(obj) {
    return new Member(obj.name, obj.role || "member", obj.id);
  }
}
```

</details>

### src/models/EventItem.js

<details>
<summary>EventItem.js</summary>

```javascript
// src/models/EventItem.js
import { nanoid, dayjs } from "../utils/externals.js";

export class EventItem {
  constructor(title, dateISO, description = "", capacity = 100, id = nanoid()) {
    this.id = id;
    this.title = title;
    this.dateISO = dateISO; // "YYYY-MM-DD"
    this.description = description;
    this.capacity = capacity;
    this.rsvps = Array.isArray(this.rsvps) ? new Set(this.rsvps) : new Set(); // ensure Set
  }

  get date() {
    return dayjs(this.dateISO);
  }

  get isPast() {
    return this.date.isBefore(dayjs(), "day");
  }

  get friendlyWhen() {
    const fmt = this.date.format("MMM D, YYYY");
    const rel = this.date.from(dayjs(), true);
    const suffix = this.isPast ? `${rel} ago` : `in ${rel}`;
    return `${fmt} (${suffix})`;
  }

  toPlain() {
    return {
      id: this.id,
      title: this.title,
      dateISO: this.dateISO,
      description: this.description,
      capacity: this.capacity,
      rsvps: Array.from(this.rsvps),
    };
  }

  static fromPlain(obj) {
    const evt = new EventItem(
      obj.title,
      obj.dateISO,
      obj.description || "",
      obj.capacity || 100,
      obj.id
    );
    // restore RSVPs as Set
    evt.rsvps = new Set(Array.isArray(obj.rsvps) ? obj.rsvps : []);
    return evt;
  }
}
```

</details>
