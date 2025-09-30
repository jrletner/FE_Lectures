# Class 14 — Project Scaffold & Backend (Authoritative Single‑Touch Version)

Goal: Establish the complete local development scaffold (Angular workspace + dev API stack) exactly once. We do NOT yet introduce any app feature code (no models, services, routing, or components). All files created today are in their final form and will not be edited later. This preserves the single‑touch principle for the infrastructure layer.

Timebox Suggestion: ~20–25 min (explain architecture, live‑code only the custom backend + styles tokens, copy/paste remaining JSON/config). Emphasize why we front‑load the backend so future classes can focus purely on Angular domain code.

---

Diff legend for live coding:

- Lines starting with + are additions
- Lines starting with - are removals
- Plain lines are context

All files below are new today; each is shown directly with its full final content (no interim diffs needed because there are no modifications to prior code).

---

## Scope (Files Introduced Today)

Infrastructure & environment (as per build plan README):

1. `angular.json` (CLI generated; reviewed only)
2. `package.json` (CLI generated + scripts already final)
3. `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json` (CLI)
4. `src/index.html` (CLI; title confirmed)
5. `src/main.ts` (CLI bootstrap – unchanged until routing added later)
6. `src/styles.css` (LIVE add: design tokens + global UI baseline) ✅
7. `proxy.conf.json` (LIVE minimal or paste)
8. `server.js` (LIVE: custom json‑server with auth + granular authorization rules)
9. `db.json` (Seed data: clubs + users)

We DO NOT touch `app.component.*` yet; the final shell lands in Class 17 to avoid re‑editing.

---

## Concept Highlights

1. Single‑Touch Infrastructure: Lock backend + global theme now so later feature classes never context‑switch into environment tweaks.
2. Dev API Strategy: Leverage `json-server` with a thin custom Express wrapper for auth, authorization, and invariants (capacity enforcement, event append rules, membership self‑service).
3. Auth Model: Simple PIN + JWT token; server issues an 8‑hour token; front‑end interceptors (introduced Class 16) will add Bearer header.
4. Authorization Rules: Admins can mutate everything; non‑admins restricted to membership changes and a controlled event add path.
5. Deterministic Seed: Ensures consistent demo state for teaching; IDs human‑readable to simplify debugging.
6. Proxy Setup: Angular dev server rewrites `/api/*` → backend so relative API calls remain environment‑agnostic.
7. Style System: Centralized CSS design tokens (custom properties) + base utility primitives to reduce duplication across future components.

---

## Architecture Overview (Verbal Walkthrough)

Browser (Angular SPA) → `/api` (proxy) → Node `server.js` (json-server + custom middleware) → `db.json` (lowdb persistence).

Future classes add purely front‑end layers atop this stable base: models (15), services/interceptors (16), layout (17), routing + features (18+).

---

## Verification Steps

1. Install deps if not already: (already done via CLI previously)
2. Run combined dev processes (concurrently): `npm start`
3. Confirm API reachable: `GET /api/clubs` returns seed list.
4. Confirm auth: `POST /api/auth/login {"username":"admin","pin":"1234"}` returns token.
5. No Angular feature routes yet—blank root is expected until layout (Class 17) and routing (Class 18).

---

## What’s Next (Class 15 Preview)

Introduce domain model interfaces (`User`, `Member`, `EventItem`, `Club`) and the `API_BASE` token (injection). No providers or services yet—keeps layering clean.

---

## Single‑Touch Reminder

Every file below is final. We will not revisit `styles.css`, `server.js`, `db.json`, or proxy configuration in subsequent classes. Any later evolution (if absolutely necessary) would be explicitly called out as an intentional exception.

---

## Full file contents created/updated in Class 14

Use this appendix for quick reference. Click to expand.

<details>
<summary>angular.json (CLI generated — review only)</summary>

```json
... CLI generated content (unchanged; omitted for brevity) ...
```

</details>
<details>
<summary>package.json</summary>

