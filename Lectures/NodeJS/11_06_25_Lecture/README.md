# Student Practice Walkthrough – Node.js HTTP (Core `http` server)

These copy‑pasteable demos build up an HTTP server with Node’s core `http` module. You’ll practice routing, status codes, headers, JSON, redirects, basic body parsing, async handlers, streaming responses, and graceful shutdown.

You will build 12 small demos:

- Part A — Basic routes and 404
- Part B — Status codes and Content‑Type
- Part C — Query strings with URL parsing
- Part D — Route parameters (regex style)
- Part E — Method‑based routing (GET vs POST)
- Part F — JSON responses
- Part G — Parse JSON request body (POST /echo)
- Part H — Async handlers (simulate slow work)
- Part I — Streaming responses (chunked)
- Part J — Redirects (302 → /)
- Part K — Error handling (500)
- Part L — Graceful shutdown (SIGINT)

Each part has a brief goal, a commented snippet, “Run and Observe,” and a final no‑comments version for quick reference.

---

## Why this matters for real Node servers

On the server you will:

- Route requests by path and method.
- Set status codes and headers correctly.
- Return JSON and handle request bodies.
- Avoid blocking the event loop with slow work; stream where it helps.
- Handle errors and shut down gracefully.

## One‑time: Per‑Part Folder Structure and How to Run

Create a folder per part so you can run each demo in isolation with Node:

```
Node_Http_Practice/
	part-a/
		app.js
	part-b/
		app.js
	... up to part-l/
```

How to run any part:

```
node app.js
```

Then open http://localhost:8000/ in your browser (each part listens on 8000).

---

## Part A — Basic routes and 404

Plain English: Start a tiny HTTP server with two routes and a default 404.

In plain words:

- Respond to `/` and `/about`.
- Return a friendly 404 for everything else.

Backend tie‑in (simple):

- Minimal routing without dependencies.

<details><summary><code>part-a/app.js</code></summary>

```js
// 1) Import Node's built-in HTTP module
const http = require("http");

// 2) Create a server: callback runs on every request
const server = http.createServer((req, res) => {
  // 3) Simple routing by URL path
  if (req.url === "/") {
    // res.end() sends the body and closes the response
    return res.end("Welcome to the home page");
  }

  if (req.url === "/about") {
    return res.end("Here is our short history");
  }

  // 4) Default: send a tiny HTML 404 page
  res.end(`
	<h1>Oops!</h1>
	<p>We can't seem to find the page you are looking for</p>
	<a href="/">back home</a>
	`);
});

// 5) Start listening on port 8000
server.listen(8000, () => console.log("A: http://localhost:8000"));
```

</details>

### Run and Observe

- In Postman:
  - Request 1: GET http://localhost:8000/ → Status 200 OK, body: "Welcome to the home page".
  - Request 2: GET http://localhost:8000/about → Status 200 OK, body: "Here is our short history".
  - Request 3: GET http://localhost:8000/anything → Status 200 (no explicit 404 status set in Part A), HTML body shows the 404 message and a link back home.

---

## Part B — Status codes and Content‑Type

Plain English: Send proper status codes and content types for text and HTML.

In plain words:

- 200 for OK; 404 for not found.
- Set `Content-Type` header.

Backend tie‑in (simple):

- Clients rely on codes and content types for behavior.

<details><summary><code>part-b/app.js</code></summary>

```js
// 1) Import http, start a server
const http = require("http");

const server = http.createServer((req, res) => {
  // 2) For successful responses, set status 200 and a Content-Type header
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Welcome to the home page");
  }

  if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Here is our short history");
  }

  // 3) For unknown paths, send 404 and text/html with simple markup
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end('<h1>Not Found</h1><a href="/">back home</a>');
});

// 4) Listen on port 8000
server.listen(8000, () => console.log("B: http://localhost:8000"));
```

</details>

### Run and Observe

- In Postman:
  - GET http://localhost:8000/ → Status 200 OK, Headers include Content-Type: text/plain; charset=utf-8.
  - GET http://localhost:8000/about → Status 200 OK, same Content-Type.
  - GET http://localhost:8000/missing → Status 404 Not Found, Content-Type: text/html; charset=utf-8, with a small HTML body.

