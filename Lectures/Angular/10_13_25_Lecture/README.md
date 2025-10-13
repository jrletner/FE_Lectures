# Student Practice Walkthrough – RxJS Observables in Angular (Beginner Friendly)

## Before You Start: What Are Observables? (Plain English)

Observables are a way to represent values that arrive over time (like a stream). Instead of asking “what’s the value now?”, you say “call me whenever there’s a new value.” You subscribe to a stream, and you can transform it with small lego‑like functions (operators) such as map, filter, and debounceTime.

Simple rule of thumb:

- If a value can change multiple times (user typing, timers, HTTP responses), an Observable is a great fit.
- If you only need a one‑off value, a normal variable or a Promise can be simpler.

You will build TWO small exercises:

1. Reactive Search (manual Observable + operators)
2. Template Async Demo (displaying streams in the template via async pipe)

Each has explicit goals & checkpoints. Read the HINTS only if you get stuck.

---

## Prerequisites

Project created (e.g. `rxjs-intro`) and dev server running:

```bash
ng serve --open
```

If not created:

```bash
ng new rxjs-intro --skip-tests
cd rxjs-intro
```

---

## Part A: Reactive Search (Manual Observable + Operators)

Plain English: You’ll take what a user types and treat it like a “stream” of values. We’ll wait for them to pause (debounce), ignore repeats, and then run a tiny fake search that returns matching items. If they keep typing, the previous search is canceled and only the latest result shows. This is a gentle, practical tour of a Subject for input, a few core operators, and displaying the results with the async pipe.

Goal: Convert keystrokes into a debounced search stream; map to “fake results”; handle empty input and errors.

### A1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component reactive-search --skip-tests
```

</details>

Add selector `<app-reactive-search></app-reactive-search>` to your root template.

### A2. Component State & Streams

Create:

- An input model `query = ''` for two‑way binding
- A Subject `query$` to push user inputs
- An Observable `results$` that transforms `query$` with operators

Naming note: The trailing `$` is a common convention to signal “this is a stream/Observable.” It helps readers quickly tell streams (like `query$`, `results$`) apart from plain values (like `query`).

<details><summary><code>src/app/reactive-search/reactive-search.component.ts</code> (State & Stream skeleton)</summary>

```ts
// Two-way bound string for the input box (template updates this)
query = '';
// Subject is our push-based input stream of keystrokes
query$ = new Subject<string>();
// Results stream that the template will read with | async
results$!: Observable<string[]>; // filled in A3
```

</details>

Wire the `(input)` event to next values into `query$` and keep `[(ngModel)]` for the field.

### A3. Build the Pipeline

Use operators:

- `map` to trim the query
- `debounceTime(300)` to wait for pause in typing
- `distinctUntilChanged()` to skip repeats
- `switchMap(q => fakeSearch(q))` to simulate async lookups
- `catchError(() => of(['Error: try again']))` to recover

<details><summary><code>src/app/reactive-search/reactive-search.component.ts</code> (Pipeline)</summary>

```ts
ngOnInit() {
  // Build a stream pipeline that reacts to typed input
  this.results$ = this.query$.pipe(
    // Normalize input
    map(q => q.trim()),
    // Wait 300ms after the last keypress
    debounceTime(300),
    // Ignore duplicated values
    distinctUntilChanged(),
    // Cancel previous search and switch to the latest
    switchMap(q => this.fakeSearch(q)),
    // If anything throws, recover with a friendly message
    catchError(() => of(['Error: try again']))
  );
}
```

</details>

### A4. Fake Async Search Helper

Create a method that returns `of([...])` for non‑empty input and `of([])` for empty, with a small artificial delay.

<details><summary><code>src/app/reactive-search/reactive-search.component.ts</code> (Helper)</summary>

```ts
fakeSearch(q: string): Observable<string[]> {
  // Simulate an empty-query fast response
  if (!q) return of([]).pipe(delay(150));
  // Filter a tiny in-memory list
  const items = ['alpha','beta','gamma','delta'].filter(x => x.includes(q.toLowerCase()));
  // Simulate network latency
  return of(items).pipe(delay(250));
}
```

</details>

### A5. Template Markup

Requirements:

- Input bound to `query` and on `(input)` call `query$.next($any($event.target).value)`
- What `$any($event.target).value` means: `$event.target` is typed as `EventTarget` in templates (which doesn't expose `.value`). Wrapping with `$any(...)` tells Angular to treat it as an `HTMLInputElement` so accessing `.value` is type-safe in the template.
- Show “Type to search…” when empty, else render `results$ | async` list
- Show a loading indicator while debouncing (hint: separate `isTyping` signal or `tap`)

<details><summary><code>src/app/reactive-search/reactive-search.component.html</code> (Template)</summary>

```html
<div class="search-box">
  <!-- Two-way bind the input value; also push each keystroke into the Subject -->
  <input
    [(ngModel)]="query"
    (input)="query$.next($any($event.target).value)"
    placeholder="Search..."
  />
  <!-- Show a hint while the input is empty -->
  @if (!query.trim()) {
  <p class="muted">Type to search…</p>
  } @else {
  <!-- Render latest results emitted by results$ (unwrapped via | async) -->
  <ul>
    @for (item of (results$ | async) || []; track item) {
    <li>{{ item }}</li>
    }
  </ul>
  }
