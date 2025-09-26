# 9/29/25 — Angular Essentials, Part 2 (Short Walkthrough)

Angular 19.2.3, standalone components. Today: inputs/outputs refresh, dynamic styling, and content projection.

## Quick Start (serve and use components)

```bash
# From your Angular workspace root
npm install
ng serve -o
```

To try a demo component:

- Generate it with the CLI shown in each exercise.
- Add the component to your AppComponent imports and use its selector in the template, e.g.

```typescript
// src/app/app.component.ts
import { Component } from "@angular/core";
import { ThemeBoxComponent } from "./theme-box/theme-box.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ThemeBoxComponent],
  template: `<app-theme-box></app-theme-box>`,
})
export class AppComponent {}
```

---

## Exercise 1: Tiny Toggle (Input + Output)

Build a tiny child toggle that exposes an on/off value and emits changes to its parent. We’ll keep the state in the parent and update it when the child button is clicked.

<details>
<summary>Generate</summary>

```bash
ng g c tiny-toggle --skip-tests
ng g c toggle-demo --skip-tests
```

</details>

<details>
<summary>tiny-toggle.component.ts</summary>

```typescript
import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-tiny-toggle",
  standalone: true,
  templateUrl: "./tiny-toggle.component.html",
})
export class TinyToggleComponent {
  on = input(false);
  changed = output<boolean>();

  toggle() {
    const next = !this.on();
    this.changed.emit(next);
  }
}
```

</details>

<details>
<summary>tiny-toggle.component.html</summary>

```html
<button (click)="toggle()">{{ on() ? 'ON' : 'OFF' }}</button>
```

</details>

<details>
<summary>toggle-demo.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";
import { TinyToggleComponent } from "./tiny-toggle.component";

@Component({
  selector: "app-toggle-demo",
  standalone: true,
  imports: [TinyToggleComponent],
  templateUrl: "./toggle-demo.component.html",
})
export class ToggleDemoComponent {
  state = signal(false);
}
```

</details>

<details>
<summary>toggle-demo.component.html</summary>

```html
<app-tiny-toggle [on]="state()" (changed)="state.set($event)"></app-tiny-toggle>
<p>Parent sees: {{ state() ? 'ON' : 'OFF' }}</p>
```

</details>

---

## Exercise 2: Dynamic Styles (ngClass / ngStyle)

Toggle a “dark mode” class and an inline style with a signal. We’ll flip a boolean and use [ngClass] and [ngStyle] to change the look of a box.

<details>
<summary>Generate</summary>

```bash
ng g c theme-box --skip-tests
```

</details>

<details>
<summary>theme-box.component.ts</summary>

```typescript
import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-theme-box",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./theme-box.component.html",
  styleUrl: "./theme-box.component.css",
})
export class ThemeBoxComponent {
  dark = signal(false);
}
```

</details>

<details>
<summary>theme-box.component.html</summary>

```html
<div
  class="box"
  [ngClass]="{ dark: dark() }"
  [ngStyle]="{ borderColor: dark() ? '#0ea5e9' : '#94a3b8' }"
>
  <p>Theme: {{ dark() ? 'Dark' : 'Light' }}</p>
  <button (click)="dark.update(v => !v)">Toggle</button>
</div>
```

</details>

<details>
<summary>theme-box.component.css</summary>

```css
.box {
  border: 2px solid #94a3b8;
  padding: 12px;
  border-radius: 8px;
}
.box.dark {
  background: #0f172a;
  color: #e2e8f0;
}
```

</details>

---

## Exercise 3: Content Projection (<ng-content>)

Create a small Card component that accepts projected content. We’ll expose title, body, and actions slots using ng-content so any parent can customize the layout.

<details>
<summary>Generate</summary>

```bash
ng g c ui-card --skip-tests
```

</details>

<details>
<summary>ui-card.component.ts</summary>

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-ui-card",
  standalone: true,
  templateUrl: "./ui-card.component.html",
  styleUrl: "./ui-card.component.css",
})
export class UiCardComponent {}
```

</details>

<details>
<summary>ui-card.component.html</summary>

```html
<div class="card">
  <header><ng-content select="[card-title]"></ng-content></header>
  <section><ng-content></ng-content></section>
  <footer><ng-content select="[card-actions]"></ng-content></footer>
</div>
```

</details>

<details>
<summary>ui-card.component.css</summary>

```css
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
}
header {
  font-weight: 700;
  margin-bottom: 8px;
}
footer {
  margin-top: 8px;
  text-align: right;
}
```

</details>

Usage example in any template:

```html
<app-ui-card>
  <span card-title>Welcome</span>
  <p>Projected content goes here.</p>
  <div card-actions>
    <button>OK</button>
  </div>
</app-ui-card>
```

---

## Exercise 4: Even/Odd Badge (computed styling)

Use a computed() value to label numbers as Even or Odd and style accordingly. Clicking a button updates the number and the badge reacts automatically.

<details>
<summary>Generate</summary>

```bash
ng g c even-odd --skip-tests
```

</details>

<details>
<summary>even-odd.component.ts</summary>

```typescript
import { Component, computed, signal } from "@angular/core";

@Component({
  selector: "app-even-odd",
  standalone: true,
  templateUrl: "./even-odd.component.html",
  styleUrl: "./even-odd.component.css",
})
export class EvenOddComponent {
  n = signal(0);
  isEven = computed(() => this.n() % 2 === 0);
}
```

