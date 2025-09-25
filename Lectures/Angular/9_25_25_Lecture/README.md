# Angular Signals — Live‑Coding Mini Exercises (9/25/25)

These tiny demos introduce signals, signal inputs, signal outputs, and model() in Angular 19.2.3. Each exercise has:

- A plain‑language intro
- Angular CLI command(s) to generate files
- Three short files (TS/HTML/CSS) in collapsible sections

Use these to live‑code quickly (2–4 minutes each).

---

## Exercise 1: Counter (signals)

Plain‑language goal:

- Make a number that remembers its value (a signal)
- Show that number on the page
- Add buttons to change it up, down, or reset

<details>
<summary>Generate with Angular CLI</summary>

```bash
# From your Angular workspace root
ng g c counter-signal --standalone --skip-tests
```

</details>

<details>
<summary>counter-signal.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";

@Component({
  selector: "app-counter-signal",
  standalone: true,
  templateUrl: "./counter-signal.component.html",
  styleUrl: "./counter-signal.component.css",
})
export class CounterSignalComponent {
  count = signal(0);

  inc() {
    this.count.update((c) => c + 1);
  }
  dec() {
    this.count.update((c) => c - 1);
  }
  reset() {
    this.count.set(0);
  }
}
```

</details>

<details>
<summary>counter-signal.component.html</summary>

```html
<div class="counter">
  <div class="value">{{ count() }}</div>
  <div class="actions">
    <button (click)="dec()">–</button>
    <button (click)="reset()">Reset</button>
    <button (click)="inc()">+</button>
  </div>
  <small>Signals automatically update the UI when their value changes.</small>
