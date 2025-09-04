# 9/04/25 — JavaScript Modules (ESM) — 60‑minute Live‑Coding Walkthrough

Goal: Introduce ES Modules in the browser. Students will create modules, wire up `type="module"`, import in different ways, and build a couple of small modules. Keep it hands‑on and simple.

What you’ll do live:

- Set up a tiny HTML/CSS shell.
- Create `app.js` with `type="module"`.
- Build two small modules (default + named exports), then demo namespace and alias imports.
- Optional quick hits: side‑effect import, live bindings, dynamic import.

Tip: Serve this folder over HTTP (Live Server or `python3 -m http.server`) so imports work consistently.

## 0) HTML + CSS stubs (5 min)

Link `styles.css` and `app.js` using `type="module"`.

```html
<link rel="stylesheet" href="styles.css" />
<script type="module" src="app.js"></script>
```

Add this to the top of the `app.js` file.

```js
import {
  log,
  titleCase,
  truncate,
  areaCircle,
  areaRect,
} from "./modules/log.module.js";
```

---

## Modules — `export default` patterns and imports

1. Default function

```js
// modules/greet.js
export default function greet(name) {
  return `Hello, ${name}!`;
}

// app.js
import greet from "./modules/greet.js";
log(greet("Ada"));
```

2. Default class

```js
// modules/Person.js
export default class Person {
  constructor(name) {
    this.name = name;
  }
  introduce() {
    return `Hi, I'm ${this.name}.`;
  }
}

// app.js
import Person from "./modules/Person.js";
const ada = new Person("Ada");
log(ada.introduce());
```

3. Default object (module as a singleton)

```js
// modules/config.js
export default {
  apiBase: "/api",
  retries: 3,
};

// app.js
import config from "./modules/config.js";
log(config.apiBase);
```

4. Default expression (inline)

```js
// modules/answer.js
export default 42;

// app.js
import answer from "./modules/answer.js";
log(answer);
```

5. Mixed: default + named (allowed, but keep it simple)

```js
// modules/colors.js
export const primary = "#7c3aed";
export const accent = "#22d3ee";
export default function paint(el) {
  el.style.color = primary;
}

// app.js
import paint, { primary, accent } from "./modules/colors.js";
log(primary);
paint(document.body);
```

Import naming note: With `export default`, the importer chooses the name:

```js
// Either name works — both import the same default
import greet from "./modules/greet.js";
import hello from "./modules/greet.js";
```

One default per module: A module can only have one `export default`, but any number of named exports.

Notes:

- One default export per module; you can name it anything when importing.
- Great for the “main” thing a module provides.

---

## 2) Named exports + namespace + alias (15 min)

Create `modules/math.js`:

```js
export const PI = 3.141592653589793;
export function add(a, b) {
  return a + b;
}
```

Create `modules/utils.js`:

```js
export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export function shout(text) {
  return String(text).toUpperCase();
}
```

Import patterns in `app.js`:

```js
import { add, PI } from "./modules/math.js";
import * as utils from "./modules/utils.js";
import { shout as loud } from "./modules/utils.js";

log(`add(2,3) = ${add(2, 3)}`);
log(`PI = ${PI}`);
log(`slugify('Hello Modules!') -> ${utils.slugify("Hello Modules!")}`);
log(loud("alias import"));
```

Notes:

- Named imports must match names (unless you alias with `as`).
- Namespace import (`* as utils`) gathers named exports under one object.

Mini challenge: Add `subtract(a,b)` to `math.js` and log it in `app.js`.

---

## 3) Build two tiny modules together (15 min)

Module A — `modules/strings.js`:

```js
export function titleCase(text) {
  return String(text)
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

export function truncate(text, n = 20) {
  const s = String(text);
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}
```

Module B — `modules/geometry.js`:

```js
export function areaCircle(r) {
  return Math.PI * r * r;
}
export function areaRect(w, h) {
  return w * h;
}
```

Use them in `app.js`:

```js
import { titleCase, truncate } from "./modules/strings.js";
import { areaCircle, areaRect } from "./modules/geometry.js";

log(titleCase("modules are cool and readable"));
log(truncate("A very very long sentence that needs trimming", 18));
log(`areaCircle(3) = ${areaCircle(3).toFixed(2)}`);
log(`areaRect(4, 6) = ${areaRect(4, 6)}`);
```

Checkpoints:

- Visual: Output shows transformed strings and computed areas.
- Network: New module files appear when reloading.

---

## 4) Optional quick hits (10 min)

Side‑effect import — `modules/sideEffects.js`:

```js
console.log("[sideEffects] ran once");
window.__sideEffectRan = true;
```

Live bindings — `modules/state.js`:

```js
export const counter = { value: 0 };
export function increment() {
  counter.value += 1;
}
```

Use in `app.js`:

```js
import "./modules/sideEffects.js";
import { counter, increment } from "./modules/state.js";

log(`counter: ${counter.value}`);
increment();
log(`counter after increment: ${counter.value}`);
```

Dynamic import on a button — `modules/lazy.js`:

```js
export const version = "1.0.0";
export function lazyMagic(x) {
  let acc = 1;
  for (let i = 1; i <= 20000; i++) acc = (acc * (x + i)) % 9973;
  return acc;
}
```

In `app.js` (wire to the button):

```js
document.getElementById("btnLazy").addEventListener("click", async () => {
  const { version, lazyMagic } = await import("./modules/lazy.js");
  log(`Lazy module loaded v${version}`);
  log(`lazyMagic(7) -> ${lazyMagic(7)}`);
});
```

Teaching notes:

- Side‑effects: code runs on import; prefer to keep them minimal.
- Live bindings: import is a live view of exported bindings.
- Dynamic import: loads on demand; observe the Network panel.

---

## 5) Recap (5 min)

- Default vs named exports; when to choose each.
- Namespace imports and aliasing to organize code.
- Optional patterns: side‑effects (sparingly), live bindings, dynamic import.
- Keep modules small and focused; avoid hidden globals.

Stretch ideas (if time remains):

- Add a barrel file `modules/index.js` that re‑exports helpers (e.g., from `math.js` and `strings.js`).
- Try an optional top‑level await example with a local `users.json` (must serve via HTTP).
