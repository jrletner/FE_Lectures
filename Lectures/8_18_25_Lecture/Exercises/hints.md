# Hints — 8/18/25 (Forms, Ifs, Functions)

1. Validate form

- Goal: stop invalid submits and show inline guidance.
- Steps:
  - Add `form.addEventListener('submit', (e)=>{ e.preventDefault(); ... })`.
  - Read values: `const name = nameEl.value.trim(); const age = parseInt(ageEl.value, 10);`
  - Validate: `name.length > 0` and `Number.isInteger(age) && age >= 13`.
  - Show errors in small elements next to inputs; clear them when valid.
- Pitfalls: `parseInt('')` is `NaN`; always use `Number.isNaN(age)` to detect invalid.

2. Duplicate username check

- Goal: reject names already in use (case-insensitive).
- Steps:
  - Normalize: `u.toLowerCase()` for both existing and candidate.
  - Use `.some(u => u.toLowerCase() === candidate.toLowerCase())`.
  - Return `null` when unique; otherwise an error string.
- Quick tests: `["Sam","Jo"], "sam" → error`; `["Sam"], "Alex" → null`.

3. Pure addItem

- Goal: immutable update with explicit success/failure.
- Steps:
  - Guards first (see #4). If any fail, `return { state: list, error: 'reason' }`.
  - Success: `return { state: [...list, item], error: null }`.
- Pitfalls: pushing into `list` mutates—avoid `list.push(...)`.
- Quick test: ensure original array reference is unchanged on success and failure.

4. Guard helpers

- Goal: tiny reusable validators.
- Steps:
  - `isNonEmpty(s) { return typeof s === 'string' && s.trim().length > 0; }`
  - `isPositiveInt(n) { return Number.isInteger(n) && n >= 1; }`
  - Optional: `isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }`
- Usage: in `addItem`, call guards up front and short-circuit on failure.
