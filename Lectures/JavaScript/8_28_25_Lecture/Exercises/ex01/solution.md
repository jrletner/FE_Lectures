# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Products — Class 6</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <input id="search" type="search" placeholder="Search products..." />
      <section id="product-info"></section>
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
#product-info li {
  margin: 4px 0;
}
```

## app.js

```js
const products = [
  { id: "p_1", name: "Laptop", price: 999 },
  { id: "p_2", name: "Phone", price: 699 },
  { id: "p_3", name: "Lamp", price: 39 },
];

const ui = { searchText: "" };

function getVisibleProducts() {
  const q = ui.searchText.trim().toLowerCase();
  if (!q) return products.slice();
  return products.filter((p) => p.name.toLowerCase().includes(q));
}

function render() {
  const container = document.getElementById("product-info");
  container.innerHTML = "";
  const list = getVisibleProducts();
  if (list.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No products match";
    container.appendChild(p);
    return;
  }
  const ul = document.createElement("ul");
  for (const item of list) {
    const li = document.createElement("li");
    li.textContent = `${item.name} — $${item.price}`;
    ul.appendChild(li);
  }
  container.appendChild(ul);
}

document.getElementById("search").addEventListener("input", (e) => {
  ui.searchText = e.target.value;
  render();
});

render();
```

## Why this works

- Derived list keeps filtering logic out of DOM code and makes re-renders simple.
- Lowercasing both sides ensures case-insensitive match.

## What good looks like (checks)

- Typing filters immediately; exact zero-match message appears when appropriate.

```

```
