# Student Practice Walkthrough – Express.js Fundamentals (In‑Memory CRUD)

In this lecture you’ll build small Express APIs that use an in‑memory array as the “database.” So changes only live for the process lifetime (restart resets data).

- Express documentation: https://expressjs.com/

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
const express = require("express"); // Bring in the Express library
const app = express(); // Create an Express application instance
app.use(express.json()); // Add middleware to parse JSON request bodies

// 2) In-memory "DB" (copy from data.json)
let users = [
  // Our fake database for this part lives in memory
  { id: 1, name: "Ada", role: "admin" }, // Seed user #1
  { id: 2, name: "Bao", role: "user" }, // Seed user #2
  { id: 3, name: "Caro", role: "editor" }, // Seed user #3
]; // End seed array

// 3) Helpers
const nextId = () =>
  // Compute the next unique id for a new user
  users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1; // If array not empty, take max id + 1; else start at 1

// 4) CRUD routes
// List all
app.get("/users", (req, res) => {
  // Handle GET /users
  res.json(users); // Respond with the entire users array as JSON
}); // End GET /users

// Get one
app.get("/users/:id", (req, res) => {
  // Handle GET /users/:id
  const id = Number(req.params.id); // Convert the path param (string) to a number
  const user = users.find((u) => u.id === id); // Find the user by id
  if (!user) return res.status(404).json({ error: "Not Found" }); // If none, send 404
  res.json(user); // Otherwise, return the found user
}); // End GET /users/:id

// Create
app.post("/users", (req, res) => {
  // Handle POST /users
  const { name, role } = req.body; // Pull fields off the JSON body
  if (!name || !role)
    // Validate required fields
    return res.status(400).json({ error: "name and role required" }); // 400 Bad Request if invalid
  const user = { id: nextId(), name, role }; // Build a new user object
  users = [...users, user]; // immutable append: create a new array with the new user added
  res.status(201).json(user); // Return 201 Created with the new resource
}); // End POST /users

// Partial update
app.patch("/users/:id", (req, res) => {
  // Handle PATCH /users/:id
  const id = Number(req.params.id); // Convert id to number
  const user = users.find((u) => u.id === id); // Look up existing user
  if (!user) return res.status(404).json({ error: "Not Found" }); // 404 if not found
  const updated = { ...user, ...req.body }; // Shallow-merge existing user with provided fields
  users = users.map((u) => (u.id === id ? updated : u)); // Replace only the matching user in the array
  res.json(updated); // Return the updated user
}); // End PATCH /users/:id

// Delete
app.delete("/users/:id", (req, res) => {
  // Handle DELETE /users/:id
  const id = Number(req.params.id); // Convert id to number
  if (!users.some((u) => u.id === id))
    // Check if a user with this id exists
    return res.status(404).json({ error: "Not Found" }); // If not, 404
  users = users.filter((u) => u.id !== id); // Keep all users except the one with the id
  res.status(204).send(); // 204 No Content indicates successful deletion
}); // End DELETE /users/:id

// 5) Start server
app.listen(3000, () => console.log("A: Users API on http://localhost:3000")); // Start the HTTP server on port 3000
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
const express = require("express"); // Import Express
const app = express(); // Create an app instance
app.use(express.json()); // Parse incoming JSON bodies

// 2) Seed in-memory products array (acts like data.json)
let products = [
  // Our in-memory "products" table
  { id: 1, name: "Pen", price: 2.5 }, // Example product #1
  { id: 2, name: "Pad", price: 4.0 }, // Example product #2
  { id: 3, name: "Pencil", price: 1.75 }, // Example product #3
]; // End seed

// 3) Helper to compute next id (max + 1 or start at 1)
const nextId = () =>
  // Function to get an unused id
  products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1; // Max id + 1 or 1 if empty

// 4) READ ALL – GET /products returns entire array
app.get("/products", (req, res) => {
  // Handle GET /products
  res.json(products); // Send all products as JSON
}); // End GET /products