```json
{
  "name": "campus-club-manager",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "concurrently -k \"npm:serve:api\" \"npm:serve:web\"",
    "serve:web": "ng serve --proxy-config proxy.conf.json",
    "serve:api": "node server.js",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/common": "^19.2.0",
    "@angular/compiler": "^19.2.0",
    "@angular/core": "^19.2.0",
    "@angular/forms": "^19.2.0",
    "@angular/platform-browser": "^19.2.0",
    "@angular/platform-browser-dynamic": "^19.2.0",
    "@angular/router": "^19.2.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^19.2.3",
    "@angular/cli": "^19.2.3",
    "@angular/compiler-cli": "^19.2.0",
    "@types/jasmine": "~5.1.0",
    "bcryptjs": "^3.0.2",
    "concurrently": "^9.1.0",
    "jasmine-core": "~5.6.0",
    "json-server": "^0.17.4",
    "jsonwebtoken": "^9.0.2",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.7.2"
  }
}
```

</details>
<details>
<summary>proxy.conf.json</summary>

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" }
  }
}
```

</details>
<details>
<summary>server.js</summary>

```javascript
/*
	Custom json-server with authentication and authorization.
	- POST /auth/login { username, pin } -> { token, user }
	- JWT Bearer required for all routes except /auth/login
	- Only admins can create/update/delete clubs and users
	- Non-admins may only add an event to a club (other writes forbidden)
	- Seeds users on first run if none exist
*/
const jsonServer = require("json-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "db.json");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_TTL_SEC = 60 * 60 * 8; // 8 hours

const server = jsonServer.create();
const router = jsonServer.router(DB_FILE);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Utility to read/write lowdb
function db() {
  return router.db; // lowdb instance
}

function safePickUser(u) {
  if (!u) return null;
  return { id: u.id, username: u.username, isAdmin: !!u.isAdmin };
}

// Seed users if missing
function seedUsersIfEmpty() {
  const users = db().get("users").value();
  if (Array.isArray(users) && users.length > 0) return;
  const seed = [
    { id: "u-admin", username: "admin", pin: "1234", isAdmin: true },
    { id: "u-user", username: "user", pin: "1234", isAdmin: false },
  ];
  const hashed = seed.map((u) => ({
    id: u.id,
    username: u.username,
    pinHash: bcrypt.hashSync(u.pin, 10),
    isAdmin: !!u.isAdmin,
  }));
  db().set("users", hashed).write();
  // Ensure users key exists in db.json file as well if missing
  try {
    const raw = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    raw.users = db().get("users").value();
    fs.writeFileSync(DB_FILE, JSON.stringify(raw, null, 2));
  } catch (e) {
    // ignore
  }
}

// Ensure users collection exists
if (!db().has("users").value()) {
  db().set("users", []).write();
}
seedUsersIfEmpty();

// Auth: login
server.post("/auth/login", (req, res) => {
  const { username, pin } = req.body || {};
  if (!username || !pin)
    return res.status(400).json({ error: "Missing credentials" });
  const user = db().get("users").find({ username }).value();
  if (!user || !user.pinHash) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const ok = bcrypt.compareSync(String(pin), String(user.pinHash));
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const payload = {
    sub: user.id,
    username: user.username,
    isAdmin: !!user.isAdmin,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL_SEC });
  res.json({ token, user: safePickUser(user) });
});

// Auth: me
server.get("/auth/me", authRequired, (req, res) => {
  const u = req.user;
  res.json({ user: { id: u.sub, username: u.username, isAdmin: !!u.isAdmin } });
});

// Middleware: require auth for all other routes
server.use((req, res, next) => {
  if (req.path.startsWith("/auth/")) return next();
  return authRequired(req, res, next);
});

// Authorization for users collection: only admin can write; admin can read; non-admin cannot read list
server.use((req, res, next) => {
  if (req.path.startsWith("/users")) {
    const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
    if (!req.user?.isAdmin) {
      // Allow non-admins to PATCH their own user to update pin
      if (isWrite && req.method === "PATCH") {
        // More robust than regex: split path and take segment after 'users'
        const id = (req.path.split("/")[2] || "").trim();
        if (!id || id !== req.user?.sub) {
          return res.status(403).json({ error: "Admins only" });
        }
        return next();
      }
      if (isWrite) return res.status(403).json({ error: "Admins only" });
      // Non-admins cannot list users; but allow GET /users/:id if it's them
      if (req.method === "GET") {
        const id = (req.path.split("/")[2] || "").trim();
        if (!id || id !== req.user?.sub) {
          return res.status(403).json({ error: "Admins only" });
        }
      }
    }
  }
  next();
});

