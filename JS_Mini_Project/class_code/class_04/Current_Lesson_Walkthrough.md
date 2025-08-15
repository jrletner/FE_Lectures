# Class 4 Walkthrough: Functions & Event Handling

This guide will walk you through adding a form to create new clubs and handling user input with JavaScript.

---

## 1. Update `index.html`

Add the following form above your club list container (above the element with `id="club-info"`):

```html
<!-- Add this above your club list container -->
<form id="club-form">
  <input id="club-name" type="text" placeholder="Club Name" />
  <input id="club-capacity" type="number" placeholder="Capacity" />
  <button type="submit">Add Club</button>
</form>
```

> **Placement:** Place this form just before `<section id="club-info"></section>` in your `index.html` file.

---

## 2. Update `app.js`

Add the following code below your `renderClubs` function in `app.js`:

```js
// Handle form submission to add a new club
// This will add a new club to the array and re-render the list

document.getElementById("club-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("club-name").value;
  const capacity = parseInt(document.getElementById("club-capacity").value, 10);
  clubs.push({ name, capacity });
  renderClubs();
});
```

> **Placement:** Place this code directly after your `renderClubs` function in `app.js`.

---

## 3. What you should see

- You should see a form above the club list with fields for club name and capacity.
- When you fill out the form and click "Add Club", the new club appears in the list below.

You have now completed the steps for Class 4. In the next lesson, you'll refactor your code to use a `Club` class and add member management!