// 5) READ ONE – GET /products/:id finds by numeric id, 404 if missing
app.get("/products/:id", (req, res) => {
  // Handle GET /products/:id
  const id = Number(req.params.id); // Convert param string to number
  const product = products.find((p) => p.id === id); // Find by id
  if (!product) return res.status(404).json({ error: "Not Found" }); // 404 if missing
  res.json(product); // Send the found product
}); // End GET /products/:id

// 6) CREATE – POST /products validates name & price type
app.post("/products", (req, res) => {
  // Handle POST /products
  const { name, price } = req.body; // Extract fields from body
  if (!name || typeof price !== "number") {
    // Validate inputs
    return res.status(400).json({ error: "name and numeric price required" }); // Bad request if invalid
  } // End validation
  const product = { id: nextId(), name, price }; // Build new product
  products = [...products, product]; // immutable append new product
  res.status(201).json(product); // Respond 201 Created with new product
}); // End POST /products

// 7) PARTIAL UPDATE – PATCH merges only provided fields
app.patch("/products/:id", (req, res) => {
  // Handle PATCH /products/:id
  const id = Number(req.params.id); // Convert id param
  const existing = products.find((p) => p.id === id); // Lookup existing
  if (!existing) return res.status(404).json({ error: "Not Found" }); // 404 if none
  const updated = { ...existing, ...req.body }; // shallow merge provided fields
  products = products.map((p) => (p.id === id ? updated : p)); // Replace only the target
  res.json(updated); // Send updated product
}); // End PATCH /products/:id

// 8) DELETE – removes product by id and returns 204
app.delete("/products/:id", (req, res) => {
  // Handle DELETE /products/:id
  const id = Number(req.params.id); // Convert id param
  if (!products.some((p) => p.id === id)) {
    // Ensure it exists before deleting
    return res.status(404).json({ error: "Not Found" }); // 404 if not found
  } // End existence check
  products = products.filter((p) => p.id !== id); // Remove the product
  res.status(204).send(); // 204 No Content on success
}); // End DELETE /products/:id

// 9) Start server
app.listen(3000, () => console.log("B: Products API on http://localhost:3000")); // Start listening on port 3000
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
const express = require("express"); // Import Express
const app = express(); // Create an app
app.use(express.json()); // JSON body parsing middleware

// Seed array of books (acts as our DB for this part)
let books = [
  // In-memory books collection
  { id: 1, title: "Clean Code", author: "Robert C. Martin", year: 2008 }, // Book #1
  { id: 2, title: "Refactoring", author: "Martin Fowler", year: 1999 }, // Book #2
]; // End seed

// Helper for new ids
const nextId = () =>
  // Function to compute next id
  books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1; // Max id + 1 or start at 1 if empty

// GET all books
app.get("/books", (req, res) => {
  // Handle GET /books
  res.json(books); // Return the entire books array
}); // End GET /books

// GET one book
app.get("/books/:id", (req, res) => {
  // Handle GET /books/:id
  const id = Number(req.params.id); // Convert id string to number
  const book = books.find((b) => b.id === id); // Find by id
  if (!book) return res.status(404).json({ error: "Not Found" }); // 404 if missing
  res.json(book); // Return the found book
}); // End GET /books/:id

// CREATE book (requires title, author, numeric year)
app.post("/books", (req, res) => {
  // Handle POST /books
  const { title, author, year } = req.body; // Extract fields from body
  if (!title || !author || typeof year !== "number") {
    // Validate inputs
    return res // Return early on invalid input
      .status(400) // HTTP 400 Bad Request
      .json({ error: "title, author, numeric year required" }); // Error message payload
  } // End validation
  const book = { id: nextId(), title, author, year }; // Build new book
  books = [...books, book]; // immutable append to the array
  res.status(201).json(book); // 201 Created with the new book
}); // End POST /books

// PATCH book (partial update)
app.patch("/books/:id", (req, res) => {
  // Handle PATCH /books/:id
  const id = Number(req.params.id); // Convert id
  const existing = books.find((b) => b.id === id); // Find existing
  if (!existing) return res.status(404).json({ error: "Not Found" }); // 404 if not found
  const updated = { ...existing, ...req.body }; // Shallow-merge fields
  books = books.map((b) => (b.id === id ? updated : b)); // Replace target book
  res.json(updated); // Respond with updated book
}); // End PATCH /books/:id