</div>
```

</details>

### A6. Style (Optional)

<details><summary><code>src/app/reactive-search/reactive-search.component.css</code></summary>

```css
.search-box {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
input {
  width: 100%;
  padding: 0.5rem;
}
.muted {
  color: #666;
  font-size: 0.85rem;
}
```

</details>

### A7. Run & Observe

Try:

- Typing slowly vs quickly to see debounce
- Repeating same query (shouldn’t refire)
- Clearing input (empty results)

### A8. Stretch (Optional)

Add a minimum length guard (ignore queries < 2) and show a hint. Also surface a transient “searching…” state using `tap` and a signal.

<details><summary><code>HINTS – reactive-search</code></summary>

Use `filter(q => q.length >= 2)` before `switchMap`. For a loading hint:

```ts
// Signal to flip on/off a small "searching..." message in the UI
isSearching = signal(false);

// Build a guarded search pipeline
this.results$ = this.query$.pipe(
  // 1) Trim whitespace from the typed value
  map((q) => q.trim()),
  // 2) Ignore very short queries (e.g., fewer than 2 chars)
  filter((q) => q.length >= 2),
  // 3) Wait for the user to pause typing
  debounceTime(300),
  // 4) Skip repeated values
  distinctUntilChanged(),
  // 5) Flip on the loading indicator right before we query
  tap(() => this.isSearching.set(true)),
  // 6) Cancel any in-flight search and switch to the newest
  switchMap((q) => this.fakeSearch(q)),
  // 7) Turn the loading indicator off when the search stream emits
  tap(() => this.isSearching.set(false))
);
```

</details>

---

## Part B: Template Async Demo (async pipe)

Plain English: You’ll show live‑updating values in the template without writing subscribe/unsubscribe code. One stream is a simple second counter, the other produces a new “quote” every couple of seconds. The async pipe unwraps the latest value for you and cleans up automatically when the component goes away. We’ll also add a toggle to start/stop the quote stream in the stretch.

Goal: Display an interval stream and a HTTP‑like stream in the template using `| async`, and demonstrate teardown when the component is destroyed.

### B1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component async-demo --skip-tests
```

</details>

Add selector `<app-async-demo></app-async-demo>` to root template.

### B2. Streams

Create two Observables:

- `tick$ = interval(1000).pipe(map(i => i + 1))`
- `quote$ = timer(500, 2000).pipe(map(i => `Quote #${i}`))`

<details><summary><code>src/app/async-demo/async-demo.component.ts</code> (Streams)</summary>

```ts
// A ticking counter: 1, 2, 3 ... every second
tick$ = interval(1000).pipe(map((i) => i + 1));
// A periodic value every 2s, starting after 500ms
quote$ = timer(500, 2000).pipe(map((i) => `Quote #${i}`));
```

</details>

### B3. Template Markup

Use `| async` to unwrap values and display them. Show a fallback while first value hasn’t arrived.

<details><summary><code>src/app/async-demo/async-demo.component.html</code> (Template)</summary>

```html
<section>
  <!-- Async pipe unwraps the ticking value each second -->
  <p>Seconds elapsed: <strong>{{ tick$ | async }}</strong></p>
  <!-- Async pipe unwraps the quote stream with a simple fallback before first emission -->
  <p>Latest quote: <em>{{ (quote$ | async) || 'Loading…' }}</em></p>
</section>
```

</details>

### B4. Style (Optional)

<details><summary><code>src/app/async-demo/async-demo.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
p {
  margin: 0.25rem 0;
}
```

</details>

### B5. Run & Observe

Observe that values update automatically and the component doesn’t need manual `subscribe()` when using `| async` in the template.

### B6. Stretch (Optional)

Add a button to start/stop the `quote$` stream using a `Subject<void>` gate and `switchMap` to `timer` when “on”, otherwise `of(null)`.

<details><summary><code>HINTS – async-demo</code></summary>

```ts
// Imperative input: when user clicks the button we push true/false here
private toggle$ = new Subject<boolean>();

// Signal mirroring current on/off state for display
on = signal(true);

// Gate the quote stream: when on=true start a periodic timer, else emit null
quote$ = this.toggle$.pipe(
  // Provide an initial value so the stream starts in the "on" state
  startWith(true),
  // Switch between a timer stream and a single null emission
  switchMap(on => on ? timer(0, 2000).pipe(map(i => `Quote #${i}`)) : of(null))
);

