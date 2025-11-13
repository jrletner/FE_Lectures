# Student Practice Walkthrough – Express.js Fundamentals (In‑Memory CRUD)

In this lecture you’ll build small Express APIs that use an in‑memory array as the “database.” So changes only live for the process lifetime (restart resets data).

You will build 12 small demos (each implements full CRUD):

- Part A — Users CRUD
- Part B — Products CRUD
- Part C — Books CRUD
- Part D — Tasks CRUD
- Part E — Posts CRUD
- Part F — Comments CRUD
- Part G — Orders CRUD
- Part H — Tickets CRUD
- Part I — Courses CRUD
- Part J — Movies CRUD
- Part K — Devices CRUD
- Part L — Notes CRUD

---

## Why this matters for real Express APIs

You’ll repeatedly:

- Parse JSON request bodies (create/update).
- Read path params for “get one”, update, and delete.
- Implement the classic CRUD shape for resources.
- Validate input and return meaningful status codes.
- Practice safe immutable updates to arrays.

## One‑time: How to run each part

Each part stands alone in its own folder. Create `app.js` for the part, paste the code, then:

```
npm init -y
npm install express
node app.js
```

Port: all parts use `http://localhost:3000`.

---

## Part A — Users CRUD

Assignment: Build a users API with an in‑memory array and full CRUD.

- Implement GET all, GET one, POST, PATCH, DELETE.

Backend tie‑in (simple):

- Your first end‑to‑end resource API shape.

<details><summary><code>part-a/app.js</code></summary>

```js
// 1) Import express and create the app
const express = require("express");
const app = express();
app.use(express.json()); // Parse JSON request bodies

// 2) In-memory "DB" (copy from data.json)
let users = [
  { id: 1, name: "Ada", role: "admin" },
  { id: 2, name: "Bao", role: "user" },
  { id: 3, name: "Caro", role: "editor" },
];

// 3) Helpers
const nextId = () =>
  users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;

// 4) CRUD routes
// List all
app.get("/users", (req, res) => {
  res.json(users);
});

// Get one
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "Not Found" });
  res.json(user);
});

// Create
app.post("/users", (req, res) => {
  const { name, role } = req.body;
  if (!name || !role)
    return res.status(400).json({ error: "name and role required" });
  const user = { id: nextId(), name, role };
  users = [...users, user]; // immutable append
  res.status(201).json(user);
});

// Partial update
app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "Not Found" });
  const updated = { ...user, ...req.body };
  users = users.map((u) => (u.id === id ? updated : u));
  res.json(updated);
});

// Delete
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!users.some((u) => u.id === id))
    return res.status(404).json({ error: "Not Found" });
  users = users.filter((u) => u.id !== id);
  res.status(204).send();
});

// 5) Start server
app.listen(3000, () => console.log("A: Users API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- GET /users → 200 JSON array of 3 users.
- GET /users/1 → 200 JSON Ada; unknown id → 404.
- POST /users {"name":"Dee","role":"user"} → 201 created.
- PATCH /users/2 {"role":"admin"} → 200 updated.
- DELETE /users/3 → 204; then GET /users shows it removed.

### Commented code highlights

- Import Express and create the app; enable `express.json()` to parse JSON request bodies.
- Seed in-memory array `users` with objects that have `id`, `name`, and `role`.
- `nextId()` computes the next numeric id using the current max.
- `GET /users` returns the whole array as JSON.
- `GET /users/:id` reads `:id`, finds a match, and returns 404 if missing.
- `POST /users` validates required fields, creates a new object, immutably appends it, and returns 201 with the created user.
- `PATCH /users/:id` shallow-merges fields using object spread and replaces only the matching element.
- `DELETE /users/:id` checks existence, filters it out, and returns 204 No Content.
- `app.listen(3000)` starts the server on localhost.

---

## Part B — Products CRUD

Assignment: Same CRUD shape for products with price.

<details><summary><code>part-b/app.js</code></summary>

```js
// Part B – Products CRUD (adds price validation)
// 1) Import & init Express
const express = require("express");
const app = express();
app.use(express.json()); // Parse JSON bodies

// 2) Seed in-memory products array (acts like data.json)
let products = [
  { id: 1, name: "Pen", price: 2.5 },
  { id: 2, name: "Pad", price: 4.0 },
  { id: 3, name: "Pencil", price: 1.75 },
];

// 3) Helper to compute next id (max + 1 or start at 1)
const nextId = () =>
  products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;

