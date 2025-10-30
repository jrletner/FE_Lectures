# 10_30_25 — Word Problems (Vanilla JavaScript)

These six short problems use the same skills you practiced. Read each problem. Solve it with plain JavaScript. Keep your code small and clear.

Output and run:

- Use `console.log(...)` to print your answers so you can see the result.
- With Node.js: save your code to a file like `problem1.js`, then run it in a terminal with:
  - `node problem1.js`

---

## Problem 1 — Keep only safe fields

You have an employee profile. It has private fields like `token` and `salary`. Make a new object that only keeps: `id`, `fullName`, `department`. Do not include private fields.

Data:

```js
const employee = {
  id: 42,
  fullName: "Sam Rivera",
  department: "Support",
  token: "abc123",
  salary: 70000,
};
```

Goal:

- Make `publicEmployee` that looks like: `{ id: 42, fullName: "Sam Rivera", department: "Support" }`

Skills you will use: object destructuring, object rest, Object.entries/Object.fromEntries (Parts B, Q, W)

<details><summary>Hint</summary>

- Keywords: "pick only these fields", "omit secret fields", "don’t mutate".
- Make a new object that keeps id, fullName, department. Leave the original alone.
- You can either pick the fields you want or omit the ones you don’t.
- See 10_30_25: Part B (destructuring), Part Q (entries/fromEntries pick/omit), Part W (object rest to omit).

</details>

---

## Problem 2 — Affordable names and total

You have a list of services. Keep only services that cost `20` or less. Make labels like `"Setup - $10"` for each kept service. Also add up the total fee of the kept services.

Data:

```js
const services = [
  { id: 1, name: "Setup", fee: 10 },
  { id: 2, name: "Consult", fee: 25 },
  { id: 3, name: "Repair", fee: 15 },
  { id: 4, name: "Tune", fee: 20 },
];
```

Goal:

- Get `labels = ["Setup - $10", "Repair - $15", "Tune - $20"]`
- Get `totalFee = 45` (10 + 15 + 20)

Skills you will use: filter, map, reduce (Parts D, E, K)

<details><summary>Hint</summary>

- Keywords: "filter <= 20", "format label", "sum fees".
- Work in this order: filter → map/format → reduce/sum.
- Keep arrays immutable (create new arrays instead of changing the original).
- See 10_30_25: Part E (filter), Part D (map), Part I (reduce), Part K (chain them together).

</details>

---

## Problem 3 — Mark a todo as done (without changing the original)

You have an inventory list. Make a new list where the item with `sku: "B2"` has its `stock` increased by `5`. Do not change other items. Do not mutate the original array.

Data:

```js
const inventory = [
  { sku: "A1", name: "Cable", stock: 3 },
  { sku: "B2", name: "Mouse", stock: 4 },
  { sku: "C3", name: "Pad", stock: 2 },
];
```

Goal:

- Build `updated` where only sku `B2` has `stock + 5`.
- `inventory` (the original) must stay the same.

Skills you will use: map with a condition, object spread, immutable update (Parts H, L)

<details><summary>Hint</summary>

- Keywords: "immutable update", "replace only the matching item".
- You can either use map with a condition or use findIndex + slice/spread.
- Return a new array; copy the matching object and change only its stock.
- See 10_30_25: Part H (patch in array), Part L (mini CRUD immutably), Part F (findIndex).

</details>

---

## Problem 4 — Admins sorted by name

You have a list of contributors. Keep only users with role `"editor"`. Sort them by `name` in descending order (Z → A), ignoring case/accents.

Data:

```js
const contributors = [
  { id: 1, name: "Zoe", role: "editor" },
  { id: 2, name: "Álvaro", role: "user" },
  { id: 3, name: "alex", role: "editor" },
  { id: 4, name: "Bao", role: "maintainer" },
];
```

Goal:

- Get a new array of only editors, sorted by name (Z → A) using a locale-aware compare.
- Do not mutate the original `contributors` array.

Skills you will use: filter, slice + sort with `localeCompare` (Parts E, J)

<details><summary>Hint</summary>

- Keywords: "keep editors", "sort by name (Z→A)", "ignore case/accents".
- Filter first to only editors. Then copy before sorting so you don’t mutate.
- Use localeCompare with sensitivity:"base" and flip the comparator for descending.
- See 10_30_25: Part E (filter), Part J (slice + sort with localeCompare).

</details>

---

## Problem 5 — Count by status and find the max total

You have a list of tickets. Count how many tickets per `priority`. Also find the smallest `estimate` value.

Data:

```js
const tickets = [
  { id: 1, estimate: 5, priority: "high" },
  { id: 2, estimate: 2, priority: "low" },
  { id: 3, estimate: 3, priority: "high" },
  { id: 4, estimate: 8, priority: "medium" },
];
```

