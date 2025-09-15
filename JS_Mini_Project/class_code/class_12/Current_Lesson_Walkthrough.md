# Class 12 — Async & Fetch: load seed from server + simulate save (with loading states)

## At a glance

- Goal: Fetch starter data from a JSON “server” and simulate save with latency and failures
- Files touched: index.html, styles.css, src/app.js, src/services/api.js, src/store/{persist.js,data.js}
- Est. time: 60–90 min
- Prereqs: Class 11 (hash routing, list ↔ detail) and Class 10 (persistence)

## How to run

- Serve over HTTP (file:// will break fetch). Use VS Code Live Server on index.html.

## How to use

- Click “Reload from Server” to fetch `data/seed.json` with artificial delay.
- Click “Save to Server” to simulate a save (10% chance of failure).
- Routing and local persistence continue to work as before.

## Before you start

- Open: `index.html`, `styles.css`, `src/app.js`, `src/services/api.js`, `src/store/{data.js,filters.js,persist.js}`, `src/router.js`, `src/ui/{render.js,detail.js}`
- Starting point: Class 11 end state (routing working; persistence in place)
- Baseline: Compare Class 11 repo files vs this class before writing diffs.
- Files to diff: `index.html`, `styles.css`, `src/app.js`, new `src/services/api.js`, and small tweaks in `src/store/persist.js` and `src/store/data.js`.
- Serve with Live Server (HTTP) so `fetch('./data/seed.json')` works.

## What changed since last class

```diff
# index.html
- <title>Campus Club Manager — Class 11</title>
+ <title>Campus Club Manager — Class 12</title>
- <p>Client-side routing: List view ↔ Detail view</p>
+ <p>Async & Fetch: load seed from server + simulate save (with loading states)</p>
```

```diff
# index.html (toolbar additions)
  <section class="toolbar route-only home">
    ...
+   <button id="reload-server" class="btn" type="button">Reload from Server</button>
+   <button id="save-server" class="btn" type="button">Save to Server</button>
  </section>
```

```diff
# index.html (status region)
  </section>
+ <div id="global-status" class="status" aria-live="polite"></div>
  <section id="app-root" class="cards"></section>
```

```diff
# styles.css (new status styles)
+ .status { margin: 8px 0 16px; font-size: 14px; }
+ .status.loading { color: #0b5bd3; }
+ .status.error { color: #c00; }
+ .status.success { color: #0a7d16; }
```

```diff
# src/app.js (imports + status helpers)
  import { renderClubDetail } from './ui/detail.js';
- import { saveState } from './store/persist.js';
+ import { saveState, clearState, loadStateRaw } from './store/persist.js';
+ import { loadClubsFromServer, saveClubsToServer } from './services/api.js';
+ // Status helpers
+ const statusEl = document.getElementById('global-status');
+ function setGlobalStatus(msg, kind = '') { statusEl.textContent = msg; statusEl.className = 'status ' + kind; }
+ function clearGlobalStatus() { setGlobalStatus(''); }
```

```diff
# src/app.js (bootstrap + load)
- window.addEventListener('load', paint);
+ async function bootstrap() {
+   const hasSaved = !!loadStateRaw();
+   if (!hasSaved) {
+     try {
+       setGlobalStatus('Loading starter data from server…', 'loading');
+       const serverClubs = await loadClubsFromServer();
+       setClubs(serverClubs);
+       saveState(clubs);
+       setGlobalStatus('Loaded from server.', 'success');
+     } catch (err) {
+       console.error(err);
+       setGlobalStatus('Server load failed — using built‑in data.', 'error');
+       saveState(clubs);
+     } finally { setTimeout(clearGlobalStatus, 1200); }
+   } else { saveState(clubs); }
+   paint();
+ }
+ window.addEventListener('load', bootstrap);
```

```diff
# src/app.js (toolbar: server buttons)
+ document.getElementById('reload-server').addEventListener('click', async () => {
+   try {
+     setGlobalStatus('Loading from server…', 'loading');
+     const serverClubs = await loadClubsFromServer();
+     setClubs(serverClubs); saveState(clubs); paint();
+     setGlobalStatus('Loaded from server.', 'success');
+   } catch (err) { console.error(err); setGlobalStatus('Server load failed. Check console.', 'error'); }
+   finally { setTimeout(clearGlobalStatus, 1200); }
+ });
+ document.getElementById('save-server').addEventListener('click', async () => {
+   try {
+     setGlobalStatus('Saving to server…', 'loading');
+     const res = await saveClubsToServer(toPlainArray(clubs));
+     setGlobalStatus(`Saved ${res.count} items at ${new Date(res.savedAt).toLocaleTimeString()}.`, 'success');
+   } catch (err) { console.error(err); setGlobalStatus(err.message || 'Server save failed.', 'error'); }
+   finally { setTimeout(clearGlobalStatus, 1400); }
+ });
```

```diff
# src/store/persist.js
  const STORAGE_KEY = 'ccm:v1';
  export function saveState(clubs) { /* unchanged */ }
+ export function loadStateRaw() {
+   try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
+ }
  export function loadState() { /* unchanged, now calls loadStateRaw() */ }
  export function clearState() { /* unchanged */ }
```

```diff
# src/store/data.js (rename + usage)
- const defaultSeed = [
+ const fallbackSeed = [
- export let clubs = Array.isArray(saved) ? saved.map(Club.fromPlain) : defaultSeed;
+ export let clubs = Array.isArray(saved) ? saved.map(Club.fromPlain) : fallbackSeed;
```

```diff
# NEW FILE: src/services/api.js
+ const SEED_URL = './data/seed.json';
+ const delay = (ms) => new Promise((res) => setTimeout(res, ms));
+ export async function loadClubsFromServer() {
+   await delay(600);
+   const res = await fetch(SEED_URL, { cache: 'no-store' });
+   if (!res.ok) throw new Error('Failed to load from server: ' + res.status);
+   return res.json();
+ }
+ export async function saveClubsToServer(plainArray) {
+   await delay(600);
+   if (Math.random() < 0.1) throw new Error('Temporary server error. Try again.');
+   return { ok: true, savedAt: new Date().toISOString(), count: Array.isArray(plainArray) ? plainArray.length : 0 };
+ }
```

## File tree (current class)

```text
class_12/
  data/
    seed.json
  index.html
  styles.css
  src/
    app.js
    router.js
    services/
      api.js
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
      detail.js
    utils/
      debounce.js
      externals.js
      pipe.js
  Current_Lesson_Walkthrough.md
  README.md
```

## Live-coding steps

### 1) index.html — add status + server controls

> 📍 Where: `index.html`, inside `<section class="toolbar route-only home">` and below it; Cmd+F "toolbar route-only home".
>
> ℹ️ What: Add two buttons to the toolbar and a global status region below the toolbar.
>
> 💡 Why: We need UI controls to trigger server load/save and a visible place to show loading/success/error messages.
>
> ✅ Check: Buttons visible in the toolbar; a blank status line appears under the toolbar.

```html
<!-- inside <section class="toolbar route-only home"> ... -->
<!-- … existing toolbar controls … -->
<button id="reload-server" class="btn" type="button">Reload from Server</button>
<button id="save-server" class="btn" type="button">Save to Server</button>
```

```html
<!-- below the toolbar, before #app-root -->
<div id="global-status" class="status" aria-live="polite"></div>
```

### 2) styles.css — status styles

> 📍 Where: `styles.css`, near other utility text styles (after `.note { … }`).
>
> ℹ️ What: Add classes for loading/error/success message coloring.
>
> 💡 Why: Clear visual feedback helps students see async progress and failures.
>
> ✅ Check: Temporarily add/remove these classes in DevTools to see colors change.

```css
/* below .note { … } */
.status {
  margin: 8px 0 16px;
  font-size: 14px;
}
.status.loading {
  color: #0b5bd3;
}
.status.error {
  color: #c00;
}
.status.success {
  color: #0a7d16;
}
```

### 3) src/services/api.js — simulated server

> 📍 Where: `src/services/api.js` (new file).
>
> ℹ️ What: Create a small service with `loadClubsFromServer()` and `saveClubsToServer()` and artificial latency.
>
> 💡 Why: Encapsulates I/O behind a clean API, making app.js simpler and testable.
>
> ✅ Check: With Live Server, `fetch('./data/seed.json')` resolves; try calling these from DevTools.

```js
// src/services/api.js
const SEED_URL = "./data/seed.json";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
export async function loadClubsFromServer() {
  await delay(600);
  const res = await fetch(SEED_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load from server: " + res.status);
  return res.json();
}
export async function saveClubsToServer(plainArray) {
  await delay(600);
  if (Math.random() < 0.1)
    throw new Error("Temporary server error. Try again.");
  return {
    ok: true,
    savedAt: new Date().toISOString(),
    count: Array.isArray(plainArray) ? plainArray.length : 0,
  };
}
```

> Checkpoint 1
>
> - Run: Reload the page (still using previous data).
> - Expect: No errors in console; services file loads.
> - Console: Try `import('./src/services/api.js').then(m => m.loadClubsFromServer())`.

### 4) src/store/persist.js — add loadStateRaw()

> 📍 Where: `src/store/persist.js`, below `saveState`.
>
> ℹ️ What: Expose a `loadStateRaw()` helper that returns the JSON string or null.
>
> 💡 Why: Lets `bootstrap()` decide whether to fetch from server on first run without parsing.
>
> ✅ Check: In console, run `localStorage.getItem('ccm:v1')` and compare to `loadStateRaw()`.

```js
// … existing code …
// const STORAGE_KEY = 'ccm:v1';
// export function saveState(clubs) { /* … */ }

export function loadStateRaw() {
  try {
    return localStorage.getItem("ccm:v1");
  } catch {
    return null;
  }
}
```

### 5) src/store/data.js — fallback seed and usage

> 📍 Where: `src/store/data.js`, top of file where the seed is defined and used.
>
> ℹ️ What: Rename `defaultSeed` → `fallbackSeed` and use it when no saved state exists.
>
> 💡 Why: The app now prefers server data on first run; the built-in seed is only a fallback.
>
> ✅ Check: If server load fails (temporarily disconnect or change SEED_URL), the app still renders clubs.

```diff
# DO NOT PASTE — REMOVE/REPLACE THESE LINES
- const defaultSeed = [
```

```js
// … top of file …
const fallbackSeed = [
  // same contents as before
];
const saved = loadState();
export let clubs = Array.isArray(saved)
  ? saved.map(Club.fromPlain)
  : fallbackSeed;
```

### 6) src/app.js — imports, status helpers, bootstrap, and server buttons

#### 6.1 Add imports

> 📍 Where: `src/app.js`, import block at the top; Cmd+F `renderClubDetail`.
>
> ℹ️ What: Import `clearState`, `loadStateRaw`, and the new API functions.
>
> 💡 Why: We’ll need these for first-run bootstrap and the toolbar buttons.
>
> ✅ Check: Module resolves with no console errors.

```js
// … existing imports …
import { saveState, clearState, loadStateRaw } from "./store/persist.js";
import { loadClubsFromServer, saveClubsToServer } from "./services/api.js";
```

#### 6.2 Add status helpers

> 📍 Where: `src/app.js`, near the top after setting the footer year; Cmd+F `getElementById('year')`.
>
> ℹ️ What: Add `setGlobalStatus` and `clearGlobalStatus`.
>
> 💡 Why: Centralizes status updates for consistency across bootstrap and buttons.
>
> ✅ Check: In console, call `setGlobalStatus('Hello', 'success')` and see green text.

```js
// document.getElementById('year').textContent = …
const statusEl = document.getElementById("global-status");
function setGlobalStatus(msg, kind = "") {
  statusEl.textContent = msg;
  statusEl.className = "status " + kind;
}
function clearGlobalStatus() {
  setGlobalStatus("");
}
```

#### 6.3 Bootstrap on first load

> 📍 Where: `src/app.js`, near the bottom where the `load` listener was; Cmd+F `window.addEventListener('load',`.
>
> ℹ️ What: Replace the direct `paint` load with `bootstrap()` that fetches when no saved state exists.
>
> 💡 Why: First-run experience should pull the seed from our simulated server; fallback remains local.
>
> ✅ Check: First reload after clearing localStorage shows a blue “Loading…” then the list.

```diff
# DO NOT PASTE — REMOVE EXACTLY THESE LINES
- window.addEventListener('load', paint);
```

```js
// … keep hashchange …
async function bootstrap() {
  const hasSaved = !!loadStateRaw();
  if (!hasSaved) {
    try {
      setGlobalStatus("Loading starter data from server…", "loading");
      const serverClubs = await loadClubsFromServer();
      setClubs(serverClubs);
      saveState(clubs);
      setGlobalStatus("Loaded from server.", "success");
    } catch (err) {
      console.error(err);
      setGlobalStatus("Server load failed — using built‑in data.", "error");
      saveState(clubs);
    } finally {
      setTimeout(clearGlobalStatus, 1200);
    }
  } else {
    saveState(clubs);
  }
  paint();
}
window.addEventListener("load", bootstrap);
```

> Checkpoint 2
>
> - Run: Clear storage (Reset Data) then reload.
> - Expect: Status shows loading → success; list renders.
> - Console: `console.log('clubs', clubs.length)` shows non-zero.

#### 6.4 Wire the toolbar buttons

> 📍 Where: `src/app.js`, near the Import/Export/Reset wiring; add below the `resetBtn` listener.
>
> ℹ️ What: Add click handlers for Reload/Save to Server using the API + status helpers.
>
> 💡 Why: Round out the async UX with explicit user actions.
>
> ✅ Check: Clicking Reload repopulates from seed; Save shows a time-stamped success (or occasional error).

```js
// after resetBtn.addEventListener('click', …)
document.getElementById("reload-server").addEventListener("click", async () => {
  try {
    setGlobalStatus("Loading from server…", "loading");
    const serverClubs = await loadClubsFromServer();
    setClubs(serverClubs);
    saveState(clubs);
    paint();
    setGlobalStatus("Loaded from server.", "success");
  } catch (err) {
    console.error(err);
    setGlobalStatus("Server load failed. Check console.", "error");
  } finally {
    setTimeout(clearGlobalStatus, 1200);
  }
});

document.getElementById("save-server").addEventListener("click", async () => {
  try {
    setGlobalStatus("Saving to server…", "loading");
    const res = await saveClubsToServer(toPlainArray(clubs));
    setGlobalStatus(
      `Saved ${res.count} items at ${new Date(
        res.savedAt
      ).toLocaleTimeString()}.`,
      "success"
    );
  } catch (err) {
    console.error(err);
    setGlobalStatus(err.message || "Server save failed.", "error");
  } finally {
    setTimeout(clearGlobalStatus, 1400);
  }
});
```

### 7) Smoke test

- Start Live Server and reload the page.
- If localStorage is empty, status shows loading then success.
- Click “Reload from Server” → list refreshes; “Save to Server” → success or occasional error.
- Navigate list ↔ detail; add/remove members/events; persistence still works.

## Troubleshooting

- Fetch errors: Don’t open the HTML file directly; use a local HTTP server (Live Server).
- 404 for seed.json: Ensure `data/seed.json` exists and path is `./data/seed.json` from index.html.
- Status never clears: Confirm `setTimeout(clearGlobalStatus, …)` calls are present.
- Random save failures: This is by design (10%). Try again.
- Nothing loads: Open DevTools Console for error details; verify CORS and path.

## Appendix — Full Source After This Class

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 12</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>
        Async & Fetch: load seed from server + simulate save (with loading
        states)
      </p>
    </header>

    <nav class="crumbs">
      <a href="#/" id="home-link">All Clubs</a>
      <span id="crumb-current"></span>
    </nav>

    <main>
      <!-- Create Club Form (home route only) -->
      <form id="club-form" class="form route-only home">
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

      <!-- Toolbar (home route only) -->
      <section class="toolbar route-only home">
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

        <div class="spacer"></div>
        <button id="export-json" class="btn" type="button">Export JSON</button>
        <input id="import-file" type="file" accept="application/json" hidden />
        <button id="import-json" class="btn" type="button">Import JSON</button>
        <button id="reset-data" class="btn" type="button">Reset Data</button>

        <!-- NEW: Async/Fetch controls -->
        <button id="reload-server" class="btn" type="button">
          Reload from Server
        </button>
        <button id="save-server" class="btn" type="button">
          Save to Server
        </button>
      </section>

      <!-- Global status/notifications -->
      <div id="global-status" class="status" aria-live="polite"></div>

      <!-- The app renders into this container in BOTH routes -->
      <section id="app-root" class="cards"></section>
    </main>

    <footer>
      <small>&copy; <span id="year"></span> Campus Club Manager</small>
    </footer>

    <script type="module" src="src/app.js"></script>
  </body>
</html>
```

### styles.css

```css
/* Class 12 — Async & Fetch (loading states + simulated server)
   Beginner-friendly, consistent with earlier classes.
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

nav.crumbs {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin: 4px 0 8px;
  font-size: 14px;
}
nav.crumbs a {
  color: #0b5bd3;
  text-decoration: none;
}
nav.crumbs a:hover {
  text-decoration: underline;
}
nav.crumbs #crumb-current {
  color: #666;
}

main {
  max-width: 1000px;
  margin: 0 auto;
}

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

.cards {
  display: grid;
  gap: 10px;
}
.card,
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

.status {
  margin: 8px 0 16px;
  font-size: 14px;
}
.status.loading {
  color: #0b5bd3;
}
.status.error {
  color: #c00;
}
.status.success {
  color: #0a7d16;
}

footer {
  margin-top: 20px;
  color: #666;
}

/* Hide/show by route */
.route-only.home.hidden {
  display: none;
}
```

### src/services/api.js

```javascript
// Simulated server API using local files and artificial latency.
const SEED_URL = "./data/seed.json";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
export async function loadClubsFromServer() {
  await delay(600);
  const res = await fetch(SEED_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load from server: " + res.status);
  return res.json();
}
export async function saveClubsToServer(plainArray) {
  await delay(600);
  const fail = Math.random() < 0.1;
  if (fail) throw new Error("Temporary server error. Try again.");
  return {
    ok: true,
    savedAt: new Date().toISOString(),
    count: Array.isArray(plainArray) ? plainArray.length : 0,
  };
}
```

### src/store/persist.js

```javascript
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
export function loadStateRaw() {
  try {
    return localStorage.getItem("ccm:v1");
  } catch {
    return null;
  }
}
export function loadState() {
  try {
    const raw = loadStateRaw();
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

### src/store/data.js

```javascript
import { Club } from "../models/Club.js";
import { loadState } from "./persist.js";

// Built-in fallback seed (used only if server fetch fails or no saved state)
const fallbackSeed = [
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
  : fallbackSeed;

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

### src/app.js

```javascript
import {
  clubs,
  setClubs,
  addClub,
  findClubById,
  toPlainArray,
} from "./store/data.js";
import { ui as UIState, getVisibleClubs } from "./store/filters.js";
import { renderClubs, setStatus } from "./ui/render.js";
import { renderClubDetail } from "./ui/detail.js";
import { saveState, clearState, loadStateRaw } from "./store/persist.js";
import { debounce } from "./utils/debounce.js";
import { parseHash, goHome } from "./router.js";
import { loadClubsFromServer, saveClubsToServer } from "./services/api.js";

document.getElementById("year").textContent = new Date().getFullYear();

// Status helpers
const statusEl = document.getElementById("global-status");
function setGlobalStatus(msg, kind = "") {
  statusEl.textContent = msg;
  statusEl.className = "status " + kind;
}
function clearGlobalStatus() {
  setGlobalStatus("");
}

// Route chrome
function setRouteChrome(route) {
  const homeOnly = document.querySelectorAll(".route-only.home");
  homeOnly.forEach((el) =>
    route.view === "home"
      ? el.classList.remove("hidden")
      : el.classList.add("hidden")
  );
  document.getElementById("crumb-current").textContent =
    route.view === "home"
      ? ""
      : document.getElementById("crumb-current").textContent;
}

// Render based on route
function paint() {
  const route = parseHash();
  setRouteChrome(route);
  if (route.view === "club") {
    const club = findClubById(route.id);
    if (!club) {
      goHome();
      return;
    }
    renderClubDetail(club);
  } else {
    const visible = getVisibleClubs(clubs);
    renderClubs(visible);
  }
}

// Bootstrap: if no saved state, fetch from "server" (local JSON)
async function bootstrap() {
  const hasSaved = !!loadStateRaw();
  if (!hasSaved) {
    try {
      setGlobalStatus("Loading starter data from server…", "loading");
      const serverClubs = await loadClubsFromServer();
      setClubs(serverClubs);
      saveState(clubs);
      setGlobalStatus("Loaded from server.", "success");
    } catch (err) {
      console.error(err);
      setGlobalStatus("Server load failed — using built‑in data.", "error");
      saveState(clubs); // persist fallback
    } finally {
      setTimeout(clearGlobalStatus, 1200);
    }
  } else {
    saveState(clubs);
  }
  paint();
}

// Event delegation for actions
const appRoot = document.getElementById("app-root");
appRoot.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = findClubById(clubId);
  if (!club) return;

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

// Create Club form
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

// Toolbar wiring
const onSearchInput = debounce((value) => {
  UIState.searchText = value;
  paint();
}, 300);
document
  .getElementById("search")
  .addEventListener("input", (e) => onSearchInput(e.target.value));
document.getElementById("only-open").addEventListener("change", (e) => {
  UIState.onlyOpen = e.target.checked;
  paint();
});
document.getElementById("sort-by").addEventListener("change", (e) => {
  UIState.sortBy = e.target.value;
  paint();
});

// Import/Export/Reset
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
importBtn.addEventListener("click", () => importFile.click());
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

// NEW: Reload/Save to "Server"
document.getElementById("reload-server").addEventListener("click", async () => {
  try {
    setGlobalStatus("Loading from server…", "loading");
    const serverClubs = await loadClubsFromServer();
    setClubs(serverClubs);
    saveState(clubs);
    paint();
    setGlobalStatus("Loaded from server.", "success");
  } catch (err) {
    console.error(err);
    setGlobalStatus("Server load failed. Check console.", "error");
  } finally {
    setTimeout(clearGlobalStatus, 1200);
  }
});

document.getElementById("save-server").addEventListener("click", async () => {
  try {
    setGlobalStatus("Saving to server…", "loading");
    const payload = toPlainArray(clubs);
    const res = await saveClubsToServer(payload);
    setGlobalStatus(
      `Saved ${res.count} items at ${new Date(
        res.savedAt
      ).toLocaleTimeString()}.`,
      "success"
    );
  } catch (err) {
    console.error(err);
    setGlobalStatus(err.message || "Server save failed.", "error");
  } finally {
    setTimeout(clearGlobalStatus, 1400);
  }
});

// Routing hooks
window.addEventListener("hashchange", paint);
window.addEventListener("load", bootstrap);
```
