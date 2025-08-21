# Class 4 — OOP: Refactor to Classes (Club, Member, Event)

## At a glance

- What you’ll build: Refactor the app state/logic from plain objects to small classes (Club, Member, EventItem) with simple getters. Keep the UI the same with a small layout tweak.
- Files touched: index.html, styles.css, app.js
- Est. time: 30–45 min
- Prereqs: Finished Class 3

## How to run

- Use the VS Code Live Server extension (Right‑click `index.html` → "Open with Live Server"). Avoid opening via `file://` so scripts/assets load consistently.

## How to use

- Follow steps in order. For each Step, paste only green lines and remove red lines. Use the Clean copy/paste snippet(s) immediately under each Diff.
- Deltas are true unified diffs against Class 3. Full, final code is in the Appendix.

## Before you start

- Open these files: `JS_Mini_Project/class_code/class_04/index.html`, `styles.css`, `app.js`.
- Baseline for diffs: `JS_Mini_Project/class_code/class_03/`.
- Goal: Introduce classes and update seed/render/add logic with minimal visual changes.

## What changed since last class (unified diff)

<details>
  <summary>Diff — index.html: update lesson title</summary>

```diff
 <head>
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1" />
-  <title>Campus Club Manager — Class 3</title>
+  <title>Campus Club Manager — Class 4</title>
   <link rel="stylesheet" href="styles.css" />
 </head>
```

</details>

<details>
  <summary>Diff — styles.css: widen main container</summary>

```diff
-main { max-width: 800px; margin: 0 auto; }
+main { max-width: 900px; margin: 0 auto; }
```

</details>

<details>
  <summary>Diff — app.js: introduce classes, update seed/render/add</summary>

```diff
-// Class 3 — Booleans, Ifs, Functions (Create Club)
-// Completed project file
+// Class 4 — OOP: Classes & Composition
+// Refactor state to use classes (Club, Member, Event) and interact via methods/getters.

+// ---- Simple ID helper (avoids external libs for now) ----
+let __id = 1;
+function makeId(prefix) { return `${prefix}_${__id++}`; }

+// ---- Models ----
+class Member { constructor(name, role = "member") { this.id = makeId("m"); this.name = name; this.role = role; } }
+class EventItem {
+  constructor(title, dateStr, description = "", capacity = 100) {
+    this.id = makeId("e"); this.title = title; this.date = new Date(dateStr);
+    this.description = description; this.capacity = capacity; this.rsvps = new Set();
+  }
+  toggleRsvp(memberId) { if (this.rsvps.has(memberId)) this.rsvps.delete(memberId); else if (this.rsvps.size < this.capacity) this.rsvps.add(memberId); }
+}
+class Club {
+  constructor(name, capacity = 1) { this.id = makeId("c"); this.name = name; this.capacity = capacity; this.members = []; this.events = []; }
+  get current() { return this.members.length; }
+  get seatsLeft() { return Math.max(0, this.capacity - this.current); }
+  get percentFull() { return this.capacity > 0 ? Math.round((this.current / this.capacity) * 100) : 0; }
+  addMember(name, role = "member") {
+    if (!name || typeof name !== "string") return { ok: false, reason: "invalid-name" };
+    if (this.seatsLeft <= 0) return { ok: false, reason: "full" };
+    if (this.members.some(m => m.name.toLowerCase() === name.toLowerCase())) return { ok: false, reason: "duplicate" };
+    const m = new Member(name, role); this.members.push(m); return { ok: true, member: m };
+  }
+  removeMember(memberId) { const i = this.members.findIndex(m => m.id === memberId); if (i >= 0) { this.members.splice(i, 1); return true; } return false; }
+  addEvent(evt) { if (evt instanceof EventItem) this.events.push(evt); }
+  upcomingEvents() { const now = new Date(); return this.events.filter(e => e.date >= now).sort((a, b) => a.date - b.date); }
+  static fromPlain(obj) { const c = new Club(obj.name, obj.capacity); for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`); return c; }
+}