</details>

<details>
<summary>even-odd.component.html</summary>

```html
<div class="wrap">
  <button (click)="n.update(v => v + 1)">+1</button>
  <span class="badge" [class.even]="isEven()" [class.odd]="!isEven()">
    {{ n() }} — {{ isEven() ? 'Even' : 'Odd' }}
  </span>
</div>
```

</details>

<details>
<summary>even-odd.component.css</summary>

```css
.wrap {
  display: flex;
  gap: 8px;
  align-items: center;
}
.badge {
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
}
.even {
  background: #dcfce7;
}
.odd {
  background: #fee2e2;
}
```

</details>

---

## Exercise 5: Avatar (signal input)

Render a circular avatar with user initials whose size is controlled by an input. We’ll compute the initials from the name and bind styles to the size.

<details>
<summary>Generate</summary>

```bash
ng g c avatar --skip-tests
```

</details>

<details>
<summary>avatar.component.ts</summary>

```typescript
import { Component, computed, input } from "@angular/core";

@Component({
  selector: "app-avatar",
  standalone: true,
  templateUrl: "./avatar.component.html",
  styleUrl: "./avatar.component.css",
})
export class AvatarComponent {
  name = input("Jane Doe");
  size = input(40);
  initials = computed(() =>
    this.name()
      .split(/\s+/)
      .map((p) => p[0]?.toUpperCase())
      .join("")
      .slice(0, 2)
  );
}
```

</details>

<details>
<summary>avatar.component.html</summary>

```html
<div
  class="avatar"
  [style.width.px]="size()"
  [style.height.px]="size()"
  [style.fontSize.px]="size()/2"
>
  {{ initials() }}
</div>
```

</details>

<details>
<summary>avatar.component.css</summary>

```css
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e2e8f0;
  color: #334155;
  font-weight: 700;
}
```

</details>

---

## Exercise 6: Alert Box (style by type)

Style an alert box by type (info/success/error). We’ll toggle classes from a signal input and let consumers project message content inside the box.

<details>
<summary>Generate</summary>

```bash
ng g c alert-box --skip-tests
```

</details>

<details>
<summary>alert-box.component.ts</summary>

```typescript
import { Component, input } from "@angular/core";

@Component({
  selector: "app-alert-box",
  standalone: true,
  templateUrl: "./alert-box.component.html",
  styleUrl: "./alert-box.component.css",
})
export class AlertBoxComponent {
  type = input<"info" | "success" | "error">("info");
}
```

</details>

<details>
<summary>alert-box.component.html</summary>

```html
<div
  class="alert"
  [class.success]="type()==='success'"
  [class.error]="type()==='error'"
>
  <ng-content></ng-content>
</div>
```

</details>

<details>
<summary>alert-box.component.css</summary>

```css
.alert {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #f1f5f9;
}
.alert.success {
  background: #ecfccb;
  border-color: #a3e635;
}
.alert.error {
  background: #fee2e2;
  border-color: #f87171;
}
```

</details>

---

## Exercise 7: Button Group (output value)

Build a small button group that tracks the active option and emits changes. We’ll render the buttons with @for and highlight the selected one.

<details>
<summary>Generate</summary>

```bash
ng g c button-group --skip-tests
```

</details>

<details>
<summary>button-group.component.ts</summary>

```typescript
import { Component, input, output, signal } from "@angular/core";

@Component({
  selector: "app-button-group",
  standalone: true,
  templateUrl: "./button-group.component.html",
  styleUrl: "./button-group.component.css",
})
export class ButtonGroupComponent {
  options = input<string[]>(["A", "B", "C"]);
  valueChange = output<string>();
  active = signal<string>("A");
  set(v: string) {
    this.active.set(v);
    this.valueChange.emit(v);
  }
}
```

</details>

<details>
<summary>button-group.component.html</summary>

```html
<div class="group">
  @for (o of options(); track o) {
  <button [class.active]="active()===o" (click)="set(o)">{{ o }}</button>
  }
</div>
```

</details>

<details>
<summary>button-group.component.css</summary>

```css
.group {
  display: flex;
  gap: 6px;
}
button {
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
}
button.active {
  background: #0ea5e9;
  color: #fff;
}
```

</details>

---

## Exercise 8: Progress Bar (input percent)

Implement a progress bar whose fill width is driven by an input percent. The parent sets a number and the bar updates its CSS width accordingly.

<details>
<summary>Generate</summary>

```bash
ng g c progress-bar --skip-tests
```

</details>

<details>
<summary>progress-bar.component.ts</summary>

```typescript
import { Component, input } from "@angular/core";

@Component({
  selector: "app-progress-bar",
  standalone: true,
  templateUrl: "./progress-bar.component.html",
  styleUrl: "./progress-bar.component.css",
})
export class ProgressBarComponent {
  percent = input(0);
}
```

</details>

<details>
<summary>progress-bar.component.html</summary>

```html
<div class="track"><div class="fill" [style.width.%]="percent()"></div></div>
```

</details>

<details>
<summary>progress-bar.component.css</summary>

```css
.track {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: #22c55e;
}
```

</details>
