# Class 6 — Arrays & Loops: Search / Filter / Sort

## At a glance

- What you’ll build: A searchable, filterable, and sortable list of clubs using arrays, loops, and derived UI state.
- Files touched: index.html, styles.css, app.js
- Est. time: 35–50 min
- Prereqs: Finished Class 5 (render-from-state + member add/remove)

## How to run

- Use the VS Code Live Server extension. Right‑click `index.html` → “Open with Live Server”. Avoid opening via `file://`.

## How to use

- Live-code friendly. Paste diffs in order and verify each ✅ Check. If something drifts, use Troubleshooting or restore from the prior class and re-apply to the last Checkpoint.

## Before you start

- Open: `index.html`, `styles.css`, `app.js` in `JS_Mini_Project/class_code/class_06/`
- Starting point: Actual Class 5 repo files in `class_05/` (baseline for true deltas)
- Files to diff: `index.html`, `styles.css`, `app.js`
- Reset plan: If output diverges, restore prior class files and re-apply steps to the last Checkpoint.

## What changed since last class (unified diff)

<details>
  <summary>Diff — index.html (Class 5 → Class 6)</summary>

```diff
@@
-  <title>Campus Club Manager — Class 5</title>
+  <title>Campus Club Manager — Class 6</title>
@@
-    <p>Track club capacity and members</p>
+    <p>Search, filter, and sort clubs</p>
@@
+    <!-- NEW: Toolbar for search/filter/sort -->
+    <section class="toolbar">
+      <input id="search" class="input" type="search" placeholder="Search clubs..." aria-label="Search clubs by name" />
+      <label class="checkbox">
+        <input id="only-open" type="checkbox" />
+        Has seats only
+      </label>
+      <label for="sort-by">Sort by:</label>
+      <select id="sort-by" class="select" aria-label="Sort clubs">
+        <option value="name-asc">Name (A–Z)</option>
+        <option value="name-desc">Name (Z–A)</option>
+        <option value="seats-desc">Seats left (High→Low)</option>
+        <option value="capacity-desc">Capacity (High→Low)</option>
+      </select>
+    </section>
+
+    <!-- Clubs render here -->
+    <section id="club-info" class="cards"></section>
```

</details>

<details>
  <summary>Diff — styles.css (Class 5 → Class 6)</summary>

```diff
@@
.btn:hover { background: #f0f0f0; }
.btn:focus { outline: 2px solid #4a90e2; outline-offset: 2px; }

/* NEW: toolbar */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin: 12px 0 16px;
}
.input, .select {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}
.checkbox { display: inline-flex; gap: 6px; align-items: center; color: #444; }

.cards { display: grid; gap: 10px; }
```

</details>

<details>
  <summary>Diff — app.js (Class 5 → Class 6)</summary>

```diff
@@
-let clubs = [
-  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 5 }),
-  Club.fromPlain({ name: "Art Club",    current: 2, capacity: 4 }),
-];
+let clubs = [
+  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
+  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }),
+  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
+  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
+];
+
+// NEW: UI state for search/filter/sort
+const ui = {
+  searchText: "",
+  onlyOpen: false,
+  sortBy: "name-asc",
+};
+
+// ---- Derived list (filter + sort) ----
+function getVisibleClubs() {
+  let list = clubs.slice();
+  const q = ui.searchText.trim().toLowerCase();
+  if (q) list = list.filter(c => c.name.toLowerCase().includes(q));
+  if (ui.onlyOpen) list = list.filter(c => c.seatsLeft > 0);
+  list.sort((a, b) => {
+    switch (ui.sortBy) {
+      case "name-asc": return a.name.localeCompare(b.name);
+      case "name-desc": return b.name.localeCompare(a.name);
+      case "seats-desc": return b.seatsLeft - a.seatsLeft;
+      case "capacity-desc": return b.capacity - a.capacity;
+      default: return 0;
+    }
+  });
+  return list;
+}
@@
-  // Empty state
-  if (clubs.length === 0) {
-    const p = document.createElement("p");
-    p.textContent = "No clubs yet. Add one above to get started.";
-    container.appendChild(p);
-    return;
-  }
+  // use derived list and new empty message
+  const visible = getVisibleClubs();
+  if (visible.length === 0) {
+    const p = document.createElement("p");
+    p.textContent = "No clubs match your filters.";
+    container.appendChild(p);
+    return;
+  }
+
+  visible.forEach((club) => {
+
+// ---- NEW: Wire up toolbar events ----
+document.getElementById("search").addEventListener("input", (e) => {
+  ui.searchText = e.target.value;
+  renderClubs();
+});
+document.getElementById("only-open").addEventListener("change", (e) => {
+  ui.onlyOpen = e.target.checked;
+  renderClubs();
+});
+document.getElementById("sort-by").addEventListener("change", (e) => {
+  ui.sortBy = e.target.value;
+  renderClubs();
+});
```

