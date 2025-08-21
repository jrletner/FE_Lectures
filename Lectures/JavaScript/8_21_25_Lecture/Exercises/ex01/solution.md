# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Book Progress</title>
  </head>
  <body>
    <h1>Book progress</h1>
    <div id="book-info"></div>
    <script src="app.js"></script>
  </body>
</html>
```

## styles.css

```css
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  padding: 1rem;
}
#book-info {
  margin-top: 0.75rem;
}
```

## app.js

```js
class Book {
  constructor(title, pagesTotal, pagesRead = 0) {
    this.title = title;
    this.pagesTotal = pagesTotal;
    this.pagesRead = pagesRead;
  }
  get percentComplete() {
    if (this.pagesTotal <= 0) return 0;
    return Math.round((this.pagesRead / this.pagesTotal) * 100);
  }
  addReadPages(n) {
    const next = this.pagesRead + Number(n || 0);
    this.pagesRead = Math.min(this.pagesTotal, Math.max(0, next));
  }
  resetProgress() {
    this.pagesRead = 0;
  }
}

const book = new Book("Clean Code", 464, 120);
const infoEl = document.getElementById("book-info");

function render() {
  infoEl.textContent = `${book.title} — ${book.percentComplete}% complete`;
}

render();
book.addReadPages(50);
render();
```

## Why this works (short notes)

- Getter centralizes the derived `percentComplete` so any UI uses the same logic.
- Clamping prevents invalid progress values.
- Re-render after state changes keeps the UI in sync.

## What good looks like (checks)

- The page shows the title and a percentage.
- After calling `addReadPages(50)`, the percentage increases and never exceeds 100.

## Stretch solution

```js
book.resetProgress();
render();
```
