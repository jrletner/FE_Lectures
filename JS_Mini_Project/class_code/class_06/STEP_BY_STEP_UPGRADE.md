# Class 6 Upgrade Walkthrough — Step by Step
**From:** Class 5 (OOP + Add Member UI)  
**To:** Class 6 (Search/Filter/Sort with arrays & loops)

This guide shows exactly how to add the toolbar and wire it into your rendering.

---

## Step 0 — Confirm Class 5 baseline
- You have `Club`, `Member`, and `EventItem` classes.
- `clubs` is an array of `Club` instances.
- `renderClubs()` shows club stats and a Members list with add/remove actions.
- You still have the Create Club form.

---

## Step 1 — Add the toolbar (HTML)
**File:** `index.html`  
**Where:** **Below the form** and **above** `#club-info`.

```html
<!-- STEP 1: NEW — Toolbar -->
<section class="toolbar">
  <input id="search" class="input" type="search" placeholder="Search clubs..." aria-label="Search clubs by name" />
  <label class="checkbox">
    <input id="only-open" type="checkbox" />
    Has seats only
  </label>
  <label for="sort-by">Sort by:</label>
  <select id="sort-by" class="select" aria-label="Sort clubs">
    <option value="name-asc">Name (A–Z)</option>
    <option value="name-desc">Name (Z–A)</option>
    <option value="seats-desc">Seats left (High→Low)</option>
    <option value="capacity-desc">Capacity (High→Low)</option>
  </select>
</section>
```

---

## Step 2 — Add simple toolbar styles (CSS)
**File:** `styles.css`  
**Where:** Append these (or keep ours).

```css
/* STEP 2: NEW — toolbar styles */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin: 12px 0 16px;
}
.input, .select {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}
.checkbox { display: inline-flex; gap: 6px; align-items: center; color: #444; }
```

---

## Step 3 — UI state and derived list (JS)
**File:** `app.js`  
**Where:** Near the top, **after** your models and `clubs` array.

```js
// STEP 3: NEW — UI state
const ui = {
  searchText: "",
  onlyOpen: false,
  sortBy: "name-asc",
};

// STEP 3: NEW — filter + sort
function getVisibleClubs() {
  let list = clubs.slice();

  const q = ui.searchText.trim().toLowerCase();
  if (q) list = list.filter(c => c.name.toLowerCase().includes(q));

  if (ui.onlyOpen) list = list.filter(c => c.seatsLeft > 0);

  list.sort((a, b) => {
    switch (ui.sortBy) {
      case "name-asc":      return a.name.localeCompare(b.name);
      case "name-desc":     return b.name.localeCompare(a.name);
      case "seats-desc":    return b.seatsLeft - a.seatsLeft;
      case "capacity-desc": return b.capacity - a.capacity;
      default: return 0;
    }
  });

  return list;
}
```

---

## Step 4 — Render the **visible** list
**File:** `app.js`  
**Where:** Inside `renderClubs()`.

```js
// STEP 4: CHANGE — use the derived list
const visible = getVisibleClubs();
if (visible.length === 0) {
  const p = document.createElement("p");
  p.textContent = "No clubs match your filters.";
  container.appendChild(p);
  return;
}
visible.forEach((club) => { /* ...render each card... */ });
```

---

## Step 5 — Wire the toolbar events
**File:** `app.js`  
**Where:** Below your form handler.

```js
// STEP 5: NEW — event listeners
document.getElementById("search").addEventListener("input", (e) => {
  ui.searchText = e.target.value;
  renderClubs();
});

document.getElementById("only-open").addEventListener("change", (e) => {
  ui.onlyOpen = e.target.checked;
  renderClubs();
});

document.getElementById("sort-by").addEventListener("change", (e) => {
  ui.sortBy = e.target.value;
  renderClubs();
});
```

---

## Step 6 — Test your filters
- Type “club” in search → shows those whose names include it.
- Check “Has seats only” → removes full clubs.
- Change sort → list reorders accordingly.

---

## Optional Stretch
- Add a **category** field to `Club` and filter by it.
- Add a **range slider** for minimum capacity.
- Add tiny **highlighting** of search matches (wrap in `<strong>`).

You’ve now used **arrays and loops** (`filter`, `sort`, `forEach`) to control what appears on screen.