-// Seed data from previous class
+// Seed data from previous class
+let clubs = [
+  Club.fromPlain({ name: "Coding Club", current: 12, capacity: 25 }),
+  Club.fromPlain({ name: "Art Club",    current: 8,  capacity: 15 }),
+];
@@
-function renderClubs() {
-  const container = document.getElementById("club-info");
-  container.innerHTML = ""; // clear
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
-    const card = document.createElement("div");
-    card.className = "club-card";
-
-    const msg = `${club.name}: ${club.current}/${club.capacity} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
-    card.textContent = msg;
-    container.appendChild(card);
-  });
-}
+function renderClubs() {
+  const container = document.getElementById("club-info");
+  container.innerHTML = "";
+  if (clubs.length === 0) {
+    const p = document.createElement("p");
+    p.textContent = "No clubs yet. Add one above to get started.";
+    container.appendChild(p);
+    return;
+  }
+  clubs.forEach((club) => {
+    const card = document.createElement("div");
+    card.className = "club-card";
+    const line1 = `${club.name}`;
+    const line2 = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
+    card.innerHTML = `<strong>${line1}</strong><br>${line2}`;
+    container.appendChild(card);
+  });
+}
@@
-function addClub(name, capacity) {
-  clubs.push({ name, current: 0, capacity });
-  renderClubs();
-}
+function addClub(name, capacity) {
+  clubs.push(new Club(name, capacity));
+  renderClubs();
+}
```

</details>

<br><br>

## File tree (current class)

<details open>
  <summary>Directory overview — class_04</summary>

```text
JS_Mini_Project/
  class_code/
    class_04/
      index.html
      app.js
      styles.css
```

</details>

## Live-coding steps

### 1) app.js — Add ID helper and small classes at the top

> 📍 Where: `app.js`, at the very top of the file. Cmd+F "Class 3 —" to locate the header comment.
>
> ℹ️ What: Replace the Class 3 header and add a tiny ID helper plus `Member`, `EventItem`, and `Club` classes with simple getters and helpers. Do not change seeds or rendering yet.
>
> 💡 Why: Modeling domain concepts as small classes keeps logic close to data and makes future features easier. Getters centralize derived values instead of recomputing in multiple places.
>
> ✅ Check: File compiles with no syntax errors. The UI remains unchanged.

<details open>
  <summary>Diff — app.js: replace header; add ID helper and classes</summary>

```diff
-// Class 3 — Booleans, Ifs, Functions (Create Club)
-// Completed project file
+// Class 4 — OOP: Classes & Composition
+// Refactor state to use classes (Club, Member, Event) and interact via methods/getters.

// ---- Simple ID helper (avoids external libs for now) ----
+let __id = 1;
+function makeId(prefix) { return `${prefix}_${__id++}`; }

// ---- Models ----
+class Member {
+  constructor(name, role = "member") {
+    this.id = makeId("m");
+    this.name = name;
+    this.role = role;
+  }
+}
+
+class EventItem {
+  constructor(title, dateStr, description = "", capacity = 100) {
+    this.id = makeId("e");
+    this.title = title;
+    this.date = new Date(dateStr);
+    this.description = description;
+    this.capacity = capacity;
+    this.rsvps = new Set(); // ids of members
+  }
+  toggleRsvp(memberId) {
+    if (this.rsvps.has(memberId)) this.rsvps.delete(memberId);
+    else if (this.rsvps.size < this.capacity) this.rsvps.add(memberId);
+  }
+}
+
+class Club {
+  constructor(name, capacity = 1) {
+    this.id = makeId("c");
+    this.name = name;
+    this.capacity = capacity;
+    this.members = []; // Member[]
+    this.events = [];  // EventItem[]
+  }
+  get current()      { return this.members.length; }
+  get seatsLeft()    { return Math.max(0, this.capacity - this.current); }
+  get percentFull()  { return this.capacity > 0 ? Math.round((this.current / this.capacity) * 100) : 0; }
+  addMember(name, role = "member") {
+    if (!name || typeof name !== "string") return { ok: false, reason: "invalid-name" };
+    if (this.seatsLeft <= 0)              return { ok: false, reason: "full" };
+    if (this.members.some(m => m.name.toLowerCase() === name.toLowerCase())) return { ok: false, reason: "duplicate" };
+    const m = new Member(name, role); this.members.push(m); return { ok: true, member: m };
+  }
+  removeMember(memberId) {
+    const i = this.members.findIndex(m => m.id === memberId);
+    if (i >= 0) { this.members.splice(i, 1); return true; }
+    return false;
+  }
+  addEvent(evt) {
+    if (evt instanceof EventItem) this.events.push(evt);
+  }
+  upcomingEvents() {
+    const now = new Date();
+    return this.events.filter(e => e.date >= now).sort((a, b) => a.date - b.date);
+  }
+  static fromPlain(obj) {
+    const c = new Club(obj.name, obj.capacity);
+    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
+    return c;
+  }
+}
```

</details>

<details>
  <summary>Clean copy/paste — app.js: add ID helper</summary>

```js
// ---- Simple ID helper (avoids external libs for now) ----
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}
```

</details>

<details>
  <summary>Clean copy/paste — app.js: add Member class</summary>

```js
class Member {
  constructor(name, role = "member") {
    this.id = makeId("m");
    this.name = name;
    this.role = role;
  }
}
```

</details>

<details>
  <summary>Clean copy/paste — app.js: add EventItem class</summary>

```js
class EventItem {
  constructor(title, dateStr, description = "", capacity = 100) {
    this.id = makeId("e");
    this.title = title;
    this.date = new Date(dateStr);
    this.description = description;
    this.capacity = capacity;
    this.rsvps = new Set(); // ids of members
  }
  toggleRsvp(memberId) {
    if (this.rsvps.has(memberId)) this.rsvps.delete(memberId);
    else if (this.rsvps.size < this.capacity) this.rsvps.add(memberId);
  }
}
```

</details>

<details>
  <summary>Clean copy/paste — app.js: add Club class</summary>

```js
class Club {
  constructor(name, capacity = 1) {
    this.id = makeId("c");
    this.name = name;
    this.capacity = capacity;
    this.members = []; // Member[]
    this.events = []; // EventItem[]
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
    if (this.members.some((m) => m.name.toLowerCase() === name.toLowerCase()))
      return { ok: false, reason: "duplicate" };
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
```

</details>

<details>
  <summary>Final after update — app.js: ID helper + classes block</summary>

```js
// ---- Simple ID helper (avoids external libs for now) ----
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
    this.rsvps = new Set(); // ids of members
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
    this.members = []; // Member[]
    this.events = []; // EventItem[]
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
    if (this.members.some((m) => m.name.toLowerCase() === name.toLowerCase()))
      return { ok: false, reason: "duplicate" };
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
```

</details>

<br><br>

### 2) app.js — Update seed data to use Club instances

> 📍 Where: `app.js`, find the line starting with `let clubs = [`.
>
> ℹ️ What: Replace the array of plain objects with `Club.fromPlain(...)` so initial data becomes real Club instances.
>
> 💡 Why: Using class instances from the start means subsequent getters and methods work consistently and avoids mixing shapes.
>
> ✅ Check: Reload; the two sample clubs still render with the same numbers.

<details open>
  <summary>Diff — app.js: seed with Club.fromPlain(...)</summary>

```diff
-// Seed data from previous class
-let clubs = [
-  { name: "Coding Club", current: 12, capacity: 25 },
-  { name: "Art Club", current: 8, capacity: 15 },
-];
+// Seed data from previous class
+let clubs = [
+  Club.fromPlain({ name: "Coding Club", current: 12, capacity: 25 }),
+  Club.fromPlain({ name: "Art Club",    current: 8,  capacity: 15 }),
+];
```

</details>

<details>
  <summary>Clean copy/paste — app.js: new seed array</summary>

```js
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 12, capacity: 25 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 15 }),
];
```

</details>

<br><br>

### 3) app.js — Update renderClubs() to use getters and small markup

> 📍 Where: `app.js`, Cmd+F `function renderClubs()`.
>
> ℹ️ What: Keep the empty state, but change each card to use `club.seatsLeft` and `club.percentFull` getters and a two‑line innerHTML.
>
> 💡 Why: Getters keep derived data with the model; a touch of markup improves readability without adding complexity.
>
> ✅ Check: The cards now show the club name in bold on the first line and the numbers on the second line; counts are unchanged.

<details open>
  <summary>Diff — app.js: rewrite renderClubs()</summary>

```diff
 function renderClubs() {
   const container = document.getElementById("club-info");
-  container.innerHTML = ""; // clear
+  container.innerHTML = "";

   // Empty state
   if (clubs.length === 0) {
     const p = document.createElement("p");
     p.textContent = "No clubs yet. Add one above to get started.";
     container.appendChild(p);
     return;
   }

   clubs.forEach((club) => {
     const card = document.createElement("div");
     card.className = "club-card";
-
-    const msg = `${club.name}: ${club.current}/${club.capacity} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
-    card.textContent = msg;
+
+    const line1 = `${club.name}`;
+    const line2 = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
+    card.innerHTML = `<strong>${line1}</strong><br>${line2}`;

     container.appendChild(card);
   });
 }
