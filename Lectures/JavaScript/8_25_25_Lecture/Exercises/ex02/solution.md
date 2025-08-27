# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Books — Class 5</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <form id="book-form" class="form">
        <input id="book-title" type="text" placeholder="Title" />
        <input id="book-author" type="text" placeholder="Author" />
        <button type="submit" class="btn">Add Book</button>
        <p id="error-message" class="error" aria-live="polite"></p>
      </form>

      <section id="book-info"></section>
      <p id="note" class="note"></p>
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
.note {
  color: #666;
  font-size: 12px;
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

const books = [];

function render() {
  const container = document.getElementById("book-info");
  container.innerHTML = "";

  if (books.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No books yet.";
    container.appendChild(p);
  } else {
    const ul = document.createElement("ul");
    for (const b of books) {
      const li = document.createElement("li");
      li.innerHTML = `${b.title} — ${b.author} <button data-id="${b.id}">Remove</button>`;
      ul.appendChild(li);
    }
    container.appendChild(ul);
  }

  const note = document.getElementById("note");
  if (note) note.textContent = `${books.length} books total`;
}

// Submit
const form = document.getElementById("book-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleEl = document.getElementById("book-title");
  const authorEl = document.getElementById("book-author");
  const error = document.getElementById("error-message");
  const title = (titleEl.value || "").trim();
  const author = (authorEl.value || "").trim();

  if (title === "") {
    error.textContent = "Please enter a title.";
    return;
  }
  const exists = books.some(
    (b) => b.title.toLowerCase() === title.toLowerCase()
  );
  if (exists) {
    error.textContent = "A book with this title already exists.";
    return;
  }

  error.textContent = "";
  books.push({ id: makeId("b"), title, author });
  titleEl.value = "";
  authorEl.value = "";
  titleEl.focus();
  render();
});

// Remove
document.getElementById("book-info").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.dataset.id;
  const i = books.findIndex((b) => b.id === id);
  if (i >= 0) books.splice(i, 1);
  render();
});

render();
```

## Why this works

- Guard clauses handle bad input and duplicates before mutating state.
- Rendering shows exact state; the note is a tiny derived value.
- Single click handler for removes is robust for dynamic items.

## What good looks like (checks)

- Empty/duplicate titles show an error; valid adds render; Remove deletes only the chosen book.

```

```
