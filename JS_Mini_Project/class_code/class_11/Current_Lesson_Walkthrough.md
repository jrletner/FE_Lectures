# Class 11 — Client-side Routing (List ↔ Detail)

## At a glance (optional)

- What you’ll build: Hash-based router to switch between a list view and a club detail view
- Files touched: index.html, styles.css, src/app.js, src/router.js, src/ui/render.js, src/ui/detail.js
- Est. time: 60–90 min
- Prereqs: Finished Class 10 (persistence + import/export)

## How to run

- Use the VS Code Live Server extension (Right‑click `index.html` → "Open with Live Server").
- Keep DevTools open; watch the hash in the URL update (e.g., `#/club/abc123`).

## How to use

- Live-code in small steps. After each change, flip between All Clubs and a club detail using the links.
- Validate with checks: visual toggle, console (no errors), and DOM (`#app-root` content changes per route).

## Before you start

- Open: `JS_Mini_Project/class_code/class_11`
- Baseline: Compare Class 10 vs 11 to write precise diffs.
- Files to diff: `index.html`, `styles.css`, `src/app.js`, `src/ui/render.js`, plus new `src/router.js` and `src/ui/detail.js`.

## What changed since last class

Structural notes:

- New: `src/router.js` for hash parsing and navigation helpers.
- New: `src/ui/detail.js` to render a single club with full events list.
- Changed: `index.html` swaps `#club-info` for `#app-root` and adds crumb nav and route-only toggles; list view’s render links to detail.

```diff
# index.html
- <title>Campus Club Manager — Class 10</title>
+ <title>Campus Club Manager — Class 11</title>
-     <p>Persistence with <code>localStorage</code> + Import/Export</p>
+     <p>Client-side routing: List view ↔ Detail view</p>
+
+ <nav class="crumbs">
+   <a href="#/" id="home-link">All Clubs</a>
+   <span id="crumb-current"></span>
+ </nav>
-
- <section id="club-info" class="cards"></section>
+ <section id="app-root" class="cards"></section>
+
- <form id="club-form" class="form">
+ <form id="club-form" class="form route-only home">
- <section class="toolbar">
+ <section class="toolbar route-only home">
```

```diff
# styles.css
+ nav.crumbs { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 4px 0 8px; font-size: 14px; }
+ nav.crumbs a { color: #0b5bd3; text-decoration: none; }
+ nav.crumbs a:hover { text-decoration: underline; }
+ nav.crumbs #crumb-current { color: #666; }
+ .route-only.home.hidden { display: none; }
```

```diff
# src/router.js (new)
+ export function parseHash() { /* '#/club/:id' → {view:'club', id} */ }
+ export function goHome() { window.location.hash = '#/'; }
+ export function goClub(id) { window.location.hash = `#/club/${id}`; }
```

```diff
# src/ui/render.js
- const container = document.getElementById('club-info');
+ const container = document.getElementById('app-root');
- <strong>${club.name}</strong>
+ <strong><a href="#/club/${club.id}">${club.name}</a></strong>
- Events list rendered here
+ Quick Add Event only; link: <a href="#/club/${club.id}">View details</a>
```

```diff
# src/ui/detail.js (new)
+ Renders a single club, including full Events list with remove buttons
```

```diff
# src/app.js
+ import { renderClubDetail } from './ui/detail.js';
+ import { parseHash, goHome } from './router.js';
+ function setRouteChrome(route) { /* toggle .route-only.home */ }
+ function paint() { const route = parseHash(); route.view==='club'? renderClubDetail(...): renderClubs(...); }
+ window.addEventListener('hashchange', paint);
+ window.addEventListener('load', paint);
- const clubContainer = document.getElementById('club-info');
+ const appRoot = document.getElementById('app-root');
```

## File tree (current class)

```text
class_11/
  index.html
  styles.css
  src/
    app.js
    router.js
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
```

> Note: `#app-root` replaces `#club-info`. New `router.js` and `ui/detail.js` added.

## Live-coding steps

### 1) index.html — crumbs, route toggles, and new root

> 📍 Where: `index.html` → header/subtitle, new `<nav class="crumbs">` under header, `form` + `toolbar` classes, container id
>
> ℹ️ What: Update title/subtitle; add crumbs; mark form/toolbar as `route-only home`; replace `#club-info` with `#app-root`.
>
> 💡 Why: Crumbs provide context, and route-only toggles hide home-only UI on detail pages.
>
> ✅ Check: See “All Clubs” crumb and an empty crumb-current span; form/toolbar hide when you navigate to a club URL.

