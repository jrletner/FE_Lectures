# Hints

### Nudge 1

- Generate ids with a small helper so titles can duplicate safely.

### Nudge 2

- Use `findIndex` to locate a task by id for removal; use `splice` to delete it.

### Nudge 3 (optional)

- For duplicate guard: compare `title.toLowerCase()` values in `.some(...)` before pushing.
