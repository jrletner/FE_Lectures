# 10/02/25 — Angular Essentials, Part 3 (Short Walkthrough)

Angular 19.2.3, standalone. Topics: new control flow, lists, and lifecycle.

## Quick Start

```bash
npm install
npx ng serve --open
```

Use each component by importing it into `AppComponent` and placing its selector in the template.

---

## Exercise 1: New Control Flow — @if and @for

Goal: Filter items and show empty state using `@if` and `@for`.

<details>
<summary>Generate</summary>

```bash
ng g c filter-list --skip-tests
```

</details>

<details>
<summary>filter-list.component.ts</summary>

```typescript
import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

interface Item {
  id: number;
  name: string;
}

@Component({
  selector: "app-filter-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./filter-list.component.html",
})
export class FilterListComponent {
  q = signal("");
  items = signal<Item[]>([
    { id: 1, name: "Alpha" },
    { id: 2, name: "Beta" },
    { id: 3, name: "Gamma" },
  ]);
  filtered = computed(() =>
    this.items().filter((i) =>
      i.name.toLowerCase().includes(this.q().toLowerCase())
    )
  );
}
```

</details>

<details>
<summary>filter-list.component.html</summary>

```html
<input
  [value]="q()"
  (input)="q.set(($event.target as HTMLInputElement).value)"
  placeholder="Search"
/>

@if (filtered().length === 0) {
<p>No results</p>
} @else {
<ul>
  @for (it of filtered(); track it.id) {
  <li>{{ it.name }}</li>
  }
</ul>
}
```

</details>

---

## Exercise 2: Auth Block with @if / @else

Goal: Toggle a simple auth flag.

<details>
<summary>Generate</summary>

```bash
ng g c auth-block --skip-tests
```

</details>

<details>
<summary>auth-block.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-auth-block",
  standalone: true,
  templateUrl: "./auth-block.component.html",
})
export class AuthBlockComponent {
  loggedIn = signal(false);
}
```

</details>

<details>
<summary>auth-block.component.html</summary>

```html
<button (click)="loggedIn.update(v => !v)">Toggle Login</button>

@if (loggedIn()) {
<p>Welcome back!</p>
} @else {
<p>Please log in.</p>
}
```

</details>

---

## Exercise 3: Lifecycle — OnInit/OnDestroy

Goal: Start a timer on init; stop on destroy.

<details>
<summary>Generate</summary>

```bash
ng g c tick-timer --skip-tests
```

</details>

<details>
<summary>tick-timer.component.ts</summary>

```typescript
import { Component, OnDestroy, OnInit, signal } from "@angular/core";

@Component({
  selector: "app-tick-timer",
  standalone: true,
  templateUrl: "./tick-timer.component.html",
})
export class TickTimerComponent implements OnInit, OnDestroy {
  ticks = signal(0);
  private handle?: any;

  ngOnInit() {
    this.handle = setInterval(() => this.ticks.update((v) => v + 1), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.handle);
  }
}
```

</details>

<details>
<summary>tick-timer.component.html</summary>

```html
<p>Ticks: {{ ticks() }}</p>
```

</details>

---

## Exercise 4: Tabs (@for + active state)

Goal: Switch visible panel by clicking a tab.

<details>
<summary>Generate</summary>

```bash
ng g c mini-tabs --skip-tests
```

</details>

<details>
<summary>mini-tabs.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-mini-tabs",
  standalone: true,
  templateUrl: "./mini-tabs.component.html",
  styleUrl: "./mini-tabs.component.css",
})
export class MiniTabsComponent {
  tabs = ["Home", "Docs", "About"];
  active = signal("Home");
}
```

</details>

<details>
<summary>mini-tabs.component.html</summary>

```html
<div class="tabs">
  @for (t of tabs; track t) {
  <button [class.active]="active()===t" (click)="active.set(t)">{{ t }}</button>
  }
</div>

@if (active()==='Home') {
<p>Welcome.</p>
} @else if (active()==='Docs') {
<p>Read the docs.</p>
} @else {
<p>About us.</p>
}
```

</details>

