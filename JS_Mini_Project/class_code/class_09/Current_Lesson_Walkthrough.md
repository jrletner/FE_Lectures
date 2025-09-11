# Class 9 — Events, Dates, and External Libraries (dayjs + nanoid)

## At a glance

- What you’ll build: Add Events per club with dates/capacities and render them; introduce dayjs (dates) and nanoid (IDs) via ESM CDN.
- Files touched: index.html, styles.css, src/app.js, src/ui/render.js, src/store/data.js, src/utils/externals.js, src/models/{Club,Member,EventItem}.js
- Est. time: 60–90 min
- Prereqs: Finished Class 8

## How to run

- Use the VS Code Live Server extension (Right‑click `index.html` → "Open with Live Server"). Avoid opening via `file://` to ensure module imports load correctly. Internet is required for CDN imports.

## How to use

- Live-code friendly. Paste small snippets in order and verify the ✅ Check after each step.
- Keep the browser and console open side-by-side; use triad checks: Visual (UI), Console (one line), DOM query.

## Before you start

- Open: `JS_Mini_Project/class_code/class_09`
- Baseline: Compare Class 8 repo files with Class 9 to author exact diffs (done below).
- Files to diff: `index.html`, `styles.css`, `src/app.js`, `src/ui/render.js`, `src/store/data.js`, `src/models/*.js`, `src/utils/*`
- Reset plan: If drift occurs, restore the Appendix code and resume from the last checkpoint.

## What changed since last class

Structural note: Added `src/utils/externals.js` to centralize ESM CDN imports (dayjs, nanoid). Models now use nanoid IDs and dayjs for dates.

<details>
  <summary>Diff — index.html: update title and subtitle</summary>

```diff
@@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
-  <title>Campus Club Manager — Class 8</title>
+  <title>Campus Club Manager — Class 9</title>
   <link rel="stylesheet" href="styles.css" />
@@
   <header>
     <h1>Campus Club Manager</h1>
-    <p>ES Modules & cleaner project structure</p>
+    <p>Events with Dates & IDs (Day.js + nanoid)</p>
   </header>
```

</details>

<details>
  <summary>Clean copy/paste — index.html: title + subtitle</summary>

```html
<title>Campus Club Manager — Class 9</title>
<p>Events with Dates & IDs (Day.js + nanoid)</p>
```

</details>

<br><br>

## File tree (current class)

<details open>
  <summary>Directory overview — class_09 (touched files)</summary>

```text
class_09/
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
      externals.js
```

</details>

<br><br>

### 2) styles.css — widen main and add event styles

> 📍 Where: `class_09/styles.css` — update main width; extend form inputs; add event list and badge styles. Cmd+F: "max-width", "form-row input", "member-section".
>
> ℹ️ What: Widen layout and add styles for events and badges.
>
> 💡 Why: More space for event lists and a consistent look for inline forms and badges.
>
> ✅ Check: Page widens slightly; no console/style errors.

#### 2.1) Widen main

<details open>
  <summary>Diff — styles.css: main width</summary>

```diff
@@
-main { max-width: 960px; margin: 0 auto; }
+main { max-width: 1000px; margin: 0 auto; }
```

</details>

<details>
  <summary>Clean copy/paste — styles.css: main width</summary>

```css
main {
  max-width: 1000px;
  margin: 0 auto;
}
```

</details>

#### 2.2) Extend form-row inputs

<details open>
  <summary>Diff — styles.css: extend .form-row inputs</summary>

```diff
@@
-.form-row input {
-  flex: 1;
-  padding: 6px 8px;
-  border: 1px solid #ccc;
-  border-radius: 4px;
-}
+.form-row input, .form-row textarea, .form-row select {
+  flex: 1;
+  padding: 6px 8px;
+  border: 1px solid #ccc;
+  border-radius: 4px;
+}
```

</details>

<details>
  <summary>Clean copy/paste — styles.css: extend .form-row</summary>

