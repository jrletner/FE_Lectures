# Student Practice Walkthrough – JavaScript Fundamentals (Pre‑Node)

Before we jump into Node.js/Express, let’s sharpen the core JavaScript muscles you’ll use everywhere. These tiny, copy‑pasteable exercises focus on: objects, destructuring, arrays, the most common array methods (map, filter, find), copying data safely, and patching records immutably with spread.

You will build 23 small demos:

- Part A — Objects: create, read, update
- Part B — Object destructuring (basics)
- Part C — Nested destructuring + defaults
- Part D — Array.map (transforming lists)
- Part E — Array.filter (keeping some)
- Part F — Array.find/ findIndex (locate one)
- Part G — Copying arrays/objects (spread, slice, structuredClone)
- Part H — Patching records in arrays (immutable updates with spread)
- Part I — Array.reduce (sum, min/max, group counts)
- Part J — Sorting immutably (slice + sort; localeCompare)
- Part K — Compose map/filter/reduce on a small dataset
- Part L — Mini CRUD: add/edit/delete items immutably
- Part M — Array.some / Array.every (validation checks)
- Part N — Array.includes and Set (membership lookups)
- Part O — Array.flat / flatMap (flatten nested lists)
- Part P — slice vs splice (immutable vs mutating)
- Part Q — Object.entries / fromEntries (pick/omit transforms)
- Part R — Map lookups and upsert pattern
- Part S — Group by key with reduce
- Part T — Async/await (simulate API call)
- Part U — Pagination (page + perPage)
- Part V — JSON.parse / JSON.stringify (serialize/parse safely)
- Part W — Object rest (sanitize/omit fields)

Each has explicit goals and a short "Run and Observe". Read the HINTS only if you get stuck.

---

## Why this matters for Express/Node APIs

On the server, you’ll often:

- Read data from requests (req.params, req.query, req.body).
- Pick the fields you need and send JSON back with res.json(...).
- Clean and shape lists (map, filter, find, reduce, sort).
- Add up numbers for totals and small reports.
- Try not to change arrays/objects in place to avoid bugs.

Each part has a short “Backend tie‑in” that says how this shows up in an API.

## One-time: Per‑Part Folder Structure and Template

For each exercise, create a separate folder so you end up with:

```
JS_Refresher_Exercises/
  part-a/
    index.html
    styles.css
    app.js
  part-b/
    index.html
    styles.css
    app.js
  ... up to part-w/
```

Use the same HTML/CSS template for every part; only the heading text changes. Open each part’s `index.html` in your browser when practicing that part.

<details><summary><code>index.html</code> (per‑part template)</summary>

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JS Fundamentals Refresher</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1>JavaScript Fundamentals Refresher</h1>
    <p class="muted">Work in <code>app.js</code> then run in live server.</p>
    <pre id="out"></pre>
    <script src="./app.js"></script>
  </body>
</html>
```

</details>

<details><summary><code>styles.css</code> (per‑part template)</summary>

```css
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
    sans-serif;
  padding: 1rem;
}
pre {
  background: #111;
  color: #0f0;
  padding: 1rem;
  border-radius: 8px;
}
.muted {
  color: #64748b;
}
```

</details>

---

## Part A — Objects: create, read, update

Plain English: Make an object, read fields, update them, and add a new field.

In plain words:

- Make a simple box of data with keys and values.
- Change a value and add a new key.

Backend tie‑in (simple):

- We make plain objects (like users or orders).
- Read req.body, add id/time, and send with res.json(...).

<details><summary><code>part-a/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Create a plain JS object (an object literal) to model a user record.
//    Keys on the left (id, name, role) and values on the right.
const userA = { id: 1, name: "Ada", role: "user" };

// 2) Update a property by assigning a new value.
//    Here we change the role from "user" to "admin".
userA.role = "admin";

// 3) Add a brand-new property by simple assignment.
//    If the key doesn't exist, JS creates it on the object.
userA.active = true;

// 4) Print to the page using the provided helper `show`.
//    It pretty-prints into the <pre id="out"> element.
show(userA, "A: object basics");
```

</details>

### Run and Observe

- You should see an object with id, name, role: "admin", and active: true.

---

## Part B — Object destructuring (basics)

Plain English: Pull properties into variables with the same names.

In plain words:

- Take values out of an object into variables.
- Use them directly without object.name every time.

Backend tie‑in (simple):

- Take only the fields you need from req.body/req.query.
- Example: const { email, password } = req.body.

<details><summary><code>part-b/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Start with an object that has several properties.
const book = { title: "Clean Code", author: "Robert C. Martin", year: 2008 };

// 2) Destructure pulls properties into variables by name.
//    This is the same as:
//    const title = book.title; const author = book.author;
const { title, author } = book;

