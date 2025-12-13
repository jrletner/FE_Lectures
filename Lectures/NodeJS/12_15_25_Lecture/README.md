# Student Practice Walkthrough – Angular 19.2.3 Client for Tasks API (12/15/25)

This walkthrough builds:

- Part A — Angular 19.2.3 standalone setup and environments
- Part B — HttpClient + Service for CRUD against backend
- Part C — app.config.ts providers
- Part D — Tasks Component with modern template and styles
- Try It — Run scripts and quick checks

Each snippet is commented line‑by‑line. Use the final composite for clean reference.

---

## Why this matters

- Practice Angular 19 standalone APIs and modern control flow (`@for`, `@if`).
- Learn service patterns for consuming a REST API (list/create/update/delete).

---

## Part A — Angular Setup

```bash
# Create a new standalone Angular app
ng new tasks-client

cd tasks-client
npm install
```

<!-- Environments removed for simplicity; base URL set directly in the service. -->

---

## Part B — Tasks Service (CRUD)

```bash
ng g s services/tasks
```

<details><summary><code>src/app/services/tasks.service.ts</code> — commented (signals)</summary>

```ts
// Enable DI annotations and signals
import { Injectable, signal } from "@angular/core";
// HttpClient performs HTTP calls
import { HttpClient } from "@angular/common/http";

// Define the Task shape used in the app
export interface Task {
  _id?: string;
  name: string;
  completed?: boolean;
}

// Mark service as injectable in root scope
@Injectable({ providedIn: "root" })
export class TasksService {
  // Base API URL hardcoded for dev
  private base = "http://localhost:3000";
  // Signal holding the list of tasks
  tasks = signal<Task[]>([]);

  // Inject HttpClient via constructor
  constructor(private http: HttpClient) {}

  /**
   * list
   * GET /api/v1/tasks
   * Fetch all tasks and update the `tasks` signal.
   */
  list() {
    this.http
      .get<{ success: boolean; payload: Task[] }>(`${this.base}/api/v1/tasks`)
      .subscribe((res) => this.tasks.set(res.payload ?? []));
  }

  /**
   * get
   * GET /api/v1/tasks/:id
   * Fetch a single task by id.
   * @param id task id string
   * @returns Observable of Task (single task)
   */
  async get(id: string): Promise<Task> {
    const res = await this.http
      .get<{ success: boolean; payload: Task }>(
        `${this.base}/api/v1/tasks/${id}`
      )
      .toPromise();
    return (res?.payload as Task) ?? ({ name: "" } as Task);
  }

  /**
   * create
   * POST /api/v1/tasks
   * Create a new task with provided fields.
   * @param task partial Task fields (e.g., name)
   * @returns Observable of Task (created task)
   */
  create(task: Task) {
    this.http
      .post<{ success: boolean; payload: Task }>(
        `${this.base}/api/v1/tasks`,
        task
      )
      .subscribe(() => this.list());
  }

  /**
   * update
   * PATCH /api/v1/tasks/:id
   * Update fields on a task.
   * @param id task id string
   * @param patch partial Task fields to update
   * @returns Observable of Task (updated task)
   */
  update(id: string, patch: Partial<Task>) {
    this.http
      .patch<{ success: boolean; payload: { updatedTask: Task } }>(
        `${this.base}/api/v1/tasks/${id}`,
        patch
      )
      .subscribe(() => this.list());
  }

  /**
   * remove
   * DELETE /api/v1/tasks/:id
   * Remove a task by id.
   * @param id task id string
   * @returns Observable<void> (completion only)
   */
  remove(id: string) {
    this.http
      .delete<{ success: boolean }>(`${this.base}/api/v1/tasks/${id}`)
      .subscribe(() => this.list());
  }
}
```

</details>

---

## Part C — Providers

<details><summary><code>src/app/app.config.ts</code> — commented</summary>

