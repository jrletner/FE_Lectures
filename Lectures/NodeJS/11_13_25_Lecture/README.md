# Student Practice Walkthrough – Express.js Modular Routing & Logging (Users, Tasks, Assignments)

In this lecture you’ll build a full mini API with three related resources using **modular routers** and a **global logging middleware**. All data lives in simple in‑memory arrays (so restarts reset state). Every exercise’s code is line‑by‑line commented for learning clarity. At the end you’ll get a compact, uncommented production‑style composite.

- Express docs: https://expressjs.com/

You will build 5 focused demos:

- Part A — Project setup + global logging middleware
- Part B — Users CRUD router (users.js)
- Part C — Tasks CRUD router (tasks.js)
- Part D — Assignments CRUD router (assignments.js) with validation + duplicate prevention
- Part E — Final composite (uncommented) bringing everything together

---

## Why this matters for real APIs

You’ll practice:

- Separating resource logic into dedicated router modules (`express.Router()`).
- Using a consistent CRUD shape (list, get one, create, patch, delete).
- Composing validation & logging middleware.
- Modeling simple relations (Assignments link Users ↔ Tasks).
- Returning proper HTTP status codes (201, 400, 404, 409, 204).

## One‑time setup (for each part folder)

```bash
npm init -y
npm install express
npm install -D nodemon
```

Add scripts to `package.json`:

```json
"scripts": {
	"start": "node server.js",
	"dev": "nodemon server.js"
}
```

Run:

```bash
npm run dev   # auto reload while practicing
# or
npm start     # plain node
```

Port: all examples use `http://localhost:3000`.

---

## Part A — Setup + Global Logging Middleware

Assignment: Create the server with JSON parsing and a global logger that prints method + URL + timestamp.

<details><summary><code>part-a/server.js</code></summary>

```js
// 1) Import Express and create app instance
const express = require("express"); // bring in Express framework
const app = express(); // create application object to register middleware & routes

// 2) Enable JSON body parsing globally
app.use(express.json()); // parses incoming application/json and assigns object to req.body

// 3) Global logging middleware (fires for every request before routes)
app.use((req, res, next) => {
  // standard middleware signature (req,res,next)
  const ts = new Date().toISOString(); // generate ISO timestamp string
  console.log(`[${ts}] ${req.method} ${req.url}`); // log timestamp + HTTP method + full URL path
  next(); // hand off control to next middleware / route handler
}); // end global logger registration

// 4) Simple health route so we can test logging
app.get("/ping", (req, res) => {
  // GET /ping handler function
  res.json({ pong: true }); // send JSON body {pong:true} with implicit 200 OK
}); // end GET /ping

// 5) Start server on port 3000
app.listen(3000, () => {
  // begin listening for incoming HTTP connections
  console.log("A: Server + global logger ready on http://localhost:3000"); // startup confirmation message
}); // end listen call
```

</details>

### Run & Observe

- GET /ping → terminal shows log line with timestamp.
- Repeated calls show different timestamps; middleware runs before route.

### Key Points

- Logging middleware placed before routes ensures coverage of all endpoints.
- Always call `next()` or the request will hang.

---

## Part B — Users CRUD Router

Assignment: Implement full CRUD for Users in `routes/users.js` and mount with `/users` prefix.

<details><summary><code>part-b/routes/users.js</code></summary>