// Toggle handler: flip the signal and push the new state into the Subject
toggle() {
  this.on.set(!this.on());
  this.toggle$.next(this.on());
}
```

</details>

---

## Part C: Observer Object Demo (manual subscribe)

Plain English: Instead of using the async pipe, you’ll manually subscribe to an Observable with a full observer object that has next, error, and complete methods. You’ll see how to start/stop a stream, capture values into an array, and clean up the subscription when the component is destroyed.

Goal: Create a small countdown Observable and subscribe with an observer object, logging next/error/complete to the UI; add start/stop controls and ensure proper teardown.

### C1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component observer-demo --skip-tests
```

</details>

Add selector `<app-observer-demo></app-observer-demo>` to your root template.

### C2. Observable and Observer

Create a countdown stream and an observer object (with next/error/complete). Store log messages and current status for display.

<details><summary><code>src/app/observer-demo/observer-demo.component.ts</code> (Observable + observer)</summary>

```ts
// A simple countdown Observable that emits: 3, 2, 1, 0 then completes
// - interval(500) emits 0,1,2,... every 500ms
// - map turns it into start - i (e.g. 3-0, 3-1, ...)
// - take(start+1) ensures we stop after reaching 0 and then complete
countdown$(start: number = 3): Observable<number> {
  return interval(500).pipe(
    map((i) => start - i),
    take(start + 1)
  );
}

// Collected log messages shown in the UI
messages: string[] = [];
// Signal tracking the simple lifecycle state for friendly status text
status = signal<'idle' | 'running' | 'done' | 'error'>('idle');

// Observer object: how to handle next values, errors, and completion
observer = {
  // Called for each emitted value
  next: (val: number) => this.messages.push(`Next: ${val}`),
  // Called if the Observable errors
  error: (err: unknown) => {
    this.messages.push(`Error: ${String(err)}`);
    this.status.set('error');
  },
  // Called once when the Observable completes
  complete: () => {
    this.messages.push('Complete');
    this.status.set('done');
  },
};
```

</details>

### C3. Subscribe/Unsubscribe

Wire up start/stop methods and tear down in `ngOnDestroy`.

<details><summary><code>src/app/observer-demo/observer-demo.component.ts</code> (subscribe + teardown)</summary>

