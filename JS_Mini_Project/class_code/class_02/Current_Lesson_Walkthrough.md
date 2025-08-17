# Class 2 — Seed, Helpers, Render (Delta from Class 1)

## At a glance (optional)

- What you’ll build: Seed two clubs, add tiny math helpers, and render readable cards.
- Files touched: index.html, styles.css, app.js
- Est. time: 30–45 min
- Prereqs: Finished Class 1

## How to run

- Serve over http:// so ES module imports work. Use the VS Code Live Server extension (Right-click `index.html` → "Open with Live Server").

## How to use

- Live-code friendly. Paste tiny snippets in order. Verify the ✅ Check after each step.
- Keep the browser open next to the editor; saves should auto-refresh with Live Server.

## Before you start

- Open: JS_Mini_Project/class_code/class_02
- Baseline: Review Class 1 repo files vs. Class 2 files to know the exact diffs you’ll author.
- Files to diff: index.html, styles.css, app.js
- Pre-flight: Confirm you’re on Class 2 files; open all three.
- Reset plan: If drift occurs, restore the Appendix code and resume from the last checkpoint.

## What changed since last class

```diff
# index.html
- <title>Campus Club Manager — Class 1</title>
+ <title>Campus Club Manager — Class 2</title>
```

```diff
# styles.css
 .cards { display: grid; gap: 10px; }
+.club-card {
+  border: 1px solid #ccc;
+  background: #fff;
+  padding: 10px;
+  border-radius: 6px;
+}
```

```diff
# app.js
- // Class 1 — Kickoff & Setup
- console.log("Class 1 setup complete. Ready for Class 2!");
+ // Class 2 — Variables, Numbers, Strings
+ const clubs = [
+   { name: "Coding Club", current: 12, capacity: 25 },
+   { name: "Art Club", current: 8, capacity: 15 },
+ ];
+ function seatsLeft(club) { return club.capacity - club.current; }
+ function percentFull(club) {
+   if (club.capacity <= 0) return 0;
+   const ratio = club.current / club.capacity;
+   return Math.round(ratio * 100);
+ }
+ function renderClubs() { /* build and append .club-card elements */ }
+ renderClubs();
```

## Live-coding steps

### 1. index.html — update the title (Class 2)

> 📍 Where: class_02/index.html → inside <head>
>
> ℹ️ What: Update the tab title so it reflects today’s class.
>
> 💡 Why: Keeps students oriented during demos and recordings.
>
> ✅ Check (visual): Browser tab reads “Campus Club Manager — Class 2”.

```html
<title>Campus Club Manager — Class 2</title>
```

### 2. styles.css — add a simple card style

> 📍 Where: class_02/styles.css → below the existing .cards rule or at end of file
>
> ℹ️ What: A white “card” with a border, padding, and rounded corners.
>
> 💡 Why: Improves readability and separation between items.
>
> ✅ Check: No visible change yet (cards appear after we render in app.js).

```css
.club-card {
  border: 1px solid #ccc;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
}
```

### 3. app.js — seed, helpers, render, paint (tiny, safe steps)

#### 3.1 Seed two example clubs

> 📍 Where: class_02/app.js → at the top
>
> ℹ️ What: An array of two club objects with name/current/capacity.
>
> 💡 Why: Real-looking data lets us do math and show results immediately.
>
> ✅ Check (console): Type `clubs` → see an array with two objects.

```js
const clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club", current: 8, capacity: 15 },
];
```

#### 3.2 Helper: seats left (subtraction)

> 📍 Where: Below the seed array
>
> ℹ️ What: Returns capacity minus current.
>
> 💡 Why: Keeps render code simple and consistent.
>
> ✅ Check (console): `seatsLeft(clubs[0])` → 13

```js
function seatsLeft(club) {
  return club.capacity - club.current;
}
```

#### 3.3 Helper: percent full (division + round)

> 📍 Where: Below seatsLeft(...)
>
> ℹ️ What: Math helper that turns a ratio into a whole-number percent.
>
> 💡 Why: Clean UI (no long decimals) and easy to reuse.
>
> ✅ Check (console): `percentFull(clubs[0])` → 48

```js
function percentFull(club) {
  if (club.capacity <= 0) return 0;
  const ratio = club.current / club.capacity;
  return Math.round(ratio * 100);
}
```

