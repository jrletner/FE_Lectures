# Solutions — 8/14/25 (Variables, Numbers, Strings)

1. Change due

```js
const price = 6.59;
const cashGiven = 10;
const rawChange = cashGiven - price; // 3.41
const change = Math.max(0, rawChange); // 3.41
const changeLabel = `$${change.toFixed(2)}`; // "$3.41"
```

2. Item summary

```js
const title = "Pencils";
const qty = 3;
const priceEach = 1.25;
const priceStr = priceEach.toFixed(2); // "1.25"
const summary = `${title} — ${qty} in stock ($${priceStr} each)`; // "Pencils — 3 in stock ($1.25 each)"
```

3. Clean full name

```js
const firstName = "  joHN ";
const lastName = "  doE  ";
const firstClean = firstName.trim(); // "joHN"
const lastClean = lastName.trim(); // "doE"
const firstCap =
  firstClean.charAt(0).toUpperCase() + firstClean.slice(1).toLowerCase(); // "John"
const lastCap =
  lastClean.charAt(0).toUpperCase() + lastClean.slice(1).toLowerCase(); // "Doe"
const fullName = firstCap + " " + lastCap; // "John Doe"
```

4. Positive whole number flag

```js
let value = 3;
const isPositiveWhole = Number.isInteger(value) && value >= 1; // true
```

5. Celsius → Fahrenheit label

```js
const celsius = 22.2;
const f = (celsius * 9) / 5 + 32; // 71.96
const rounded = Math.round(f); // 72
const label = `${rounded}°F`; // "72°F"
```