---

## Part C — Query strings with URL parsing

Plain English: Read `?name=` from the URL and personalize the response.

In plain words:

- Parse search params.
- Default when missing.

Backend tie‑in (simple):

- Handle filters like `?page=2&perPage=10`.

<details><summary><code>part-c/app.js</code></summary>

```js
// 1) URL helps parse path and query string from req.url
const http = require("http");
const { URL } = require("url");

const server = http.createServer((req, res) => {
  // 2) Construct a full URL for parsing (need base)
  const url = new URL(req.url, "http://localhost:8000");
  if (url.pathname === "/") {
    // 3) Read query param ?name=...
    const name = url.searchParams.get("name") || "friend";
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end(`Hello, ${name}!`);
  }
  res.writeHead(404).end("Not Found");
});

// 4) Visit with a query: /?name=Ada
server.listen(8000, () => console.log("C: http://localhost:8000/?name=Ada"));
```

</details>

### Run and Observe

- In Postman:
  - GET http://localhost:8000/?name=Ada → Status 200 OK, body: "Hello, Ada!".
  - GET http://localhost:8000/ (no query) → Status 200 OK, body: "Hello, friend!".

---

## Part D — Route parameters (regex style)

Plain English: Extract an id from `/users/123` using a regex.

In plain words:

- Match a path pattern.
- Pull out the value.

Backend tie‑in (simple):

- Prototype param routes without a framework.

<details><summary><code>part-d/app.js</code></summary>

```js
// 1) Route params without a framework: use a regex on req.url
const http = require("http");

const server = http.createServer((req, res) => {
  // ^/users/(\d+)$ matches only paths like /users/123
  const match = req.url.match(/^\/users\/(\d+)$/);
  if (match) {
    // 2) Extract the capture group and convert to number
    const id = Number(match[1]);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ id }));
  }
  if (req.url === "/") return res.end("Home");
  // 3) Fallback
  res.writeHead(404).end("Not Found");
});

// 4) Try /users/123
server.listen(8000, () => console.log("D: try /users/123"));
```

</details>

### Run and Observe

- In Postman:
  - GET http://localhost:8000/users/123 → Status 200 OK, JSON body: { "id": 123 }.
  - GET http://localhost:8000/users/abc → Status 404 Not Found (does not match the numeric route).

---

## Part E — Method‑based routing (GET vs POST)

Plain English: Only allow `POST /about` to write; others get 405.

In plain words:

- Check `req.method`.
- Send 405 for unsupported methods.

Backend tie‑in (simple):

- Protect routes by HTTP method.

<details><summary><code>part-e/app.js</code></summary>

```js
// 1) Gate behavior by HTTP method (GET vs POST)
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/about" && req.method === "GET") {
    // Read-only route
    return res.end("About (read-only)");
  }
  if (req.url === "/about" && req.method === "POST") {
    // Write/update route
    res.writeHead(201, { "Content-Type": "text/plain" });
    return res.end("About updated");
  }
  // 2) 405 for unsupported methods/routes in this mini example
  res.writeHead(405).end("Method Not Allowed");
});

server.listen(8000, () => console.log("E: GET/POST /about"));
```

</details>

### Run and Observe

- In Postman:
  - Request 1: POST http://localhost:8000/about → Status 201 Created, body "About updated".
  - Request 2: GET http://localhost:8000/about → Status 200 OK, body "About (read-only)".
  - Any other method to /about → Status 405 Method Not Allowed.

---

## Part F — JSON responses

Plain English: Return JSON with the correct header from `/api/time`.

In plain words:

- Serialize data with `JSON.stringify`.
- Set `Content-Type: application/json`.

Backend tie‑in (simple):

- The standard way to return API data.

<details><summary><code>part-f/app.js</code></summary>

```js
// 1) Return JSON bodies with the correct Content-Type header
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/api/time") {
    // Serialize JS objects as JSON strings
    const body = { now: new Date().toISOString() };
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(body));
  }
  res.writeHead(404).end("Not Found");
});

server.listen(8000, () => console.log("F: GET /api/time"));
```