// 3) Show only the values we picked out.
show({ title, author }, "B: destructuring basics");
```

</details>

### Run and Observe

- Output shows only title and author from the object.

---

## Part C — Nested destructuring + defaults

Plain English: Safely read nested fields and supply defaults when missing.

In plain words:

- Read a value inside another object safely.
- If it’s missing, use a default value.

Backend tie‑in (simple):

- Read optional nested fields without crashing.
- Fill a default when it’s missing.

<details><summary><code>part-c/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Example data with a nested object (profile.contact).
//    Sometimes nested properties may be missing.
const profile = { id: 2, name: "Bao", contact: { email: "b@example.com" } };

// 2) Nested destructuring lets us reach into contact to get email and phone.
//    We set a default ("n/a") for phone if it's not provided.
const {
  contact: { email, phone = "n/a" },
} = profile;

// 3) Output both values; phone shows the default.
show({ email, phone }, "C: nested + defaults");
```

</details>

### Run and Observe

- email is the real value; phone falls back to "n/a".

---

## Part D — Array.map (transforming lists)

Plain English: Map creates a new array by transforming every item.

In plain words:

- Make a new array by changing each item.
- Keep the original array the same.

Backend tie‑in (simple):

- Turn DB rows into the shape you return.
- Compute display fields (like fullName or total).

<details><summary><code>part-d/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Start with a simple array of numbers.
const nums = [1, 2, 3, 4];

// 2) map returns a NEW array by applying a function to each element.
//    This does not change the original array.
const doubled = nums.map((n) => n * 2);

// 3) Show original (unchanged) and the transformed copy.
show({ nums, doubled }, "D: map");
```

</details>

### Run and Observe

- Confirm that nums is unchanged and doubled has [2,4,6,8].

---

## Part E — Array.filter (keeping some)

Plain English: Filter creates a new array with items that pass a condition.

In plain words:

- Keep only items that pass a test.
- Original stays the same.

Backend tie‑in (simple):

- Respect filters like ?role=admin.
- Return only matching items.

<details><summary><code>part-e/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Array of objects we can query.
const users = [
  { id: 1, name: "Ada", role: "admin" },
  { id: 2, name: "Bao", role: "user" },
  { id: 3, name: "Caro", role: "admin" },
];

// 2) filter returns a NEW array with only the items that pass the test.
const admins = users.filter((u) => u.role === "admin");

// 3) Show both arrays (original should be unchanged).
show({ users, admins }, "E: filter");
```

</details>

### Run and Observe

- Verify the original users is unchanged; admins only contains role === 'admin'.

---

## Part F — Array.find / findIndex (locate one)

Plain English: Find returns the first match; findIndex returns its index.

In plain words:

- Find the first match or get undefined.
- Or find its index in the array.

Backend tie‑in (simple):

- Get one item by id (GET /:id).
- Return 404 if not found; index helps updates/removes.

<details><summary><code>part-f/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) A small catalog we can search.
const catalog = [
  { sku: "a1", name: "Pen" },
  { sku: "b2", name: "Pad" },
  { sku: "c3", name: "Pencil" },
];

// 2) find returns the FIRST matching element (or undefined if none).
const item = catalog.find((p) => p.sku === "b2");

// 3) findIndex returns the index of the first match (or -1 if none).
const idx = catalog.findIndex((p) => p.sku === "b2");

// 4) Display both so you can compare.
show({ item, idx }, "F: find & findIndex");
```

</details>

### Run and Observe

- See the found item and its index; the array is unchanged.

---

## Part G — Copying arrays/objects (spread, slice, structuredClone)

Plain English: Make independent copies, not references.

In plain words:

- Copy objects/arrays safely.
- Deep copy means nothing is shared.

Backend tie‑in (simple):

- Don’t change shared data by mistake.
- Copy before cleaning/validating.

<details><summary><code>part-g/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) An object with a nested array property.
const base = { name: "gadget", price: 10, tags: ["new"] };

// 2) Shallow copy: top-level properties are copied, but nested objects/arrays
//    are still SHARED between the copies.
const copyObj = { ...base };

// 3) Independent copy of the nested array (now not shared with base.tags).
const copyArr = base.tags.slice();

// 4) Deep copy of the whole structure: nothing is shared.
const deepCopy = structuredClone(base);

// 5) Change copies so we can observe the effects vs the original.
copyObj.name = "renamed";
copyArr.push("hot");

// 6) base.tags still has ["new"]; copyArr has ["new","hot"].
show({ base, copyObj, copyArr, deepCopy }, "G: copying");
```

</details>

### Run and Observe

- base remains unchanged except where shallow copy still shares nested arrays; deepCopy is fully independent.

---

## Part H — Patching records in arrays (immutable updates with spread)

Plain English: Update one record by mapping and replacing only the match.

In plain words:

- Change one item in a list without mutating.
- Return a new array.

Backend tie‑in (simple):

- For PATCH/PUT, replace only the changed record.
- Keep the original array untouched.

<details><summary><code>part-h/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) A list of people we want to update without mutating the original array.
const people = [
  { id: 1, name: "Ada", role: "user" },
  { id: 2, name: "Bao", role: "user" },
];