</div>
```

</details>

<details>
<summary>counter-signal.component.css</summary>

```css
.counter {
  display: inline-block;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.value {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}
.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
button {
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}
```

</details>

---

## Exercise 2: Color Badge (signal input)

Plain‑language goal:

- Build a child component that takes a color from its parent
- Show a badge using that color
- Demonstrate signal inputs replacing `@Input()`

<details>
<summary>Generate with Angular CLI</summary>

```bash
# Child component
ng g c color-badge --standalone --skip-tests

# Optional parent demo component
ng g c color-demo --standalone --skip-tests
```

</details>

<details>
<summary>color-badge.component.ts</summary>

```typescript
import { Component, input } from "@angular/core";

@Component({
  selector: "app-color-badge",
  standalone: true,
  templateUrl: "./color-badge.component.html",
  styleUrl: "./color-badge.component.css",
})
export class ColorBadgeComponent {
  color = input.required<string>();
}
```

</details>

<details>
<summary>color-badge.component.html</summary>

```html
<span class="badge" [style.background-color]="color()">{{ color() }}</span>
```

</details>

<details>
<summary>color-badge.component.css</summary>

```css
.badge {
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}
```

</details>

Parent usage (example):

<details>
<summary>color-demo.component.ts</summary>

```typescript
import { Component } from "@angular/core";
import { ColorBadgeComponent } from "./color-badge/color-badge.component";

@Component({
  selector: "app-color-demo",
  standalone: true,
  imports: [ColorBadgeComponent],
  templateUrl: "./color-demo.component.html",
})
export class ColorDemoComponent {}
```

</details>

<details>
<summary>color-demo.component.html</summary>

```html
<app-color-badge [color]="'tomato'"></app-color-badge>
<app-color-badge [color]="'royalblue'"></app-color-badge>
```

</details>

---

## Exercise 3: Like Button (signal output)

Plain‑language goal:

- Make a heart button that toggles liked/unliked
- Emit the new liked value to the parent
- Demonstrate signal outputs replacing `@Output()`

<details>
<summary>Generate with Angular CLI</summary>

```bash
# Child like button and parent demo
ng g c like-button --standalone --skip-tests
ng g c parent-like-demo --standalone --skip-tests
```

</details>

<details>
<summary>like-button.component.ts</summary>

```typescript
import { Component, signal, output } from "@angular/core";

@Component({
  selector: "app-like-button",
  standalone: true,
  templateUrl: "./like-button.component.html",
  styleUrl: "./like-button.component.css",
})
export class LikeButtonComponent {
  isLiked = signal(false);
  likeChanged = output<boolean>();

  toggle() {
    this.isLiked.update((v) => !v);
    this.likeChanged.emit(this.isLiked());
  }
}
```

</details>

<details>
<summary>like-button.component.html</summary>

```html
<button (click)="toggle()" [class.liked]="isLiked()">
  {{ isLiked() ? '❤️ Liked' : '🤍 Like' }}
</button>
```

</details>

<details>
<summary>like-button.component.css</summary>

```css
button {
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}
button.liked {
  background: #ff69b4;
  color: white;
}
```

</details>

Parent usage (example):

<details>
<summary>parent-like-demo.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";
import { LikeButtonComponent } from "./like-button.component";

@Component({
  selector: "app-parent-like-demo",
  standalone: true,
  imports: [LikeButtonComponent],
  templateUrl: "./parent-like-demo.component.html",
})
export class ParentLikeDemoComponent {
  lastLiked = signal<boolean | null>(null);
  onLikeChanged(liked: boolean) {
    this.lastLiked.set(liked);
  }
}
```

</details>

<details>
<summary>parent-like-demo.component.html</summary>

```html
<app-like-button (likeChanged)="onLikeChanged($event)"></app-like-button>
@if (lastLiked() !== null) {
<p>Last status: {{ lastLiked() ? 'Liked' : 'Unliked' }}</p>
}
```

</details>

---

## Exercise 4: Search Box (model())

Plain‑language goal:

- Use a two‑way bound model signal for text input
- Update the screen as the user types
- Show a tiny validation message to prove it’s reactive

<details>
<summary>Generate with Angular CLI</summary>

```bash
ng g c search-box --standalone --skip-tests

# Optional parent demo for two-way binding showcase
ng g c parent-search-demo --standalone --skip-tests
```

</details>

<details>
<summary>search-box.component.ts</summary>

```typescript
import { Component, computed, model } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-search-box",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./search-box.component.html",
  styleUrl: "./search-box.component.css",
})
export class SearchBoxComponent {
  // Model signal supports parent two-way binding: <app-search-box [(query)]="parentQuery">
  query = model("");
  length = computed(() => this.query().length);
  valid = computed(() => this.length() >= 3);
}
```

</details>

<details>
<summary>search-box.component.html</summary>

```html
<div class="search">
  <!-- Bind ngModel to the signal in a compatible way -->
  <input
    [ngModel]="query()"
    (ngModelChange)="query.set($event)"
    placeholder="Type 3+ chars..."
    [style.borderColor]="valid() ? 'seagreen' : 'crimson'"
  />
  <p>Searching for: "{{ query() }}" ({{ length() }})</p>
  @if (!valid()) {
  <p class="warn">Please enter at least 3 characters.</p>
  }
</div>
```

</details>

<details>
<summary>search-box.component.css</summary>

```css
.search {
  max-width: 320px;
}
input {
  width: 100%;
  padding: 8px;
  border: 2px solid #ccc;
  border-radius: 6px;
}
.warn {
  color: crimson;
  margin: 6px 0;
}
```

</details>

Optional parent two‑way binding demo:

<details>
<summary>parent-search-demo.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";
import { SearchBoxComponent } from "./search-box.component";

@Component({
  selector: "app-parent-search-demo",
  standalone: true,
  imports: [SearchBoxComponent],
  templateUrl: "./parent-search-demo.component.html",
})
export class ParentSearchDemoComponent {
  parentQuery = signal("");
}
```

</details>

<details>
<summary>parent-search-demo.component.html</summary>

```html
<!-- Example of two-way binding to the model input property: -->
<app-search-box [(query)]="parentQuery"></app-search-box>
<p>Parent sees: "{{ parentQuery() }}"</p>
```

</details>

---

## Exercise 5: Temperature Converter (signals + computed)

Plain‑language goal:

- Type a temperature in Celsius
- See Fahrenheit update automatically
- Show how `computed()` derives values from a signal

<details>
<summary>Generate with Angular CLI</summary>

```bash
ng g c temp-converter --standalone --skip-tests
```

</details>

<details>
<summary>temp-converter.component.ts</summary>

```typescript
import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-temp-converter",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./temp-converter.component.html",
  styleUrl: "./temp-converter.component.css",
})
export class TempConverterComponent {
  celsius = signal(0);
  fahrenheit = computed(() => Math.round((this.celsius() * 9) / 5 + 32));
}
```

</details>

<details>
<summary>temp-converter.component.html</summary>

```html
<div class="box">
  <label>
    Celsius:
    <input
      type="number"
      [ngModel]="celsius()"
      (ngModelChange)="celsius.set(Number($event))"
    />
  </label>
  <p>Fahrenheit: <strong>{{ fahrenheit() }}</strong></p>
</div>
```

</details>

<details>
<summary>temp-converter.component.css</summary>

```css
.box {
  border: 1px solid #e5e5e5;
  padding: 12px;
  border-radius: 8px;
  max-width: 260px;
}
input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
```

</details>

---

## Exercise 6: Tag List (signals array + computed)

Plain‑language goal:

- Add small tags to a list
- Display how many tags you’ve added
- Show `signal([])` with `update()` and a simple `computed()` count

<details>
<summary>Generate with Angular CLI</summary>

```bash
ng g c tag-list --standalone --skip-tests
```

</details>

<details>
<summary>tag-list.component.ts</summary>

```typescript
import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-tag-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./tag-list.component.html",
  styleUrl: "./tag-list.component.css",
})
export class TagListComponent {
  newTag = signal("");
  tags = signal<string[]>([]);
  count = computed(() => this.tags().length);

  add() {
    const t = this.newTag().trim();
    if (!t) return;
    this.tags.update((list) => [...list, t]);
    this.newTag.set("");
  }

