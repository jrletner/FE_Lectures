# Class 3 Walkthrough: Arrays & Rendering Data

This guide will walk you through adding an array of club data and rendering it to the page using JavaScript.

---

## 1. Update `app.js`

Add the following code after your welcome message code in `app.js`:

```js
// Array to store club data
const clubs = [
  { name: "Chess Club", capacity: 10 },
  { name: "Art Club", capacity: 8 },
];

// Render the list of clubs to the page
function renderClubs() {
  // Make sure you have a container with id="club-info" in your HTML
  const container = document.getElementById("club-info");
  container.innerHTML = clubs
    .map((club) => `<div>${club.name} (${club.capacity})</div>`)
    .join("");
}
renderClubs();
```

> **Placement:** Place this code directly after your existing code that sets the welcome message in `app.js`.

---

## 2. What you should see

- The page should now display a list of clubs ("Chess Club (10)" and "Art Club (8)") below the header.
- The content is rendered by JavaScript into the `<section id="club-info"></section>` element.

You have now completed the steps for Class 3. In the next lesson, you'll add a form to create new clubs and handle user input!