```ts
// ApplicationConfig defines the provider setup for standalone bootstrapping
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core";
// Register routes for router
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
// Import BrowserModule & ReactiveForms via providers for standalone app
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
// HttpClient providers and DI-enabled interceptor bridging
import { provideHttpClient } from "@angular/common/http";

// Configure DI providers used by the app
export const appConfig: ApplicationConfig = {
  providers: [
    // Make BrowserModule and ReactiveForms available
    importProvidersFrom(BrowserModule, ReactiveFormsModule),
    // Register HttpClient for API calls (no interceptors in this walkthrough)
    provideHttpClient(),
    // Zone change detection optimization
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Provide application routes
    provideRouter(routes),
  ],
};
```

</details>

---

## Part D — Tasks Component (list/create/toggle/delete)

```bash
ng g c tasks
```

<details><summary><code>src/app/tasks/tasks.component.ts</code> — commented</summary>

```ts
// Import component decorator and lifecycle interface
import { Component, OnInit } from "@angular/core";
// Import reactive forms utilities to build the form
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
// CommonModule provides core directives used by templates
import { CommonModule } from "@angular/common";
// FormsModule enables two-way binding for quick inline edits
import { FormsModule } from "@angular/forms";
// Import our API service and Task type
import { TasksService, Task } from "../services/tasks.service";

@Component({
  selector: "app-tasks", // tag used in HTML to place this component
  templateUrl: "./tasks.component.html", // external template file
  styleUrls: ["./tasks.component.css"], // external styles file
  standalone: true, // standalone component (no NgModule required)
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // modules available to this component
})
export class TasksComponent implements OnInit {
  // Signal from the service that holds Task[]; read via tasks()
  tasks: any;
  // Reactive form instance for creating a task
  form: any;
  // Track which task is currently being edited
  editingId: string | null = null;
  // Local buffer for edited task name
  editName = "";

  // Inject FormBuilder and the TasksService
  constructor(private fb: FormBuilder, private api: TasksService) {
    // Bind local reference to the service's tasks signal
    this.tasks = this.api.tasks;
    // Build the form with validation: required and max length 60
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(60)]],
    });
  }

  // Lifecycle: load tasks when the component initializes
  ngOnInit() {
    this.refresh();
  }

  // Fetch latest tasks: updates the service signal internally
  refresh() {
    this.api.list();
  }

  // Create a task from the form value, then clear the form
  create() {
    if (this.form.invalid) return; // guard against invalid submissions
    const name = this.form.value.name as string; // read the input value
    this.api.create({ name }); // call service to create, then refreshes
    this.form.reset(); // clear the form inputs
  }

  // Enter edit mode for a given task and preload its name
  startEdit(t: Task) {
    this.editingId = t._id ?? null; // set current editing id
    this.editName = t.name; // preload name into edit buffer
  }

  // Persist the edited name via PATCH and exit edit mode
  saveEdit(t: Task) {
    const id = t._id as string;
    const name = this.editName.trim(); // trim whitespace
    if (!name) return; // basic guard against empty name
    this.api.update(id, { name }); // patch only the name
    this.editingId = null; // exit edit mode
    this.editName = ""; // clear buffer
  }

  // Cancel edit mode without saving changes
  cancelEdit() {
    this.editingId = null;
    this.editName = "";
  }

  // Toggle the completed flag for a given task
  toggle(t: Task) {
    const id = t._id as string; // read the task id
    this.api.update(id, { completed: !t.completed }); // invert and persist
  }

  // Remove a task by id
  remove(t: Task) {
    const id = t._id as string; // read the task id
    this.api.remove(id); // delete and refresh
  }
}
```

</details>

<details><summary><code>src/app/tasks/tasks.component.html</code> — commented</summary>

