# Class 6 — Delta Walkthrough (only new/changed snippets)

This guide shows only what changed from Class 5 to Class 6. Unmentioned code stays the same.

---

## index.html — NEW: toolbar

Add this toolbar under the create-club form.

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
```

## app.js — NEW: UI state

Declare UI state used by filtering and sorting.

```js
const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc", // name-asc | name-desc | seats-desc | capacity-desc
};
```

## app.js — NEW: derived list (filter + sort)

Add this function and use it in rendering.

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

## app.js — CHANGED: render uses derived list

Update the source you loop over.

```js
const visible = getVisibleClubs();
// ...then loop visible.forEach((club) => { ... })
```

## app.js — NEW: toolbar event handlers

Wire inputs to UI state and re-render.

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

## styles.css — NEW: toolbar styles

Add minimal styles for the new toolbar elements.

```css
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

## Optional

- Title/subtitle copy updates for Class 6.
- Seed a few example clubs so the list isn’t empty.

---

## Appendix: Completed files for Class 6

Here are the full, completed versions of every file in this class for quick reference.

### index.html

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

### app.js

```js
// Class 6 — Arrays & Loops: Search / Filter / Sort
// Purpose: add a toolbar and derived UI so users can search, filter, and sort clubs.

// ---- Simple ID helper ----
let __id = 1; // module-scoped counter
function makeId(prefix) {
  // prefix tags the kind of ID for readability
  return `${prefix}_${__id++}`;
}

// ---- Models ----
// Member: a person within a club
class Member {
  constructor(name, role = "member") {
    this.id = makeId("m"); // used by UI events to uniquely identify rows
    this.name = name;
    this.role = role;
  }
}

// EventItem: a future feature example (kept for continuity)
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

// Club: holds members, capacity, and simple stats
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

  // Add member with validation and duplicate prevention
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

  // Remove by ID (handles duplicate names)
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
// Seed a few clubs so the UI isn’t empty on load
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }), // full
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];

// UI state reflects inputs and drives a derived list
const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc", // name-asc | name-desc | seats-desc | capacity-desc
};

// ---- Derived list (filter + sort) ----
// Build the exact list we want to render based on state
function getVisibleClubs() {
  let list = clubs.slice(); // avoid mutating original

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

// ---- Rendering ----
// Create card elements, wire data attributes for event delegation
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = ""; // clear previous contents

  const visible = getVisibleClubs();
  if (visible.length === 0) {
    // Empty-state UI when nothing matches the filters
    const p = document.createElement("p");
    p.textContent = "No clubs match your filters.";
    container.appendChild(p);
    return;
  }

  visible.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    card.dataset.clubId = club.id; // used by event delegation

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

// Helper to surface short feedback near the input
function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}

// ---- Event Delegation (same pattern) ----
// One listener handles all buttons inside #club-info by using data-* attributes
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

### styles.css

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
