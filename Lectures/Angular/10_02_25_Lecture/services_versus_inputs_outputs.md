# Services vs Inputs/Outputs: 6 Focused Examples

Overview (Example 1): A child component needs to update a numeric value that the parent (and potentially other components later) must display. We first show the classic upward event emission + downward input binding, then refactor so both simply talk to a shared service.

## Example 1: Child updates a counter, parent displays it

Goal: Show child→parent communication without emitting events (after refactor, any component can change/read the same count without configuration overhead).

### Without Service (friction)

Child emits new count; parent holds state and passes it down.

Scaffold (CLI):

<details>
<summary>Generate</summary>

```bash
ng g c examples/counter/counter-parent --skip-tests
ng g c examples/counter/counter-child --skip-tests
ng g s examples/counter/counter --skip-tests
```

</details>

<details>
<summary>counter-parent.component.ts</summary>

```ts
@Component({
  selector: "app-counter-parent",
  standalone: true,
  imports: [CounterChildComponent],
  templateUrl: "./counter-parent.component.html",
})
export class CounterParentComponent {
  count = 0;
  onInc(n: number) {
    this.count = n;
  }
}
```

</details>

<details>
<summary>counter-parent.component.html</summary>

```html
<h3>Count: {{ count }}</h3>
<app-counter-child
  [count]="count"
  (increment)="onInc($event)"
></app-counter-child>
```

</details>

<details>
<summary>counter-child.component.ts</summary>

```ts
@Component({
  selector: "app-counter-child",
  standalone: true,
  templateUrl: "./counter-child.component.html",
})
export class CounterChildComponent {
  @Input() count = 0;
  @Output() increment = new EventEmitter<number>();
  inc() {
    this.increment.emit(this.count + 1);
  }
}
```

</details>

<details>
<summary>counter-child.component.html</summary>

```html
<button (click)="inc()">+1 ({{ count }})</button>
```

</details>

_Refactor Change: We move the count from the parent component into a `CounterService`. The child no longer emits an event; it just calls `increment()`. The parent no longer receives or passes values—both read the same reactive signal._

### Service Version

<details>
<summary>counter.service.ts</summary>

```ts
@Injectable({ providedIn: "root" })
export class CounterService {
  private _count = signal(0);
  count = this._count;

  increment(): void {
    this._count.update((c) => c + 1);
  }

  reset(): void {
    this._count.set(0);
  }
}
```

</details>

<details>
<summary>counter-parent.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-counter-parent",
  standalone: true,
  imports: [CounterChildComponent],
  templateUrl: "./counter-parent.component.html",
})
export class CounterParentComponent {
  readonly count = this.counter.count; // alias signal for template
  constructor(private counter: CounterService) {}
}
```

</details>

<details>
<summary>counter-parent.component.html (service version)</summary>

```html
<h3>Count: {{ count() }}</h3>
<app-counter-child></app-counter-child>
```

</details>

<details>
<summary>counter-child.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-counter-child",
  standalone: true,
  templateUrl: "./counter-child.component.html",
})
export class CounterChildComponent {
  readonly count = this.counter.count;
  constructor(private counter: CounterService) {}
  inc(): void {
    this.counter.increment();
  }
}
```

</details>

<details>
<summary>counter-child.component.html (service version)</summary>

```html
<button (click)="inc()">+1 ({{ count() }})</button>
```

</details>

### Why Better

- Removed @Input/@Output wiring.
- Any new component can increment without touching parents.
- Future: add persistence or server sync in one place.

---

Overview (Example 2): A parent chooses a theme (light/dark) and feeds it to a child for display. Later we may need multiple distant components (header, footer, settings panel) to react to the same theme, so we centralize it.

## Example 2: Parent sets theme, child consumes it

Goal: Show parent→child one-way data replaced by service so unrelated components can also read and modify the theme.

### Without Service (friction)

`theme-parent.component.ts`

Scaffold (CLI):

<details>
<summary>Generate</summary>

```bash
ng g c examples/theme/theme-parent --skip-tests
ng g c examples/theme/theme-child --skip-tests
ng g s examples/theme/theme --skip-tests
```

</details>

<details>
<summary>theme-parent.component.ts</summary>

```ts
@Component({
  selector: "app-theme-parent",
  standalone: true,
  imports: [ThemeChildComponent],
  templateUrl: "./theme-parent.component.html",
})
export class ThemeParentComponent {
  theme = "light";
  setTheme(t: string) {
    this.theme = t;
  }
}
```

