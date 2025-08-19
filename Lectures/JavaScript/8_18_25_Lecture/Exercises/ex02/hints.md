# Hints

### Nudge 1

- Use `(name || '').trim()` to guard against blanks early.

### Nudge 2

- Compare case-insensitively: `items.some(x => x.toLowerCase() === n.toLowerCase())`.

### Nudge 3

- Return an object from `addItem(name)` like `{ ok: boolean, message?: string }` so the UI can show feedback.