  remove(i: number) {
    this.tags.update((list) => list.filter((_, idx) => idx !== i));
  }
}
```

</details>

<details>
<summary>tag-list.component.html</summary>

```html
<div class="list">
  <div class="add">
    <input
      [ngModel]="newTag()"
      (ngModelChange)="newTag.set($event)"
      placeholder="Add a tag"
    />
    <button (click)="add()">Add</button>
  </div>

  @if (count() > 0) {
  <div class="tags">
    @for (t of tags(); let i = $index; track i) {
    <span class="tag">
      {{ t }} <button class="x" (click)="remove(i)">×</button>
    </span>
    }
  </div>
  } @else {
  <small>No tags yet.</small>
  }

  <p>Total: {{ count() }}</p>
</div>
```

</details>

<details>
<summary>tag-list.component.css</summary>

```css
.list {
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 8px;
  max-width: 320px;
}
.add {
  display: flex;
  gap: 8px;
}
input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
}
.tag {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 4px 8px;
  border-radius: 999px;
}
.x {
  margin-left: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
}
```

</details>

---

## Exercise 7: Star Rating (signal output)

Plain‑language goal:

- Click stars to set a rating (1–5)
- Emit the selected rating to the parent
- Show another example of signal outputs

<details>
<summary>Generate with Angular CLI</summary>

```bash
ng g c star-rating --standalone --skip-tests
ng g c parent-rating-demo --standalone --skip-tests
```

</details>

<details>
<summary>star-rating.component.ts</summary>

```typescript
import { Component, output, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-star-rating",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./star-rating.component.html",
  styleUrl: "./star-rating.component.css",
})
export class StarRatingComponent {
  rating = signal(0);
  ratingChange = output<number>();

  set(r: number) {
    this.rating.set(r);
    this.ratingChange.emit(r);
  }
}
```

</details>

<details>
<summary>star-rating.component.html</summary>

```html
<div class="stars">
  @for (s of [1,2,3,4,5]; track s) {
  <span (click)="set(s)" [class.on]="rating() >= s">★</span>
  }
  <span class="val">{{ rating() }}/5</span>
</div>
```

</details>

<details>
<summary>star-rating.component.css</summary>

```css
.stars {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
span {
  cursor: pointer;
  font-size: 22px;
  color: #cbd5e1;
}
span.on {
  color: #f59e0b;
}
.val {
  margin-left: 8px;
  font-size: 14px;
  color: #475569;
}
```

</details>

Parent usage (example):

<details>
<summary>parent-rating-demo.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";
import { StarRatingComponent } from "./star-rating.component";

@Component({
  selector: "app-parent-rating-demo",
  standalone: true,
  imports: [StarRatingComponent],
  templateUrl: "./parent-rating-demo.component.html",
})
export class ParentRatingDemoComponent {
  last = signal(0);
  onChanged(val: number) {
    this.last.set(val);
  }
}
```

</details>

<details>
<summary>parent-rating-demo.component.html</summary>

```html
<app-star-rating (ratingChange)="onChanged($event)"></app-star-rating>
<p>Parent received: {{ last() }}/5</p>
```

</details>

---

## Exercise 8: Username Form (model() + simple validation)

Plain‑language goal:

- Two‑way bind a username field with `model()`
- Disable submit until the name is valid
- Show how easy model signals make form state

<details>
<summary>Generate with Angular CLI</summary>

```bash
ng g c username-form --standalone --skip-tests
ng g c parent-username-demo --standalone --skip-tests
```

</details>

<details>
<summary>username-form.component.ts</summary>

```typescript
import { Component, computed, model } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-username-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./username-form.component.html",
  styleUrl: "./username-form.component.css",
})
export class UsernameFormComponent {
  username = model("");
  valid = computed(() => this.username().trim().length >= 3);
}
```

</details>

<details>
<summary>username-form.component.html</summary>

```html
<form class="box" (submit)="$event.preventDefault()">
  <input
    [ngModel]="username()"
    (ngModelChange)="username.set($event)"
    placeholder="Min 3 chars"
  />
  <button [disabled]="!valid()">Submit</button>
  @if (!valid()) {
  <p class="warn">Username must be at least 3 characters.</p>
  }
</form>
```

</details>

<details>
<summary>username-form.component.css</summary>

```css
.box {
  display: flex;
  gap: 8px;
  align-items: center;
}
input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
button {
  padding: 6px 10px;
}
.warn {
  color: crimson;
  margin-left: 8px;
}
```

</details>

Optional parent two‑way demo:

<details>
<summary>parent-username-demo.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";
import { UsernameFormComponent } from "./username-form.component";

@Component({
  selector: "app-parent-username-demo",
  standalone: true,
  imports: [UsernameFormComponent],
  templateUrl: "./parent-username-demo.component.html",
})
export class ParentUsernameDemoComponent {
  name = signal("");
}
```

</details>

<details>
<summary>parent-username-demo.component.html</summary>

```html
<app-username-form [(username)]="name"></app-username-form>
<p>Parent sees: {{ name() }}</p>
```

</details>

---

That’s it! These eight short demos cover the essentials you want to teach today: signals (state), signal inputs (data into child), signal outputs (events from child), and model() (two‑way binding). Copy/paste into a fresh Angular workspace and demo each in 2–4 minutes.