```

</details>

<details>
  <summary>Clean copy/paste — app.js: final renderClubs()</summary>

```js
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  if (clubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs yet. Add one above to get started.";
    container.appendChild(p);
    return;
  }

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";

    const line1 = `${club.name}`;
    const line2 = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
    card.innerHTML = `<strong>${line1}</strong><br>${line2}`;

    container.appendChild(card);
  });
}
```

</details>

<br><br>

### 4) app.js — Update addClub() to create a Club instance

> 📍 Where: `app.js`, Cmd+F `function addClub(`.
>
> ℹ️ What: Push a `new Club(name, capacity)` instead of a plain object and re‑render.
>
> 💡 Why: New clubs should be first‑class Club instances so getters and future methods work the same as seeded ones.
>
> ✅ Check: Adding a new club still renders a card with the same formatting as existing ones.

<details open>
  <summary>Diff — app.js: update addClub()</summary>

```diff
 function addClub(name, capacity) {
-  clubs.push({ name, current: 0, capacity });
-  renderClubs();
+  clubs.push(new Club(name, capacity));
+  renderClubs();
 }
```

</details>

<details>
  <summary>Clean copy/paste — app.js: final addClub()</summary>

```js
function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
  renderClubs();
}
```

</details>

<br><br>

### 5) app.js — Remove obsolete helpers (pure deletion)

> 📍 Where: `app.js`, locate the functions `seatsLeft(club)` and `percentFull(club)` from Class 3.
>
> ℹ️ What: Delete these helper functions entirely. The `Club` getters replace them.
>
> 💡 Why: Removing dead code avoids confusion and keeps one source of truth for derived values.
>
> ✅ Check: File compiles with no references to `seatsLeft` or `percentFull` remaining.

<details open>
  <summary>Diff — app.js: DO NOT PASTE — REMOVE EXACTLY THESE LINES</summary>

```diff
-// Utility: compute seats left
-function seatsLeft(club) {
-  return club.capacity - club.current;
-}
-
-// Utility: compute percent full (rounded)
-function percentFull(club) {
-  if (club.capacity <= 0) return 0;
-  return Math.round((club.current / club.capacity) * 100);
-}
```

</details>

<br><br>

## Troubleshooting

- Syntax errors: Check for missing braces when pasting class code; paste small snippets in order.
- Numbers are wrong: Ensure `renderClubs()` uses `club.seatsLeft` and `club.percentFull` getters.
- New clubs not rendering: Confirm `addClub` uses `new Club(name, capacity)`.
- Mixed shapes: If you see runtime errors on getters, verify seeds are created via `Club.fromPlain(...)` instead of plain objects.

## Appendix — Full Source After This Class

<details>
  <summary>Full source — index.html</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 4</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Track club capacity and members</p>
    </header>

    <main>
      <!-- Create Club Form (from Class 3) -->
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

      <!-- Club Cards render here -->
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
  <summary>Full source — app.js</summary>

```js
// Class 4 — OOP: Classes & Composition
// Refactor state to use classes (Club, Member, Event) and interact via methods/getters.

