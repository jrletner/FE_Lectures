# Class 2 Upgrade Walkthrough — Step by Step
**From:** Class 1 (setup only)  
**To:** Class 2 (variables + numbers + strings → static club list)

This guide shows exactly how to evolve last week’s setup into a working Class 2 build.

> Teaching cadence: after each step, refresh the page and verify the outcome.

---

## Step 0 — Confirm your Class 1 baseline
You should have a very simple project:
- `index.html` with a heading and an empty container like `<section id="club-info"></section>`
- `styles.css` with a few basic styles (font, margins)
- `app.js` that is either empty or only has a `console.log`

If you do **not** have that, use the `index.html`/`styles.css` from this folder and start fresh.

---

## Step 1 — Add seed data (arrays/objects)
**File:** `app.js`  
**Where:** Top of file.

```js
// STEP 1: NEW — seed data
const clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club",    current: 8,  capacity: 15 },
];
```

**Why:** students meet arrays/objects and see how data is shaped for the UI.

---

## Step 2 — Do the math (numbers)
**File:** `app.js`  
**Where:** Below Step 1.

```js
// STEP 2: NEW — basic math helpers
function seatsLeft(club) {
  return club.capacity - club.current;
}
function percentFull(club) {
  if (club.capacity <= 0) return 0;
  const ratio = club.current / club.capacity;
  return Math.round(ratio * 100);
}
```

**Why:** subtraction, division, rounding; named functions keep logic readable.

---

## Step 3 — Render to the page (strings + DOM)
**File:** `app.js`  
**Where:** Below Step 2.

```js
// STEP 3: NEW — render function
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = ""; // clear

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";

    const message = \`\${club.name}: \${club.current}/\${club.capacity} seats filled (\${seatsLeft(club)} left, \${percentFull(club)}% full)\`;

    card.textContent = message;
    container.appendChild(card);
  });
}

// Initial paint
renderClubs();
```

**Why:** template literals make string building easy and readable.

---

## Step 4 — Minimal visual style (CSS)
**File:** `styles.css`  
**Where:** Append to the end.

```css
/* STEP 4: NEW — simple card layout */
.cards { display: grid; gap: 10px; }
.club-card { border: 1px solid #ccc; background: #fff; padding: 10px; border-radius: 6px; }
```

**Why:** helps students see distinct items without heavy CSS.

---

## Step 5 — (Optional) Console checks
Add this temporarily to `app.js` to practice numbers & strings:

```js
console.log(`We have ${clubs.length} clubs on campus.`);
console.log(`First club is ${clubs[0].name} with ${seatsLeft(clubs[0])} seats left.`);
```

Then remove once verified to keep code clean.

---

## Final `app.js` (Class 2)
If anyone falls behind, here’s the complete file you can paste:

```js
// Class 2 — Variables, Numbers, Strings
const clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club",    current: 8,  capacity: 15 },
];

function seatsLeft(club) { return club.capacity - club.current; }
function percentFull(club) {
  if (club.capacity <= 0) return 0;
  const ratio = club.current / club.capacity;
  return Math.round(ratio * 100);
}

function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";
  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    const message = \`\${club.name}: \${club.current}/\${club.capacity} seats filled (\${seatsLeft(club)} left, \${percentFull(club)}% full)\`;
    card.textContent = message;
    container.appendChild(card);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderClubs();
```

---

## Troubleshooting
- **Nothing shows up:** Ensure your `<script src="app.js"></script>` is at the **end of `<body>`**.
- **Weird numbers (NaN):** Check that `current` and `capacity` are numbers and not strings.
- **Styling looks off:** Confirm you linked `styles.css` in `<head>`.

That’s it for Class 2! Next class you’ll add the **Create Club** form with validation.