</details>

### Run and Observe

- In Postman:
  - GET http://localhost:8000/api/time → Status 200 OK, Headers include Content-Type: application/json.
  - Body is JSON like: { "now": "2025-11-06T12:34:56.789Z" }.

---

## Part G — Parse JSON request body (POST /echo)

Plain English: Read the request stream, parse JSON, and echo it back.

In plain words:

- Accumulate chunks → parse → respond.

Backend tie‑in (simple):

- Manual body parsing (what frameworks handle for you).

<details><summary><code>part-g/app.js</code></summary>

```js
// 1) Read raw request body from the stream and parse JSON
const http = require("http");

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    // 2) Accumulate incoming chunks
    req.on("data", (chunk) => (data += chunk));
    // 3) When request ends, parse JSON (or {})
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (e) {
        reject(e);
      }
    });
    // 4) Handle low-level stream errors
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/echo" && req.method === "POST") {
    try {
      // 5) Await parsed JSON and echo it back
      const body = await readJson(req);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ youSent: body }));
    } catch (e) {
      // 6) Bad JSON → 400
      res.writeHead(400).end("Bad JSON");
      return;
    }
  }
  res.writeHead(404).end("Not Found");
});

server.listen(8000, () => console.log("G: POST /echo with JSON body"));
```

</details>

### Run and Observe

- In Postman:
  - Method: POST
  - URL: http://localhost:8000/echo
  - Headers: Content-Type: application/json
  - Body (raw → JSON): {"x": 1}
  - Send → Expect 200 OK with body: { "youSent": { "x": 1 } }
  - Try malformed JSON to observe 400 Bad JSON.

---

## Part H — Async handlers (simulate slow work)

Plain English: Use a Promise to simulate slow I/O before responding.

In plain words:

- Delay with `setTimeout` wrapped in a Promise.

Backend tie‑in (simple):

- Looks like awaiting a DB/HTTP request.

<details><summary><code>part-h/app.js</code></summary>

```js
// 1) Simulate async I/O with a Promise-based delay
const http = require("http");

const delay = (ms, val) => new Promise((res) => setTimeout(() => res(val), ms));

const server = http.createServer(async (req, res) => {
  if (req.url === "/slow") {
    // 2) Await the "async" work before sending a response
    const value = await delay(150, "done");
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end(`Slow result: ${value}`);
  }
  res.writeHead(404).end("Not Found");
});

server.listen(8000, () => console.log("H: GET /slow (~~150ms)"));
```

</details>

### Run and Observe

- In Postman:
  - GET http://localhost:8000/slow → Status 200 OK, body: "Slow result: done" after ~150ms.

---

## Part I — Streaming responses (chunked)

Plain English: Write multiple chunks with small delays; finish with end().

In plain words:

- res is a Writable stream.
- You can write several times.

Backend tie‑in (simple):

- Useful for progress or large responses.

<details><summary><code>part-i/app.js</code></summary>

```js
// 1) Stream multiple chunks to the client before ending
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/stream") {
    // 2) Inform the client we are sending plain text
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    // 3) Write several chunks spaced out in time
    res.write("Part 1...\n");
    setTimeout(() => res.write("Part 2...\n"), 100);
    setTimeout(() => {
      res.write("Part 3...\n");
      // 4) Always call end() to finish the response
      res.end("Done.\n");
    }, 200);
    return;
  }
  res.writeHead(404).end("Not Found");
});

server.listen(8000, () => console.log("I: GET /stream"));
```

</details>

### Run and Observe

- In Postman: GET http://localhost:8000/stream → you should see a multi-line response.
  - Note: Some clients buffer chunked responses; if you don’t see parts stream in real time, confirm the final multi-line body or use your browser’s Network panel.

---

## Part J — Redirects (302 → /)

Plain English: Redirect `/old` to `/` using `Location` and 302.

In plain words:

- Set status 302 + Location header.

Backend tie‑in (simple):

- Move content while keeping users on the right path.

<details><summary><code>part-j/app.js</code></summary>