```diff
# DO NOT PASTE — REMOVE EXACTLY THESE LINES
- <p>Persistence with <code>localStorage</code> + Import/Export</p>
- <section id="club-info" class="cards"></section>
```

```html
<!-- (Required) Commented context — header anchors -->
<!-- <h1>Campus Club Manager</h1> -->
<!-- <p>Persistence with <code>localStorage</code> + Import/Export</p> -->

<!-- Update subtitle -->
<p>Client-side routing: List view ↔ Detail view</p>
```

```html
<!-- (Required) Commented context — after header -->
<!-- </header> -->

<!-- Add crumbs nav -->
<nav class="crumbs">
  <a href="#/" id="home-link">All Clubs</a>
  <span id="crumb-current"></span>
</nav>
```

```html
<!-- (Required) Commented context — form + toolbar blocks -->
<!-- <form id="club-form" class="form"> -->
<!-- <section class="toolbar"> -->

<!-- Add route-only home toggles -->
<form id="club-form" class="form route-only home">
  ...
  <section class="toolbar route-only home"></section>
</form>
```

```html
<!-- (Required) Commented context — container replacement -->
<!-- <section id="club-info" class="cards"></section> -->

<!-- Replace with: -->
<section id="app-root" class="cards"></section>
```

### 2) styles.css — crumbs and route-only helpers

> 📍 Where: `styles.css` → near other layout utilities
>
> ℹ️ What: Add `.crumbs` styles and `.route-only.home.hidden` rule.
>
> 💡 Why: Visually distinct breadcrumbs and a simple toggle to hide home-only UI.
>
> ✅ Check: Crumbs render with link styling; toggling `.hidden` hides home-only blocks.

```css
/* (Required) Commented context — utilities */
/* .toolbar { display: flex; ... } */

/* Add */
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

.route-only.home.hidden {
  display: none;
}
```

> Checkpoint 1
>
> - Visual: Breadcrumbs appear.
> - Console: No errors.

### 3) router.js — parse and navigate

> 📍 Where: `src/router.js` (new file)
>
> ℹ️ What: Implement `parseHash()` to read `#/` or `#/club/:id`; helpers `goHome()` and `goClub(id)`.
>
> 💡 Why: Keep routing concerns isolated and testable.
>
> ✅ Check: Manually set `window.location.hash = '#/club/test'` and verify parseHash returns `{view:'club', id:'test'}` in console.

```js
// New file: src/router.js
export function parseHash() {
  const raw = window.location.hash || "#/";
  const h = raw.startsWith("#") ? raw.slice(1) : raw;
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 0) return { view: "home" };
  if (parts[0] === "club" && parts[1]) return { view: "club", id: parts[1] };
  return { view: "home" };
}
export function goHome() {
  window.location.hash = "#/";
}
export function goClub(id) {
  window.location.hash = `#/club/${id}`;
}
```

### 4) render.js — link clubs to detail and use #app-root

> 📍 Where: `src/ui/render.js` → container selection and card title, event area
>
> ℹ️ What: Render into `#app-root`. Make the club title a link to `#/club/:id`. Show only a Quick Add Event form with a “View details” link.
>
> 💡 Why: Keep list view focused; detail view owns the full events list.
>
> ✅ Check: Club names are links; clicking navigates to detail (hash changes) and content updates.

```js
// (Required) Commented context — top of file
// const container = document.getElementById('club-info');

// Update container
const container = document.getElementById("app-root");
```

```js
// (Required) Commented context — inside card template where name appears
// <div><strong>${club.name}</strong><br>${stats}</div>

// Make it a link to detail
<div><strong><a href="#/club/${club.id}">${club.name}</a></strong><br>${stats}</div>
```

```js
// (Required) Commented context — previous events list area
// <div class="event-section"> ... full events list ... </div>

// Replace with Quick Add + link
<div class="event-section">
  <h4>Quick Add Event</h4>
  <div class="inline-form">
    <input id="event-title-${club.id}" type="text" placeholder="Event title" />
    <input id="event-date-${club.id}" type="date" min="${todayISO}" />
    <input
      id="event-capacity-${club.id}"
      type="number"
      min="1"
      placeholder="Capacity"
    />
    <input
      id="event-desc-${club.id}"
      type="text"
      placeholder="Optional description"
    />
    <button class="btn" data-action="add-event" data-club-id="${club.id}">
      Add Event
    </button>
  </div>
  <p class="note">
    <a href="#/club/${club.id}">View details</a> to see full event list.
  </p>
</div>
```

### 5) detail.js — render one club with events

