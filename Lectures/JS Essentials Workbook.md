# JS Essentials Workbook

A companion to “JS Essentials (No‑AI Study Checklist).” Each section below includes about six hands‑on exercises. Keep demos small (10–30 lines), write them yourself, and verify against the success criteria.

Pro tip: Work in a simple project folder with an `index.html` that loads your `app.js`. Use the browser console and DevTools as you go.

_Last updated: 2025‑10‑28_

---

## 1) Core Programming Fundamentals

### Exercise 1 — Variables & Types

- Goal: Declare variables with `let` and `const`; inspect their types.
- Steps:
  1. Create variables for a string, number, boolean, `null`, and `undefined`.
  2. Log each value and `typeof`.
- Success criteria:
  - You can explain why `typeof null` is `"object"` (legacy quirk).
  - You know when to prefer `const` over `let`.

### Exercise 2 — Conditionals

- Goal: Practice `if/else` and `switch`.
- Steps:
  1. Write a function `grade(score)` that returns `A/B/C/D/F`.
  2. Implement once with `if/else`, once with `switch`.
- Success criteria:
  - Same output for both implementations.
  - Clear boundaries (e.g., `90+` is `A`).

### Exercise 3 — Comparisons & Truthiness

- Goal: Use comparison and logical operators.
- Steps:
  1. Given `[0, 1, "", "hi", null, undefined, [], {}]`, filter truthy values.
  2. Compare `==` vs `===` with a few pairs (e.g., `0 == false`, `0 === false`).
- Success criteria:
  - You can articulate when `==` is risky and prefer `===`.

### Exercise 4 — Loops

- Goal: Write `for`, `while`, and `for...of`.
- Steps:
  1. Sum even numbers from 1..N using each loop style.
- Success criteria:
  - Three working versions; same final sum.

### Exercise 5 — Loop Control

- Goal: Practice `break` and `continue`.
- Steps:
  1. Find the first number in 1..N divisible by 3 and 5; stop early with `break`.
  2. Print only odd numbers 1..N using `continue` to skip evens.
- Success criteria:
  - Outputs match your conditions; no extra iterations.

### Exercise 6 — FizzBuzz (Classic)

- Goal: Combine loops and conditionals.
- Steps:
  1. Print 1..100; `Fizz` for multiples of 3, `Buzz` for 5, `FizzBuzz` for both.
- Success criteria:
  - Text is correct and readable.

---

## 2) Functions & Scope

### Exercise 1 — Basic Function & Defaults

- Goal: Define and call functions; use a default parameter.
- Steps:
  1. Implement `greet(name = "world")` -> `"Hello, <name>!"`.
- Success criteria:
  - Works with and without passing `name`.

### Exercise 2 — Multiple Arguments & Rest

- Goal: Handle multiple args and rest parameters.
- Steps:
  1. Implement `average(...nums)` that ignores non‑numbers.
- Success criteria:
  - `average(1, 2, 3) -> 2`, `average(2, "x", 4) -> 3`.

### Exercise 3 — Arrow Functions

- Goal: Practice concise arrow functions.
- Steps:
  1. Given an array of names, return an array of `{ name, length }` using arrows.
- Success criteria:
  - Output shape matches; original array unchanged.

### Exercise 4 — Scope & Shadowing

- Goal: Understand scope rules.
- Steps:
  1. Demonstrate variable shadowing inside a block/function.
  2. Log which value is read at each point.
- Success criteria:
  - You can predict/justify each logged value.

### Exercise 5 — Closures: Counter

- Goal: Build a function that remembers state.
- Steps:
  1. `makeCounter()` returns `{ inc, reset, value }`.
  2. `inc()` increments internal count; `reset()` sets to 0; `value()` reads.
- Success criteria:
  - Count persists across calls without global variables.

### Exercise 6 — Function Factories

- Goal: Use lexical scope to generate specialized functions.
- Steps:
  1. `makeGreeter(prefix)` returns `(name) => `${prefix} ${name}``.
- Success criteria:
  - `makeGreeter("Hi")("Ada") -> "Hi Ada"`.

---

## 3) Data Structures

### Exercise 1 — Array CRUD Basics

- Goal: Use `.push`, `.pop`, `.shift`, `.unshift`.
- Steps:
  1. Start with `[]`; add items to front/back; remove from front/back; log after each.
- Success criteria:
  - You can explain each method’s effect and return value.

### Exercise 2 — Higher‑Order Methods

- Goal: Use `.map`, `.filter`, `.reduce`, `.find`.
- Steps:
  1. On a list of products, compute: names of in‑stock items, total value, and find by id.
- Success criteria:
  - Each method used for the right job; immutable transformations.

### Exercise 3 — Object Basics

- Goal: Create, read, update, delete properties.
- Steps:
  1. Build a `user` object; add `email`, update `name`, delete a field.
  2. Check for a property with `in` and `hasOwnProperty`.
- Success criteria:
  - Operations do what you expect; you can explain differences.

### Exercise 4 — Looping Objects

- Goal: Iterate over object keys/values.
- Steps:
  1. Compare `for...in` vs `Object.entries` + `for...of` on the same object.
- Success criteria:
  - You can articulate when to prefer entries.

### Exercise 5 — Deep/Nested Access

- Goal: Safely read nested data.
- Steps:
  1. Given a nested object, access deep fields and supply defaults if missing.
- Success criteria:
  - No crashes on missing paths; defaults appear.

### Exercise 6 — Group By (Reduce)

