# Lesson Walkthrough: Intro to Backend + Async JS (Callbacks, Promises, Async/Await, Fetch)

Goal: Understand how the frontend talks to backends and practice async patterns in JavaScript with small, runnable examples.

How to use this:

- Open this folder with a local server if using modules. These examples use plain `<script>` and the browser’s Fetch API.
- Paste one example at a time into `app.js` and refresh.

---

## 1) Intro to Backend (client/server basics)

- Client: your browser (HTML/CSS/JS running on a machine).
- Server (backend): a program running elsewhere that handles requests and returns responses.
- They talk over HTTP using methods like:
  - GET (read), POST (create), PUT/PATCH (update), DELETE (delete)
- Responses include:
  - Status code (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error)
  - Headers (metadata like Content-Type: application/json)
  - Body (often JSON)

Tiny mental model:

- Frontend sends a request → Backend processes → Backend responds → Frontend renders/updates UI.

---

## 2) Callbacks – the original async pattern

```js
// app.js
// simulate async with setTimeout
function getUser(id, callback, onError) {
  setTimeout(() => {
    if (!id) return onError(new Error("missing id"));
    callback({ id, name: "Ada" });
  }, 400);
}

getUser(
  "u1",
  (user) => {
    console.log("user:", user);
    const out = document.getElementById("out") || document.createElement("pre");
    out.id = "out";
    out.textContent = JSON.stringify(user, null, 2);
    document.body.appendChild(out);
  },
  (err) => {
    console.error(err);
  }
);
```

Notes:

- A callback is a function you pass in to be called later.
- Error-first style is common in Node (callback(error, data)).
- Deep nesting (“callback hell”) can get hard to read as logic grows.

---

## 3) Promises – chainable async

```js
// app.js
function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!id) return reject(new Error("missing id"));
      resolve({ id, name: "Ada" });
    }, 400);
  });
}

getUser("u2")
  .then((user) => {
    console.log("user:", user);
    return { ...user, role: "admin" };
  })
  .then((user2) => {
    const out = document.getElementById("out") || document.createElement("pre");
    out.id = "out";
    out.textContent = JSON.stringify(user2, null, 2);
    document.body.appendChild(out);
  })
  .catch((err) => {
    console.error("error:", err);
  })
  .finally(() => {
    console.log("done");
  });
```

Notes:

- Promises represent a future value: pending → fulfilled or rejected.
- `then` chains successes, `catch` handles errors, `finally` runs regardless.

### Bonus: Promise.all – run in parallel and wait for all

```js
// app.js
function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const p1 = delay(200, "A");
const p2 = delay(300, "B");
const p3 = delay(100, "C");

Promise.all([p1, p2, p3])
  .then(([a, b, c]) => {
    const out = document.getElementById("out") || document.createElement("pre");
    out.id = "out";
    out.textContent = JSON.stringify({ orderReturned: [a, b, c] }, null, 2);
    document.body.appendChild(out);
  })
  .catch((err) => console.error("one failed:", err));
```

Notes:

- All promises run at the same time; the `.then` runs when all are fulfilled.
- If any reject, `Promise.all` rejects immediately.

---

## 4) Async/Await – promises with clean syntax

```js
// app.js
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getUser(id) {
  await delay(300);
  if (!id) throw new Error("missing id");
  return { id, name: "Grace" };
}

async function main() {
  try {
    const user = await getUser("u3");
    const out = document.getElementById("out") || document.createElement("pre");
    out.id = "out";
    out.textContent = JSON.stringify(user, null, 2);
    document.body.appendChild(out);
  } catch (err) {
    console.error("error:", err);
  }
}

main();
```

Notes:

- `async` functions return a promise; `await` pauses within the function until the promise settles.
- Use `try/catch` around awaits to handle errors.

---

## 5) Fetch – making HTTP requests

Read JSON:

```js
// app.js
async function main() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const out = document.getElementById("out") || document.createElement("pre");
  out.id = "out";
  out.textContent = JSON.stringify(data, null, 2);
  document.body.appendChild(out);
}
main().catch((err) => console.error(err));
```

POST JSON:

```js
// app.js
async function createTodo(title) {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false, userId: 1 }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

createTodo("Learn async")
  .then((todo) => {
    const out = document.getElementById("out") || document.createElement("pre");
    out.id = "out";
    out.textContent = JSON.stringify(todo, null, 2);
    document.body.appendChild(out);
  })
  .catch((err) => console.error(err));
```

Parallel requests:

```js
// app.js
async function main() {
  const [uRes, pRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users/1"),
    fetch("https://jsonplaceholder.typicode.com/posts?userId=1"),
  ]);
  if (!uRes.ok || !pRes.ok) throw new Error("HTTP error");
  const [user, posts] = await Promise.all([uRes.json(), pRes.json()]);
  const out = document.getElementById("out") || document.createElement("pre");
  out.id = "out";
  out.textContent = JSON.stringify({ user, postsCount: posts.length }, null, 2);
  document.body.appendChild(out);
}
main().catch((err) => console.error(err));
```

Notes:

- Always check `res.ok` (or `res.status`) before trusting the body.
- Use `headers` and `body` for POST/PUT/PATCH.
- Use `Promise.all` for parallel fetches when requests are independent.

---

## 6) Exercises

Try these in `app.js`:

1. Build a `fetchJson(url)` helper that throws on non-OK responses and returns parsed JSON.
2. Use `Promise.all` to fetch 3 endpoints in parallel, then show a combined result (e.g., counts or selected fields).
3. Convert a nested callback example into a Promise version, and then into an async/await version.
4. Use `try/catch` and show a friendly message in the DOM when a request fails.

---

## 7) Troubleshooting

- CORS: Some APIs block browser requests. Use public APIs or enable CORS on your own backend.
- Network errors vs HTTP errors: `fetch` only rejects on network failure; HTTP 4xx/5xx still resolve—check `res.ok`.
- JSON parse errors: Make sure `Content-Type: application/json` and the body is valid JSON.
- Rate limits: Public APIs may rate-limit. Swap endpoints or slow down requests if needed.

Happy learning!