```js
// 1) Send a 302 redirect: Location header tells the browser where to go
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") return res.end("Home");
  if (req.url === "/old") {
    // 2) 302 Found + Location causes a redirect to '/'
    res.writeHead(302, { Location: "/" });
    return res.end();
  }
  res.writeHead(404).end("Not Found");
});

server.listen(8000, () => console.log("J: GET /old redirects to /"));
```

</details>

### Run and Observe

- In Postman:
  - GET http://localhost:8000/old → Status 302 Found, Headers include Location: /.
  - Optionally enable “Follow redirects” in Postman to see the final GET / response "Home".

---

## Part K — Error handling (500)

Plain English: Catch thrown errors and return a 500 response.

In plain words:

- Wrap handlers and send a generic error.

Backend tie‑in (simple):

- Avoid crashing on unexpected errors.

<details><summary><code>part-k/app.js</code></summary>

```js
// 1) Wrap handlers to centralize error handling at the edge
const http = require("http");

function withErrors(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      // 2) Never leak internals; return generic 500
      res.writeHead(500).end("Internal Server Error");
    }
  };
}

const server = http.createServer(
  withErrors(async (req, res) => {
    if (req.url === "/error") {
      // 3) Throwing here is caught by withErrors
      throw new Error("boom");
    }
    res.end("OK");
  })
);

server.listen(8000, () => console.log("K: GET /error → 500"));
```

</details>

### Run and Observe

- In Postman:
  - GET http://localhost:8000/error → Status 500 Internal Server Error, body: "Internal Server Error".
  - GET http://localhost:8000/ → Status 200 OK, body: "OK".

---

## Part L — Graceful shutdown (SIGINT)

Plain English: Close the server on Ctrl+C and stop accepting new connections.

In plain words:

- Listen for `SIGINT`.
- Call `server.close()`.

Backend tie‑in (simple):

- Prevent abrupt disconnects during deploys.

<details><summary><code>part-l/app.js</code></summary>

```js
// 1) Start a server and add a graceful shutdown handler for Ctrl+C
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Running. Press Ctrl+C to stop.");
});

server.listen(8000, () => console.log("L: http://localhost:8000"));

// 2) On SIGINT, stop accepting new connections and exit when closed
process.on("SIGINT", () => {
  console.log("\nL: shutting down...");
  server.close(() => {
    console.log("L: closed");
    process.exit(0);
  });
});
```

</details>

### Run and Observe

- In Postman:
  - GET http://localhost:8000/ → Status 200 OK, body: "Running. Press Ctrl+C to stop.".
  - Then stop the server with Ctrl+C in your terminal; watch the terminal logs for graceful shutdown. (Postman doesn’t send signals.)

---

## Final Code (No Comments) – Reference

Minimal versions for quick copy/paste. Each file is runnable with `node app.js`.

### Part A — Final `app.js`

<details><summary><code>part-a/app.js</code> (final)</summary>

```js
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/") return res.end("Welcome to the home page");
  if (req.url === "/about") return res.end("Here is our short history");
  res.end('<h1>Oops!</h1><a href="/">back home</a>');
});
server.listen(8000, () => console.log("A: http://localhost:8000"));
```

</details>

### Part B — Final `app.js`

<details><summary><code>part-b/app.js</code> (final)</summary>

```js
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Welcome to the home page");
  }
  if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Here is our short history");
  }
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end('<h1>Not Found</h1><a href="/">back home</a>');
});
server.listen(8000, () => console.log("B: http://localhost:8000"));
```

</details>

### Part C — Final `app.js`

<details><summary><code>part-c/app.js</code> (final)</summary>

```js
const http = require("http");
const { URL } = require("url");
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://localhost:8000");
  if (u.pathname === "/") {
    const name = u.searchParams.get("name") || "friend";
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end(`Hello, ${name}!`);
  }
  res.writeHead(404).end("Not Found");
});
server.listen(8000, () => console.log("C: http://localhost:8000/?name=Ada"));
```

</details>

### Part D — Final `app.js`

<details><summary><code>part-d/app.js</code> (final)</summary>

