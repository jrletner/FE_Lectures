# Class 13 — Campus Club Manager in TypeScript (Beginner-friendly rebuild)

> At a glance
>
> - What you’ll build: A minimal TypeScript version of Campus Club Manager with typed models and simple DOM rendering.
> - Files touched: index.html, styles.css, tsconfig.json, package.json, src/\*.ts, data/seed.json
> - Est. time: 45–60 min
> - Prereqs: Finished Class 12 (Async & Fetch)

## How to run

- Use the VS Code Live Server extension: Right‑click `index.html` → "Open with Live Server". Avoid `file://` to ensure `fetch` and module scripts work.
- Build TypeScript first:

```bash
npm install
npm run dev # compiles to dist/ and watches for changes
```

Then reload the Live Server page. For a one‑off build, use `npm run build`.

## How to use

- Instructor: Start the TypeScript watch compiler (`npm run dev`) before live‑coding. Paste the green lines in each Diff, remove the red lines when present, and use the Clean copy/paste snippets for new files.
- Students: Keep the browser open via Live Server. After each step, use the ✅ Check to verify behavior.

## Before you start

- Baseline: Class 12 (`JS_Mini_Project/class_code/class_12/`).
- Target: Class 13 (`Typescript_Project/class_code/class_13/`).
- Open these files side‑by‑side: `index.html`, `styles.css`. We’ll create TypeScript files under `src/` and a data seed.

## What changed since last class (Delta)

<details>
  <summary>Diff — index.html: update title/description and script path</summary>

```diff
 <!DOCTYPE html>
 <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
-    <title>Campus Club Manager — Class 12</title>
+    <title>Campus Club Manager — TS Class 13</title>
     <link rel="stylesheet" href="styles.css" />
   </head>
   <body>
     <header>
       <h1>Campus Club Manager</h1>
-      <p>Async & Fetch: load seed from server + simulate save (with loading states)</p>
+      <p>Rebuild in TypeScript (beginner‑level)</p>
     </header>
@@
-  <script type="module" src="src/app.js"></script>
+  <script type="module" src="dist/app.js"></script>
 </body>
 </html>
```

</details>

<details>
  <summary>Diff — styles.css: update top comment</summary>

```diff
-/* Class 12 — Async & Fetch (loading states + simulated server)
-   Beginner-friendly, consistent with earlier classes.
-*/
+/* TS Class 13 — keep styles simple and same as Class 12 */
 * { box-sizing: border-box; }
```

</details>

<details>
  <summary>Note — structural change from Class 12</summary>

- app.js has been split into TypeScript modules: `src/models.ts`, `src/store.ts`, `src/filters.ts`, `src/persist.ts`, `src/router.ts`, `src/ui.ts`, `src/api.ts`, and `src/app.ts`.
- The browser now loads `dist/app.js` (compiled output) instead of `src/app.js`.

</details>

## File tree (current class)

<details open>
  <summary>Tree — Typescript_Project/class_code/class_13</summary>

```text
Typescript_Project/
  class_code/
    class_13/
      index.html
      styles.css
      tsconfig.json
      package.json
      data/
        seed.json
      src/
        models.ts
        store.ts
        filters.ts
        persist.ts
        router.ts
        ui.ts
        api.ts
        app.ts
      dist/
        # built JS appears here after `npm run dev` or `npm run build`
```

</details>

## Live-coding steps

1. Update index.html: TS title, description, and script path

> 📍 Where: `Typescript_Project/class_code/class_13/index.html`, in `<head>` for the title, in `<header>` for the description, and at the bottom for the script tag. Use Cmd+F for `Campus Club Manager` and `script type="module"`.
>
> ℹ️ What: Change the title and header subtitle to mention TypeScript, and point the script at the compiled `dist/app.js` instead of `src/app.js`.
>
> 💡 Why: We now compile TypeScript to JavaScript under `dist/`. The browser loads compiled JS, not `.ts` files.
>
> ✅ Check: Reload with Live Server. The page title updates and no 404 appears in the console for the script.

<details open>
  <summary>Diff — index.html: TS copy + dist script</summary>

```diff
 <title>Campus Club Manager — Class 12</title>
+<!-- change to TS Class 13 -->
+<title>Campus Club Manager — TS Class 13</title>
@@
-  <p>Async & Fetch: load seed from server + simulate save (with loading states)</p>
+  <p>Rebuild in TypeScript (beginner‑level)</p>
@@
-  <script type="module" src="src/app.js"></script>
+  <script type="module" src="dist/app.js"></script>
```

</details>

<details>
  <summary>Clean copy/paste — index.html (1/4): title</summary>

```html
<!-- Replace the existing <title> in <head> with this line -->
<title>Campus Club Manager — TS Class 13</title>
```

</details>

<details>
  <summary>Clean copy/paste — index.html (2/4): header subtitle</summary>

```html
<!-- Replace the subtitle <p> inside <header> with this line -->
<p>Rebuild in TypeScript (beginner‑level)</p>
```

</details>

<details>
  <summary>Clean copy/paste — index.html (3/4): script tag</summary>

```html
<!-- Replace the module script at the bottom with this line -->
<script type="module" src="dist/app.js"></script>
```

</details>

<details>
  <summary>Final after update — index.html (4/4)</summary>

```html
<title>Campus Club Manager — TS Class 13</title>
<p>Rebuild in TypeScript (beginner‑level)</p>
<script type="module" src="dist/app.js"></script>
```

</details>

<br><br>

2. Add TypeScript config (tsconfig.json)

> 📍 Where: `Typescript_Project/class_code/class_13/tsconfig.json`. New file at the project root.
>
> ℹ️ What: Create a minimal TS config targeting ES2020 with DOM libs, output to `dist`.
>
> 💡 Why: Tells the compiler how to emit JS and where. Beginner‑friendly defaults keep things simple.
>
> ✅ Check: Running `npm run dev` shows `Watching for file changes` with no config errors.

<details open>
  <summary>File tree — create tsconfig.json</summary>

```text
class_13/
  tsconfig.json  # new
```

</details>

<details>
  <summary>Clean copy/paste — tsconfig.json</summary>

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2020", "DOM"],
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

</details>

<br><br>

3. Add package.json with scripts

> 📍 Where: `Typescript_Project/class_code/class_13/package.json`. New file.
>
> ℹ️ What: Add `typescript` as a dev dependency and `build`/`dev` scripts.
>
> 💡 Why: Easy commands for one‑off builds and watch mode during live‑coding.
>
> ✅ Check: `npm install` succeeds. `npm run dev` starts the compiler.

<details open>
  <summary>File tree — create package.json</summary>

```text
class_13/
  package.json  # new
```

</details>

<details>
  <summary>Clean copy/paste — package.json</summary>

```json
{
  "name": "ts-class-13",
  "private": true,
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "build": "tsc -p .",
    "dev": "tsc -w -p ."
  },
  "devDependencies": {
    "typescript": "^5.5.4"
  }
}
```

</details>

<br><br>

4. Add starter data (data/seed.json)

> 📍 Where: `Typescript_Project/class_code/class_13/data/seed.json`. New file.
>
> ℹ️ What: Provide a small JSON seed that we fetch on first load.
>
> 💡 Why: Matches Class 12’s behavior while keeping TS code focused on types.
>
> ✅ Check: After Step 12, clicking “Reload from Server” populates clubs.

<details open>
  <summary>File tree — create data/seed.json</summary>

```text
class_13/
  data/
    seed.json  # new
```

</details>

<details>
  <summary>Clean copy/paste — data/seed.json</summary>

```json
[
  {
    "name": "Coding Club",
    "capacity": 10,
    "members": [{ "name": "Ava" }, { "name": "Ben" }, { "name": "Kai" }],
    "events": [
      {
        "title": "Hack Night",
        "dateISO": "2025-09-10",
        "description": "Bring a project.",
        "capacity": 30
      },
      {
        "title": "Intro to Git",
        "dateISO": "2025-09-03",
        "description": "Hands-on basics."
      }
    ]
  },
  {
    "name": "Art Club",
    "capacity": 8,
    "members": [
      { "name": "Riley" },
      { "name": "Sam" },
      { "name": "Noah" },
      { "name": "Maya" },
      { "name": "Ivy" },
      { "name": "Leo" },
      { "name": "Zoe" },
      { "name": "Owen" }
    ],
    "events": [{ "title": "Open Studio", "dateISO": "2025-08-30" }]
  },
  {
    "name": "Book Club",
    "capacity": 12,
    "members": [{ "name": "Elle" }, { "name": "Quinn" }],
    "events": []
  },
  {
    "name": "Robotics",
    "capacity": 6,
    "members": [
      { "name": "Jo" },
      { "name": "Pat" },
      { "name": "Max" },
      { "name": "Ada" },
      { "name": "Ray" }
    ],
    "events": []
  }
]
```