// Authorization for clubs: only admin can write, except non-admins may add a single event via PUT /clubs/:id
server.use((req, res, next) => {
  if (!req.path.startsWith("/clubs")) return next();
  const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  if (!isWrite) return next();
  // Admins: allowed
  if (req.user?.isAdmin) return next();
  // Non-admins: allow only adding an event via PUT /clubs/:id where only events changed by +1
  if (req.method === "PUT") {
    const id = req.path.split("/")[2];
    const existing = db().get("clubs").find({ id }).value();
    if (!existing) return res.status(404).json({ error: "Not found" });
    const incoming = req.body;
    // Cannot change name/capacity/members
    const sameCore =
      incoming.name === existing.name &&
      incoming.capacity === existing.capacity &&
      JSON.stringify(incoming.members) === JSON.stringify(existing.members);
    if (!sameCore) return res.status(403).json({ error: "Read-only" });
    // Events must be existing +1 new at the end
    const prevEvents = existing.events || [];
    const nextEvents = incoming.events || [];
    if (nextEvents.length !== prevEvents.length + 1) {
      return res.status(403).json({ error: "Only adding one event allowed" });
    }
    // naive check: previous events must be identical prefix
    const prefixSame =
      JSON.stringify(prevEvents) === JSON.stringify(nextEvents.slice(0, -1));
    if (!prefixSame)
      return res.status(403).json({ error: "Only adding one event allowed" });
    return next();
  }
  // Non-admins: allow PATCH /clubs/:id to hold/give up their own spot, changing only members
  if (req.method === "PATCH") {
    const id = req.path.split("/")[2];
    const existing = db().get("clubs").find({ id }).value();
    if (!existing) return res.status(404).json({ error: "Not found" });
    const incoming = req.body || {};
    const keys = Object.keys(incoming);
    if (keys.length === 0) return res.status(400).json({ error: "No changes" });
    // Only members can be changed by non-admin
    if (keys.some((k) => k !== "members"))
      return res.status(403).json({ error: "Read-only" });
    const prevMembers = Array.isArray(existing.members) ? existing.members : [];
    const nextMembers = Array.isArray(incoming.members) ? incoming.members : [];
    // Core invariants: name/capacity/events must not change in a PATCH body for non-admin
    // (json-server PATCH merges; we only allow 'members' key anyway)

    // Helper: compare arrays excluding current user's own membership
    const userId = req.user?.sub;
    const userName = req.user?.username;
    const prevWithoutUser = prevMembers.filter((m) => m.id !== userId);
    const nextWithoutUser = nextMembers.filter((m) => m.id !== userId);
    const sameOthers =
      JSON.stringify(prevWithoutUser) === JSON.stringify(nextWithoutUser);
    if (!sameOthers) return res.status(403).json({ error: "Read-only" });

    // Determine operation: hold (add) or give up (remove)
    const hadSeat = prevMembers.some((m) => m.id === userId);
    const hasSeatNext = nextMembers.some((m) => m.id === userId);

    // Hold: adding exactly the current user, capacity respected, and correct name
    if (!hadSeat && hasSeatNext) {
      if (nextMembers.length !== prevMembers.length + 1)
        return res.status(403).json({ error: "Invalid change" });
      if ((existing.capacity || 0) < nextMembers.length)
        return res.status(403).json({ error: "At capacity" });
      const added = nextMembers.find((m) => m.id === userId);
      if (!added || added.name !== userName)
        return res.status(403).json({ error: "Invalid member" });
      return next();
    }

    // Give up: removing exactly the current user
    if (hadSeat && !hasSeatNext) {
      if (nextMembers.length !== prevMembers.length - 1)
        return res.status(403).json({ error: "Invalid change" });
      return next();
    }

    // Otherwise, disallow
    return res.status(403).json({ error: "Read-only" });
  }
  return res.status(403).json({ error: "Admins only" });
});

