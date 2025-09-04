# Class 7 — Advanced Functions (UX Helpers): Debounced Search + Tiny Utilities

> At a glance
>
> - What you’ll build: Debounced search input; tiny utilities (debounce, pipe); refactor of derived list using composition.
> - Files touched: index.html, styles.css, app.js
> - Est. time: 40–60 min
> - Prereqs: Finished Class 6

## How to run

- Use the VS Code Live Server extension (Right‑click `index.html` → "Open with Live Server"). Avoid opening via `file://` to ensure scripts and assets load consistently.

## How to use

- The instructor should paste each step’s diff precisely where indicated, then paste the Clean copy/paste snippet(s) right after the corresponding diff. Keep the browser open and test after each step. Students should read the callouts (Where / What / Why / Check) before pasting.

## Before you start

- Open both folders side-by-side (read-only baseline vs. current target):
  - Baseline (Class 6): `JS_Mini_Project/class_code/class_06/`
  - Current (Class 7): `JS_Mini_Project/class_code/class_07/`
- Confirm the structure: `index.html`, `styles.css`, `app.js`.
- Today we will introduce a debounced search input and factor the list transforms using a tiny `pipe` utility.

## What changed since last class

Below are true unified diffs from Class 6 → Class 7 for each touched file. These are collapsed by default. Full code appears in the Appendix.

<details>
  <summary>Diff — index.html: update title and header blurb</summary>

```diff
 <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1" />
-  <title>Campus Club Manager — Class 6</title>
+  <title>Campus Club Manager — Class 7</title>
   <link rel="stylesheet" href="styles.css" />
 </head>
 <body>
   <header>
     <h1>Campus Club Manager</h1>
-    <p>Search, filter, and sort clubs</p>
+    <p>Debounced search + small utility functions</p>
   </header>
```

</details>

<details>
  <summary>Diff — styles.css: update header comment only</summary>

```diff
-/* Class 6 — Arrays & Loops: Search/Filter/Sort */
+/* Class 7 — Advanced Functions (UX Helpers)
+   Keep styles simple and identical to Class 6 where possible.
+*/
```

</details>

<details>
  <summary>Diff — app.js: add debounce + pipe; refactor derived list; use debounced search</summary>

