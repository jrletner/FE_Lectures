# Hints — 8/18/25 (Forms, Ifs, Functions)

1. Validate form

- Add a `submit` listener and call `e.preventDefault()`.
- Read values: `const name = nameEl.value.trim(); const age = parseInt(ageEl.value, 10);`
- Checks:
  - Name: `name.length > 0`
  - Age: `Number.isInteger(age) && age >= 13`
- Show errors by setting `.textContent` on the small elements; clear them when valid.
- Tip: `parseInt('')` becomes `NaN`; `Number.isNaN(age)` helps detect bad input.

2. Username availability

- Normalize both: `.trim().toLowerCase()`.
- If they are equal → return the error string; else return `null`.

3. Welcome message

- Guard name first; then convert/validate age.
- Capitalize with: `name[0].toUpperCase() + name.slice(1).toLowerCase()`.
- Build the final message with a template string.

4. Tiny helpers

- `isNonEmpty(str) → str.trim().length > 0`
- `isWholeNumber(n) → Number.isInteger(n)`
- `isTeen(age) → Number.isInteger(age) && age >= 13`
