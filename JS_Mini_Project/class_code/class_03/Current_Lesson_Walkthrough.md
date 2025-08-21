# Class 3 — Create Club Form, Validation, Empty State, Footer Year

## At a glance (optional)

- What you’ll build: A Create Club form with validation and duplicate checks, an empty state, and a live footer year.
- Files touched: index.html, styles.css, app.js
- Est. time: 45–60 min
- Prereqs: Finished Class 2

## How to run

- Use the VS Code Live Server extension (Right-click `index.html` → "Open with Live Server"). Avoid opening via `file://` to ensure scripts and assets load consistently.

## How to use

- Live-code friendly. Paste small snippets in order and verify the ✅ Check after each step.
- Keep the browser and console open side-by-side; use triad checks: Visual (UI), Console (one line), DOM query.

## Before you start

- Open: `JS_Mini_Project/class_code/class_03`
- Baseline: Review Class 2 repo files vs. Class 3 repo files to ensure exact diffs.
- Files to diff: `index.html`, `styles.css`, `app.js`
- Pre-flight: Confirm you’re editing Class 3 files and all three are open.
- Reset plan: If drift occurs, restore the Appendix code and resume from the last checkpoint.

## What changed since last class

<details>
  <summary>Diff — index.html: title, form, footer</summary>

```diff
# index.html
- <title>Campus Club Manager — Class 2</title>
+ <title>Campus Club Manager — Class 3</title>
+
+ <!-- Create Club Form (new in Class 3) -->
+ <form id="club-form" class="form">
+   <div class="form-row">
+     <label for="club-name">Club Name</label>
+     <input type="text" id="club-name" placeholder="e.g., Chess Club" />
+   </div>
+   <div class="form-row">
+     <label for="club-capacity">Max Capacity</label>
+     <input type="number" id="club-capacity" placeholder="e.g., 20" min="1" />
+   </div>
+   <button type="submit" class="btn">Add Club</button>
+   <p id="error-message" class="error" role="alert" aria-live="polite"></p>
+ </form>
+
+ <!-- Footer with live year (new) -->
+ <footer>
+   <small>&copy; <span id="year"></span> Campus Club Manager</small>
+ </footer>
```

 </details>

<details>
  <summary>Diff — styles.css: form/button/error styles</summary>

```diff
# styles.css
+ .form {
+   background: #fff;
+   border: 1px solid #ddd;
+   padding: 12px;
+   margin-bottom: 16px;
+   border-radius: 6px;
+ }
+ .form-row { display: flex; gap: 10px; align-items: center; margin-bottom: 8px; }
+ .form-row label { width: 120px; }
+ .form-row input {
+   flex: 1;
+   padding: 6px 8px;
+   border: 1px solid #ccc;
+   border-radius: 4px;
+ }
+ .btn {
+   padding: 8px 12px;
+   border: 1px solid #999;
+   background: #fafafa;
+   cursor: pointer;
+   border-radius: 4px;
+ }
+ .btn:hover { background: #f0f0f0; }
+ .btn:focus { outline: 2px solid #4a90e2; outline-offset: 2px; }
+ .error { color: #c00; margin-top: 8px; }
```

 </details>

<details>
  <summary>Diff — app.js: mutable state, empty state, addClub, listener, footer year</summary>

```diff
# app.js
- // Class 2 — Variables, Numbers, Strings
- const clubs = [ /* seeds */ ];
+ // Class 3 — Booleans, Ifs, Functions (Create Club)
+ let clubs = [ /* seeds (same as Class 2) */ ];
  function seatsLeft(c) { /* same */ }
  function percentFull(c) { /* same */ }
- function renderClubs() { /* render cards */ }
+ function renderClubs() {
+   // clear...
+   // Empty state when no clubs
+   if (clubs.length === 0) { /* show message and return */ }
+   // render cards
+ }
+ function addClub(name, capacity) { clubs.push({ name, current: 0, capacity }); renderClubs(); }
+ document.getElementById('club-form').addEventListener('submit', /* validate + add */);
+ document.getElementById('year').textContent = new Date().getFullYear();
```

 </details>