// 2) map returns a NEW array. For the matching id, return a NEW object using
//    spread to copy existing fields and override just the role.
const patched = people.map((p) => (p.id === 2 ? { ...p, role: "admin" } : p));

// 3) Show original vs patched to see immutability in action.
show({ people, patched }, "H: patch in array");
```

</details>

### Run and Observe

- Original array is unchanged; patched has id 2 with role changed to admin.

---

## Part I — Array.reduce (sum, min/max, group counts)

Plain English: Reduce folds a list into a single value or object.

In plain words:

- Add numbers up.
- Find the biggest.
- Count by category.

Backend tie‑in (simple):

- Totals and counts for simple reports.
- One pass over your data.

<details><summary><code>part-i/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) A list of orders with totals and status.
const orders = [
  { id: 1, total: 12, status: "paid" },
  { id: 2, total: 30, status: "pending" },
  { id: 3, total: 18, status: "paid" },
];

// 2) Sum: fold totals into one number (start at 0).
const sum = orders.reduce((acc, o) => acc + o.total, 0);

// 3) Max: keep the highest total seen so far (start at -Infinity so any number wins).
const max = orders.reduce((acc, o) => Math.max(acc, o.total), -Infinity);

// 4) Grouping: build an object of counts per status.
const byStatus = orders.reduce((acc, o) => {
  acc[o.status] = (acc[o.status] || 0) + 1;
  return acc;
}, {});

// 5) Show all three results together.
show({ sum, max, byStatus }, "I: reduce");
```

</details>

### Run and Observe

- See the total sum, max total, and counts per status.

---

## Part J — Sorting immutably (slice + sort; localeCompare)

Plain English: Don’t mutate the original; sort a copy.

In plain words:

- Sort a copy, not the original.
- Use localeCompare for names.

Backend tie‑in (simple):

- Sort by name or other fields.
- Keep source data unchanged.

<details><summary><code>part-j/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) An array of names with mixed case and accents.
const names = ["Zoe", "Álvaro", "alex"];

// 2) Never mutate the original when sorting: copy first.
const copy = names.slice();

// 3) localeCompare handles accents and case in a locale-aware way.
//    sensitivity:'base' makes 'alex' and 'Álvaro' compare ignoring case/accents.
copy.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

// 4) Show the original vs the sorted copy.
show({ original: names, sorted: copy }, "J: sort immutably");
```

</details>

### Run and Observe

- Original remains in its initial order; sorted uses locale‑aware comparison.

---

## Part K — Compose map/filter/reduce on a small dataset

Plain English: Chain common operations to answer questions about data.

In plain words:

- Filter → map → reduce to answer questions.
- Return both list and totals.

Backend tie‑in (simple):

- Common list flow: filter, shape, summarize.
- Send items and a small summary together.

<details><summary><code>part-k/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) A small dataset to practice chaining array methods.
const products = [
  { id: 1, name: "Pen", price: 2.5, inStock: true },
  { id: 2, name: "Pad", price: 5.0, inStock: false },
  { id: 3, name: "Pencil", price: 1.75, inStock: true },
  { id: 4, name: "Notebook", price: 4.25, inStock: true },
];

// 2) Keep only affordable items (<= 4).
const affordable = products.filter((p) => p.price <= 4);

// 3) Transform names to uppercase (on the filtered list).
const namesUpper = affordable.map((p) => p.name.toUpperCase());

// 4) Sum the prices of the filtered items.
const totalAffordable = affordable.reduce((acc, p) => acc + p.price, 0);

// 5) Display both the transformed names and the total.
show({ namesUpper, totalAffordable }, "K: map+filter+reduce");
```

</details>

### Run and Observe

- See the uppercase names and the total price of the filtered items.

---

## Part L — Mini CRUD: add/edit/delete items immutably

Plain English: Use spreads and filters to manage a list without mutating it.

In plain words:

- Add, edit, remove items without mutating.
- Use spread, map, filter.

Backend tie‑in (simple):

- Looks like POST/PUT/PATCH/DELETE.
- Safe array changes for demos.

<details><summary><code>part-l/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Start with two todos.
let todos = [
  { id: 1, text: "Read", done: false },
  { id: 2, text: "Write", done: false },
];

// 2) Add (Create): append a new item using spread to keep it immutable.
const newTodo = { id: 3, text: "Review", done: false };
todos = [...todos, newTodo];

// 3) Edit (Update): return a new array where the matching id is replaced
//    with a new object that flips done to true.
todos = todos.map((t) => (t.id === 2 ? { ...t, done: true } : t));

// 4) Delete (Remove): keep everything except id 1.
todos = todos.filter((t) => t.id !== 1);