</details>

<br><br>

5. Create typed domain models (src/models.ts)

> 📍 Where: `Typescript_Project/class_code/class_13/src/models.ts`. New file.
>
> ℹ️ What: Define `Member`, `EventItem`, and `Club` with simple types and helpers.
>
> 💡 Why: Centralized types make the rest of the code easier and safer for beginners.
>
> ✅ Check: No TypeScript errors. This file compiles cleanly.

<details open>
  <summary>File tree — create src/models.ts</summary>

```text
class_13/
  src/
    models.ts  # new
```

</details>

<details>
  <summary>Clean copy/paste — src/models.ts (1/10): header and Id type</summary>

```ts
// Paste at the very top of src/models.ts
// Beginner-friendly domain models with simple types
export type Id = string;
```

</details>

<details>
  <summary>Clean copy/paste — src/models.ts (2/10): class Member</summary>

```ts
// Paste below the Id type in src/models.ts
export class Member {
  constructor(
    public name: string,
    public role: "member" | "leader" = "member",
    public id: Id = crypto.randomUUID()
  ) {}
  toPlain() {
    return { id: this.id, name: this.name, role: this.role };
  }
  static fromPlain(obj: { id?: Id; name: string; role?: "member" | "leader" }) {
    return new Member(
      obj.name,
      obj.role ?? "member",
      obj.id ?? crypto.randomUUID()
    );
  }
}
```

</details>

<details>
  <summary>Clean copy/paste — src/models.ts (3/10): class EventItem</summary>

```ts
// Paste below class Member in src/models.ts
export class EventItem {
  public rsvps: Set<Id> = new Set();
  constructor(
    public title: string,
    public dateISO: string,
    public description: string = "",
    public capacity: number = 100,
    public id: Id = crypto.randomUUID()
  ) {}
  get date() {
    return new Date(this.dateISO);
  }
  get isPast() {
    const now = new Date();
    return (
      this.date.getTime() <
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    );
  }
  get friendlyWhen() {
    return this.date.toLocaleDateString();
  }
  toPlain() {
    return {
      id: this.id,
      title: this.title,
      dateISO: this.dateISO,
      description: this.description,
      capacity: this.capacity,
      rsvps: Array.from(this.rsvps),
    };
  }
  static fromPlain(obj: any) {
    const e = new EventItem(
      obj.title,
      obj.dateISO,
      obj.description ?? "",
      obj.capacity ?? 100,
      obj.id ?? crypto.randomUUID()
    );
    e.rsvps = new Set(Array.isArray(obj.rsvps) ? obj.rsvps : []);
    return e;
  }
}
```

</details>

<details>
  <summary>Clean copy/paste — src/models.ts (4/10): class Club — fields/ctor</summary>

```ts
// Paste below class EventItem in src/models.ts
export class Club {
  public members: Member[] = [];
  public events: EventItem[] = [];
  constructor(
    public name: string,
    public capacity: number = 1,
    public id: Id = crypto.randomUUID()
  ) {}
```

</details>

<details>
  <summary>Clean copy/paste — src/models.ts (5/10): class Club — getters</summary>

```ts
// Paste below the Club constructor in src/models.ts
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
```

</details>

<details>
  <summary>Clean copy/paste — src/models.ts (6/10): class Club — member methods</summary>

```ts
// Paste below the Club getters in src/models.ts
  addMember(name: string, role: "member" | "leader" = "member") {
    if (!name.trim())
      return { ok: false as const, reason: "invalid-name" as const };
    if (this.seatsLeft <= 0)
      return { ok: false as const, reason: "full" as const };
    if (this.members.some((m) => m.name.toLowerCase() === name.toLowerCase()))
      return { ok: false as const, reason: "duplicate" as const };
    const m = new Member(name, role);
    this.members.push(m);
    return { ok: true as const, member: m };
  }
  removeMember(memberId: Id) {
    const i = this.members.findIndex((m) => m.id === memberId);
    if (i >= 0) {
      this.members.splice(i, 1);
      return true;
    }
    return false;
  }
```

</details>

<details>
  <summary>Clean copy/paste — src/models.ts (7/10): class Club — event methods</summary>

```ts
// Paste below removeMember() in src/models.ts
  addEvent({
    title,
    dateISO,
    description = "",
    capacity = 100,
  }: {
    title: string;
    dateISO: string;
    description?: string;
    capacity?: number;
  }) {
    const d = new Date(dateISO);
    if (isNaN(d.getTime()))
      return { ok: false as const, reason: "invalid-date" as const };
    const evt = new EventItem(title, dateISO, description, capacity);
    this.events.push(evt);
    this.sortEvents();
    return { ok: true as const, event: evt };
  }
  removeEvent(eventId: Id) {
    const i = this.events.findIndex((e) => e.id === eventId);
    if (i >= 0) {
      this.events.splice(i, 1);
      return true;
    }
    return false;
  }
  sortEvents() {
    this.events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  upcomingEvents() {
    return this.events
      .filter((e) => !e.isPast)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
```

</details>

<details>
  <summary>Clean copy/paste — src/models.ts (8/10): class Club — toPlain()</summary>

```ts
// Paste below upcomingEvents() in src/models.ts
  toPlain() {
    return {
      id: this.id,
      name: this.name,
      capacity: this.capacity,
      members: this.members.map((m) => m.toPlain()),
      events: this.events.map((e) => e.toPlain()),
    };
  }
```

</details>

<details>
  <summary>Clean copy/paste — src/models.ts (9/10): class Club — static fromPlain()</summary>

```ts
// Paste below toPlain() in src/models.ts
  static fromPlain(obj: any) {
    const c = new Club(obj.name, obj.capacity, obj.id ?? crypto.randomUUID());
    (obj.members ?? []).forEach((m: any) =>
      c.members.push(Member.fromPlain(m))
    );
    (obj.events ?? []).forEach((e: any) =>
      c.events.push(EventItem.fromPlain(e))
    );
    if (!obj.members && typeof obj.current === "number") {
      for (let i = 0; i < obj.current; i++) c.addMember(`Member ${i + 1}`);
    }
    c.sortEvents();
    return c;
  }
}
```

</details>

<details>
  <summary>Final after update — src/models.ts (10/10)</summary>

