# Class 8 — Delta Walkthrough (ES Modules & structure)

This guide shows only what changed from Class 7 to Class 8. Unmentioned code stays the same.

---

## Project structure — NEW folders and files

Create a `src/` folder and split code into modules:

```
class_08/
  index.html
  styles.css
  src/
    app.js
    models/
      Club.js
      EventItem.js
      Member.js
    store/
      data.js
      filters.js
    ui/
      render.js
    utils/
      debounce.js
      pipe.js
```

## index.html — CHANGED: use ES Modules

Switch the script to `type="module"` and point to `src/app.js`.

```html
<!-- replace the old script tag at the bottom -->
<script type="module" src="src/app.js"></script>
```

- Optional: Update the subtitle to “ES Modules & cleaner project structure.”
- Markup and IDs otherwise match Class 7.

## src/utils — NEW: small utilities

Move previously inline utilities into separate files.

```js
// src/utils/debounce.js
export function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

```js
// src/utils/pipe.js
export function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
}
```

## src/models — NEW: domain classes

Extract models into their own files.

```js
// src/models/Member.js
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

export class Member {
  constructor(name, role = "member") {
    this.id = makeId("m");
    this.name = name;
    this.role = role;
  }
}
```

```js
// src/models/EventItem.js
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

export class EventItem {
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
```

```js
// src/models/Club.js
import { Member } from "./Member.js";

let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

export class Club {
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

  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
    return c;
  }
}
```

## src/store — NEW: state and filters

Split app state (data store) and the derived list logic.

```js
// src/store/data.js
import { Club } from "../models/Club.js";

export let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }),
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];

export function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
}

export function findClubById(id) {
  return clubs.find((c) => c.id === id);
}
```

```js
// src/store/filters.js
import { pipe } from "../utils/pipe.js";

export const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc", // name-asc | name-desc | seats-desc | capacity-desc
};

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

export const getVisibleClubs = pipe(
  (arr) => arr.slice(),
  applySearch,
  applyOnlyOpen,
  applySort
);
```

## src/ui — NEW: render functions

Move rendering into its own module.

```js
// src/ui/render.js
export function renderClubs(visibleClubs) {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  if (visibleClubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs match your filters.";
    container.appendChild(p);
    return;
  }

  visibleClubs.forEach((club) => {
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

export function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
```

## src/app.js — NEW: entry point

Wire everything together with ES imports and a debounced search handler.

```js
// src/app.js
import { clubs, addClub, findClubById } from "./store/data.js";
import { ui, getVisibleClubs } from "./store/filters.js";
import { renderClubs, setStatus } from "./ui/render.js";
import { debounce } from "./utils/debounce.js";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

function paint() {
  const visible = getVisibleClubs(clubs);
  renderClubs(visible);
}

// Event delegation
const clubContainer = document.getElementById("club-info");
clubContainer.addEventListener("click", (e) => {
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
    paint();
  }

  if (action === "remove-member") {
    const memberId = btn.dataset.memberId;
    club.removeMember(memberId);
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
  paint();

  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// Toolbar wiring (debounced search)
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

// Initial paint
paint();
```

## styles.css — No changes

Styles are unchanged from Class 7.

---

## Appendix: Completed files for Class 8

Here are the full, completed versions of every file in this class for quick reference.

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 8</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>ES Modules & cleaner project structure</p>
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

### styles.css

```css
/* Class 8 — ES Modules & Structure (styles same as Class 7 for continuity) */

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

### src/app.js

```js
// src/app.js — Entry point (ES Modules)
import { clubs, addClub, findClubById } from "./store/data.js";
import { ui, getVisibleClubs } from "./store/filters.js";
import { renderClubs, setStatus } from "./ui/render.js";
import { debounce } from "./utils/debounce.js";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// ---- Render + Re-render helper ----
function paint() {
  const visible = getVisibleClubs(clubs);
  renderClubs(visible);
}

// ---- Event Delegation for club actions ----
const clubContainer = document.getElementById("club-info");

clubContainer.addEventListener("click", (e) => {
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
    paint();
  }

  if (action === "remove-member") {
    const memberId = btn.dataset.memberId;
    club.removeMember(memberId);
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

// Initial paint
paint();
```

### src/models/Club.js

```js
import { Member } from "./Member.js";

let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

export class Club {
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

  // Migration helper from plain objects
  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
    return c;
  }
}
```

### src/models/EventItem.js

```js
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

export class EventItem {
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
```

### src/models/Member.js

```js
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

export class Member {
  constructor(name, role = "member") {
    this.id = makeId("m");
    this.name = name;
    this.role = role;
  }
}
```

### src/store/data.js

```js
import { Club } from "../models/Club.js";

export let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }), // full
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];

export function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
}

export function findClubById(id) {
  return clubs.find((c) => c.id === id);
}
```

### src/store/filters.js

```js
import { pipe } from "../utils/pipe.js";

export const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc", // name-asc | name-desc | seats-desc | capacity-desc
};

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

export const getVisibleClubs = pipe(
  (arr) => arr.slice(),
  applySearch,
  applyOnlyOpen,
  applySort
);
```

### src/ui/render.js

```js
// Renders the provided list of clubs. Event handling is in app.js
export function renderClubs(visibleClubs) {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  if (visibleClubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs match your filters.";
    container.appendChild(p);
    return;
  }

  visibleClubs.forEach((club) => {
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

export function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
```

### src/utils/debounce.js

```js
export function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

### src/utils/pipe.js

```js
export function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
}
```
