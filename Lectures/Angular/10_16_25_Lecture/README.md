# Student Practice Walkthrough – Angular Signals Advanced

## Before You Start: What Are Signals? (Plain English)

Imagine a tiny box that holds a value (like a number or a word). That box is a signal. You look inside the box by “calling” it like `count()`. You change what’s inside with `set(newValue)` or tweak it with `update(old => new)`. When the thing in the box changes, the screen updates by itself.

When to use the tiny box:

- You have a small piece of info on the page (a counter, a form field, a toggle) and the page should change when it changes.
- If you have many values arriving over time (like a chat stream), keep using Observables. Signals and Observables can be friends and work together.

Why this is useful: Your app shows fresh info right away without you telling it to redraw.

You will build 10 small demos:

- Part A — Creating and updating your first signal
- Part B — Deriving state with computed signals
- Part C — Deriving state with linked signals
- Part D — Managing async data with signals using the Resources API
- Part E — Passing data to components with input signals
- Part F — Two-way binding with model signals
- Part G — Using signals with services
- Part H — Using signals with directives
- Part I — Query child elements with signal queries
- Part J — Reacting to signal changes with effects
- Bonus - Drag and Drop using signals

Each has explicit goals & checkpoints. Read the HINTS only if you get stuck.

---

## Prerequisites

Project created (e.g. `signals-intro`) and dev server running:

```bash
ng serve --open
```

If not created:

```bash
ng new advanced-signals --skip-tests
cd advanced-signals
```

Notes:

- Angular version: examples assume Angular 19.2.3 with standalone components.
- Some APIs like Resources are developer preview as of Angular 19.2.3; see notes in that section.

---

## Part A: Creating and Updating Your First Signal

Plain English: A signal is a tiny box that holds a value, like a number. You peek inside by calling it (like `count()`). You change it with `set(...)` or `update(...)`. When the value changes, the page updates all by itself. Great for simple things like counters and on/off switches.
Why this is useful: Your page updates itself when the value changes, so you write less code.

Goal: Create a `count` signal, show it in the template, and wire increment/decrement/reset.

### A1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component signal-counter --skip-tests
```

</details>

Add selector `<app-signal-counter></app-signal-counter>` to your root template.

### A2. Component State

Create a `count = signal(0)` with increment/decrement/reset helpers.

<details><summary><code>src/app/signal-counter/signal-counter.component.ts</code> (State)</summary>

```ts
// Create a signal named `count` that starts at 0
count = signal(0);

// Define a method called `inc` that increases the count by 1
inc() {
  // Read the current value `v` and return the next value `v + 1`
  this.count.update(v => v + 1);
}

// Define a method called `dec` that decreases the count by 1
dec() {
  // Read the current value `v` and return the next value `v - 1`
  this.count.update(v => v - 1);
}

// Define a method called `reset` that sets the count back to 0
reset() {
  // Replace the current value with 0
  this.count.set(0);
}
```

</details>

### A3. Template Markup

Render the current value with `{{ count() }}` and wire buttons.

<details><summary><code>src/app/signal-counter/signal-counter.component.html</code> (Template)</summary>

```html
<!-- Wrap the counter UI in a semantic section -->
<section>
  <!-- Show the current count by calling the signal like a function -->
  <p>Count: <strong>{{ count() }}</strong></p>

  <!-- Button that calls dec() to subtract 1 from the count -->
  <button (click)="dec()">-</button>
  <!-- Button that calls inc() to add 1 to the count -->
  <button (click)="inc()">+</button>
  <!-- Button that calls reset() to set the count back to 0 -->
  <button (click)="reset()">Reset</button>
</section>
```

</details>

### A4. Style (Optional)

<details><summary><code>src/app/signal-counter/signal-counter.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
button {
  margin-right: 0.5rem;
}
```

</details>

---

### A5. Run and Observe

- Place `<app-signal-counter></app-signal-counter>` in your root template.
- Start the dev server if needed:

```bash
ng serve --open
```

- Expected: A counter showing 0 with “-”, “+”, and “Reset” buttons. Clicking updates the number instantly.

---

## Part B: Deriving State with Computed Signals

Plain English: A computed value is like a simple rule. If we have a first name and a last name, the rule puts them together. When either name changes, the full name changes by itself. We read it like another box: `fullName()`.
Why this is useful: You don’t have to manually keep combined values in sync.

Goal: Create `first` and `last` signals, and a `fullName = computed(...)` that derives from both.

### B1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component computed-demo --skip-tests
```

</details>

### B2. Component State

Use `signal()` for inputs and `computed()` for derived.

<details><summary><code>src/app/computed-demo/computed-demo.component.ts</code> (State)</summary>

```ts
// Create a writable signal named "first" and start it with "Ada"
first = signal("Ada");
// Create a writable signal named "last" and start it with "Lovelace"
last = signal("Lovelace");

// Create a computed signal named "fullName"
// It reads first() and last(), joins them with a space, and trims extra spaces
// Whenever first() or last() changes, this computed value updates itself
fullName = computed(() => `${this.first()} ${this.last()}`.trim());
```

</details>

### B3. Template Markup

Two inputs bound with `[(ngModel)]` and a derived display.

Note: When binding with `[(ngModel)]`, you bind to the signal itself (no `()`), because Angular wires updates into the signal for you. When reading to display, you call the signal like a function with `()` to get its current value (e.g., `fullName()`).

<details><summary><code>src/app/computed-demo/computed-demo.component.html</code> (Template)</summary>

```html
<!-- Wrap the computed demo in a section -->
<section>
  <!-- Two-way bind the input box to the "first" signal -->
  <label>First: <input [(ngModel)]="first" /></label>
  <!-- Two-way bind the input box to the "last" signal -->
  <label>Last: <input [(ngModel)]="last" /></label>

  <!-- Read the computed signal fullName() and show it on the page -->
  <p>Full name: <strong>{{ fullName() }}</strong></p>