</details>

<details>
<summary>theme-parent.component.html</summary>

```html
<button (click)="setTheme('light')">Light</button>
<button (click)="setTheme('dark')">Dark</button>
<app-theme-child [theme]="theme"></app-theme-child>
```

</details>

<details>
<summary>theme-child.component.ts</summary>

```ts
@Component({
  selector: "app-theme-child",
  standalone: true,
  templateUrl: "./theme-child.component.html",
})
export class ThemeChildComponent {
  @Input() theme = "light";
}
```

</details>

<details>
<summary>theme-child.component.html</summary>

```html
<p>Theme is: {{ theme }}</p>
```

</details>

_Refactor Change: Theme string state leaves the parent and lives in `ThemeService`. Both parent and child inject the service: parent sets it; child (and any other component) reads it directly. No more @Input handoff._

### Service Version

<details>
<summary>theme.service.ts</summary>

```ts
@Injectable({ providedIn: "root" })
export class ThemeService {
  private _theme = signal<"light" | "dark">("light");
  theme = this._theme;

  set(t: "light" | "dark"): void {
    this._theme.set(t);
  }

  toggle(): void {
    this._theme.update((v) => (v === "light" ? "dark" : "light"));
  }
}
```

</details>

<details>
<summary>theme-parent.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-theme-parent",
  standalone: true,
  imports: [ThemeChildComponent],
  templateUrl: "./theme-parent.component.html",
})
export class ThemeParentComponent {
  readonly theme = this.themeSvc.theme;
  constructor(private themeSvc: ThemeService) {}
  setLight(): void {
    this.themeSvc.set("light");
  }
  setDark(): void {
    this.themeSvc.set("dark");
  }
}
```

</details>

<details>
<summary>theme-parent.component.html (service version)</summary>

```html
<button (click)="setLight()">Light</button>
<button (click)="setDark()">Dark</button>
<app-theme-child></app-theme-child>
```

</details>

<details>
<summary>theme-child.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-theme-child",
  standalone: true,
  templateUrl: "./theme-child.component.html",
})
export class ThemeChildComponent {
  readonly theme = this.themeSvc.theme;
  constructor(private themeSvc: ThemeService) {}
}
```

</details>

<details>
<summary>theme-child.component.html (service version)</summary>

```html
<p>Theme is: {{ theme() }}</p>
```

</details>

### Why Better

- Any component (header/footer) can display or toggle theme.
- No prop threading.
- Single place to later persist to localStorage.

---

Overview (Example 3): A chat input fires many messages upward, and the parent accumulates them for a list display. As more message producers or observers appear (notifications, moderation, persistence), the parent becomes an accidental state manager—service solves that.

## Example 3: Child posts chat messages, parent shows list

Goal: Child→parent repeated events replaced by shared message store; parent just renders structure.

### Without Service (friction)

`chat-parent.component.ts`

Scaffold (CLI):

<details>
<summary>Generate</summary>

```bash
ng g c examples/chat/chat-parent --skip-tests
ng g c examples/chat/chat-input --skip-tests
ng g c examples/chat/chat-list --skip-tests
ng g s examples/chat/chat --skip-tests
```

</details>

<details>
<summary>chat-parent.component.ts</summary>

```ts
@Component({
  selector: "app-chat-parent",
  standalone: true,
  imports: [ChatInputComponent, ChatListComponent],
  templateUrl: "./chat-parent.component.html",
})
export class ChatParentComponent {
  messages: string[] = [];
  add(m: string) {
    this.messages = [...this.messages, m];
  }
}
```

</details>

<details>
<summary>chat-parent.component.html</summary>

```html
<app-chat-input (send)="add($event)"></app-chat-input>
<app-chat-list [messages]="messages"></app-chat-list>
```

</details>

<details>
<summary>chat-input.component.ts</summary>

```ts
@Component({
  selector: "app-chat-input",
  standalone: true,
  templateUrl: "./chat-input.component.html",
})
export class ChatInputComponent {
  @Output() send = new EventEmitter<string>();
  draft = "";
  submit() {
    if (!this.draft.trim()) return;
    this.send.emit(this.draft.trim());
    this.draft = "";
  }
}
```

</details>

<details>
<summary>chat-input.component.html</summary>

```html
<input [(ngModel)]="draft" placeholder="Say something" /><button
  (click)="submit()"
>
  Send
</button>
```

</details>