Goal:

- Make `byPriority` like `{ high: 2, low: 1, medium: 1 }`
- Make `minEstimate = 2`

Skills you will use: reduce, Math.max (Part I)

<details><summary>Hint</summary>

- Keywords: "count by priority", "find smallest estimate".
- Use reduce to build an object of counts: acc[key] = (acc[key] || 0) + 1.
- For the min, track the smallest value seen (compare with Math.min).
- See 10_30_25: Part I (reduce patterns: sum, min/max, group counts).

</details>

---

## Problem 6 — Get two users (async)

You have a function that returns an order after a short delay. Get order `101` and order `102`. First write the sequential version. Then write a parallel version.

Data:

```js
function fakeFetchOrder(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, total: id === 101 ? 25 : 40 }), 200);
  });
}
```

Goal:

- Sequential: wait for order 101, then order 102. Show both.
- Parallel: start both at the same time with `Promise.all`.
- Handle errors with `try/catch`.

Skills you will use: async/await, try/catch, Promise.all (Part T)

<details><summary>Hint</summary>

- Keywords: "sequential await", "parallel Promise.all", "try/catch".
- Sequential: await the first call, then await the second.
- Parallel: start both promises and await them together with Promise.all.
- Wrap in try/catch to handle errors. Print both orders when done.
- See 10_30_25: Part T (async/await with sequential vs parallel examples).

</details>

---

Tip: Keep your solutions tiny. Prefer one pass over the data when you can. Avoid changing the original arrays/objects.

---

## Problem 7 — Whitelist only public post fields

You have a post. It has private fields like `draft` and `internalNotes`. Make a new object that only keeps: `id`, `title`, `author`.

Data:

```js
const post = {
  id: 9,
  title: "Hello",
  body: "Some text...",
  author: "Sam",
  draft: true,
  internalNotes: "remove before send",
};
```

Goal:

- Make `publicPost` that looks like: `{ id: 9, title: "Hello", author: "Sam" }`

Skills you will use: entries/fromEntries pick, destructuring pick (Parts Q, B, W)

<details><summary>Hint</summary>

- Keywords: "whitelist pick", "omit private", "don’t mutate".
- Build a small allow-list of keys, then keep only those pairs.
- Or destructure the 3 fields and build a new object from them.
- See 10_30_25: Part Q (entries/fromEntries), Part B (destructuring), Part W (object rest idea).

</details>

---

## Problem 8 — Check roles are valid and any overdue

You have users with roles and an `overdue` flag. Check if every role is allowed. Also check if any user is overdue.

Data:

```js
const users = [
  { id: 1, role: "admin", overdue: false },
  { id: 2, role: "guest", overdue: true },
  { id: 3, role: "editor", overdue: false },
];
const allowedRoles = new Set(["admin", "user", "editor"]);
```

Goal:

- `allRolesValid` should be `false` for the data above (because of `guest`).
- `anyOverdue` should be `true`.

Skills you will use: some/every, Set.has (Parts M, N)

<details><summary>Hint</summary>

- Keywords: "every role allowed?", "any overdue?".
- Use a Set for fast role checks with `.has(role)`.
- Use `.every(...)` for the roles, `.some(...)` for overdue.
- See 10_30_25: Part M (some/every), Part N (Set membership).

</details>

---

## Problem 9 — Flatten items and total quantity by SKU

You have orders that each contain `items`. Flatten to a single list, then count the total quantity per `sku`.

Data:

```js
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
```

Goal:

- Make `skuCounts` like `{ a: 4, b: 2 }` (sum quantities per sku).

Skills you will use: flatMap, reduce (Parts O, I)

<details><summary>Hint</summary>

- Keywords: "flatten items", "group and sum qty".
- First, make one array of all items.
- Then reduce into an object: add qty into the bucket for each sku.
- See 10_30_25: Part O (flat/flatMap), Part I (reduce grouping + sum).

</details>

---

## Problem 10 — Paginate comments (page 3 of 5 per page)

You have comments. Return the items for page 3 when `perPage = 5`.

Data:

```js
const comments = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  text: `C${i + 1}`,
}));
const page = 3;
const perPage = 5;
```

Goal:

- Get `totalPages = 4`.
- Get `paged` with comments 11–15.

Skills you will use: pagination math + slice (Part U)

<details><summary>Hint</summary>

- Keywords: "start index", "end index", "slice copy".
- `start = (page - 1) * perPage`; `end = start + perPage`; then slice.
- Total pages: `Math.ceil(total / perPage)`.
- See 10_30_25: Part U (pagination).

</details>