```js
const http = require("http");
const server = http.createServer((req, res) => {
  const m = req.url.match(/^\/users\/(\d+)$/);
  if (m) {
    const id = Number(m[1]);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ id }));
  }
  if (req.url === "/") return res.end("Home");
  res.writeHead(404).end("Not Found");
});
server.listen(8000, () => console.log("D: try /users/123"));
```

</details>

### Part E — Final `app.js`

<details><summary><code>part-e/app.js</code> (final)</summary>

```js
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/about" && req.method === "GET")
    return res.end("About (read-only)");
  if (req.url === "/about" && req.method === "POST") {
    res.writeHead(201, { "Content-Type": "text/plain" });
    return res.end("About updated");
  }
  res.writeHead(405).end("Method Not Allowed");
});
server.listen(8000, () => console.log("E: GET/POST /about"));
```

</details>

### Part F — Final `app.js`

<details><summary><code>part-f/app.js</code> (final)</summary>

```js
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/api/time") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ now: new Date().toISOString() }));
  }
  res.writeHead(404).end("Not Found");
});
server.listen(8000, () => console.log("F: GET /api/time"));
```

</details>

### Part G — Final `app.js`

<details><summary><code>part-g/app.js</code> (final)</summary>

```js
const http = require("http");
function readJson(req) {
  return new Promise((y, n) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => {
      try {
        y(JSON.parse(d || "{}"));
      } catch (e) {
        n(e);
      }
    });
    req.on("error", n);
  });
}
const server = http.createServer(async (req, res) => {
  if (req.url === "/echo" && req.method === "POST") {
    try {
      const b = await readJson(req);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ youSent: b }));
    } catch (e) {
      res.writeHead(400).end("Bad JSON");
      return;
    }
  }
  res.writeHead(404).end("Not Found");
});
server.listen(8000, () => console.log("G: POST /echo with JSON body"));
```

</details>

### Part H — Final `app.js`

<details><summary><code>part-h/app.js</code> (final)</summary>

```js
const http = require("http");
const delay = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const server = http.createServer(async (req, res) => {
  if (req.url === "/slow") {
    const v = await delay(150, "done");
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Slow result: " + v);
  }
  res.writeHead(404).end("Not Found");
});
server.listen(8000, () => console.log("H: GET /slow (~~150ms)"));
```

</details>

### Part I — Final `app.js`

<details><summary><code>part-i/app.js</code> (final)</summary>

```js
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/stream") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write("Part 1...\n");
    setTimeout(() => res.write("Part 2...\n"), 100);
    setTimeout(() => {
      res.write("Part 3...\n");
      res.end("Done.\n");
    }, 200);
    return;
  }
  res.writeHead(404).end("Not Found");
});
server.listen(8000, () => console.log("I: GET /stream"));
```

</details>

### Part J — Final `app.js`

<details><summary><code>part-j/app.js</code> (final)</summary>

```js
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/") return res.end("Home");
  if (req.url === "/old") {
    res.writeHead(302, { Location: "/" });
    return res.end();
  }
  res.writeHead(404).end("Not Found");
});
server.listen(8000, () => console.log("J: GET /old redirects to /"));
```

</details>

### Part K — Final `app.js`

<details><summary><code>part-k/app.js</code> (final)</summary>

```js
const http = require("http");
function withErrors(h) {
  return async (req, res) => {
    try {
      await h(req, res);
    } catch (e) {
      res.writeHead(500).end("Internal Server Error");
    }
  };
}
const server = http.createServer(
  withErrors(async (req, res) => {
    if (req.url === "/error") throw new Error("boom");
    res.end("OK");
  })
);
server.listen(8000, () => console.log("K: GET /error → 500"));
```

</details>

### Part L — Final `app.js`

<details><summary><code>part-l/app.js</code> (final)</summary>

```js
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("Running. Press Ctrl+C to stop.");
});
server.listen(8000, () => console.log("L: http://localhost:8000"));
process.on("SIGINT", () => {
  console.log("\nL: shutting down...");
  server.close(() => {
    console.log("L: closed");
    process.exit(0);
  });
});
```

</details>
