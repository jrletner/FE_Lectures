# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Empty State + Footer Year</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div id="grocery-list"></div>
    <footer>
      <small>&copy; <span id="year"></span> Example App</small>
    </footer>
    <script src="app.js"></script>
  </body>
</html>
```

## styles.css

```css
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  padding: 1rem;
}
.empty {
  color: #777;
}
footer {
  margin-top: 1rem;
  color: #444;
}
```

## app.js

```js
let items = [];

function render() {
  const list = document.querySelector("#grocery-list");
  list.innerHTML = "";
  if (items.length === 0) {
    const row = document.createElement("div");
    row.className = "empty";
    row.textContent = "No items yet. Add your first item!";
    list.appendChild(row);
    return;
  }
  for (const name of items) {
    const row = document.createElement("div");
    row.textContent = name;
    list.appendChild(row);
  }
}

// footer year
document.querySelector("#year").textContent = new Date().getFullYear();

render();
```

## Why this works (short notes)

- Early-return empty state keeps the render simple and avoids extra conditionals for each row.
- Writing the year once keeps the footer up-to-date automatically each year.

## What good looks like (checks)

- Starting with an empty array shows only the empty-state line.
- Manually adding an item in code and calling `render()` replaces the empty state with rows.
- Footer displays the current year number.

---

## Stretch solution (optional)

Add subtle styling for the empty state and apply the class when rendering the empty-state line.

### styles.css (added)

```css
.empty {
  color: #777;
}
```

### app.js (changed)

```js
if (items.length === 0) {
  const row = document.createElement("div");
  row.className = "empty"; // apply stretch style
  row.textContent = "No items yet. Add your first item!";
  list.appendChild(row);
  return;
}
```