// 4) READ ALL – GET /products returns entire array
app.get("/products", (req, res) => {
  res.json(products);
});

// 5) READ ONE – GET /products/:id finds by numeric id, 404 if missing
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id); // params are strings
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Not Found" });
  res.json(product);
});

// 6) CREATE – POST /products validates name & price type
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== "number") {
    return res.status(400).json({ error: "name and numeric price required" });
  }
  const product = { id: nextId(), name, price };
  products = [...products, product]; // immutable append
  res.status(201).json(product);
});

// 7) PARTIAL UPDATE – PATCH merges only provided fields
app.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = products.find((p) => p.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body }; // shallow merge
  products = products.map((p) => (p.id === id ? updated : p));
  res.json(updated);
});

// 8) DELETE – removes product by id and returns 204
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!products.some((p) => p.id === id)) {
    return res.status(404).json({ error: "Not Found" });
  }
  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

// 9) Start server
app.listen(3000, () => console.log("B: Products API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- GET /products, GET /products/1, POST /products { name, price }, PATCH, DELETE.

### Commented code highlights

- App + `express.json()` setup for JSON parsing.
- In-memory `products` array holds `{ id, name, price }`.
- `nextId()` derives the next id; keeps ids unique per run.
- `GET /products` lists all products.
- `GET /products/:id` returns one or 404 when not found.
- `POST /products` requires `name` and numeric `price`; returns 201 with new product.
- `PATCH /products/:id` merges incoming fields; replaces only the matching product.
- `DELETE /products/:id` removes by id with 204 when successful.

---

## Part C — Books CRUD

Assignment: CRUD for books with author and year.

<details><summary><code>part-c/app.js</code></summary>

```js
// Part C – Books CRUD (adds author + year fields)
const express = require("express");
const app = express();
app.use(express.json()); // JSON body parsing

// Seed array of books (acts as our DB for this part)
let books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", year: 2008 },
  { id: 2, title: "Refactoring", author: "Martin Fowler", year: 1999 },
];

// Helper for new ids
const nextId = () =>
  books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;

// GET all books
app.get("/books", (req, res) => {
  res.json(books);
});

// GET one book
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);
  if (!book) return res.status(404).json({ error: "Not Found" });
  res.json(book);
});

// CREATE book (requires title, author, numeric year)
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || typeof year !== "number") {
    return res
      .status(400)
      .json({ error: "title, author, numeric year required" });
  }
  const book = { id: nextId(), title, author, year };
  books = [...books, book];
  res.status(201).json(book);
});

// PATCH book (partial update)
app.patch("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = books.find((b) => b.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  books = books.map((b) => (b.id === id ? updated : b));
  res.json(updated);
});

// DELETE book
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!books.some((b) => b.id === id))
    return res.status(404).json({ error: "Not Found" });
  books = books.filter((b) => b.id !== id);
  res.status(204).send();
});

// Start server
app.listen(3000, () => console.log("C: Books API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /books.

### Commented code highlights

- `books` seed includes `title`, `author`, and `year` fields.
- `GET /books` returns all; `GET /books/:id` finds one or 404.
- `POST /books` requires `title`, `author`, and numeric `year`; returns 201 on success.
- `PATCH /books/:id` shallow merges fields; unchanged fields are preserved.
- `DELETE /books/:id` filters out the target and returns 204.

---

## Part D — Tasks CRUD

Assignment: CRUD for tasks with done flag; demonstrate partial updates.

<details><summary><code>part-d/app.js</code></summary>

```js
// Part D – Tasks CRUD (boolean done flag)
const express = require("express");
const app = express();
app.use(express.json()); // enable JSON body parsing

// Seed tasks array
let tasks = [
  { id: 1, text: "Read", done: false },
  { id: 2, text: "Write", done: false },
];

// Helper for next id
const nextId = () =>
  tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// GET one task
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Not Found" });
  res.json(task);
});

// CREATE task (requires text)
app.post("/tasks", (req, res) => {
  const { text, done = false } = req.body;
  if (!text) return res.status(400).json({ error: "text required" });
  const task = { id: nextId(), text, done: Boolean(done) };
  tasks = [...tasks, task];
  res.status(201).json(task);
});

// PATCH task (toggle or edit text/done)
app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = tasks.find((t) => t.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  tasks = tasks.map((t) => (t.id === id ? updated : t));
  res.json(updated);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!tasks.some((t) => t.id === id))
    return res.status(404).json({ error: "Not Found" });
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).send();
});