// Helpers
function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const parts = auth.split(" ");
  if (parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Preprocess user writes: we need to hash PIN.
server.post("/users", (req, res, next) => {
  try {
    const { username, pin, isAdmin } = req.body || {};
    if (!username || !pin)
      return res.status(400).json({ error: "username and pin required" });
    const exists = db().get("users").find({ username }).value();
    if (exists) return res.status(409).json({ error: "username exists" });
    const user = {
      id: `u-${Date.now()}`,
      username,
      pinHash: bcrypt.hashSync(String(pin), 10),
      isAdmin: !!isAdmin,
    };
    db().get("users").push(user).write();
    return res.status(201).json(safePickUser(user));
  } catch (e) {
    return res.status(500).json({ error: "Failed to create user" });
  }
});

server.patch("/users/:id", (req, res) => {
  const id = req.params.id;
  const curr = db().get("users").find({ id }).value();
  if (!curr) return res.status(404).json({ error: "Not found" });
  const changes = { ...req.body };
  if (changes.pin) {
    changes.pinHash = bcrypt.hashSync(String(changes.pin), 10);
    delete changes.pin;
  }
  const updated = db().get("users").find({ id }).assign(changes).write();
  return res.json(safePickUser(updated));
});

// Attach router after authz and custom handlers
server.use(router);

// After router: keep default render
router.render = (req, res) => {
  res.jsonp(res.locals.data);
};

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${PORT}`);
});
```

</details>
<details>
<summary>db.json</summary>

```json
{
  "clubs": [
    {
      "id": "c-robotics",
      "name": "Robotics Club",
      "capacity": 6,
      "members": [
        { "id": "m-r1", "name": "Alex" },
        { "id": "m-r2", "name": "Jordan" },
        { "id": "m-r3", "name": "Taylor" },
        { "id": "m-r4", "name": "Blake" },
        { "id": "m-r5", "name": "Robin" },
        { "id": "m-r6", "name": "Shawn" }
      ],
      "events": [
        {
          "id": "e-r1",
          "title": "Kickoff Night",
          "dateIso": "2025-09-10",
          "capacity": 40,
          "description": "Project ideas and team formation"
        },
        {
          "id": "e-r2",
          "title": "Arduino Workshop",
          "dateIso": "2025-10-05",
          "capacity": 20,
          "description": "Intro to microcontrollers"
        }
      ]
    },
    {
      "id": "c-literature",
      "name": "Literature Circle",
      "capacity": 2,
      "members": [
        { "id": "m-l1", "name": "Morgan" },
        { "id": "m-l2", "name": "Sam" }
      ],
      "events": [
        {
          "id": "e-l1",
          "title": "Poetry Night",
          "dateIso": "2025-09-20",
          "capacity": 30,
          "description": "Open mic and readings"
        }
      ]
    },
    {
      "id": "c-gamedev",
      "name": "Game Dev Guild",
      "capacity": 8,
      "members": [
        { "id": "m-g1", "name": "Casey" },
        { "id": "m-g2", "name": "Riley" },
        { "id": "m-g3", "name": "Jamie" },
        { "id": "m-g4", "name": "Quinn" },
        { "id": "m-g5", "name": "Ari" },
        { "id": "m-g6", "name": "Devon" },
        { "id": "m-g7", "name": "Jules" }
      ],
      "events": [
        {
          "id": "e-g1",
          "title": "Unity Jam",
          "dateIso": "2025-09-25",
          "capacity": 50,
          "description": "Build a game in one night"
        },
        {
          "id": "e-g2",
          "title": "Pixel Art 101",
          "dateIso": "2025-10-12",
          "capacity": 25,
          "description": "Tools, palettes, and tips"
        }
      ]
    },
    {
      "id": "c-outdoors",
      "name": "Outdoor Adventures",
      "capacity": 6,
      "members": [
        { "id": "m-o1", "name": "Chris" },
        { "id": "m-o2", "name": "Pat" },
        { "id": "m-o3", "name": "Dana" }
      ],
      "events": [
        {
          "id": "e-o1",
          "title": "Trail Hike",
          "dateIso": "2025-09-07",
          "capacity": 20,
          "description": "Beginner-friendly 5k hike"
        }
      ]
    },
    {
      "id": "c-cooking",
      "name": "Culinary Collective",
      "capacity": 6,
      "members": [
        { "id": "m-c1", "name": "Avery" },
        { "id": "m-c2", "name": "Parker" },
        { "id": "m-c3", "name": "Jesse" },
        { "id": "m-c4", "name": "Skyler" },
        { "id": "m-c5", "name": "Reese" },
        { "id": "m-c6", "name": "Toni" }
      ],
      "events": [
        {
          "id": "e-c1",
          "title": "Pasta Night",
          "dateIso": "2025-09-15",
          "capacity": 16,
          "description": "Fresh pasta from scratch"
        }
      ]
    },
    {
      "id": "c-photography",
      "name": "Photography Society",
      "capacity": 4,
      "members": [
        { "id": "m-p1", "name": "Logan" },
        { "id": "m-p2", "name": "Harper" },
        { "id": "m-p3", "name": "River" },
        { "id": "m-p4", "name": "Sasha" }
      ],
      "events": [
        {
          "id": "e-p1",
          "title": "Golden Hour Walk",
          "dateIso": "2025-09-22",
          "capacity": 30,
          "description": "Campus sunset shoot"
        }
      ]
    },
    {
      "id": "c-chess",
      "name": "Chess & Strategy",
      "capacity": 5,
      "members": [
        { "id": "m-s1", "name": "Lee" },
        { "id": "m-s2", "name": "Drew" },
        { "id": "m-s3", "name": "Hayden" },
        { "id": "m-s4", "name": "Indy" },
        { "id": "m-s5", "name": "Alexis" }
      ],
      "events": [
        {
          "id": "e-s1",
          "title": "Rapid Tournament",
          "dateIso": "2025-10-01",
          "capacity": 32,
          "description": "Swiss pairings, 10+0"
        }
      ]
    },
    {
      "id": "c-film",
      "name": "Film Appreciation",
      "capacity": 8,
      "members": [
        { "id": "m-f1", "name": "Rowan" },
        { "id": "m-f2", "name": "Sage" },
        { "id": "m-f3", "name": "Maya" },
        { "id": "m-f4", "name": "Noah" },
        { "id": "m-f5", "name": "Liam" },
        { "id": "m-f6", "name": "Aria" },
        { "id": "m-f7", "name": "Theo" },
        { "id": "m-f8", "name": "Milo" }
      ],
      "events": [
        {
          "id": "e-f1",
          "title": "Classic Noir Night",
          "dateIso": "2025-09-18",
          "capacity": 50,
          "description": "Double feature + discussion"
        },
        {
          "id": "e-f2",
          "title": "Student Shorts",
          "dateIso": "2025-10-20",
          "capacity": 80,
          "description": "Showcase and Q&A"
        }
      ]
    },
    {
      "id": "c-gardening",
      "name": "Community Garden",
      "capacity": 4,
      "members": [
        { "id": "m-gd1", "name": "Elliot" },
        { "id": "m-gd2", "name": "Peyton" }
      ],
      "events": [
        {
          "id": "e-gd1",
          "title": "Fall Planting",
          "dateIso": "2025-09-12",
          "capacity": 20,
          "description": "Beds prep and seedlings"
        }
      ]
    },
    {
      "id": "c-music",
      "name": "Campus Musicians",
      "capacity": 6,
      "members": [
        { "id": "m-m1", "name": "Isla" },
        { "id": "m-m2", "name": "Kai" },
        { "id": "m-m3", "name": "Zoe" }
      ],
      "events": [
        {
          "id": "e-m1",
          "title": "Open Mic",
          "dateIso": "2025-09-28",
          "capacity": 60,
          "description": "Sign-ups at the door"
        }
      ]
    }
  ],
  "users": [
    {
      "id": "u-admin",
      "username": "admin",
      "pinHash": "$2b$10$1Yw87BCvTT4YjQt6m9Tj1.ZUOSAQ6f/GofojUc/VAY.GQwFbYwFl2",
      "isAdmin": true
    },
    {
      "id": "u-user",
      "username": "user",
      "pinHash": "$2b$10$sfjRYmqaJvjin8qeKeX88eRy/8HlYrzsR.7pNvYsiP5ctBdh9C8k6",
      "isAdmin": false
    }
  ]
}
```

</details>
<details>
<summary>src/index.html</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>CampusClubManager</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

</details>
<details>
<summary>src/main.ts</summary>

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
```

</details>
<details>
<summary>src/styles.css</summary>

```css
/* App Theme (Light, high-contrast) */
:root {
  /* Base colors */
  --bg: #d5dcea; /* page background (~3 shades darker) */
  --surface: #ffffff; /* cards, header */
  --surface-2: #f1f5f9; /* inputs, subtle surfaces */
  --text: #0f172a; /* slate-900 */
  --muted: #475569; /* slate-600 */

  /* Accents */
  --primary: #6366f1; /* indigo-500 */
  --primary-700: #4f46e5; /* indigo-600 */
  --primary-300: #a5b4fc; /* indigo-300 */
  --secondary: #14b8a6; /* teal-500 */
  --secondary-700: #0f766e; /* teal-700 */
  --accent: #f59e0b; /* amber-500 */
  --accent-700: #b45309; /* amber-700 */
  --info: #0ea5e9; /* sky-500 */
  --success: #10b981; /* emerald-500 */
  --danger: #dc2626; /* red-600 */
  --warning: #b45309; /* amber-700 */

  /* Chrome */
  --border: #e5e7eb; /* gray-200 */
  --ring: rgba(99, 102, 241, 0.35);
  --shadow-sm: 0 4px 12px rgba(2, 6, 23, 0.06);
  --shadow: 0 10px 25px rgba(2, 6, 23, 0.08);
  --shadow-lg: 0 18px 40px rgba(2, 6, 23, 0.12);
  --radius: 12px;
  /* Inputs */
  --input-bg: #eef2ff; /* very light indigo tint for inputs */
}

/* Resets */
* {
  box-sizing: border-box;
}
html,
body {
  height: 100%;
}
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  background: radial-gradient(
      1200px 1200px at 10% -10%,
      rgba(99, 102, 241, 0.1),
      transparent 60%
    ),
    radial-gradient(
      1000px 1000px at 110% 10%,
      rgba(16, 185, 129, 0.06),
      transparent 60%
    ),
    var(--bg);
  color: var(--text);
  line-height: 1.5;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin: 1rem 0;
}
.toolbar input[type="search"],
.toolbar select {
  height: 38px;
}
.toolbar .spacer {
  flex: 1;
}
.toolbar .btn {
  height: 38px;
}
/* Toolbar */
.toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin: 1rem 0;
  flex-wrap: wrap;
}
.toolbar input[type="search"],
.toolbar select {
  height: 38px;
}
.toolbar .spacer {
  flex: 1;
}
.toolbar .btn {
  height: 38px;
}
/* Make search flexible and keep others compact */
.toolbar > input[type="search"] {
  flex: 1 1 320px;
  min-width: 220px;
  width: auto;
}
.toolbar > label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}
.toolbar > select {
  flex: 0 0 220px;
  width: auto;
}
.toolbar > .btn {
  flex: 0 0 auto;
}