```ts
// Beginner-friendly domain models with simple types
export type Id = string;

export class Member {
  constructor(
    public name: string,
    public role: "member" | "leader" = "member",
    public id: Id = crypto.randomUUID()
  ) {}
  toPlain() {
    return { id: this.id, name: this.name, role: this.role };
  }
  static fromPlain(obj: { id?: Id; name: string; role?: "member" | "leader" }) {
    return new Member(
      obj.name,
      obj.role ?? "member",
      obj.id ?? crypto.randomUUID()
    );
  }
}

export class EventItem {
  public rsvps: Set<Id> = new Set();
  constructor(
    public title: string,
    public dateISO: string,
    public description: string = "",
    public capacity: number = 100,
    public id: Id = crypto.randomUUID()
  ) {}
  get date() {
    return new Date(this.dateISO);
  }
  get isPast() {
    const now = new Date();
    return (
      this.date.getTime() <
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    );
  }
  get friendlyWhen() {
    return this.date.toLocaleDateString();
  }
  toPlain() {
    return {
      id: this.id,
      title: this.title,
      dateISO: this.dateISO,
      description: this.description,
      capacity: this.capacity,
      rsvps: Array.from(this.rsvps),
    };
  }
  static fromPlain(obj: any) {
    const e = new EventItem(
      obj.title,
      obj.dateISO,
      obj.description ?? "",
      obj.capacity ?? 100,
      obj.id ?? crypto.randomUUID()
    );
    e.rsvps = new Set(Array.isArray(obj.rsvps) ? obj.rsvps : []);
    return e;
  }
}

export class Club {
  public members: Member[] = [];
  public events: EventItem[] = [];
  constructor(
    public name: string,
    public capacity: number = 1,
    public id: Id = crypto.randomUUID()
  ) {}

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

  addMember(name: string, role: "member" | "leader" = "member") {
    if (!name.trim())
      return { ok: false as const, reason: "invalid-name" as const };
    if (this.seatsLeft <= 0)
      return { ok: false as const, reason: "full" as const };
    if (this.members.some((m) => m.name.toLowerCase() === name.toLowerCase()))
      return { ok: false as const, reason: "duplicate" as const };
    const m = new Member(name, role);
    this.members.push(m);
    return { ok: true as const, member: m };
  }
  removeMember(memberId: Id) {
    const i = this.members.findIndex((m) => m.id === memberId);
    if (i >= 0) {
      this.members.splice(i, 1);
      return true;
    }
    return false;
  }

  addEvent({
    title,
    dateISO,
    description = "",
    capacity = 100,
  }: {
    title: string;
    dateISO: string;
    description?: string;
    capacity?: number;
  }) {
    const d = new Date(dateISO);
    if (isNaN(d.getTime()))
      return { ok: false as const, reason: "invalid-date" as const };
    const evt = new EventItem(title, dateISO, description, capacity);
    this.events.push(evt);
    this.sortEvents();
    return { ok: true as const, event: evt };
  }
  removeEvent(eventId: Id) {
    const i = this.events.findIndex((e) => e.id === eventId);
    if (i >= 0) {
      this.events.splice(i, 1);
      return true;
    }
    return false;
  }
  sortEvents() {
    this.events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  upcomingEvents() {
    return this.events
      .filter((e) => !e.isPast)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  toPlain() {
    return {
      id: this.id,
      name: this.name,
      capacity: this.capacity,
      members: this.members.map((m) => m.toPlain()),
      events: this.events.map((e) => e.toPlain()),
    };
  }
  static fromPlain(obj: any) {
    const c = new Club(obj.name, obj.capacity, obj.id ?? crypto.randomUUID());
    (obj.members ?? []).forEach((m: any) =>
      c.members.push(Member.fromPlain(m))
    );
    (obj.events ?? []).forEach((e: any) =>
      c.events.push(EventItem.fromPlain(e))
    );
    if (!obj.members && typeof obj.current === "number") {
      for (let i = 0; i < obj.current; i++) c.addMember(`Member ${i + 1}`);
    }
    c.sortEvents();
    return c;
  }
}
```

</details>

<br><br>

6. Add a tiny state store (src/store.ts)

> 📍 Where: `Typescript_Project/class_code/class_13/src/store.ts`. New file.
>
> ℹ️ What: Keep a shared `clubs` array and helpers to set/add/find and to serialize.
>
> 💡 Why: Central place for state makes rendering straightforward.
>
> ✅ Check: No TS errors; imports resolve in later steps.

<details open>
  <summary>File tree — create src/store.ts</summary>

```text
class_13/
  src/
    store.ts  # new
```

</details>

<details>
  <summary>Clean copy/paste — src/store.ts (1/7): import</summary>

```ts
// Paste at the very top of src/store.ts
import { Club } from "./models.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/store.ts (2/7): declare clubs array</summary>

```ts
// Paste directly below the import in src/store.ts
export let clubs: Club[] = [];
```

</details>

<details>
  <summary>Clean copy/paste — src/store.ts (3/7): function setClubs</summary>

```ts
// Paste below the clubs declaration in src/store.ts
export function setClubs(plainArray: any[]) {
  clubs.splice(0, clubs.length, ...plainArray.map(Club.fromPlain));
}
```

</details>

<details>
  <summary>Clean copy/paste — src/store.ts (4/7): function addClub</summary>

```ts
// Paste below setClubs() in src/store.ts
export function addClub(name: string, capacity: number) {
  clubs.push(new Club(name, capacity));
}
```

</details>

<details>
  <summary>Clean copy/paste — src/store.ts (5/7): function findClubById</summary>

```ts
// Paste below addClub() in src/store.ts
export function findClubById(id: string) {
  return clubs.find((c) => c.id === id);
}
```

</details>

<details>
  <summary>Clean copy/paste — src/store.ts (6/7): function toPlainArray</summary>

```ts
// Paste below findClubById() in src/store.ts
export function toPlainArray(currentClubs: Club[]) {
  return currentClubs.map((c) => c.toPlain());
}
```

</details>

<details>
  <summary>Final after update — src/store.ts (7/7)</summary>

```ts
import { Club } from "./models.js";

export let clubs: Club[] = [];

export function setClubs(plainArray: any[]) {
  clubs.splice(0, clubs.length, ...plainArray.map(Club.fromPlain));
}

export function addClub(name: string, capacity: number) {
  clubs.push(new Club(name, capacity));
}

export function findClubById(id: string) {
  return clubs.find((c) => c.id === id);
}

export function toPlainArray(currentClubs: Club[]) {
  return currentClubs.map((c) => c.toPlain());
}
```

</details>

<br><br>

7. UI filters and sorting (src/filters.ts)

> 📍 Where: `Typescript_Project/class_code/class_13/src/filters.ts`. New file.
>
> ℹ️ What: Simple `ui` state and `getVisibleClubs` applying search, “only open,” and sort modes.
>
> 💡 Why: Keeps `app.ts` small and beginner‑friendly.
>
> ✅ Check: No TS errors.

<details open>
  <summary>File tree — create src/filters.ts</summary>

```text
class_13/
  src/
    filters.ts  # new
```

</details>

<details>
  <summary>Clean copy/paste — src/filters.ts (1/4): import</summary>

```ts
// Paste at the very top of src/filters.ts
import type { Club } from "./models.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/filters.ts (2/4): ui state</summary>

```ts
// Paste below the import in src/filters.ts
export const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc" as
    | "name-asc"
    | "name-desc"
    | "seats-desc"
    | "capacity-desc",
};
```

</details>

<details>
  <summary>Clean copy/paste — src/filters.ts (3/4): getVisibleClubs()</summary>

```ts
// Paste below ui in src/filters.ts
export function getVisibleClubs(all: Club[]): Club[] {
  let list = all.slice();
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
    }
  });
  return list;
}
```

</details>

<details>
  <summary>Final after update — src/filters.ts (4/4)</summary>

```ts
import type { Club } from "./models.js";

export const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc" as
    | "name-asc"
    | "name-desc"
    | "seats-desc"
    | "capacity-desc",
};

export function getVisibleClubs(all: Club[]): Club[] {
  let list = all.slice();
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
    }
  });
  return list;
}
```

</details>

<br><br>

8. localStorage persistence (src/persist.ts)

> 📍 Where: `Typescript_Project/class_code/class_13/src/persist.ts`. New file.
>
> ℹ️ What: Save/load/clear JSON in localStorage with small guards.
>
> 💡 Why: Keep state between page loads.
>
> ✅ Check: No TS errors.

<details open>
  <summary>File tree — create src/persist.ts</summary>

```text
class_13/
  src/
    persist.ts  # new
```

</details>

<details>
  <summary>Clean copy/paste — src/persist.ts (1/6): key</summary>

```ts
// Paste at the very top of src/persist.ts
const STORAGE_KEY = "ccm:v1";
```

</details>

<details>
  <summary>Clean copy/paste — src/persist.ts (2/6): saveState()</summary>

```ts
// Paste below STORAGE_KEY in src/persist.ts
export function saveState(clubs: any[]) {
  try {
    const plain = clubs.map((c) =>
      typeof (c as any).toPlain === "function" ? (c as any).toPlain() : c
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  } catch (e) {
    console.error("Failed to save:", e);
  }
}
```

</details>

<details>
  <summary>Clean copy/paste — src/persist.ts (3/6): loadStateRaw()</summary>

```ts
// Paste below saveState() in src/persist.ts
export function loadStateRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
```

</details>

<details>
  <summary>Clean copy/paste — src/persist.ts (4/6): loadState()</summary>

```ts
// Paste below loadStateRaw() in src/persist.ts
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
```

</details>

<details>
  <summary>Clean copy/paste — src/persist.ts (5/6): clearState()</summary>

```ts
// Paste below loadState() in src/persist.ts
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear state:", e);
  }
}
```

</details>

<details>
  <summary>Final after update — src/persist.ts (6/6)</summary>

```ts
const STORAGE_KEY = "ccm:v1";
export function saveState(clubs: any[]) {
  try {
    const plain = clubs.map((c) =>
      typeof (c as any).toPlain === "function" ? (c as any).toPlain() : c
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  } catch (e) {
    console.error("Failed to save:", e);
  }
}
export function loadStateRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY);
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

</details>

<br><br>

9. Simple hash router (src/router.ts)

> 📍 Where: `Typescript_Project/class_code/class_13/src/router.ts`. New file.
>
> ℹ️ What: Parse `#/` and `#/club/:id` with helpers to navigate.
>
> 💡 Why: Mirrors JS classes but keeps typing minimal.
>
> ✅ Check: Clicking a club name changes the hash.

