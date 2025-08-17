# Class 2 — Delta Walkthrough (from Class 1)

Seed data, add tiny number helpers, and render a list. This shows only what changed from Class 1; anything not shown remains the same.

## How to use this guide

- We’ll touch three files: `index.html`, `styles.css`, and `app.js`.
- Each step shows:
  - 📍 Where to paste or edit
  - ℹ️ What you’re doing and 💡 Why it helps
  - ✅ A quick check so you know it worked
- Code blocks are small and copy-pasteable for live-coding.

## Before you start

1. Open the Class 2 folder in VS Code: `JS_Mini_Project/class_code/class_02`.
2. Open `index.html`, `styles.css`, and `app.js` side-by-side.
3. Use Live Server (or open `index.html` in your browser). Keep the page visible while coding.

---

## index.html — update the title to Class 2

Replace the `<title>` so your browser tab reflects the current class.

```html
<title>Campus Club Manager — Class 2</title>
```

> 📍 Where
>
> File: `index.html` — in VS Code’s Explorer (left sidebar), click `index.html`. Near the top, find the `<head>` section and locate the existing `<title>...</title>`. Replace that entire line with the snippet above. If you don’t see `<head>`, you’re in the wrong file.
>
> Tip: Use Find (Cmd+F on macOS) and search for `<title>` to jump to it.

> ℹ️ What
>
> Update the page title (the text shown on the browser tab). This does not appear on the page body—only on the tab/window title.
>
> 💡 Why
>
> Helps students and recordings stay oriented to the correct class.

> ✅ Check
>
> 1. Save (Cmd+S). 2) Refresh the browser tab. 3) The tab should read “Campus Club Manager — Class 2”. If not, make sure you edited the Class 2 `index.html` (not Class 1) and that your browser is on the Class 2 file.

---

## styles.css — add a basic card style

Paste this block to style each club as a simple white card.

```css
.club-card {
  border: 1px solid #ccc;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
}
```

> 📍 Where
>
> File: `styles.css` — scroll until you see the `.cards { ... }` rule. Paste the `.club-card { ... }` block right below it. If you don’t have `.cards`, you can paste the card styles at the end of the file.
>
> Tip: Use Find (Cmd+F) for `.cards`.

> ℹ️ What
>
> Adds a white box with padding and rounded corners so each club entry looks like a readable “card”.
>
> 💡 Why
>
> A little structure goes a long way for beginners’ visual scanning.

> ✅ Check
>
> You won’t see a change yet until we render items in `app.js`. Later, the clubs will appear in white cards with rounded corners.

---

## app.js — seed data, helpers, render, paint

We’ll build this in tiny steps.

### 1) Seed two example clubs

```js
const clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club", current: 8, capacity: 15 },
];
```

> 📍 Where
>
> File: `app.js` — open this file. Paste the array at the very top, below any comment lines. If you already have a `const clubs = [...]`, replace it with this two-item version for now.

> ℹ️ What
>
> Real data to work with: an array (`[...]`) holding two objects (`{...}`). Each object has three keys:
>
> - `name` (text)
> - `current` (how many people are in the club right now)
> - `capacity` (maximum number of people allowed)
>
> 💡 Why
>
> With real-looking data, we can do the math and draw something on the page immediately. Seeing results helps beginners stay oriented.

> ✅ Check
>
> Open DevTools (Cmd+Option+I on macOS) → Console tab → type `clubs` and press Enter. You should see an array of length 2 with objects for Coding Club and Art Club.

### 2) Helper: seats left (subtraction)

```js
function seatsLeft(club) {
  return club.capacity - club.current;
}
```

> 📍 Where
>
> File: `app.js` — paste this function directly below the `clubs` array.

> ℹ️ What
>
> A tiny math helper that takes one `club` object and returns a number (capacity minus current). Input: `{ name, current, capacity }` → Output: seats left (a number).
>
> 💡 Why
>
> Keeps display code simple. Instead of doing the subtraction everywhere, we do it in one named place—easier to read and fix later.

> ✅ Check
>
> In the Console: type `seatsLeft(clubs[0])` and press Enter. Expected: `25 - 12 = 13`. If you see an error, make sure you defined the function below the `clubs` array and saved the file.

### 3) Helper: percent full (division + round)

```js
function percentFull(club) {
  if (club.capacity <= 0) return 0;
  const ratio = club.current / club.capacity;
  return Math.round(ratio * 100);
}
```

> 📍 Where
>
> File: `app.js` — paste this function below `seatsLeft(...)`.