/* Accessibility: stronger focus rings on keyboard navigation */
:where(a, button, input, select) {
  outline: none;
}
:where(a, button, input, select):focus-visible {
  box-shadow: 0 0 0 3px var(--ring);
  border-color: var(--primary);
}
::placeholder {
  color: #64748b;
  opacity: 1;
}

/* Layout */
app-root {
  display: block;
  min-height: 100dvh;
}
.container {
  width: min(1100px, 92%);
  margin: 0 auto;
}

/* Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.app-header-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  color: var(--text);
}
/* removed accidental gradient styling for inputs that made them too dark */

/* Forms */
.field {
  display: grid;
  gap: 0.35rem;
}

/* Restore native sizing for checkboxes and radios */
input[type="checkbox"],
input[type="radio"] {
  width: 16px;
  height: 16px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: #fff;
  box-shadow: none;
  accent-color: var(--primary);
}
.field label {
  font-size: 0.9rem;
  color: var(--muted);
}
.row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
}

/* Card grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.1rem;
}
nav a {
  color: var(--muted);
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}
nav a:hover {
  color: var(--text);
  background: var(--surface-2);
}
nav a:focus-visible {
  background: var(--surface-2);
}

/* Subheader band (upper area under header) */
.subheader {
  background: linear-gradient(
    180deg,
    rgba(99, 102, 241, 0.06),
    rgba(20, 184, 166, 0.05)
  );
  border-bottom: 1px solid var(--border);
}
.subheader .inner {
  width: min(1100px, 92%);
  margin: 0 auto;
  padding: 0.75rem 0;
  color: var(--muted);
}