<details open>
  <summary>File tree — create src/router.ts</summary>

```text
class_13/
  src/
    router.ts  # new
```

</details>

<details>
  <summary>Clean copy/paste — src/router.ts (1/5): type Route</summary>

```ts
// Paste at the very top of src/router.ts
export type Route = { view: "home" } | { view: "club"; id: string };
```

</details>

<details>
  <summary>Clean copy/paste — src/router.ts (2/5): parseHash()</summary>

```ts
// Paste below the Route type in src/router.ts
export function parseHash(): Route {
  const raw = window.location.hash || "#/";
  const h = raw.startsWith("#") ? raw.slice(1) : raw;
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 0) return { view: "home" };
  if (parts[0] === "club" && parts[1]) return { view: "club", id: parts[1] };
  return { view: "home" };
}
```

</details>

<details>
  <summary>Clean copy/paste — src/router.ts (3/5): goHome()</summary>

```ts
// Paste below parseHash() in src/router.ts
export function goHome() {
  window.location.hash = "#/";
}
```

</details>

<details>
  <summary>Clean copy/paste — src/router.ts (4/5): goClub()</summary>

```ts
// Paste below goHome() in src/router.ts
export function goClub(id: string) {
  window.location.hash = `#/club/${id}`;
}
```

</details>

<details>
  <summary>Final after update — src/router.ts (5/5)</summary>

```ts
export type Route = { view: "home" } | { view: "club"; id: string };
export function parseHash(): Route {
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
export function goClub(id: string) {
  window.location.hash = `#/club/${id}`;
}
```

</details>

<br><br>

10. UI rendering (src/ui.ts)

> 📍 Where: `Typescript_Project/class_code/class_13/src/ui.ts`. New file.
>
> ℹ️ What: Render the home card list and the club detail panel with small inline forms.
>
> 💡 Why: Beginner‑friendly DOM template strings; no libraries.
>
> ✅ Check: After Step 12, the list and detail views appear.

<details open>
  <summary>File tree — create src/ui.ts</summary>

```text
class_13/
  src/
    ui.ts  # new
```

</details>

<details>
  <summary>Clean copy/paste — src/ui.ts (1/5): import</summary>

```ts
// Paste at the very top of src/ui.ts
import type { Club } from "./models.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/ui.ts (2/5): renderClubs()</summary>

```ts
// Paste below the import in src/ui.ts
export function renderClubs(visibleClubs: Club[]) {
  const container = document.getElementById("app-root") as HTMLElement;
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
      </li>
    `
      )
      .join("");
    const todayISO = new Date().toISOString().slice(0, 10);
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
```

</details>

<details>
  <summary>Clean copy/paste — src/ui.ts (3/5): setStatus()</summary>

```ts
// Paste below renderClubs() in src/ui.ts
export function setStatus(clubId: string, message: string) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
```

</details>

<details>
  <summary>Clean copy/paste — src/ui.ts (4/5): renderClubDetail()</summary>

```ts
// Paste below setStatus() in src/ui.ts
export function renderClubDetail(club: Club) {
  const container = document.getElementById("app-root") as HTMLElement;
  container.innerHTML = "";
  (
    document.getElementById("crumb-current") as HTMLElement
  ).textContent = `› ${club.name}`;
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.clubId = club.id;
  const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
  const membersHtml = club.members
    .map(
      (m) => `
    <li>${m.name}
      <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
    </li>
  `
    )
    .join("");
  const eventsHtml = club.events
    .map((evt) => {
      const dateStr = new Date(evt.dateISO).toLocaleDateString();
      const pastBadge = evt.isPast ? '<span class="badge">Past</span>' : "";
      return `<li><strong>${evt.title}</strong> — ${dateStr} ${pastBadge}
      <button class="link-btn" data-action="remove-event" data-club-id="${club.id}" data-event-id="${evt.id}">Remove</button>
    </li>`;
    })
    .join("");
  const todayISO = new Date().toISOString().slice(0, 10);
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

</details>

<details>
  <summary>Final after update — src/ui.ts (5/5)</summary>

```ts
import type { Club } from "./models.js";
export function renderClubs(visibleClubs: Club[]) {
  const container = document.getElementById("app-root") as HTMLElement;
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
      </li>
    `
      )
      .join("");
    const todayISO = new Date().toISOString().slice(0, 10);
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
export function setStatus(clubId: string, message: string) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
export function renderClubDetail(club: Club) {
  const container = document.getElementById("app-root") as HTMLElement;
  container.innerHTML = "";
  (
    document.getElementById("crumb-current") as HTMLElement
  ).textContent = `› ${club.name}`;
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.clubId = club.id;
  const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
  const membersHtml = club.members
    .map(
      (m) => `
    <li>${m.name}
      <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
    </li>
  `
    )
    .join("");
  const eventsHtml = club.events
    .map((evt) => {
      const dateStr = new Date(evt.dateISO).toLocaleDateString();
      const pastBadge = evt.isPast ? '<span class="badge">Past</span>' : "";
      return `<li><strong>${evt.title}</strong> — ${dateStr} ${pastBadge}
      <button class="link-btn" data-action="remove-event" data-club-id="${club.id}" data-event-id="${evt.id}">Remove</button>
    </li>`;
    })
    .join("");
  const todayISO = new Date().toISOString().slice(0, 10);
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

</details>

<br><br>

11. Simulated server API (src/api.ts)

> 📍 Where: `Typescript_Project/class_code/class_13/src/api.ts`. New file.
>
> ℹ️ What: `loadClubsFromServer` reads `data/seed.json` with a small delay; `saveClubsToServer` fakes success/failure.
>
> 💡 Why: Mirrors Class 12’s async lesson without extra libraries.
>
> ✅ Check: After Step 12, “Reload from Server” shows a success status and data loads.

<details open>
  <summary>File tree — create src/api.ts</summary>

```text
class_13/
  src/
    api.ts  # new
```

</details>

<details>
  <summary>Clean copy/paste — src/api.ts (1/4): constants</summary>

```ts
// Paste at the very top of src/api.ts
const SEED_URL = "./data/seed.json";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
```

</details>

<details>
  <summary>Clean copy/paste — src/api.ts (2/4): loadClubsFromServer()</summary>

```ts
// Paste below constants in src/api.ts
export async function loadClubsFromServer() {
  await delay(400);
  const res = await fetch(SEED_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load from server: " + res.status);
  return res.json();
}
```

</details>

<details>
  <summary>Clean copy/paste — src/api.ts (3/4): saveClubsToServer()</summary>

```ts
// Paste below loadClubsFromServer() in src/api.ts
export async function saveClubsToServer(plainArray: unknown) {
  await delay(400);
  if (Math.random() < 0.1)
    throw new Error("Temporary server error. Try again.");
  return {
    ok: true,
    savedAt: new Date().toISOString(),
    count: Array.isArray(plainArray) ? plainArray.length : 0,
  } as const;
}
```

</details>

<details>
  <summary>Final after update — src/api.ts (4/4)</summary>

```ts
const SEED_URL = "./data/seed.json";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
export async function loadClubsFromServer() {
  await delay(400);
  const res = await fetch(SEED_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load from server: " + res.status);
  return res.json();
}
export async function saveClubsToServer(plainArray: unknown) {
  await delay(400);
  if (Math.random() < 0.1)
    throw new Error("Temporary server error. Try again.");
  return {
    ok: true,
    savedAt: new Date().toISOString(),
    count: Array.isArray(plainArray) ? plainArray.length : 0,
  } as const;
}
```

</details>

<br><br>

12. App wiring and events (src/app.ts)

> 📍 Where: `Typescript_Project/class_code/class_13/src/app.ts`. New file.
>
> ℹ️ What: Wire state, filters, rendering, hash routing, forms, import/export, and async actions.
>
> 💡 Why: Puts everything together with minimal TypeScript types.
>
> ✅ Check: Add/remove members/events works, filters work, import/export works, server reload/save shows status.

<details open>
  <summary>File tree — create src/app.ts</summary>

```text
class_13/
  src/
    app.ts  # new
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (1/12): imports</summary>

```ts
// Paste at the very top of src/app.ts
import {
  clubs,
  setClubs,
  addClub,
  findClubById,
  toPlainArray,
} from "./store.js";
import { ui as UIState, getVisibleClubs } from "./filters.js";
import { renderClubs, setStatus, renderClubDetail } from "./ui.js";
import { saveState, clearState, loadState } from "./persist.js";
import { parseHash, goHome } from "./router.js";
import { loadClubsFromServer, saveClubsToServer } from "./api.js";
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (2/12): footer year</summary>

```ts
// Paste below imports in src/app.ts
(document.getElementById("year") as HTMLElement).textContent = String(
  new Date().getFullYear()
);
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (3/12): status helpers</summary>

```ts
// Paste below footer year in src/app.ts
const statusEl = document.getElementById("global-status") as HTMLElement;
function setGlobalStatus(
  msg: string,
  kind: "" | "loading" | "error" | "success" = ""
) {
  statusEl.textContent = msg;
  statusEl.className = "status " + kind;
}
function clearGlobalStatus() {
  setGlobalStatus("");
}
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (4/12): route chrome + paint()</summary>

```ts
// Paste below status helpers in src/app.ts
function setRouteChrome(route: ReturnType<typeof parseHash>) {
  const homeOnly = document.querySelectorAll(".route-only.home");
  homeOnly.forEach((el) =>
    route.view === "home"
      ? el.classList.remove("hidden")
      : el.classList.add("hidden")
  );
  const crumb = document.getElementById("crumb-current") as HTMLElement;
  crumb.textContent = route.view === "home" ? "" : crumb.textContent;
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

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (5/12): bootstrap()</summary>

```ts
// Paste below paint() in src/app.ts
async function bootstrap() {
  const saved = loadState();
  if (!saved) {
    try {
      setGlobalStatus("Loading starter data from server…", "loading");
      const serverClubs = await loadClubsFromServer();
      setClubs(serverClubs as any);
      saveState(clubs as any);
      setGlobalStatus("Loaded from server.", "success");
    } catch (err) {
      console.error(err);
      setGlobalStatus("Server load failed — using built‑in data.", "error");
    } finally {
      setTimeout(clearGlobalStatus, 1000);
    }
  } else {
    setClubs(saved as any);
  }
  paint();
}
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (6/12): click delegation</summary>

```ts
// Paste below bootstrap() in src/app.ts
const appRoot = document.getElementById("app-root") as HTMLElement;
appRoot.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null;
  const btn = target?.closest("[data-action]") as HTMLElement | null;
  if (!btn) return;
  const action = btn.dataset.action as string | undefined;
  const clubId = btn.dataset.clubId as string | undefined;
  const club = clubId ? findClubById(clubId) : undefined;
  if (!club) return;
  if (action === "add-member") {
    const input = document.getElementById(
      `member-name-${clubId}`
    ) as HTMLInputElement | null;
    const name = (input?.value || "").trim();
    if (name === "") {
      setStatus(clubId!, "Please enter a member name.");
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
      setStatus(clubId!, msg);
      return;
    }
    setStatus(clubId!, "Member added.");
    saveState(clubs as any);
    paint();
  }
  if (action === "remove-member") {
    const memberId = btn.dataset.memberId as string | undefined;
    if (!memberId) return;
    club.removeMember(memberId);
    saveState(clubs as any);
    paint();
  }
  if (action === "add-event") {
    const titleEl = document.getElementById(
      `event-title-${clubId}`
    ) as HTMLInputElement | null;
    const dateEl = document.getElementById(
      `event-date-${clubId}`
    ) as HTMLInputElement | null;
    const capEl = document.getElementById(
      `event-capacity-${clubId}`
    ) as HTMLInputElement | null;
    const descEl = document.getElementById(
      `event-desc-${clubId}`
    ) as HTMLInputElement | null;
    const title = (titleEl?.value || "").trim();
    const dateISO = (dateEl?.value || "").trim();
    const cap = parseInt(capEl?.value || "0", 10);
    const desc = (descEl?.value || "").trim();
    if (!title || !dateISO || isNaN(cap) || cap <= 0) {
      setStatus(clubId!, "Enter a title, date, and capacity (>0).");
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
        clubId!,
        added.reason === "invalid-date"
          ? "Please pick a valid date."
          : "Could not add event."
      );
      return;
    }
    setStatus(clubId!, "Event added.");
    saveState(clubs as any);
    paint();
  }
  if (action === "remove-event") {
    const eventId = btn.dataset.eventId as string | undefined;
    if (!eventId) return;
    club.removeEvent(eventId);
    saveState(clubs as any);
    paint();
  }
});
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (7/12): club form submit</summary>

```ts
// Paste below the click delegation in src/app.ts
(document.getElementById("club-form") as HTMLFormElement).addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("club-name") as HTMLInputElement;
    const capacityInput = document.getElementById(
      "club-capacity"
    ) as HTMLInputElement;
    const errorMessage = document.getElementById(
      "error-message"
    ) as HTMLElement;
    const name = nameInput.value.trim();
    const capacity = parseInt(capacityInput.value, 10);
    if (name === "" || isNaN(capacity) || capacity <= 0) {
      errorMessage.textContent =
        "Please enter a valid club name and capacity (min 1).";
      return;
    }
    const exists = clubs.some(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      errorMessage.textContent = "A club with this name already exists.";
      return;
    }
    errorMessage.textContent = "";
    addClub(name, capacity);
    saveState(clubs as any);
    paint();
    nameInput.value = "";
    capacityInput.value = "";
    nameInput.focus();
  }
);
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (8/12): search/filter listeners</summary>