> ℹ️ What
>
> Converts a fraction to a whole-number percentage. If capacity is 0 or less, we return 0 to avoid division problems.
>
> 💡 Why
>
> Rounding removes messy decimals so the UI is clean and beginner-friendly.

> ✅ Check
>
> In the Console: type `percentFull(clubs[0])` and press Enter. With current=12, capacity=25 → `(12/25)*100 = 48`, so you should see `48`.

### 4) Render function in small steps

4.1 Start the function and clear the container:

```js
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = ""; // clear previous content
}
```

> 📍 Where
>
> File: `app.js` — create this function below both helper functions. Don’t put it inside another function.

> ℹ️ What
>
> Grabs the container on the page where cards will go (`#club-info`) and clears out any previous content every time we render.
>
> 💡 Why
>
> Prevents duplicate cards when we draw again later (clearing avoids the same items stacking up).

> ✅ Check
>
> No visible change yet (we haven’t added items). Optional: add `console.log('rendering')` inside the function to confirm it runs later.

4.2 Loop clubs and create a card per item:

```js
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    // we'll set text next
    container.appendChild(card);
  });
}
```

> 📍 Where
>
> File: `app.js` — replace your previous `renderClubs()` with this longer version that includes the loop. Keep the function name the same.

> ℹ️ What
>
> Loops through the `clubs` array and makes a new `<div>` for each club. We’re just appending the empty card for now; we’ll add text next.
>
> 💡 Why
>
> This is the core pattern of rendering from data: loop → create element → configure it → append to the page.

> ✅ Check
>
> Nothing visible yet until step 5. After we call `renderClubs()`, you’ll see two empty cards if you stop before adding text.

4.3 Build a readable message with template literals:

```js
const message = `${club.name}: ${club.current}/${
  club.capacity
} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
```

> 📍 Where
>
> File: `app.js` — inside the `clubs.forEach(...)` loop, immediately after `const card = document.createElement("div");` and setting `card.className`.

> ℹ️ What
>
> Build a readable sentence using template literals (backticks: ` \``) and  `${...}` placeholders to inject values and helper results.
>
> 💡 Why
>
> Keeps the math in helpers and the message in one place, which is easier to test and change later.

> ✅ Check
>
> Temporarily add `console.log(message)` under the `message` line, save, and refresh. You should see a line per club in the Console (e.g., `Coding Club: 12/25 seats filled (13 left, 48% full)`).

4.4 Put the text on the card:

```js
card.textContent = message;
```

> 📍 Where
>
> File: `app.js` — on the next line after `const message = ...` inside the loop.

> ℹ️ What
>
> Put the message on the card using `textContent` (safer than `innerHTML` because it doesn’t interpret HTML tags).
>
> 💡 Why
>
> Prevents accidental HTML injection and keeps our content purely text for now.

> ✅ Check
>
> After step 5, reload the page and you’ll see each card show its full message.

### 5) Initial paint

Call the function once at the bottom to render your seed data.

```js
renderClubs();
```

> 📍 Where
>
> File: `app.js` — scroll to the bottom and add this on its own line. Keep it outside of any function.

> ℹ️ What
>
> Trigger the first render.
>
> 💡 Why
>
> Without this, nothing appears yet.

> ✅ Check
>
> Save and refresh. You should see two cards: Coding Club and Art Club, with counts (current/capacity), seats left, and percent full. If you see nothing, confirm `index.html` includes `<script src="app.js"></script>`.

---

## Run and verify

- Open `index.html` with Live Server (VS Code extension): right-click `index.html` → “Open with Live Server”.
- Keep the browser and editor side-by-side; when you save, the browser auto-refreshes.
- You should see one card per club with correct seats left and percent full.

---

## Troubleshooting (quick fixes)

- If you see nothing, make sure `renderClubs()` is called at the bottom of `app.js` and that `index.html` includes `<script src="app.js"></script>` before `</body>`.
- If the console says an element is `null`, confirm the IDs in HTML and JS match exactly: `#club-info` in HTML and `document.getElementById("club-info")` in JS.
- If percents look odd, ensure you’re using `Math.round(ratio * 100)` (round after multiplying), not `Math.round(ratio) * 100`.
- If cards duplicate on refresh, make sure you clear with `container.innerHTML = "";` before the loop inside `renderClubs()`.
- If `clubs` is `undefined`, ensure the `const clubs = [...]` definition is at the top of `app.js` and not inside another function.

---

## Appendix — Full source code (Class 2)

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