// Start server
app.listen(3000, () => console.log("D: Tasks API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /tasks.

### Commented code highlights

- `tasks` seed has `text` and boolean `done`.
- `POST /tasks` requires `text`; defaults `done` to `false` if omitted.
- `PATCH /tasks/:id` toggles or updates `done` and/or `text` using a merge.
- Other handlers mirror the list/get/delete patterns from prior parts.

---

## Part E — Posts CRUD

Assignment: CRUD for posts with title/body and simple validation.

<details><summary><code>part-e/app.js</code></summary>

```js
// Part E – Posts CRUD (title required, body optional)
const express = require("express");
const app = express();
app.use(express.json());

// Seed posts
let posts = [
  { id: 1, title: "Hello", body: "First" },
  { id: 2, title: "Update", body: "News" },
];
const nextId = () =>
  posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

// GET all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// GET one post
app.get("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ error: "Not Found" });
  res.json(post);
});

// CREATE post (title required)
app.post("/posts", (req, res) => {
  const { title, body = "" } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const post = { id: nextId(), title, body };
  posts = [...posts, post];
  res.status(201).json(post);
});

// PATCH post
app.patch("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = posts.find((p) => p.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  posts = posts.map((p) => (p.id === id ? updated : p));
  res.json(updated);
});

// DELETE post
app.delete("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!posts.some((p) => p.id === id))
    return res.status(404).json({ error: "Not Found" });
  posts = posts.filter((p) => p.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("E: Posts API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /posts.

### Commented code highlights

- `posts` seed has `title` and `body`.
- `POST /posts` requires `title`; optional `body` defaults to empty string.
- `PATCH` merges fields to support partial edits.
- 404s on unknown ids; 201 on create; 204 on delete.

---

## Part F — Comments CRUD

Assignment: CRUD for comments with postId, text.

<details><summary><code>part-f/app.js</code></summary>

```js
// Part F – Comments CRUD (relational field postId)
const express = require("express");
const app = express();
app.use(express.json());

// Seed comments referencing a postId (still just a number here)
let comments = [
  { id: 1, postId: 2, text: "Nice" },
  { id: 2, postId: 2, text: "Thanks" },
];
const nextId = () =>
  comments.length ? Math.max(...comments.map((c) => c.id)) + 1 : 1;

// GET all comments
app.get("/comments", (req, res) => {
  res.json(comments);
});

// GET one comment
app.get("/comments/:id", (req, res) => {
  const id = Number(req.params.id);
  const comment = comments.find((c) => c.id === id);
  if (!comment) return res.status(404).json({ error: "Not Found" });
  res.json(comment);
});

// CREATE comment (requires numeric postId & text)
app.post("/comments", (req, res) => {
  const { postId, text } = req.body;
  if (typeof postId !== "number" || !text) {
    return res.status(400).json({ error: "postId (number) and text required" });
  }
  const comment = { id: nextId(), postId, text };
  comments = [...comments, comment];
  res.status(201).json(comment);
});

// PATCH comment
app.patch("/comments/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = comments.find((c) => c.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  comments = comments.map((c) => (c.id === id ? updated : c));
  res.json(updated);
});

// DELETE comment
app.delete("/comments/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!comments.some((c) => c.id === id))
    return res.status(404).json({ error: "Not Found" });
  comments = comments.filter((c) => c.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("F: Comments API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /comments.

### Commented code highlights

- `comments` seed demonstrates a related key: `postId`.
- `POST /comments` validates numeric `postId` and non-empty `text`.
- Other routes follow the same CRUD contract (404 on missing id, 201 on create, 204 on delete).

---

## Part G — Orders CRUD

Assignment: CRUD for orders with total and status.

<details><summary><code>part-g/app.js</code></summary>

```js
// Part G – Orders CRUD (numeric total + status)
const express = require("express");
const app = express();
app.use(express.json());

let orders = [
  { id: 1, total: 12, status: "paid" },
  { id: 2, total: 30, status: "pending" },
];
const nextId = () =>
  orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;

// GET all orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// GET one order
app.get("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: "Not Found" });
  res.json(order);
});

// CREATE order (requires numeric total & status)
app.post("/orders", (req, res) => {
  const { total, status } = req.body;
  if (typeof total !== "number" || !status) {
    return res.status(400).json({ error: "numeric total and status required" });
  }
  const order = { id: nextId(), total, status };
  orders = [...orders, order];
  res.status(201).json(order);
});

// PATCH order
app.patch("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = orders.find((o) => o.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  orders = orders.map((o) => (o.id === id ? updated : o));
  res.json(updated);
});

// DELETE order
app.delete("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!orders.some((o) => o.id === id))
    return res.status(404).json({ error: "Not Found" });
  orders = orders.filter((o) => o.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("G: Orders API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /orders.

### Commented code highlights

- `orders` seed uses `total` (number) and `status` (string).
- `POST /orders` enforces numeric `total` and non-empty `status`.
- Standard GET/PATCH/DELETE patterns with shallow merge for updates.

---

## Part H — Tickets CRUD

Assignment: CRUD for tickets with title and priority.

<details><summary><code>part-h/app.js</code></summary>

```js
// Part H – Tickets CRUD (priority validation against allowed set)
const express = require("express");
const app = express();
app.use(express.json());

let tickets = [
  { id: 1, title: "Login bug", priority: "high" },
  { id: 2, title: "UI polish", priority: "low" },
];
const nextId = () =>
  tickets.length ? Math.max(...tickets.map((t) => t.id)) + 1 : 1;
const allowed = new Set(["low", "medium", "high"]); // allowed priorities

// GET all tickets
app.get("/tickets", (req, res) => {
  res.json(tickets);
});

// GET one ticket
app.get("/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return res.status(404).json({ error: "Not Found" });
  res.json(ticket);
});

// CREATE ticket (validates priority in allowed set)
app.post("/tickets", (req, res) => {
  const { title, priority } = req.body;
  if (!title || !allowed.has(priority)) {
    return res.status(400).json({ error: "title and valid priority required" });
  }
  const ticket = { id: nextId(), title, priority };
  tickets = [...tickets, ticket];
  res.status(201).json(ticket);
});

// PATCH ticket (reject invalid new priority)
app.patch("/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = tickets.find((t) => t.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  if (updated.priority && !allowed.has(updated.priority)) {
    return res.status(400).json({ error: "invalid priority" });
  }
  tickets = tickets.map((t) => (t.id === id ? updated : t));
  res.json(updated);
});

// DELETE ticket
app.delete("/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!tickets.some((t) => t.id === id))
    return res.status(404).json({ error: "Not Found" });
  tickets = tickets.filter((t) => t.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("H: Tickets API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /tickets.

### Commented code highlights

- `tickets` seed includes `title` and `priority` with an allowed set.
- `POST /tickets` validates `priority` in `low|medium|high`.
- `PATCH` rejects updates if `priority` becomes invalid.

---

## Part I — Courses CRUD

Assignment: CRUD for courses with name and credits.

<details><summary><code>part-i/app.js</code></summary>

```js
// Part I – Courses CRUD (numeric credits)
const express = require("express");
const app = express();
app.use(express.json());

let courses = [
  { id: 1, name: "Algebra", credits: 3 },
  { id: 2, name: "Biology", credits: 4 },
];
const nextId = () =>
  courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1;

// GET all courses
app.get("/courses", (req, res) => {
  res.json(courses);
});

// GET one course
app.get("/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const course = courses.find((c) => c.id === id);
  if (!course) return res.status(404).json({ error: "Not Found" });
  res.json(course);
});

// CREATE course (name & numeric credits)
app.post("/courses", (req, res) => {
  const { name, credits } = req.body;
  if (!name || typeof credits !== "number") {
    return res.status(400).json({ error: "name and numeric credits required" });
  }
  const course = { id: nextId(), name, credits };
  courses = [...courses, course];
  res.status(201).json(course);
});

// PATCH course
app.patch("/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = courses.find((c) => c.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  if (updated.credits !== undefined && typeof updated.credits !== "number") {
    return res.status(400).json({ error: "credits must be number" });
  }
  courses = courses.map((c) => (c.id === id ? updated : c));
  res.json(updated);
});

// DELETE course
app.delete("/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!courses.some((c) => c.id === id))
    return res.status(404).json({ error: "Not Found" });
  courses = courses.filter((c) => c.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("I: Courses API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /courses.

### Commented code highlights

- `courses` seed with `name` and numeric `credits`.
- `POST /courses` requires both; returns 201 on create.
- `PATCH /courses/:id` checks if `credits` stays a number when present.

---

## Part J — Movies CRUD

Assignment: CRUD for movies with title and year.

<details><summary><code>part-j/app.js</code></summary>

```js
// Part J – Movies CRUD (simple year validation ≥ 1888)
const express = require("express");
const app = express();
app.use(express.json());

let movies = [
  { id: 1, title: "Inception", year: 2010 },
  { id: 2, title: "Arrival", year: 2016 },
];
const nextId = () =>
  movies.length ? Math.max(...movies.map((m) => m.id)) + 1 : 1;

// GET all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// GET one movie
app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);
  if (!movie) return res.status(404).json({ error: "Not Found" });
  res.json(movie);
});

// CREATE movie (title + reasonable numeric year)
app.post("/movies", (req, res) => {
  const { title, year } = req.body;
  if (!title || typeof year !== "number" || year < 1888) {
    return res
      .status(400)
      .json({ error: "title and reasonable numeric year required" });
  }
  const movie = { id: nextId(), title, year };
  movies = [...movies, movie];
  res.status(201).json(movie);
});

// PATCH movie (validate new year if provided)
app.patch("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = movies.find((m) => m.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  if (
    updated.year !== undefined &&
    (typeof updated.year !== "number" || updated.year < 1888)
  ) {
    return res.status(400).json({ error: "invalid year" });
  }
  movies = movies.map((m) => (m.id === id ? updated : m));
  res.json(updated);
});