// 5) Show the final list: id 3 exists, id 2 is done, id 1 is gone.
show(todos, "L: mini CRUD (immutable)");
```

</details>

### Run and Observe

- Confirm id 3 exists, id 2 is done: true, id 1 was removed.

---

## Part M — Array.some / Array.every (validation checks)

Plain English: some checks if any item matches; every checks if all items match.

In plain words:

- some = “any?”
- every = “all?”

Backend tie‑in (simple):

- Check “any admin?” or “all valid?”.
- Decide fast before saving.

<details><summary><code>part-m/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) some: does ANY item match the rule? every: do ALL items match?
const validRoles = ["admin", "user", "editor"];
const users = [
  { id: 1, role: "admin" },
  { id: 2, role: "user" },
];

// 2) any admin present?
const anyAdmin = users.some((u) => u.role === "admin");

// 3) are all roles valid?
const allValid = users.every((u) => validRoles.includes(u.role));

// 4) Show results of both checks.
show({ anyAdmin, allValid }, "M: some/every");
```

</details>

### Run and Observe

- anyAdmin is true; allValid is true.

---

## Part N — Array.includes and Set (membership lookups)

Plain English: includes checks if a value exists in an array; Set gives fast membership tests.

In plain words:

- Ask “is this in the list?”
- Set makes this very fast.

Backend tie‑in (simple):

- Allow roles or block banned ids.
- Use Set for speed.

<details><summary><code>part-n/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Set is great for fast membership checks (like a whitelist/allow-list).
const allowedRoles = new Set(["admin", "editor"]);
const users = [
  { id: 1, role: "admin" },
  { id: 2, role: "user" },
  { id: 3, role: "editor" },
];

// 2) Keep only users whose role is allowed.
const editable = users.filter((u) => allowedRoles.has(u.role));

// 3) Drop banned ids using Array.includes.
const bannedIds = [2];
const remaining = users.filter((u) => !bannedIds.includes(u.id));

// 4) Show both results.
show({ editable, remaining }, "N: includes + Set");
```

</details>

### Run and Observe

- editable contains admin and editor; remaining excludes id 2.

---

## Part O — Array.flat / flatMap (flatten nested lists)

Plain English: flat turns arrays-of-arrays into one array; flatMap maps then flattens one level.

In plain words:

- Flatten nested arrays.
- flatMap does map + flat.

Backend tie‑in (simple):

- Turn orders → items for easy loops.
- Good before counting or filtering.

<details><summary><code>part-o/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Example: orders with nested items.
const orders = [
  {
    id: 1,
    items: [
      { sku: "a", qty: 1 },
      { sku: "b", qty: 2 },
    ],
  },
  { id: 2, items: [{ sku: "a", qty: 3 }] },
];

// 2) flat: first map to arrays, then flatten one level.
const allItems = orders.map((o) => o.items).flat();

// 3) flatMap: map and flatten in one step.
const skus = orders.flatMap((o) => o.items.map((it) => it.sku));

// 4) Show counts and flattened values.
show({ itemCount: allItems.length, skus }, "O: flat/flatMap");
```

</details>

### Run and Observe

- itemCount is 3; skus lists all item sku values.

---

## Part P — slice vs splice (immutable vs mutating)

Plain English: slice copies a portion without changing the original; splice removes/insert in place and mutates the array.

In plain words:

- slice copies; splice changes the array.
- Know the difference.

Backend tie‑in (simple):

- Use slice for safe copies.
- Be careful with splice in shared data.

<details><summary><code>part-p/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

const arr = [1, 2, 3, 4];

// 1) slice creates a COPY of a range (start inclusive, end exclusive).
//    It does NOT change the original.
const copy = arr.slice(1, 3); // [2,3]

// 2) splice REMOVES/INSERTS IN PLACE and DOES mutate the original array.
const removed = arr.splice(1, 2); // arr becomes [1,4]

// 3) Show results to see the difference clearly.
show({ copy, removed, mutated: arr }, "P: slice vs splice");
```

</details>

### Run and Observe

- copy is [2,3]; removed is [2,3]; mutated is [1,4].

---

## Part Q — Object.entries / fromEntries (pick/omit transforms)

Plain English: Convert objects to key/value pairs and back to transform shapes.

In plain words:

- Turn an object into pairs to pick/omit.
- Build a new object from the pairs.

Backend tie‑in (simple):

- Remove password/token.
- Keep only safe fields.

<details><summary><code>part-q/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Start with an object that has a sensitive field.
const user = { id: 1, name: "Ada", role: "admin", password: "secret" };

// 2) Omit a field using entries -> filter -> fromEntries.
const safeEntries = Object.entries(user).filter(([k]) => k !== "password");
const safeUser = Object.fromEntries(safeEntries);

// 3) Pick only certain fields using the same technique.
const picked = Object.fromEntries(
  Object.entries(user).filter(([k]) => ["id", "name"].includes(k))
);

// 4) Show both results.
show({ safeUser, picked }, "Q: entries/fromEntries (pick/omit)");
```

</details>

### Run and Observe

- safeUser has no password; picked only contains id and name.

---

## Part R — Map lookups and upsert pattern

Plain English: Map provides fast lookups by key; use it to update or insert (upsert) efficiently.

In plain words:

