# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Upcoming Releases</title>
  </head>
  <body>
    <h1>Upcoming releases</h1>
    <label><input type="checkbox" id="hide-watched" /> Hide watched</label>
    <p id="release-info"></p>
    <ul id="release-list"></ul>
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
```

## app.js

```js
function makeId(prefix = "r") {
  return `${prefix}_${Math.random().toString(36).slice(2, 6)}`;
}

const all = [
  {
    id: makeId(),
    title: "JS Handbook 2026",
    dateStr: "2026-01-20",
    watched: false,
  },
  {
    id: makeId(),
    title: "Web APIs Deep Dive",
    dateStr: "2025-10-05",
    watched: false,
  },
  {
    id: makeId(),
    title: "UI Patterns 101",
    dateStr: "2025-09-01",
    watched: true,
  },
  {
    id: makeId(),
    title: "Modern CSS Tricks",
    dateStr: "2025-07-01",
    watched: false,
  },
];

for (const x of all) x.date = new Date(x.dateStr);

const els = {
  info: document.getElementById("release-info"),
  list: document.getElementById("release-list"),
  hide: document.getElementById("hide-watched"),
};

function getUpcoming() {
  const now = new Date();
  return all.filter((x) => x.date > now).sort((a, b) => a.date - b.date);
}

function render() {
  const upcoming = getUpcoming();
  const visible = els.hide.checked
    ? upcoming.filter((x) => !x.watched)
    : upcoming;
  els.info.textContent = `Upcoming: ${visible.length}`;
  els.list.innerHTML = "";
  for (const r of visible) {
    const li = document.createElement("li");
    li.textContent = `${r.title} — ${r.date.toLocaleDateString()} `;
    const btn = document.createElement("button");
    btn.textContent = r.watched ? "Unwatch" : "Watched";
    btn.addEventListener("click", () => {
      r.watched = !r.watched;
      render();
    });
    li.appendChild(btn);
    els.list.appendChild(li);
  }
}

els.hide.addEventListener("change", render);
render();
```

## Why this works (short notes)

- Parse once keeps data consistent and avoids repeated parsing.
- Filter + sort produce the derived view for future items.
- Toggling a boolean and re-rendering keeps UI synced with state.

## What good looks like (checks)

- Only future items render, sorted by date asc.
- Toggling watched updates the row and summary.
- No console errors.

## Stretch solution

- Already included: checkbox to hide watched items.