/* Decorated page summary line */
.page-summary {
  margin: 0.1rem 0;
  text-align: center;
  font-size: 1.08rem;
  color: var(--text);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}

/* Main */
.app-main {
  padding: 1.25rem 0 2rem;
}
.home-chrome {
  margin: 0.5rem 0 1rem;
  color: var(--muted);
}

/* Cards */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}
.card-inner {
  padding: 1rem;
}

/* Card sections */
.card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.card footer {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

/* Buttons & Inputs */
button,
.btn {
  appearance: none;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.15s ease;
  text-decoration: none; /* ensure anchor buttons aren't underlined */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
button:hover,
.btn:hover {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--ring) inset;
}
button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn-primary {
  background: linear-gradient(180deg, var(--primary), var(--primary-700));
  border-color: transparent;
  color: #fff;
}
.btn-cta {
  background: linear-gradient(135deg, var(--primary-300), var(--primary-700));
  border-color: transparent;
  color: #fff;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(79, 70, 229, 0.25);
  transform: translateY(0);
}
.btn-cta:hover {
  box-shadow: 0 12px 26px rgba(79, 70, 229, 0.32);
  transform: translateY(-1px);
}
.btn-cta:active {
  transform: translateY(0);
}
.toolbar > .btn-cta {
  flex: 0 0 auto;
}
.toolbar .btn-cta {
  height: 38px;
}
.btn-secondary {
  background: linear-gradient(180deg, var(--secondary), var(--secondary-700));
  border-color: transparent;
  color: #fff;
}
.btn-danger {
  color: #fff;
  border-color: #fecaca;
  background: #ef4444;
}
.btn-outline {
  background: transparent;
}
.btn-ghost {
  background: transparent;
  border-color: transparent;
}

/* Professional outline button used for header and hero actions */
.btn-hero {
  height: 38px;
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  border-color: #c7d2fe; /* indigo-200 */
  background: rgba(255, 255, 255, 0.6);
  color: #3730a3; /* indigo-800 */
  box-shadow: 0 2px 8px rgba(2, 6, 23, 0.06);
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.2s ease,
    transform 0.15s ease;
}
.btn-hero:hover {
  background: linear-gradient(180deg, var(--primary), var(--primary-700));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 8px 18px rgba(79, 70, 229, 0.25);
  transform: translateY(-1px);
}

input,
select {
  width: 100%;
  background: var(--input-bg);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.5rem 0.6rem;
  outline: none;
  min-width: 0;
}
input:focus,
select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--ring);
}