```diff
-// Class 6 — Arrays & Loops: Search / Filter / Sort
-// Build on Class 5 (Add Member UI) by adding a toolbar to search/filter/sort clubs.
+// Class 7 — Advanced Functions (UX Helpers)
+// Debounce the search input and introduce tiny functional utilities (pipe).
+// Builds on Class 6 (search/filter/sort + Add Member UI).

 // ---- Simple ID helper ----
 let __id = 1;
 function makeId(prefix) { return `${prefix}_${__id++}`; }

+// ---- Small utilities (NEW in Class 7) ----
+/**
+ * debounce: returns a function that delays calling `fn`
+ * until there has been no new call for `delay` ms.
+ */
+function debounce(fn, delay = 250) {
+  let timer = null;
+  return (...args) => {
+    clearTimeout(timer);
+    timer = setTimeout(() => fn(...args), delay);
+  };
+}
+
+/**
+ * pipe: compose functions left-to-right. pipe(f,g,h)(x) = h(g(f(x)))
+ */
+function pipe(...fns) {
+  return (input) => fns.reduce((val, fn) => fn(val), input);
+}
+
 // ---- Models ----
 class Member {
   constructor(name, role = "member") {
     this.id = makeId("m");
     this.name = name;
     this.role = role;
   }
 }
@@
 // NEW: UI state for search/filter/sort
 const ui = {
   searchText: "",
   onlyOpen: false,
   sortBy: "name-asc", // name-asc | name-desc | seats-desc | capacity-desc
 };

-// ---- Derived list (filter + sort) ----
-function getVisibleClubs() {
-  // 1) copy to avoid mutating original
-  let list = clubs.slice();
-
-  // 2) FILTER: by search text
-  const q = ui.searchText.trim().toLowerCase();
-  if (q) {
-    list = list.filter(c => c.name.toLowerCase().includes(q));
-  }
-
-  // 3) FILTER: only clubs with seats (if checked)
-  if (ui.onlyOpen) {
-    list = list.filter(c => c.seatsLeft > 0);
-  }
-
-  // 4) SORT
-  list.sort((a, b) => {
-    switch (ui.sortBy) {
-      case "name-asc": return a.name.localeCompare(b.name);
-      case "name-desc": return b.name.localeCompare(a.name);
-      case "seats-desc": return b.seatsLeft - a.seatsLeft;
-      case "capacity-desc": return b.capacity - a.capacity;
-      default: return 0;
-    }
-  });
-
-  return list;
-}
+// ---- Functional transforms (NEW: built to use with pipe) ----
+const applySearch = (list) => {
+  const q = ui.searchText.trim().toLowerCase();
+  if (!q) return list;
+  return list.filter(c => c.name.toLowerCase().includes(q));
+};
+
+const applyOnlyOpen = (list) => {
+  if (!ui.onlyOpen) return list;
+  return list.filter(c => c.seatsLeft > 0);
+};
+
+const applySort = (list) => {
+  const copy = list.slice();
+  copy.sort((a, b) => {
+    switch (ui.sortBy) {
+      case "name-asc": return a.name.localeCompare(b.name);
+      case "name-desc": return b.name.localeCompare(a.name);
+      case "seats-desc": return b.seatsLeft - a.seatsLeft;
+      case "capacity-desc": return b.capacity - a.capacity;
+      default: return 0;
+    }
+  });
+  return copy;
+};
+
+// Compose into one function (NEW)
+const getVisibleClubs = pipe(
+  (arr) => arr.slice(), // defensive copy
+  applySearch,
+  applyOnlyOpen,
+  applySort
+);

 // ---- Rendering ----
 function renderClubs() {
   const container = document.getElementById("club-info");
   container.innerHTML = "";

-  const visible = getVisibleClubs();
+  const visible = getVisibleClubs(clubs);
   if (visible.length === 0) {
     const p = document.createElement("p");
     p.textContent = "No clubs match your filters.";
     container.appendChild(p);
     return;
   }
@@
-// ---- NEW: Wire up toolbar events ----
-document.getElementById("search").addEventListener("input", (e) => {
-  ui.searchText = e.target.value;
-  renderClubs();
-});
+// ---- NEW: Debounced search wiring ----
+// Best practice: capture the value and pass it to a debounced handler,
+// instead of passing the event object directly (which may be reused).
+const onSearchInput = debounce((value) => {
+  ui.searchText = value;
+  renderClubs();
+}, 300);
+
+document.getElementById("search").addEventListener("input", (e) => {
+  onSearchInput(e.target.value);
+});

 // ---- Filter/sort wiring (same-day changes, no debounce) ----
 document.getElementById("only-open").addEventListener("change", (e) => {
   ui.onlyOpen = e.target.checked;
   renderClubs();
 });
```

</details>

## File tree (current class)

<details open>
  <summary>File tree — Class 7</summary>

```text
JS_Mini_Project/
  class_code/
    class_07/
      index.html
      styles.css
      app.js
```

</details>

## Live-coding steps

1. Update the page title and header blurb

> 📍 Where: `index.html`. Use Cmd+F for "Campus Club Manager —" and for the paragraph under `<h1>`.
>
> ℹ️ What: Change the title to “Class 7” and update the header paragraph to mention debounced search and utilities.
>
> 💡 Why: We mark the class version visibly and set expectations for today’s focus.
>
> ✅ Check: Browser tab shows “Class 7” and the subtitle reads “Debounced search + small utility functions”.

<details open>
  <summary>Diff — index.html: title + blurb</summary>

```diff
   <meta name="viewport" content="width=device-width, initial-scale=1" />
-  <title>Campus Club Manager — Class 6</title>
+  <title>Campus Club Manager — Class 7</title>
   <link rel="stylesheet" href="styles.css" />
 </head>
 <body>
   <header>
     <h1>Campus Club Manager</h1>
-    <p>Search, filter, and sort clubs</p>
+    <p>Debounced search + small utility functions</p>
   </header>
```

</details>

<details>
  <summary>Clean copy/paste — index.html: updated title + header paragraph</summary>

```html
<title>Campus Club Manager — Class 7</title>
```

```html
<p>Debounced search + small utility functions</p>
```

</details>
<br>
2. Add tiny utilities: debounce and pipe

> 📍 Where: `app.js`, near the top, immediately after the ID helper (`makeId`). Cmd+F “Simple ID helper”. Insert below that block.
>
> ℹ️ What: Add a general-purpose `debounce(fn, delay)` and a simple `pipe(...fns)` utility for composing list transforms.
>
> 💡 Why: Debounce improves UX by reducing re-renders while typing. `pipe` keeps transformations small and testable.
>
> ✅ Check: No console errors after saving; the app still renders.

