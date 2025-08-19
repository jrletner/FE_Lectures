# Solution: Grocery list (add and render)

A minimal, beginner-friendly implementation that matches the prompt exactly.

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Grocery List — ex01</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main class="container">
      <h1>Grocery List</h1>

      <div class="controls">
        <input id="item-input" type="text" placeholder="Add an item" />
        <button id="add-btn">Add</button>
      </div>

      <div id="grocery-list" class="list"></div>
    </main>

    <script src="app.js"></script>
  </body>
</html>
```

## styles.css

```css
:root {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
body {
  margin: 0;
  padding: 2rem;
  background: #fafafa;
  color: #111;
}
.container {
  max-width: 480px;
  margin: 0 auto;
}
.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
#item-input {
  flex: 1;
  padding: 0.5rem 0.6rem;
}
#add-btn {
  padding: 0.5rem 0.8rem;
  cursor: pointer;
}
.list > div {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
```

## app.js

```js
// State
const items = [];

// Add only non-empty, trimmed names
function addItem(name) {
  const trimmed = name.trim();
  if (!trimmed) return false; // ignore blanks
  items.push(trimmed);
  return true;
}

// Render the list as <div> rows
function render() {
  const container = document.getElementById("grocery-list");
  container.textContent = "";
  for (const item of items) {
    const row = document.createElement("div");
    row.textContent = item;
    container.appendChild(row);
  }
}

// Wire up button
document.getElementById("add-btn").addEventListener("click", () => {
  const input = document.getElementById("item-input");
  const ok = addItem(input.value);
  input.value = "";
  input.focus();
  if (ok) render();
});
```

## Stretch solution (optional): prevent duplicates

Replace the body of `addItem` with a duplicate guard (case-insensitive):

```js
function addItem(name) {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const exists = items.some((i) => i.toLowerCase() === trimmed.toLowerCase());
  if (exists) return false;
  items.push(trimmed);
  return true;
}
```

## Try it

- Open `index.html` with Live Server.
- Type a name and click Add; a new row appears at the bottom.
- Console quick check: `addItem('Milk'); render();` should append a row.