```ts
// Paste below the submit handler in src/app.ts
const onSearchInput = (value: string) => {
  UIState.searchText = value;
  paint();
};
(document.getElementById("search") as HTMLInputElement).addEventListener(
  "input",
  (e) => onSearchInput((e.target as HTMLInputElement).value)
);
(document.getElementById("only-open") as HTMLInputElement).addEventListener(
  "change",
  (e) => {
    UIState.onlyOpen = (e.target as HTMLInputElement).checked;
    paint();
  }
);
(document.getElementById("sort-by") as HTMLSelectElement).addEventListener(
  "change",
  (e) => {
    UIState.sortBy = (e.target as HTMLSelectElement).value as any;
    paint();
  }
);
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (9/12): export/import/reset</summary>

```ts
// Paste below the search/filter listeners in src/app.ts
const exportBtn = document.getElementById("export-json") as HTMLButtonElement;
const importBtn = document.getElementById("import-json") as HTMLButtonElement;
const importFile = document.getElementById("import-file") as HTMLInputElement;
const resetBtn = document.getElementById("reset-data") as HTMLButtonElement;
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
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Invalid JSON format");
    setClubs(parsed);
    saveState(clubs as any);
    paint();
    alert("Import complete!");
  } catch (err: any) {
    console.error(err);
    alert("Import failed: " + (err?.message || String(err)));
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
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (10/12): server reload/save</summary>

```ts
// Paste below export/import/reset in src/app.ts
(
  document.getElementById("reload-server") as HTMLButtonElement
).addEventListener("click", async () => {
  try {
    setGlobalStatus("Loading from server…", "loading");
    const serverClubs = await loadClubsFromServer();
    setClubs(serverClubs as any);
    saveState(clubs as any);
    paint();
    setGlobalStatus("Loaded from server.", "success");
  } catch (err) {
    console.error(err);
    setGlobalStatus("Server load failed. Check console.", "error");
  } finally {
    setTimeout(clearGlobalStatus, 1000);
  }
});
(document.getElementById("save-server") as HTMLButtonElement).addEventListener(
  "click",
  async () => {
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
    } catch (err: any) {
      console.error(err);
      setGlobalStatus(err.message || "Server save failed.", "error");
    } finally {
      setTimeout(clearGlobalStatus, 1200);
    }
  }
);
```

</details>

<details>
  <summary>Clean copy/paste — src/app.ts (11/12): window listeners</summary>

```ts
// Paste at the very bottom of src/app.ts
window.addEventListener("hashchange", paint);
window.addEventListener("load", bootstrap);
```

</details>

<details>
  <summary>Final after update — src/app.ts (12/12)</summary>

```ts
import {
  clubs,
  setClubs,
  addClub,
  findClubById,
  toPlainArray,
} from "./store.js";
import { ui as UIState, getVisibleClubs } from "./filters.js";
import { renderClubs, setStatus, renderClubDetail } from "./ui.js";
import { saveState, clearState, loadState } from "./persist.js";
import { parseHash, goHome } from "./router.js";
import { loadClubsFromServer, saveClubsToServer } from "./api.js";

(document.getElementById("year") as HTMLElement).textContent = String(
  new Date().getFullYear()
);
const statusEl = document.getElementById("global-status") as HTMLElement;
function setGlobalStatus(
  msg: string,
  kind: "" | "loading" | "error" | "success" = ""
) {
  statusEl.textContent = msg;
  statusEl.className = "status " + kind;
}
function clearGlobalStatus() {
  setGlobalStatus("");
}
function setRouteChrome(route: ReturnType<typeof parseHash>) {
  const homeOnly = document.querySelectorAll(".route-only.home");
  homeOnly.forEach((el) =>
    route.view === "home"
      ? el.classList.remove("hidden")
      : el.classList.add("hidden")
  );
  const crumb = document.getElementById("crumb-current") as HTMLElement;
  crumb.textContent = route.view === "home" ? "" : crumb.textContent;
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
async function bootstrap() {
  const saved = loadState();
  if (!saved) {
    try {
      setGlobalStatus("Loading starter data from server…", "loading");
      const serverClubs = await loadClubsFromServer();
      setClubs(serverClubs as any);
      saveState(clubs as any);
      setGlobalStatus("Loaded from server.", "success");
    } catch (err) {
      console.error(err);
      setGlobalStatus("Server load failed — using built‑in data.", "error");
    } finally {
      setTimeout(clearGlobalStatus, 1000);
    }
  } else {
    setClubs(saved as any);
  }
  paint();
}
const appRoot = document.getElementById("app-root") as HTMLElement;
appRoot.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null;
  const btn = target?.closest("[data-action]") as HTMLElement | null;
  if (!btn) return;
  const action = btn.dataset.action as string | undefined;
  const clubId = btn.dataset.clubId as string | undefined;
  const club = clubId ? findClubById(clubId) : undefined;
  if (!club) return;
  if (action === "add-member") {
    const input = document.getElementById(
      `member-name-${clubId}`
    ) as HTMLInputElement | null;
    const name = (input?.value || "").trim();
    if (name === "") {
      setStatus(clubId!, "Please enter a member name.");
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
      setStatus(clubId!, msg);
      return;
    }
    setStatus(clubId!, "Member added.");
    saveState(clubs as any);
    paint();
  }
  if (action === "remove-member") {
    const memberId = btn.dataset.memberId as string | undefined;
    if (!memberId) return;
    club.removeMember(memberId);
    saveState(clubs as any);
    paint();
  }
  if (action === "add-event") {
    const titleEl = document.getElementById(
      `event-title-${clubId}`
    ) as HTMLInputElement | null;
    const dateEl = document.getElementById(
      `event-date-${clubId}`
    ) as HTMLInputElement | null;
    const capEl = document.getElementById(
      `event-capacity-${clubId}`
    ) as HTMLInputElement | null;
    const descEl = document.getElementById(
      `event-desc-${clubId}`
    ) as HTMLInputElement | null;
    const title = (titleEl?.value || "").trim();
    const dateISO = (dateEl?.value || "").trim();
    const cap = parseInt(capEl?.value || "0", 10);
    const desc = (descEl?.value || "").trim();
    if (!title || !dateISO || isNaN(cap) || cap <= 0) {
      setStatus(clubId!, "Enter a title, date, and capacity (>0).");
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
        clubId!,
        added.reason === "invalid-date"
          ? "Please pick a valid date."
          : "Could not add event."
      );
      return;
    }
    setStatus(clubId!, "Event added.");
    saveState(clubs as any);
    paint();
  }
  if (action === "remove-event") {
    const eventId = btn.dataset.eventId as string | undefined;
    if (!eventId) return;
    club.removeEvent(eventId);
    saveState(clubs as any);
    paint();
  }
});
(document.getElementById("club-form") as HTMLFormElement).addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("club-name") as HTMLInputElement;
    const capacityInput = document.getElementById(
      "club-capacity"
    ) as HTMLInputElement;
    const errorMessage = document.getElementById(
      "error-message"
    ) as HTMLElement;
    const name = nameInput.value.trim();
    const capacity = parseInt(capacityInput.value, 10);
    if (name === "" || isNaN(capacity) || capacity <= 0) {
      errorMessage.textContent =
        "Please enter a valid club name and capacity (min 1).";
      return;
    }
    const exists = clubs.some(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      errorMessage.textContent = "A club with this name already exists.";
      return;
    }
    errorMessage.textContent = "";
    addClub(name, capacity);
    saveState(clubs as any);
    paint();
    nameInput.value = "";
    capacityInput.value = "";
    nameInput.focus();
  }
);
const onSearchInput = (value: string) => {
  UIState.searchText = value;
  paint();
};
(document.getElementById("search") as HTMLInputElement).addEventListener(
  "input",
  (e) => onSearchInput((e.target as HTMLInputElement).value)
);
(document.getElementById("only-open") as HTMLInputElement).addEventListener(
  "change",
  (e) => {
    UIState.onlyOpen = (e.target as HTMLInputElement).checked;
    paint();
  }
);
(document.getElementById("sort-by") as HTMLSelectElement).addEventListener(
  "change",
  (e) => {
    UIState.sortBy = (e.target as HTMLSelectElement).value as any;
    paint();
  }
);
const exportBtn = document.getElementById("export-json") as HTMLButtonElement;
const importBtn = document.getElementById("import-json") as HTMLButtonElement;
const importFile = document.getElementById("import-file") as HTMLInputElement;
const resetBtn = document.getElementById("reset-data") as HTMLButtonElement;
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
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Invalid JSON format");
    setClubs(parsed);
    saveState(clubs as any);
    paint();
    alert("Import complete!");
  } catch (err: any) {
    console.error(err);
    alert("Import failed: " + (err?.message || String(err)));
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
(
  document.getElementById("reload-server") as HTMLButtonElement
).addEventListener("click", async () => {
  try {
    setGlobalStatus("Loading from server…", "loading");
    const serverClubs = await loadClubsFromServer();
    setClubs(serverClubs as any);
    saveState(clubs as any);
    paint();
    setGlobalStatus("Loaded from server.", "success");
  } catch (err) {
    console.error(err);
    setGlobalStatus("Server load failed. Check console.", "error");
  } finally {
    setTimeout(clearGlobalStatus, 1000);
  }
});
(document.getElementById("save-server") as HTMLButtonElement).addEventListener(
  "click",
  async () => {
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
    } catch (err: any) {
      console.error(err);
      setGlobalStatus(err.message || "Server save failed.", "error");
    } finally {
      setTimeout(clearGlobalStatus, 1200);
    }
  }
);
window.addEventListener("hashchange", paint);
window.addEventListener("load", bootstrap);
```

</details>

<br><br>

Checkpoint A

- Run: The home list renders (empty until you add or load from server).
- Expect: Title and toolbar visible. No console errors.
- Console: `console.log('clubs', clubs.length)` in DevTools shows a number.

<br><br>

Checkpoint B

- Run: Click “Reload from Server”.
- Expect: Status shows “Loaded from server.” with clubs populated.
- Console: `clubs.length` > 0.

## Troubleshooting

- 404 for `dist/app.js`: The TS compiler hasn’t emitted JS. Run `npm run dev` and keep it running.
- `fetch` blocked or CORS errors: You likely opened via `file://`. Use Live Server.
- No `crypto.randomUUID`: Use a modern browser (Chromium/Firefox/Safari 15.4+). As a quick fallback in `models.ts`, replace with `String(Date.now()) + Math.random().toString(16).slice(2)` for class demo.
- Nothing shows on detail route: Check the URL hash matches `#/club/<id>` and that `findClubById` returns a club.
- Import/Export JSON fails: Ensure the file is an array of plain clubs (see exported format).

## Appendix — Full Source After This Class

<details>
  <summary>Full source — index.html</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — TS Class 13</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Rebuild in TypeScript (beginner‑level)</p>
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

        <button id="reload-server" class="btn" type="button">
          Reload from Server
        </button>
        <button id="save-server" class="btn" type="button">
          Save to Server
        </button>
      </section>

      <div id="global-status" class="status" aria-live="polite"></div>
      <section id="app-root" class="cards"></section>
    </main>

    <footer>
      <small>&copy; <span id="year"></span> Campus Club Manager</small>
    </footer>

    <script type="module" src="dist/app.js"></script>
  </body>
</html>
```

</details>

<details>
  <summary>Full source — styles.css</summary>

```css
/* TS Class 13 — keep styles simple and same as Class 12 */
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

.route-only.home.hidden {
  display: none;
}
```

</details>

<details>
  <summary>Full source — tsconfig.json</summary>

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2020", "DOM"],
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

</details>

<details>
  <summary>Full source — package.json</summary>

```json
{
  "name": "ts-class-13",
  "private": true,
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "build": "tsc -p .",
    "dev": "tsc -w -p ."
  },
  "devDependencies": {
    "typescript": "^5.5.4"
  }
}
```

</details>

<details>
  <summary>Full source — data/seed.json</summary>

```json
[
  {
    "name": "Coding Club",
    "capacity": 10,
    "members": [{ "name": "Ava" }, { "name": "Ben" }, { "name": "Kai" }],
    "events": [
      {
        "title": "Hack Night",
        "dateISO": "2025-09-10",
        "description": "Bring a project.",
        "capacity": 30
      },
      {
        "title": "Intro to Git",
        "dateISO": "2025-09-03",
        "description": "Hands-on basics."
      }
    ]
  },
  {
    "name": "Art Club",
    "capacity": 8,
    "members": [
      { "name": "Riley" },
      { "name": "Sam" },
      { "name": "Noah" },
      { "name": "Maya" },
      { "name": "Ivy" },
      { "name": "Leo" },
      { "name": "Zoe" },
      { "name": "Owen" }
    ],
    "events": [{ "title": "Open Studio", "dateISO": "2025-08-30" }]
  },
  {
    "name": "Book Club",
    "capacity": 12,
    "members": [{ "name": "Elle" }, { "name": "Quinn" }],
    "events": []
  },
  {
    "name": "Robotics",
    "capacity": 6,
    "members": [
      { "name": "Jo" },
      { "name": "Pat" },
      { "name": "Max" },
      { "name": "Ada" },
      { "name": "Ray" }
    ],
    "events": []
  }
]
```

</details>

<details>
  <summary>Full source — src/models.ts</summary>

```ts
// Beginner-friendly domain models with simple types
export type Id = string;

