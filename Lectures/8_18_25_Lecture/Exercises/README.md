# Exercises — 8/18/25 (Forms, Ifs, Functions)

1. Validate signup form

- Prevent submit when `name` is empty or `age` < 13; show an inline message next to each invalid field.

2. Duplicate username check

- Given an array of usernames, ensure a new username is unique (case-insensitive). Return a helpful error string or `null`.

3. Pure addItem

- Write `addItem(list, item)` that returns a new array with `item` appended only when `item` passes `isNonEmpty`. Otherwise return the original list and an error.

4. Guard functions

- Implement small helpers: `isNonEmpty(str)`, `isPositiveInt(n)`, `isEmail(str)`. Use them in your validations.
