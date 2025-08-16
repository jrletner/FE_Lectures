# Exercises — 8/18/25 (Forms, Ifs, Functions)

1. Validate signup form (DOM + conditions)

- Goal: prevent form submission when invalid and show inline messages
- Setup: a form with inputs `#name` (text) and `#age` (number)
- Rules: `name` must be non-empty after trimming; `age` must be a number ≥ 13
- Implement:
  - Add a `submit` listener → `event.preventDefault()`
  - Read values, trim `name`, convert `age` with `parseInt`
  - Show an error message next to each invalid field; clear messages when fixed
- Acceptance: valid inputs do not show errors; invalid inputs show specific messages; the page does not reload on invalid submit

2. Duplicate username check (arrays + strings)

- Implement: `function validateUsername(usernames, candidate) { /* string|null */ }`
- Behavior: return `null` when unique; return an error string when the name already exists (case-insensitive)
- Examples:
  - `validateUsername(["Sam", "Jo"], "sam") → "Username already taken"`
  - `validateUsername(["Sam"], "Alex") → null`
- Acceptance: uses a case-insensitive comparison; no mutation of `usernames`

3. Pure addItem (immutability)

- Implement: `function addItem(list, item) { /* { state:any[], error:string|null } */ }`
- Behavior:
  - Validate `item` using your guards (see step 4)
  - On failure: return `{ state: list, error: 'reason' }`
  - On success: return `{ state: [...list, item], error: null }`
- Example:
  - Input: `list=[{ title:'A', qty:1 }]`, `item={ title:'B', qty:2 }`
  - Output: `{ state:[{title:'A',qty:1},{title:'B',qty:2}], error:null }`
- Acceptance: never mutates the original `list`; returns both next state and error

4. Guard functions (tiny validators)

- Implement reusable helpers to keep logic clean:
  - `isNonEmpty(str)`: true when string and `str.trim().length > 0`
  - `isPositiveInt(n)`: true when `Number.isInteger(n)` and `n >= 1`
  - `isEmail(str)` (optional): simple regex like `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Usage in step 3: check guards first; if any fail, return the original list and an error reason
- Acceptance: guards return booleans; `addItem` relies on these checks to decide

---

## Hints

If you get stuck, review the hints file for nudges and patterns. Try each step yourself before peeking.

- Hints: `./hints.md`