```js
// Users router module (handles /users resource operations)
const express = require("express"); // import Express
const router = express.Router(); // create isolated Router instance

// In-memory users collection (reset on restart)
let users = [
  // array holds user objects
  { id: 1, name: "Ada", role: "admin" }, // seed user #1
  { id: 2, name: "Bao", role: "user" }, // seed user #2
]; // end seed array

// Helper to get next unique id
const nextId = () =>
  // function declaration using arrow syntax
  users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1; // if non-empty take max id + 1 else start at 1

// GET /users (list all)
router.get("/", (req, res) => {
  // route mounted at base path when server uses /users
  res.json(users); // respond with entire users array
}); // end GET list

// GET /users/:id (fetch one)
router.get("/:id", (req, res) => {
  // dynamic path segment :id
  const id = Number(req.params.id); // convert param string to number
  const user = users.find((u) => u.id === id); // locate user with matching id
  if (!user) return res.status(404).json({ error: "Not Found" }); // 404 if missing
  res.json(user); // return found user object
}); // end GET one

// POST /users (create)
router.post("/", (req, res) => {
  // creation endpoint
  const { name, role } = req.body; // destructure expected fields from parsed JSON body
  if (!name || !role)
    // validate presence of both name and role
    return res.status(400).json({ error: "name and role required" }); // 400 Bad Request if invalid
  const user = { id: nextId(), name, role }; // construct new user object with generated id
  users.push(user); // append new user (mutation OK for simple teaching demo)
  res.status(201).json(user); // return 201 Created + resource
}); // end POST create

// PATCH /users/:id (partial update)
router.patch("/:id", (req, res) => {
  // patch endpoint allowing partial field changes
  const id = Number(req.params.id); // numeric id
  const existing = users.find((u) => u.id === id); // locate existing user
  if (!existing) return res.status(404).json({ error: "Not Found" }); // 404 if missing
  const updated = { ...existing, ...req.body }; // shallow merge existing user with provided body fields
  users = users.map((u) => (u.id === id ? updated : u)); // replace only matching user using immutable map
  res.json(updated); // respond with updated user
}); // end PATCH

// DELETE /users/:id (remove)
router.delete("/:id", (req, res) => {
  // deletion endpoint
  const id = Number(req.params.id); // numeric conversion
  if (!users.some((u) => u.id === id))
    // check existence quickly
    return res.status(404).json({ error: "Not Found" }); // 404 if not found
  users = users.filter((u) => u.id !== id); // filter out removed user
  res.status(204).send(); // 204 No Content success response (no body)
}); // end DELETE

module.exports = router; // export router instance for mounting in server.js
```

</details>

<details><summary><code>part-b/server.js</code></summary>

```js
// Server wiring for Users router with global logging
const express = require("express"); // import Express
const usersRouter = require("./routes/users"); // import users router module relative path
const app = express(); // create app instance

app.use(express.json()); // enable JSON body parsing

// Global logging middleware (same pattern from Part A)
app.use((req, res, next) => {
  // logger middleware function
  console.log(`[USERS API] ${req.method} ${req.url}`); // log method + url under USERS API tag
  next(); // pass control onward
}); // end logger

// Mount users router at /users prefix
app.use("/users", usersRouter); // all users routes inherit /users base path

// Start server
app.listen(3000, () => {
  // listen on port 3000
  console.log("B: Users router live on /users"); // startup log line
}); // end listen
```

</details>

### Run & Observe

- GET /users → list seed users.
- POST /users → create new user (returns 201).
- PATCH /users/:id → modifies specified fields.
- DELETE /users/:id → returns 204 then user gone.

### Key Points

- Router keeps user logic isolated – server only mounts.
- Logging middleware shows each request uniformly.

---

## Part C — Tasks CRUD Router

Assignment: Implement full CRUD for tasks (`title`, `completed` boolean) in `routes/tasks.js`.

<details><summary><code>part-c/routes/tasks.js</code></summary>

```js
// Tasks router module
const express = require("express"); // import framework
const router = express.Router(); // create router instance

// In-memory tasks array (each task has id, title, completed flag)
let tasks = [
  // seed tasks
  { id: 1, title: "Read", completed: false }, // seed task #1
  { id: 2, title: "Write", completed: false }, // seed task #2
]; // end seed array

// Helper to compute next id
const nextId = () =>
  // arrow function for id generation
  tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1; // max id + 1 OR 1 if empty

// GET /tasks (list all tasks)
router.get("/", (req, res) => {
  // root path relative to /tasks mount
  res.json(tasks); // respond with entire tasks array
}); // end GET list

// GET /tasks/:id (fetch one task by id)
router.get("/:id", (req, res) => {
  // dynamic segment :id
  const id = Number(req.params.id); // convert path param to number
  const task = tasks.find((t) => t.id === id); // locate matching task
  if (!task) return res.status(404).json({ error: "Not Found" }); // 404 if missing
  res.json(task); // return task object
}); // end GET one

// POST /tasks (create task; title required)
router.post("/", (req, res) => {
  // creation endpoint
  const { title } = req.body; // extract title from body
  if (!title) return res.status(400).json({ error: "title required" }); // validate presence
  const task = { id: nextId(), title, completed: false }; // create new task default completed false
  tasks.push(task); // append new task
  res.status(201).json(task); // respond 201 Created with task payload
}); // end POST

// PATCH /tasks/:id (partial update; allows toggling completed or renaming title)
router.patch("/:id", (req, res) => {
  // patch endpoint
  const id = Number(req.params.id); // numeric conversion
  const existing = tasks.find((t) => t.id === id); // find existing task
  if (!existing) return res.status(404).json({ error: "Not Found" }); // 404 if not found
  const updated = { ...existing, ...req.body }; // merge partial fields from body
  tasks = tasks.map((t) => (t.id === id ? updated : t)); // replace only target task
  res.json(updated); // send updated task back
}); // end PATCH

// DELETE /tasks/:id (remove task)
router.delete("/:id", (req, res) => {
  // delete endpoint
  const id = Number(req.params.id); // numeric id
  if (!tasks.some((t) => t.id === id))
    // ensure task exists first
    return res.status(404).json({ error: "Not Found" }); // 404 if absent
  tasks = tasks.filter((t) => t.id !== id); // remove matching task
  res.status(204).send(); // success no content
}); // end DELETE

module.exports = router; // export tasks router
```