export class Member {
  constructor(
    public name: string,
    public role: "member" | "leader" = "member",
    public id: Id = crypto.randomUUID()
  ) {}
  toPlain() {
    return { id: this.id, name: this.name, role: this.role };
  }
  static fromPlain(obj: { id?: Id; name: string; role?: "member" | "leader" }) {
    return new Member(
      obj.name,
      obj.role ?? "member",
      obj.id ?? crypto.randomUUID()
    );
  }
}

export class EventItem {
  public rsvps: Set<Id> = new Set();
  constructor(
    public title: string,
    public dateISO: string,
    public description: string = "",
    public capacity: number = 100,
    public id: Id = crypto.randomUUID()
  ) {}
  get date() {
    return new Date(this.dateISO);
  }
  get isPast() {
    const now = new Date();
    return (
      this.date.getTime() <
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    );
  }
  get friendlyWhen() {
    return this.date.toLocaleDateString();
  }
  toPlain() {
    return {
      id: this.id,
      title: this.title,
      dateISO: this.dateISO,
      description: this.description,
      capacity: this.capacity,
      rsvps: Array.from(this.rsvps),
    };
  }
  static fromPlain(obj: any) {
    const e = new EventItem(
      obj.title,
      obj.dateISO,
      obj.description ?? "",
      obj.capacity ?? 100,
      obj.id ?? crypto.randomUUID()
    );
    e.rsvps = new Set(Array.isArray(obj.rsvps) ? obj.rsvps : []);
    return e;
  }
}

