# Class 7 Upgrade Walkthrough — Step by Step
**From:** Class 6 (Search/Filter/Sort)  
**To:** Class 7 (Debounced search + tiny functional utilities)

---

## Step 0 — Confirm Class 6 baseline
- You have a search input, a “Has seats only” checkbox, and a sort dropdown.
- `getVisibleClubs()` filters and sorts, and `renderClubs()` uses it.
- Add/Remove Member UI still works.

---

## Step 1 — Add a `debounce` utility
**File:** `app.js`  
**Where:** Near the top (utilities section).

```js
// STEP 1: NEW — debounce helper
function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

**Why:** Delay updates while typing to reduce re-renders and jitter.

---

## Step 2 — Wire the search input to a debounced handler
**File:** `app.js`  
**Where:** Where you currently add the `"input"` listener for `#search`.

```js
// STEP 2: CHANGE — use a debounced function
const onSearchInput = debounce((value) => {
  ui.searchText = value;
  renderClubs();
}, 300);

document.getElementById("search").addEventListener("input", (e) => {
  onSearchInput(e.target.value); // pass value, not the event
});
```

**Why:** Passing the **value** avoids issues with reused event objects.

---

## Step 3 — Add a tiny `pipe` utility
**File:** `app.js`  
**Where:** Near `debounce`.

```js
// STEP 3: NEW — pipe (left-to-right composition)
function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
}
```

**Why:** Makes it easy to compose transformations clearly.

---

## Step 4 — Refactor list transforms into small functions
**File:** `app.js`  
**Where:** Replace your `getVisibleClubs()` with pipe-friendly helpers.

```js
// STEP 4: NEW — transforms
const applySearch = (list) => {
  const q = ui.searchText.trim().toLowerCase();
  if (!q) return list;
  return list.filter(c => c.name.toLowerCase().includes(q));
};

const applyOnlyOpen = (list) => {
  if (!ui.onlyOpen) return list;
  return list.filter(c => c.seatsLeft > 0);
};

const applySort = (list) => {
  const copy = list.slice();
  copy.sort((a, b) => {
    switch (ui.sortBy) {
      case "name-asc":      return a.name.localeCompare(b.name);
      case "name-desc":     return b.name.localeCompare(a.name);
      case "seats-desc":    return b.seatsLeft - a.seatsLeft;
      case "capacity-desc": return b.capacity - a.capacity;
      default:              return 0;
    }
  });
  return copy;
};
```

---

## Step 5 — Compose them with `pipe`
**File:** `app.js`  
**Where:** Below the transforms.

```js
// STEP 5: NEW — composed getter
const getVisibleClubs = pipe(
  (arr) => arr.slice(),
  applySearch,
  applyOnlyOpen,
  applySort
);
```

**Why:** Keeps logic simple to read, test, and extend later.

---

## Step 6 — Test it
- Type rapidly in the search input → rendering waits until you pause for ~300ms.
- Toggle “Has seats only” and change sort → still immediate.
- Add new clubs → they appear according to filters and sort.

---

## Optional Stretch
- Add a `throttle` helper and use it for an expensive scroll handler (if you add one).
- Add a tiny `compose` (right-to-left) variant and compare with `pipe`.

You’ve now introduced **higher-order functions** that improve UX and code clarity.