// DELETE book
app.delete("/books/:id", (req, res) => {
  // Handle DELETE /books/:id
  const id = Number(req.params.id); // Convert id
  if (!books.some((b) => b.id === id))
    // Check existence
    return res.status(404).json({ error: "Not Found" }); // 404 if not found
  books = books.filter((b) => b.id !== id); // Remove the book
  res.status(204).send(); // 204 No Content
}); // End DELETE /books/:id

// Start server
app.listen(3000, () => console.log("C: Books API on http://localhost:3000")); // Start the server
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

// Seed tasks array
let tasks = [
  { id: 1, text: "Read", done: false },
  { id: 2, text: "Write", done: false },
];

// Helper for next id

// GET all tasks

// GET one task

// CREATE task (requires text)

// PATCH task (toggle or edit text/done)

// DELETE task

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

// Seed posts
let posts = [
  { id: 1, title: "Hello", body: "First" },
  { id: 2, title: "Update", body: "News" },
];

// nextId helper

// GET all posts

// GET one post

// CREATE post (title required)

// PATCH post

// DELETE post

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

// Seed comments referencing a postId (still just a number here)
let comments = [
  { id: 1, postId: 2, text: "Nice" },
  { id: 2, postId: 2, text: "Thanks" },
];

// nextId helper

// GET all comments

// GET one comment

// CREATE comment (requires numeric postId & text)

// PATCH comment

// DELETE comment

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

let orders = [
  { id: 1, total: 12, status: "paid" },
  { id: 2, total: 30, status: "pending" },
];

// nextId helper

// GET all orders

// GET one order

// CREATE order (requires numeric total & status)

// PATCH order

// DELETE order

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

let tickets = [
  // In-memory array acting as our "tickets" table
  { id: 1, title: "Login bug", priority: "high" }, // Seed ticket #1 with high priority
  { id: 2, title: "UI polish", priority: "low" }, // Seed ticket #2 with low priority
]; // End seed array

// nextId helper

// We define the allowed priority values for validation
const allowed = new Set(["low", "medium", "high"]);

// GET all tickets

// GET one ticket

// CREATE ticket (validates priority in allowed set)
app.post("/tickets", (req, res) => {
  // Handle POST /tickets requests
  const { title, priority } = req.body; // Destructure title and priority from JSON body
  if (!title || !allowed.has(priority)) {
    // Validate that title exists and priority is one of allowed values
    return res.status(400).json({ error: "title and valid priority required" }); // Respond 400 if invalid input
  } // End validation branch
  const ticket = { id: nextId(), title, priority }; // Build a new ticket object (assumes nextId helper exists)
  tickets = [...tickets, ticket]; // Immutable append: create a new array including the new ticket
  res.status(201).json(ticket); // Respond 201 Created with the new ticket JSON
}); // End POST /tickets handler

// PATCH ticket (reject invalid new priority)

// DELETE ticket

app.listen(3000, () => console.log("H: Tickets API on http://localhost:3000")); // Start server on port 3000 and log startup message
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

let courses = [
  { id: 1, name: "Algebra", credits: 3 },
  { id: 2, name: "Biology", credits: 4 },
];

// nextId helper

// GET all courses

// GET one course

// CREATE course (name & numeric credits)

// PATCH course

// DELETE course

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

let movies = [
  { id: 1, title: "Inception", year: 2010 },
  { id: 2, title: "Arrival", year: 2016 },
];

// nextId helper

// GET all movies

// GET one movie

// CREATE movie (title + reasonable numeric year, greater than or equal to 1888)

// PATCH movie (validate new year if provided)

// DELETE movie

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

let devices = [
  { id: 1, name: "Sensor A", online: true },
  { id: 2, name: "Sensor B", online: false },
];

// nextId helper

// GET all devices

// GET one device

// CREATE device (name required; online defaults false)

// PATCH device

// DELETE device

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

let notes = [
  { id: 1, title: "Todo", content: "Buy milk" },
  { id: 2, title: "Idea", content: "Start blog" },
];

// nextId helper

// GET all notes

// GET one note

// CREATE note (title required; content optional)

// PATCH note

// DELETE note

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
