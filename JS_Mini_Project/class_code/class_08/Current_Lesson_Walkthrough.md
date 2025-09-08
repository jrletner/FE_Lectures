# Class 8 — ES Modules & Structure: Split by Concern (models/store/ui/utils)

## At a glance

- What you’ll build: Convert the single-file script into ES Modules with a clean `src/` structure and a `type="module"` entry point.
- Files touched: index.html, src/app.js, src/models/_.js, src/store/_.js, src/ui/render.js, src/utils/\*.js
- Est. time: 60–80 min
- Prereqs: Finished Class 7 (debounced search, pipe, and working toolbar)

## How to run

- Use the VS Code Live Server extension (Right‑click `index.html` → "Open with Live Server"). Avoid opening via `file://` so modules load consistently.
- Ensure the `<script>` uses `type="module"` so imports work in the browser.

## How to use

- Paste changes in order. Verify each ✅ Check before moving on. If something diverges, copy the Appendix files to sync.

## Before you start

- Open: `index.html`, and then new files as you create them under `src/`.
- Baseline: Class 7 files in `class_07/` (single-file `app.js`). Class 8 splits code into modules under `src/`.
- Files to diff: `index.html`, and moves from `app.js` → `src/**`.
- Reset: If drift occurs, restore files from previous class and re-apply steps.

## What changed since last class (unified diff)

<details>
  <summary>Diff — index.html: Class 7 → Class 8 title/subtitle and module script</summary>

```diff
@@
-  <title>Campus Club Manager — Class 7</title>
+  <title>Campus Club Manager — Class 8</title>
@@
-    <p>Debounced search + small utility functions</p>
+    <p>ES Modules & cleaner project structure</p>
@@
-  <script src="app.js"></script>
+  <!-- IMPORTANT: type=module to enable ES module imports -->
+  <script type="module" src="src/app.js"></script>
```

</details>

<br><br>

## File tree (current class)

<details open>
  <summary>Directory overview — class_08 (created by this class)</summary>

```text
class_08/
  index.html
  styles.css
  src/
    app.js
    models/
      Member.js
      EventItem.js
      Club.js
    store/
      data.js
      filters.js
    ui/
      render.js
    utils/
      debounce.js
      pipe.js
```

</details>

## Live-coding steps

### 1) Switch the entry script to an ES module

> 📍 Where: Open `index.html`. Update the `<title>` inside `<head>`, the subtitle `<p>` in the `<header>`, and the script tag at the bottom of `<body>`. Use Cmd+F to find `Campus Club Manager — Class` and `</footer>`.
>
> ℹ️ What: Change the page title and subtitle for Class 8 and replace the classic script tag with a module script tag: `type="module" src="src/app.js"`.
>
> 💡 Why: ES Modules require `type="module"` to enable `import`/`export` directly in the browser.
>
> ✅ Check: Reload: no console errors; if modules fail, you’ll see “Failed to load module script”.

#### 1.1 Remove old title

<details open>
  <summary>Diff — index.html: DO NOT PASTE — remove old title</summary>

```diff
@@
-  <title>Campus Club Manager — Class 7</title>
```

</details>

#### 1.2 Add new title

<details open>
  <summary>Diff — index.html: add new title</summary>

```diff
@@
+  <title>Campus Club Manager — Class 8</title>
```

</details>

<details>
  <summary>Clean copy/paste — index.html: title line</summary>

```html
<title>Campus Club Manager — Class 8</title>
```

</details>

#### 1.3 Remove old subtitle

<details open>
  <summary>Diff — index.html: DO NOT PASTE — remove old subtitle</summary>

```diff
@@
-    <p>Debounced search + small utility functions</p>
```

</details>

#### 1.4 Add new subtitle

<details open>
  <summary>Diff — index.html: add new subtitle</summary>

```diff
@@
+    <p>ES Modules & cleaner project structure</p>
```

</details>

<details>
  <summary>Clean copy/paste — index.html: subtitle line</summary>

```html
<p>ES Modules & cleaner project structure</p>
```

</details>

#### 1.5 Remove classic script tag

<details open>
  <summary>Diff — index.html: DO NOT PASTE — remove classic script tag</summary>

```diff
@@
-  <script src="app.js"></script>
```