<details open>
  <summary>Diff — app.js: insert debounce and pipe</summary>

```diff
  let __id = 1;
  function makeId(prefix) { return `${prefix}_${__id++}`; }

+// ---- Small utilities (NEW in Class 7) ----
+/**
+ * debounce: returns a function that delays calling `fn`
+ * until there has been no new call for `delay` ms.
+ */
+function debounce(fn, delay = 250) {
+  let timer = null;
+  return (...args) => {
+    clearTimeout(timer);
+    timer = setTimeout(() => fn(...args), delay);
+  };
+}
+
+/**
+ * pipe: compose functions left-to-right. pipe(f,g,h)(x) = h(g(f(x)))
+ */
+function pipe(...fns) {
+  return (input) => fns.reduce((val, fn) => fn(val), input);
+}
```

</details>

<details>
  <summary>Clean copy/paste — app.js: utilities</summary>

```js
// ---- Small utilities (NEW in Class 7) ----
function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
}
```

</details>
<br>
3. Refactor the derived list using composition

> 📍 Where: `app.js`. Cmd+F “Derived list (filter + sort)” in Class 6 code; replace with small transforms and a `getVisibleClubs` built via `pipe`.
>
> ℹ️ What: Introduce `applySearch`, `applyOnlyOpen`, `applySort`; then compose them: `const getVisibleClubs = pipe((arr)=>arr.slice(), applySearch, applyOnlyOpen, applySort)`.
>
> 💡 Why: Small focused functions are easier to test and evolve (add/remove transforms).
>
> ✅ Check: List renders exactly as in Class 6 for the same inputs.

<details open>
  <summary>Diff — app.js: replace imperative getVisibleClubs with composed version</summary>

```diff
-// ---- Derived list (filter + sort) ----
-function getVisibleClubs() {
-  // 1) copy to avoid mutating original
-  let list = clubs.slice();
-  const q = ui.searchText.trim().toLowerCase();
-  if (q) {
-    list = list.filter(c => c.name.toLowerCase().includes(q));
-  }
-  if (ui.onlyOpen) {
-    list = list.filter(c => c.seatsLeft > 0);
-  }
-  list.sort((a, b) => {
-    switch (ui.sortBy) {
-      case "name-asc": return a.name.localeCompare(b.name);
-      case "name-desc": return b.name.localeCompare(a.name);
-      case "seats-desc": return b.seatsLeft - a.seatsLeft;
-      case "capacity-desc": return b.capacity - a.capacity;
-      default: return 0;
-    }
-  });
-  return list;
-}
+// ---- Functional transforms (NEW) ----
+const applySearch = (list) => {
+  const q = ui.searchText.trim().toLowerCase();
+  if (!q) return list;
+  return list.filter(c => c.name.toLowerCase().includes(q));
+};
+
+const applyOnlyOpen = (list) => {
+  if (!ui.onlyOpen) return list;
+  return list.filter(c => c.seatsLeft > 0);
+};
+
+const applySort = (list) => {
+  const copy = list.slice();
+  copy.sort((a, b) => {
+    switch (ui.sortBy) {
+      case "name-asc": return a.name.localeCompare(b.name);
+      case "name-desc": return b.name.localeCompare(a.name);
+      case "seats-desc": return b.seatsLeft - a.seatsLeft;
+      case "capacity-desc": return b.capacity - a.capacity;
+      default: return 0;
+    }
+  });
+  return copy;
+};
+
+// Compose into one function
+const getVisibleClubs = pipe(
+  (arr) => arr.slice(),
+  applySearch,
+  applyOnlyOpen,
+  applySort
+);
```

</details>

<details>
  <summary>Clean copy/paste — app.js: composed transforms</summary>

```js
const applySearch = (list) => {
  const q = ui.searchText.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c) => c.name.toLowerCase().includes(q));
};

const applyOnlyOpen = (list) => {
  if (!ui.onlyOpen) return list;
  return list.filter((c) => c.seatsLeft > 0);
};

const applySort = (list) => {
  const copy = list.slice();
  copy.sort((a, b) => {
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
  return copy;
};

const getVisibleClubs = pipe(
  (arr) => arr.slice(),
  applySearch,
  applyOnlyOpen,
  applySort
);
```

