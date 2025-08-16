# Exercises — 8/14/25 (Variables, Numbers, Strings)

In this lesson we’ll practice with variables, numbers, and strings. No functions yet — just create variables and compute the values.

1. Change due (formatting)

- Given:
  - `const price = 6.59;`
  - `const cashGiven = 10;`
- Create variables:
  - `rawChange` (cashGiven minus price)
  - `change` (make sure it’s not negative)
  - `changeLabel` (a string like `$3.41` with 2 decimals)
- Tip: use `Math.max(0, rawChange)` and `.toFixed(2)`
- Expected: `changeLabel` is `$3.41`

2. Item summary (template strings)

- Given:
  - `const title = 'Pencils';`
  - `const qty = 3;`
  - `const priceEach = 1.25;`
- Create variables:
  - `priceStr` (two decimals using `toFixed(2)`)
  - `summary` like `Pencils — 3 in stock ($1.25 each)`
- Expected: `summary` equals `"Pencils — 3 in stock ($1.25 each)"`

3. Clean full name (trimming + casing)

- Given:
  - `const firstName = '  joHN ';`
  - `const lastName = '  doE  ';`
- Create variables:
  - `firstClean` → trimmed and capitalized (first letter uppercase, rest lowercase)
  - `lastClean` → same idea
  - `fullName` → `"John Doe"` using a space between them
- Tips: `.trim()`, `.charAt(0).toUpperCase()`, `.slice(1).toLowerCase()`

4. Positive whole number flag (booleans)

- Given:
  - `let value = 3;`
- Create `isPositiveWhole` which is true only when `value` is a whole number and at least 1.
- Tip: `Number.isInteger(value) && value >= 1`
- Try changing `value` to `0`, `2.2`, and `'5'` to see the result.

5. Celsius → Fahrenheit label (numbers + formatting)

- Given:
  - `const celsius = 22.2;`
- Create variables:
  - `fahrenheit` (rounded) using `celsius * 9/5 + 32`
  - `label` like `"72°F"`
- Expected: `label` is `"72°F"`

---

## Hints

If you get stuck, review the hints file for nudges and patterns. Try each step yourself before peeking.

- Hints: `./hints.md`

- Solutions: `./solutions.md`