```html
<!-- Outer layout wrapper centers the card and sets width -->
<div class="wrap">
  <!-- Card container provides panel styling -->
  <div class="card">
    <!-- Section title -->
    <h2>Tasks</h2>

    <!-- Reactive form: bound to "form" group; submit calls create() -->
    <form [formGroup]="form" (ngSubmit)="create()" class="form">
      <!-- Label wraps the text input (formControlName binds to the form's control) -->
      <label>
        Name
        <input type="text" formControlName="name" />
      </label>
      <!-- Submit is disabled when the form is invalid (required/maxLength) -->
      <button type="submit" [disabled]="form.invalid">Add Task</button>
    </form>

    <!-- List container displaying tasks or an empty state -->
    <ul>
      <!-- Modern Angular control flow: iterate tasks; track by _id for efficient DOM updates -->
      @for (t of tasks(); track t._id) {
      <li>
        <!-- Checkbox reflects completed state; change event toggles completion -->
        <input type="checkbox" [checked]="t.completed" (change)="toggle(t)" />

        <!-- Inline edit: when editing this task, show input + actions -->
        @if (editingId === t._id) {
        <input
          type="text"
          class="inline"
          [(ngModel)]="editName"
          maxlength="20"
        />
        <button type="button" (click)="saveEdit(t)">Save</button>
        <button type="button" (click)="cancelEdit()">Cancel</button>
        } @else {
        <!-- Display name and Edit action when not editing -->
        {{ t.name }}
        <button type="button" (click)="startEdit(t)">Edit</button>
        }

        <!-- Delete button triggers remove(t) to delete the task -->
        <button type="button" class="danger" (click)="remove(t)">Delete</button>
      </li>
      } @empty {
      <!-- Empty state when tasks array has no items -->
      <li class="muted">No tasks</li>
      }
    </ul>
  </div>
</div>
```

</details>

<details><summary><code>src/app/tasks/tasks.component.css</code></summary>

```css
/* Light, accessible styles for the Tasks component */
:root {
  --bg: #fff;
  --panel: #fff;
  --muted: #6b7280;
  --text: #0b0f1a;
  --primary: #3b82f6;
  --primary-600: #2563eb;
  --danger: #ef4444;
  --ok: #22c55e;
  --ring: rgba(59, 130, 246, 0.25);
}
* {
  box-sizing: border-box;
}
:host {
  display: block;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 2rem 1.25rem;
}
.wrap {
  max-width: 720px;
  margin: 0 auto;
}
.card {
  background: var(--panel);
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  padding: 1.25rem;
}
.form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: end;
  margin-bottom: 1rem;
}
.form label {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
}
.form input[type="text"] {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: var(--text);
  outline: none;
  transition: box-shadow 150ms ease, border-color 150ms ease;
}
.form input[type="text"]:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 6px var(--ring);
}
.form button[type="submit"] {
  padding: 0.7rem 1rem;
  border-radius: 12px;
  border: 1px solid #cfe0ff;
  background: #eaf2ff;
  color: var(--primary-600);
  font-weight: 700;
  cursor: pointer;
  transition: transform 150ms ease, filter 150ms ease, opacity 150ms ease;
}
.form button[type="submit"]:hover {
  filter: brightness(1.03);
}
.form button[type="submit"]:active {
  transform: translateY(1px);
}
.form button[type="submit"][disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}
li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  background: #fff;
}
li input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 2px solid #9ca3af;
  display: grid;
  place-content: center;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;
}
li input[type="checkbox"]:checked {
  border-color: var(--ok);
  background: #dcfce7;
}
li input[type="checkbox"]:checked::after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: var(--ok);
}
li button {
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: var(--text);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease,
    transform 150ms ease;
}
li button:hover {
  background: #f8fafc;
  border-color: #bfd3ff;
}
li button:active {
  transform: translateY(1px);
}
li button.danger {
  border-color: #ffd6d6;
  background: #fff1f1;
  color: #7f1d1d;
}
li button.danger:hover {
  background: #ffe9e9;
}
.muted {
  color: var(--muted);
}
```

</details>

<details><summary><code>src/app/app.component.ts</code> — commented</summary>