```ts
// Hold on to the subscription so we can cancel it
// Note: Subscription type comes from rxjs
subscription?: Subscription;

start(): void {
  // If already running, stop first (prevents overlap)
  this.stop();
  // Clear prior logs and move to running state
  this.messages = [];
  this.status.set('running');
  // Subscribe using the full observer object
  this.subscription = this.countdown$().subscribe(this.observer);
}

stop(): void {
  // Unsubscribe if active to avoid leaks and stop emissions
  if (this.subscription) {
    this.subscription.unsubscribe();
    this.subscription = undefined;
  }
  // If we didn't finish with done/error, return to idle
  if (this.status() !== 'done' && this.status() !== 'error') {
    this.status.set('idle');
  }
}

// Ensure we clean up when the component is destroyed
ngOnDestroy(): void {
  this.stop();
}
```

</details>

### C4. Template Markup

Show current status and a list of log messages. Provide Start/Stop buttons.

<details><summary><code>src/app/observer-demo/observer-demo.component.html</code> (Template)</summary>

```html
<section>
  <!-- Show the simple lifecycle status -->
  <p>Status: <strong>{{ status() }}</strong></p>
  <!-- Controls to start and stop the subscription -->
  <button (click)="start()">Start</button>
  <button (click)="stop()">Stop</button>
  <!-- Render each log line as it arrives -->
  <ul>
    @for (m of messages; track $index) {
    <li>{{ m }}</li>
    }
  </ul>
  <!-- Friendly contextual hints based on state -->
  @if (status() === 'idle') {
  <p class="muted">Press Start to run the countdown</p>
  } @if (status() === 'running') {
  <p class="muted">Counting…</p>
  } @if (status() === 'done') {
  <p class="muted">Done!</p>
  } @if (status() === 'error') {
  <p class="muted" style="color:#c62828">Error occurred</p>
  }
</section>
```

</details>

### C5. Style (Optional)

<details><summary><code>src/app/observer-demo/observer-demo.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
button {
  margin-right: 0.5rem;
}
.muted {
  color: #666;
  font-size: 0.85rem;
}
```

</details>

### C6. Run & Observe

- Click Start: messages should show Next: 3, Next: 2, Next: 1, Next: 0, then Complete.
- Click Stop during the run: subscription is cleaned up; status returns to idle.
- Refresh: component starts idle (no running subscriptions).

### C7. Stretch (Optional)

Make the countdown start value configurable with an input box; add an error path (e.g., throw if start > 9) to see the observer’s error handler.

<details><summary><code>HINTS – observer-demo</code></summary>

```ts
// Add a text input bound to startValue, parse it to number, validate range
// If start is too large, throw an error to trigger the observer.error handler
startValue = 3;
countdown$(start: number = this.startValue): Observable<number> {
  if (start > 9) return throwError(() => new Error('Max 9'));
  // Same countdown pipeline: emit start, start-1, ... 0 then complete
  return interval(500).pipe(
    map((i) => start - i),
    take(start + 1)
  );
}
```

</details>

---

Happy streaming! 🚀

---

## Part D: Template Control Flow (legacy → modern)

Plain English: You’ll build a tiny list demo twice: first using the legacy structural directives (*ngIf with an else template and *ngFor), then using the modern control flow blocks (@if/@else and @for/@empty). This helps you see the one‑to‑one mapping between old and new syntax.

Goal: Show a non‑empty and empty state of a list using both syntaxes; understand how @if/@for replace the legacy forms.

### D1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component control-flow-demo --skip-tests
```

</details>

Add selector `<app-control-flow-demo></app-control-flow-demo>` to your root template.

### D2. Component State

Create a small array with helpers to add and clear items. Use a simple trackBy function.

<details><summary><code>src/app/control-flow-demo/control-flow-demo.component.ts</code> (State)</summary>

```ts
// Simple list state for demonstrating control flow
items: string[] = ['apple', 'banana', 'cherry'];

// Push a new item if provided
add(item: string) {
  if (item) this.items = [...this.items, item];
}

// Reset the list to empty
clear() {
  this.items = [];
}

// Stable identity for legacy *ngFor trackBy
trackItem(index: number, item: string) {
  return item;
}
```

</details>

### D3. Legacy Template: *ngIf with else + *ngFor