// DELETE movie
app.delete("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!movies.some((m) => m.id === id))
    return res.status(404).json({ error: "Not Found" });
  movies = movies.filter((m) => m.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("J: Movies API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /movies.

### Commented code highlights

- `movies` seed includes `title` and `year`.
- `POST /movies` enforces a "reasonable" year (>= 1888) and numeric type.
- `PATCH` validates `year` if provided; otherwise merges fields normally.

---

## Part K — Devices CRUD

Assignment: CRUD for devices with name and online flag.

<details><summary><code>part-k/app.js</code></summary>

```js
// Part K – Devices CRUD (boolean online flag)
const express = require("express");
const app = express();
app.use(express.json());

let devices = [
  { id: 1, name: "Sensor A", online: true },
  { id: 2, name: "Sensor B", online: false },
];
const nextId = () =>
  devices.length ? Math.max(...devices.map((d) => d.id)) + 1 : 1;

// GET all devices
app.get("/devices", (req, res) => {
  res.json(devices);
});

// GET one device
app.get("/devices/:id", (req, res) => {
  const id = Number(req.params.id);
  const device = devices.find((d) => d.id === id);
  if (!device) return res.status(404).json({ error: "Not Found" });
  res.json(device);
});

// CREATE device (name required; online defaults false)
app.post("/devices", (req, res) => {
  const { name, online = false } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const device = { id: nextId(), name, online: Boolean(online) };
  devices = [...devices, device];
  res.status(201).json(device);
});

// PATCH device
app.patch("/devices/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = devices.find((d) => d.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  devices = devices.map((d) => (d.id === id ? updated : d));
  res.json(updated);
});

// DELETE device
app.delete("/devices/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!devices.some((d) => d.id === id))
    return res.status(404).json({ error: "Not Found" });
  devices = devices.filter((d) => d.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("K: Devices API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /devices.

### Commented code highlights

- `devices` seed illustrates a boolean flag `online`.
- `POST /devices` requires `name`; coerces `online` to boolean.
- Standard CRUD patterns for get/update/delete.

---

## Part L — Notes CRUD

Assignment: CRUD for notes with title and content.

<details><summary><code>part-l/app.js</code></summary>

```js
// Part L – Notes CRUD (title + content, content optional)
const express = require("express");
const app = express();
app.use(express.json());

let notes = [
  { id: 1, title: "Todo", content: "Buy milk" },
  { id: 2, title: "Idea", content: "Start blog" },
];
const nextId = () =>
  notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1;

// GET all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// GET one note
app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);
  if (!note) return res.status(404).json({ error: "Not Found" });
  res.json(note);
});