</details>

#### 1.6 Add module script tag

<details open>
  <summary>Diff — index.html: add module script tag</summary>

```diff
@@
+  <!-- IMPORTANT: type=module to enable ES module imports -->
+  <script type="module" src="src/app.js"></script>
```

</details>

<details>
  <summary>Clean copy/paste — index.html: module script tag</summary>

```html
<!-- IMPORTANT: type=module to enable ES module imports -->
<script type="module" src="src/app.js"></script>
```

</details>

<br><br>

### 2) Create utils: debounce and pipe (move from app.js)

> 📍 Where: Create `src/utils/debounce.js` and `src/utils/pipe.js`. Copy these helpers out of `app.js`.
>
> ℹ️ What: Move `debounce` and `pipe` from `app.js` into utility modules and export them.
>
> 💡 Why: Small helpers belong in focused files and keep `app.js` lean.
>
> ✅ Check: After 2.5, reload: no console errors; typing in the search input still debounces.

#### 2.0 Remove from app.js — debounce

<details open>
  <summary>Diff — app.js (Class 7): DO NOT PASTE — remove debounce helper</summary>

```diff
@@
-/**
- * debounce: returns a function that delays calling `fn`
- * until there has been no new call for `delay` ms.
- */
-function debounce(fn, delay = 250) {
-  let timer = null;
-  return (...args) => {
-    clearTimeout(timer);
-    timer = setTimeout(() => fn(...args), delay);
-  };
-}
```

</details>

#### 2.1 Paste Preview — src/utils/debounce.js (Info only — DO NOT PASTE)

<details open>
  <summary>File tree — create src/utils/debounce.js</summary>

```text
# Create debounce.js under src/utils
class_08/
  src/
    utils/
      debounce.js
```

</details>

<details open>
  <summary>Paste Preview — src/utils/debounce.js (Info only — DO NOT PASTE)</summary>

```js
// Pasted code from app.js
// Into a new file src/utils/debounce.js
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
```

</details>

#### 2.2 Update after paste — src/utils/debounce.js

<details open>
  <summary>Diff — src/utils/debounce.js: export the function</summary>

```diff
@@
-function debounce(fn, delay = 250) {
+export function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

</details>

<details>
  <summary>Clean copy/paste — src/utils/debounce.js: export function</summary>

```js
export function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

</details>

<details>
  <summary>Clean copy/paste — Final after update: src/utils/debounce.js</summary>

```js
export function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

</details>

<br><br>

#### 2.3 Remove from app.js — pipe

<details open>
  <summary>Diff — app.js (Class 7): DO NOT PASTE — remove pipe helper</summary>

```diff
@@
-/**
- * pipe: compose functions left-to-right. pipe(f,g,h)(x) = h(g(f(x)))
- */
-function pipe(...fns) {
-  return (input) => fns.reduce((val, fn) => fn(val), input);
-}
```

</details>

#### 2.4 Paste Preview — src/utils/pipe.js (Info only — DO NOT PASTE)

<details open>
  <summary>File tree — create src/utils/pipe.js</summary>

```text
# Create pipe.js under src/utils
class_08/
  src/
    utils/
      pipe.js
```

</details>

<details open>
  <summary>Paste Preview — src/utils/pipe.js (Info only — DO NOT PASTE)</summary>

```js
// Pasted code from app.js
// Into a new file src/utils/pipe.js
/**
 * pipe: compose functions left-to-right. pipe(f,g,h)(x) = h(g(f(x)))
 */