Use an `ng-template` for the else branch and the classic `*ngFor`.

<details><summary><code>src/app/control-flow-demo/control-flow-demo.component.html</code> (Legacy)</summary>

```html
<section>
  <!-- Controls -->
  <input #newItem placeholder="Add item" />
  <button (click)="add(newItem.value); newItem.value = ''">Add</button>
  <button (click)="clear()">Clear</button>

  <!-- Show list if not empty, else show the template below -->
  <ng-container *ngIf="items.length > 0; else emptyTpl">
    <ul>
      <!-- Legacy *ngFor with trackBy -->
      <li *ngFor="let item of items; trackBy: trackItem">{{ item }}</li>
    </ul>
  </ng-container>

  <!-- Else content for legacy *ngIf -->
  <ng-template #emptyTpl>
    <p class="muted">No items (legacy else)</p>
  </ng-template>
</section>
```

</details>

### D4. Modern Template: @if/@else + @for/@empty

Under the Legacy code, add the same UI using the modern blocks.

<details><summary><code>src/app/control-flow-demo/control-flow-demo.component.html</code> (Modern)</summary>

```html
<section>
  <!-- Controls -->
  <input #newItem placeholder="Add item" />
  <button (click)="add(newItem.value); newItem.value = ''">Add</button>
  <button (click)="clear()">Clear</button>

  <!-- at if with at else replaces *ngIf + ng-template else -->
  @if (items.length > 0) {
  <ul>
    <!-- at for replaces *ngFor; at empty provides an inline empty state -->
    @for (item of items; track item) {
    <li>{{ item }}</li>
    }
  </ul>
  } @else {
  <p class="muted">No items (modern at if at else)</p>
  }

  <!-- Alternatively, use at for with an at empty block -->
  <h4>at for with at empty</h4>
  <ul>
    @for (item of items; track item) {
    <li>{{ item }}</li>
    } @empty {
    <li class="muted">No items (at empty)</li>
    }
  </ul>
</section>
```

</details>

### D5. Style (Optional)

<details><summary><code>src/app/control-flow-demo/control-flow-demo.component.css</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
input {
  margin-right: 0.5rem;
}
button {
  margin-right: 0.5rem;
}
.muted {
  color: #666;
  font-size: 0.85rem;
}
```

</details>

### D6. Run & Observe

- Add a few items; clear the list; re‑add items and compare legacy vs modern blocks.
- Press Clear to empty the array and observe the @empty block render the empty state in the modern example.
- Note how `@if/@for` are more compact and keep empty content inline.
- You will see two empty-state messages under the Modern section when the list is empty—one from the `@if/@else` example and one from the `@for/@empty` example. That’s intentional for side-by-side comparison. If you want to show only one, remove either the `@if/@else` block or the `@for/@empty` block.

### D7. Stretch (Optional)

Add a toggle to sort items alphabetically before display. Hint: derive a `sortedItems` getter or Signal and iterate that in both legacy and modern examples.

<details><summary><code>HINTS – control-flow-demo</code></summary>

```ts
// Derive a sorted view for display without mutating source array
get sortedItems(): string[] {
  return [...this.items].sort((a, b) => a.localeCompare(b));
}
```

In the template, replace `items` with `sortedItems` in both the legacy `*ngFor` and modern `@for` examples.

</details>

---

## Final Code (No Comments) – Copy/Paste Reference

### Part A — Reactive Search

<details><summary><code>src/app/reactive-search/reactive-search.component.ts (final)</code></summary>

```ts
import { Component, signal, OnInit } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Observable, Subject, of } from "rxjs";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  delay,
  filter,
  tap,
} from "rxjs/operators";

@Component({
  selector: "app-reactive-search",
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: "./reactive-search.component.html",
  styleUrl: "./reactive-search.component.css",
})
export class ReactiveSearchComponent implements OnInit {
  query = "";
  isSearching = signal(false);
  query$ = new Subject<string>();
  results$!: Observable<string[]>;

