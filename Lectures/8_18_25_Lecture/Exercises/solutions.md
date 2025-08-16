# Solutions — 8/18/25 (Forms, Ifs, Functions)

1. Validate signup form (DOM + conditions)

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

  let ok = true;
  if (nameError) nameError.textContent = "";
  if (ageError) ageError.textContent = "";

  if (!isNonEmpty(name)) {
    if (nameError) nameError.textContent = "Name is required";
    ok = false;
  }
  if (!Number.isInteger(age) || age < 13) {
    if (ageError) ageError.textContent = "Age must be 13+";
    ok = false;
  }

  if (ok) {
    // proceed with submit/next step
    // e.g., console.log('Valid!');
  }
});
```

2. Duplicate username check (arrays + strings)

```js
function validateUsername(usernames, candidate) {
  if (!candidate || typeof candidate !== "string") return "Invalid username";
  const cand = candidate.trim().toLowerCase();
  const taken = usernames.some((u) => String(u).toLowerCase() === cand);
  return taken ? "Username already taken" : null;
}
```

3. Pure addItem (immutability)

```js
function isPositiveInt(n) {
  return Number.isInteger(n) && n >= 1;
}
function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function addItem(list, item) {
  // Example guards: title + qty
  if (!isNonEmpty(item?.title)) {
    return { state: list, error: "invalid-title" };
  }
  if (!isPositiveInt(item?.qty)) {
    return { state: list, error: "invalid-qty" };
  }
  return { state: [...list, item], error: null };
}
```

4. Guard functions (tiny validators)

```js
function isNonEmpty(str) {
  return typeof str === "string" && str.trim().length > 0;
}
function isPositiveInt(n) {
  return Number.isInteger(n) && n >= 1;
}
function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}
```
