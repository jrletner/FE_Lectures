# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Todo — Class 5</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <form id="todo-form" class="form">
        <label for="todo-title">Title</label>
        <input id="todo-title" type="text" placeholder="e.g., Buy milk" />
        <button type="submit" class="btn">Add Todo</button>
        <p id="error-message" class="error" aria-live="polite"></p>
      </form>

      <section id="todo-info"></section>
    </main>

    <script src="app.js"></script>
  </body>
</html>
```

## styles.css

```css
body {
  font-family: Arial, sans-serif;
  padding: 16px;
}
.form {
  display: flex;
  gap: 8px;
  align-items: center;
}
.error {
  color: #c00;
  margin-left: 8px;
}
.btn {
  padding: 6px 10px;
}
li {
  margin: 4px 0;
}
```

## app.js

```js
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

const todos = [];

function render() {
  const container = document.getElementById("todo-info");
  container.innerHTML = "";

  if (todos.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No todos yet.";
    container.appendChild(p);
    return;
  }

  const ul = document.createElement("ul");
  for (const t of todos) {
    const li = document.createElement("li");
    li.innerHTML = `${t.title} <button data-id="${t.id}">Remove</button>`;
    ul.appendChild(li);
  }
  container.appendChild(ul);
}

// Submit
const form = document.getElementById("todo-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("todo-title");
  const error = document.getElementById("error-message");
  const title = (input.value || "").trim();
  if (title === "") {
    error.textContent = "Please enter a title.";
    return;
  }
  error.textContent = "";
  todos.push({ id: makeId("t"), title });
  input.value = "";
  render();
});

// Remove (single handler)
document.getElementById("todo-info").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.dataset.id;
  const i = todos.findIndex((t) => t.id === id);
  if (i >= 0) todos.splice(i, 1);
  render();
});

render();
```

## Why this works

- State lives in one array; UI is always rendered from it.
- Simple id helper gives stable remove operations.
- Single click handler keeps code small and reliable for dynamic items.

## What good looks like (checks)

- Adding shows items; empty input warns; Remove deletes only the clicked item.

```

```