> 📍 Where: `src/ui/detail.js` (new file)
>
> ℹ️ What: Render members and the full events list for a single club; set crumb to the club name.
>
> 💡 Why: Split views keep the list view decluttered and demonstrate routing patterns.
>
> ✅ Check: On `#/club/:id`, the detail page shows event items and remove buttons.

```js
// New file: src/ui/detail.js
import { dayjs } from "../utils/externals.js";
export function renderClubDetail(club) {
  const container = document.getElementById("app-root");
  container.innerHTML = "";
  document.getElementById("crumb-current").textContent = `› ${club.name}`;
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.clubId = club.id;
  const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
  const membersHtml = club.members
    .map(
      (m) => `
    <li>${m.name}
      <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
    </li>`
    )
    .join("");
  const eventsHtml = club.events
    .map((evt) => {
      const when = evt.friendlyWhen;
      const pastBadge = evt.isPast ? '<span class="badge">Past</span>' : "";
      return `<li>
      <strong>${evt.title}</strong> — ${when} ${pastBadge}
      <button class="link-btn" data-action="remove-event" data-club-id="${club.id}" data-event-id="${evt.id}">Remove</button>
    </li>`;
    })
    .join("");
  const todayISO = dayjs().format("YYYY-MM-DD");
  card.innerHTML = `
    <div><strong>${club.name}</strong><br>${stats}</div>
    <div class="member-section">
      <h4>Members (${club.current})</h4>
      <ul class="member-list">${
        membersHtml || "<li><em>No members yet</em></li>"
      }</ul>
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
    <div class="event-section">
      <h4>Events (${club.events.length})</h4>
      <ul class="event-list">${
        eventsHtml || "<li><em>No events yet</em></li>"
      }</ul>
      <div class="inline-form">
        <input id="event-title-${
          club.id
        }" type="text" placeholder="Event title" />
        <input id="event-date-${club.id}" type="date" min="${todayISO}" />
        <input id="event-capacity-${
          club.id
        }" type="number" min="1" placeholder="Capacity" />
        <input id="event-desc-${
          club.id
        }" type="text" placeholder="Optional description" />
        <button class="btn" data-action="add-event" data-club-id="${
          club.id
        }">Add Event</button>
      </div>
    </div>`;
  container.appendChild(card);
}
```

### 6) app.js — route-aware paint and event delegation on #app-root

> 📍 Where: `src/app.js` → imports, paint(), event delegation container, route listeners
>
> ℹ️ What: Import router and detail renderer; implement `paint()` that switches by hash; delegate clicks on `#app-root`; wire `hashchange` and `load`.
>
> 💡 Why: Centralized render by route; no duplicate listeners between views.
>
> ✅ Check: Clicking a club navigates to detail; back to home shows list; add/remove still persists and re-renders.

```js
// (Required) Commented context — imports
// import { renderClubs, setStatus } from './ui/render.js';
// import { debounce } from './utils/debounce.js';

// Add
import { renderClubDetail } from "./ui/detail.js";
import { parseHash, goHome } from "./router.js";
```

```js
// (Required) Commented context — container selection
// const clubContainer = document.getElementById('club-info');

// Update
const appRoot = document.getElementById("app-root");
```

```js
// (Required) Commented context — new paint
// function paint() { const visible = getVisibleClubs(clubs); renderClubs(visible); }

// Update paint to be route-aware
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
```

```js
// (Required) Commented context — event delegation root
// clubContainer.addEventListener('click', (e) => { ... })

// Update: delegate on #app-root
appRoot.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = findClubById(clubId);
  if (!club) return;
  // ...existing member/event branches (unchanged logic), ensure saveState + paint()
});
```

```js
// (Required) Commented context — boot
// paint();

// Add route listeners
window.addEventListener("hashchange", paint);
window.addEventListener("load", paint);
```

> Checkpoint 2 — Routing working
>
> - Visual: Home shows cards; clicking a name routes to details; crumbs show “› Club Name”.
> - Console: No errors after navigation and actions.

## Troubleshooting

- Clicking club does nothing: Ensure the title is an `<a href="#/club/${'{club.id}'}">` link and `hashchange` listener is registered.
- Form/toolbar still visible on detail: Verify `.route-only.home` elements get `.hidden` on non-home routes in `setRouteChrome`.
- Blank detail: If `renderClubDetail` runs with a missing club, you should `goHome()`; verify `findClubById(route.id)` returns a club.
- Persistence lost: Ensure `saveState(clubs)` is called after mutations (add/remove member/event).

## Appendix — Full Source After This Class

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 11</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Client-side routing: List view ↔ Detail view</p>
    </header>

    <nav class="crumbs">
      <a href="#/" id="home-link">All Clubs</a>
      <span id="crumb-current"></span>
    </nav>

    <main>
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
      </section>

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
/* Class 11 — Client-side routing (hash-based) */
* {
  box-sizing: border-box;
}
body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
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