- Map gives fast lookups by id.
- Update or insert (upsert).

Backend tie‑in (simple):

- Build byId caches.
- Convert back to array to return.

<details><summary><code>part-r/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Start with an array of records.
const list = [
  { id: 1, name: "Ada" },
  { id: 2, name: "Bao" },
];

// 2) Build a Map keyed by id for fast lookups.
const byId = new Map(list.map((u) => [u.id, u]));

// 3) Update existing id 2 (upsert: update-or-insert).
byId.set(2, { ...byId.get(2), name: "Bao Updated" });

// 4) Insert new id 3
byId.set(3, { id: 3, name: "Caro" });

// 5) Convert back to array for sending in a response.
const backToArray = Array.from(byId.values());
show({ backToArray }, "R: Map lookup/upsert");
```

</details>

### Run and Observe

- backToArray contains updated id 2 and new id 3.

---

## Part S — Group by key with reduce

Plain English: Build an object that groups items into arrays by a key.

In plain words:

- Group items by a field.
- Build buckets of items.

Backend tie‑in (simple):

- Users by role, orders by status.
- Handy for dashboards.

<details><summary><code>part-s/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Group users by a key (role) using reduce.
const users = [
  { id: 1, role: "admin" },
  { id: 2, role: "user" },
  { id: 3, role: "admin" },
];

// 2) (acc[key] ||= []) sets acc[key] to [] if it's falsy, then returns it.
//    Push the current user onto the correct bucket.
const byRole = users.reduce((acc, u) => {
  (acc[u.role] ||= []).push(u);
  return acc;
}, {});

// 3) Show the grouped result.
show(byRole, "S: groupBy (reduce)");
```

</details>

### Run and Observe

- byRole.admin contains two users; byRole.user contains one.

---

## Part T — Async/await (simulate API call)

Plain English: Use async/await to wait for a Promise (like a server call) and handle errors with try/catch.

In plain words:

- Wait for promises with await.
- Catch errors with try/catch.

Backend tie‑in (simple):

- DB/HTTP calls are async.
- Use async routes and await results.

<details><summary><code>part-t/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Simulate an async API: resolves with a user after 200ms.
function fakeFetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: id === 1 ? "Ada" : "Bao" }), 200);
  });
}

// 2) Await each call in order and handle errors.
async function main() {
  try {
    // Sequential: wait for user 1, then user 2 (~400ms total)
    const u1 = await fakeFetchUser(1);
    const u2 = await fakeFetchUser(2);

    // Show result in the page
    show({ u1, u2 }, "T: async/await");
  } catch (err) {
    // Handle rejected promises
    show({ error: String(err) }, "T: async/await error");
  }
}

// Optional: run both calls in parallel
// async function mainParallel() {
//   try {
//     const [u1, u2] = await Promise.all([
//       fakeFetchUser(1),
//       fakeFetchUser(2),
//     ]);
//     show({ u1, u2 }, "T: async/await (parallel)");
//   } catch (err) {
//     show({ error: String(err) }, "T: async/await error");
//   }
// }

// 3) Start the async work
main();
```

</details>

### Run and Observe

- You should see two user objects printed after a short delay.

---

## Part U — Pagination (page + perPage)

Plain English: Given a list, compute which items belong to a page using page and perPage.

In plain words:

- Figure out which items go on a page.
- Use page and perPage.

Backend tie‑in (simple):

- Support pagination in GET lists.
- Compute start/end, then slice.

<details><summary><code>part-u/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Example list of 23 items.
const items = Array.from({ length: 23 }, (_, i) => i + 1);

// 2) Current page and page size (1-based page).
const page = 2;
const perPage = 5;

// 3) Calculate total pages and slice range.
const totalPages = Math.ceil(items.length / perPage);
const start = (page - 1) * perPage;
const end = start + perPage;
const paged = items.slice(start, end);

// 4) Show paging info and items.
show(
  { page, perPage, total: items.length, totalPages, paged },
  "U: pagination"
);
```

</details>

### Run and Observe

- With page=2 and perPage=5, you should see items [6,7,8,9,10].

---

## Part V — JSON.parse / JSON.stringify (serialize/parse safely)

Plain English: Turn JS objects into strings (send/store), then back to objects. Note that Dates and functions don’t survive as-is.

In plain words:

- Change objects to strings and back.
- Fix types like Date after parsing.

Backend tie‑in (simple):

- Send/store JSON safely.
- Revive Dates when needed.

<details><summary><code>part-v/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) An object with a Date and a method.
const user = {
  id: 1,
  name: "Ada",
  createdAt: new Date(),
  sayHi() {
    return "hi";
  },
};

// 2) Stringify: converts to a JSON string (methods are dropped, Date becomes a string).
const json = JSON.stringify(user);

// 3) Parse back: we get plain data; createdAt is now a string, not a Date.
const parsed = JSON.parse(json);

// 4) Revive the date manually if needed.
const revived = { ...parsed, createdAt: new Date(parsed.createdAt) };