## File tree (current class)

<details open>
  <summary>File tree — class_03</summary>

```text
class_03/
  index.html
  styles.css
  app.js
```

</details>

## Live-coding steps

### 1) index.html — update title and add the form

> 📍 Where: `class_03/index.html` → inside `<head>` for the title; inside `<main>` above `#club-info` for the form (Cmd+F "club-info").
>
> ℹ️ What: Update the tab title and add a form to collect name and capacity with an inline error line.
>
> 💡 Why: Title orients the class; the form lets us create new clubs with good UX.
>
> ✅ Check: Form appears with two inputs and an Add button; tab shows “Class 3”.

<details open>
  <summary>Diff — index.html: update title</summary>

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
-   <title>Campus Club Manager — Class 2</title>
+   <title>Campus Club Manager — Class 3</title>
    <link rel="stylesheet" href="styles.css" />
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — index.html: title</summary>

```html
<title>Campus Club Manager — Class 3</title>
```

</details>

<details open>
  <summary>Diff — index.html: add form above list</summary>

```diff
  <main>
-   <!-- Club Cards render here -->
-   <section id="club-info" class="cards"></section>
+   <!-- Create Club Form (new in Class 3) -->
+   <form id="club-form" class="form">
+     <div class="form-row">
+       <label for="club-name">Club Name</label>
+       <input type="text" id="club-name" placeholder="e.g., Chess Club" />
+     </div>
+     <div class="form-row">
+       <label for="club-capacity">Max Capacity</label>
+       <input type="number" id="club-capacity" placeholder="e.g., 20" min="1" />
+     </div>
+     <button type="submit" class="btn">Add Club</button>
+     <p id="error-message" class="error" role="alert" aria-live="polite"></p>
+   </form>
+
+   <!-- Club Cards render here -->
+   <section id="club-info" class="cards"></section>
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — index.html: form</summary>

```html
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

<!-- Club Cards render here -->
<section id="club-info" class="cards"></section>
```

</details>

### 2) index.html — keep list container and add footer

> 📍 Where: `index.html` → add `<footer>` just above `</body>`.
>
> ℹ️ What: Preserve the render target and add a footer with a year span.
>
> 💡 Why: Our renderer updates `#club-info`; `#year` shows the current year automatically.
>
> ✅ Check: You still see the list section; a small footer appears at the bottom (year will fill in later).

<details open>
  <summary>Diff — index.html: add footer</summary>

```diff
  </main>
+ <footer>
+   <small>&copy; <span id="year"></span> Campus Club Manager</small>
+ </footer>
  <script src="app.js"></script>
</body>
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — index.html: footer</summary>

```html
<footer>
  <small>&copy; <span id="year"></span> Campus Club Manager</small>