footer {
  margin-top: 20px;
  color: #666;
}

.route-only.home.hidden {
  display: none;
}
```

### src/app.js

```javascript
// src/app.js — Class 11 entry: Routing
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
import { saveState } from "./store/persist.js";
import { debounce } from "./utils/debounce.js";
import { parseHash, goHome } from "./router.js";

document.getElementById("year").textContent = new Date().getFullYear();

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

saveState(clubs);

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
  localStorage.removeItem("ccm:v1");
  location.reload();
});

window.addEventListener("hashchange", paint);
window.addEventListener("load", paint);
```

### src/router.js

```javascript
// src/router.js
export function parseHash() {
  const raw = window.location.hash || "#/";
  const h = raw.startsWith("#") ? raw.slice(1) : raw;
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 0) return { view: "home" };
  if (parts[0] === "club" && parts[1]) return { view: "club", id: parts[1] };
  return { view: "home" };
}
export function goHome() {
  window.location.hash = "#/";
}
export function goClub(id) {
  window.location.hash = `#/club/${id}`;
}
```

### src/ui/render.js

```javascript
// src/ui/render.js
import { dayjs } from "../utils/externals.js";
export function renderClubs(visibleClubs) {
  const container = document.getElementById("app-root");
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
        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
      </li>`
      )
      .join("");
    const todayISO = dayjs().format("YYYY-MM-DD");
    card.innerHTML = `
      <div><strong><a href="#/club/${club.id}">${
      club.name
    }</a></strong><br>${stats}</div>
      <div class="member-section">
        <h4>Members (${club.current})</h4>
        <ul class="member-list">${
          membersHtml || "<li><em>No members yet</em></li>"
        }</ul>
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
      <div class="event-section">
        <h4>Quick Add Event</h4>
        <div class="inline-form">
          <input id="event-title-${
            club.id
          }" type="text" placeholder="Event title" />
          <input id="event-date-${club.id}" type="date" min="${todayISO}" />
          <input id="event-capacity-${
            club.id
          }" type="number" min="1" placeholder="Capacity" />
          <input id="event-desc-${
            club.id
          }" type="text" placeholder="Optional description" />
          <button class="btn" data-action="add-event" data-club-id="${
            club.id
          }">Add Event</button>
        </div>
        <p class="note"><a href="#/club/${
          club.id
        }">View details</a> to see full event list.</p>
      </div>`;
    container.appendChild(card);
  });
}
export function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
```

### src/ui/detail.js

```javascript
// src/ui/detail.js
import { dayjs } from "../utils/externals.js";
export function renderClubDetail(club) {
  const container = document.getElementById("app-root");
  container.innerHTML = "";
  document.getElementById("crumb-current").textContent = `› ${club.name}`;
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.clubId = club.id;
  const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
  const membersHtml = club.members
    .map(
      (m) => `
    <li>${m.name}
      <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
    </li>`
    )
    .join("");
  const eventsHtml = club.events
    .map((evt) => {
      const when = evt.friendlyWhen;
      const pastBadge = evt.isPast ? '<span class="badge">Past</span>' : "";
      return `<li>
      <strong>${evt.title}</strong> — ${when} ${pastBadge}
      <button class="link-btn" data-action="remove-event" data-club-id="${club.id}" data-event-id="${evt.id}">Remove</button>
    </li>`;
    })
    .join("");
  const todayISO = dayjs().format("YYYY-MM-DD");
  card.innerHTML = `
    <div><strong>${club.name}</strong><br>${stats}</div>
    <div class="member-section">
      <h4>Members (${club.current})</h4>
      <ul class="member-list">${
        membersHtml || "<li><em>No members yet</em></li>"
      }</ul>
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
    <div class="event-section">
      <h4>Events (${club.events.length})</h4>
      <ul class="event-list">${
        eventsHtml || "<li><em>No events yet</em></li>"
      }</ul>
      <div class="inline-form">
        <input id="event-title-${
          club.id
        }" type="text" placeholder="Event title" />
        <input id="event-date-${club.id}" type="date" min="${todayISO}" />
        <input id="event-capacity-${
          club.id
        }" type="number" min="1" placeholder="Capacity" />
        <input id="event-desc-${
          club.id
        }" type="text" placeholder="Optional description" />
        <button class="btn" data-action="add-event" data-club-id="${
          club.id
        }">Add Event</button>
      </div>
    </div>`;
  container.appendChild(card);
}
```