</details>

<details><summary><code>part-c/server.js</code></summary>

```js
// Server wiring for Tasks router with logging
const express = require("express"); // import Express
const tasksRouter = require("./routes/tasks"); // import tasks router
const app = express(); // create app instance

app.use(express.json()); // global JSON parsing

app.use((req, res, next) => {
  // global logger
  console.log(`[TASKS API] ${req.method} ${req.url}`); // log request details
  next(); // continue chain
}); // end logger

app.use("/tasks", tasksRouter); // mount tasks router at /tasks prefix

app.listen(3000, () => {
  // start server
  console.log("C: Tasks router live on /tasks"); // startup message
}); // end listen
```

</details>

### Run & Observe

- POST /tasks with missing title → 400 error.
- PATCH /tasks/:id {"completed":true} toggles completion.
- DELETE /tasks/:id returns 204 and removes task.

### Key Points

- Same CRUD pattern as Users for consistency.
- `completed` boolean is optional to patch; omitted fields remain unchanged.

---

## Part D — Assignments CRUD Router (Join + Validation)

Assignment: Manage assignments linking a user to a task. Validate foreign keys and prevent duplicate (same userId & taskId). Implement list, get one, create, patch (reassign), delete.

<details><summary><code>part-d/routes/assignments.js</code></summary>