function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
}
```

</details>

#### 2.5 Update after paste — src/utils/pipe.js

<details open>
  <summary>Diff — src/utils/pipe.js: export the function</summary>

```diff
@@
-function pipe(...fns) {
+export function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
}
```

</details>

<details>
  <summary>Clean copy/paste — Final after update: src/utils/pipe.js</summary>

```js
export function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
}
```

</details>

<br><br>

### 3) Create model classes (move from app.js)

> 📍 Where: Create `src/models/Member.js`, `src/models/EventItem.js`, and `src/models/Club.js`. Copy each class from `app.js` into its own file and export it. Club will also import `Member` and reference `EventItem`.
>
> ℹ️ What: Move data model classes out of `app.js` into their own modules. For each, we add minimal exports and a local ID helper so they work independently.
>
> 💡 Why: Keeping each model in its own file makes responsibilities clear and enables reuse/testing.
>
> ✅ Check: After 3.8, importing the models from store compiles without errors.

#### 3.0 Remove from app.js — Member

<details open>
  <summary>Diff — app.js (Class 7): DO NOT PASTE — remove Member model</summary>

```diff
@@
-class Member {
-  constructor(name, role = "member") {
-    this.id = makeId("m");
-    this.name = name;
-    this.role = role;
-  }
-}
```

</details>

#### 3.1 Paste Preview — src/models/Member.js (Info only — DO NOT PASTE)

<details open>
  <summary>File tree — create src/models/Member.js</summary>

```text
# Create Member.js under src/models
class_08/
  src/
    models/
      Member.js