- Goal: Aggregate an array into a grouped object.
- Steps:
  1. Group users by `role` using `reduce` into `{ [role]: User[] }`.
- Success criteria:
  - Output groups are correct and complete.

---

## 4) Asynchronous JavaScript

### Exercise 1 — setTimeout Basics

- Goal: Schedule work in the future.
- Steps:
  1. Log "start"; schedule a log of "done" in 1000ms; log "after schedule".
- Success criteria:
  - Order is: start → after schedule → (1s) → done.

### Exercise 2 — setInterval & clearInterval

- Goal: Run repeated work and stop.
- Steps:
  1. Countdown from 5 to 0 every 500ms; stop at 0 with `clearInterval`.
- Success criteria:
  - Prints 5,4,3,2,1,0 and stops.

### Exercise 3 — Promises with then/catch

- Goal: Wrap a timeout in a Promise.
- Steps:
  1. `delay(ms)` resolves after `ms`; call it and `.then` to log.
  2. Make a version that sometimes rejects; `.catch` the error.
- Success criteria:
  - You can explain resolve vs reject.

### Exercise 4 — async/await (sequential & parallel)

- Goal: Compare sequential awaits vs `Promise.all`.
- Steps:
  1. Build `fakeFetch(id)` that resolves after 200–400ms.
  2. Await two calls sequentially; then run them in parallel with `Promise.all`.
- Success criteria:
  - Parallel version completes faster (on average).

### Exercise 5 — Error Handling with try/catch

- Goal: Catch async errors.
- Steps:
  1. Make `maybeFail()` that randomly rejects; handle with try/catch in an `async` function.
- Success criteria:
  - Error path and success path both handled; no uncaught rejections.

### Exercise 6 — Promise.race

- Goal: Take the fastest response.
- Steps:
  1. Race two `fakeFetch` calls; log whichever finishes first.
- Success criteria:
  - You can justify where `race` is appropriate.

---

## 5) DOM Manipulation

Note: These exercises need an `index.html` that includes your `app.js`.

### Exercise 1 — Select & Change Content

- Goal: Read and update DOM text.
- Steps:
  1. Select a `<p>` by id; change its `textContent` and `innerHTML` (once each).
- Success criteria:
  - You can explain the difference between the two changes.

### Exercise 2 — Styles & Classes

- Goal: Modify CSS classes and styles.
- Steps:
  1. Toggle a class on button click; set an inline style (e.g., `backgroundColor`).
- Success criteria:
  - Class toggles; style updates visibly.

### Exercise 3 — Create & Remove Elements

- Goal: Build elements dynamically.
- Steps:
  1. Create a `<li>` with text from an input; append to a `<ul>`; add a remove button.
- Success criteria:
  - Items add and remove correctly; no page refresh required.

### Exercise 4 — Event Handling & preventDefault

- Goal: Handle form submit.
- Steps:
  1. On submit, `preventDefault`, read fields, validate, and render a message.
- Success criteria:
  - No page reload; error messages show near inputs.

### Exercise 5 — Event Delegation

- Goal: Handle many child events via a parent.
- Steps:
  1. On a `<ul>`, click to mark a `<li>` as done using event.target.
- Success criteria:
  - Works for existing and newly added items.

### Exercise 6 — Small Component

- Goal: Compose DOM reads/writes.
- Steps:
  1. Build a counter with +/− buttons and a span display.
- Success criteria:
  - State updates UI correctly; no global leaks.

---

## 6) Practice Projects (Pick any 3+ to complete)

### Exercise 1 — Color Changer

- Build a button that cycles a div’s color through a list.

### Exercise 2 — To‑Do List

- Add, toggle done, and delete tasks; persist to `localStorage`.

### Exercise 3 — Quiz App

- 5 questions with radio inputs; show score and correct answers at the end.

### Exercise 4 — String Tools

- Input box with live outputs: uppercase, reverse, length, word count.

### Exercise 5 — Counter with Persistence

- Counter with +/−/reset; load/save value from `localStorage`.

### Exercise 6 — Stopwatch

- Start/stop/reset; render elapsed time every 100ms.

Success criteria for projects:

- Clean UI updates, no console errors, and readable code structure.

---

## 7) Working with APIs

### Exercise 1 — Fetch GET

- Goal: Request data and render it.
- Steps:
  1. Fetch a public API (e.g., PokéAPI) and display a name/image.
- Success criteria:
  - Basic error state shown on failures.

### Exercise 2 — Handle JSON

- Goal: Parse and use JSON fields.
- Steps:
  1. Render a small table from a JSON response.
- Success criteria:
  - The right fields show up; layout is legible.

### Exercise 3 — Errors & Loading

- Goal: UX for async states.
- Steps:
  1. Show a loading spinner while fetching; show an error message on failure.
- Success criteria:
  - Buttons disabled while loading; clear messages for each state.

### Exercise 4 — Simulated POST

- Goal: Submit data and show a response.
- Steps:
  1. Post to `https://jsonplaceholder.typicode.com/posts` with a fake form.
- Success criteria:
  - Response JSON is printed; form clears on success.

### Exercise 5 — Pagination

- Goal: Render a paginated list from an API.
- Steps:
  1. Fetch a list; render page 1; add Next/Prev that request another page (or slice cached data).
- Success criteria:
  - Page indicator updates; boundaries handled at first/last page.

### Exercise 6 — Search Filter (Client‑side)

- Goal: Filter API results locally.
- Steps:
  1. After fetch, filter by a text input (case‑insensitive) and render matches.
- Success criteria:
  - Filtering is fast and robust for empty/whitespace input.