<details>
<summary>mini-tabs.component.css</summary>

```css
.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}
button {
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}
button.active {
  background: #0ea5e9;
  color: #fff;
}
```

</details>

---

## Exercise 5: Todo List (@for + input/model pattern)

Goal: Add/remove todos with a count.

<details>
<summary>Generate</summary>

```bash
ng g c mini-todos --skip-tests
```

</details>

<details>
<summary>mini-todos.component.ts</summary>

```typescript
import { Component, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-mini-todos",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./mini-todos.component.html",
})
export class MiniTodosComponent {
  txt = signal("");
  todos = signal<string[]>([]);
  count = computed(() => this.todos().length);
  add() {
    const t = this.txt().trim();
    if (!t) return;
    this.todos.update((a) => [...a, t]);
    this.txt.set("");
  }
  remove(i: number) {
    this.todos.update((a) => a.filter((_, idx) => idx !== i));
  }
}
```

</details>

<details>
<summary>mini-todos.component.html</summary>

```html
<input
  [value]="txt()"
  (input)="txt.set(($event.target as HTMLInputElement).value)"
  placeholder="Add todo"
/>
<button (click)="add()">Add</button>

<ul>
  @for (t of todos(); let i = $index; track i) {
  <li>{{ t }} <button (click)="remove(i)">x</button></li>
  }
</ul>
<p>Total: {{ count() }}</p>
```

</details>

---

## Exercise 6: Rating Chips (@for + output)

Goal: Click a chip to select a rating and emit it.

<details>
<summary>Generate</summary>

```bash
ng g c rating-chips --skip-tests
```

</details>

<details>
<summary>rating-chips.component.ts</summary>

```typescript
import { Component, output, signal } from "@angular/core";

@Component({
  selector: "app-rating-chips",
  standalone: true,
  templateUrl: "./rating-chips.component.html",
  styleUrl: "./rating-chips.component.css",
})
export class RatingChipsComponent {
  rating = signal(0);
  ratingChange = output<number>();
  set(n: number) {
    this.rating.set(n);
    this.ratingChange.emit(n);
  }
}
```

</details>

<details>
<summary>rating-chips.component.html</summary>

```html
<div class="chips">
  @for (n of [1,2,3,4,5]; track n) {
  <button [class.on]="rating()>=n" (click)="set(n)">{{ n }}</button>
  }
</div>
```

</details>

<details>
<summary>rating-chips.component.css</summary>

```css
.chips {
  display: flex;
  gap: 6px;
}
button {
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}
button.on {
  background: #f59e0b;
  color: #fff;
}
```

</details>

---

## Exercise 7: Clock (lifecycle + setInterval)

Goal: Show time and clean up interval.

<details>
<summary>Generate</summary>

```bash
ng g c mini-clock --skip-tests
```

</details>

<details>
<summary>mini-clock.component.ts</summary>

```typescript
import { Component, OnDestroy, OnInit, signal } from "@angular/core";

@Component({
  selector: "app-mini-clock",
  standalone: true,
  template: `<p>{{ now() }}</p>`,
})
export class MiniClockComponent implements OnInit, OnDestroy {
  now = signal(new Date().toLocaleTimeString());
  private h?: any;
  ngOnInit() {
    this.h = setInterval(
      () => this.now.set(new Date().toLocaleTimeString()),
      1000
    );
  }
  ngOnDestroy() {
    clearInterval(this.h);
  }
}
```

</details>

---

## Exercise 8: Copy Button (attribute + state)

Goal: Copy a message to clipboard and show feedback.

<details>
<summary>Generate</summary>

```bash
ng g c copy-btn --skip-tests
```

</details>

<details>
<summary>copy-btn.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-copy-btn",
  standalone: true,
  template: `<button (click)="copy()">
    {{ done() ? "Copied!" : "Copy" }}
  </button>`,
})
export class CopyBtnComponent {
  done = signal(false);
  async copy() {
    await navigator.clipboard.writeText("Hello Angular");
    this.done.set(true);
    setTimeout(() => this.done.set(false), 1200);
  }
}
```

</details>