/* Status & banners */
.status {
  color: var(--muted);
}
.status.error {
  color: #b91c1c;
}
.empty {
  color: var(--muted);
  font-style: italic;
}

.banner {
  position: sticky;
  top: 56px;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.6rem 0.75rem;
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
  color: #991b1b;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color: var(--muted);
  margin: 0.6rem 0 0.5rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid rgba(2, 6, 23, 0.06);
  border-radius: 12px;
  background: linear-gradient(
    180deg,
    rgba(99, 102, 241, 0.03),
    rgba(99, 102, 241, 0.01)
  );
  box-shadow: none;
}
.breadcrumb a {
  color: var(--muted);
  text-decoration: none;
}
.breadcrumb a:hover {
  color: var(--text);
  text-decoration: underline;
}

/* Chips/Badges */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.85rem;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
}
.chip.-primary {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #3730a3;
}
.chip.-success {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #065f46;
}
.chip.-warning {
  background: #fffbeb;
  border-color: #fde68a;
  color: #92400e;
}
.chip.-danger {
  background: #fef2f2;
  border-color: #fecaca;
  color: #7f1d1d;
}
.chip.-info {
  background: #f0f9ff;
  border-color: #bae6fd;
  color: #075985;
}

/* Badge group layout */
.badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 0.25rem 0 0.35rem;
}

/* Utilities */
.shadow-sm {
  box-shadow: var(--shadow-sm);
}
.shadow {
  box-shadow: var(--shadow);
}
.shadow-lg {
  box-shadow: var(--shadow-lg);
}
.text-muted {
  color: var(--muted);
}
.text-danger {
  color: #b91c1c;
}
.text-success {
  color: #065f46;
}
.bg-surface {
  background: var(--surface);
}
.bg-surface-2 {
  background: var(--surface-2);
}

/* Footer */
.footer {
  color: var(--muted);
  border-top: 1px solid var(--border);
  padding: 1.25rem 0;
  text-align: center;
  background: transparent;
}
```

</details>

</details>

---

End of Class 14 Walkthrough (Authoritative)