```

</details>

<details open>
  <summary>Paste Preview — src/models/Member.js (Info only — DO NOT PASTE)</summary>

```js
// Pasted code from app.js
// Into a new file src/models/Member.js
class Member {
  constructor(name, role = "member") {
    this.id = makeId("m");
    this.name = name;
    this.role = role;
  }
}
```

</details>

#### 3.2 Update after paste — src/models/Member.js

<details open>
  <summary>Diff — src/models/Member.js: add local ID helper and export class</summary>

```diff
@@
-class Member {
+let __id = 1;
+function makeId(prefix) { return `${prefix}_${__id++}`; }
+
+export class Member {
  constructor(name, role = "member") {
    this.id = makeId("m");
    this.name = name;
    this.role = role;
  }
}
```

</details>

<details>
  <summary>Clean copy/paste — src/models/Member.js: add local ID helper</summary>

```js
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}
```

</details>

<details>
  <summary>Clean copy/paste — src/models/Member.js: export class</summary>

```js
export class Member {
  constructor(name, role = "member") {
    this.id = makeId("m");
    this.name = name;
    this.role = role;
  }
}
```

</details>

<details>
  <summary>Clean copy/paste — Final after update: src/models/Member.js</summary>

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

</details>

#### 3.3 Remove from app.js — EventItem

<details open>
  <summary>Diff — app.js (Class 7): DO NOT PASTE — remove EventItem model</summary>

```diff
@@
-class EventItem {
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
```

</details>

#### 3.4 Paste Preview — src/models/EventItem.js (Info only — DO NOT PASTE)

<details open>
  <summary>File tree — create src/models/EventItem.js</summary>

```text
# Create EventItem.js under src/models
class_08/
  src/
    models/
      EventItem.js
```

</details>

<details open>
  <summary>Paste Preview — src/models/EventItem.js (Info only — DO NOT PASTE)</summary>

```js
// Pasted code from app.js
// Into a new file src/models/EventItem.js
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
```

</details>

#### 3.5 Update after paste — src/models/EventItem.js

<details open>
  <summary>Diff — src/models/EventItem.js: add local ID helper and export class</summary>

```diff
@@
-class EventItem {
+let __id = 1;
+function makeId(prefix) { return `${prefix}_${__id++}`; }
+
+export class EventItem {
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

</details>

<details>
  <summary>Clean copy/paste — src/models/EventItem.js: add local ID helper</summary>

```js
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}
```

</details>

<details>
  <summary>Clean copy/paste — src/models/EventItem.js: export class</summary>

```js
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

</details>

<details>
  <summary>Clean copy/paste — Final after update: src/models/EventItem.js</summary>

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

</details>

<br><br>

#### 3.6 Remove from app.js — Club

<details open>
  <summary>Diff — app.js (Class 7): DO NOT PASTE — remove Club model</summary>

```diff
@@
-class Club {
-  constructor(name, capacity = 1) {
-    this.id = makeId("c");
-    this.name = name;
-    this.capacity = capacity;
-    this.members = [];
-    this.events = [];
-  }
-  get current() { return this.members.length; }
-  get seatsLeft() { return Math.max(0, this.capacity - this.current); }
-  get percentFull() { return this.capacity > 0 ? Math.round((this.current / this.capacity) * 100) : 0; }
-
-  addMember(name, role = "member") {
-    if (!name || typeof name !== "string") return { ok: false, reason: "invalid-name" };
-    if (this.seatsLeft <= 0) return { ok: false, reason: "full" };
-    if (this.members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
-      return { ok: false, reason: "duplicate" };
-    }
-    const m = new Member(name, role);
-    this.members.push(m);
-    return { ok: true, member: m };
-  }
-
-  removeMember(memberId) {
-    const i = this.members.findIndex(m => m.id === memberId);
-    if (i >= 0) { this.members.splice(i, 1); return true; }
-    return false;
-  }
-
-  addEvent(evt) { if (evt instanceof EventItem) this.events.push(evt); }
-
-  upcomingEvents() {
-    const now = new Date();
-    return this.events.filter(e => e.date >= now).sort((a, b) => a.date - b.date);
-  }
-
-  static fromPlain(obj) {
-    const c = new Club(obj.name, obj.capacity);
-    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
-    return c;
-  }
-}
```

</details>

#### 3.7 Paste Preview — src/models/Club.js (Info only — DO NOT PASTE)

<details open>
  <summary>File tree — create src/models/Club.js</summary>

```text
# Create Club.js under src/models
class_08/
  src/
    models/
      Club.js
```

</details>

<details open>
  <summary>Paste Preview — src/models/Club.js (Info only — DO NOT PASTE)</summary>

```js
// Pasted code from app.js
// Into a new file src/models/Club.js
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
```

</details>

#### 3.8 Update after paste — src/models/Club.js

> 📍 Where: `src/models/Club.js`. Cmd+F: `class Club` and `static fromPlain`.
>
> ℹ️ What: Add a local ID helper, import `Member` and `EventItem`, and export the class.
>
> 💡 Why: The class becomes importable across the app and works standalone.
>
> ✅ Check: After 3.8, you can `import { Club } from "../models/Club.js"` without errors.

<details open>
  <summary>Diff — src/models/Club.js: add local ID helper, import Member/EventItem, export class</summary>

```diff
@@
+let __id = 1;
+function makeId(prefix) { return `${prefix}_${__id++}`; }
+import { Member } from "./Member.js";
+import { EventItem } from "./EventItem.js";
@@
-class Club {
+export class Club {
  constructor(name, capacity = 1) {
    this.id = makeId("c");
    this.name = name;
    this.capacity = capacity;
    this.members = [];
    this.events = [];
  }
```

</details>

<details>
  <summary>Clean copy/paste — src/models/Club.js: add local ID helper</summary>

```js
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}
```

</details>

<details>
  <summary>Clean copy/paste — src/models/Club.js: import Member</summary>

```js
import { Member } from "./Member.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/models/Club.js: import EventItem</summary>

```js
import { EventItem } from "./EventItem.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/models/Club.js: export class</summary>

```js
export class Club {
  // existing body remains
}
```

</details>

<details>
  <summary>Clean copy/paste — Final after update: src/models/Club.js</summary>

```js
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}
import { Member } from "./Member.js";
import { EventItem } from "./EventItem.js";

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

### 4) Move state and derived list to store

> 📍 Where: Create `src/store/data.js` and `src/store/filters.js`. Move the seed `clubs` array and helpers into `data.js`, and the UI state + transforms into `filters.js`.
>
> ℹ️ What: Pull application state and derived logic out of `app.js`.
>
> 💡 Why: Separating state from rendering/events keeps modules focused.
>
> ✅ Check: After 4.5, `clubs.length` logs in console; search/toggle still work.

#### 4.0 Remove from app.js — seed data and helpers

<details open>
  <summary>Diff — app.js (Class 7): DO NOT PASTE — remove clubs + helpers</summary>

```diff
@@
-// ---- App State ----
-let clubs = [
-  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
-  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }),   // full
-  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
-  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
-];
```

</details>

#### 4.1 Paste Preview — src/store/data.js (Info only — DO NOT PASTE)

<details open>
  <summary>File tree — create src/store/data.js</summary>

```text
# Create data.js under src/store
class_08/
  src/
    store/
      data.js
```

</details>

<details open>
  <summary>Paste Preview — src/store/data.js (Info only — DO NOT PASTE)</summary>

```js
// Pasted code from app.js
// Into a new file src/store/data.js
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }),
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];
```

</details>

#### 4.2 Update after paste — src/store/data.js

<details open>
  <summary>Diff — src/store/data.js: import Club and export state/helpers</summary>

```diff
@@
+import { Club } from "../models/Club.js";
+export let clubs = [
+  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
+  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }),
+  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
+  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
+];
+
+export function addClub(name, capacity) {
+  clubs.push(new Club(name, capacity));
+}
+
+export function findClubById(id) {
+  return clubs.find((c) => c.id === id);
+}
```

</details>

<details>
  <summary>Clean copy/paste — src/store/data.js: import Club</summary>

```js
import { Club } from "../models/Club.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/store/data.js: export clubs array</summary>

```js
export let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }),
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];
```

</details>

<details>
  <summary>Clean copy/paste — src/store/data.js: export addClub</summary>

```js
export function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
}
```

</details>

<details>
  <summary>Clean copy/paste — src/store/data.js: export findClubById</summary>

```js
export function findClubById(id) {
  return clubs.find((c) => c.id === id);
}
```

</details>

<details>
  <summary>Clean copy/paste — Final after update: src/store/data.js</summary>

```js
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