<details>
<summary>chat-list.component.ts</summary>

```ts
@Component({
  selector: "app-chat-list",
  standalone: true,
  templateUrl: "./chat-list.component.html",
})
export class ChatListComponent {
  @Input() messages: string[] = [];
}
```

</details>

<details>
<summary>chat-list.component.html</summary>

```html
<ul>
  <li *ngFor="let m of messages">{{ m }}</li>
</ul>
```

</details>

_Refactor Change: Message array moves into `ChatService`. Input component adds directly; list component reads directly; parent becomes a thin container (or can disappear entirely). Emission + prop wiring removed._

### Service Version

<details>
<summary>chat.service.ts</summary>

```ts
@Injectable({ providedIn: "root" })
export class ChatService {
  private _messages = signal<string[]>([]);
  messages = this._messages;

  add(msg: string): void {
    this._messages.update((arr) => [...arr, msg]);
  }

  clear(): void {
    this._messages.set([]);
  }
}
```

</details>

<details>
<summary>chat-input.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-chat-input",
  standalone: true,
  templateUrl: "./chat-input.component.html",
})
export class ChatInputComponent {
  draft = "";
  constructor(private chat: ChatService) {}
  submit() {
    if (!this.draft.trim()) return;
    this.chat.add(this.draft.trim());
    this.draft = "";
  }
}
```

</details>

<details>
<summary>chat-list.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-chat-list",
  standalone: true,
  templateUrl: "./chat-list.component.html",
})
export class ChatListComponent {
  readonly messages = this.chat.messages;
  constructor(private chat: ChatService) {}
}
```

</details>

<details>
<summary>chat-list.component.html (service version)</summary>

```html
<ul>
  <li *ngFor="let m of messages()">{{ m }}</li>
</ul>
```

</details>

<details>
<summary>chat-parent.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-chat-parent",
  standalone: true,
  imports: [ChatInputComponent, ChatListComponent],
  template: `
    <app-chat-input></app-chat-input>
    <app-chat-list></app-chat-list>
  `,
})
export class ChatParentComponent {}
```

</details>

### Why Better

- Parent no longer manages array state.
- Any future notifications / persistence layer sits in the service only.
- Adding another input component “just works.”

---

Overview (Example 4): A filter term originates from a text box and fans out to multiple visual consumers (badge, filtered list, maybe stats). Passing the term through the parent to every consumer scales poorly as consumers grow.

## Example 4: Filter term set by child, used by parent list & badge

Goal: Show one update powering multiple consumers without additional prop plumbing per consumer.

### Without Service (friction)

Child emits term; parent stores; passes to two children (list + badge) via @Input.
Scaffold (CLI):

<details>
<summary>Generate</summary>

```bash
ng g c examples/filter/filter-parent --skip-tests
ng g c examples/filter/filter-box --skip-tests
ng g c examples/filter/filter-badge --skip-tests
ng g c examples/filter/filter-list --skip-tests
ng g s examples/filter/filter --skip-tests
```

</details>

<details>
<summary>filter-parent.component.ts</summary>

```ts
@Component({
  selector: "app-filter-parent",
  standalone: true,
  imports: [FilterBoxComponent, FilterListComponent, FilterBadgeComponent],
  templateUrl: "./filter-parent.component.html",
})
export class FilterParentComponent {
  term = "";
  setTerm(t: string) {
    this.term = t;
  }
}
```

</details>

<details>
<summary>filter-parent.component.html</summary>

```html
<app-filter-box (termChange)="setTerm($event)"></app-filter-box>
<app-filter-badge [term]="term"></app-filter-badge>
<app-filter-list [term]="term"></app-filter-list>
```

</details>

_Refactor Change: The term shifts into `FilterService`. The input writes it once; any component (badge, list, future chips/stats) injects and reads the same signal. Parent no longer owns or distributes the term._

### Service Version

<details>
<summary>filter.service.ts</summary>

```ts
@Injectable({ providedIn: "root" })
export class FilterService {
  private _term = signal("");
  term = this._term;

  set(t: string): void {
    this._term.set(t);
  }
  clear(): void {
    this._term.set("");
  }
}
```

</details>

<details>
<summary>filter-box.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-filter-box",
  standalone: true,
  templateUrl: "./filter-box.component.html",
})
export class FilterBoxComponent {
  constructor(private filter: FilterService) {}
  update(v: string): void {
    this.filter.set(v);
  }
}
```

</details>