// CREATE note (title required; content optional)
app.post("/notes", (req, res) => {
  const { title, content = "" } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const note = { id: nextId(), title, content };
  notes = [...notes, note];
  res.status(201).json(note);
});

// PATCH note
app.patch("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = notes.find((n) => n.id === id);
  if (!existing) return res.status(404).json({ error: "Not Found" });
  const updated = { ...existing, ...req.body };
  notes = notes.map((n) => (n.id === id ? updated : n));
  res.json(updated);
});

// DELETE note
app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!notes.some((n) => n.id === id))
    return res.status(404).json({ error: "Not Found" });
  notes = notes.filter((n) => n.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("L: Notes API on http://localhost:3000"));
```

</details>

### Run and Observe (Postman)

- Full CRUD on /notes.

### Commented code highlights

- `notes` seed includes `title` and `content`.
- `POST /notes` requires `title` and defaults `content` to empty string.
- `PATCH` merges edits; `DELETE` returns 204 on success.

---

## Final Code (No Comments) – Reference

Minimal versions for quick copy/paste (no explanatory comments). Each goes in `part-*/app.js`.

### Part A — Final `app.js`

<details><summary><code>part-a/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let users = [
  { id: 1, name: "Ada", role: "admin" },
  { id: 2, name: "Bao", role: "user" },
  { id: 3, name: "Caro", role: "editor" },
];
const nextId = () =>
  users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
app.get("/users", (req, res) => res.json(users));
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const u = users.find((x) => x.id === id);
  if (!u) return res.status(404).json({ error: "Not Found" });
  res.json(u);
});
app.post("/users", (req, res) => {
  const { name, role } = req.body;
  if (!name || !role)
    return res.status(400).json({ error: "name and role required" });
  const u = { id: nextId(), name, role };
  users = [...users, u];
  res.status(201).json(u);
});
app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const u = users.find((x) => x.id === id);
  if (!u) return res.status(404).json({ error: "Not Found" });
  const upd = { ...u, ...req.body };
  users = users.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!users.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  users = users.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("A: Users API"));
```