> Checkpoint 1
>
> - Run: Reload the page (no UI yet)
> - Expect: Console checks pass for both helpers
> - Console: `console.log('Checkpoint 1', percentFull(clubs[0])) // 48`

#### 3.4 Start the renderer (clear the container)

> 📍 Where: Below the helpers
>
> ℹ️ What: Prepare `#club-info` for a fresh render by clearing previous content.
>
> 💡 Why: Prevents duplicate items if we render more than once.
>
> ✅ Check: No visible change yet; no errors.

```js
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = ""; // clear previous content
}
```

#### 3.5 Loop clubs and create a card per item

> 📍 Where: Replace renderClubs with this version
>
> ℹ️ What: Build one .club-card per club object.
>
> 💡 Why: Core render-from-state pattern: loop → element → configure → append.
>
> ✅ Check: Still nothing visible until we set text and call render.

```js
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    // text next
    container.appendChild(card);
  });
}
```

#### 3.6 Build a readable message (template literal)

> 📍 Where: Inside the forEach, after card.className
>
> ℹ️ What: Construct a sentence with name, counts, seats left, and percent full.
>
> 💡 Why: Separate formatting from math (helpers) for clarity.
>
> ✅ Check (console): Temporarily `console.log(message)` shows a line per club.

```js
const message = `${club.name}: ${club.current}/${
  club.capacity
} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
```

#### 3.7 Put the text on the card

> 📍 Where: Next line after `const message = ...`
>
> ℹ️ What: Attach the message to the card element.
>
> 💡 Why: textContent is safe and simple for plain text.
>
> ✅ Check: After initial paint, cards display the message.

```js
card.textContent = message;
```

#### 3.8 Initial paint

> 📍 Where: Bottom of app.js (not inside a function)
>
> ℹ️ What: Call the renderer once so we see the seed data.
>
> 💡 Why: Without this, nothing appears.
>
> ✅ Check (triad):
>
> - Visual: Two cards (“Coding Club…”, “Art Club…”) appear.
> - Console: No errors.
> - DOM: `document.querySelectorAll('.club-card').length` → 2

```js
renderClubs();
```

## Troubleshooting

- Nothing renders: Ensure `renderClubs()` is called and `#club-info` exists in index.html.
- “null” errors: Double-check the ID matches exactly in HTML and JS (`club-info`).
- Weird percentages: Use `Math.round(ratio * 100)` (not `Math.round(ratio) * 100`).
- Duplicate cards: Confirm `container.innerHTML = "";` runs before the loop.
- `clubs` undefined: Keep the `const clubs = [...]` at top-level (not inside a function).
- Reset to baseline: Restore Appendix code for all three files and re-apply steps to the last checkpoint.

## Appendix — Full Source After This Class

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 2</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Track club capacity and members</p>
    </header>

    <main>
      <!-- Club Cards render here -->
      <section id="club-info" class="cards"></section>
    </main>

    <script src="app.js"></script>
  </body>
</html>
```

### styles.css

```css
/* Simple, beginner-friendly styles for Class 2 */

* {
  box-sizing: border-box;
}
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
  color: #333;
}

header h1 {
  margin: 0;
}
header p {
  margin: 4px 0 16px;
  color: #555;
}

main {
  max-width: 800px;
  margin: 0 auto;
}

.cards {
  display: grid;
  gap: 10px;
}
.club-card {
  border: 1px solid #ccc;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
}

footer {
  margin-top: 20px;
  color: #666;
}
```

### app.js

```javascript
// Class 2 — Variables, Numbers, Strings
// Goal: seed a couple of clubs, do simple math, and render to the page.

// 1) Seed data (arrays/objects)
const clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club", current: 8, capacity: 15 },
];

// 2) Helpers (numbers & math)
function seatsLeft(club) {
  return club.capacity - club.current; // subtraction
}

function percentFull(club) {
  if (club.capacity <= 0) return 0;
  const ratio = club.current / club.capacity; // division
  return Math.round(ratio * 100); // multiply + round
}

// 3) Render to the DOM (strings + template literals)
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = ""; // clear any previous content

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";

    // Build a message with template literals and string interpolation
    const message = `${club.name}: ${club.current}/${
      club.capacity
    } seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;

    card.textContent = message;
    container.appendChild(card);
  });
}

// Initial paint
renderClubs();
```
