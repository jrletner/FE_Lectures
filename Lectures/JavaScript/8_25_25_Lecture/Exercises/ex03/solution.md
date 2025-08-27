# Solution

## index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Groceries — Class 5</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main>
    <form id="grocery-form" class="form">
      <input id="grocery-name" type="text" placeholder="e.g., Apples" />
      <input id="grocery-qty" type="number" min="1" value="1" />
      <button type="submit" class="btn">Add</button>
      <p id="error-message" class="error" aria-live="polite"></p>
    </form>

    <section id="grocery-info"></section>
    <p id="total" class="note"></p>
  </main>

  <script src="app.js"></script>
</body>
</html>
```

## styles.css
```css
body { font-family: Arial, sans-serif; padding: 16px; }
.form { display: flex; gap: 8px; align-items: center; }
.error { color: #c00; margin-left: 8px; }
.note { color: #666; font-size: 12px; }
.btn { padding: 6px 10px; }
li { margin: 4px 0; }
```

## app.js
```js
let __id = 1;
function makeId(prefix) { return `${prefix}_${__id++}`; }

const groceries = [];

function render() {
  const container = document.getElementById('grocery-info');
  container.innerHTML = '';

  if (groceries.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No items yet.';
    container.appendChild(p);
  } else {
    const ul = document.createElement('ul');
    for (const g of groceries) {
      const li = document.createElement('li');
      li.innerHTML = `${g.name} — ${g.qty} <button data-id="${g.id}">Remove</button>`;
      ul.appendChild(li);
    }
    container.appendChild(ul);
  }

  const total = groceries.reduce((sum, g) => sum + g.qty, 0);
  const note = document.getElementById('total');
  if (note) note.textContent = `Total items: ${total}`;
}

const form = document.getElementById('grocery-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameEl = document.getElementById('grocery-name');
  const qtyEl = document.getElementById('grocery-qty');
  const error = document.getElementById('error-message');

  const name = (nameEl.value || '').trim();
  const qty = parseInt(qtyEl.value, 10);
  if (name === '' || isNaN(qty) || qty < 1) {
    error.textContent = 'Enter a name and a quantity (min 1).';
    return;
  }
  error.textContent = '';

  groceries.push({ id: makeId('g'), name, qty });
  nameEl.value = '';
  qtyEl.value = '1';
  nameEl.focus();
  render();
});

// Remove
document.getElementById('grocery-info').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = btn.dataset.id;
  const i = groceries.findIndex(g => g.id === id);
  if (i >= 0) groceries.splice(i, 1);
  render();
});

render();
```

## Why this works
- Validates inputs; coerces qty safely.
- Derived total is computed each render, keeping UI correct.
- One click handler for removes.

## What good looks like (checks)
- Valid adds show; invalid inputs warn; Remove deletes one; total updates.
```

## Stretch solution (merge duplicates)

```js
// In submit handler, before push:
const existing = groceries.find(g => g.name.toLowerCase() === name.toLowerCase());
if (existing) {
  existing.qty += qty;
  render();
  return;
}
```