export class Club {
  public members: Member[] = [];
  public events: EventItem[] = [];
  constructor(
    public name: string,
    public capacity: number = 1,
    public id: Id = crypto.randomUUID()
  ) {}

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

  addMember(name: string, role: "member" | "leader" = "member") {
    if (!name.trim())
      return { ok: false as const, reason: "invalid-name" as const };
    if (this.seatsLeft <= 0)
      return { ok: false as const, reason: "full" as const };
    if (this.members.some((m) => m.name.toLowerCase() === name.toLowerCase()))
      return { ok: false as const, reason: "duplicate" as const };
    const m = new Member(name, role);
    this.members.push(m);
    return { ok: true as const, member: m };
  }
  removeMember(memberId: Id) {
    const i = this.members.findIndex((m) => m.id === memberId);
    if (i >= 0) {
      this.members.splice(i, 1);
      return true;
    }
    return false;
  }

  addEvent({
    title,
    dateISO,
    description = "",
    capacity = 100,
  }: {
    title: string;
    dateISO: string;
    description?: string;
    capacity?: number;
  }) {
    const d = new Date(dateISO);
    if (isNaN(d.getTime()))
      return { ok: false as const, reason: "invalid-date" as const };
    const evt = new EventItem(title, dateISO, description, capacity);
    this.events.push(evt);
    this.sortEvents();
    return { ok: true as const, event: evt };
  }
  removeEvent(eventId: Id) {
    const i = this.events.findIndex((e) => e.id === eventId);
    if (i >= 0) {
      this.events.splice(i, 1);
      return true;
    }
    return false;
  }
  sortEvents() {
    this.events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  upcomingEvents() {
    return this.events
      .filter((e) => !e.isPast)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  toPlain() {
    return {
      id: this.id,
      name: this.name,
      capacity: this.capacity,
      members: this.members.map((m) => m.toPlain()),
      events: this.events.map((e) => e.toPlain()),
    };
  }
  static fromPlain(obj: any) {
    const c = new Club(obj.name, obj.capacity, obj.id ?? crypto.randomUUID());
    (obj.members ?? []).forEach((m: any) =>
      c.members.push(Member.fromPlain(m))
    );
    (obj.events ?? []).forEach((e: any) =>
      c.events.push(EventItem.fromPlain(e))
    );
    if (!obj.members && typeof obj.current === "number") {
      for (let i = 0; i < obj.current; i++) c.addMember(`Member ${i + 1}`);
    }
    c.sortEvents();
    return c;
  }
}
```

</details>

<details>
  <summary>Full source — src/store.ts</summary>

```ts
import { Club } from "./models.js";

export let clubs: Club[] = [];

export function setClubs(plainArray: any[]) {
  clubs.splice(0, clubs.length, ...plainArray.map(Club.fromPlain));
}
export function addClub(name: string, capacity: number) {
  clubs.push(new Club(name, capacity));
}
export function findClubById(id: string) {
  return clubs.find((c) => c.id === id);
}
export function toPlainArray(currentClubs: Club[]) {
  return currentClubs.map((c) => c.toPlain());
}
```

</details>

<details>
  <summary>Full source — src/filters.ts</summary>

```ts
import type { Club } from "./models.js";

export const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc" as
    | "name-asc"
    | "name-desc"
    | "seats-desc"
    | "capacity-desc",
};

export function getVisibleClubs(all: Club[]): Club[] {
  let list = all.slice();
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
    }
  });
  return list;
}
```

</details>

<details>
  <summary>Full source — src/persist.ts</summary>

```ts
const STORAGE_KEY = "ccm:v1";
export function saveState(clubs: any[]) {
  try {
    const plain = clubs.map((c) =>
      typeof (c as any).toPlain === "function" ? (c as any).toPlain() : c
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  } catch (e) {
    console.error("Failed to save:", e);
  }
}
export function loadStateRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY);
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

</details>

<details>
  <summary>Full source — src/router.ts</summary>

```ts
export type Route = { view: "home" } | { view: "club"; id: string };
export function parseHash(): Route {
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
export function goClub(id: string) {
  window.location.hash = `#/club/${id}`;
}
```

</details>

<details>
  <summary>Full source — src/ui.ts</summary>

```ts
import type { Club } from "./models.js";