</details>

<br><br>

#### 4.3 Remove from app.js — ui + filters

<details open>
  <summary>Diff — app.js (Class 7): DO NOT PASTE — remove ui/filters pipeline</summary>

```diff
@@
-// UI state (same keys as Class 6)
-const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };
@@
-const applySearch = (list) => {
-  const q = ui.searchText.trim().toLowerCase();
-  if (!q) return list;
-  return list.filter(c => c.name.toLowerCase().includes(q));
-};
-
-const applyOnlyOpen = (list) => {
-  if (!ui.onlyOpen) return list;
-  return list.filter(c => c.seatsLeft > 0);
-};
-
-const applySort = (list) => {
-  const copy = list.slice();
-  copy.sort((a, b) => {
-    switch (ui.sortBy) {
-      case "name-asc": return a.name.localeCompare(b.name);
-      case "name-desc": return b.name.localeCompare(a.name);
-      case "seats-desc": return b.seatsLeft - a.seatsLeft;
-      case "capacity-desc": return b.capacity - a.capacity;
-      default: return 0;
-    }
-  });
-  return copy;
-};
@@
-const getVisibleClubs = pipe(
-  (arr) => arr.slice(), // defensive copy
-  applySearch,
-  applyOnlyOpen,
-  applySort
-);
```

</details>

#### 4.4 Paste Preview — src/store/filters.js (Info only — DO NOT PASTE)

<details open>
  <summary>File tree — create src/store/filters.js</summary>

```text
# Create filters.js under src/store
class_08/
  src/
    store/
      filters.js
```

</details>

<details open>
  <summary>Paste Preview — src/store/filters.js (Info only — DO NOT PASTE)</summary>