show(
  {
    json,
    parsedType: typeof parsed.createdAt, // "string"
    revivedIsDate: revived.createdAt instanceof Date, // true
  },
  "V: JSON stringify/parse"
);
```

</details>

### Run and Observe

- parsedType is "string"; revivedIsDate is true.

---

## Part W — Object rest (sanitize/omit fields)

Plain English: Use object rest to remove unwanted/sensitive fields. Optionally pick a whitelist.

In plain words:

- Remove secrets with object rest.
- Pick only the fields you want.

Backend tie‑in (simple):

- Drop password/token.
- Return only safe fields.

<details><summary><code>part-w/app.js</code></summary>

```js
// Render helper: prints JSON into <pre id="out">
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}

// 1) Incoming object with some fields we don't want to keep.
const incoming = {
  id: 1,
  name: "Ada",
  password: "secret",
  token: "abc",
  extra: true,
};

// 2) Omit sensitive fields via object rest (left side lists fields to drop).
const { password, token, ...safe } = incoming;

// 3) Whitelist pick using destructuring (provide defaults if missing).
const { id, name, role = "user" } = incoming;
const picked = { id, name, role };

show({ safe, picked }, "W: object rest (sanitize)");
```

</details>

### Run and Observe

- safe has no password/token; picked only includes id, name, role.

---

## Express glue: tiny route handler examples

These small handlers show how the skills above appear in real API code. This is an in‑memory demo (no database) but the patterns are the same when you swap the array for DB calls.

<details><summary>Setup: minimal server and seed data</summary>

```js
// Minimal Express server (demo only; no database here).
const express = require("express");
const app = express();

// Parse JSON bodies from clients.
app.use(express.json());

// In-memory "database" for examples.
let users = [
  { id: 1, name: "Ada", role: "admin", password: "secret" },
  { id: 2, name: "Bao", role: "user", password: "secret" },
  { id: 3, name: "Caro", role: "editor", password: "secret" },
];
let nextId = 4;

// Start the server.
app.listen(3000, () => console.log("API on http://localhost:3000"));
```

</details>

<details><summary>GET /users — filter (E), map/pick (D/Q), sort (J)</summary>

```js
// Supports an optional query: ?role=admin
app.get("/users", (req, res) => {
  const { role } = req.query;

  // 1) filter: keep only the role requested (or keep all if no query).
  let list = users.filter((u) => (!role ? true : u.role === role));

  // 2) map/pick: return only public fields (hide password).
  list = list.map((u) => ({ id: u.id, name: u.name, role: u.role }));

  // 3) sort: case/accents aware with localeCompare; copy first to avoid mutation.
  const sorted = list
    .slice()
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  res.json(sorted);
});
```

</details>

<details><summary>POST /users — destructure (B), validate (M/N), omit secrets (Q)</summary>

```js
app.post("/users", (req, res) => {
  // Pick only the fields we expect from the client.
  const { name, role, password } = req.body;

  const allowedRoles = new Set(["admin", "user", "editor"]);
  if (!name || !allowedRoles.has(role)) {
    return res.status(400).json({ error: "Invalid name or role" });
  }

  const user = { id: nextId++, name, role, password: password || "secret" };

  // Add immutably: create a new array with the new user appended.
  users = [...users, user];

  // Omit password in the response for safety.
  const safe = (({ id, name, role }) => ({ id, name, role }))(user);
  res.status(201).json(safe);
});
```

</details>

<details><summary>PATCH /users/:id — find (F), immutable update (H)</summary>

```js
app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "Not found" });

  const { name, role } = req.body;
  // Build a small patch object only with provided fields.
  const patch = {
    ...(name !== undefined ? { name } : {}),
    ...(role !== undefined ? { role } : {}),
  };
  const updated = { ...user, ...patch };

  // Immutable update: replace the matching user with the updated one.
  users = users.map((u) => (u.id === id ? updated : u));
  const safe = (({ id, name, role }) => ({ id, name, role }))(updated);
  res.json(safe);
});
```

</details>

<details><summary>DELETE /users/:id — filter out (E/L)</summary>

```js
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  // Check if the user exists first.
  const exists = users.some((u) => u.id === id);
  if (!exists) return res.status(404).json({ error: "Not found" });
  // Remove the user immutably.
  users = users.filter((u) => u.id !== id);
  res.status(204).send();
});
```

</details>

<details><summary>GET /users/summary — reduce/group (I/S)</summary>

```js
app.get("/users/summary", (req, res) => {
  // Build a counts object like { admin: 2, user: 1 }
  const byRole = users.reduce((acc, u) => {
    (acc[u.role] ||= 0)++;
    return acc;
  }, {});
  res.json({ count: users.length, byRole });
});
```

</details>

---

## Final Code (No Comments) – Reference

The same HTML/CSS template is used for every part; copy these into each `part-*/` folder.

<details><summary><code>index.html</code> (template)</summary>

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JS Fundamentals – Part</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1>JavaScript Fundamentals – Part</h1>
    <p class="muted">Work in <code>app.js</code> then refresh this page.</p>
    <pre id="out"></pre>
    <script src="./app.js"></script>
  </body>
</html>
```