</details>

## File tree (current class)

<details open>
  <summary>File tree — class_06</summary>

```text
class_06/
  index.html
  styles.css
  app.js
```

</details>

## Live-coding steps

### 1) Update the page title and subtitle

> 📍 Where: `index.html` — in `<head>` for the title, and in `<header>` for the sub-text; Cmd+F “Campus Club Manager” and “Track club capacity and members”.
>
> ℹ️ What: Change the title to Class 6 and update the header paragraph to reflect search/filter/sort.
>
> 💡 Why: Keep the UI accurate to lesson scope and make it clear what’s new.
>
> ✅ Check: Browser tab shows “Campus Club Manager — Class 6”; under the H1 you see “Search, filter, and sort clubs”.

<details open>
  <summary>Diff — index.html: update title and subtitle</summary>

```diff
@@
-  <title>Campus Club Manager — Class 5</title>
+  <title>Campus Club Manager — Class 6</title>
@@
-    <p>Track club capacity and members</p>
+    <p>Search, filter, and sort clubs</p>
```

</details>

<details>
  <summary>Clean copy/paste — index.html: new subtitle line</summary>

```html
<title>Campus Club Manager — Class 6</title>
<p>Search, filter, and sort clubs</p>
```

</details>

### 2) Add the toolbar (search/filter/sort) to HTML

> 📍 Where: `index.html` — inside `<main>`, below the form and above the `#club-info` section; Cmd+F “Clubs render here”.
>
> ℹ️ What: Insert a `<section class="toolbar">` with a search input, a “Has seats only” checkbox, and a sort dropdown.
>
> 💡 Why: The toolbar collects user intent; we’ll derive a visible list using arrays and loops from the state + UI inputs.
>
> ✅ Check: You should see a search box, a checkbox, and a sort menu above the cards.

<details open>
  <summary>Diff — index.html: insert toolbar above #club-info</summary>

```diff
@@
-    <!-- Clubs render here -->
-    <section id="club-info" class="cards"></section>
+    <!-- NEW: Toolbar for search/filter/sort -->
+    <section class="toolbar">
+      <input id="search" class="input" type="search" placeholder="Search clubs..." aria-label="Search clubs by name" />
+      <label class="checkbox">
+        <input id="only-open" type="checkbox" />
+        Has seats only
+      </label>
+      <label for="sort-by">Sort by:</label>
+      <select id="sort-by" class="select" aria-label="Sort clubs">
+        <option value="name-asc">Name (A–Z)</option>
+        <option value="name-desc">Name (Z–A)</option>
+        <option value="seats-desc">Seats left (High→Low)</option>
+        <option value="capacity-desc">Capacity (High→Low)</option>
+      </select>
+    </section>
+
+    <!-- Clubs render here -->
+    <section id="club-info" class="cards"></section>
```

</details>

<details>
  <summary>Clean copy/paste — index.html: toolbar section</summary>

```html
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
</section>

<!-- Clubs render here -->
<section id="club-info" class="cards"></section>
```

</details>

<br><br>

