# Solutions — 8/18/25 (Forms, Ifs, Functions)

1) Validate signup form (DOM + if)

HTML

```html
<form id="signup-form">
  <label>
    Name
    <input id="name" type="text" />
  </label>
  <small id="name-error" class="error"></small>

  <label>
    Age
    <input id="age" type="number" min="0" />
  </label>
  <small id="age-error" class="error"></small>

  <button type="submit">Sign up</button>
</form>

<p id="success" class="success" hidden>Thanks! Form is valid.</p>
```

CSS (optional)

```css
label { display: block; margin-top: 8px; }
small { display: block; min-height: 1em; }
.error { color: #b00020; }
.success { color: #0a7d00; }
```

JavaScript

```js
const form = document.querySelector('#signup-form');
const nameInput = document.querySelector('#name');
const ageInput = document.querySelector('#age');
const nameError = document.querySelector('#name-error');
const ageError = document.querySelector('#age-error');
const success = document.querySelector('#success');

function isNonEmpty(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const age = parseInt(ageInput.value, 10);

  if (nameError) nameError.textContent = '';
  if (ageError) ageError.textContent = '';
  if (success) success.hidden = true;

  let ok = true;
  if (!isNonEmpty(name)) {
    if (nameError) nameError.textContent = 'Name is required';
    ok = false;
  }
  if (!Number.isInteger(age) || age < 13) {
    if (ageError) ageError.textContent = 'Age must be 13+';
    ok = false;
  }

  if (ok && success) {
    success.hidden = false;
  }
});
```

2) Username availability (case-insensitive)

HTML (optional)

```html
<div class="check-username">
  <input id="existing" value="Sam" />
  <input id="candidate" placeholder="Enter a username" />
  <button id="check">Check</button>
  <small id="user-error" class="error"></small>
</div>
```

JavaScript

```js
function checkUsername(existing, candidate) {
  if (typeof candidate !== 'string') return 'Invalid username';
  const a = String(existing).trim().toLowerCase();
  const b = candidate.trim().toLowerCase();
  return a === b ? 'Username already taken' : null;
}

// wiring (optional)
const existingEl = document.querySelector('#existing');
const candidateEl = document.querySelector('#candidate');
const checkBtn = document.querySelector('#check');
const userErr = document.querySelector('#user-error');

checkBtn?.addEventListener('click', () => {
  userErr.textContent = '';
  const msg = checkUsername(existingEl.value, candidateEl.value);
  userErr.textContent = msg || 'Available';
});
```

3) Welcome message (if / else)

HTML (optional)

```html
<div class="welcome-box">
  <input id="w-name" placeholder="Your name" />
  <input id="w-age" type="number" placeholder="Age" />
  <button id="w-go">Make message</button>
  <p id="w-out"></p>
  <small id="w-err" class="error"></small>
</div>
```

JavaScript

```js
function isWholeNumber(n) { return Number.isInteger(n); }
function isTeen(age) { return Number.isInteger(age) && age >= 13; }

function makeWelcomeMessage(name, age) {
  const n = String(name || '').trim();
  const a = parseInt(age, 10);
  if (n.length === 0) return 'Name is required';
  if (!isTeen(a)) return 'Sorry, you must be 13+';
  const cap = n[0].toUpperCase() + n.slice(1).toLowerCase();
  return `Welcome, ${cap}!`;
}

// wiring (optional)
const wn = document.querySelector('#w-name');
const wa = document.querySelector('#w-age');
const wgo = document.querySelector('#w-go');
const wout = document.querySelector('#w-out');
const werr = document.querySelector('#w-err');

wgo?.addEventListener('click', () => {
  wout.textContent = '';
  werr.textContent = '';
  const msg = makeWelcomeMessage(wn.value, wa.value);
  if (msg.startsWith('Welcome,')) wout.textContent = msg; else werr.textContent = msg;
});
```

4) Tiny helpers (reusable)

```js
function isNonEmpty(str) { return typeof str === 'string' && str.trim().length > 0; }
function isWholeNumber(n) { return Number.isInteger(n); }
function isTeen(age) { return Number.isInteger(age) && age >= 13; }
```