  ngOnInit() {
    this.results$ = this.query$.pipe(
      map((q) => q.trim()),
      filter((q) => q.length >= 2),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isSearching.set(true)),
      switchMap((q) => this.fakeSearch(q)),
      tap(() => this.isSearching.set(false)),
      catchError(() => of(["Error: try again"]))
    );
  }

  fakeSearch(q: string): Observable<string[]> {
    if (!q) return of([]).pipe(delay(150));
    const items = ["alpha", "beta", "gamma", "delta"].filter((x) =>
      x.includes(q.toLowerCase())
    );
    return of(items).pipe(delay(250));
  }
}
```

</details>

<details><summary><code>src/app/reactive-search/reactive-search.component.html (final)</code></summary>

```html
<div class="search-box">
  <input
    [(ngModel)]="query"
    (input)="query$.next($any($event.target).value)"
    placeholder="Search..."
  />
  @if (!query.trim()) {
  <p class="muted">Type to search…</p>
  } @else { @if (isSearching()) {
  <p class="muted">Searching…</p>
  }
  <ul>
    @for (item of (results$ | async) || []; track item) {
    <li>{{ item }}</li>
    }
  </ul>
  }
</div>
```

</details>

<details><summary><code>src/app/reactive-search/reactive-search.component.css (final)</code></summary>

```css
.search-box {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
input {
  width: 100%;
  padding: 0.5rem;
}
.muted {
  color: #666;
  font-size: 0.85rem;
}
```

</details>

### Part B — Async Demo

<details><summary><code>src/app/async-demo/async-demo.component.ts (final)</code></summary>

```ts
import { Component, signal } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { interval, timer, of, Subject } from "rxjs";
import { map, switchMap, startWith } from "rxjs/operators";

@Component({
  selector: "app-async-demo",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./async-demo.component.html",
  styleUrl: "./async-demo.component.css",
})
export class AsyncDemoComponent {
  tick$ = interval(1000).pipe(map((i) => i + 1));
  on = signal(true);
  private toggle$ = new Subject<boolean>();
  quote$ = this.toggle$.pipe(
    startWith(true),
    switchMap((on) =>
      on ? timer(500, 2000).pipe(map((i) => `Quote #${i}`)) : of(null)
    )
  );
  toggle() {
    this.on.set(!this.on());
    this.toggle$.next(this.on());
  }
}
```

</details>

<details><summary><code>src/app/async-demo/async-demo.component.html (final)</code></summary>

```html
<section>
  <p>Seconds elapsed: <strong>{{ tick$ | async }}</strong></p>
  <p>Latest quote: <em>{{ (quote$ | async) || 'Loading…' }}</em></p>
  <button (click)="toggle()">Toggle Quotes</button>
  <p class="muted">Quotes on: {{ on() }}</p>
</section>
```

</details>

<details><summary><code>src/app/async-demo/async-demo.component.css (final)</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
p {
  margin: 0.25rem 0;
}
button {
  margin-top: 0.5rem;
}
.muted {
  color: #666;
  font-size: 0.85rem;
}
```

</details>

### Part C — Observer Demo

<details><summary><code>src/app/observer-demo/observer-demo.component.ts (final)</code></summary>

```ts
import { Component, OnDestroy, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { interval, Observable, Subscription, throwError } from "rxjs";
import { map, take } from "rxjs/operators";

@Component({
  selector: "app-observer-demo",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./observer-demo.component.html",
  styleUrl: "./observer-demo.component.css",
})
export class ObserverDemoComponent implements OnDestroy {
  messages: string[] = [];
  status = signal<"idle" | "running" | "done" | "error">("idle");
  subscription?: Subscription;
  startValue = 3;

  countdown$(start: number = this.startValue): Observable<number> {
    if (start > 9) return throwError(() => new Error("Max 9"));
    return interval(500).pipe(
      map((i) => start - i),
      take(start + 1)
    );
  }

  observer = {
    next: (val: number) => this.messages.push(`Next: ${val}`),
    error: (err: unknown) => {
      this.messages.push(`Error: ${String(err)}`);
      this.status.set("error");
    },
    complete: () => {
      this.messages.push("Complete");
      this.status.set("done");
    },
  };

  start(): void {
    this.stop();
    this.messages = [];
    this.status.set("running");
    this.subscription = this.countdown$(this.startValue).subscribe(
      this.observer
    );
  }

  stop(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    if (this.status() !== "done" && this.status() !== "error") {
      this.status.set("idle");
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
```

</details>

<details><summary><code>src/app/observer-demo/observer-demo.component.html (final)</code></summary>

```html
<section>
  <label>
    Start value (0-9):
    <input type="number" [(ngModel)]="startValue" min="0" max="9" />
  </label>
  <p>Status: <strong>{{ status() }}</strong></p>
  <button (click)="start()">Start</button>
  <button (click)="stop()">Stop</button>
  <ul>
    @for (m of messages; track $index) {
    <li>{{ m }}</li>
    }
  </ul>
  @if (status() === 'idle') {
  <p class="muted">Press Start to run the countdown</p>
  } @if (status() === 'running') {
  <p class="muted">Counting…</p>
  } @if (status() === 'done') {
  <p class="muted">Done!</p>
  } @if (status() === 'error') {
  <p class="muted" style="color:#c62828">Error occurred</p>
  }
</section>
```

</details>

<details><summary><code>src/app/observer-demo/observer-demo.component.css (final)</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
button {
  margin-right: 0.5rem;
}
.muted {
  color: #666;
  font-size: 0.85rem;
}
```

</details>

### Part D — Control Flow Demo

<details><summary><code>src/app/control-flow-demo/control-flow-demo.component.ts (final)</code></summary>

```ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-control-flow-demo",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./control-flow-demo.component.html",
  styleUrl: "./control-flow-demo.component.css",
})
export class ControlFlowDemoComponent {
  items: string[] = ["apple", "banana", "cherry"];
  showSorted = false;