</details>

### Part B — Final `app.js`

<details><summary><code>part-b/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let products = [
  { id: 1, name: "Pen", price: 2.5 },
  { id: 2, name: "Pad", price: 4 },
  { id: 3, name: "Pencil", price: 1.75 },
];
const nextId = () =>
  products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
app.get("/products", (req, res) => res.json(products));
app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ error: "Not Found" });
  res.json(p);
});
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== "number")
    return res.status(400).json({ error: "name and numeric price required" });
  const prod = { id: nextId(), name, price };
  products = [...products, prod];
  res.status(201).json(prod);
});
app.patch("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ error: "Not Found" });
  const upd = { ...p, ...req.body };
  products = products.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!products.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  products = products.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("B: Products API"));
```

</details>

### Part C — Final `app.js`

<details><summary><code>part-c/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", year: 2008 },
  { id: 2, title: "Refactoring", author: "Martin Fowler", year: 1999 },
];
const nextId = () =>
  books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;
app.get("/books", (req, res) => res.json(books));
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const b = books.find((x) => x.id === id);
  if (!b) return res.status(404).json({ error: "Not Found" });
  res.json(b);
});
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || typeof year !== "number")
    return res
      .status(400)
      .json({ error: "title, author, numeric year required" });
  const book = { id: nextId(), title, author, year };
  books = [...books, book];
  res.status(201).json(book);
});
app.patch("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const b = books.find((x) => x.id === id);
  if (!b) return res.status(404).json({ error: "Not Found" });
  const upd = { ...b, ...req.body };
  books = books.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!books.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  books = books.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("C: Books API"));
```

</details>

### Part D — Final `app.js`

<details><summary><code>part-d/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let tasks = [
  { id: 1, text: "Read", done: false },
  { id: 2, text: "Write", done: false },
];
const nextId = () =>
  tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
app.get("/tasks", (req, res) => res.json(tasks));
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const t = tasks.find((x) => x.id === id);
  if (!t) return res.status(404).json({ error: "Not Found" });
  res.json(t);
});
app.post("/tasks", (req, res) => {
  const { text, done = false } = req.body;
  if (!text) return res.status(400).json({ error: "text required" });
  const task = { id: nextId(), text, done: Boolean(done) };
  tasks = [...tasks, task];
  res.status(201).json(task);
});
app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const t = tasks.find((x) => x.id === id);
  if (!t) return res.status(404).json({ error: "Not Found" });
  const upd = { ...t, ...req.body };
  tasks = tasks.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!tasks.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  tasks = tasks.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("D: Tasks API"));