```js
// Pasted code from app.js
// Into a new file src/store/filters.js
const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };
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

#### 4.5 Update after paste — src/store/filters.js

<details open>
  <summary>Diff — src/store/filters.js: import pipe and export ui/getVisibleClubs</summary>

```diff
@@
+import { pipe } from "../utils/pipe.js";
@@
-const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };
+export const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };
@@
-const getVisibleClubs = pipe(
+export const getVisibleClubs = pipe(
   (arr) => arr.slice(),
   applySearch,
   applyOnlyOpen,
   applySort
 );
```

</details>

<details>
  <summary>Clean copy/paste — src/store/filters.js: import pipe</summary>

```js
import { pipe } from "../utils/pipe.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/store/filters.js: export ui</summary>

```js
export const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };
```

</details>

<details>
  <summary>Clean copy/paste — src/store/filters.js: export getVisibleClubs</summary>

```js
export const getVisibleClubs = pipe(
  (arr) => arr.slice(),
  applySearch,
  applyOnlyOpen,
  applySort
);
```

</details>

<details>
  <summary>Clean copy/paste — Final after update: src/store/filters.js</summary>

```js
import { pipe } from "../utils/pipe.js";
export const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };
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

</details>

<br><br>

### 5) Extract UI rendering helpers

> 📍 Where: Create `src/ui/render.js`. Copy the rendering helpers from `app.js` and export them. Import store/filters so the function body stays the same as Class 7.
>
> ℹ️ What: Move the DOM-rendering (`renderClubs`) and tiny UI helper (`setStatus`) into `ui/render.js` and export them.
>
> 💡 Why: Keep UI creation separate from events and data management.
>
> ✅ Check: After 5.2, cards render; empty-state message shows for no matches.

#### 5.0 Remove from app.js — render helpers

<details open>
  <summary>Diff — app.js (Class 7): DO NOT PASTE — remove renderClubs and setStatus</summary>

```diff
@@
-function renderClubs() {
-  const container = document.getElementById("club-info");
-  container.innerHTML = "";
-
-  const visible = getVisibleClubs(clubs);
-  if (visible.length === 0) {
-    const p = document.createElement("p");
-    p.textContent = "No clubs match your filters.";
-    container.appendChild(p);
-    return;
-  }
-
-  visible.forEach((club) => {
-    const card = document.createElement("div");
-    card.className = "club-card";
-    card.dataset.clubId = club.id;
-
-    const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
-
-    const membersHtml = club.members.map(m => `
-      <li>${m.name}
-        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">
-          Remove
-        </button>
-      </li>
-    `).join("");
-
-    card.innerHTML = `
-      <div><strong>${club.name}</strong><br>${stats}</div>
-
-      <div class="member-section">
-        <h4>Members (${club.current})</h4>
-        <ul class="member-list">
-          ${membersHtml || "<li><em>No members yet</em></li>"}
-        </ul>
-
-        <div class="inline-form">
-          <input id="member-name-${club.id}" type="text" placeholder="e.g., Jordan" />
-          <button class="btn" data-action="add-member" data-club-id="${club.id}">Add Member</button>
-          <span id="status-${club.id}" class="note"></span>
-        </div>
-      </div>
-    `;
-
-    container.appendChild(card);
-  });
-}
-
-function setStatus(clubId, message) {
-  const el = document.getElementById(`status-${clubId}`);
-  if (el) el.textContent = message;
-}
```

</details>

#### 5.1 Paste Preview — src/ui/render.js (Info only — DO NOT PASTE)

<details open>
  <summary>File tree — create src/ui/render.js</summary>

```text
# Create render.js under src/ui
class_08/
  src/
    ui/
      render.js
```

</details>

<details open>
  <summary>Paste Preview — src/ui/render.js (Info only — DO NOT PASTE)</summary>

```js
// Pasted code from app.js
// Into a new file src/ui/render.js
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
    // (innerHTML omitted for brevity; identical to Class 7)
    container.appendChild(card);
  });
}