<details>
<summary>filter-box.component.html (service version)</summary>

```html
<input
  (input)="update(($event.target as HTMLInputElement).value)"
  placeholder="Search"
/>
```

</details>

<details>
<summary>filter-badge.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-filter-badge",
  standalone: true,
  template: `<span *ngIf="term()">Term: {{ term() }}</span>`,
})
export class FilterBadgeComponent {
  readonly term = this.filter.term;
  constructor(private filter: FilterService) {}
}
```

</details>

<details>
<summary>filter-list.component.ts (service version)</summary>

```ts
import { computed } from "@angular/core";
@Component({
  selector: "app-filter-list",
  standalone: true,
  templateUrl: "./filter-list.component.html",
})
export class FilterListComponent {
  items = ["apple", "banana", "carrot"];
  readonly filtered = computed(() =>
    this.items.filter((i) => i.includes(this.filter.term()))
  );
  constructor(private filter: FilterService) {}
}
```

</details>

<details>
<summary>filter-list.component.html (service version)</summary>

```html
<ul>
  <li *ngFor="let i of filtered()">{{ i }}</li>
</ul>
```

</details>

<details>
<summary>filter-parent.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-filter-parent",
  standalone: true,
  imports: [FilterBoxComponent, FilterBadgeComponent, FilterListComponent],
  template: `
    <app-filter-box></app-filter-box>
    <app-filter-badge></app-filter-badge>
    <app-filter-list></app-filter-list>
  `,
})
export class FilterParentComponent {}
```

</details>

### Why Better

- Remove prop passing for every new consumer.
- Central place to introduce derived/computed filtering later.
- Testing: mock just the service.

---

Overview (Example 5): A multi‑step wizard tracks progress. Initially the parent owns the step and listens for child events. As more UI elements (progress bar, side summary, conditional buttons) need the step, event bubbling becomes noisy.

## Example 5: Wizard step advanced by child, read by parent + progress bar

Goal: Remove bubbling events; any component can advance or observe step state seamlessly.

### Without Service (friction)

`wizard-parent.component.ts`

Scaffold (CLI):

<details>
<summary>Generate</summary>

```bash
ng g c examples/wizard/wizard-parent --skip-tests
ng g c examples/wizard/wizard-step --skip-tests
ng g c examples/wizard/wizard-progress --skip-tests
ng g s examples/wizard/wizard --skip-tests
```

</details>

<details>
<summary>wizard-parent.component.ts</summary>

```ts
@Component({
  selector: "app-wizard-parent",
  standalone: true,
  imports: [WizardStepComponent, WizardProgressComponent],
  templateUrl: "./wizard-parent.component.html",
})
export class WizardParentComponent {
  step = 1;
  onNext(s: number) {
    this.step = s;
  }
}
```

</details>

<details>
<summary>wizard-parent.component.html</summary>

```html
<app-wizard-progress [step]="step"></app-wizard-progress>
<app-wizard-step [step]="step" (next)="onNext($event)"></app-wizard-step>
```

</details>

_Refactor Change: Step state and step-advancement logic move into `WizardService`. Child calls `advance()` directly; progress bar and any observer just read the signal. Parent holds no step logic._

### Service Version

<details>
<summary>wizard.service.ts</summary>

```ts
@Injectable({ providedIn: "root" })
export class WizardService {
  private _step = signal(1);
  step = this._step;

  advance(): void {
    this._step.update((s) => Math.min(s + 1, 3));
  }

  reset(): void {
    this._step.set(1);
  }
}
```

</details>

<details>
<summary>wizard-step.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-wizard-step",
  standalone: true,
  templateUrl: "./wizard-step.component.html",
})
export class WizardStepComponent {
  readonly step = this.wiz.step;
  constructor(private wiz: WizardService) {}
  next(): void {
    this.wiz.advance();
  }
}
```

</details>

<details>
<summary>wizard-step.component.html (service version)</summary>

```html
<p>Step {{ step() }}</p>
<button (click)="next()" *ngIf="step() < 3">Next</button>
<span *ngIf="step() === 3">Done!</span>
```

</details>

<details>
<summary>wizard-progress.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-wizard-progress",
  standalone: true,
  template: `<progress [value]="step()" max="3"></progress>`,
})
export class WizardProgressComponent {
  readonly step = this.wiz.step;
  constructor(private wiz: WizardService) {}
}
```

</details>