```

</details>

### Part E — Final `app.js`

<details><summary><code>part-e/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let posts = [
  { id: 1, title: "Hello", body: "First" },
  { id: 2, title: "Update", body: "News" },
];
const nextId = () =>
  posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
app.get("/posts", (req, res) => res.json(posts));
app.get("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = posts.find((x) => x.id === id);
  if (!p) return res.status(404).json({ error: "Not Found" });
  res.json(p);
});
app.post("/posts", (req, res) => {
  const { title, body = "" } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const post = { id: nextId(), title, body };
  posts = [...posts, post];
  res.status(201).json(post);
});
app.patch("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = posts.find((x) => x.id === id);
  if (!p) return res.status(404).json({ error: "Not Found" });
  const upd = { ...p, ...req.body };
  posts = posts.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!posts.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  posts = posts.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("E: Posts API"));
```

</details>

### Part F — Final `app.js`

<details><summary><code>part-f/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let comments = [
  { id: 1, postId: 2, text: "Nice" },
  { id: 2, postId: 2, text: "Thanks" },
];
const nextId = () =>
  comments.length ? Math.max(...comments.map((c) => c.id)) + 1 : 1;
app.get("/comments", (req, res) => res.json(comments));
app.get("/comments/:id", (req, res) => {
  const id = Number(req.params.id);
  const c = comments.find((x) => x.id === id);
  if (!c) return res.status(404).json({ error: "Not Found" });
  res.json(c);
});
app.post("/comments", (req, res) => {
  const { postId, text } = req.body;
  if (typeof postId !== "number" || !text)
    return res.status(400).json({ error: "postId (number) and text required" });
  const com = { id: nextId(), postId, text };
  comments = [...comments, com];
  res.status(201).json(com);
});
app.patch("/comments/:id", (req, res) => {
  const id = Number(req.params.id);
  const c = comments.find((x) => x.id === id);
  if (!c) return res.status(404).json({ error: "Not Found" });
  const upd = { ...c, ...req.body };
  comments = comments.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/comments/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!comments.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  comments = comments.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("F: Comments API"));
```

</details>

### Part G — Final `app.js`

<details><summary><code>part-g/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let orders = [
  { id: 1, total: 12, status: "paid" },
  { id: 2, total: 30, status: "pending" },
];
const nextId = () =>
  orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
app.get("/orders", (req, res) => res.json(orders));
app.get("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const o = orders.find((x) => x.id === id);
  if (!o) return res.status(404).json({ error: "Not Found" });
  res.json(o);
});
app.post("/orders", (req, res) => {
  const { total, status } = req.body;
  if (typeof total !== "number" || !status)
    return res.status(400).json({ error: "numeric total and status required" });
  const ord = { id: nextId(), total, status };
  orders = [...orders, ord];
  res.status(201).json(ord);
});
app.patch("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const o = orders.find((x) => x.id === id);
  if (!o) return res.status(404).json({ error: "Not Found" });
  const upd = { ...o, ...req.body };
  orders = orders.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!orders.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  orders = orders.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("G: Orders API"));
```

</details>

### Part H — Final `app.js`

<details><summary><code>part-h/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let tickets = [
  { id: 1, title: "Login bug", priority: "high" },
  { id: 2, title: "UI polish", priority: "low" },
];
const nextId = () =>
  tickets.length ? Math.max(...tickets.map((t) => t.id)) + 1 : 1;
const allowed = new Set(["low", "medium", "high"]);
app.get("/tickets", (req, res) => res.json(tickets));
app.get("/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  const t = tickets.find((x) => x.id === id);
  if (!t) return res.status(404).json({ error: "Not Found" });
  res.json(t);
});
app.post("/tickets", (req, res) => {
  const { title, priority } = req.body;
  if (!title || !allowed.has(priority))
    return res.status(400).json({ error: "title and valid priority required" });
  const ticket = { id: nextId(), title, priority };
  tickets = [...tickets, ticket];
  res.status(201).json(ticket);
});
app.patch("/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  const t = tickets.find((x) => x.id === id);
  if (!t) return res.status(404).json({ error: "Not Found" });
  const nxt = { ...t, ...req.body };
  if (nxt.priority && !allowed.has(nxt.priority))
    return res.status(400).json({ error: "invalid priority" });
  tickets = tickets.map((x) => (x.id === id ? nxt : x));
  res.json(nxt);
});
app.delete("/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!tickets.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  tickets = tickets.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("H: Tickets API"));
```

</details>

### Part I — Final `app.js`

<details><summary><code>part-i/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let courses = [
  { id: 1, name: "Algebra", credits: 3 },
  { id: 2, name: "Biology", credits: 4 },
];
const nextId = () =>
  courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
app.get("/courses", (req, res) => res.json(courses));
app.get("/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const c = courses.find((x) => x.id === id);
  if (!c) return res.status(404).json({ error: "Not Found" });
  res.json(c);
});
app.post("/courses", (req, res) => {
  const { name, credits } = req.body;
  if (!name || typeof credits !== "number")
    return res.status(400).json({ error: "name and numeric credits required" });
  const course = { id: nextId(), name, credits };
  courses = [...courses, course];
  res.status(201).json(course);
});
app.patch("/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const c = courses.find((x) => x.id === id);
  if (!c) return res.status(404).json({ error: "Not Found" });
  const upd = { ...c, ...req.body };
  if (upd.credits !== undefined && typeof upd.credits !== "number")
    return res.status(400).json({ error: "credits must be number" });
  courses = courses.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!courses.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  courses = courses.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("I: Courses API"));
```

</details>

### Part J — Final `app.js`

<details><summary><code>part-j/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let movies = [
  { id: 1, title: "Inception", year: 2010 },
  { id: 2, title: "Arrival", year: 2016 },
];
const nextId = () =>
  movies.length ? Math.max(...movies.map((m) => m.id)) + 1 : 1;
app.get("/movies", (req, res) => res.json(movies));
app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const m = movies.find((x) => x.id === id);
  if (!m) return res.status(404).json({ error: "Not Found" });
  res.json(m);
});
app.post("/movies", (req, res) => {
  const { title, year } = req.body;
  if (!title || typeof year !== "number" || year < 1888)
    return res
      .status(400)
      .json({ error: "title and reasonable numeric year required" });
  const movie = { id: nextId(), title, year };
  movies = [...movies, movie];
  res.status(201).json(movie);
});
app.patch("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const m = movies.find((x) => x.id === id);
  if (!m) return res.status(404).json({ error: "Not Found" });
  const upd = { ...m, ...req.body };
  if (
    upd.year !== undefined &&
    (typeof upd.year !== "number" || upd.year < 1888)
  )
    return res.status(400).json({ error: "invalid year" });
  movies = movies.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!movies.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  movies = movies.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("J: Movies API"));