function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
```

</details>

#### 5.2 Update after paste — src/ui/render.js

<details open>
  <summary>Diff — src/ui/render.js: import store/filters and export the helpers</summary>

```diff
@@
+import { clubs } from "../store/data.js";
+import { getVisibleClubs } from "../store/filters.js";
@@
-function renderClubs() {
+export function renderClubs() {
@@
-function setStatus(clubId, message) {
+export function setStatus(clubId, message) {
```

</details>

<details>
  <summary>Clean copy/paste — src/ui/render.js: import clubs</summary>

```js
import { clubs } from "../store/data.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/ui/render.js: import getVisibleClubs</summary>

```js
import { getVisibleClubs } from "../store/filters.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/ui/render.js: export renderClubs</summary>

```js
export function renderClubs() {
```

</details>

<details>
  <summary>Clean copy/paste — src/ui/render.js: export setStatus</summary>

```js
export function setStatus(clubId, message) {
```

</details>

<details>
  <summary>Clean copy/paste — Final after update: src/ui/render.js</summary>

```js
import { clubs } from "../store/data.js";
import { getVisibleClubs } from "../store/filters.js";

export function renderClubs() {
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

export function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
```

</details>

<br><br>

### 6) app.js — import modules and wire events

> 📍 Where: Create `src/app.js`. At the top, import from store (`data.js`), filters (`filters.js`), UI (`render.js`), and utils (`debounce.js`). At the bottom, wire the same listeners from Class 7.
>
> ℹ️ What: Coordinate modules and keep `app.js` small: imports, event handlers, initial paint.
>
> 💡 Why: `app.js` orchestrates modules; each module does one job.
>
> ✅ Check: Reload; list renders; search/sort/toggle work; no console errors.

<details open>
  <summary>File tree — create src/app.js</summary>

```text
# Create app.js under src
class_08/
  src/
    app.js
```

</details>

<details open>
  <summary>Paste Preview — src/app.js (Info only — DO NOT PASTE)</summary>

```js
// Pasted coordination from Class 7 (adjusted to imports)
```

</details>

<details open>
  <summary>Diff — src/app.js: import modules and wire paint()</summary>

```diff
@@
+// src/app.js
+import { clubs, addClub, findClubById } from "./store/data.js";
+import { ui } from "./store/filters.js";
+import { renderClubs, setStatus } from "./ui/render.js";
+import { debounce } from "./utils/debounce.js";
+
+function paint() { renderClubs(); }
+
+// Debounced search
+const onSearchInput = debounce((value) => {
+  ui.searchText = value;
+  paint();
+}, 300);
+document.getElementById("search")?.addEventListener("input", (e) => {
+  onSearchInput(e.target.value);
+});
+
+// Filter/sort wiring
+document.getElementById("only-open")?.addEventListener("change", (e) => {
+  ui.onlyOpen = !!e.target.checked;
+  paint();
+});
+document.getElementById("sort-by")?.addEventListener("change", (e) => {
+  ui.sortBy = e.target.value;
+  paint();
+});
+
+// Delegated clicks in club cards
+document.getElementById("club-info")?.addEventListener("click", (e) => {
+  const btn = e.target.closest("[data-action]");
+  if (!btn) return;
+  const action = btn.dataset.action;
+  const clubId = btn.dataset.clubId;
+  const club = findClubById(clubId);
+  if (!club) return;
+
+  if (action === "add-member") {
+    const input = document.getElementById(`member-name-${clubId}`);
+    const name = (input?.value || "").trim();
+    if (name === "") { setStatus(clubId, "Please enter a member name."); return; }
+    const result = club.addMember(name);
+    if (!result.ok) {
+      const msg = result.reason === "full" ? "Club is at capacity."
+        : result.reason === "duplicate" ? "Member name already exists."
+        : "Invalid member name.";
+      setStatus(clubId, msg);
+      return;
+    }
+    setStatus(clubId, "Member added.");
+    paint();
+  }
+
+  if (action === "remove-member") {
+    const memberId = btn.dataset.memberId;
+    club.removeMember(memberId);
+    paint();
+  }
+});
+
+// Create Club form
+document.getElementById("club-form")?.addEventListener("submit", (e) => {
+  e.preventDefault();
+  const nameInput = document.getElementById("club-name");
+  const capacityInput = document.getElementById("club-capacity");
+  const errorMessage = document.getElementById("error-message");
+
+  const name = nameInput.value.trim();
+  const capacity = parseInt(capacityInput.value, 10);
+
+  if (name === "" || isNaN(capacity) || capacity <= 0) {
+    errorMessage.textContent = "Please enter a valid club name and capacity (min 1).";
+    return;
+  }
+  const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
+  if (exists) {
+    errorMessage.textContent = "A club with this name already exists.";
+    return;
+  }
+  errorMessage.textContent = "";
+  addClub(name, capacity);
+  paint();
+  nameInput.value = "";
+  capacityInput.value = "";
+  nameInput.focus();
+});
+
+// Footer year & initial paint
+document.getElementById("year")?.textContent = new Date().getFullYear();
+paint();
```

</details>

<details>
  <summary>Clean copy/paste — Final after update: src/app.js</summary>

```js
// src/app.js
import { clubs, addClub, findClubById } from "./store/data.js";
import { ui } from "./store/filters.js";
import { renderClubs, setStatus } from "./ui/render.js";
import { debounce } from "./utils/debounce.js";

function paint() { renderClubs(); }

const onSearchInput = debounce((value) => {
  ui.searchText = value;
  paint();
}, 300);

document.getElementById("search")?.addEventListener("input", (e) => {
  onSearchInput(e.target.value);
});

document.getElementById("only-open")?.addEventListener("change", (e) => {
  ui.onlyOpen = !!e.target.checked;
  paint();
});
document.getElementById("sort-by")?.addEventListener("change", (e) => {
  ui.sortBy = e.target.value;
  paint();
});

document.getElementById("club-info")?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = findClubById(clubId);
  if (!club) return;

  if (action === "add-member") {
    const input = document.getElementById(`member-name-${clubId}`);
    const name = (input?.value || "").trim();
    if (name === "") { setStatus(clubId, "Please enter a member name."); return; }
    const result = club.addMember(name);
    if (!result.ok) {
      const msg = result.reason === "full" ? "Club is at capacity."
        : result.reason === "duplicate" ? "Member name already exists."
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

document.getElementById("club-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent = "Please enter a valid club name and capacity (min 1).";
    return;
  }
  const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
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

document.getElementById("year")?.textContent = new Date().getFullYear();
paint();
```

</details>

<br><br>

## Troubleshooting

- “Failed to load module script”: Ensure `type="module"` and that you’re serving via Live Server (not `file://`).
- `Cannot use import statement outside a module`: Same as above; double‑check the script tag.
- Import path typos: Use `./` and exact case; browser ESM is case‑sensitive.
- Blank page: Open DevTools → Console to spot the first error; fix from the top of the stack.

## Appendix — Full Source After This Class

<details>
  <summary>Full source — index.html</summary>

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

    <!-- IMPORTANT: type=module to enable ES module imports -->
    <script type="module" src="src/app.js"></script>
  </body>
</html>
```

</details>

<details>
  <summary>Full source — src/utils/debounce.js</summary>

```js
export function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

</details>

<details>
  <summary>Full source — src/utils/pipe.js</summary>

```js
export function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
}
```

</details>

<details>
  <summary>Full source — src/models/Member.js</summary>

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

</details>

<details>
  <summary>Full source — src/models/EventItem.js</summary>

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

</details>

<details>
  <summary>Full source — src/models/Club.js</summary>

```js
import { Member } from "./Member.js";
import { EventItem } from "./EventItem.js";
let __cid = 1;
function makeClubId(prefix) {
  return `${prefix}_${__cid++}`;
}

export class Club {
  constructor(name, capacity = 1) {
    this.id = makeClubId("c");
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

  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
    return c;
  }
}
```

</details>

<details>
  <summary>Full source — src/store/data.js</summary>

```js
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

</details>

<details>
  <summary>Full source — src/store/filters.js</summary>

```js
import { pipe } from "../utils/pipe.js";
export const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };
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

</details>

<details>
  <summary>Full source — src/ui/render.js</summary>

```js
import { clubs } from "../store/data.js";
import { getVisibleClubs } from "../store/filters.js";

export function renderClubs() {
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

export function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
```

</details>

<details>
  <summary>Full source — src/app.js</summary>

```js
// src/app.js
import { clubs, addClub, findClubById } from "./store/data.js";
import { ui } from "./store/filters.js";
import { renderClubs, setStatus } from "./ui/render.js";
import { debounce } from "./utils/debounce.js";

function paint() { renderClubs(); }

const onSearchInput = debounce((value) => {
  ui.searchText = value;
  paint();
}, 300);

document.getElementById("search")?.addEventListener("input", (e) => {
  onSearchInput(e.target.value);
});

document.getElementById("only-open")?.addEventListener("change", (e) => {
  ui.onlyOpen = !!e.target.checked;
  paint();
});
document.getElementById("sort-by")?.addEventListener("change", (e) => {
  ui.sortBy = e.target.value;
  paint();
});

document.getElementById("club-info")?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = findClubById(clubId);
  if (!club) return;

  if (action === "add-member") {
    const input = document.getElementById(`member-name-${clubId}`);
    const name = (input?.value || "").trim();
    if (name === "") { setStatus(clubId, "Please enter a member name."); return; }
    const result = club.addMember(name);
    if (!result.ok) {
      const msg = result.reason === "full" ? "Club is at capacity."
        : result.reason === "duplicate" ? "Member name already exists."
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

document.getElementById("club-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent = "Please enter a valid club name and capacity (min 1).";
    return;
  }
  const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
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

document.getElementById("year")?.textContent = new Date().getFullYear();
paint();
```

</details>