</section>
```

</details>

---

### B4. Run and Observe

- Place `<app-computed-demo></app-computed-demo>` in your root template.
- Expected: Typing first/last names updates the derived `fullName()` line immediately.

---

## Part C: Deriving State with Linked Signals

Plain English: Linked signals are like having the same money in two wallets: one counts cents, the other shows dollars. When you change dollars, cents changes too. When cents change, dollars change. We tell Angular how to convert both ways.
Why this is useful: Two related values stay matched automatically.

Plain English: What can we do with a linked signal?

- Read: Call it like a function to get the current “view” value (e.g., `price()` shows dollars).
- Write: In this lesson’s code, we implement writing by adding a small setter method that converts dollars back to cents.
- Update: You can still transform before writing (e.g., clamp or round) inside that setter.
- Read-only mode: If you only use a computed value without a setter, it’s read-only (great for formatting-only views).
- Binding tip: Because the dollars view is computed (read-only), we bind `[ngModel]` to `price()` and handle writes with `(ngModelChange)` calling our setter.

Goal: Start with a base `priceCents = signal(1299)` and expose a linked `price` that reads as dollars (`12.99`) and writes back in cents.

### C1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component linked-demo --skip-tests
```

</details>

### C2. Component State

Create a base signal in cents and a linked signal that maps read/write.

<details><summary><code>src/app/linked-demo/linked-demo.component.ts</code> (State)</summary>

```ts
// Make a base signal named "priceCents" that stores the true value in cents
priceCents = signal(1299);

// Make a computed view named "price" that shows dollars as a string
price = computed(() => (this.priceCents() / 100).toFixed(2));

// When someone changes the dollars string, convert it back to cents
setPrice(dollars: string) {
  // Turn the input string into a number
  const n = Number(dollars);
  // If it’s not a real number, do nothing
  if (!Number.isFinite(n)) return;
  // Store the rounded cents in priceCents (e.g., 12.99 -> 1299)
  this.priceCents.set(Math.round(n * 100));
}
```

</details>

### C3. Template Markup

Show both forms and edit the dollars view.

<details><summary><code>src/app/linked-demo/linked-demo.component.html</code> (Template)</summary>

```html
<!-- Wrap the linked signals demo -->
<section>
  <!-- Show the true stored value in cents -->
  <p>Base (cents): {{ priceCents() }}</p>
  <!-- Edit the dollars view; bind read to price() and write with setPrice($event) -->
  <label>
    Dollars: <input [ngModel]="price()" (ngModelChange)="setPrice($event)" />
  </label>
  <!-- Show the current dollars view from the linked signal -->
  <p>Preview: ${{ price() }}</p>
</section>
```

</details>

---

### C4. Run and Observe

- Place `<app-linked-demo></app-linked-demo>` in your root template.
- Expected: You see base cents and a dollars input. Editing dollars updates cents via `setPrice(...)`; changes reflect in the preview.

---

## Part D: Managing Async Data with the Resources API (Preview)

Plain English: A resource helps us talk to the internet. While we wait, it can say “Loading…”. If something goes wrong, it shows an error. If it works, it gives us the data. When we type a new name, it fetches again by itself.
Why this is useful: One place handles loading, errors, and data so your UI stays tidy.

Plain English: What can we read from a resource?

- user.isLoading(): Think of this like a “busy light.” It’s true while we’re waiting for the answer, and false when we’re done.
- user.error(): If something went wrong, this gives us an Error object (with a message). If everything is fine, it’s undefined.
- user.value(): When the request succeeds, this holds the data we asked for (like the user profile). If we don’t have data yet, it’s undefined.

Goal: Show `isLoading`, `error`, and the loaded `value` without manual subscribe/teardown.

Preview note: Resources are a developer preview as of Angular 19.2.3. If you see build warnings, that’s expected; for production apps, prefer stable patterns (e.g., HttpClient + signals or Observables).

### D1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component resource-demo --skip-tests
```

</details>

### D2. Component State

Create a small input for username and a Resource that reloads when it changes.

<details><summary><code>src/app/resource-demo/resource-demo.component.ts</code> (State)</summary>

```ts
// Make a signal named "username" that holds the GitHub handle we will load
username = signal("angular");

// Make a resource named "user" that tracks loading, error, and value
user = resource({
  // Tell the resource to re-run whenever username() changes
  request: () => ({ user: this.username() }),

  // Define how to load the data from the network (async function)
  loader: async ({ request }) => {
    // Ask GitHub for user info using the current username
    const res = await fetch(`https://api.github.com/users/${request.user}`);
    // If the server says it failed (not OK), throw an error to be caught by the resource
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // Otherwise, return the JSON body; this becomes user.value()
    return res.json();
  },
});