```js
// Assignments router: links users ↔ tasks via userId & taskId
const express = require("express"); // import Express
const router = express.Router(); // create router instance

// Shared base data (would usually import from separate modules)
const users = [
  // user records for FK validation
  { id: 1, name: "Ada", role: "admin" }, // user 1
  { id: 2, name: "Bao", role: "user" }, // user 2
]; // end users
const tasks = [
  // task records for FK validation
  { id: 1, title: "Read", completed: false }, // task 1
  { id: 2, title: "Write", completed: false }, // task 2
]; // end tasks

// In-memory assignments (each links userId + taskId)
let assignments = [
  // seed assignments
  { id: 1, userId: 1, taskId: 2 }, // assignment linking Ada -> Write
]; // end seed array

// Helper for next assignment id
const nextId = () =>
  // arrow function for id generation
  assignments.length ? Math.max(...assignments.map((a) => a.id)) + 1 : 1; // compute next id or start at 1

// Validation: ensure numeric userId & taskId, and that referenced records exist
function validateForeignKeys(req, res, next) {
  // middleware for FK validation
  const { userId, taskId } = req.body; // extract identifiers from request body
  if (typeof userId !== "number" || typeof taskId !== "number")
    // check numeric types
    return res.status(400).json({ error: "userId & taskId numeric required" }); // 400 if invalid types
  if (!users.some((u) => u.id === userId))
    // verify user exists
    return res.status(400).json({ error: "invalid userId" }); // 400 invalid user
  if (!tasks.some((t) => t.id === taskId))
    // verify task exists
    return res.status(400).json({ error: "invalid taskId" }); // 400 invalid task
  next(); // all good → advance
} // end validateForeignKeys

// Duplicate prevention: disallow existing pair
function preventDuplicate(req, res, next) {
  // middleware for uniqueness
  const { userId, taskId } = req.body; // extract IDs
  if (assignments.some((a) => a.userId === userId && a.taskId === taskId))
    // check for existing pair
    return res.status(409).json({ error: "assignment exists" }); // 409 Conflict on duplicate
  next(); // proceed if no duplicate found
} // end preventDuplicate

// GET /assignments (list all assignments)
router.get("/", (req, res) => {
  // list endpoint
  res.json(assignments); // respond with all assignment records
}); // end GET list

// GET /assignments/:id (fetch one)
router.get("/:id", (req, res) => {
  // get one endpoint
  const id = Number(req.params.id); // numeric conversion of path param
  const assignment = assignments.find((a) => a.id === id); // locate assignment by id
  if (!assignment) return res.status(404).json({ error: "Not Found" }); // 404 if absent
  res.json(assignment); // return assignment object
}); // end GET one

// POST /assignments (create new assignment)
router.post("/", [validateForeignKeys, preventDuplicate], (req, res) => {
  // create endpoint with middleware chain
  const { userId, taskId } = req.body; // destructure IDs from body
  const assignment = { id: nextId(), userId, taskId }; // create new assignment record
  assignments.push(assignment); // append to assignments array
  res.status(201).json(assignment); // respond 201 Created
}); // end POST

// PATCH /assignments/:id (reassign userId or taskId)
router.patch("/:id", [validateForeignKeys], (req, res) => {
  // patch endpoint with FK validation (duplicate check optional)
  const id = Number(req.params.id); // numeric id
  const existing = assignments.find((a) => a.id === id); // locate existing assignment
  if (!existing) return res.status(404).json({ error: "Not Found" }); // 404 if missing
  const { userId, taskId } = req.body; // updated fields (validated present & valid if numeric)
  // Optional: duplicate check on reassignment
  if (
    assignments.some(
      (a) => a.id !== id && a.userId === userId && a.taskId === taskId
    )
  )
    // ensure no other identical pair
    return res.status(409).json({ error: "assignment exists" }); // conflict if pair already used by another id
  const updated = { ...existing, userId, taskId }; // build updated assignment object
  assignments = assignments.map((a) => (a.id === id ? updated : a)); // replace element immutably
  res.json(updated); // respond with updated assignment
}); // end PATCH

// DELETE /assignments/:id (remove)
router.delete("/:id", (req, res) => {
  // deletion endpoint
  const id = Number(req.params.id); // numeric id
  if (!assignments.some((a) => a.id === id))
    // existence check
    return res.status(404).json({ error: "Not Found" }); // 404 if missing
  assignments = assignments.filter((a) => a.id !== id); // remove assignment by id
  res.status(204).send(); // success no content
}); // end DELETE

module.exports = router; // export assignments router module
```

</details>

<details><summary><code>part-d/server.js</code></summary>

```js
// Server wiring for Assignments router with logging
const express = require("express"); // import Express
const assignmentsRouter = require("./routes/assignments"); // import assignments router
const app = express(); // create app

app.use(express.json()); // global JSON parser

app.use((req, res, next) => {
  // logging middleware
  console.log(`[ASSIGNMENTS API] ${req.method} ${req.url}`); // log details tagged
  next(); // continue chain
}); // end logger

app.use("/assignments", assignmentsRouter); // mount assignments router prefix

app.listen(3000, () => {
  // start HTTP server
  console.log("D: Assignments router live on /assignments"); // startup confirmation
}); // end listen
```

</details>

### Run & Observe

- POST /assignments duplicate pair → 409 Conflict.
- PATCH /assignments/:id can reassign to different user/task (valid & unique).
- DELETE /assignments/:id returns 204 then removed from list.

### Key Points

- Foreign key validation prevents references to non-existent user/task.
- Duplicate prevention ensures uniqueness of userId + taskId pair.
- Patch route enforces uniqueness when changing assignment.

---

## Part E — Final Composite (Uncommented Production Style)

Below are succinct modules without comments, showing logging + three routers mounted together.

<details><summary><code>final/routes/users.js</code></summary>

