# Hints — 8/14/25 (Variables, Numbers, Strings)

1. Change due

- Goal: compute non-negative change and show it as `$3.41`.
- Steps:
  - `const rawChange = cashGiven - price;`
  - `const change = Math.max(0, rawChange);`
  - `const changeLabel = `$${change.toFixed(2)}`;`
- Note: `.toFixed(2)` gives exactly 2 decimals.

2. Item summary

- Goal: build `Pencils — 3 in stock ($1.25 each)`.
- Steps:
  - `const priceStr = priceEach.toFixed(2);`
  - `const summary = `${title} — ${qty} in stock ($${priceStr} each)`;`

3. Clean full name

- Goal: `"John Doe"` from messy pieces.
- Steps:
  - `const firstClean = firstName.trim();`
  - `const lastClean = lastName.trim();`
  - Capitalize: first letter upper, the rest lower
  - Join with a single space: `const fullName = firstCap + ' ' + lastCap;`

4. Positive whole number flag

- Goal: true only for whole numbers 1 or more.
- Step: `const isPositiveWhole = Number.isInteger(value) && value >= 1;`
- Try changing `value` to check different cases.

5. Celsius → Fahrenheit label

- Goal: make `"72°F"` from a Celsius number.
- Steps:
  - `const f = celsius * 9/5 + 32;`
  - `const rounded = Math.round(f);`
  - `const label = `${rounded}°F`;`