export function renderClubs(visibleClubs: Club[]) {
  const container = document.getElementById("app-root") as HTMLElement;
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
      </li>
    `
      )
      .join("");

    const todayISO = new Date().toISOString().slice(0, 10);

    card.innerHTML = `
      <div><strong><a href="#/club/${club.id}">${
      club.name
    }</a></strong><br>${stats}</div>

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
      </div>
    `;

    container.appendChild(card);
  });
}

export function setStatus(clubId: string, message: string) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}

export function renderClubDetail(club: Club) {
  const container = document.getElementById("app-root") as HTMLElement;
  container.innerHTML = "";

  (
    document.getElementById("crumb-current") as HTMLElement
  ).textContent = `› ${club.name}`;

  const card = document.createElement("div");
  card.className = "card";
  card.dataset.clubId = club.id;

  const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

  const membersHtml = club.members
    .map(
      (m) => `
    <li>${m.name}
      <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
    </li>
  `
    )
    .join("");

  const eventsHtml = club.events
    .map((evt) => {
      const dateStr = new Date(evt.dateISO).toLocaleDateString();
      const pastBadge = evt.isPast ? '<span class="badge">Past</span>' : "";
      return `<li>
      <strong>${evt.title}</strong> — ${dateStr} ${pastBadge}
      <button class="link-btn" data-action="remove-event" data-club-id="${club.id}" data-event-id="${evt.id}">Remove</button>
    </li>`;
    })
    .join("");

  const todayISO = new Date().toISOString().slice(0, 10);

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
    </div>
  `;

  container.appendChild(card);
}
```

</details>

<details>
  <summary>Full source — src/api.ts</summary>

```ts
const SEED_URL = "./data/seed.json";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function loadClubsFromServer() {
  await delay(400);
  const res = await fetch(SEED_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load from server: " + res.status);
  return res.json();
}

export async function saveClubsToServer(plainArray: unknown) {
  await delay(400);
  if (Math.random() < 0.1)
    throw new Error("Temporary server error. Try again.");
  return {
    ok: true,
    savedAt: new Date().toISOString(),
    count: Array.isArray(plainArray) ? plainArray.length : 0,
  } as const;
}
```

</details>

<details>
  <summary>Full source — src/app.ts</summary>

```ts
import {
  clubs,
  setClubs,
  addClub,
  findClubById,
  toPlainArray,
} from "./store.js";
import { ui as UIState, getVisibleClubs } from "./filters.js";
import { renderClubs, setStatus, renderClubDetail } from "./ui.js";
import { saveState, clearState, loadState } from "./persist.js";
import { parseHash, goHome } from "./router.js";
import { loadClubsFromServer, saveClubsToServer } from "./api.js";

// Footer year
(document.getElementById("year") as HTMLElement).textContent = String(
  new Date().getFullYear()
);

// Status helpers
const statusEl = document.getElementById("global-status") as HTMLElement;
function setGlobalStatus(
  msg: string,
  kind: "" | "loading" | "error" | "success" = ""
) {
  statusEl.textContent = msg;
  statusEl.className = "status " + kind;
}
function clearGlobalStatus() {
  setGlobalStatus("");
}

function setRouteChrome(route: ReturnType<typeof parseHash>) {
  const homeOnly = document.querySelectorAll(".route-only.home");
  homeOnly.forEach((el) =>
    route.view === "home"
      ? el.classList.remove("hidden")
      : el.classList.add("hidden")
  );
  const crumb = document.getElementById("crumb-current") as HTMLElement;
  crumb.textContent = route.view === "home" ? "" : crumb.textContent;
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

async function bootstrap() {
  const saved = loadState();
  if (!saved) {
    try {
      setGlobalStatus("Loading starter data from server…", "loading");
      const serverClubs = await loadClubsFromServer();
      setClubs(serverClubs as any);
      saveState(clubs as any);
      setGlobalStatus("Loaded from server.", "success");
    } catch (err) {
      console.error(err);
      setGlobalStatus("Server load failed — using built‑in data.", "error");
      // If you want, you could set a tiny fallback seed here
      // For simplicity we keep clubs as [] and let the user add
    } finally {
      setTimeout(clearGlobalStatus, 1000);
    }
  } else {
    setClubs(saved as any);
  }
  paint();
}

const appRoot = document.getElementById("app-root") as HTMLElement;
appRoot.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null;
  const btn = target?.closest("[data-action]") as HTMLElement | null;
  if (!btn) return;
  const action = btn.dataset.action as string | undefined;
  const clubId = btn.dataset.clubId as string | undefined;
  const club = clubId ? findClubById(clubId) : undefined;
  if (!club) return;

  if (action === "add-member") {
    const input = document.getElementById(
      `member-name-${clubId}`
    ) as HTMLInputElement | null;
    const name = (input?.value || "").trim();
    if (name === "") {
      setStatus(clubId!, "Please enter a member name.");
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
      setStatus(clubId!, msg);
      return;
    }
    setStatus(clubId!, "Member added.");
    saveState(clubs as any);
    paint();
  }

  if (action === "remove-member") {
    const memberId = btn.dataset.memberId as string | undefined;
    if (!memberId) return;
    club.removeMember(memberId);
    saveState(clubs as any);
    paint();
  }

  if (action === "add-event") {
    const titleEl = document.getElementById(
      `event-title-${clubId}`
    ) as HTMLInputElement | null;
    const dateEl = document.getElementById(
      `event-date-${clubId}`
    ) as HTMLInputElement | null;
    const capEl = document.getElementById(
      `event-capacity-${clubId}`
    ) as HTMLInputElement | null;
    const descEl = document.getElementById(
      `event-desc-${clubId}`
    ) as HTMLInputElement | null;

    const title = (titleEl?.value || "").trim();
    const dateISO = (dateEl?.value || "").trim();
    const cap = parseInt(capEl?.value || "0", 10);
    const desc = (descEl?.value || "").trim();

    if (!title || !dateISO || isNaN(cap) || cap <= 0) {
      setStatus(clubId!, "Enter a title, date, and capacity (>0).");
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
        clubId!,
        added.reason === "invalid-date"
          ? "Please pick a valid date."
          : "Could not add event."
      );
      return;
    }

    setStatus(clubId!, "Event added.");
    saveState(clubs as any);
    paint();
  }

  if (action === "remove-event") {
    const eventId = btn.dataset.eventId as string | undefined;
    if (!eventId) return;
    club.removeEvent(eventId);
    saveState(clubs as any);
    paint();
  }
});

(document.getElementById("club-form") as HTMLFormElement).addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("club-name") as HTMLInputElement;
    const capacityInput = document.getElementById(
      "club-capacity"
    ) as HTMLInputElement;
    const errorMessage = document.getElementById(
      "error-message"
    ) as HTMLElement;

    const name = nameInput.value.trim();
    const capacity = parseInt(capacityInput.value, 10);
    if (name === "" || isNaN(capacity) || capacity <= 0) {
      errorMessage.textContent =
        "Please enter a valid club name and capacity (min 1).";
      return;
    }
    const exists = clubs.some(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      errorMessage.textContent = "A club with this name already exists.";
      return;
    }

    errorMessage.textContent = "";
    addClub(name, capacity);
    saveState(clubs as any);
    paint();

    nameInput.value = "";
    capacityInput.value = "";
    nameInput.focus();
  }
);

const onSearchInput = (value: string) => {
  UIState.searchText = value;
  paint();
};
(document.getElementById("search") as HTMLInputElement).addEventListener(
  "input",
  (e) => onSearchInput((e.target as HTMLInputElement).value)
);
(document.getElementById("only-open") as HTMLInputElement).addEventListener(
  "change",
  (e) => {
    UIState.onlyOpen = (e.target as HTMLInputElement).checked;
    paint();
  }
);
(document.getElementById("sort-by") as HTMLSelectElement).addEventListener(
  "change",
  (e) => {
    UIState.sortBy = (e.target as HTMLSelectElement).value as any;
    paint();
  }
);

const exportBtn = document.getElementById("export-json") as HTMLButtonElement;
const importBtn = document.getElementById("import-json") as HTMLButtonElement;
const importFile = document.getElementById("import-file") as HTMLInputElement;
const resetBtn = document.getElementById("reset-data") as HTMLButtonElement;

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
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Invalid JSON format");
    setClubs(parsed);
    saveState(clubs as any);
    paint();
    alert("Import complete!");
  } catch (err: any) {
    console.error(err);
    alert("Import failed: " + (err?.message || String(err)));
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

(
  document.getElementById("reload-server") as HTMLButtonElement
).addEventListener("click", async () => {
  try {
    setGlobalStatus("Loading from server…", "loading");
    const serverClubs = await loadClubsFromServer();
    setClubs(serverClubs as any);
    saveState(clubs as any);
    paint();
    setGlobalStatus("Loaded from server.", "success");
  } catch (err) {
    console.error(err);
    setGlobalStatus("Server load failed. Check console.", "error");
  } finally {
    setTimeout(clearGlobalStatus, 1000);
  }
});

(document.getElementById("save-server") as HTMLButtonElement).addEventListener(
  "click",
  async () => {
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
    } catch (err: any) {
      console.error(err);
      setGlobalStatus(err.message || "Server save failed.", "error");
    } finally {
      setTimeout(clearGlobalStatus, 1200);
    }
  }
);

window.addEventListener("hashchange", paint);
window.addEventListener("load", bootstrap);
```

</details>

---

End of Class 13 walkthrough.