// ---- Simple ID helper (avoids external libs for now) ----
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
    this.rsvps = new Set(); // ids of members
  }
  toggleRsvp(memberId) {
    if (this.rsvps.has(memberId)) {
      this.rsvps.delete(memberId);
    } else if (this.rsvps.size < this.capacity) {
      this.rsvps.add(memberId);
    }
  }
}

class Club {
  constructor(name, capacity = 1) {
    this.id = makeId("c");
    this.name = name;
    this.capacity = capacity;
    this.members = []; // Member[]
    this.events = []; // EventItem[]
  }

  // ---- Derived data (getters) ----
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

  // ---- Behavior ----
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

  // Helper to migrate from last week's plain objects
  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    // Seed members to match previous "current" counts
    for (let i = 0; i < (obj.current || 0); i++) {
      c.addMember(`Member ${i + 1}`);
    }
    return c;
  }
}

// ---- App State (now using Club instances) ----
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 12, capacity: 25 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 15 }),
];

// ---- Render ----
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  if (clubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs yet. Add one above to get started.";
    container.appendChild(p);
    return;
  }

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";

    // For now we show top-level stats. Members/Events UI comes next classes.
    const line1 = `${club.name}`;
    const line2 = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

    // Keep it simple for beginners: just a couple of lines
    card.innerHTML = `<strong>${line1}</strong><br>${line2}`;

    container.appendChild(card);
  });
}

// ---- Add Club (uses the Club class) ----
function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
  renderClubs();
}

// ---- Form handler (same UI as Class 3, now creating Club instances) ----
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
  addClub(name, capacity);

  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// ---- Footer year & initial paint ----
document.getElementById("year").textContent = new Date().getFullYear();
renderClubs();
```

</details>

<details>
  <summary>Full source — styles.css</summary>

```css
/* Simple, beginner-friendly styles (same base as Class 3) */

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
  max-width: 900px;
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

.error {
  color: #c00;
  margin-top: 8px;
}

.cards {
  display: grid;
  gap: 10px;
}
.club-card {
  border: 1px solid #ccc;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
}

footer {
  margin-top: 20px;
  color: #666;
}
```

</details>