// Helper to turn any error shape into a readable message for the template
getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
    return (err as any).message as string;
  }
  return String(err ?? 'Unknown error');
}
```

</details>

### D3. Template Markup

Use `user.isLoading()`, `user.error()`, and `user.value()` to render.

<details><summary><code>src/app/resource-demo/resource-demo.component.html</code> (Template)</summary>

```html
<!-- Wrap the resource demo UI -->
<section>
  <!-- Two-way bind the input to the username signal; changing it will refetch -->
  <label>Username: <input [(ngModel)]="username" /></label>

  <!-- If it's loading, show a loading message -->
  @if (user.isLoading()) {
  <p class="muted">Loading…</p>
  }
  <!-- If there was an error, show the error message -->
  @else if (user.error()) {
  <p class="error">Error: {{ getErrorMessage(user.error()) }}</p>
  }
  <!-- If we have a value, show basic user info -->
  @else {
  <p>
    <strong>{{ user.value()?.login }}</strong> – {{ user.value()?.name || 'No
    name' }}
  </p>
  }
</section>
```

</details>

---

### D4. Run and Observe

- Place `<app-resource-demo></app-resource-demo>` in your root template.
- Expected: Typing a GitHub username triggers loading, then shows either profile info or a readable error message.

---

## Part E: Passing Data with Input Signals

Plain English: A parent can hand a child some words, like a title. The child reads them with `title()` and shows them. If the parent changes the words, the child updates right away.
Why this is useful: Parents can change what children show and it updates instantly.

Goal: Build a `card` component that takes `title` and `subtitle` as input signals and renders them.

### E1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component input-card --skip-tests
```

</details>

### E2. Component State

Define input signals with defaults.

<details><summary><code>src/app/input-card/input-card.component.ts</code> (State)</summary>

```ts
// Make an input signal named "title"; if parent doesn't pass one, use "Untitled"
title = input("Untitled");
// Make an input signal named "subtitle"; default it to an empty string
subtitle = input("");
```

</details>

### E3. Template Markup

Render `title()` and `subtitle()`.

<details><summary><code>src/app/input-card/input-card.component.html</code> (Template)</summary>

```html
<!-- Card wrapper for the input demo -->
<section class="card">
  <!-- Read the title input signal and render its current value -->
  <h3>{{ title() }}</h3>
  <!-- Only show the subtitle paragraph if subtitle() is not empty -->
  @if (subtitle()) {
  <p class="muted">{{ subtitle() }}</p>
  }
  <!-- Slot any extra content the parent provides between the tags -->
  <ng-content />
</section>
```

</details>

---

### E4. Run and Observe

- Place `<app-input-card title="'Hello'" subtitle="'From parent'">Projected content</app-input-card>` in your root template.
- Expected: The card renders the title, optional subtitle (if provided), and projects any inner content.

---

## Part F: Two-way Binding with Model Signals

Plain English: `model()` is like a shared toy. The parent and the child both hold it. When the child changes it, the parent sees the new value. When the parent changes it, the child sees it too. No extra wires needed.
Why this is useful: Parent and child stay in sync without extra wiring.

Goal: Build a `name-input` child with `value = model('')`, and a parent that binds `[(value)]` to a signal.

### F1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component name-input --skip-tests
```

</details>

### F2. Child State

Use `model()` to create the two-way model signal.

<details><summary><code>src/app/name-input/name-input.component.ts</code> (Child)</summary>

```ts
// Make a model signal named "value" so parent can two-way bind via [(value)]
value = model("");
```

</details>

### F3. Child Template

Bind the input to the model signal directly.

<details><summary><code>src/app/name-input/name-input.component.html</code> (Child Template)</summary>

```html
<!-- Bind two-way directly to the model signal named value -->
<input [(ngModel)]="value" placeholder="Type your name" />
```

</details>

### F4. Parent Usage

Parent holds `name = signal('')` and binds with `[(value)]="name"`.

<details><summary><code>src/app/app.component.html</code> (Parent usage example)</summary>

```html
<!-- Two-way bind the parent's "name" signal to the child's model "value" -->
<app-name-input [(value)]="name"></app-name-input>
<!-- Read the parent's name() and greet; fall back to 'anonymous' if empty -->
<p>Hello, {{ name() || 'anonymous' }}!</p>
```

</details>

<details><summary><code>src/app/app.component.ts</code> (Parent state + imports)</summary>

```ts
// Import signal for the parent state and the child component to use in the template
import { Component, signal } from "@angular/core";
import { NameInputComponent } from "./name-input/name-input.component";

@Component({
  selector: "app-root",
  standalone: true,
  // Ensure the child is available in this template
  imports: [NameInputComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  // Parent signal that two-way binds to the child's model()
  name = signal("");
}
```

</details>

---

### F5. Run and Observe

- Place the child and greeting example in your root template:

```html
<app-name-input [(value)]="name"></app-name-input>
<p>Hello, {{ name() || 'anonymous' }}!</p>
```

- Expected: Typing in the child input updates the parent `name` signal and the greeting live.

---

## Part G: Using Signals with Services

Plain English: A service is like a backpack that many components can share. The backpack holds the number. Buttons tell the backpack to add or subtract. Everyone looking at the backpack sees the same number.
Why this is useful: Many components can share and update the same state.

Goal: A `CounterService` with `count = signal(0)` and methods `inc/dec/reset`, consumed by a component.

### G1. Generate Service / Component

<details><summary>Commands</summary>

```bash
ng g service counter --skip-tests
ng g component service-counter --skip-tests
```

</details>

### G2. Service

<details><summary><code>src/app/counter.service.ts</code> (Service)</summary>

```ts
// Mark this class as a service that Angular can inject anywhere
@Injectable({ providedIn: "root" })
export class CounterService {
  // Shared writable signal that holds the current count
  count = signal(0);

  // Increase the shared count by 1
  inc() {
    this.count.update((v) => v + 1);
  }

  // Decrease the shared count by 1
  dec() {
    this.count.update((v) => v - 1);
  }

  // Reset the shared count back to 0
  reset() {
    this.count.set(0);
  }
}
```

</details>

### G3. Component

<details><summary><code>src/app/service-counter/service-counter.component.ts</code> (Component)</summary>

```ts
// Bring in the shared CounterService so we can use its signal and methods
svc = inject(CounterService);
```

</details>

<details><summary><code>src/app/service-counter/service-counter.component.html</code> (Template)</summary>

```html
<!-- Wrap the service demo -->
<section>
  <!-- Read the service-owned signal and display it -->
  <p>Shared count: <strong>{{ svc.count() }}</strong></p>
  <!-- Call the service methods to change the shared signal -->
  <button (click)="svc.dec()">-</button>
  <button (click)="svc.inc()">+</button>
  <button (click)="svc.reset()">Reset</button>
</section>
```

</details>

---

### G4. Run and Observe

- Place `<app-service-counter></app-service-counter>` in your root template (optionally add two instances).
- Expected: Buttons update a shared count from the service; multiple instances stay in sync.

---

## Part H: Using Signals with Directives

Plain English: A directive is like a sticker you put on an element to give it powers. The sticker doesn’t make new HTML; it just makes the thing it’s on do something special.
Why this is useful: Add behavior anywhere without making a new component.

Clear definition (Angular 19.2.3) — Plain English:

- A component is a special directive that brings its own mini page (a template and maybe styles).
- A plain directive has no mini page; it sticks to an existing element and changes how it looks or acts.
- Two kinds exist:
  - Attribute directives: stickers that change style or behavior (classes, styles, listeners, attributes).
  - Structural directives: stickers that add/remove/repeat pieces of the page (like the built-in control flow `@if`, `@for`).

Why use directives?

- Reuse the same behavior across many elements without wrapping them in extra components.
- Keep DOM-side concerns (styling, attributes, listeners) encapsulated and testable.
- Compose cleanly with any component—just add the attribute.

With signals in Angular 19.2.3, directives can also be reactive: define an input signal with `input()` and react in an `effect()` to manipulate the host element (e.g., styles or attributes). When the input signal changes, the directive updates automatically, and Angular cleans it up when the directive is destroyed.

Goal: A `highlight` directive with a reactive `color` input that updates `style.backgroundColor` when it changes.

### H1. Generate Directive

<details><summary>Commands</summary>

```bash
ng g directive highlight --skip-tests --selector=appHighlight
ng g component highlight-demo --skip-tests
```

</details>

### H2. Directive State

Use `input()` to define an input signal and `effect()` to react.

<details><summary><code>src/app/highlight.directive.ts</code> (Directive)</summary>

```ts
// Make an input signal named "color" that controls the host element's background
color = input('yellow', { alias: 'appHighlight' });

// The constructor gives us access to the host element via ElementRef
constructor(private el: ElementRef) {
  // Set up a reactive effect that runs whenever color() changes
  effect(() => {
    // Apply the current color to the host element's background
    (this.el.nativeElement as HTMLElement).style.backgroundColor = this.color();
  });
}
```

</details>

### H3. Use in a Component

<details><summary><code>src/app/highlight-demo/highlight-demo.component.html</code> (Template)</summary>

```html
<!-- Apply the directive to this paragraph and pass a color value -->
<p [appHighlight]="'lightgoldenrodyellow'">Reactive highlight</p>
```

</details>

---

### H4. Run and Observe

- Place `<app-highlight-demo></app-highlight-demo>` in your root template.
- Expected: The paragraph displays with a highlighted background color. Adjust the directive input in code to see it react.

---

## Part I: Query Child Elements with Signal Queries

Plain English: `viewChild` is like a pointer to a thing on the page. When the thing shows up, the pointer points to it. We watch it with an effect and then do something, like focus the input.
Why this is useful: Do things like focus right when the element is ready.

Plain English: What’s with the angle brackets `<...>` after ElementRef?

- Those brackets are types. `ElementRef<HTMLHeadingElement>` means “this ref points to an `<h1-6>` heading,” so `nativeElement` is typed as a real heading element. `ElementRef<HTMLInputElement>` means “this ref points to an `<input>`,” so you can safely call `focus()` and read `value` without guessing.
- Why it helps: Better auto-complete, fewer mistakes. TypeScript warns you if you try to use a method that doesn’t exist on that element.
- Required vs optional query: `viewChild.required<...>('title')` says the element must exist; if it doesn’t, Angular will complain early. Plain `viewChild<...>('name')` can be `undefined` until it appears, so we check for it before using it.

Goal: Grab a heading element and focus a text input on init.

### I1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component query-demo --skip-tests
```

</details>

### I2. Component State

Create signal queries and react in an effect.

<details><summary><code>src/app/query-demo/query-demo.component.ts</code> (State)</summary>

```ts
// Signal-based element reference to the <h2 #title>
titleEl = viewChild.required<ElementRef<HTMLHeadingElement>>('title');
// Signal-based element reference to the <input #name>
inputEl = viewChild<ElementRef<HTMLInputElement>>('name');

constructor() {
  // When the input element becomes available, focus it once
  effect(() => {
    // Read the current ElementRef (or undefined if not ready)
    const el = this.inputEl();
    // If we have it, call focus() on the native input element
    if (el) el.nativeElement.focus();
  });
}
```

</details>

### I3. Template Markup

Use template refs `#title` and `#name`.

<details><summary><code>src/app/query-demo/query-demo.component.html</code> (Template)</summary>

```html
<!-- Give the heading a template ref name so viewChild can find it -->
<h2 #title>Welcome</h2>
<!-- Give the input a template ref name; effect() will focus this -->
<input #name placeholder="Focus lands here" />
```

</details>

---

### I4. Run and Observe

- Place `<app-query-demo></app-query-demo>` in your root template.
- Expected: When the component renders, the input automatically receives focus via the signal query and effect.

---

## Part J: Reacting to Changes with Effects

Plain English: An effect is a rule that runs when something it watches changes. We can start things like a timer. `onCleanup` is like putting toys back: it stops the old timer before we start a new one.
Why this is useful: React to changes and clean up so nothing keeps running by accident.

Plain English: What happens in the constructor?

- We create an effect that watches `value()`.
- Every time `value()` changes, the effect runs:
  - It logs the current value.
  - It starts a 1-second timer that logs a tick.
- Before the effect runs again (or when the component goes away), `onCleanup` stops the previous timer so we never have multiple timers piling up.

Goal: Log changes to a signal and set up a timer that cleans up when the effect re-runs or the component is destroyed.

### J1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component effect-demo --skip-tests
```

</details>

### J2. Component State

Create a signal, a method to update it, and an effect that logs and manages a timer.

<details><summary><code>src/app/effect-demo/effect-demo.component.ts</code> (State + effect)</summary>

```ts
// Make a writable signal named "value" to drive the effect
value = signal(0);

// Helper method that increases value() by 1
bump() { this.value.update(v => v + 1); }

constructor() {
  // Create a side-effect that runs whenever value() changes
  effect((onCleanup) => {
    // Log the current value to the console
    console.log('value is', this.value());
    // Start a timer that logs a "tick" every second
    const id = setInterval(() => console.log('tick', Date.now()), 1000);
    // Make sure to stop the previous timer before starting a new one
    onCleanup(() => clearInterval(id));
  });
}
```

</details>

### J3. Template Markup

<details><summary><code>src/app/effect-demo/effect-demo.component.html</code> (Template)</summary>

```html
<!-- Wrap the effect demo UI -->
<section>
  <!-- Show the current value by calling the signal like a function -->
  <p>Value: <strong>{{ value() }}</strong></p>
  <!-- Clicking this calls bump(), which increases value() by 1 -->
  <button (click)="bump()">Bump</button>
</section>
```

</details>

---

### J4. Run and Observe

- Place `<app-effect-demo></app-effect-demo>` in your root template.
- Expected: Open DevTools Console to see logs for the current value and a 1-second tick. Clicking “Bump” changes the value and restarts the timer cleanly.

---

## Bonus Exercise: Drag and Drop User Roles (HTML5 DnD + Signals)

Plain English: We have a list of people. We can pick up a name and drop it into a bucket: Admin or Basic User. If we don’t drop it into a bucket, it stays Unassigned. Signals keep the lists fresh as we move names around.
Why this is useful: It shows how signals make the UI update right away when state changes, even with drag-and-drop.

Plain English: What’s the event we use for drag-and-drop?

- It’s a DragEvent. It carries a `dataTransfer` backpack where we can store and read simple text.
- On `dragstart`, we call `ev.dataTransfer.setData('text/plain', id)` to remember which user we grabbed, and set `effectAllowed = 'move'` to hint what kind of drag this is.
- On `dragover`, we call `ev.preventDefault()` to tell the browser “dropping here is allowed,” and we set `dropEffect = 'move'` to show the right cursor.
- On `drop`, we call `ev.preventDefault()`, pull the id back out with `getData('text/plain')`, and update the user’s role based on the bucket.

Plain English: How is this part of the DOM?

- DragEvent is a built-in browser event (part of the DOM). Elements on the page fire these events during a drag-and-drop.
- Angular doesn’t invent a new event system here—it listens to the browser’s native events. When you write `(dragstart)="..."` or `(drop)="..."`, Angular is wiring your handler to the real DOM event.
- Like other DOM events, DragEvent travels through the page (capture → target → bubble). We don’t need to manage that here, but it explains why multiple elements can react if you want them to.
- `preventDefault()` tells the browser to allow dropping on that element (by default many elements don’t accept drops), so your handler can run and update your app state.

Plain English: What does a DragEvent look like?

Here’s a simplified shape you’ll see in your handler:

```
DragEvent {
  type: 'dragstart' | 'dragover' | 'drop',
  target: HTMLElement,         // where the event happened
  currentTarget: HTMLElement,  // element whose handler is running
  dataTransfer: {
    setData(format: string, data: string): void,
    getData(format: string): string,
    effectAllowed: 'none' | 'copy' | 'move' | 'link' | 'copyMove' | 'all',
    dropEffect: 'none' | 'copy' | 'move' | 'link',
  } | null,
  defaultPrevented: boolean,   // true if preventDefault() was called
  preventDefault(): void,      // stop default behavior (needed to allow drop)
  clientX: number,             // mouse x position (useful for custom UIs)
  clientY: number,             // mouse y position
}
```

- type: tells you which phase you’re in (dragstart/dragover/drop).
- target/currentTarget: useful if the listener is attached on a parent.
- dataTransfer: where you store/read the payload and hint allowed effects.
- defaultPrevented/preventDefault(): shows whether you allowed the drop.
- clientX/clientY: the cursor position—handy for advanced visuals.

Tip: Want to see a real one? Add `console.log(ev)` inside your `(dragstart)` or `(drop)` handler and check your browser DevTools. That printed object is the live DragEvent the browser sent to your app.

Type safety: Why do we get access to these fields? Because the event is typed as a `DragEvent` from the browser’s DOM library. In Angular, when you write a handler like `onDrop(ev: DragEvent)`, TypeScript knows `ev.dataTransfer`, `ev.preventDefault()`, `ev.dropEffect`, etc., and gives you IntelliSense and compile-time checks. Template bindings like `(dragstart)` and `(drop)` also map `$event` to the native `DragEvent`, so you get the same typed access.

Goal: Create a `role-board` component with three buckets (Unassigned, Admin, Basic User). Drag names to change their role.

### Bonus1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component role-board --skip-tests
```

</details>

### Bonus2. Component State

Use signals to hold users where each user has a numeric `role`: 0 = Unassigned, 1 = Admin, 2 = Basic. Use helpers for drag-and-drop.

<details><summary><code>src/app/role-board/role-board.component.ts</code> (State + helpers)</summary>

```ts
// Keep a list of users. Each user stores their role as a number.
// 0 = Unassigned, 1 = Admin, 2 = Basic
users = signal<readonly { id: number; name: string; role: 0 | 1 | 2 }[]>([
  // Start with four unassigned users
  { id: 1, name: 'Ada Lovelace', role: 0 },
  { id: 2, name: 'Linus Torvalds', role: 0 },
  { id: 3, name: 'Grace Hopper', role: 0 },
  { id: 4, name: 'Margaret Hamilton', role: 0 },
]);

// Make computed buckets that group users by their numeric role
unassigned = computed(() => this.users().filter((u) => u.role === 0));
admins = computed(() => this.users().filter((u) => u.role === 1));
basics = computed(() => this.users().filter((u) => u.role === 2));

// When a drag starts, remember which user ID is being dragged
onDragStart(ev: DragEvent, id: number) {
  // Stash the id as plain text so we can read it on drop
  ev.dataTransfer?.setData('text/plain', String(id));
  // Indicate we intend to move the item
  if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
}

// Allow a drop by preventing the default browser behavior
allowDrop(ev: DragEvent) {
  ev.preventDefault();
  // Show a move cursor while dragging over this zone
  if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
}

// When dropped on a bucket, set that user's role based on the bucket
onDrop(ev: DragEvent, bucket: 'admin' | 'basic' | 'unassigned') {
  // Stop the browser from opening the dragged data
  ev.preventDefault();
  // Read back the user id we stored during drag start
  const data = ev.dataTransfer?.getData('text/plain');
  // If there's no id, do nothing
  if (!data) return;
  // Convert the string into a number
  const id = Number(data);
  // Convert the bucket name to the numeric role value
  const newRole: 0 | 1 | 2 = bucket === 'admin' ? 1 : bucket === 'basic' ? 2 : 0;
  // Update just the matching user with the new role, keep others the same
  this.users.update((curr) =>
    curr.map((u) => (u.id === id ? { ...u, role: newRole } : u))
  );
}
```

</details>

### Bonus3. Template Markup

Three columns act as drop zones. Each user item is draggable.

<details><summary><code>src/app/role-board/role-board.component.html</code> (Template)</summary>

```html
<!-- Whole board area with three drop zones -->
<section class="board">
  <!-- Legend: show what each badge color means -->
  <div class="legend">
    <span class="badge unassigned">Unassigned</span>
    <span class="badge admin">Admin</span>
    <span class="badge basic">Basic User</span>
  </div>

  <!-- Unassigned bucket: drop here to set role to 0 (Unassigned) -->
  <div
    class="column"
    (dragover)="allowDrop($event)"
    (drop)="onDrop($event, 'unassigned')"
  >
    <!-- Show how many users are currently unassigned -->
    <h3>Unassigned ({{ unassigned().length }})</h3>
    <ul>
      <!-- Loop through unassigned users. Each <li> is draggable. -->
      @for (u of unassigned(); track u.id) {
      <!-- Start dragging this user and carry their id with the event -->
      <li draggable="true" (dragstart)="onDragStart($event, u.id)">
        <!-- Small badge to indicate the list -->
        <span class="badge unassigned">U</span>
        <!-- Show the user's name -->
        {{ u.name }}
      </li>
      }
    </ul>
  </div>

  <!-- Admin bucket: drop here to set role to 1 (Admin) -->
  <div
    class="column"
    (dragover)="allowDrop($event)"
    (drop)="onDrop($event, 'admin')"
  >
    <!-- Show how many users are admins -->
    <h3>Admin ({{ admins().length }})</h3>
    <ul>
      <!-- List all admin users as draggable items -->
      @for (u of admins(); track u.id) {
      <li draggable="true" (dragstart)="onDragStart($event, u.id)">
        <span class="badge admin">A</span>
        {{ u.name }}
      </li>
      }
    </ul>
  </div>

  <!-- Basic User bucket: drop here to set role to 2 (Basic) -->
  <div
    class="column"
    (dragover)="allowDrop($event)"
    (drop)="onDrop($event, 'basic')"
  >
    <!-- Show how many users are basic users -->
    <h3>Basic User ({{ basics().length }})</h3>
    <ul>
      <!-- List all basic users as draggable items -->
      @for (u of basics(); track u.id) {
      <li draggable="true" (dragstart)="onDragStart($event, u.id)">
        <span class="badge basic">B</span>
        {{ u.name }}
      </li>
      }
    </ul>
  </div>
</section>
```

</details>

### Bonus4. Style (Optional)

<details><summary><code>src/app/role-board/role-board.component.css</code></summary>

```css
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.legend {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.badge {
  display: inline-block;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  font-size: 0.75rem;
  line-height: 1;
  border: 1px solid transparent;
}
.badge.unassigned {
  background: #eef2f7;
  color: #334155;
  border-color: #cbd5e1;
}
.badge.admin {
  background: #fde68a;
  color: #92400e;
  border-color: #f59e0b;
}
.badge.basic {
  background: #bbf7d0;
  color: #166534;
  border-color: #22c55e;
}
.column {
  border: 1px dashed #ccc;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  min-height: 240px;
  background: #fafafa;
}
.column h3 {
  margin-top: 0;
}
li[draggable="true"] {
  list-style: none;
  margin: 0.25rem 0;
  padding: 0.5rem 0.6rem;
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  cursor: grab;
}
```

</details>

Tip: Add `<app-role-board></app-role-board>` to your root template to see it.

### Bonus5. Run and Observe

- Place `<app-role-board></app-role-board>` in your root template.
- Expected: Drag a person from Unassigned into Admin or Basic; badges and counts update immediately. Drag back to Unassigned to reset.
- Optional: Add `console.log(ev)` inside `(dragstart)` or `(drop)` to inspect the live `DragEvent` in DevTools.

---

## Final Code (No Comments) – Reference

### Part A — signal-counter (Final Code)

<details><summary><code>src/app/signal-counter/signal-counter.component.ts</code></summary>

```ts
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-signal-counter",
  standalone: true,
  templateUrl: "./signal-counter.component.html",
  styleUrl: "./signal-counter.component.css",
})
export class SignalCounterComponent {
  count = signal(0);
  inc() {
    this.count.update((v) => v + 1);
  }
  dec() {
    this.count.update((v) => v - 1);
  }
  reset() {
    this.count.set(0);
  }
}
```

</details>

<details><summary><code>src/app/signal-counter/signal-counter.component.html</code></summary>

```html
<section>
  <p>Count: <strong>{{ count() }}</strong></p>
  <button (click)="dec()">-</button>
  <button (click)="inc()">+</button>
  <button (click)="reset()">Reset</button>
</section>
```

</details>

<details><summary><code>src/app/signal-counter/signal-counter.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
button {
  margin-right: 0.5rem;
}
```

</details>

---

### Part B — computed-demo (Final Code)

<details><summary><code>src/app/computed-demo/computed-demo.component.ts</code></summary>

```ts
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-computed-demo",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./computed-demo.component.html",
  styleUrl: "./computed-demo.component.css",
})
export class ComputedDemoComponent {
  first = signal("Ada");
  last = signal("Lovelace");
  fullName = computed(() => `${this.first()} ${this.last()}`.trim());
}
```

</details>

<details><summary><code>src/app/computed-demo/computed-demo.component.html</code></summary>

```html
<section>
  <label>First: <input [(ngModel)]="first" /></label>
  <label>Last: <input [(ngModel)]="last" /></label>
  <p>Full name: <strong>{{ fullName() }}</strong></p>
</section>
```

</details>

<details><summary><code>src/app/computed-demo/computed-demo.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
label {
  display: block;
  margin: 0.25rem 0;
}
```

</details>

---

### Part C — linked-demo (Final Code)

<details><summary><code>src/app/linked-demo/linked-demo.component.ts</code></summary>

```ts
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-linked-demo",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./linked-demo.component.html",
  styleUrl: "./linked-demo.component.css",
})
export class LinkedDemoComponent {
  priceCents = signal(1299);
  price = computed(() => (this.priceCents() / 100).toFixed(2));

  setPrice(dollars: string) {
    const n = Number(dollars);
    if (!Number.isFinite(n)) return;
    this.priceCents.set(Math.round(n * 100));
  }
}
```

</details>

<details><summary><code>src/app/linked-demo/linked-demo.component.html</code></summary>

```html
<section>
  <p>Base (cents): {{ priceCents() }}</p>
  <label
    >Dollars: <input [ngModel]="price()" (ngModelChange)="setPrice($event)"
  /></label>
  <p>Preview: ${{ price() }}</p>
</section>
```

</details>

<details><summary><code>src/app/linked-demo/linked-demo.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
```

</details>

---

### Part D — resource-demo (Final Code)

<details><summary><code>src/app/resource-demo/resource-demo.component.ts</code></summary>

```ts
import { Component, resource, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-resource-demo",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./resource-demo.component.html",
  styleUrl: "./resource-demo.component.css",
})
export class ResourceDemoComponent {
  username = signal("angular");
  user = resource({
    request: () => ({ user: this.username() }),
    loader: async ({ request }) => {
      const res = await fetch(`https://api.github.com/users/${request.user}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  });

  getErrorMessage(err: unknown): string {
    if (
      err &&
      typeof err === "object" &&
      "message" in err &&
      typeof (err as any).message === "string"
    ) {
      return (err as any).message as string;
    }
    return String(err ?? "Unknown error");
  }
}
```

</details>

<details><summary><code>src/app/resource-demo/resource-demo.component.html</code></summary>

```html
<section>
  <label>Username: <input [(ngModel)]="username" /></label>
  @if (user.isLoading()) {
  <p class="muted">Loading…</p>
  } @else if (user.error()) {
  <p class="error">Error: {{ getErrorMessage(user.error()) }}</p>
  } @else {
  <p>
    <strong>{{ user.value()?.login }}</strong> – {{ user.value()?.name || 'No
    name' }}
  </p>
  }
</section>
```

</details>

<details><summary><code>src/app/resource-demo/resource-demo.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
.muted {
  color: #666;
  font-size: 0.85rem;
}
.error {
  color: #c62828;
}
```

</details>

---

### Part E — input-card (Final Code)

<details><summary><code>src/app/input-card/input-card.component.ts</code></summary>

```ts
import { Component, input } from "@angular/core";

@Component({
  selector: "app-input-card",
  standalone: true,
  templateUrl: "./input-card.component.html",
  styleUrl: "./input-card.component.css",
})
export class InputCardComponent {
  title = input("Untitled");
  subtitle = input("");
}
```

</details>

<details><summary><code>src/app/input-card/input-card.component.html</code></summary>

```html
<section class="card">
  <h3>{{ title() }}</h3>
  @if (subtitle()) {
  <p class="muted">{{ subtitle() }}</p>
  }
  <ng-content />
</section>
```

</details>

<details><summary><code>src/app/input-card/input-card.component.css</code></summary>

```css
.card {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
.muted {
  color: #666;
  font-size: 0.85rem;
}
```

</details>

---

### Part F — name-input (Final Code)

<details><summary><code>src/app/name-input/name-input.component.ts</code></summary>

```ts
import { Component, model } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-name-input",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./name-input.component.html",
  styleUrl: "./name-input.component.css",
})
export class NameInputComponent {
  value = model("");
}
```

</details>

<details><summary><code>src/app/name-input/name-input.component.html</code></summary>

```html
<input [(ngModel)]="value" placeholder="Type your name" />
```

</details>

<details><summary><code>src/app/name-input/name-input.component.css</code></summary>

```css
input {
  padding: 0.5rem;
}
```

</details>

<details><summary><code>src/app/app.component.ts</code></summary>

```ts
import { Component, signal } from "@angular/core";
import { NameInputComponent } from "./name-input/name-input.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [NameInputComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  name = signal("");
}
```

</details>

<details><summary><code>src/app/app.component.html</code> (parent usage)</summary>

```html
<app-name-input [(value)]="name"></app-name-input>
<p>Hello, {{ name() || 'anonymous' }}!</p>
```

</details>

---

### Part G — CounterService + service-counter (Final Code)

<details><summary><code>src/app/counter.service.ts</code></summary>

```ts
import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CounterService {
  count = signal(0);
  inc() {
    this.count.update((v) => v + 1);
  }
  dec() {
    this.count.update((v) => v - 1);
  }
  reset() {
    this.count.set(0);
  }
}
```

</details>

<details><summary><code>src/app/service-counter/service-counter.component.ts</code></summary>

```ts
import { Component, inject } from "@angular/core";
import { CounterService } from "../counter.service";

@Component({
  selector: "app-service-counter",
  standalone: true,
  templateUrl: "./service-counter.component.html",
  styleUrl: "./service-counter.component.css",
})
export class ServiceCounterComponent {
  svc = inject(CounterService);
}
```

</details>

<details><summary><code>src/app/service-counter/service-counter.component.html</code></summary>

```html
<section>
  <p>Shared count: <strong>{{ svc.count() }}</strong></p>
  <button (click)="svc.dec()">-</button>
  <button (click)="svc.inc()">+</button>
  <button (click)="svc.reset()">Reset</button>
</section>
```

</details>

<details><summary><code>src/app/service-counter/service-counter.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
button {
  margin-right: 0.5rem;
}
```

</details>

---

### Part H — highlight directive + demo (Final Code)

<details><summary><code>src/app/highlight.directive.ts</code></summary>

```ts
import { Directive, ElementRef, effect, input } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
  standalone: true,
})
export class HighlightDirective {
  color = input("yellow", { alias: "appHighlight" });
  constructor(private el: ElementRef) {
    effect(() => {
      (this.el.nativeElement as HTMLElement).style.backgroundColor =
        this.color();
    });
  }
}
```

</details>

<details><summary><code>src/app/highlight-demo/highlight-demo.component.ts</code></summary>

```ts
import { Component } from "@angular/core";
import { HighlightDirective } from "../highlight.directive";

@Component({
  selector: "app-highlight-demo",
  standalone: true,
  imports: [HighlightDirective],
  templateUrl: "./highlight-demo.component.html",
  styleUrl: "./highlight-demo.component.css",
})
export class HighlightDemoComponent {}
```

</details>

<details><summary><code>src/app/highlight-demo/highlight-demo.component.html</code></summary>

```html
<p [appHighlight]="'lightgoldenrodyellow'">Reactive highlight</p>
```

</details>

<details><summary><code>src/app/highlight-demo/highlight-demo.component.css</code></summary>

```css
p {
  padding: 0.5rem;
}
```

</details>

---

### Part I — query-demo (Final Code)

<details><summary><code>src/app/query-demo/query-demo.component.ts</code></summary>

```ts
import { Component, ElementRef, effect, viewChild } from "@angular/core";

@Component({
  selector: "app-query-demo",
  standalone: true,
  templateUrl: "./query-demo.component.html",
  styleUrl: "./query-demo.component.css",
})
export class QueryDemoComponent {
  titleEl = viewChild.required<ElementRef<HTMLHeadingElement>>("title");
  inputEl = viewChild<ElementRef<HTMLInputElement>>("name");

  constructor() {
    effect(() => {
      const el = this.inputEl();
      if (el) el.nativeElement.focus();
    });
  }
}
```

</details>

<details><summary><code>src/app/query-demo/query-demo.component.html</code></summary>

```html
<h2 #title>Welcome</h2>
<input #name placeholder="Focus lands here" />
```

</details>

<details><summary><code>src/app/query-demo/query-demo.component.css</code></summary>

```css
input {
  padding: 0.5rem;
}
```

</details>

---

### Part J — effect-demo (Final Code)

<details><summary><code>src/app/effect-demo/effect-demo.component.ts</code></summary>

```ts
import { Component, effect, signal } from "@angular/core";

@Component({
  selector: "app-effect-demo",
  standalone: true,
  templateUrl: "./effect-demo.component.html",
  styleUrl: "./effect-demo.component.css",
})
export class EffectDemoComponent {
  value = signal(0);
  bump() {
    this.value.update((v) => v + 1);
  }

  constructor() {
    effect((onCleanup) => {
      console.log("value is", this.value());
      const id = setInterval(() => console.log("tick", Date.now()), 1000);
      onCleanup(() => clearInterval(id));
    });
  }
}
```

</details>

<details><summary><code>src/app/effect-demo/effect-demo.component.html</code></summary>

```html
<section>
  <p>Value: <strong>{{ value() }}</strong></p>
  <button (click)="bump()">Bump</button>
</section>
```

</details>

<details><summary><code>src/app/effect-demo/effect-demo.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
button {
  margin-top: 0.5rem;
}
```

</details>

---

### Bonus Exercise — role-board (Final Code)

<details><summary><code>src/app/role-board/role-board.component.ts</code></summary>

```ts
import { Component, computed, signal } from "@angular/core";

@Component({
  selector: "app-role-board",
  standalone: true,
  templateUrl: "./role-board.component.html",
  styleUrl: "./role-board.component.css",
})
export class RoleBoardComponent {
  users = signal<readonly { id: number; name: string; role: 0 | 1 | 2 }[]>([
    { id: 1, name: "Ada Lovelace", role: 0 },
    { id: 2, name: "Linus Torvalds", role: 0 },
    { id: 3, name: "Grace Hopper", role: 0 },
    { id: 4, name: "Margaret Hamilton", role: 0 },
  ]);

  unassigned = computed(() => this.users().filter((u) => u.role === 0));
  admins = computed(() => this.users().filter((u) => u.role === 1));
  basics = computed(() => this.users().filter((u) => u.role === 2));

  onDragStart(ev: DragEvent, id: number) {
    ev.dataTransfer?.setData("text/plain", String(id));
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = "move";
  }
  allowDrop(ev: DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
  }
  onDrop(ev: DragEvent, bucket: "admin" | "basic" | "unassigned") {
    ev.preventDefault();
    const data = ev.dataTransfer?.getData("text/plain");
    if (!data) return;
    const id = Number(data);
    const newRole: 0 | 1 | 2 =
      bucket === "admin" ? 1 : bucket === "basic" ? 2 : 0;
    this.users.update((curr) =>
      curr.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  }
}
```

</details>

<details><summary><code>src/app/role-board/role-board.component.html</code></summary>

```html
<section class="board">
  <div class="legend">
    <span class="badge unassigned">Unassigned</span>
    <span class="badge admin">Admin</span>
    <span class="badge basic">Basic User</span>
  </div>
  <div
    class="column"
    (dragover)="allowDrop($event)"
    (drop)="onDrop($event, 'unassigned')"
  >
    <h3>Unassigned ({{ unassigned().length }})</h3>
    <ul>
      @for (u of unassigned(); track u.id) {
      <li draggable="true" (dragstart)="onDragStart($event, u.id)">
        <span class="badge unassigned">U</span>
        {{ u.name }}
      </li>
      }
    </ul>
  </div>

  <div
    class="column"
    (dragover)="allowDrop($event)"
    (drop)="onDrop($event, 'admin')"
  >
    <h3>Admin ({{ admins().length }})</h3>
    <ul>
      @for (u of admins(); track u.id) {
      <li draggable="true" (dragstart)="onDragStart($event, u.id)">
        <span class="badge admin">A</span>
        {{ u.name }}
      </li>
      }
    </ul>
  </div>

  <div
    class="column"
    (dragover)="allowDrop($event)"
    (drop)="onDrop($event, 'basic')"
  >
    <h3>Basic User ({{ basics().length }})</h3>
    <ul>
      @for (u of basics(); track u.id) {
      <li draggable="true" (dragstart)="onDragStart($event, u.id)">
        <span class="badge basic">B</span>
        {{ u.name }}
      </li>
      }
    </ul>
  </div>
</section>
```

</details>

<details><summary><code>src/app/role-board/role-board.component.css</code></summary>

```css
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.legend {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.badge {
  display: inline-block;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  font-size: 0.75rem;
  line-height: 1;
  border: 1px solid transparent;
}
.badge.unassigned {
  background: #eef2f7;
  color: #334155;
  border-color: #cbd5e1;
}
.badge.admin {
  background: #fde68a;
  color: #92400e;
  border-color: #f59e0b;
}
.badge.basic {
  background: #bbf7d0;
  color: #166534;
  border-color: #22c55e;
}
.column {
  border: 1px dashed #ccc;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  min-height: 240px;
  background: #fafafa;
}
.column h3 {
  margin-top: 0;
}
li[draggable="true"] {
  list-style: none;
  margin: 0.25rem 0;
  padding: 0.5rem 0.6rem;
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  cursor: grab;
}
```

</details>