</details>

<details><summary><code>styles.css</code> (template)</summary>

```css
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
    sans-serif;
  padding: 1rem;
}
pre {
  background: #111;
  color: #0f0;
  padding: 1rem;
  border-radius: 8px;
}
.muted {
  color: #64748b;
}
```

</details>

### Part A — Final `app.js`

<details><summary><code>part-a/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const userA = { id: 1, name: "Ada", role: "user" };
userA.role = "admin";
userA.active = true;
show(userA, "A: object basics");
```

</details>

### Part B — Final `app.js`

<details><summary><code>part-b/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const book = { title: "Clean Code", author: "Robert C. Martin", year: 2008 };
const { title, author } = book;
show({ title, author }, "B: destructuring basics");
```

</details>

### Part C — Final `app.js`

<details><summary><code>part-c/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const profile = { id: 2, name: "Bao", contact: { email: "b@example.com" } };
const {
  contact: { email, phone = "n/a" },
} = profile;
show({ email, phone }, "C: nested + defaults");
```

</details>

### Part D — Final `app.js`

<details><summary><code>part-d/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const nums = [1, 2, 3, 4];
const doubled = nums.map((n) => n * 2);
show({ nums, doubled }, "D: map");
```

</details>

### Part E — Final `app.js`

<details><summary><code>part-e/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const users = [
  { id: 1, name: "Ada", role: "admin" },
  { id: 2, name: "Bao", role: "user" },
  { id: 3, name: "Caro", role: "admin" },
];
const admins = users.filter((u) => u.role === "admin");
show({ users, admins }, "E: filter");
```

</details>

### Part F — Final `app.js`

<details><summary><code>part-f/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const catalog = [
  { sku: "a1", name: "Pen" },
  { sku: "b2", name: "Pad" },
  { sku: "c3", name: "Pencil" },
];
const item = catalog.find((p) => p.sku === "b2");
const idx = catalog.findIndex((p) => p.sku === "b2");
show({ item, idx }, "F: find & findIndex");
```

</details>

### Part G — Final `app.js`

<details><summary><code>part-g/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const base = { name: "gadget", price: 10, tags: ["new"] };
const copyObj = { ...base };
const copyArr = base.tags.slice();
const deepCopy = structuredClone(base);
copyObj.name = "renamed";
copyArr.push("hot");
show({ base, copyObj, copyArr, deepCopy }, "G: copying");
```

</details>

### Part H — Final `app.js`

<details><summary><code>part-h/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const people = [
  { id: 1, name: "Ada", role: "user" },
  { id: 2, name: "Bao", role: "user" },
];
const patched = people.map((p) => (p.id === 2 ? { ...p, role: "admin" } : p));
show({ people, patched }, "H: patch in array");
```

</details>

### Part I — Final `app.js`

<details><summary><code>part-i/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const orders = [
  { id: 1, total: 12, status: "paid" },
  { id: 2, total: 30, status: "pending" },
  { id: 3, total: 18, status: "paid" },
];
const sum = orders.reduce((acc, o) => acc + o.total, 0);
const max = orders.reduce((acc, o) => Math.max(acc, o.total), -Infinity);
const byStatus = orders.reduce((acc, o) => {
  acc[o.status] = (acc[o.status] || 0) + 1;
  return acc;
}, {});
show({ sum, max, byStatus }, "I: reduce");
```

</details>

### Part J — Final `app.js`

<details><summary><code>part-j/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const names = ["Zoe", "Álvaro", "alex"];
const copy = names.slice();
copy.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
show({ original: names, sorted: copy }, "J: sort immutably");
```

</details>

### Part K — Final `app.js`

<details><summary><code>part-k/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const products = [
  { id: 1, name: "Pen", price: 2.5, inStock: true },
  { id: 2, name: "Pad", price: 5.0, inStock: false },
  { id: 3, name: "Pencil", price: 1.75, inStock: true },
  { id: 4, name: "Notebook", price: 4.25, inStock: true },
];
const affordable = products.filter((p) => p.price <= 4);
const namesUpper = affordable.map((p) => p.name.toUpperCase());
const totalAffordable = affordable.reduce((acc, p) => acc + p.price, 0);
show({ namesUpper, totalAffordable }, "K: map+filter+reduce");
```

</details>

### Part L — Final `app.js`

<details><summary><code>part-l/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
let todos = [
  { id: 1, text: "Read", done: false },
  { id: 2, text: "Write", done: false },
];
const newTodo = { id: 3, text: "Review", done: false };
todos = [...todos, newTodo];
todos = todos.map((t) => (t.id === 2 ? { ...t, done: true } : t));
todos = todos.filter((t) => t.id !== 1);
show(todos, "L: mini CRUD (immutable)");
```