<details>
<summary>wizard-parent.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-wizard-parent",
  standalone: true,
  imports: [WizardProgressComponent, WizardStepComponent],
  template: `
    <app-wizard-progress></app-wizard-progress>
    <app-wizard-step></app-wizard-step>
  `,
})
export class WizardParentComponent {}
```

</details>

### Why Better

- Step logic centralized (range capping, reset, future persistence).
- Add a sidebar progress summary without changing parent.
- Child no longer emits events.

---

Overview (Example 6): A transient toast message is triggered by a button. More triggers (save forms, API responses) and multiple display placements (top-right, status bar) would multiply inputs/outputs and timers if handled by parents.

## Example 6: Toast notifications — child triggers, parent (or any) displays

Goal: Global ephemeral state triggered anywhere without wiring every path through a parent.

### Without Service (friction)

Each child emits up; parent holds a message & timer; more children require additional wiring.
Scaffold (CLI):

<details>
<summary>Generate</summary>

```bash
ng g c examples/toast/toast-parent --skip-tests
ng g c examples/toast/toast-button --skip-tests
ng g c examples/toast/toast-display --skip-tests
ng g s examples/toast/toast --skip-tests
```

</details>

<details>
<summary>toast-parent.component.ts</summary>

```ts
@Component({
  selector: "app-toast-parent",
  standalone: true,
  imports: [ToastButtonComponent],
  templateUrl: "./toast-parent.component.html",
})
export class ToastParentComponent {
  msg = "";
  show(m: string) {
    this.msg = m;
    setTimeout(() => (this.msg = ""), 1500);
  }
}
```

</details>

<details>
<summary>toast-parent.component.html</summary>

```html
<p *ngIf="msg">Toast: {{ msg }}</p>
<app-toast-button (show)="show($event)"></app-toast-button>
```

</details>

<details>
<summary>toast-button.component.ts</summary>

```ts
@Component({
  selector: "app-toast-button",
  standalone: true,
  templateUrl: "./toast-button.component.html",
})
export class ToastButtonComponent {
  @Output() show = new EventEmitter<string>();
  click() {
    this.show.emit("Saved!");
  }
}
```

</details>

<details>
<summary>toast-button.component.html</summary>

```html
<button (click)="click()">Show Toast</button>
```

</details>

_Refactor Change: Toast message and hide timing move into `ToastService`. Any component invokes `show()`. Any display component subscribes to the same signal—parent becomes optional._

### Service Version

<details>
<summary>toast.service.ts</summary>

```ts
@Injectable({ providedIn: "root" })
export class ToastService {
  private _message = signal("");
  message = this._message;

  show(m: string): void {
    this._message.set(m);
    setTimeout(() => this._message.set(""), 1500);
  }
}
```

</details>

<details>
<summary>toast-button.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-toast-button",
  standalone: true,
  templateUrl: "./toast-button.component.html",
})
export class ToastButtonComponent {
  constructor(private toast: ToastService) {}
  click() {
    this.toast.show("Saved!");
  }
}
```

</details>

<details>
<summary>toast-display.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-toast-display",
  standalone: true,
  template: `<p *ngIf="message()">Toast: {{ message() }}</p>`,
})
export class ToastDisplayComponent {
  readonly message = this.toast.message;
  constructor(private toast: ToastService) {}
}
```

</details>

<details>
<summary>toast-parent.component.ts (service version)</summary>

```ts
@Component({
  selector: "app-toast-parent",
  standalone: true,
  imports: [ToastButtonComponent, ToastDisplayComponent],
  template: `
    <app-toast-display></app-toast-display>
    <app-toast-button></app-toast-button>
  `,
})
export class ToastParentComponent {}
```

</details>

### Why Better

- Any component can trigger a toast (no new inputs/outputs).
- All display variations subscribe to the same source.
- Extensible to queue or severity levels in the service only.

---

## Summary: What Services Saved

- Removed repetitive @Input/@Output (or input()/output()) declarations.
- Eliminated intermediary relay components (parent just renders structure).
- Centralized validation/business logic (range capping, clearing, filtering, theming, message queue timing).
- Improved scalability: adding a new reader/writer requires only injection.
- Easier testing: mock one service vs crafting component trees.

Rule of Thumb: Use @Input/@Output for isolated parent-child pairs. Introduce a service the moment state is:

1. Needed by more than two components, OR
2. Traverses more than one level, OR
3. Represents a domain concept (theme, auth, cart, chat) that outlives a single component’s lifecycle.

End.