```

</details>

### Part K — Final `app.js`

<details><summary><code>part-k/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let devices = [
  { id: 1, name: "Sensor A", online: true },
  { id: 2, name: "Sensor B", online: false },
];
const nextId = () =>
  devices.length ? Math.max(...devices.map((d) => d.id)) + 1 : 1;
app.get("/devices", (req, res) => res.json(devices));
app.get("/devices/:id", (req, res) => {
  const id = Number(req.params.id);
  const d = devices.find((x) => x.id === id);
  if (!d) return res.status(404).json({ error: "Not Found" });
  res.json(d);
});
app.post("/devices", (req, res) => {
  const { name, online = false } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const dev = { id: nextId(), name, online: Boolean(online) };
  devices = [...devices, dev];
  res.status(201).json(dev);
});
app.patch("/devices/:id", (req, res) => {
  const id = Number(req.params.id);
  const d = devices.find((x) => x.id === id);
  if (!d) return res.status(404).json({ error: "Not Found" });
  const upd = { ...d, ...req.body };
  devices = devices.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/devices/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!devices.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  devices = devices.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("K: Devices API"));
```

</details>

### Part L — Final `app.js`

<details><summary><code>part-l/app.js</code> (final)</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());
let notes = [
  { id: 1, title: "Todo", content: "Buy milk" },
  { id: 2, title: "Idea", content: "Start blog" },
];
const nextId = () =>
  notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
app.get("/notes", (req, res) => res.json(notes));
app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const n = notes.find((x) => x.id === id);
  if (!n) return res.status(404).json({ error: "Not Found" });
  res.json(n);
});
app.post("/notes", (req, res) => {
  const { title, content = "" } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const note = { id: nextId(), title, content };
  notes = [...notes, note];
  res.status(201).json(note);
});
app.patch("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const n = notes.find((x) => x.id === id);
  if (!n) return res.status(404).json({ error: "Not Found" });
  const upd = { ...n, ...req.body };
  notes = notes.map((x) => (x.id === id ? upd : x));
  res.json(upd);
});
app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!notes.some((x) => x.id === id))
    return res.status(404).json({ error: "Not Found" });
  notes = notes.filter((x) => x.id !== id);
  res.status(204).send();
});
app.listen(3000, () => console.log("L: Notes API"));
```

</details>