> Checkpoint 1
>
> - Run: Reload the page.
> - Expect: Toolbar visible, styles applied; club cards still render as before.
> - Console: Optional — none needed yet.

### 3) Style the toolbar

> 📍 Where: `styles.css` — bottom of file; Cmd+F “footer {” then paste below as a block.
>
> ℹ️ What: Add minimal styles for the toolbar, inputs, and checkbox layout.
>
> 💡 Why: A clean layout helps beginners focus on behavior without wrestling with CSS.
>
> ✅ Check: Controls appear on one line (wrapping as needed) with consistent spacing.

<details open>
  <summary>Diff — styles.css: add toolbar styles</summary>

```diff
@@
.btn:hover { background: #f0f0f0; }
.btn:focus { outline: 2px solid #4a90e2; outline-offset: 2px; }

/* NEW: toolbar */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin: 12px 0 16px;
}
.input, .select {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}
.checkbox { display: inline-flex; gap: 6px; align-items: center; color: #444; }

/* Existing CSS */
.cards { display: grid; gap: 10px; }

```

</details>

<details>
  <summary>Clean copy/paste — styles.css: toolbar styles</summary>

```css
/* NEW: toolbar */
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
```

</details>

### 4) Seed data update (recommended for demos)

> 📍 Where: `app.js` — App State section near the top; Cmd+F “let clubs = [”.
>
> ℹ️ What: Replace the small seed with a few more clubs and capacities to make filters interesting.
>
> 💡 Why: A richer dataset better demonstrates search, “only open”, and sort behaviors.
>
> ✅ Check: After reloading, you still see multiple club cards; counts may differ due to new capacities.

<details open>
  <summary>Diff — app.js: replace initial clubs seed</summary>

```diff
@@
-let clubs = [
-  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 5 }),
-  Club.fromPlain({ name: "Art Club",    current: 2, capacity: 4 }),
-];
+let clubs = [
+  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
+  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }), // full
+  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
+  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
+];
```

</details>

<details>
  <summary>Clean copy/paste — app.js: new clubs seed</summary>

```js
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }), // full
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];
```

</details>

<br><br>

> Checkpoint 2
>
> - Run: Reload the page.
> - Expect: Cards still render.
> - Console: Optionally `console.log(getVisibleClubs?.() ? 'ok' : 'pending')` — may be undefined for now.

### 5) Add UI state for search/filter/sort

> 📍 Where: `app.js` — directly below the `clubs` array; Cmd+F “let clubs = [”.
>
> ℹ️ What: Introduce a `ui` object to hold search text, checkbox value, and sort choice.
>
> 💡 Why: Keep rendering logic pure by deriving a visible list from state + UI, not by mutating the source array.
>
> ✅ Check: No visible change yet; no console errors.

<details open>
  <summary>Diff — app.js: add UI state object</summary>

```diff
@@
 let clubs = [
   Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
   Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }), // full
   Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
   Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
 ];
+
+// NEW: UI state for search/filter/sort
+const ui = {
+  searchText: "",
+  onlyOpen: false,
+  sortBy: "name-asc", // name-asc | name-desc | seats-desc | capacity-desc
+};
```

</details>

<details>
  <summary>Clean copy/paste — app.js: UI state</summary>

```js
const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc", // name-asc | name-desc | seats-desc | capacity-desc
};
```

</details>

### 6) Derive a visible list: filter + sort function

> 📍 Where: `app.js` — below the `ui` object; Cmd+F “const ui = {”.
>
> ℹ️ What: Add `getVisibleClubs()` that copies `clubs`, applies search/filter, and sorts based on `ui`.
>
> 💡 Why: This isolates array logic, making `renderClubs()` simple and testable.
>
> ✅ Check: No visible change; no console errors.

<details open>
  <summary>Diff — app.js: add getVisibleClubs()</summary>

```diff
@@
 const ui = {
   searchText: "",
   onlyOpen: false,
   sortBy: "name-asc", // name-asc | name-desc | seats-desc | capacity-desc
 };
+
+// ---- Derived list (filter + sort) ----
+function getVisibleClubs() {
+  // copy to avoid mutating original
+  let list = clubs.slice();
+
+  // FILTER: search by name
+  const q = ui.searchText.trim().toLowerCase();
+  if (q) list = list.filter((c) => c.name.toLowerCase().includes(q));
+
+  // FILTER: only clubs with seats
+  if (ui.onlyOpen) list = list.filter((c) => c.seatsLeft > 0);
+
+  // SORT
+  list.sort((a, b) => {
+    switch (ui.sortBy) {
+      case "name-asc":
+        return a.name.localeCompare(b.name);
+      case "name-desc":
+        return b.name.localeCompare(a.name);
+      case "seats-desc":
+        return b.seatsLeft - a.seatsLeft;
+      case "capacity-desc":
+        return b.capacity - a.capacity;
+      default:
+        return 0;
+    }
+  });
+
+  return list;
+}
```

</details>

<details>
  <summary>Clean copy/paste — app.js: getVisibleClubs()</summary>

```js
function getVisibleClubs() {
  let list = clubs.slice();
  const q = ui.searchText.trim().toLowerCase();
  if (q) list = list.filter((c) => c.name.toLowerCase().includes(q));
  if (ui.onlyOpen) list = list.filter((c) => c.seatsLeft > 0);
  list.sort((a, b) => {
    switch (ui.sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "seats-desc":
        return b.seatsLeft - a.seatsLeft;
      case "capacity-desc":
        return b.capacity - a.capacity;
      default:
        return 0;
    }
  });
  return list;
}
```

</details>

### 7) Update renderClubs to use the derived list

> 📍 Where: `app.js` — inside `renderClubs()`; Cmd+F “function renderClubs() {”.
>
> ℹ️ What: Use `const visible = getVisibleClubs();`, update the empty state check/message, and iterate over `visible` instead of `clubs`.
>
> 💡 Why: Keep rendering a pure function of state+UI, enabling easy new filters later.
>
> ✅ Check: Page still renders; if you type in search, nothing changes yet (events not wired). No console errors.

<details open>
  <summary>Diff — app.js: renderClubs() uses derived list</summary>

```diff
@@
 function renderClubs() {
   const container = document.getElementById("club-info");
   container.innerHTML = "";
-
-  // Empty state
-  if (clubs.length === 0) {
-    const p = document.createElement("p");
-    p.textContent = "No clubs yet. Add one above to get started.";
-    container.appendChild(p);
-    return;
-  }
-
-  clubs.forEach((club) => {
+
+  // use derived list and new empty message
+  const visible = getVisibleClubs();
+  if (visible.length === 0) {
+    const p = document.createElement("p");
+    p.textContent = "No clubs match your filters.";
+    container.appendChild(p);
+    return;
+  }
+
+  visible.forEach((club) => {
```

</details>

<details>
  <summary>Clean copy/paste — app.js: renderClubs() after</summary>

```js
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  // use derived list and new empty message
  const visible = getVisibleClubs();
  if (visible.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs match your filters.";
    container.appendChild(p);
    return;
  }

  visible.forEach((club) => {
```

</details>

<br><br>

> Checkpoint 3
>
> - Run: Reload the page.
> - Expect: Cards still render.
> - Console: Try `console.log(getVisibleClubs().length)` — you should see a number.

### 8) Wire up toolbar events

> 📍 Where: `app.js` — near the bottom, above the footer year + initial render; Cmd+F “Footer year & initial paint”.
>
> ℹ️ What: Listen to search/checkbox/select changes, update `ui`, then call `renderClubs()`.
>
> 💡 Why: Unidirectional data flow: user input → update UI state → re-render derived list.
>
> ✅ Check: Typing in search filters cards; checking “Has seats only” hides full clubs; sort changes order.

<details open>
  <summary>Diff — app.js: add toolbar event listeners</summary>

```diff
@@
 document.getElementById("club-form").addEventListener("submit", function (e) {
   e.preventDefault();
@@
   nameInput.focus();
 });

+// ---- NEW: Wire up toolbar events ----
+document.getElementById("search").addEventListener("input", (e) => {
+  ui.searchText = e.target.value;
+  renderClubs();
+});
+
+document.getElementById("only-open").addEventListener("change", (e) => {
+  ui.onlyOpen = e.target.checked;
+  renderClubs();
+});
+
+document.getElementById("sort-by").addEventListener("change", (e) => {
+  ui.sortBy = e.target.value;
+  renderClubs();
+});
+
 // ---- Footer year & initial paint ----
 document.getElementById("year").textContent = new Date().getFullYear();
 renderClubs();
```

</details>

<details>
  <summary>Clean copy/paste — app.js: toolbar events</summary>

```js
document.getElementById("search").addEventListener("input", (e) => {
  ui.searchText = e.target.value;
  renderClubs();
});

document.getElementById("only-open").addEventListener("change", (e) => {
  ui.onlyOpen = e.target.checked;
  renderClubs();
});

document.getElementById("sort-by").addEventListener("change", (e) => {
  ui.sortBy = e.target.value;
  renderClubs();
});
```

</details>

<br><br>

> Checkpoint 4
>
> - Run: Reload the page.
> - Expect: Filters and sorting are interactive.
> - Console: None required; visually verify behavior.

## Troubleshooting

- Controls do nothing → Ensure event listeners are added before the final `renderClubs()` call and target the correct IDs: `#search`, `#only-open`, `#sort-by`.
- “No clubs yet…” still shows → You didn’t remove the old empty-state. Replace it with the new `visible.length === 0` block.
- Errors about `visible` undefined → Add `const visible = getVisibleClubs();` at the top of `renderClubs()` after clearing the container.
- Search not matching → Ensure `ui.searchText` is lowercased and compared with `club.name.toLowerCase().includes(q)`.
- CSS not applied → Confirm the `.toolbar`, `.input`, `.select`, and `.checkbox` rules exist and `index.html` includes `styles.css`.
- Wrong sort order → Double-check the `switch (ui.sortBy)` comparator returns.
- Reset: If things drift, copy the Appendix code into your files to reach the end-of-class state.

## Appendix — Full Source After This Class

<details>
  <summary>Full source — index.html</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 6</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Search, filter, and sort clubs</p>
    </header>

    <main>
      <!-- Create Club Form (from previous classes) -->
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

      <!-- NEW: Toolbar for search/filter/sort -->
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
      </section>

      <!-- Clubs render here -->
      <section id="club-info" class="cards"></section>
    </main>

    <footer>
      <small>&copy; <span id="year"></span> Campus Club Manager</small>
    </footer>

    <script src="app.js"></script>
  </body>
</html>
```

</details>

<details>
  <summary>Full source — styles.css</summary>

```css
/* Class 6 — Arrays & Loops: Search/Filter/Sort */
/* Simple, beginner-friendly styles */

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
  max-width: 960px;
  margin: 0 auto;
}

/* Form (from earlier classes) */
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
.form-row input {
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

/* NEW: toolbar */
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

.member-section {
  margin-top: 8px;
}
.member-section h4 {
  margin: 0 0 6px;
  font-size: 16px;
}
.member-list {
  list-style: disc;
  padding-left: 20px;
  margin: 6px 0;
}
.member-list li {
  margin: 2px 0;
}

.inline-form {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 6px;
}
.inline-form input {
  flex: 1;
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

<details>
  <summary>Full source — app.js</summary>

```javascript
// Class 6 — Arrays & Loops: Search / Filter / Sort
// Build on Class 5 (Add Member UI) by adding a toolbar to search/filter/sort clubs.

// ---- Simple ID helper ----
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

// ---- Models ----
class Member {
  constructor(name, role = "member") {
    this.id = makeId("m");
    this.name = name;
    this.role = role;
  }
}

class EventItem {
  constructor(title, dateStr, description = "", capacity = 100) {
    this.id = makeId("e");
    this.title = title;
    this.date = new Date(dateStr);
    this.description = description;
    this.capacity = capacity;
    this.rsvps = new Set();
  }
  toggleRsvp(memberId) {
    if (this.rsvps.has(memberId)) this.rsvps.delete(memberId);
    else if (this.rsvps.size < this.capacity) this.rsvps.add(memberId);
  }
}

class Club {
  constructor(name, capacity = 1) {
    this.id = makeId("c");
    this.name = name;
    this.capacity = capacity;
    this.members = [];
    this.events = [];
  }
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

  addEvent(evt) {
    if (evt instanceof EventItem) this.events.push(evt);
  }

  upcomingEvents() {
    const now = new Date();
    return this.events
      .filter((e) => e.date >= now)
      .sort((a, b) => a.date - b.date);
  }

  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
    return c;
  }
}

// ---- App State ----
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }), // full
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];

// NEW: UI state for search/filter/sort
const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc", // name-asc | name-desc | seats-desc | capacity-desc
};

// ---- Derived list (filter + sort) ----
function getVisibleClubs() {
  // 1) copy to avoid mutating original
  let list = clubs.slice();

  // 2) FILTER: by search text
  const q = ui.searchText.trim().toLowerCase();
  if (q) {
    list = list.filter((c) => c.name.toLowerCase().includes(q));
  }

  // 3) FILTER: only clubs with seats (if checked)
  if (ui.onlyOpen) {
    list = list.filter((c) => c.seatsLeft > 0);
  }

  // 4) SORT
  list.sort((a, b) => {
    switch (ui.sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "seats-desc":
        return b.seatsLeft - a.seatsLeft;
      case "capacity-desc":
        return b.capacity - a.capacity;
      default:
        return 0;
    }
  });

  return list;
}

// ---- Rendering ----
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  const visible = getVisibleClubs();
  if (visible.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs match your filters.";
    container.appendChild(p);
    return;
  }

  visible.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    card.dataset.clubId = club.id;

    const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

    const membersHtml = club.members
      .map(
        (m) => `
      <li>${m.name}
        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">
          Remove
        </button>
      </li>
    `
      )
      .join("");

    card.innerHTML = `
      <div><strong>${club.name}</strong><br>${stats}</div>

      <div class="member-section">
        <h4>Members (${club.current})</h4>
        <ul class="member-list">
          ${membersHtml || "<li><em>No members yet</em></li>"}
        </ul>

        <div class="inline-form">
          <input id="member-name-${
            club.id
          }" type="text" placeholder="e.g., Jordan" />
          <button class="btn" data-action="add-member" data-club-id="${
            club.id
          }">Add Member</button>
          <span id="status-${club.id}" class="note"></span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Helper: set a tiny status message inside a club card
function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}

// ---- Event Delegation (same pattern) ----
const clubContainer = document.getElementById("club-info");

clubContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = clubs.find((c) => c.id === clubId);
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
    renderClubs();
  }

  if (action === "remove-member") {
    const memberId = btn.dataset.memberId;
    club.removeMember(memberId);
    renderClubs();
  }
});

// ---- Create Club form (unchanged) ----
document.getElementById("club-form").addEventListener("submit", function (e) {
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
  clubs.push(new Club(name, capacity));
  renderClubs();

  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// ---- NEW: Wire up toolbar events ----
document.getElementById("search").addEventListener("input", (e) => {
  ui.searchText = e.target.value;
  renderClubs();
});

document.getElementById("only-open").addEventListener("change", (e) => {
  ui.onlyOpen = e.target.checked;
  renderClubs();
});

document.getElementById("sort-by").addEventListener("change", (e) => {
  ui.sortBy = e.target.value;
  renderClubs();
});

// ---- Footer year & initial paint ----
document.getElementById("year").textContent = new Date().getFullYear();
renderClubs();
```

</details>