  add(item: string) {
    if (item) this.items = [...this.items, item];
  }

  clear() {
    this.items = [];
  }

  trackItem(index: number, item: string) {
    return item;
  }

  get sortedItems(): string[] {
    return [...this.items].sort((a, b) => a.localeCompare(b));
  }

  get viewItems(): string[] {
    return this.showSorted ? this.sortedItems : this.items;
  }

  toggleSort() {
    this.showSorted = !this.showSorted;
  }
}
```

</details>

<details><summary><code>src/app/control-flow-demo/control-flow-demo.component.html (final)</code></summary>

```html
<section>
  <h3>Legacy: *ngIf with else + *ngFor</h3>
  <input #newItem placeholder="Add item" />
  <button (click)="add(newItem.value); newItem.value = ''">Add</button>
  <button (click)="clear()">Clear</button>
  <button (click)="toggleSort()">Toggle Sort</button>
  <p class="muted">Sorted: {{ showSorted ? 'on' : 'off' }}</p>

  <ng-container *ngIf="items.length > 0; else emptyTpl">
    <ul>
      <li *ngFor="let item of viewItems; trackBy: trackItem">{{ item }}</li>
    </ul>
  </ng-container>
  <ng-template #emptyTpl>
    <p class="muted">No items (legacy else)</p>
  </ng-template>

  <hr />

  <h3>Modern: &#64;if/&#64;else + &#64;for/&#64;empty</h3>
  @if (items.length > 0) {
  <ul>
    @for (item of viewItems; track item) {
    <li>{{ item }}</li>
    }
  </ul>
  } @else {
  <p class="muted">No items (modern &#64;if &#64;else)</p>
  }

  <h4>&#64;for with &#64;empty</h4>
  <ul>
    @for (item of viewItems; track item) {
    <li>{{ item }}</li>
    } @empty {
    <li class="muted">No items (&#64;empty)</li>
    }
  </ul>
</section>
```

</details>

<details><summary><code>src/app/control-flow-demo/control-flow-demo.component.css (final)</code></summary>

```css
section {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
input {
  margin-right: 0.5rem;
}
button {
  margin-right: 0.5rem;
}
.muted {
  color: #666;
  font-size: 0.85rem;
}
```

</details>