```ts
// Root application component
import { Component } from "@angular/core";
// Import the standalone TasksComponent to render it directly
import { TasksComponent } from "./tasks/tasks.component";

@Component({
  selector: "app-root", // root element used by Angular bootstrap
  // Render the tasks feature directly in the root template
  template: `<app-tasks />`,
  // Include TasksComponent in this standalone component's imports
  standalone: true,
  imports: [TasksComponent],
})
export class AppComponent {}
```

</details>

<details><summary><code>src/app/app.component.html</code> — commented</summary>

```html
<!-- Root template renders the Tasks feature component -->
<app-tasks />
```

</details>

## Try It

Ensure the backend from `12_15_25_Lecture/backend` is running on port `3000`.

Backend:

```bash
cd ../backend
npm install
npm run dev
```

Angular:

```bash
cd tasks-client
ng s -o
```

Visit `http://localhost:4200` and try:

- Add a task, toggle completed, delete
- Verify network calls to `http://localhost:3000/api/v1/tasks[...]`

If CORS errors appear, confirm the backend enables CORS for `http://localhost:4200` and allows methods GET/POST/PATCH/DELETE.

---

End of Angular 19.2.3 client walkthrough.

---

## Final Code (Uncommented)

<!-- Environments removed in final code -->

<details><summary><code>src/app/services/tasks.service.ts</code></summary>

```ts
import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
export interface Task {
  _id?: string;
  name: string;
  completed?: boolean;
}

@Injectable({ providedIn: "root" })
export class TasksService {
  private base = "http://localhost:3000";
  tasks = signal<Task[]>([]);

  constructor(private http: HttpClient) {}

  list() {
    this.http
      .get<{ success: boolean; payload: Task[] }>(`${this.base}/api/v1/tasks`)
      .subscribe((res) => this.tasks.set(res.payload ?? []));
  }

  async get(id: string): Promise<Task> {
    const res = await this.http
      .get<{ success: boolean; payload: Task }>(
        `${this.base}/api/v1/tasks/${id}`
      )
      .toPromise();
    return (res?.payload as Task) ?? ({ name: "" } as Task);
  }

  create(task: Task) {
    this.http
      .post<{ success: boolean; payload: Task }>(
        `${this.base}/api/v1/tasks`,
        task
      )
      .subscribe(() => this.list());
  }

  update(id: string, patch: Partial<Task>) {
    this.http
      .patch<{ success: boolean; payload: { updatedTask: Task } }>(
        `${this.base}/api/v1/tasks/${id}`,
        patch
      )
      .subscribe(() => this.list());
  }

  remove(id: string) {
    this.http
      .delete<{ success: boolean }>(`${this.base}/api/v1/tasks/${id}`)
      .subscribe(() => this.list());
  }
}
```

</details>

<!-- Interceptors removed in final code -->

<details><summary><code>src/app/app.config.ts</code></summary>

```ts
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { provideHttpClient } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, ReactiveFormsModule),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
```

</details>

<details><summary><code>src/app/app.component.ts</code></summary>

```ts
import { Component } from "@angular/core";
import { TasksComponent } from "./tasks/tasks.component";

@Component({
  selector: "app-root",
  template: `<app-tasks />`,
  standalone: true,
  imports: [TasksComponent],
})
export class AppComponent {}
```

</details>

<details><summary><code>src/app/app.component.html</code></summary>

```html
<app-tasks />
```

</details>

<details><summary><code>src/app/tasks/tasks.component.ts</code></summary>

