# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Movies — Class 6</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <label
        >Min rating
        <input
          id="min-rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value="0"
      /></label>
      <label
        >Sort by
        <select id="sort-by">
          <option value="year-desc">Year (new → old)</option>
          <option value="year-asc">Year (old → new)</option>
          <option value="title-asc">Title (A–Z)</option>
        </select>
      </label>

      <section id="movie-info"></section>
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
#movie-info li {
  margin: 4px 0;
}
```

## app.js

```js
const movies = [
  { id: "m_1", title: "Interstellar", year: 2014, rating: 8.6 },
  { id: "m_2", title: "Arrival", year: 2016, rating: 7.9 },
  { id: "m_3", title: "Blade Runner 2049", year: 2017, rating: 8.0 },
  { id: "m_4", title: "The Martian", year: 2015, rating: 8.0 },
];

const ui = { minRating: 0, sortBy: "year-desc" };

function getVisibleMovies() {
  let list = movies.filter((m) => m.rating >= ui.minRating);
  list = list.slice();
  list.sort((a, b) => {
    switch (ui.sortBy) {
      case "year-desc":
        return b.year - a.year;
      case "year-asc":
        return a.year - b.year;
      case "title-asc":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  return list;
}

function render() {
  const container = document.getElementById("movie-info");
  container.innerHTML = "";
  const list = getVisibleMovies();
  if (list.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No movies match your filters.";
    container.appendChild(p);
    return;
  }
  const ul = document.createElement("ul");
  for (const m of list) {
    const li = document.createElement("li");
    li.textContent = `${m.title} (${m.year}) — ${m.rating}`;
    ul.appendChild(li);
  }
  container.appendChild(ul);
}

const ratingInput = document.getElementById("min-rating");
ratingInput.addEventListener("input", (e) => {
  const val = parseFloat(e.target.value);
  ui.minRating = isNaN(val) ? 0 : val;
  render();
});

document.getElementById("sort-by").addEventListener("change", (e) => {
  ui.sortBy = e.target.value;
  render();
});

render();
```

## Why this works

- Derived list function composes a filter step then a sort step.
- Sorting operates on a shallow copy to avoid mutating the source data.

## What good looks like (checks)

- Updating min rating removes low-rated movies; changing sort reorders properly.

```

```
