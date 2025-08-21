# Hints

### Nudge 1

- Parse the date once per item: `item.date = new Date(item.dateStr)`.

### Nudge 2

- `const upcoming = items.filter(x => x.date > new Date())`.

### Nudge 3 (optional)

- Sort by `a.date - b.date` and then render the resulting array.