```ts
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TasksService, Task } from "../services/tasks.service";

@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class TasksComponent implements OnInit {
  tasks: any;
  form: any;
  editingId: string | null = null;
  editName = "";

  constructor(private fb: FormBuilder, private api: TasksService) {
    this.tasks = this.api.tasks;
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(60)]],
    });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.list();
  }

  create() {
    if (this.form.invalid) return;
    const name = this.form.value.name as string;
    this.api.create({ name });
    this.form.reset();
  }

  startEdit(t: Task) {
    this.editingId = t._id ?? null;
    this.editName = t.name;
  }

  saveEdit(t: Task) {
    const id = t._id as string;
    const name = this.editName.trim();
    if (!name) return;
    this.api.update(id, { name });
    this.editingId = null;
    this.editName = "";
  }

  cancelEdit() {
    this.editingId = null;
    this.editName = "";
  }

  toggle(t: Task) {
    const id = t._id as string;
    this.api.update(id, { completed: !t.completed });
  }

  remove(t: Task) {
    const id = t._id as string;
    this.api.remove(id);
  }
}
```

</details>

<details><summary><code>src/app/tasks/tasks.component.html</code></summary>

```html
<div class="wrap">
  <div class="card">
    <h2>Tasks</h2>

    <form [formGroup]="form" (ngSubmit)="create()" class="form">
      <label>
        Name
        <input type="text" formControlName="name" />
      </label>
      <button type="submit" [disabled]="form.invalid">Add Task</button>
    </form>

    <ul>
      @for (t of tasks(); track t._id) {
      <li>
        <input type="checkbox" [checked]="t.completed" (change)="toggle(t)" />

        @if (editingId === t._id) {
        <input
          type="text"
          class="inline"
          [(ngModel)]="editName"
          maxlength="20"
        />
        <button type="button" (click)="saveEdit(t)">Save</button>
        <button type="button" (click)="cancelEdit()">Cancel</button>
        } @else { {{ t.name }}
        <button type="button" (click)="startEdit(t)">Edit</button>
        }

        <button type="button" class="danger" (click)="remove(t)">Delete</button>
      </li>
      } @empty {
      <li class="muted">No tasks</li>
      }
    </ul>
  </div>
</div>
```

</details>

<details><summary><code>src/app/tasks/tasks.component.css</code></summary>

```css
:root {
  --bg: #fff;
  --panel: #fff;
  --muted: #6b7280;
  --text: #0b0f1a;
  --primary: #3b82f6;
  --primary-600: #2563eb;
  --danger: #ef4444;
  --ok: #22c55e;
  --ring: rgba(59, 130, 246, 0.25);
}
* {
  box-sizing: border-box;
}
:host {
  display: block;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 2rem 1.25rem;
}
.wrap {
  max-width: 720px;
  margin: 0 auto;
}
.card {
  background: var(--panel);
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  padding: 1.25rem;
}
.form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: end;
  margin-bottom: 1rem;
}
.form label {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
}
.form input[type="text"] {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: var(--text);
  outline: none;
  transition: box-shadow 150ms ease, border-color 150ms ease;
}
.form input[type="text"]:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 6px var(--ring);
}
.form button[type="submit"] {
  padding: 0.7rem 1rem;
  border-radius: 12px;
  border: 1px solid #cfe0ff;
  background: #eaf2ff;
  color: var(--primary-600);
  font-weight: 700;
  cursor: pointer;
  transition: transform 150ms ease, filter 150ms ease, opacity 150ms ease;
}
.form button[type="submit"]:hover {
  filter: brightness(1.03);
}
.form button[type="submit"]:active {
  transform: translateY(1px);
}
.form button[type="submit"][disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}
li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  background: #fff;
}
li input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 2px solid #9ca3af;
  display: grid;
  place-content: center;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;
}
li input[type="checkbox"]:checked {
  border-color: var(--ok);
  background: #dcfce7;
}
li input[type="checkbox"]:checked::after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: var(--ok);
}
li button {
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: var(--text);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease,
    transform 150ms ease;
}
li button:hover {
  background: #f8fafc;
  border-color: #bfd3ff;
}
li button:active {
  transform: translateY(1px);
}
li button.danger {
  border-color: #ffd6d6;
  background: #fff1f1;
  color: #7f1d1d;
}
li button.danger:hover {
  background: #ffe9e9;
}
.muted {
  color: var(--muted);
}
```

</details>