</details>

### Part M — Final `app.js`

<details><summary><code>part-m/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const validRoles = ["admin", "user", "editor"];
const users = [
  { id: 1, role: "admin" },
  { id: 2, role: "user" },
];
const anyAdmin = users.some((u) => u.role === "admin");
const allValid = users.every((u) => validRoles.includes(u.role));
show({ anyAdmin, allValid }, "M: some/every");
```

</details>

### Part N — Final `app.js`

<details><summary><code>part-n/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const allowedRoles = new Set(["admin", "editor"]);
const users = [
  { id: 1, role: "admin" },
  { id: 2, role: "user" },
  { id: 3, role: "editor" },
];
const editable = users.filter((u) => allowedRoles.has(u.role));
const bannedIds = [2];
const remaining = users.filter((u) => !bannedIds.includes(u.id));
show({ editable, remaining }, "N: includes + Set");
```

</details>

### Part O — Final `app.js`

<details><summary><code>part-o/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const orders = [
  {
    id: 1,
    items: [
      { sku: "a", qty: 1 },
      { sku: "b", qty: 2 },
    ],
  },
  { id: 2, items: [{ sku: "a", qty: 3 }] },
];
const allItems = orders.map((o) => o.items).flat();
const skus = orders.flatMap((o) => o.items.map((it) => it.sku));
show({ itemCount: allItems.length, skus }, "O: flat/flatMap");
```

</details>

### Part P — Final `app.js`

<details><summary><code>part-p/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const arr = [1, 2, 3, 4];
const copy = arr.slice(1, 3);
const removed = arr.splice(1, 2);
show({ copy, removed, mutated: arr }, "P: slice vs splice");
```

</details>

### Part Q — Final `app.js`

<details><summary><code>part-q/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const user = { id: 1, name: "Ada", role: "admin", password: "secret" };
const safeEntries = Object.entries(user).filter(([k]) => k !== "password");
const safeUser = Object.fromEntries(safeEntries);
const picked = Object.fromEntries(
  Object.entries(user).filter(([k]) => ["id", "name"].includes(k))
);
show({ safeUser, picked }, "Q: entries/fromEntries (pick/omit)");
```

</details>

### Part R — Final `app.js`

<details><summary><code>part-r/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const list = [
  { id: 1, name: "Ada" },
  { id: 2, name: "Bao" },
];
const byId = new Map(list.map((u) => [u.id, u]));
byId.set(2, { ...byId.get(2), name: "Bao Updated" });
byId.set(3, { id: 3, name: "Caro" });
const backToArray = Array.from(byId.values());
show({ backToArray }, "R: Map lookup/upsert");
```

</details>

### Part S — Final `app.js`

<details><summary><code>part-s/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const users = [
  { id: 1, role: "admin" },
  { id: 2, role: "user" },
  { id: 3, role: "admin" },
];
const byRole = users.reduce((acc, u) => {
  (acc[u.role] ||= []).push(u);
  return acc;
}, {});
show(byRole, "S: groupBy (reduce)");
```

</details>

### Part T — Final `app.js`

<details><summary><code>part-t/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
function fakeFetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: id === 1 ? "Ada" : "Bao" }), 200);
  });
}
async function main() {
  const u1 = await fakeFetchUser(1);
  const u2 = await fakeFetchUser(2);
  show({ u1, u2 }, "T: async/await");
}
main();
```

</details>

### Part U — Final `app.js`

<details><summary><code>part-u/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const items = Array.from({ length: 23 }, (_, i) => i + 1);
const page = 2;
const perPage = 5;
const totalPages = Math.ceil(items.length / perPage);
const start = (page - 1) * perPage;
const end = start + perPage;
const paged = items.slice(start, end);
show(
  { page, perPage, total: items.length, totalPages, paged },
  "U: pagination"
);
```

</details>

### Part V — Final `app.js`

<details><summary><code>part-v/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const user = {
  id: 1,
  name: "Ada",
  createdAt: new Date(),
  sayHi() {
    return "hi";
  },
};
const json = JSON.stringify(user);
const parsed = JSON.parse(json);
const revived = { ...parsed, createdAt: new Date(parsed.createdAt) };
show(
  {
    json,
    parsedType: typeof parsed.createdAt,
    revivedIsDate: revived.createdAt instanceof Date,
  },
  "V: JSON stringify/parse"
);
```

</details>

### Part W — Final `app.js`

<details><summary><code>part-w/app.js</code> (final)</summary>

```js
const out = document.getElementById("out");
function show(data, title = "") {
  const header = title ? `\n# ${title}\n` : "";
  out.textContent = header + JSON.stringify(data, null, 2);
}
const incoming = {
  id: 1,
  name: "Ada",
  password: "secret",
  token: "abc",
  extra: true,
};
const { password, token, ...safe } = incoming;
const { id, name, role = "user" } = incoming;
const picked = { id, name, role };
show({ safe, picked }, "W: object rest (sanitize)");
```

</details>
