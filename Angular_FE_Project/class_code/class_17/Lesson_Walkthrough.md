# Class 17 — Dev API, proxy, scripts, provider wiring (exact contents)

Goal: Introduce a local API (json-server with custom rules), add a dev proxy, add scripts, and wire Angular providers exactly like the final app.

Timebox: ~90–120 minutes (server + scripts + Angular config)

---

Diff legend for live coding:

- Before each affected file, a tiny diff shows what changed:
  - Lines starting with + are additions
  - Lines starting with - are removals
  - Plain lines are context
- After the diff, the full final file is shown so students can paste cleanly.

---

## 1) Dev API server

Place these at the project root (same folder as package.json):

### server.js

Beginner “what/why”:

- What: A small Node server that wraps json-server. It seeds data, handles login (JWT token), and enforces rules (admins can write anything, non-admins have limited capabilities like add one event or hold/give up a spot).
- Why: Lets students work locally without a real backend while still practicing realistic rules and auth.

# Class 17 — Dev API, proxy, scripts, provider wiring

Set up the local API server, proxy, npm scripts, and wire Angular providers so this project runs exactly like the final app and remains compatible with future classes.

## Diff legend

- [ADDED] brand new file or block
- [UPDATED] edited existing file
- [UNCHANGED] shown for context
- [REMOVED] deleted line or file

---

## Change diffs

### 1) Add dev API server — [ADDED] `server.js`

Change diff (from Class 16 → Class 17):

```diff
 + server.js /* custom json-server with auth and rules; identical to Class 24 */
```

```js
// server.js
/* Custom json-server with authentication and authorization (Class 24 version). */
// ...full file appears below in "Full file contents (new files)"...
```

### 2) Seed database file — [ADDED] `db.json`

Change diff (from Class 16 → Class 17):

```diff
 + db.json /* initial clubs + users=[]; users are seeded on first run */
```

```json
// db.json
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
    }
  ],
  "users": []
}
```

### 3) Proxy config — [ADDED] `proxy.conf.json`

Change diff (from Class 16 → Class 17):

```diff
 + { "/api": { "target": "http://localhost:3000", "secure": false, "changeOrigin": true, "logLevel": "debug", "pathRewrite": { "^/api": "" } } }
```

```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/api": "" }
  }
}
```

### 4) NPM scripts — [UPDATED] `package.json`

Change diff (from Class 16 → Class 17):

```diff
   "scripts": {
     "start": "npm run serve:web",
     "serve:web": "ng serve --proxy-config proxy.conf.json",
     "serve:api": "node server.js",
     "dev": "concurrently \"npm run serve:web\" \"npm run serve:api\""
   }
```

```json
// package.json (scripts)
{
  "scripts": {
    "start": "npm run serve:web",
    "serve:web": "ng serve --proxy-config proxy.conf.json",
    "serve:api": "node server.js",
    "dev": "concurrently \"npm run serve:web\" \"npm run serve:api\""
  }
}
```

### 5) Angular providers — [UPDATED] `src/app/app.config.ts`

Change diff (from Class 16 → Class 17):

```diff
 + provideZoneChangeDetection({ eventCoalescing: true })
 + provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' }))
 + provideHttpClient(withFetch(), withInterceptors([authInterceptor, httpErrorInterceptor]))
 - { provide: API_BASE, useValue: 'http://localhost:3001' }
 + { provide: API_BASE, useValue: '/api' } /* use proxy path exactly like Class 24 */
 + { provide: ErrorHandler, useClass: GlobalErrorHandler }
```

```ts
// src/app/app.config.ts
import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter, withRouterConfig } from "@angular/router";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import { routes } from "./app.routes";
import { API_BASE } from "./shared/tokens/api-base.token";
import { httpErrorInterceptor } from "./shared/http/http-error.interceptor";
import { authInterceptor } from "./shared/http/auth.interceptor";

class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // eslint-disable-next-line no-console
    console.error("GlobalError", error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: "reload" })),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, httpErrorInterceptor])
    ),
    { provide: API_BASE, useValue: "/api" },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
```

---

## Full file contents (new files)

### `server.js`

