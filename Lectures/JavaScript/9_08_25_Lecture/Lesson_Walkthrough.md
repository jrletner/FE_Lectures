# Lesson Walkthrough: Using External Libraries in JavaScript (ES Modules)

Goal: Learn to use third‑party libraries in the browser with native ES Modules, without npm or a bundler.

What you’ll do:

- Load libraries directly from a CDN that serves ES Modules.
- Import and use a few popular packages.

Notes:

- Use a local web server (e.g., VS Code Live Server) when using `<script type="module">`. Loading modules from `file://` often fails due to CORS.
- We’ll use esm.sh (stable ESM CDN). Alternatives: jspm.io, unpkg/jsDelivr with ESM builds.

---

## 1) Minimal setup

Create two files in this folder:

1. `index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ES Modules – No npm</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        padding: 1rem;
      }
      pre {
        background: #111;
        color: #0f0;
        padding: 1rem;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <h1>ES Modules (No npm)</h1>
    <p id="greeting"></p>
    <pre id="out"></pre>

    <!-- Load our app as a module -->
    <script type="module" src="./app.js"></script>
  </body>
</html>
```

2. `app.js` (you likely already have this file in this folder). We’ll add examples below; keep only one example active at a time while learning.

---

## 2) Example A – nanoid (unique IDs)

`nanoid` is tiny and great for client-side IDs.

```js
// app.js
import { nanoid } from "https://esm.sh/nanoid@5";

const id = nanoid();

document.getElementById("greeting").textContent = `Hello! Your id: ${id}`;
console.log("Generated id:", id);
```

What happened:

- The browser fetched an ESM build from esm.sh and executed it natively.

---

## 3) Example B – date-fns (date utilities)

```js
// app.js
import { parseISO, format } from "https://esm.sh/date-fns@3";

const when = parseISO("2025-09-08T14:30:00Z");
const nice = format(when, "EEE, MMM d yyyy 'at' p");

document.getElementById("greeting").textContent = `Class time: ${nice}`;
```

Tips:

- Only import what you need to keep downloads small.

---

## 4) Example C – lodash-es (utility functions)

`lodash-es` ships as ESM. We’ll import a single function.

```js
// app.js
import { debounce } from "https://esm.sh/lodash-es@4";

const out = document.getElementById("out");

const onResize = debounce(() => {
  out.textContent = JSON.stringify(
    { w: window.innerWidth, h: window.innerHeight },
    null,
    2
  );
}, 200);

window.addEventListener("resize", onResize);

// Run once initially
onResize();
```

---

## 5) Example D – axios (HTTP requests)

```js
// app.js
import axios from "https://esm.sh/axios@1";

const out = document.getElementById("out");

async function main() {
  const res = await axios.get(
    "https://api.github.com/repos/jrletner/FE_Lectures"
  );
  out.textContent = JSON.stringify(
    {
      full_name: res.data.full_name,
      stars: res.data.stargazers_count,
      watchers: res.data.watchers_count,
    },
    null,
    2
  );
}

main().catch((err) => {
  out.textContent = err?.message ?? String(err);
});
```

If you hit rate limits, swap to a different public API endpoint.

---

## 6) Example E – marked (render Markdown)

`marked` converts Markdown text into HTML.

```js
// app.js
import { marked } from "https://esm.sh/marked@12";

const md = `# Hello\n\n- item 1\n- item 2\n\n**Bold move!**`;
document.getElementById("greeting").textContent = "Rendered Markdown:";
document.getElementById("out").innerHTML = marked.parse(md);
```

---

## 7) Example F – ky (tiny HTTP client)

`ky` is a small fetch wrapper with a clean API.

```js
// app.js
import ky from "https://esm.sh/ky@1";

const out = document.getElementById("out");

async function main() {
  const data = await ky
    .get("https://jsonplaceholder.typicode.com/todos/1")
    .json();
  out.textContent = JSON.stringify(data, null, 2);
}

main().catch((err) => (out.textContent = err?.message ?? String(err)));
```

---

## 8) Example G – zod (schema validation)

Validate and parse data safely on the client.

```js
// app.js
import { z } from "https://esm.sh/zod@3";

const out = document.getElementById("out");

const User = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

try {
  const user = User.parse({ id: crypto.randomUUID(), name: "Ada" });
  out.textContent = JSON.stringify(user, null, 2);
} catch (e) {
  out.textContent = JSON.stringify(e.errors ?? e, null, 2);
}
```

---

## 9) Example H – mitt (event emitter)

`mitt` is a tiny pub/sub event emitter.

```js
// app.js
import mitt from "https://esm.sh/mitt@3";

const out = document.getElementById("out");
const emitter = mitt();

emitter.on("tick", (n) => {
  out.textContent = `tick ${n}`;
});

let n = 0;
setInterval(() => emitter.emit("tick", ++n), 1000);
```

---

## 10) Example I – dayjs (lightweight dates)

Small date library with plugin system.

```js
// app.js
import dayjs from "https://esm.sh/dayjs@1";
import relativeTime from "https://esm.sh/dayjs@1/plugin/relativeTime.js";

dayjs.extend(relativeTime);

const out = document.getElementById("out");
const start = dayjs().subtract(90, "minute");
out.textContent = `Started: ${start.format(
  "YYYY-MM-DD HH:mm"
)} (${start.fromNow()})`;
```

---

## 11) Example J – Chart.js (quick chart)

Create a simple bar chart by adding a canvas dynamically.

```js
// app.js
import Chart from "https://esm.sh/chart.js@4/auto";

const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 200;
document.body.appendChild(canvas);

new Chart(canvas.getContext("2d"), {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green"],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3, 5],
        backgroundColor: ["#f87171", "#60a5fa", "#fbbf24", "#34d399"],
      },
    ],
  },
  options: { responsive: true, maintainAspectRatio: false },
});
```

---

## 12) Example K – qs (query string parse/stringify)

Parse a query string and build a new one.

```js
// app.js
import qs from "https://esm.sh/qs@6";

const out = document.getElementById("out");
const query = "?name=Ada%20Lovelace&tags=js&tags=math";
const parsed = qs.parse(query, { ignoreQueryPrefix: true });
const newQuery = qs.stringify(
  { page: 2, sort: "desc", tags: ["js", "web"] },
  { addQueryPrefix: true }
);

out.textContent = JSON.stringify({ parsed, newQuery }, null, 2);
```

---

## 13) Example L – copy-to-clipboard (one-liner copy)

Copy text to the clipboard when a button is clicked.

```js
// app.js
import copy from "https://esm.sh/copy-to-clipboard@3";

const msg = "Copied via copy-to-clipboard!";
const button = document.createElement("button");
button.textContent = "Copy Message";
document.body.appendChild(button);

const out = document.getElementById("out");
button.addEventListener("click", () => {
  const ok = copy(msg);
  out.textContent = ok ? "Copied!" : "Copy failed";
});
```

---

## 14) Troubleshooting

- “Failed to load module script” or CORS errors: run a local server (not `file://`).
- 404 from CDN: check the package name/version; try pinning a specific version.
- Mixed content/HTTPS: ensure all imports are `https://`.
- Cache: hard refresh or append a cache-buster query, e.g., `?v=1`.

---

## 15) Quick recap

- Use `<script type="module">` and import from ESM CDNs like `https://esm.sh/...`.
- Prefer importing only what you need.
- No npm or bundler required for simple demos and learning.

Happy hacking!
