# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Grocery List — Validation</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <input id="item-input" placeholder="Add item" />
    <button id="add-btn">Add</button>
    <p id="error" class="error"></p>
    <div id="grocery-list"></div>
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
#add-btn {
  margin-left: 0.5rem;
}
.error {
  color: #c00;
  margin: 6px 0;
}
#grocery-list > div {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}
```

## app.js

```js
const items = [];

function addItem(name) {
  const n = (name || "").trim();
  if (!n) return { ok: false, message: "Name required" };
  const lower = n.toLowerCase();
  if (items.some((x) => x.toLowerCase() === lower)) {
    return { ok: false, message: "Duplicate item" };
  }
  items.push(n);
  return { ok: true };
}

function render() {
  const list = document.querySelector("#grocery-list");
  list.innerHTML = "";
  for (const it of items) {
    const row = document.createElement("div");
    row.textContent = it;
    list.appendChild(row);
  }
}

const input = document.querySelector("#item-input");
const btn = document.querySelector("#add-btn");
const error = document.querySelector("#error");

btn.addEventListener("click", () => {
  const result = addItem(input.value);
  if (!result.ok) {
    error.textContent = result.message;
    return;
  }
  error.textContent = "";
  input.value = "";
  render();
});

render();
```

## Why this works (short notes)

- Early returns keep validation simple and readable.
- A tiny result object lets the UI show helpful messages.
- The render stays dumb: it just reflects current state into the DOM.

## What good looks like (checks)

- Blank or duplicate adds show the right message and do not change the list.
- Valid adds clear the message and append exactly one row.

---

## Stretch solution (optional)

Focus and select the input after a successful add to speed up entry:

```js
// inside the click handler after setting input.value = ''
input.focus();
input.select();
```
