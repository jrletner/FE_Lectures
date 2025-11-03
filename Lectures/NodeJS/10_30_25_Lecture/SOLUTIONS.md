# Solutions — 11_03_25 Word Problems

Below are one clear way to solve each problem using the skills from 10/30. Keep things tiny and readable.

---

## Problem 1 — Keep only safe fields

```js
// Start with an employee that has private fields (token, salary).
const employee = {
  // define an object with both public and private fields
  id: 42,
  fullName: "Sam Rivera",
  department: "Support",
  token: "abc123",
  salary: 70000,
};

// Option: use object rest to omit private fields (non-mutating).
const { token, salary, ...publicEmployee } = employee; // drop private fields; keep the rest

// Show the result in the console:
console.log("Problem 1 → publicEmployee:", publicEmployee); // { id, fullName, department }
```

---

## Problem 2 — Affordable labels and total fee

```js
// Input list of services.
const services = [
  // array of service objects
  { id: 1, name: "Setup", fee: 10 }, // affordable
  { id: 2, name: "Consult", fee: 25 }, // too expensive
  { id: 3, name: "Repair", fee: 15 }, // affordable
  { id: 4, name: "Tune", fee: 20 }, // affordable (edge)
];

// Chain: filter → map (format labels) → reduce (sum fees)
const affordable = services.filter((s) => s.fee <= 20); // keep fee <= 20
const labels = affordable.map((s) => `${s.name} - $${s.fee}`); // format labels
const totalFee = affordable.reduce((acc, s) => acc + s.fee, 0); // sum fees

// Show the results:
console.log("Problem 2 → labels & totalFee:", { labels, totalFee }); // expected labels, total 45
```

---

## Problem 3 — Increase stock immutably (without changing the original)

```js
// Original inventory list. Do NOT mutate this array.
const inventory = [
  // starting array of items
  { sku: "A1", name: "Cable", stock: 3 }, // item A1
  { sku: "B2", name: "Mouse", stock: 4 }, // item B2 (target)
  { sku: "C3", name: "Pad", stock: 2 }, // item C3
];

// Approach: find the index, then rebuild the array immutably with slice/spread.
const idx = inventory.findIndex((it) => it.sku === "B2"); // locate B2
const updated =
  idx === -1
    ? inventory // if not found, return original
    : [
        ...inventory.slice(0, idx), // items before
        { ...inventory[idx], stock: inventory[idx].stock + 5 }, // copy and change
        ...inventory.slice(idx + 1), // items after
      ];

// Show original and updated to verify immutability.
console.log("Problem 3 → original inventory:", inventory); // original stays unchanged
console.log("Problem 3 → updated inventory:", updated); // only B2 stock increased
```

---

## Problem 4 — Editors sorted by name (descending)

```js
// Mixed list of contributors.
const contributors = [
  // array of contributor records
  { id: 1, name: "Zoe", role: "editor" }, // editor
  { id: 2, name: "Álvaro", role: "user" }, // not editor
  { id: 3, name: "alex", role: "editor" }, // editor
  { id: 4, name: "Bao", role: "maintainer" }, // not editor
];
// 1) Keep only editors.
const editors = contributors.filter((u) => u.role === "editor"); // filter to role === 'editor'
// 2) Sort a COPY immutably; use localeCompare; descending (Z→A).
const sorted = editors
  .slice() // copy first
  .sort((a, b) =>
    b.name.localeCompare(a.name, undefined, { sensitivity: "base" })
  ); // reverse compare for desc

// Show the result and ensure original contributors remain unchanged.
console.log("Problem 4 → sorted editors (desc):", sorted); // print sorted editors
console.log("Problem 4 → original contributors still:", contributors); // confirm original array unchanged
```

---

## Problem 5 — Count by priority and find the min estimate

```js
// Tickets with estimates and priority.
const tickets = [
  // array of tickets
  { id: 1, estimate: 5, priority: "high" }, // ticket 1
  { id: 2, estimate: 2, priority: "low" }, // ticket 2
  { id: 3, estimate: 3, priority: "high" }, // ticket 3
  { id: 4, estimate: 8, priority: "medium" }, // ticket 4
];
// 1) Count tickets by priority.
const byPriority = tickets.reduce((acc, t) => {
  // acc = counts object
  acc[t.priority] = (acc[t.priority] || 0) + 1; // increment bucket
  return acc; // pass acc forward
}, {}); // initial empty object

// 2) Track the minimum estimate seen.
const minEstimate = tickets.reduce(
  (acc, t) => Math.min(acc, t.estimate),
  Infinity
); // keep smallest estimate

// Show both results.
console.log("Problem 5 → byPriority & minEstimate:", {
  byPriority,
  minEstimate,
}); // expected counts and min
```

