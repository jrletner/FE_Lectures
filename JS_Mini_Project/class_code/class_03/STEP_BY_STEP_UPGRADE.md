# Class 3 Upgrade Walkthrough — Step by Step
**From:** Class 2 (static list)  
**To:** Class 3 (Create Club form + validation + dynamic rendering)

This guide shows **exactly what to add or change** compared to last week. Each step includes:
- **Where** the code goes
- A **copy‑paste block**
- (Sometimes) a small **diff** to show changes

> Tip: Do one step at a time and refresh the browser after each.

---

## Step 0 — Confirm your Class 2 baseline
You should have:
- `index.html` with a heading and a `<div id="club-info"></div>`
- `styles.css` with very simple styles
- `app.js` that renders two hardcoded clubs to the page

**Class 2 example render (what you likely have now):**
```js
// Class 2 example (you'll replace this in Step 6)
let clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club", current: 8, capacity: 15 },
];

const clubInfoDiv = document.getElementById("club-info");
clubInfoDiv.innerHTML = "";
clubs.forEach(club => {
  const seatsLeft = club.capacity - club.current;
  const card = document.createElement("div");
  card.className = "club-card";
  card.textContent = `${club.name}: ${club.current}/${club.capacity} (${seatsLeft} left)`;
  clubInfoDiv.appendChild(card);
});
```

---

## Step 1 — Add the Create Club form (HTML)
**File:** `index.html`  
**Where:** **Above** the `#club-info` container.

```html
<!-- STEP 1: NEW — Create Club form -->
<form id="club-form" class="form">
  <div class="form-row">
    <label for="club-name">Club Name</label>
    <input type="text" id="club-name" placeholder="e.g., Chess Club" />
  </div>
  <div class="form-row">
    <label for="club-capacity">Max Capacity</label>
    <input type="number" id="club-capacity" placeholder="e.g., 20" min="1" />
  </div>
  <button type="submit" class="btn">Add Club</button>
  <p id="error-message" class="error" role="alert" aria-live="polite"></p>
</form>
```

---

## Step 2 — Add a few simple styles (CSS)
**File:** `styles.css`  
**Where:** **Append** these to the end (or adapt your existing styles).

```css
/* STEP 2: NEW — basic form and card styles */
.form { background: #fff; border: 1px solid #ddd; padding: 12px; margin-bottom: 16px; border-radius: 6px; }
.form-row { display: flex; gap: 10px; align-items: center; margin-bottom: 8px; }
.form-row label { width: 120px; }
.form-row input { flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
.btn { padding: 8px 12px; border: 1px solid #999; background: #fafafa; cursor: pointer; border-radius: 4px; }
.error { color: #c00; margin-top: 8px; }
.cards { display: grid; gap: 10px; }
.club-card { border: 1px solid #ccc; background: #fff; padding: 10px; border-radius: 6px; }
```

---

## Step 3 — Make a reusable render function (JS)
**File:** `app.js`  
**Where:** Near the top of the file, **define** this function and call it once.

```js
// STEP 3: NEW — reusable render function
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = ""; // clear

  if (clubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs yet. Add one above to get started.";
    container.appendChild(p);
    return;
  }

  clubs.forEach((club) => {
    const seatsLeft = club.capacity - club.current;
    const card = document.createElement("div");
    card.className = "club-card";
    card.textContent = `${club.name}: ${club.current}/${club.capacity} seats filled (${seatsLeft} left)`;
    container.appendChild(card);
  });
}

// Initial paint
renderClubs();
```

**Replace** your old Class 2 one-off render loop with this function call.
A quick way is to delete your old `const clubInfoDiv = ...` block and keep only `renderClubs()`.

---

## Step 4 — Add the form submit handler (JS)
**File:** `app.js`  
**Where:** **At the bottom** of the file.

```js
// STEP 4: NEW — handle form submit
document.getElementById("club-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  // STEP 5 does validation; STEP 6 adds duplicate check
  // For now, just log:
  console.log("SUBMIT", { name, capacity });
});
```

---

## Step 5 — Validate inputs (JS)
**File:** `app.js`  
**Where:** **Inside** the submit handler, **after** `name` and `capacity`.

```js
// STEP 5: NEW — basic validation
if (name === "" || isNaN(capacity) || capacity <= 0) {
  errorMessage.textContent = "Please enter a valid club name and capacity (min 1).";
  return;
}
errorMessage.textContent = ""; // clear old errors
```

---

## Step 6 — Prevent duplicate names (JS)
**File:** `app.js`  
**Where:** **Below** the validation block in the submit handler.

```js
// STEP 6: NEW — duplicate check (case-insensitive)
const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
if (exists) {
  errorMessage.textContent = "A club with this name already exists.";
  return;
}
```

---

## Step 7 — Add an `addClub` helper and use it (JS)
**File:** `app.js`  
**Where:** **Above** the submit handler, create the helper. Then **call** it inside the handler.

```js
// STEP 7: NEW — add helper
function addClub(name, capacity) {
  clubs.push({ name, current: 0, capacity });
  renderClubs();
}
```

**Inside the submit handler (after Step 6):**
```js
// Add and reset form
addClub(name, capacity);
nameInput.value = "";
capacityInput.value = "";
nameInput.focus();
```

---

## Step 8 — (Optional) Friendly stats
**File:** `app.js`  
**Where:** Near `renderClubs()`, add helpers and change the card message.

```js
// Optional helpers
function seatsLeft(club) { return club.capacity - club.current; }
function percentFull(club) {
  if (club.capacity <= 0) return 0;
  return Math.round((club.current / club.capacity) * 100);
}

// Inside renderClubs(), change the line that sets card.textContent to:
card.textContent =
  `${club.name}: ${club.current}/${club.capacity} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
```

---

## Final `app.js` (Class 3)
If anyone falls behind, this is the complete file you can paste:

```js
let clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club",    current: 8,  capacity: 15 },
];

function seatsLeft(club) { return club.capacity - club.current; }
function percentFull(club) {
  if (club.capacity <= 0) return 0;
  return Math.round((club.current / club.capacity) * 100);
}

function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  if (clubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs yet. Add one above to get started.";
    container.appendChild(p);
    return;
  }

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    card.textContent =
      `${club.name}: ${club.current}/${club.capacity} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
    container.appendChild(card);
  });
}

// Add-new helper
function addClub(name, capacity) {
  clubs.push({ name, current: 0, capacity });
  renderClubs();
}

// Submit handler
document.getElementById("club-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent = "Please enter a valid club name and capacity (min 1).";
    return;
  }

  const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    errorMessage.textContent = "A club with this name already exists.";
    return;
  }

  errorMessage.textContent = "";
  addClub(name, capacity);

  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

document.getElementById("year").textContent = new Date().getFullYear();
renderClubs();
```

---

## Troubleshooting
- **Nothing happens on submit:** open DevTools → Console → any errors? Make sure your `<script src="app.js"></script>` is at the **end of `<body>`** so elements exist.
- **`NaN` showing up:** check `parseInt(value, 10)` and that the input isn’t empty.
- **Duplicate still added:** confirm you used `.toLowerCase()` on both sides in the check.
- **Cards not updating:** make sure you call `renderClubs()` after changing the array.

Good luck! This completes Class 3 and sets you up for Class 4 (OOP classes).