```css
.form-row input,
.form-row textarea,
.form-row select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

</details>

#### 2.3) Add event section/list styling

<details open>
  <summary>Diff — styles.css: event section/list</summary>

```diff
@@
-.member-section { margin-top: 8px; }
-.member-section h4 { margin: 0 0 6px; font-size: 16px; }
-.member-list { list-style: disc; padding-left: 20px; margin: 6px 0; }
-.member-list li { margin: 2px 0; }
+.member-section, .event-section { margin-top: 10px; }
+.member-section h4, .event-section h4 { margin: 0 0 6px; font-size: 16px; }
+.member-list, .event-list { list-style: disc; padding-left: 20px; margin: 6px 0; }
+.member-list li, .event-list li { margin: 2px 0; }
```

</details>

<details>
  <summary>Clean copy/paste — styles.css: event section/list</summary>

```css
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
```

</details>

#### 2.4) Extend inline-form inputs

<details open>
  <summary>Diff — styles.css: extend .inline-form inputs</summary>

```diff
@@
-.inline-form input {
-  flex: 1;
-  padding: 6px 8px;
-  border: 1px solid #ccc;
-  border-radius: 4px;
-}
+.inline-form input, .inline-form textarea, .inline-form select {
+  flex: 1;
+  min-width: 200px;
+  padding: 6px 8px;
+  border: 1px solid #ccc;
+  border-radius: 4px;
+}
```

</details>

<details>
  <summary>Clean copy/paste — styles.css: extend .inline-form</summary>

```css
.inline-form input,
.inline-form textarea,
.inline-form select {
  flex: 1;
  min-width: 200px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

</details>

#### 2.5) Add badge style

<details open>
  <summary>Diff — styles.css: .badge</summary>

```diff
@@
 .link-btn:hover { text-decoration: underline; }
+
+.badge {
+  display: inline-block;
+  padding: 2px 6px;
+  border: 1px solid #ddd;
+  border-radius: 4px;
+  background: #fafafa;
+  font-size: 12px;
+  margin-left: 8px;
+}
```

</details>

<details>
  <summary>Clean copy/paste — styles.css: .badge</summary>

```css
.badge {
  display: inline-block;
  padding: 2px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
  font-size: 12px;
  margin-left: 8px;
}
```

</details>

<br><br>

### 3) utils — add externals.js (dayjs + nanoid)

> 📍 Where: `src/utils/externals.js` (new file). Cmd+F in repo: `externals.js` after creating.
>
> ℹ️ What: Centralized ESM CDN imports for dayjs (+relativeTime) and nanoid.
>
> 💡 Why: One place to switch providers or versions later.
>
> ✅ Check: Served via Live Server; no import errors in console.

<details open>
  <summary>File tree — create src/utils/externals.js</summary>

```text
# Create externals.js under src/utils
class_09/
  src/
    utils/
      externals.js
```

</details>

<details>
  <summary>Clean copy/paste — src/utils/externals.js</summary>

```js
// src/utils/externals.js
import dayjsLib from "https://esm.sh/dayjs@1.11.11";
import relativeTime from "https://esm.sh/dayjs@1.11.11/plugin/relativeTime";
dayjsLib.extend(relativeTime);
export const dayjs = dayjsLib;
export { nanoid } from "https://esm.sh/nanoid@5.0.7";
```

</details>

<br><br>

### 4) models — nanoid IDs + EventItem date helpers

#### 4.1) Member uses nanoid

> 📍 Where: `src/models/Member.js` — top imports; constructor id assignment. Cmd+F: `class Member`.
>
> ℹ️ What: Import nanoid and use it for `this.id`.
>
> 💡 Why: Avoid homemade counters; get collision‑resistant IDs.
>
> ✅ Check: Adding a member yields a string ID, not `m_1`.

<details open>
  <summary>Diff — src/models/Member.js: nanoid id</summary>

```diff
@@
-// src/models/Member.js
-let __id = 1;
-function makeId(prefix) { return `${prefix}_${__id++}`; }
-
-export class Member {
-  constructor(name, role = "member") {
-    this.id = makeId("m");
-    this.name = name;
-    this.role = role;
-  }
-}
+// src/models/Member.js
+import { nanoid } from '../utils/externals.js';
+
+export class Member {
+  constructor(name, role = "member") {
+    this.id = nanoid();
+    this.name = name;
+    this.role = role;
+  }
+}
```

</details>

<details>
  <summary>Clean copy/paste — Member import + id</summary>

```js
import { nanoid } from "../utils/externals.js";
// inside constructor
this.id = nanoid();
```

</details>

#### 4.2) EventItem gets dayjs + helpers

> 📍 Where: `src/models/EventItem.js` — imports; constructor; getters. Cmd+F: `class EventItem`.
>
> ℹ️ What: Store `dateISO` and add `date`, `isPast`, `friendlyWhen` getters.
>
> 💡 Why: Human‑friendly labels and safe date math.
>
> ✅ Check: In console: `new EventItem('X','2025-09-10').friendlyWhen` shows a readable string.

<details open>
  <summary>Diff — src/models/EventItem.js: date helpers</summary>

```diff
@@
-// src/models/EventItem.js
-let __id = 1;
-function makeId(prefix) { return `${prefix}_${__id++}`; }
-
-export class EventItem {
-  constructor(title, dateStr, description = "", capacity = 100) {
-    this.id = makeId("e");
-    this.title = title;
-    this.date = new Date(dateStr);
-    this.description = description;
-    this.capacity = capacity;
-    this.rsvps = new Set();
-  }
-  toggleRsvp(memberId) {
-    if (this.rsvps.has(memberId)) this.rsvps.delete(memberId);
-    else if (this.rsvps.size < this.capacity) this.rsvps.add(memberId);
-  }
-}
+// src/models/EventItem.js
+import { nanoid, dayjs } from '../utils/externals.js';
+
+export class EventItem {
+  constructor(title, dateISO, description = "", capacity = 100) {
+    this.id = nanoid();
+    this.title = title;
+    this.dateISO = dateISO; // "YYYY-MM-DD"
+    this.description = description;
+    this.capacity = capacity;
+    this.rsvps = new Set(); // member IDs
+  }
+
+  get date() { return dayjs(this.dateISO); }
+  get isPast() { return this.date.isBefore(dayjs(), 'day'); }
+  get friendlyWhen() {
+    const fmt = this.date.format('MMM D, YYYY');
+    const rel = this.date.from(dayjs(), true);
+    const suffix = this.isPast ? `${rel} ago` : `in ${rel}`;
+    return `${fmt} (${suffix})`;
+  }
+
+  toggleRsvp(memberId) {
+    if (this.rsvps.has(memberId)) this.rsvps.delete(memberId);
+    else if (this.rsvps.size < this.capacity) this.rsvps.add(memberId);
+  }
+}
```

</details>

<details>
  <summary>Clean copy/paste — EventItem additions</summary>

```js
import { nanoid, dayjs } from '../utils/externals.js';
// inside constructor
this.id = nanoid();
this.dateISO = dateISO;
// getters
get date() { return dayjs(this.dateISO); }
get isPast() { return this.date.isBefore(dayjs(), 'day'); }
get friendlyWhen() {
  const fmt = this.date.format('MMM D, YYYY');
  const rel = this.date.from(dayjs(), true);
  const suffix = this.isPast ? `${rel} ago` : `in ${rel}`;
  return `${fmt} (${suffix})`;
}
```

</details>

#### 4.3) Club gains event APIs

> 📍 Where: `src/models/Club.js` — imports; constructor id; event methods; `fromPlain`. Cmd+F: `class Club`.
>
> ℹ️ What: Use nanoid for club IDs and add `addEvent/removeEvent/sortEvents/upcomingEvents`; extend `fromPlain`.
>
> 💡 Why: Keep event logic close to the data; UI stays simple.
>
> ✅ Check: Seeds load with events; `club.events` sorted by date.

<details open>
  <summary>Diff — src/models/Club.js: imports + id + events</summary>

```diff
@@
-// src/models/Club.js
-import { Member } from './Member.js';
-
-let __id = 1;
-function makeId(prefix) { return `${prefix}_${__id++}`; }
-
-export class Club {
-  constructor(name, capacity = 1) {
-    this.id = makeId("c");
-    this.name = name;
-    this.capacity = capacity;
-    this.members = [];
-    this.events = [];
-  }
+// src/models/Club.js
+import { nanoid, dayjs } from '../utils/externals.js';
+import { Member } from './Member.js';
+import { EventItem } from './EventItem.js';
+
+export class Club {
+  constructor(name, capacity = 1) {
+    this.id = nanoid();
+    this.name = name;
+    this.capacity = capacity;
+    this.members = []; // Member[]
+    this.events = [];  // EventItem[]
+  }
@@
-  // Migration helper from plain objects
-  static fromPlain(obj) {
-    const c = new Club(obj.name, obj.capacity);
-    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
-    return c;
-  }
+  // ---- Events ----
+  addEvent({ title, dateISO, description = "", capacity = 100 }) {
+    const d = dayjs(dateISO);
+    if (!d.isValid()) return { ok: false, reason: 'invalid-date' };
+    const evt = new EventItem(title, dateISO, description, capacity);
+    this.events.push(evt);
+    this.sortEvents();
+    return { ok: true, event: evt };
+  }
+
+  removeEvent(eventId) {
+    const i = this.events.findIndex(e => e.id === eventId);
+    if (i >= 0) { this.events.splice(i, 1); return true; }
+    return false;
+  }
+
+  sortEvents() { this.events.sort((a, b) => a.date.valueOf() - b.date.valueOf()); }
+  upcomingEvents() { return this.events.filter(e => !e.isPast).sort((a,b) => a.date.valueOf() - b.date.valueOf()); }
+
+  // Migration helper from plain objects
+  static fromPlain(obj) {
+    const c = new Club(obj.name, obj.capacity);
+    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
+    (obj.events || []).forEach(e => c.addEvent({ title: e.title, dateISO: e.dateISO, description: e.description || '', capacity: e.capacity || 100 }));
+    return c;
+  }
```

</details>

<details>
  <summary>Clean copy/paste — Club event APIs</summary>

```js
addEvent({ title, dateISO, description = "", capacity = 100 }) {
  const d = dayjs(dateISO);
  if (!d.isValid()) return { ok: false, reason: 'invalid-date' };
  const evt = new EventItem(title, dateISO, description, capacity);
  this.events.push(evt);
  this.sortEvents();
  return { ok: true, event: evt };
}
removeEvent(eventId) {
  const i = this.events.findIndex(e => e.id === eventId);
  if (i >= 0) { this.events.splice(i, 1); return true; }
  return false;
}
sortEvents() { this.events.sort((a, b) => a.date.valueOf() - b.date.valueOf()); }
upcomingEvents() { return this.events.filter(e => !e.isPast).sort((a,b) => a.date.valueOf() - b.date.valueOf()); }
```

</details>

<br><br>

### 5) store — seed events with ISO dates

> 📍 Where: `src/store/data.js` — replace the clubs array. Cmd+F: `export let clubs = [`.
>
> ℹ️ What: Add `events: [...]` with `dateISO` fields to some clubs.
>
> 💡 Why: Gives the UI real data to render.
>
> ✅ Check: After rendering, event counts show per club.

<details open>
  <summary>Diff — src/store/data.js: seed with events</summary>

```diff
@@
-export let clubs = [
-  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
-  Club.fromPlain({ name: "Art Club",    current: 8, capacity: 8 }),
-  Club.fromPlain({ name: "Book Club",   current: 2, capacity: 12 }),
-  Club.fromPlain({ name: "Robotics",    current: 5, capacity: 6 }),
-];
+export let clubs = [
+  Club.fromPlain({
+    name: "Coding Club", current: 3, capacity: 10,
+    events: [
+      { title: "Hack Night", dateISO: "2025-09-10", description: "Bring a project.", capacity: 30 },
+      { title: "Intro to Git", dateISO: "2025-09-03", description: "Hands-on basics." }
+    ]
+  }),
+  Club.fromPlain({
+    name: "Art Club", current: 8, capacity: 8,
+    events: [ { title: "Open Studio", dateISO: "2025-08-30" } ]
+  }),
+  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
+  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
+];
```

</details>

<details>
  <summary>Clean copy/paste — src/store/data.js: seed block</summary>

```js
export let clubs = [
  Club.fromPlain({
    name: "Coding Club",
    current: 3,
    capacity: 10,
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
    current: 8,
    capacity: 8,
    events: [{ title: "Open Studio", dateISO: "2025-08-30" }],
  }),
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];
```

</details>

<br><br>

### 6) render — events section + inline form

> 📍 Where: `src/ui/render.js` — top imports; inside `renderClubs` card template. Cmd+F: `renderClubs` and `member-section`.
>
> ℹ️ What: Import dayjs; add event section with `evt.friendlyWhen` and “Past” badge; include per‑club form (date min = today).
>
> 💡 Why: Shows derived labels and simple date validation.
>
> ✅ Check: Each card shows an Events section; no errors when rendering.

<details open>
  <summary>Diff — src/ui/render.js: import + todayISO</summary>

```diff
@@
-// src/ui/render.js
-// Renders the provided list of clubs. Event handling is in app.js
-export function renderClubs(visibleClubs) {
+// src/ui/render.js
+import { dayjs } from '../utils/externals.js';
+
+// Renders the provided list of clubs. Event handling is in app.js
+export function renderClubs(visibleClubs) {
@@
-    card.innerHTML = `
+    const todayISO = dayjs().format('YYYY-MM-DD');
+    card.innerHTML = `
```

</details>

<details>
  <summary>Clean copy/paste — render.js: import + todayISO</summary>

```js
import { dayjs } from "../utils/externals.js";
// before template inside renderClubs loop
const todayISO = dayjs().format("YYYY-MM-DD");
```

</details>

<br><br>

<details open>
  <summary>Diff — src/ui/render.js: add events section</summary>

```diff
@@
-      </div>
+      </div>
+
+      <div class="event-section">
+        <h4>Events (${club.events.length})</h4>
+        <ul class="event-list">
+          ${club.events.map(evt => {
+            const pastBadge = evt.isPast ? '<span class="badge">Past</span>' : '';
+            return `<li>
+              <strong>${evt.title}</strong> — ${evt.friendlyWhen} ${pastBadge}
+              <button class="link-btn" data-action="remove-event" data-club-id="${club.id}" data-event-id="${evt.id}">Remove</button>
+            </li>`;
+          }).join('') || '<li><em>No events yet</em></li>'}
+        </ul>
+
+        <div class="inline-form">
+          <input id="event-title-${club.id}" type="text" placeholder="Event title" />
+          <input id="event-date-${club.id}" type="date" min="${todayISO}" />
+          <input id="event-capacity-${club.id}" type="number" min="1" placeholder="Capacity" />
+          <input id="event-desc-${club.id}" type="text" placeholder="Optional description" />
+          <button class="btn" data-action="add-event" data-club-id="${club.id}">Add Event</button>
+        </div>
+      </div>
```

</details>

<details>
  <summary>Clean copy/paste — render: events section markup</summary>

```js
import { dayjs } from "../utils/externals.js";
// before template inside renderClubs loop
const todayISO = dayjs().format("YYYY-MM-DD");
// add this block after the member-section
<div class="event-section">
  <h4>Events (${club.events.length})</h4>
  <ul class="event-list">
    $
    {club.events
      .map((evt) => {
        const pastBadge = evt.isPast ? '<span class="badge">Past</span>' : "";
        return `<li>
        <strong>${evt.title}</strong> — ${evt.friendlyWhen} ${pastBadge}
        <button class="link-btn" data-action="remove-event" data-club-id="${club.id}" data-event-id="${evt.id}">Remove</button>
      </li>`;
      })
      .join("") || "<li><em>No events yet</em></li>"}
  </ul>
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
</div>;
```

</details>

<br><br>

### 7) app — wire add/remove event actions

> 📍 Where: `src/app.js` — delegated click handler. Cmd+F: `remove-member`.
>
> ℹ️ What: Handle `add-event` and `remove-event` actions and set a status message.
>
> 💡 Why: Reuse the single listener pattern to keep code simple.
>
> ✅ Check: Adding a valid event shows it immediately; removing hides it; no console errors.

<details open>
  <summary>Diff — src/app.js: add/remove event handlers</summary>

```diff
@@
   if (action === 'remove-member') {
     const memberId = btn.dataset.memberId;
     club.removeMember(memberId);
     paint();
   }
@@
+  // NEW: Events
+  if (action === 'add-event') {
+    const titleEl = document.getElementById(`event-title-${clubId}`);
+    const dateEl  = document.getElementById(`event-date-${clubId}`);
+    const capEl   = document.getElementById(`event-capacity-${clubId}`);
+    const descEl  = document.getElementById(`event-desc-${clubId}`);
+
+    const title = (titleEl?.value || '').trim();
+    const dateISO = (dateEl?.value || '').trim();
+    const cap = parseInt(capEl?.value || '0', 10);
+    const desc = (descEl?.value || '').trim();
+
+    if (!title || !dateISO || isNaN(cap) || cap <= 0) {
+      setStatus(clubId, 'Enter a title, date, and capacity (>0).');
+      return;
+    }
+
+    const added = club.addEvent({ title, dateISO, description: desc, capacity: cap });
+    if (!added.ok) {
+      setStatus(clubId, added.reason === 'invalid-date' ? 'Please pick a valid future date.' : 'Could not add event.');
+      return;
+    }
+
+    setStatus(clubId, 'Event added.');
+    paint();
+  }
+
+  if (action === 'remove-event') {
+    const eventId = btn.dataset.eventId;
+    club.removeEvent(eventId);
+    paint();
+  }
```

</details>

<details>
  <summary>Clean copy/paste — app.js: event handlers</summary>

```js
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
  paint();
}
if (action === "remove-event") {
  const eventId = btn.dataset.eventId;
  club.removeEvent(eventId);
  paint();
}
```

</details>