---

## Problem 6 — Get two orders (async)

```js
// Simulates a small delayed API call that returns an order.
function fakeFetchOrder(id) {
  // returns a Promise that resolves to an order
  return new Promise((resolve) => {
    // create a Promise wrapper
    setTimeout(() => resolve({ id, total: id === 101 ? 25 : 40 }), 200); // resolve after 200ms
  });
}

// Sequential
async function mainSequential() {
  // sequential fetches
  try {
    const o1 = await fakeFetchOrder(101); // wait for order 101
    const o2 = await fakeFetchOrder(102); // then wait for order 102
    console.log("Problem 6 (sequential) →", { o1, o2 }); // log both orders
  } catch (err) {
    console.log("Problem 6 (sequential) error →", { error: String(err) }); // log error
  }
}

// Parallel
async function mainParallel() {
  // parallel fetches
  try {
    const [o1, o2] = await Promise.all([
      fakeFetchOrder(101),
      fakeFetchOrder(102),
    ]); // run together
    console.log("Problem 6 (parallel) →", { o1, o2 }); // log both orders
  } catch (err) {
    console.log("Problem 6 (parallel) error →", { error: String(err) }); // log error
  }
}

// Run one:
// mainSequential(); // uncomment to run the sequential version
// mainParallel();   // uncomment to run the parallel version
```

---

## Problem 7 — Whitelist only public post fields

```js
// Post with private fields to omit.
const post = {
  // full post object
  id: 9,
  title: "Hello",
  body: "Some text...",
  author: "Sam",
  draft: true,
  internalNotes: "remove before send",
};

// Keep only the keys in this whitelist.
const allow = new Set(["id", "title", "author"]); // allowed keys
const publicPost = Object.fromEntries(
  // rebuild object from filtered entries
  Object.entries(post).filter(([k]) => allow.has(k)) // keep only allowed pairs
);

console.log("Problem 7 → publicPost:", publicPost); // { id, title, author }
```

---

## Problem 8 — Check roles are valid and any overdue

```js
// Users and an allowed roles set.
const users = [
  // list of users to validate
  { id: 1, role: "admin", overdue: false },
  { id: 2, role: "guest", overdue: true },
  { id: 3, role: "editor", overdue: false },
];
const allowedRoles = new Set(["admin", "user", "editor"]); // allowed set

// Are all roles valid?
const allRolesValid = users.every((u) => allowedRoles.has(u.role)); // false (guest not allowed)

// Is any user overdue?
const anyOverdue = users.some((u) => u.overdue === true); // true

console.log("Problem 8 → allRolesValid, anyOverdue:", {
  allRolesValid,
  anyOverdue,
});
```

---

## Problem 9 — Flatten items and total quantity by SKU

```js
// Orders with nested items.
const orders = [
  // two orders
  {
    id: 1,
    items: [
      { sku: "a", qty: 1 },
      { sku: "b", qty: 2 },
    ],
  },
  { id: 2, items: [{ sku: "a", qty: 3 }] },
];

// Flatten all items from all orders.
const allItems = orders.flatMap((o) => o.items); // [ {sku:a,1}, {sku:b,2}, {sku:a,3} ]

// Sum quantities per sku.
const skuCounts = allItems.reduce((acc, it) => {
  // acc is an object bucket
  acc[it.sku] = (acc[it.sku] || 0) + it.qty; // add qty to this sku
  return acc; // pass along
}, {});

console.log("Problem 9 → skuCounts:", skuCounts); // { a: 4, b: 2 }
```

---

## Problem 10 — Paginate comments (page 3 of 5 per page)

```js
// Generate 17 comments like { id: n, text: "Cn" }.
const comments = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  text: `C${i + 1}`,
}));
const page = 3; // 1-based page index
const perPage = 5; // items per page

// Compute total pages and slice the window for page 3.
const totalPages = Math.ceil(comments.length / perPage); // 4
const start = (page - 1) * perPage; // (3-1)*5 = 10 (0-based index)
const end = start + perPage; // 15 (slice end is exclusive)
const paged = comments.slice(start, end); // ids 11..15

console.log("Problem 10 → totalPages & paged:", { totalPages, paged });
```