</footer>
```

</details>

### 3) styles.css — form, row, button, and error styles

> 📍 Where: `class_03/styles.css` → append at end of file.
>
> ℹ️ What: Add styles for the form, rows, controls, button, and error.
>
> 💡 Why: Improves grouping, layout, affordance, and accessibility.
>
> ✅ Check: The form area becomes a white card; labels align; hover/focus visible; errors red.

<details open>
  <summary>Diff — styles.css: append form/button/error styles</summary>

```diff
/* Simple, beginner-friendly styles */
...existing code...
+ .form {
+   background: #fff;
+   border: 1px solid #ddd;
+   padding: 12px;
+   margin-bottom: 16px;
+   border-radius: 6px;
+ }
+ .form-row { display: flex; gap: 10px; align-items: center; margin-bottom: 8px; }
+ .form-row label { width: 120px; }
+ .form-row input {
+   flex: 1;
+   padding: 6px 8px;
+   border: 1px solid #ccc;
+   border-radius: 4px;
+ }
+ .btn {
+   padding: 8px 12px;
+   border: 1px solid #999;
+   background: #fafafa;
+   cursor: pointer;
+   border-radius: 4px;
+ }
+ .btn:hover { background: #f0f0f0; }
+ .btn:focus { outline: 2px solid #4a90e2; outline-offset: 2px; }
+ .error { color: #c00; margin-top: 8px; }
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — styles.css: form/button/error</summary>

```css
.form {
  background: #fff;
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 6px;
}
.form-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}
.form-row label {
  width: 120px;
}
.form-row input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  padding: 8px 12px;
  border: 1px solid #999;
  background: #fafafa;
  cursor: pointer;
  border-radius: 4px;
}
.btn:hover {
  background: #f0f0f0;
}
.btn:focus {
  outline: 2px solid #4a90e2;
  outline-offset: 2px;
}
.error {
  color: #c00;
  margin-top: 8px;
}
```

</details>

<br><br>

> Checkpoint 1
>
> - Run: Reload the page.
> - Expect: Form appears styled; no console errors.
> - Console: `console.log('Checkpoint 1', !!document.getElementById('club-form'))` → true

### 4) app.js — make state mutable and add empty state

> 📍 Where: `class_03/app.js` → top of file (state), and inside `renderClubs()` after `container.innerHTML = ""`.
>
> ℹ️ What: Change `const clubs` to `let clubs`; add an early-return empty state message.
>
> 💡 Why: We’ll push new clubs; empty state improves UX when the list is empty.
>
> ✅ Check: Temporarily set `clubs = []` and refresh → see empty-state message; revert seeds afterwards.

<details open>
  <summary>Diff — app.js: const→let clubs</summary>

```diff
- const clubs = [
+ let clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club", current: 8, capacity: 15 },
];
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — app.js: let clubs seed</summary>

```js
let clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club", current: 8, capacity: 15 },
];
```

</details>

<details open>
  <summary>Diff — app.js: empty state inside renderClubs()</summary>

```diff
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";
+  if (clubs.length === 0) {
+    const p = document.createElement("p");
+    p.textContent = "No clubs yet. Add one above to get started.";
+    container.appendChild(p);
+    return;
+  }
  clubs.forEach((club) => {
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — app.js: empty state block</summary>

```js
if (clubs.length === 0) {
  const p = document.createElement("p");
  p.textContent = "No clubs yet. Add one above to get started.";
  container.appendChild(p);
  return;
}
```

</details>

### 5) app.js — helper to add a club and repaint

> 📍 Where: Below `renderClubs()` (top-level).
>
> ℹ️ What: Push a new club and re-render.
>
> 💡 Why: Centralizes the update + repaint pattern.
>
> ✅ Check: In Console, run `addClub('Test', 10)` → a card appears with 0/10.

<details open>
  <summary>Diff — app.js: addClub helper</summary>

```diff
+ function addClub(name, capacity) {
+   clubs.push({ name, current: 0, capacity });
+   renderClubs();
+ }
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — app.js: addClub()</summary>

```js
function addClub(name, capacity) {
  clubs.push({ name, current: 0, capacity });
  renderClubs();
}
```

</details>

### 6) app.js — submit handler in small steps

#### 6.1 Listener skeleton

> 📍 Where: Near the bottom of `app.js`.
>
> ℹ️ What: Prevent default reload and capture submit.
>
> 💡 Why: We want to validate and update without leaving the page.
>
> ✅ Check: Add a temporary `console.log('submitted')`; submit → no reload, logs once.

<details open>
  <summary>Diff — app.js: submit handler skeleton</summary>

```diff
+ document.getElementById('club-form').addEventListener('submit', function (e) {
+   e.preventDefault();
+   // console.log('submitted');
+ });
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — app.js: submit handler skeleton</summary>

```js
document.getElementById("club-form").addEventListener("submit", function (e) {
  e.preventDefault();
  // console.log('submitted');
});
```

</details>

#### 6.2 Grab inputs and parse values

> 📍 Where: Inside the submit handler, after `e.preventDefault()`.
>
> ℹ️ What: Cache elements and convert capacity to a number.
>
> 💡 Why: Avoid repeated lookups; ensure numeric comparisons are correct.
>
> ✅ Check: Temporarily `console.log(name, capacity)` and submit a test.

<details open>
  <summary>Diff — app.js: get inputs and parse</summary>

```diff
  document.getElementById('club-form').addEventListener('submit', function (e) {
    e.preventDefault();
+   const nameInput = document.getElementById('club-name');
+   const capacityInput = document.getElementById('club-capacity');
+   const errorMessage = document.getElementById('error-message');
+
+   const name = nameInput.value.trim();
+   const capacity = parseInt(capacityInput.value, 10);
  });
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — app.js: cache + parse</summary>

```js
const nameInput = document.getElementById("club-name");
const capacityInput = document.getElementById("club-capacity");
const errorMessage = document.getElementById("error-message");

const name = nameInput.value.trim();
const capacity = parseInt(capacityInput.value, 10);
```

</details>

#### 6.3 Basic validation guard

> 📍 Where: Still inside the submit handler (after parsing values).
>
> ℹ️ What: Early-return for empty/invalid input.
>
> 💡 Why: Keeps the happy path clean.
>
> ✅ Check: Empty name or 0 capacity shows the error line.

<details open>
  <summary>Diff — app.js: basic validation guard</summary>

```diff
    const name = nameInput.value.trim();
    const capacity = parseInt(capacityInput.value, 10);
+   if (name === '' || isNaN(capacity) || capacity <= 0) {
+     errorMessage.textContent = 'Please enter a valid club name and capacity (min 1).';
+     return;
+   }
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — app.js: validation block</summary>

```js
if (name === "" || isNaN(capacity) || capacity <= 0) {
  errorMessage.textContent =
    "Please enter a valid club name and capacity (min 1).";
  return;
}
```

</details>

#### 6.4 Duplicate name check (case-insensitive)

> 📍 Where: After the basic validation block.
>
> ℹ️ What: Block adding a club with a name that already exists.
>
> 💡 Why: Prevents confusion and data issues.
>
> ✅ Check: Try adding “art club” when “Art Club” exists → shows duplicate error.

<details open>
  <summary>Diff — app.js: duplicate name check</summary>

```diff
    if (name === '' || isNaN(capacity) || capacity <= 0) {
      errorMessage.textContent = 'Please enter a valid club name and capacity (min 1).';
      return;
    }
+   const exists = clubs.some((c) => c.name.toLowerCase() === name.toLowerCase());
+   if (exists) {
+     errorMessage.textContent = 'A club with this name already exists.';
+     return;
+   }
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — app.js: duplicate check</summary>

```js
const exists = clubs.some((c) => c.name.toLowerCase() === name.toLowerCase());
if (exists) {
  errorMessage.textContent = "A club with this name already exists.";
  return;
}
```

</details>

#### 6.5 Commit, reset, and focus

> 📍 Where: After the duplicate check.
>
> ℹ️ What: Add the club, clear errors, reset inputs, and focus name.
>
> 💡 Why: Smooth, demo-friendly workflow.
>
> ✅ Check: Valid submit adds a card and clears inputs; focus returns to name.

<details open>
  <summary>Diff — app.js: commit, reset, focus</summary>

```diff
    if (exists) {
      errorMessage.textContent = 'A club with this name already exists.';
      return;
    }
+   errorMessage.textContent = '';
+   addClub(name, capacity);
+   nameInput.value = '';
+   capacityInput.value = '';
+   nameInput.focus();
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — app.js: commit/reset/focus</summary>

```js
errorMessage.textContent = "";
addClub(name, capacity);
nameInput.value = "";
capacityInput.value = "";
nameInput.focus();
```

</details>

<br><br>

> Checkpoint 2
>
> - Visual: Add a valid club via the form; a new card appears.
> - Console: `clubs.at(-1).name` matches your input.
> - DOM: `document.querySelectorAll('.club-card').length` increases by 1.

### 7) app.js — footer year

> 📍 Where: Bottom of `app.js`, outside any function.
>
> ℹ️ What: Set the year text.
>
> 💡 Why: Eliminates yearly maintenance.
>
> ✅ Check: Footer shows the current year (e.g., 2025).

<details open>
  <summary>Diff — app.js: footer year line</summary>

```diff
+ document.getElementById('year').textContent = new Date().getFullYear();
```

</details>

Clean copy/paste snippet:

<details>
  <summary>Clean copy/paste — app.js: footer year</summary>

```js
document.getElementById("year").textContent = new Date().getFullYear();
```

</details>

## Troubleshooting

- Submit reloads the page: Ensure `e.preventDefault()` is inside the submit handler.
- `null` errors: Verify IDs in HTML/JS match exactly (`club-form`, `club-name`, `club-capacity`, `error-message`, `club-info`, `year`).
- Validation not showing: Ensure you set `errorMessage.textContent` and return early.
- Duplicate not blocked: Compare lowercase strings and trim input.
- Nothing renders: Confirm `renderClubs()` is called and `#club-info` exists.
- Year blank: Ensure `<span id="year"></span>` exists and the setter line runs after the DOM (script is at end of `body`).

## Appendix — Full Source After This Class

### index.html

<details>
  <summary>Full source — index.html</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 3</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Track club capacity and members</p>
    </header>

    <main>
      <!-- Create Club Form -->
      <form id="club-form" class="form">
        <div class="form-row">
          <label for="club-name">Club Name</label>
          <input type="text" id="club-name" placeholder="e.g., Chess Club" />
        </div>
        <div class="form-row">
          <label for="club-capacity">Max Capacity</label>
          <input
            type="number"
            id="club-capacity"
            placeholder="e.g., 20"
            min="1"
          />
        </div>
        <button type="submit" class="btn">Add Club</button>
        <p id="error-message" class="error" role="alert" aria-live="polite"></p>
      </form>

      <!-- Club Cards render here -->
      <section id="club-info" class="cards"></section>
    </main>

    <footer>
      <small>&copy; <span id="year"></span> Campus Club Manager</small>
    </footer>

    <script src="app.js"></script>
  </body>
</html>
```

</details>

### styles.css

<details>
  <summary>Full source — styles.css</summary>

```css
/* Simple, beginner-friendly styles */

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

.form {
  background: #fff;
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 6px;
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}
.form-row label {
  width: 120px;
}
.form-row input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 8px 12px;
  border: 1px solid #999;
  background: #fafafa;
  cursor: pointer;
  border-radius: 4px;
}
.btn:hover {
  background: #f0f0f0;
}
.btn:focus {
  outline: 2px solid #4a90e2;
  outline-offset: 2px;
}

.error {
  color: #c00;
  margin-top: 8px;
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

</details>

### app.js

<details>
  <summary>Full source — app.js</summary>

```javascript
// Class 3 — Booleans, Ifs, Functions (Create Club)
// Completed project file

// Seed data from previous class
let clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club", current: 8, capacity: 15 },
];

// Utility: compute seats left
function seatsLeft(club) {
  return club.capacity - club.current;
}

// Utility: compute percent full (rounded)
function percentFull(club) {
  if (club.capacity <= 0) return 0;
  return Math.round((club.current / club.capacity) * 100);
}

// Render all clubs
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = ""; // clear

  // Empty state
  if (clubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs yet. Add one above to get started.";
    container.appendChild(p);
    return;
  }

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";

    const msg = `${club.name}: ${club.current}/${
      club.capacity
    } seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
    card.textContent = msg;
    container.appendChild(card);
  });
}

// Add a new club and re-render
function addClub(name, capacity) {
  clubs.push({ name, current: 0, capacity });
  renderClubs();
}

// Handle Create Club form submit
document.getElementById("club-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  // Basic validation
  if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent =
      "Please enter a valid club name and capacity (min 1).";
    return;
  }

  // Duplicate check (case-insensitive)
  const exists = clubs.some((c) => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    errorMessage.textContent = "A club with this name already exists.";
    return;
  }

  // Clear error and add
  errorMessage.textContent = "";
  addClub(name, capacity);

  // Reset form and focus name for faster entry
  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial paint
renderClubs();
```

</details>
