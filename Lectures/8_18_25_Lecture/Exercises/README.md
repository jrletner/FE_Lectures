# Exercises — 8/18/25 (Forms, Ifs, Functions)

We’ll build on variables, numbers, and strings (from 8/14) and add forms, if statements, and small functions. No arrays or advanced topics yet.

1. Validate signup form (DOM + if)

- Setup: a form with inputs `#name` (text) and `#age` (number) and small elements for errors: `#name-error`, `#age-error`.
- Rules: `name` must be non-empty after trimming; `age` must be a whole number and at least 13.
- Do this:
  - Add a `submit` listener and call `event.preventDefault()`.
  - Read values, trim `name`, convert `age` with `parseInt`.
  - If invalid, set the related error text; if valid, clear it.
- Acceptance: invalid inputs show messages and the page does not reload; valid inputs show no errors.

2. Username availability (case-insensitive)

- Goal: check if a username is already taken without using arrays.
- Setup: `const existingUsername = 'Sam';`
- Implement: `function checkUsername(existing, candidate) { /* string | null */ }`
- Behavior: return `null` if available; otherwise return `'Username already taken'`.
- Note: compare with `.trim().toLowerCase()` on both values.

3. Welcome message (if / else)

- Implement: `function makeWelcomeMessage(name, age) { /* string */ }`
- Behavior:
  - If `name` is empty after trimming → return `'Name is required'`.
  - Convert `age` with `parseInt`; if not a whole number or `< 13` → return `'Sorry, you must be 13+'`.
  - Otherwise return `Welcome, <Name>!` where `<Name>` is capitalized (first letter upper, rest lower).
- Example: `makeWelcomeMessage('  aLIce ', 15) → 'Welcome, Alice!'`

4. Tiny helpers (reusable)

- Implement:
  - `function isNonEmpty(str) { /* boolean */ }` → true when `str.trim().length > 0`.
  - `function isWholeNumber(n) { /* boolean */ }` → true when `Number.isInteger(n)`.
  - `function isTeen(age) { /* boolean */ }` → true when integer and `age >= 13`.
- Use these inside your code from steps 1–3 to keep conditions simple.

---

## Hints

If you get stuck, review the hints file for nudges and patterns. Try each step yourself before peeking.

- Hints: `./hints.md`

- Solutions: `./solutions.md`
