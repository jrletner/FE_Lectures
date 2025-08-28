# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Books — Class 6</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <label><input id="only-in-stock" type="checkbox" /> In stock only</label>
      <label
        >Sort by
        <select id="sort-by">
          <option value="pages-desc">Pages (high → low)</option>
          <option value="pages-asc">Pages (low → high)</option>
          <option value="title-asc">Title (A–Z)</option>
        </select>
      </label>

      <section id="book-info"></section>
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
#book-info li {
  margin: 4px 0;
}
```

## app.js

```js
const books = [
  { id: "b_1", title: "Clean Code", pages: 464, inStock: true },
  { id: "b_2", title: "Eloquent JavaScript", pages: 472, inStock: false },
  { id: "b_3", title: "You Don’t Know JS", pages: 278, inStock: true },
];

const ui = { onlyInStock: false, sortBy: "pages-desc" };

function getVisibleBooks() {
  let list = books.slice();
  if (ui.onlyInStock) list = list.filter((b) => b.inStock);
  list.sort((a, b) => {
    switch (ui.sortBy) {
      case "pages-desc":
        return b.pages - a.pages;
      case "pages-asc":
        return a.pages - b.pages;
      case "title-asc":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  return list;
}

function render() {
  const container = document.getElementById("book-info");
  container.innerHTML = "";
  const list = getVisibleBooks();
  if (list.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No books match your filters.";
    container.appendChild(p);
    return;
  }
  const ul = document.createElement("ul");
  for (const b of list) {
    const li = document.createElement("li");
    li.textContent = `${b.title} — ${b.pages} pages ${
      b.inStock ? "(in stock)" : "(out of stock)"
    }`;
    ul.appendChild(li);
  }
  container.appendChild(ul);
}

const stock = document.getElementById("only-in-stock");
stock.addEventListener("change", (e) => {
  ui.onlyInStock = e.target.checked;
  render();
});

document.getElementById("sort-by").addEventListener("change", (e) => {
  ui.sortBy = e.target.value;
  render();
});

render();
```

## Why this works

- Derived list composes filter + sort in one place; render stays small.
- Checkbox and select wire state updates to re-render for a simple data flow.

## What good looks like (checks)

- Checkbox hides out-of-stock correctly; sort reflects the selection.

```

```
