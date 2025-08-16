# Class 2 Walkthrough: Seed Data, Math Helpers, and First Render

In this lesson you’ll add real JavaScript to seed a couple of clubs, do simple math, render a list to the page, and set the footer year. This matches the current source code for Class 2.

Only new/changed files are shown below. Full code for each file is provided in the appendix.

---

## Goals

- Seed two example clubs as JavaScript objects in an array.
- Create number helpers (seats left, percent full).
- Render a message per club into the main page content.
- Update the footer year dynamically.

---

## 1) Change: `index.html` — include your script

Add the script tag right before `</body>` so the DOM is loaded before your script runs.

Snippet to add:

```html
<script src="app.js"></script>
```

Placement:

```html
	<!-- ...existing HTML... -->
	<script src="app.js"></script>
</body>
</html>
```

Note: If this line already exists, you’re good—no change needed.

---

## 2) New file: `app.js` — data, helpers, render

Create `app.js` in the same folder as `index.html` and paste the following code. This seeds data, defines helpers, renders to the `#club-info` section, and sets the footer year.

```js
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

// Footer year (tiny touch)
document.getElementById("year").textContent = new Date().getFullYear();

// Initial paint
renderClubs();
```

---

## 3) What you should see

- In the main section, two lines rendered (one per club), e.g.:
  - Coding Club: 12/25 seats filled (13 left, 48% full)
  - Art Club: 8/15 seats filled (7 left, 53% full)
- The footer year shows the current year.

---

## Appendix: Full code listings

### `index.html`

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

    <footer>
      <small>&copy; <span id="year"></span> Campus Club Manager</small>
    </footer>

    <script src="app.js"></script>
  </body>
</html>
```

### `app.js`

```js
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

// Footer year (tiny touch)
document.getElementById("year").textContent = new Date().getFullYear();

// Initial paint
renderClubs();
```