</details>
<br>
4. Use the composed function in render and wire debounced search

> 📍 Where: `app.js`. Cmd+F `renderClubs()` and replace the line that builds `visible` to call `getVisibleClubs(clubs)`. Then update the search listener to use a debounced handler.
>
> ℹ️ What: Replace `const visible = getVisibleClubs();` with `const visible = getVisibleClubs(clubs);`. Add `onSearchInput = debounce(...)` and call it from the input handler.
>
> 💡 Why: The composed function expects the array input; debouncing keeps the UI responsive during fast typing.
>
> ✅ Check: Typing quickly no longer re-renders on every keystroke; the list updates after a short pause.

<details open>
  <summary>Diff — app.js: render + debounced search</summary>

```diff
-  const visible = getVisibleClubs();
+  const visible = getVisibleClubs(clubs);
@@
-// ---- NEW: Wire up toolbar events ----
-document.getElementById("search").addEventListener("input", (e) => {
-  ui.searchText = e.target.value;
-  renderClubs();
-});
+// ---- NEW: Debounced search wiring ----
+const onSearchInput = debounce((value) => {
+  ui.searchText = value;
+  renderClubs();
+}, 300);
+
+document.getElementById("search").addEventListener("input", (e) => {
+  onSearchInput(e.target.value);
+});
```

</details>

<details>
  <summary>Clean copy/paste — app.js: render + debounced search pieces</summary>

```js
const visible = getVisibleClubs(clubs);
```

```js
const onSearchInput = debounce((value) => {
  ui.searchText = value;
  renderClubs();
}, 300);

document.getElementById("search").addEventListener("input", (e) => {
  onSearchInput(e.target.value);
});
```

</details>

<br><br>

Checkpoint

- Run: Reload the page and try typing fast in the search box.
- Expect: List updates after a brief pause; filtering results match Class 6 behavior.
- Console: No errors.

## Troubleshooting

- Search doesn’t update: Ensure the input’s `addEventListener('input', ...)` calls your `onSearchInput` with `e.target.value` (not the event object).
- Immediate updates (no debounce): Verify that the handler uses `debounce` and a delay (e.g., 300ms).
- Empty results unexpectedly: Check normalization (`trim().toLowerCase()`) inside `applySearch` and confirm `ui.searchText` is set.

## Appendix — Full Source After This Class

<details>
  <summary>Full source — index.html</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 7</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Debounced search + small utility functions</p>
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
/* Class 7 — Advanced Functions (UX Helpers)
   Keep styles simple and identical to Class 6 where possible.
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
  max-width: 960px;
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
// Class 7 — Advanced Functions (UX Helpers)
// Debounce the search input and introduce tiny functional utilities (pipe).
// Builds on Class 6 (search/filter/sort + Add Member UI).

// ---- Simple ID helper ----
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

// ---- Small utilities (NEW in Class 7) ----
/**
 * debounce: returns a function that delays calling `fn`
 * until there has been no new call for `delay` ms.
 */
function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * pipe: compose functions left-to-right. pipe(f,g,h)(x) = h(g(f(x)))
 */
function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
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

// UI state (same keys as Class 6)
const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };

// ---- Functional transforms (NEW: built to use with pipe) ----
const applySearch = (list) => {
  const q = ui.searchText.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c) => c.name.toLowerCase().includes(q));
};

const applyOnlyOpen = (list) => {
  if (!ui.onlyOpen) return list;
  return list.filter((c) => c.seatsLeft > 0);
};

const applySort = (list) => {
  const copy = list.slice();
  copy.sort((a, b) => {
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
  return copy;
};

// Compose into one function (NEW)
const getVisibleClubs = pipe(
  (arr) => arr.slice(), // defensive copy
  applySearch,
  applyOnlyOpen,
  applySort
);

// ---- Rendering ----
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  const visible = getVisibleClubs(clubs);
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

// ---- NEW: Debounced search wiring ----
// Best practice: capture the value and pass it to a debounced handler,
// instead of passing the event object directly (which may be reused).
const onSearchInput = debounce((value) => {
  ui.searchText = value;
  renderClubs();
}, 300);

document.getElementById("search").addEventListener("input", (e) => {
  onSearchInput(e.target.value);
});

// ---- Filter/sort wiring (same-day changes, no debounce) ----
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