```js
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

function db() {
  return router.db;
}

function safePickUser(u) {
  if (!u) return null;
  return { id: u.id, username: u.username, isAdmin: !!u.isAdmin };
}

function seedUsersIfEmpty() {
  const users = db().get("users").value();
  if (Array.isArray(users) && users.length > 0) return;
  const seed = [
    { id: "u-admin", username: "admin", pin: "1234", isAdmin: true },
    { id: "u-user", username: "user", pin: "1111", isAdmin: false },
  ];
  const hashed = seed.map((u) => ({
    id: u.id,
    username: u.username,
    pinHash: bcrypt.hashSync(u.pin, 10),
    isAdmin: !!u.isAdmin,
  }));
  db().set("users", hashed).write();
  try {
    const raw = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    raw.users = db().get("users").value();
    fs.writeFileSync(DB_FILE, JSON.stringify(raw, null, 2));
  } catch (e) {}
}

if (!db().has("users").value()) {
  db().set("users", []).write();
}
seedUsersIfEmpty();

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

server.get("/auth/me", authRequired, (req, res) => {
  const u = req.user;
  res.json({ user: { id: u.sub, username: u.username, isAdmin: !!u.isAdmin } });
});

server.use((req, res, next) => {
  if (req.path.startsWith("/auth/")) return next();
  return authRequired(req, res, next);
});

server.use((req, res, next) => {
  if (req.path.startsWith("/users")) {
    const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
    if (!req.user?.isAdmin) {
      if (isWrite && req.method === "PATCH") {
        const id = (req.path.split("/")[2] || "").trim();
        if (!id || id !== req.user?.sub) {
          return res.status(403).json({ error: "Admins only" });
        }
        return next();
      }
      if (isWrite) return res.status(403).json({ error: "Admins only" });
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

server.use((req, res, next) => {
  if (!req.path.startsWith("/clubs")) return next();
  const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  if (!isWrite) return next();
  if (req.user?.isAdmin) return next();
  if (req.method === "PUT") {
    const id = req.path.split("/")[2];
    const existing = db().get("clubs").find({ id }).value();
    if (!existing) return res.status(404).json({ error: "Not found" });
    const incoming = req.body;
    const sameCore =
      incoming.name === existing.name &&
      incoming.capacity === existing.capacity &&
      JSON.stringify(incoming.members) === JSON.stringify(existing.members);
    if (!sameCore) return res.status(403).json({ error: "Read-only" });
    const prevEvents = existing.events || [];
    const nextEvents = incoming.events || [];
    if (nextEvents.length !== prevEvents.length + 1) {
      return res.status(403).json({ error: "Only adding one event allowed" });
    }
    const prefixSame =
      JSON.stringify(prevEvents) === JSON.stringify(nextEvents.slice(0, -1));
    if (!prefixSame)
      return res.status(403).json({ error: "Only adding one event allowed" });
    return next();
  }
  if (req.method === "PATCH") {
    const id = req.path.split("/")[2];
    const existing = db().get("clubs").find({ id }).value();
    if (!existing) return res.status(404).json({ error: "Not found" });
    const incoming = req.body || {};
    const keys = Object.keys(incoming);
    if (keys.length === 0) return res.status(400).json({ error: "No changes" });
    if (keys.some((k) => k !== "members"))
      return res.status(403).json({ error: "Read-only" });
    const prevMembers = Array.isArray(existing.members) ? existing.members : [];
    const nextMembers = Array.isArray(incoming.members) ? incoming.members : [];
    const userId = req.user?.sub;
    const userName = req.user?.username;
    const prevWithoutUser = prevMembers.filter((m) => m.id !== userId);
    const nextWithoutUser = nextMembers.filter((m) => m.id !== userId);
    const sameOthers =
      JSON.stringify(prevWithoutUser) === JSON.stringify(nextWithoutUser);
    if (!sameOthers) return res.status(403).json({ error: "Read-only" });
    const hadSeat = prevMembers.some((m) => m.id === userId);
    const hasSeatNext = nextMembers.some((m) => m.id === userId);
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
    if (hadSeat && !hasSeatNext) {
      if (nextMembers.length !== prevMembers.length - 1)
        return res.status(403).json({ error: "Invalid change" });
      return next();
    }
    return res.status(403).json({ error: "Read-only" });
  }
  return res.status(403).json({ error: "Admins only" });
});

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

server.post("/users", (req, res) => {
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

server.use(router);
router.render = (req, res) => {
  res.jsonp(res.locals.data);
};

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
```

---

## Try it

- Install deps for the API: `npm i -D concurrently bcryptjs jsonwebtoken json-server`
- Start both servers: `npm run dev`
- Open Angular at http://localhost:4200 and log in after Class 18 is in place; network calls should hit `/api/...` and proxy to port 3001.

## Notes

- The client must use `API_BASE = '/api'` exactly (not a full host) to match the final project and avoid CORS in dev.
- Users are seeded automatically if none exist; db.json will be updated as you interact with the app.