```js
const express = require("express");
const router = express.Router();
let users = [
  { id: 1, name: "Ada", role: "admin" },
  { id: 2, name: "Bao", role: "user" },
];
const nextId = () =>
  users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
router.get("/", (req, res) => {
  res.json(users);
});
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "Not Found" });
  res.json(user);
});
router.post("/", (req, res) => {
  const { name, role } = req.body;
  if (!name || !role)
    return res.status(400).json({ error: "name and role required" });
  const user = { id: nextId(), name, role };
  users.push(user);
  res.status(201).json(user);
});
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = users.find((u) => u.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  users = users.map((u) => (u.id === id ? updated : u));
  res.json(updated);
});
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!users.some((u) => u.id === id))
    return res.status(404).json({ error: "Not Found" });
  users = users.filter((u) => u.id !== id);
  res.status(204).send();
});
module.exports = router;
```

</details>

<details><summary><code>final/routes/tasks.js</code></summary>

```js
const express = require("express");
const router = express.Router();
let tasks = [
  { id: 1, title: "Read", completed: false },
  { id: 2, title: "Write", completed: false },
];
const nextId = () =>
  tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
router.get("/", (req, res) => {
  res.json(tasks);
});
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Not Found" });
  res.json(task);
});
router.post("/", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const task = { id: nextId(), title, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = tasks.find((t) => t.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  tasks = tasks.map((t) => (t.id === id ? updated : t));
  res.json(updated);
});
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!tasks.some((t) => t.id === id))
    return res.status(404).json({ error: "Not Found" });
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).send();
});
module.exports = router;
```

</details>

<details><summary><code>final/routes/assignments.js</code></summary>

```js
const express = require("express");
const router = express.Router();
const users = [
  { id: 1, name: "Ada", role: "admin" },
  { id: 2, name: "Bao", role: "user" },
];
const tasks = [
  { id: 1, title: "Read", completed: false },
  { id: 2, title: "Write", completed: false },
];
let assignments = [{ id: 1, userId: 1, taskId: 2 }];
const nextId = () => {
  return assignments.length ? Math.max(...assignments.map((a) => a.id)) + 1 : 1;
};
function validateForeignKeys(req, res, next) {
  const { userId, taskId } = req.body;
  if (typeof userId !== "number" || typeof taskId !== "number")
    return res.status(400).json({ error: "userId & taskId numeric required" });
  if (!users.some((u) => u.id === userId))
    return res.status(400).json({ error: "invalid userId" });
  if (!tasks.some((t) => t.id === taskId))
    return res.status(400).json({ error: "invalid taskId" });
  next();
}
function preventDuplicate(req, res, next) {
  const { userId, taskId } = req.body;
  if (assignments.some((a) => a.userId === userId && a.taskId === taskId))
    return res.status(409).json({ error: "assignment exists" });
  next();
}
router.get("/", (req, res) => {
  res.json(assignments);
});
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const a = assignments.find((a) => a.id === id);
  if (!a) return res.status(404).json({ error: "Not Found" });
  res.json(a);
});
router.post("/", [validateForeignKeys, preventDuplicate], (req, res) => {
  const { userId, taskId } = req.body;
  const a = { id: nextId(), userId, taskId };
  assignments.push(a);
  res.status(201).json(a);
});
router.patch("/:id", [validateForeignKeys], (req, res) => {
  const id = Number(req.params.id);
  const existing = assignments.find((a) => a.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const { userId, taskId } = req.body;
  if (
    assignments.some(
      (a) => a.id !== id && a.userId === userId && a.taskId === taskId
    )
  )
    return res.status(409).json({ error: "assignment exists" });
  const updated = { ...existing, userId, taskId };
  assignments = assignments.map((a) => (a.id === id ? updated : a));
  res.json(updated);
});
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!assignments.some((a) => a.id === id))
    return res.status(404).json({ error: "Not Found" });
  assignments = assignments.filter((a) => a.id !== id);
  res.status(204).send();
});
module.exports = router;
```

</details>

<details><summary><code>final/server.js</code></summary>

```js
const express = require("express");
const usersRouter = require("./routes/users");
const tasksRouter = require("./routes/tasks");
const assignmentsRouter = require("./routes/assignments");
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);
app.use("/assignments", assignmentsRouter);
app.listen(3000, () =>
  console.log("E: Composite API on http://localhost:3000")
);
```

</details>

### Try It

- Start composite: `npm run dev` then exercise endpoints.
- Confirm logging lines show each resource tag.

### Extension Ideas

- Add relational endpoints (e.g. `/users/:id/tasks`) assembling tasks from assignments.
- Introduce auth middleware (API key / JWT) ahead of routers.
- Extract data arrays into separate model modules for reuse in tests.
