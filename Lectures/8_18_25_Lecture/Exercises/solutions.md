# Solutions — 8/18/25 (Forms, Ifs, Functions)

1. Validate signup form (DOM + if)

```js
const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const ageInput = document.querySelector("#age");
const nameError = document.querySelector("#name-error");
const ageError = document.querySelector("#age-error");

function isNonEmpty(str) {
  return typeof str === "string" && str.trim().length > 0;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const age = parseInt(ageInput.value, 10);

  // clear previous
  if (nameError) nameError.textContent = "";
  if (ageError) ageError.textContent = "";

  let ok = true;
  if (!isNonEmpty(name)) {
    if (nameError) nameError.textContent = "Name is required";
    ok = false;
  }
  if (!Number.isInteger(age) || age < 13) {
    if (ageError) ageError.textContent = "Age must be 13+";
    ok = false;
  }

  if (ok) {
    // proceed (e.g., show a success message)
  }
});
```

2. Username availability (case-insensitive)

```js
function checkUsername(existing, candidate) {
  if (typeof candidate !== "string") return "Invalid username";
  const a = String(existing).trim().toLowerCase();
  const b = candidate.trim().toLowerCase();
  return a === b ? "Username already taken" : null;
}
```

3. Welcome message (if / else)

```js
function isWholeNumber(n) {
  return Number.isInteger(n);
}
function isTeen(age) {
  return Number.isInteger(age) && age >= 13;
}

function makeWelcomeMessage(name, age) {
  const n = String(name || "").trim();
  const a = parseInt(age, 10);
  if (n.length === 0) return "Name is required";
  if (!isTeen(a)) return "Sorry, you must be 13+";
  const cap = n[0].toUpperCase() + n.slice(1).toLowerCase();
  return `Welcome, ${cap}!`;
}
```

4. Tiny helpers (reusable)

```js
function isNonEmpty(str) {
  return typeof str === "string" && str.trim().length > 0;
}
function isWholeNumber(n) {
  return Number.isInteger(n);
}
function isTeen(age) {
  return Number.isInteger(age) && age >= 13;
}
```

}

```

```
