# Class 10 Upgrade Walkthrough — Step by Step
**From:** Class 9 (Events + Day.js + nanoid)  
**To:** Class 10 (Persistence + Import/Export)

This guide shows you exactly how to add saving/loading and simple data backups.

---

## Step 0 — Add `toPlain()` / `fromPlain()` to models
**Files:** `src/models/Member.js`, `src/models/EventItem.js`, `src/models/Club.js`

- Each model gets a `toPlain()` method that returns a JSON-safe object.
- Add static `fromPlain(obj)` to rebuild class instances (including `Set` → Array conversion for RSVPs).

---

## Step 1 — Create `persist.js`
**File:** `src/store/persist.js`
```js
const STORAGE_KEY = 'ccm:v1';
export function saveState(clubs) { /* JSON.stringify(clubs.map(c => c.toPlain())) */ }
export function loadState() { /* JSON.parse(localStorage.getItem(STORAGE_KEY)) */ }
export function clearState() { /* localStorage.removeItem(STORAGE_KEY) */ }
```

---

## Step 2 — Load saved state first
**File:** `src/store/data.js`
- Try `loadState()`; if present, `clubs = saved.map(Club.fromPlain)`.
- Otherwise, use your default seed.
- Export a `setClubs(plainArray)` helper for imports.

---

## Step 3 — Save after every change
**File:** `src/app.js`
- After **add/remove member**, **add/remove event**, and **create club**, call `saveState(clubs)`.
- On startup, call `saveState(clubs)` once so seeds are persisted.

---

## Step 4 — Add Import/Export/Reset UI
**File:** `index.html`
```html
<button id="export-json" class="btn" type="button">Export JSON</button>
<input id="import-file" type="file" accept="application/json" hidden />
<button id="import-json" class="btn" type="button">Import JSON</button>
<button id="reset-data" class="btn" type="button">Reset Data</button>
```

**File:** `src/app.js`
- **Export:** create a Blob from `JSON.stringify(toPlainArray(clubs), null, 2)` and trigger a download.
- **Import:** `input[type=file]` → read text → `JSON.parse` → `setClubs(parsed)` → `saveState` → re-render.
- **Reset:** `clearState()` → `location.reload()` to restore default seed.

---

## Step 5 — Test
1. Add a member and an event; refresh → still there ✅  
2. Export JSON; delete the club; Import JSON → club restored ✅  
3. Reset Data → back to default seed ✅

Congrats — your app now **remembers** its data between sessions and supports simple backups!
