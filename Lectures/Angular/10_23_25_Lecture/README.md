# Student Practice Walkthrough – HTTP Requests, Responses, and Routing (Beginner Friendly)

## Before You Start: HttpClient, Router, and OnPush (Plain English)

Imagine your app needs to talk to a website to get or save data. HttpClient is a helper that sends letters (HTTP requests) and reads the replies (HTTP responses). You ask for JSON, it gives you JavaScript objects. You can also show a loading message while you wait, and show a helpful error if something goes wrong.

At the same time, the Angular Router is your app’s GPS. It decides which screen (component) to show for a given URL like /a-http-basics. In this lesson we’ll navigate between each exercise using routes and a small navbar. We’ll also use lazy loading so a page’s code only loads when you visit it.

When to use HttpClient:

- Get data to show on the page (lists, details, etc.)
- Send form data to create or update something
- Delete items on the server
- Add headers (like Authorization) or query parameters (?page=2)
- Centralize behavior with interceptors (add a token to every request)

Why this is useful: Your app stays in sync with the server. You can handle loading, success, and errors in a clean, predictable way.

When to use the Router:

- Split your app into pages (routes) like /list, /details/42, or /settings
- Create a clean navigation experience with links and browser back/forward
- Lazy load pages so the first load is fast

Key Router pieces in this lesson:

- RouterOutlet: placeholder where the current route’s component renders
- RouterLink: link directive for navigation in templates
- provideRouter(routes): enables routing in app.config.ts
- loadComponent: lazy-load a standalone component per route

Change detection: OnPush (why and how)

- What: OnPush tells Angular to re-render a component only when something meaningful changes (an @Input reference changes, an event happens in the component, an Observable used with async pipe emits, or a Signal read in the template changes). This reduces unnecessary checks.
- Why: Faster apps and fewer surprise re-renders—especially nice when using Signals and immutable updates.
- How: Add changeDetection: ChangeDetectionStrategy.OnPush to each component’s decorator. Signals and async pipe keep working naturally with OnPush.

FAQ: Do I still need provideZoneChangeDetection?

- No—OnPush does not require provideZoneChangeDetection. Your app will work without it. Some teams add provideZoneChangeDetection({ eventCoalescing: true }) for additional event coalescing optimizations, but it’s optional and not needed for these exercises.

Example:

<details><summary><code>Enable OnPush on a component</code></summary>

```ts
import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-example",
  standalone: true,
  template: `<p>Example</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {}
```

</details>

You will build 11 small demos:

- Part A — Simple GET: load and show data
- Part B — Loading and error states
- Part C — Query parameters (filtering)
- Part D — POST JSON (create)
- Part E — PATCH JSON (update part of an item)
- Part F — DELETE (remove an item)
- Part G — Custom headers
- Part H — Interceptor for auth header
- Part I — Debounced search with cancel
- Part J — Retry with backoff on failure
- Part K — Auth Guard (protect a route)

Each has explicit goals & checkpoints. Read the HINTS only if you get stuck.

---

## Prerequisites

Project created and dev server running:

```bash
ng new http-requests-intro --skip-tests
cd http-requests-intro
ng serve --open
```

Enable HttpClient and Router for your app (standalone apps):

<details><summary><code>src/app/app.config.ts</code> (provide HttpClient + Router)</summary>

```ts
import { ApplicationConfig } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    // Basic HttpClient. In Part H, we'll show withInterceptors([...]).
    provideHttpClient(),
    // Enable the Angular Router and supply our routes
    provideRouter(routes),
  ],
};
```

</details>

### One-time: Add routes and a root shell

We’ll render all exercises via routes. Create a routes file and a simple AppComponent shell with a nav and a router outlet.

<details><summary><code>src/app/app.routes.ts</code> (Routes)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // leave blank for now
];
```

</details>

<details><summary><code>src/app/app.component.ts</code> (Root shell)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd,
} from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  // Import RouterOutlet, RouterLink, RouterLinkActive
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // Reactive state: the active exercise letter shown in the legend ("A"–"K")
  activeLetter = signal<string>("A");
  // Get Router via functional DI (no constructor parameter needed)
  private router = inject(Router);

  constructor() {
    // Seed the letter based on the current URL (e.g., '/c-http-params' => 'C')
    this.setLetterFromUrl(this.router.url);
    // Listen for completed navigations and update the letter accordingly
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.setLetterFromUrl(e.urlAfterRedirects));
  }

  private setLetterFromUrl(url: string) {
    // Grab the first path segment from '/a-http-basics/...' => 'a-http-basics'
    const firstSeg = url.split("/").filter(Boolean)[0] || "a-http-basics";
    // Use the first character of the segment (a–j) and uppercase it to show in the badge
    const letter = firstSeg.charAt(0).toUpperCase();
    this.activeLetter.set(letter);
  }
}
```

</details>

<details><summary><code>src/app/app.component.html</code> (Nav + outlet)</summary>

```html
<nav class="nav">
  <div class="nav-grid">
    <!-- Each link navigates to a lazy-loaded exercise route and highlights when active -->
    <a routerLink="/a-http-basics" routerLinkActive="active" class="chip">
      <span class="badge">A</span>
      <span>Simple GET</span>
    </a>
    <a routerLink="/b-http-states" routerLinkActive="active" class="chip">
      <span class="badge">B</span>
      <span>Loading & Error</span>
    </a>
    <a routerLink="/c-http-params" routerLinkActive="active" class="chip">
      <span class="badge">C</span>
      <span>Query Params</span>
    </a>
    <a routerLink="/d-http-post" routerLinkActive="active" class="chip">
      <span class="badge">D</span>
      <span>POST</span>
    </a>
    <a routerLink="/e-http-patch" routerLinkActive="active" class="chip">
      <span class="badge">E</span>
      <span>PATCH</span>
    </a>
    <a routerLink="/f-http-delete" routerLinkActive="active" class="chip">
      <span class="badge">F</span>
      <span>DELETE</span>
    </a>
    <a routerLink="/g-http-headers" routerLinkActive="active" class="chip">
      <span class="badge">G</span>
      <span>Headers</span>
    </a>
    <a routerLink="/h-http-interceptor" routerLinkActive="active" class="chip">
      <span class="badge">H</span>
      <span>Interceptor</span>
    </a>
    <a routerLink="/i-http-search" routerLinkActive="active" class="chip">
      <span class="badge">I</span>
      <span>Search</span>
    </a>
    <a routerLink="/j-http-retry" routerLinkActive="active" class="chip">
      <span class="badge">J</span>
      <span>Retry</span>
    </a>
    <a routerLink="/k-auth-guard" routerLinkActive="active" class="chip">
      <span class="badge">K</span>
      <span>Auth Guard</span>
    </a>
  </div>
  <hr />
  <div class="legend">
    <!-- dot-badge shows the active route letter coming from AppComponent.activeLetter() -->
    <span class="legend-item"
      ><span class="dot-badge">{{ activeLetter() }}</span> Active route</span
    >
  </div>
</nav>

<!-- Router renders the active exercise component here -->
<router-outlet></router-outlet>
```

</details>

<details><summary><code>src/app/app.component.css</code> (Styles)</summary>

```css
nav.nav {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
    sans-serif;
}
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px 12px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #dbeafe;
  color: #1e3a8a;
  background: linear-gradient(#f8fafc, #eff6ff);
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.12);
  transition: background 0.15s ease, border-color 0.15s ease,
    transform 0.05s ease, box-shadow 0.15s ease;
}
.chip:hover {
  background: #e0f2fe;
  border-color: #bae6fd;
}
.chip.active {
  border-color: #60a5fa;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.22), inset 0 0 0 1px #93c5fd;
}
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #3b82f6;
  color: white;
  font-weight: 700;
  font-size: 12px;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.3);
}
.legend {
  margin-top: 10px;
  color: #64748b;
  font-size: 12px;
}
.legend .dot-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #3b82f6;
  color: #fff;
  font-weight: 700;
  font-size: 11px;
  margin-right: 6px;
  vertical-align: middle;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.3);
}
hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 12px 0 12px;
}

/* K: Auth Guard toggle button */
.auth-btn {
  margin-left: 12px;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.auth-btn:hover {
  background: #f3f4f6;
}
```

</details>

Notes:

- Angular version: examples assume Angular 19.2.3 with standalone components and new control flow.
- For demo endpoints we use public APIs (jsonplaceholder, httpbin, dummyjson, httpstat.us). They are fine for learning; some are read-only or rate-limited.

### Why lazy loading?

- Faster initial load: routes only load the code for a component when you navigate to it.
- Smaller main bundle: each exercise is split out, which helps with real-world app performance.
- No NgModules required: Angular’s standalone components + `loadComponent` make lazy loading straightforward.

Tip: Keep route paths and folder names aligned (e.g., `http-basics` → `./http-basics/http-basics.component`).

---

## Part A: Simple GET – Load and Show Data

Plain English: Click a button to send an HTTP GET to a public API. Angular’s HttpClient returns an Observable; when we subscribe, the network call starts and we receive an array of posts. We store that array in a signal, and the template uses @for to render each title. You’ll also see how a click handler calls a method that updates reactive state.
Why this is useful: Learn the basic “ask the server, show the data” flow.

Goal: Create a component that loads posts from JSONPlaceholder and displays them.

### A1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component http-basics --skip-tests
```

</details>

### A1.5. Enable OnPush

Add OnPush so the component re-renders only on meaningful changes.

<details><summary><code>src/app/http-basics/http-basics.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-http-basics",
  standalone: true,
  templateUrl: "./http-basics.component.html",
  styleUrls: ["./http-basics.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpBasicsComponent {
  // existing code… signals and inject(HttpClient) work great with OnPush
}
```

</details>

### A2. Component State

Inject HttpClient, add a `load()` method, store results in a signal.

<details><summary><code>src/app/http-basics/http-basics.component.ts</code> (State)</summary>

```ts
// Import core Angular utilities and HttpClient for making HTTP requests
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

// Define the shape of a Post coming back from the API
type Post = { userId: number; id: number; title: string; body: string };

@Component({
  selector: "app-http-basics", // HTML tag you'll use in templates
  standalone: true, // This component doesn't need an NgModule
  templateUrl: "./http-basics.component.html", // The template file for the UI
  styleUrls: ["./http-basics.component.css"],
  // Reflect the OnPush setting from the previous step
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpBasicsComponent {
  // A writable signal to hold the list of posts once loaded
  posts = signal<Post[]>([]);
  // Inject HttpClient via inject() for a clean standalone pattern
  private http = inject(HttpClient);

  // When called, fetch posts from the public demo API
  load() {
    this.http
      // Ask for an array of Post objects from the URL
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      // Subscribe to start the request and set the signal when data arrives
      // subscribe starts the request; 'next' gives us the response data
      .subscribe((data) => this.posts.set(data));
  }
}
```

</details>

### A3. Template Markup

Button triggers load; list shows titles.

<details><summary><code>src/app/http-basics/http-basics.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the a-http-basics route</h3>
  <!-- Click the button to trigger the HTTP GET request -->
  <button (click)="load()">Load posts</button>

  <!-- Render a list of titles when posts() has data -->
  <ul>
    <!-- @for is Angular's control flow to loop over arrays; track by id for efficiency -->
    @for (p of posts(); track p.id) {
    <li>{{ p.title }}</li>
    }
  </ul>

  <!-- Show a helpful message when no data is loaded yet -->
  @if (!posts().length) {
  <p class="muted">No posts loaded yet.</p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-basics/http-basics.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
button {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: linear-gradient(#eff6ff, #dbeafe);
  color: #1e3a8a;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.15);
}
button:hover {
  filter: brightness(0.98);
}
ul {
  list-style: none;
  padding: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
li {
  padding: 8px 10px;
  border-top: 1px solid #f3f4f6;
}
li:first-child {
  border-top: 0;
}
.muted {
  color: #64748b;
}
```

</details>

---

### A4. Routing — Add a route and link

- Add this entry to your routes file and optionally set the default redirect.

<details><summary><code>src/app/app.routes.ts</code> (add Part A)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Route for Part A — place above redirects
  {
    path: "a-http-basics",
    // Lazy-load the standalone component (code-splitting)
    loadComponent: () =>
      import("./http-basics/http-basics.component").then(
        (m) => m.HttpBasicsComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part A: Simple GET” (or go to /a-http-basics).

### A5. Run and Observe

- Navigate to “Part A: Simple GET” in the nav.
- Expected: Click “Load posts” to fetch and render a list of post titles.

---

## Part B: Loading and Error States

Plain English: Model the request lifecycle with two signals: loading and error. Before the GET, set loading to true and clear any previous error. Subscribe using an object so you can handle next (success), error (failure), and complete (always runs). The template uses @if branches to show “Loading…”, a friendly error message, or the list of posts.
Why this is useful: Users understand what’s happening and what went wrong.

Goal: Add `loading` and `error` signals and render them with control flow.

### B1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component http-states --skip-tests
```

</details>

### B1.5. Enable OnPush

<details><summary><code>src/app/http-states/http-states.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-http-states",
  standalone: true,
  templateUrl: "./http-states.component.html",
  styleUrls: ["./http-states.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpStatesComponent {
  // existing code…
}
```

</details>

### B2. Component State

Track loading and error around the request.

<details><summary><code>src/app/http-states/http-states.component.ts</code> (State)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

// The API response type
type Post = { userId: number; id: number; title: string; body: string };

@Component({
  selector: "app-http-states",
  standalone: true,
  templateUrl: "./http-states.component.html",
  styleUrls: ["./http-states.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpStatesComponent {
  // Holds the posts when loaded; null means we haven't loaded yet
  posts = signal<Post[] | null>(null);
  // True while we are waiting for the server to respond
  loading = signal(false);
  // Holds a human-readable error message if the request fails
  error = signal<string | null>(null);

  private http = inject(HttpClient);

  // Start loading, reset any previous error, and fetch posts
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      // subscribe with an Observer object so we can handle all states
      .subscribe({
        // next is called when the server responds successfully with data
        next: (data) => this.posts.set(data),
        // error is called if the request fails (network/server issue)
        error: (err) => this.error.set(this.getErrorMessage(err)),
        // complete is called after next when the observable finishes
        complete: () => this.loading.set(false),
      });
  }

  // Safely extract a message from unknown error shapes
  private getErrorMessage(err: unknown) {
    if (err && typeof err === "object" && "message" in err)
      return String((err as any).message);
    return String(err ?? "Unknown error");
  }
}
```

</details>

### B3. Template Markup

Use `@if` branches for loading, error, and data.

<details><summary><code>src/app/http-states/http-states.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the b-http-states route</h3>
  <!-- Disable the button while loading to prevent duplicate requests -->
  <button (click)="load()" [disabled]="loading()">Load posts</button>

  <!-- Show different UI depending on the request state -->
  @if (loading()) {
  <!-- Loading state -->
  <p class="muted">Loading…</p>
  } @else if (error()) {
  <!-- Error state -->
  <p class="error">Error: {{ error() }}</p>
  } @else if (posts()) {
  <!-- Success state -->
  <ul>
    @for (p of posts()!; track p.id) {
    <li>{{ p.title }}</li>
    }
  </ul>
  } @else {
  <!-- Initial state (nothing loaded yet) -->
  <p class="muted">Click to load posts.</p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-states/http-states.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
button {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: linear-gradient(#eff6ff, #dbeafe);
  color: #1e3a8a;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.15);
}
button[disabled] {
  opacity: 0.6;
  cursor: default;
}
.muted {
  color: #64748b;
}
.error {
  color: #b91c1c;
}
ul {
  list-style: none;
  padding: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
li {
  padding: 8px 10px;
  border-top: 1px solid #f3f4f6;
}
li:first-child {
  border-top: 0;
}
```

</details>

---

### B4. Routing — Add a route and link

<details><summary><code>src/app/app.routes.ts</code> (add Part B)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Previous routes
  {
    path: "b-http-states",
    // Lazy-load the component so its JS is only loaded on demand
    loadComponent: () =>
      import("./http-states/http-states.component").then(
        (m) => m.HttpStatesComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part B: Loading & Error”.

### B5. Run and Observe

- Navigate to Part B and click Load.
- Expected: Button disables while loading; error shows on failure; otherwise the list renders.

---

## Part C: Query Parameters (Filtering)

Plain English: Add a query string like ?userId=1 without hand-assembling URLs by using HttpParams. A `<select>` updates a signal for the chosen userId; when you click “Load filtered,” we create HttpParams and pass them to HttpClient.get. The server returns only matching posts and we display them.
Why this is useful: Filter results without changing the server code.

Goal: Use HttpParams to add a query parameter and fetch filtered results.

### C1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component http-params --skip-tests
```

</details>

### C1.5. Enable OnPush

<details><summary><code>src/app/http-params/http-params.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-http-params",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-params.component.html",
  styleUrls: ["./http-params.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpParamsComponent {
  // existing code…
}
```

</details>

### C2. Component State

Use `HttpParams` to set `userId`.

<details><summary><code>src/app/http-params/http-params.component.ts</code> (State)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

// API response type
type Post = { userId: number; id: number; title: string; body: string };

@Component({
  selector: "app-http-params",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-params.component.html",
  styleUrls: ["./http-params.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpParamsComponent {
  // Control which user's posts we request via a query parameter
  userId = signal(1);
  // Hold the filtered posts
  posts = signal<Post[]>([]);

  private http = inject(HttpClient);

  // Build a query string like ?userId=1 using HttpParams and request data
  load() {
    const params = new HttpParams().set("userId", String(this.userId()));
    this.http
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts", { params })
      // subscribe starts the request; 'next' receives the filtered results
      .subscribe((data) => this.posts.set(data));
  }
}
```

</details>

### C3. Template Markup

Pick a userId then load.

<details><summary><code>src/app/http-params/http-params.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the c-http-params route</h3>
  <!-- Choose which userId to filter on using Angular's ngModel binding -->
  <label>
    User:
    <select [ngModel]="userId()" (ngModelChange)="userId.set(+$event)">
      <option [value]="1">User 1</option>
      <option [value]="2">User 2</option>
      <option [value]="3">User 3</option>
      <option [value]="4">User 4</option>
      <option [value]="5">User 5</option>
    </select>
  </label>

  <!-- Fetch results using the selected userId -->
  <button (click)="load()">Load filtered</button>

  <!-- Render the filtered results -->
  <ul>
    @for (p of posts(); track p.id) {
    <li>#{{ p.id }} – {{ p.title }}</li>
    }
  </ul>
</section>
```

</details>

<details><summary><code>src/app/http-params/http-params.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}
select,
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: #ffffff;
}
button {
  background: linear-gradient(#eff6ff, #dbeafe);
  color: #1e3a8a;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.15);
}
button:hover {
  filter: brightness(0.98);
}
ul {
  list-style: none;
  padding: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
li {
  padding: 8px 10px;
  border-top: 1px solid #f3f4f6;
}
li:first-child {
  border-top: 0;
}
```

</details>

---

### C4. Routing — Add a route and link

<details><summary><code>src/app/app.routes.ts</code> (add Part C)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Previous routes
  {
    path: "c-http-params",
    // Lazy-load the component file via dynamic import
    loadComponent: () =>
      import("./http-params/http-params.component").then(
        (m) => m.HttpParamsComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part C: Query Params”.

### C5. Run and Observe

- Navigate to Part C, choose a userId, then click Load.
- Expected: Only that user’s posts are shown.

---

## Part D: POST JSON (Create)

Plain English: Build a tiny form (title + body) bound to signals. When you click Create, we send a POST with a JSON body. The demo API echoes a created record with a fake id; we capture it in a signal and show the id. We also disable the button while the request is in flight for a realistic UX.
Why this is useful: Create new records from form data.

Goal: Submit title/body as JSON and show the created id.

### D1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component http-post --skip-tests
```

</details>

### D1.5. Enable OnPush

<details><summary><code>src/app/http-post/http-post.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-http-post",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-post.component.html",
  styleUrls: ["./http-post.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpPostComponent {
  // existing code…
}
```

</details>

### D2. Component State

Build a simple form with signals; POST to JSONPlaceholder.

<details><summary><code>src/app/http-post/http-post.component.ts</code> (State)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

// The API returns the created record with a fake id
type Created = { id: number; title: string; body: string; userId: number };

@Component({
  selector: "app-http-post",
  standalone: true,
  imports: [FormsModule], // enable [(ngModel)] binding in the template
  templateUrl: "./http-post.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpPostComponent {
  // Form fields as signals
  title = signal("");
  body = signal("");
  // Holds the server response after creation
  result = signal<Created | null>(null);
  // Controls the disabled state of the submit button
  loading = signal(false);

  private http = inject(HttpClient);

  // Send a POST request with the form data as JSON
  submit() {
    this.loading.set(true);
    this.result.set(null);
    this.http
      .post<Created>("https://jsonplaceholder.typicode.com/posts", {
        title: this.title(),
        body: this.body(),
        userId: 1,
      })
      // subscribe so we can update state from the async response
      .subscribe({
        // next gives us the created item from the server
        next: (res) => this.result.set(res),
        // complete runs when the observable finishes (after next)
        complete: () => this.loading.set(false),
      });
  }
}
```

</details>

### D3. Template Markup

Simple form and result display.

<details><summary><code>src/app/http-post/http-post.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the d-http-post route</h3>
  <!-- Two-way bind inputs to the title and body signals -->
  <label
    >Title: <input [ngModel]="title()" (ngModelChange)="title.set($event)"
  /></label>
  <label
    >Body:
    <textarea [ngModel]="body()" (ngModelChange)="body.set($event)"></textarea>
  </label>

  <!-- Disable the button while submitting -->
  <button (click)="submit()" [disabled]="loading()">Create</button>

  <!-- Show the server-assigned id after creation -->
  @if (result()) {
  <p>Created post id: <strong>{{ result()!.id }}</strong></p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-post/http-post.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
label {
  display: block;
  margin: 8px 0;
}
input,
textarea {
  width: 100%;
  max-width: 520px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: #ffffff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
}
button {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: linear-gradient(#eff6ff, #dbeafe);
  color: #1e3a8a;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.15);
}
button[disabled] {
  opacity: 0.6;
  cursor: default;
}
```

</details>

---

### D4. Routing — Add a route and link

<details><summary><code>src/app/app.routes.ts</code> (add Part D)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Previous routes
  {
    path: "d-http-post",
    // Lazy-load the standalone component for Part D
    loadComponent: () =>
      import("./http-post/http-post.component").then(
        (m) => m.HttpPostComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part D: POST”.

### D5. Run and Observe

- Navigate to Part D, fill the form, and click Create.
- Expected: You’ll see a created id from the response.

---

## Part E: PATCH JSON (Update Part of an Item)

Plain English: Perform a partial update using PATCH (unlike PUT, which replaces the whole object). You pick an id and a new title, then send only the changed field. The API echoes the “updated” record; we show the returned title so you can confirm the change.
Why this is useful: Smaller requests, less risk than replacing the whole thing.

Goal: PATCH a post’s title and show the server’s response.

### E1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component http-patch --skip-tests
```

</details>

### E1.5. Enable OnPush

<details><summary><code>src/app/http-patch/http-patch.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-http-patch",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-patch.component.html",
  styleUrls: ["./http-patch.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpPatchComponent {
  // existing code…
}
```

</details>

### E2. Component State

Pick an id and send a PATCH.

<details><summary><code>src/app/http-patch/http-patch.component.ts</code> (State)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

// The post shape used by the demo API
type Post = { id: number; title: string; body: string; userId: number };

@Component({
  selector: "app-http-patch",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-patch.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpPatchComponent {
  // Which post id to update
  id = signal(1);
  // New title to send in the PATCH body
  title = signal("Updated title");
  // Server response after the update
  result = signal<Post | null>(null);

  private http = inject(HttpClient);

  // PATCH only the fields that changed (title in this case)
  patch() {
    this.http
      .patch<Post>(`https://jsonplaceholder.typicode.com/posts/${this.id()}`, {
        title: this.title(),
      })
      // subscribe so we can update the UI with the patched data
      .subscribe((res) => this.result.set(res));
  }
}
```

</details>

### E3. Template Markup

<details><summary><code>src/app/http-patch/http-patch.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the e-http-patch route</h3>
  <!-- Choose which post id to update; keep the signal and input in sync -->
  <label>
    Post ID:
    <input type="number" [ngModel]="id()" (ngModelChange)="id.set(+$event)" />
  </label>

  <!-- New title we want to send in the PATCH request -->
  <label
    >New Title: <input [ngModel]="title()" (ngModelChange)="title.set($event)"
  /></label>

  <!-- Send the PATCH request -->
  <button (click)="patch()">PATCH</button>

  <!-- Show the returned title after the server responds -->
  @if (result()) {
  <p>Server responded with title: <strong>{{ result()!.title }}</strong></p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-patch/http-patch.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}
input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
}
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: linear-gradient(#eff6ff, #dbeafe);
  color: #1e3a8a;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.15);
}
button:hover {
  filter: brightness(0.98);
}
p {
  margin-top: 10px;
}
```

</details>

---

### E4. Routing — Add a route and link

<details><summary><code>src/app/app.routes.ts</code> (add Part E)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Previous routes
  {
    path: "e-http-patch",
    // Lazy-load the standalone component for Part E
    loadComponent: () =>
      import("./http-patch/http-patch.component").then(
        (m) => m.HttpPatchComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part E: PATCH”.

### E5. Run and Observe

- Navigate to Part E, set an ID and new title, then click PATCH.
- Expected: Server echoes the updated title.

---

## Part F: DELETE (Remove an Item)

Plain English: Practice an optimistic UI delete. Remove an item from the displayed list immediately so the app feels fast, then ask the server to delete it. If the request fails, roll back to the previous list. This teaches array updates, DELETE calls, and simple error recovery.
Why this is useful: Clean up records and reflect changes immediately.

Goal: Load a few posts, then delete one and optimistically update the UI.

### F1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component http-delete --skip-tests
```

</details>

### F1.5. Enable OnPush

<details><summary><code>src/app/http-delete/http-delete.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-http-delete",
  standalone: true,
  templateUrl: "./http-delete.component.html",
  styleUrls: ["./http-delete.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpDeleteComponent {
  // existing code…
}
```

</details>

### F2. Component State

Load first 10 posts; delete by id.

<details><summary><code>src/app/http-delete/http-delete.component.ts</code> (State)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

// API response type
type Post = { userId: number; id: number; title: string; body: string };

@Component({
  selector: "app-http-delete",
  standalone: true,
  templateUrl: "./http-delete.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpDeleteComponent {
  // Keep a list of posts to display and delete from
  posts = signal<Post[]>([]);

  private http = inject(HttpClient);

  // Load some demo posts (first 10) from the API
  load() {
    this.http
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      // subscribe and store the first 10 items for easy testing
      .subscribe((data) => this.posts.set(data.slice(0, 10)));
  }

  // Delete a post by id using an optimistic UI update
  remove(id: number) {
    // 1) Optimistically remove it from the UI
    const prev = this.posts();
    this.posts.set(prev.filter((p) => p.id !== id));

    // 2) Ask the server to delete; if it fails, roll back the UI
    this.http
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      // subscribe to perform the server-side delete and handle rollback on error
      .subscribe({
        // if the delete fails, restore the prior list so the UI is consistent
        error: () => {
          this.posts.set(prev);
        },
      });
  }
}
```

</details>

### F3. Template Markup

<details><summary><code>src/app/http-delete/http-delete.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the f-http-delete route</h3>
  <!-- Load a small list so it's easy to experiment with deletions -->
  <button (click)="load()">Load 10 posts</button>
  <ul>
    @for (p of posts(); track p.id) {
    <li>
      <!-- Show the title and a Delete action for each item -->
      {{ p.title }}
      <button (click)="remove(p.id)">Delete</button>
    </li>
    }
  </ul>
</section>
```

</details>

<details><summary><code>src/app/http-delete/http-delete.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  background: linear-gradient(#fee2e2, #fecaca);
  color: #7f1d1d;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.15);
}
button:hover {
  filter: brightness(0.98);
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 8px;
}
```

</details>

---

### F4. Routing — Add a route and link

<details><summary><code>src/app/app.routes.ts</code> (add Part F)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Previous routes
  {
    path: "f-http-delete",
    // Lazy-load the standalone component for Part F
    loadComponent: () =>
      import("./http-delete/http-delete.component").then(
        (m) => m.HttpDeleteComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part F: DELETE”.

### F5. Run and Observe

- Navigate to Part F, click Load 10 posts, then Delete on any row.
- Expected: The item disappears immediately (optimistic UI).

---

## Part G: Custom Headers

Plain English: HTTP “headers” are simple key–value pairs that travel with every request and response. Think of them as the shipping label on a package—they describe the message (who it’s for, what’s inside, how to handle it), but they’re not the package contents (the body). Requests commonly include Authorization, Content-Type, Accept, and custom keys like X-Api-Key. Responses include Content-Type, Cache-Control, ETag, Set-Cookie, and CORS-related headers. Header names are case-insensitive, and servers may normalize their casing when they echo them back.

Headers in practice — quick cheat sheet:

- Authentication: Authorization: Bearer <token> (don’t put tokens in query strings)
- Content negotiation: Content-Type: application/json (what you send), Accept: application/json (what you want back)
- Custom metadata: X-Api-Key, X-Request-Id, X-Correlation-Id (avoid PII)
- Caching: Cache-Control, ETag/If-None-Match to reduce bandwidth and speed up pages
- Multiple values: Some headers allow comma-separated lists (e.g., Accept)
- Angular specifics: HttpHeaders is immutable — .set() returns a NEW instance; .append() adds another value for the same name
- Interceptors: Best place to add cross-cutting headers (tokens, trace IDs) in one spot
- Browser limits: Some headers are forbidden to set from JS (Cookie, Host, Referer, User-Agent, Origin, etc.). CORS controls which response headers are visible to your app unless exposed via Access-Control-Expose-Headers
- Debugging: Use the Network tab to see sent/received headers; echo services like https://httpbin.org/anything are perfect for verifying what went over the wire

In this exercise, you’ll create HttpHeaders with a custom X-Api-Key, call httpbin (which echoes what it received), and display the echoed header value to confirm the header was sent correctly.

Why this is useful: Many APIs require headers for auth and content handling; knowing how to read, set, and debug them is essential.

Goal: Send a request with custom headers and display what the server saw.

### G1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component http-headers --skip-tests
```

</details>

### G1.5. Enable OnPush

<details><summary><code>src/app/http-headers/http-headers.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-http-headers",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-headers.component.html",
  styleUrls: ["./http-headers.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpHeadersComponent {
  // existing code…
}
```

</details>

### G2. Component State

Use `HttpHeaders` and httpbin.org to echo them back.

<details><summary><code>src/app/http-headers/http-headers.component.ts</code> (State)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-http-headers",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-headers.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpHeadersComponent {
  // Enter an API key value that we will send as a custom header
  apiKey = signal("demo-key-123");
  // The server will echo back the headers; capture what it saw
  seenHeader = signal<string | null>(null);

  private http = inject(HttpClient);

  // Build custom headers and call httpbin.org to echo them back
  send() {
    const headers = new HttpHeaders({ "X-Api-Key": this.apiKey() });
    this.http
      .get<any>("https://httpbin.org/anything", { headers })
      // subscribe and read back the echoed header from httpbin
      .subscribe((res) =>
        this.seenHeader.set(res.headers["X-Api-Key"] ?? null)
      );
  }
}
```

</details>

### G3. Template Markup

<details><summary><code>src/app/http-headers/http-headers.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the g-http-headers route</h3>
  <!-- Bind the input to the apiKey signal so we can send it as a header -->
  <label
    >API Key: <input [ngModel]="apiKey()" (ngModelChange)="apiKey.set($event)"
  /></label>

  <!-- Send the request with custom headers -->
  <button (click)="send()">Send with header</button>

  <!-- Show the header value that the server reports back -->
  @if (seenHeader()) {
  <p>Server saw X-Api-Key: <strong>{{ seenHeader() }}</strong></p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-headers/http-headers.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}
input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
}
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: linear-gradient(#eff6ff, #dbeafe);
  color: #1e3a8a;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.15);
}
button:hover {
  filter: brightness(0.98);
}
p strong {
  color: #111;
}
```

</details>

---

### G4. Routing — Add a route and link

<details><summary><code>src/app/app.routes.ts</code> (add Part G)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Previous routes
  {
    path: "g-http-headers",
    // Lazy-load the standalone component for Part G
    loadComponent: () =>
      import("./http-headers/http-headers.component").then(
        (m) => m.HttpHeadersComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part G: Headers”.

### G5. Run and Observe

- Navigate to Part G, set an API key value, click Send.
- Expected: httpbin echoes back the header you sent.

---

## Part H: Interceptor for Auth Header

Plain English: Need a refresher on headers? See Part G. Here we focus on interceptors: a single, central hook in Angular to read or modify outgoing requests (and incoming responses) before they leave/arrive. We’ll attach an Authorization bearer token to every request via a functional interceptor and register it once in app.config.ts with withInterceptors. Verify it by calling httpbin and checking the echoed Authorization header.
Why this is useful: Centralizes cross‑cutting concerns (auth tokens, tracing, retries) without repeating code in every call.

Why interceptors?

- DRY and consistency: Add headers (like Authorization) in one place so every request is correct without copy‑pasting.
- Token lifecycle: Read the latest token from a service/store, refresh/rotate it centrally, and avoid stale headers.
- Central error handling: Handle 401/403 globally (e.g., sign‑out or redirect to login) and apply retries/backoff in one spot.
- Observability: Attach correlation/request IDs, log timings, and measure performance for all calls uniformly.
- Security and scoping: Keep sensitive logic out of components; optionally skip or scope headers by domain/path.
- Testability and maintenance: Swap or stub interceptors in tests; update behavior once instead of touching many files.

Goal: Create a functional interceptor that adds a bearer token. Configure it, then call any GET to see the header.

### H0. Commands

<details><summary>Commands</summary>

```bash
# Generate a functional interceptor (recommended)
ng g interceptor auth --functional --skip-tests --flat

# Generate a tiny demo component to verify the header
ng g component http-interceptor-demo --skip-tests
```

</details>

### H1. Create Interceptor

<details><summary><code>src/app/auth.interceptor.ts</code> (Functional interceptor)</summary>

```ts
import { HttpInterceptorFn } from "@angular/common/http";

// A functional interceptor that runs for every HTTP request
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // In real apps, retrieve token from a service or store
  const token = "demo-token-abc";
  // Clone the request and add an Authorization header
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  // Hand the modified request to the next handler in the chain
  return next(authReq);
};
```

</details>

### H2. Provide Interceptor

<details><summary><code>src/app/app.config.ts</code> (withInterceptors + Router)</summary>

```ts
import { ApplicationConfig } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { authInterceptor } from "./auth.interceptor";

export const appConfig: ApplicationConfig = {
  // Provide HttpClient and register our interceptor so it applies to all requests
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
  ],
};
```

</details>

### H2.5. Enable OnPush

<details><summary><code>src/app/http-interceptor-demo/http-interceptor-demo.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-http-interceptor-demo",
  standalone: true,
  templateUrl: "./http-interceptor-demo.component.html",
  styleUrls: ["./http-interceptor-demo.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpInterceptorDemoComponent {
  // existing code…
}
```

</details>

### H3. Demo Component

Call httpbin to see the Authorization header echoed back.

<details><summary><code>src/app/http-interceptor-demo/http-interceptor-demo.component.ts</code> (State)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-http-interceptor-demo",
  standalone: true,
  templateUrl: "./http-interceptor-demo.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpInterceptorDemoComponent {
  // We'll display whatever Authorization header the server says it received
  authHeader = signal<string | null>(null);
  private http = inject(HttpClient);

  // Make a GET request; the interceptor will add the Authorization header
  load() {
    // subscribe to see what Authorization header the server reports back
    this.http.get<any>("https://httpbin.org/anything").subscribe((res) => {
      this.authHeader.set(res.headers["Authorization"] ?? null);
    });
  }
}
```

</details>

<details><summary><code>src/app/http-interceptor-demo/http-interceptor-demo.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the h-http-interceptor route</h3>
  <!-- Clicking the button triggers a GET; the interceptor attaches the header -->
  <button (click)="load()">Call API</button>
  <!-- Show the Authorization header that httpbin echoes back -->
  @if (authHeader()) {
  <p>Authorization: <code>{{ authHeader() }}</code></p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-interceptor-demo/http-interceptor-demo.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: linear-gradient(#eff6ff, #dbeafe);
  color: #1e3a8a;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.15);
}
button:hover {
  filter: brightness(0.98);
}
code {
  background: #eef2ff;
  color: #312e81;
  padding: 2px 6px;
  border-radius: 4px;
}
```

</details>

---

### H4. Routing — Add a route and link

<details><summary><code>src/app/app.routes.ts</code> (add Part H)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Previous routes
  {
    path: "h-http-interceptor",
    // Lazy-load the standalone component for Part H
    loadComponent: () =>
      import("./http-interceptor-demo/http-interceptor-demo.component").then(
        (m) => m.HttpInterceptorDemoComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part H: Interceptor”.

### H5. Run and Observe

- Navigate to Part H and click Call API.
- Expected: You’ll see the Authorization header echoed in the response.

---

## Part I: Debounced Search with Cancel

Plain English: For search, don’t fire a request on every keypress. Push input values into a Subject, wait 300ms with debounceTime, ignore duplicates with distinctUntilChanged, and switchMap to the HTTP call so ongoing requests are canceled when new input arrives. Store and render the first 10 results for a responsive experience.
Why this is useful: Smooth search experiences and fewer wasted network calls.

Goal: Use RxJS `debounceTime` and `switchMap` with HttpClient to search products.

### I1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component http-search --skip-tests
```

</details>

### I1.5. Enable OnPush

<details><summary><code>src/app/http-search/http-search.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  effect,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-http-search",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-search.component.html",
  styleUrls: ["./http-search.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpSearchComponent {
  // existing code…
}
```

</details>

### I2. Component State

Use a Subject for input events, debounce, then switchMap to the HTTP call.

<details><summary><code>src/app/http-search/http-search.component.ts</code> (State)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  effect,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { Subject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";

// Result types for the search API
type Product = { id: number; title: string };
type SearchRes = { products: Product[] };

@Component({
  selector: "app-http-search",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-search.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpSearchComponent {
  // Bindable search query and results list
  query = signal("");
  results = signal<Product[]>([]);
  // Subject emits each time the user types; we will debounce this stream
  private input$ = new Subject<string>();

  constructor() {
    // Debounce rapid typing, ignore duplicates, and cancel previous requests
    this.input$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        // switchMap cancels the previous HTTP request when a new value arrives
        switchMap((q) => {
          if (!q.trim())
            return this.http.get<SearchRes>(
              "https://dummyjson.com/products/search?q="
            );
          return this.http.get<SearchRes>(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}`
          );
        })
      )
      // Update the results signal with the top 10 products
      // subscribe to push the latest search results into our signal
      .subscribe((res) => this.results.set(res.products.slice(0, 10)));
  }

  // Keep the query signal in sync and push values into the debounced stream
  private http = inject(HttpClient);
  onInput(v: string) {
    this.query.set(v);
    this.input$.next(v);
  }
}
```

</details>

### I3. Template Markup

<details><summary><code>src/app/http-search/http-search.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the i-http-search route</h3>
  <!-- Debounced search: typing updates the query and triggers the debounced stream -->
  <label
    >Search: <input [ngModel]="query()" (ngModelChange)="onInput($event)"
  /></label>
  <!-- Render the first 10 results returned by the search API -->
  <ul>
    @for (p of results(); track p.id) {
    <li>{{ p.title }}</li>
    }
  </ul>
</section>
```

</details>

<details><summary><code>src/app/http-search/http-search.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}
input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
}
ul {
  list-style: none;
  padding: 0;
  margin-top: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
li {
  padding: 8px 10px;
  border-top: 1px solid #f3f4f6;
}
li:first-child {
  border-top: 0;
}
```

</details>

---

### I4. Routing — Add a route and link

<details><summary><code>src/app/app.routes.ts</code> (add Part I)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Previous routes
  {
    path: "i-http-search",
    // Lazy-load the standalone component for Part I
    loadComponent: () =>
      import("./http-search/http-search.component").then(
        (m) => m.HttpSearchComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part I: Search”.

### I5. Run and Observe

- Navigate to Part I, type a search query and observe results update.
- Expected: Debounced requests and cancellation of previous queries.

---

## Part J: Retry with Backoff on Failure

Plain English: Networks can be flaky. Call a failing endpoint on purpose and use retry with a small backoff to try again a few times. Update a status signal so you can watch the flow (requesting → retries → final success/failure) and understand how resilience patterns work.
Why this is useful: Makes your app more resilient to flaky networks.

Goal: Use RxJS `retry` with a delay to retry a failing request.

### J1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component http-retry --skip-tests
```

</details>

### J1.5. Enable OnPush

<details><summary><code>src/app/http-retry/http-retry.component.ts</code> (Enable OnPush)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-http-retry",
  standalone: true,
  templateUrl: "./http-retry.component.html",
  styleUrls: ["./http-retry.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpRetryComponent {
  // existing code…
}
```

</details>

### J2. Component State

Call an endpoint that returns 503, retry up to 3 times with backoff.

<details><summary><code>src/app/http-retry/http-retry.component.ts</code> (State)</summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { retry } from "rxjs/operators";
import { timer } from "rxjs";
import { timer } from "rxjs";

@Component({
  selector: "app-http-retry",
  standalone: true,
  templateUrl: "./http-retry.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpRetryComponent {
  // Show the current status so students can follow the flow
  status = signal("Idle");

  private http = inject(HttpClient);

  // Try a failing request and retry it a few times with increasing delays
  tryRequest() {
    // 1) Update UI to indicate we're starting a request
    this.status.set("Requesting…");

    // 2) Kick off a GET that we expect to fail with HTTP 503 (Service Unavailable)
    //    The query param ?sleep=500 adds an artificial server delay so you can
    //    see the retry timing clearly in the Network tab.
    this.http
      // httpstat.us/503 responds with 503. Add ?sleep=500 to simulate delay.
      .get("https://httpstat.us/503?sleep=500", { responseType: "text" })
      // pipe lets us chain RxJS operators to transform/control the stream.
      // It returns a NEW Observable and does not start the request by itself.
      .pipe(
        // 3) retry operator:
        //    - count: how many times to retry after the first failure
        //    - delay: time to wait before each retry. Here we do simple linear
        //      backoff: 500ms, 1000ms, 1500ms (retryCount is 1, 2, 3).
        //    Note: The original attempt + 3 retries = up to 4 total attempts.
        retry({
          count: 3, // retry up to 3 times after the initial failure
          // Use a timer Observable for the backoff delay: 500ms, 1000ms, 1500ms
          delay: (_err, retryCount) => timer(retryCount * 500),
        })
      )
      // 4) subscribe starts the request chain and lets us reflect the outcome
      //    in the UI. With 503 responses, 'error' will run after retries end.
      .subscribe({
        // next: would run if we somehow get a 200 OK on any attempt
        next: () => this.status.set("Unexpected success"),
        // error: runs after all retry attempts are exhausted (still failing)
        error: () => this.status.set("Failed after retries"),
        // complete: runs when the observable completes. For errors this
        //           doesn't fire; it's shown here for teaching completeness.
        complete: () => this.status.set("Done"),
      });
  }
}
```

</details>

### J3. Template Markup

<details><summary><code>src/app/http-retry/http-retry.component.html</code> (Template)</summary>

```html
<section>
  <h3>Welcome to the j-http-retry route</h3>
  <!-- Start the failing request and watch retries occur -->
  <button (click)="tryRequest()">Try with retry/backoff</button>
  <!-- Show the current status to understand the flow -->
  <p>Status: {{ status() }}</p>
  <p class="muted">Watch the Network tab to see retries.</p>
</section>
```

</details>

<details><summary><code>src/app/http-retry/http-retry.component.css</code> (Styles)</summary>

```css
section {
  padding: 16px 0;
}
button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #dbeafe;
  background: linear-gradient(#eff6ff, #dbeafe);
  color: #1e3a8a;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.15);
}
button:hover {
  filter: brightness(0.98);
}
.muted {
  color: #64748b;
}
```

</details>

---

### J4. Routing — Add a route and link

<details><summary><code>src/app/app.routes.ts</code> (add Part J)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Previous routes
  {
    path: "j-http-retry",
    // Lazy-load the standalone component for Part J
    loadComponent: () =>
      import("./http-retry/http-retry.component").then(
        (m) => m.HttpRetryComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

- Use the nav link “Part J: Retry”.

### J5. Run and Observe

- Navigate to Part J and click Try with retry/backoff.
- Expected: Observe multiple attempts and final failure after retries.

---

## Part K: Auth Guard (Protect a Route)

Plain English: Create a simple “logged-in” switch in a tiny AuthService, add a functional route guard that only allows access when logged in, and wire a protected page. You’ll be able to toggle login from the header and try the guarded route.

Goal: Add a functional `authGuard` to protect a new route and a tiny `AuthService` to simulate login/logout.

<details><summary><code>Commands</code></summary>

```bash
# From your Angular workspace root
ng g s auth --skip-tests
ng g guard auth --functional --skip-tests --flat
(when asked, choose "CanActivate")
ng g c k-protected --skip-tests
```

</details>

### K1. AuthService

<details><summary><code>src/app/auth.service.ts</code></summary>

```ts
import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AuthService {
  // Demo-only: signal for auth state
  private _isLoggedIn = signal(false);

  isLoggedIn() {
    return this._isLoggedIn();
  }

  login() {
    this._isLoggedIn.set(true);
  }

  logout() {
    this._isLoggedIn.set(false);
  }
}
```

</details>

### K2. Functional Auth Guard

<details><summary><code>src/app/auth.guard.ts</code></summary>

```ts
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigateByUrl("/a-http-basics");
  return false;
};
```

</details>

### K3. Protected Component

<details><summary><code>src/app/k-protected/k-protected.component.ts</code></summary>

```ts
import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-k-protected",
  standalone: true,
  templateUrl: "./k-protected.component.html",
  styleUrls: ["./k-protected.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KProtectedComponent {}
```

</details>

<details><summary><code>src/app/k-protected/k-protected.component.html</code></summary>

```html
<section>
  <h3>Welcome to the k-auth-guard (protected) route</h3>
  <p>
    This page is only visible when logged in. Use the Login/Logout button in the
    header to toggle access.
  </p>
</section>
```

</details>

<details><summary><code>src/app/k-protected/k-protected.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
```

</details>

### K4. Add the guarded route

<details><summary><code>src/app/app.routes.ts</code> (add Part K)</summary>

```ts
import { Routes } from "@angular/router";
import { authGuard } from "./auth.guard";

export const routes: Routes = [
  // ...existing routes...
  {
    path: "k-auth-guard",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./k-protected/k-protected.component").then(
        (m) => m.KProtectedComponent
      ),
  },
];
```

</details>

---

### Run and Observe (Part K)

- Start the dev server if it’s not running.
- While logged OUT (default), click the “K: Auth Guard” chip in the header.
  - Expected: you’ll be redirected to Part A (`/a-http-basics`) because the guard blocks access.
- Click the Login button in the header, then click the “K: Auth Guard” chip again.
  - Expected: the protected K route loads and displays its content.
- Click Logout while you’re on K, then navigate away and back to K.
  - Expected: on the next navigation, the guard runs and blocks access (redirects back to A).
- Optional: manually enter `/k-auth-guard` in the address bar.
  - Expected: if logged in you remain on K; if logged out, you’re redirected to A.

Note: Guards run on navigation. If you log out while already on K, the view stays until you navigate again.

## Final Code (No Comments) – Reference

<details><summary><code>src/app/app.config.ts</code></summary>

```ts
import { ApplicationConfig } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideRouter, provideRoutes } from "@angular/router";
import { routes } from "./app.routes";
import { authInterceptor } from "./auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter([]),
    provideRoutes(routes),
  ],
};
```

</details>

<details><summary><code>src/app/app.routes.ts</code></summary>

```ts
import { Routes } from "@angular/router";
import { authGuard } from "./auth.guard";

export const routes: Routes = [
  {
    path: "a-http-basics",
    loadComponent: () =>
      import("./http-basics/http-basics.component").then(
        (m) => m.HttpBasicsComponent
      ),
  },
  {
    path: "b-http-states",
    loadComponent: () =>
      import("./http-states/http-states.component").then(
        (m) => m.HttpStatesComponent
      ),
  },
  {
    path: "c-http-params",
    loadComponent: () =>
      import("./http-params/http-params.component").then(
        (m) => m.HttpParamsComponent
      ),
  },
  {
    path: "d-http-post",
    loadComponent: () =>
      import("./http-post/http-post.component").then(
        (m) => m.HttpPostComponent
      ),
  },
  {
    path: "e-http-patch",
    loadComponent: () =>
      import("./http-patch/http-patch.component").then(
        (m) => m.HttpPatchComponent
      ),
  },
  {
    path: "f-http-delete",
    loadComponent: () =>
      import("./http-delete/http-delete.component").then(
        (m) => m.HttpDeleteComponent
      ),
  },
  {
    path: "g-http-headers",
    loadComponent: () =>
      import("./http-headers/http-headers.component").then(
        (m) => m.HttpHeadersComponent
      ),
  },
  {
    path: "h-http-interceptor",
    loadComponent: () =>
      import("./http-interceptor-demo/http-interceptor-demo.component").then(
        (m) => m.HttpInterceptorDemoComponent
      ),
  },
  {
    path: "i-http-search",
    loadComponent: () =>
      import("./http-search/http-search.component").then(
        (m) => m.HttpSearchComponent
      ),
  },
  {
    path: "j-http-retry",
    loadComponent: () =>
      import("./http-retry/http-retry.component").then(
        (m) => m.HttpRetryComponent
      ),
  },
  {
    path: "k-auth-guard",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./k-protected/k-protected.component").then(
        (m) => m.KProtectedComponent
      ),
  },
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>

<details><summary><code>src/app/app.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd,
} from "@angular/router";
import { filter } from "rxjs";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  activeLetter = signal<string>("A");
  private router = inject(Router);
  auth = inject(AuthService);

  constructor() {
    this.setLetterFromUrl(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.setLetterFromUrl(e.urlAfterRedirects));
  }

  private setLetterFromUrl(url: string) {
    const firstSeg = url.split("/").filter(Boolean)[0] || "a-http-basics";
    const letter = firstSeg.charAt(0).toUpperCase();
    this.activeLetter.set(letter);
  }

  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }
  isLoggedIn() {
    return this.auth.isLoggedIn();
  }
}
```

</details>

<details><summary><code>src/app/app.component.html</code></summary>

```html
<nav class="nav">
  <div class="nav-grid">
    <a routerLink="/a-http-basics" routerLinkActive="active" class="chip"
      ><span class="badge">A</span><span>Simple GET</span></a
    >
    <a routerLink="/b-http-states" routerLinkActive="active" class="chip"
      ><span class="badge">B</span><span>Loading & Error</span></a
    >
    <a routerLink="/c-http-params" routerLinkActive="active" class="chip"
      ><span class="badge">C</span><span>Query Params</span></a
    >
    <a routerLink="/d-http-post" routerLinkActive="active" class="chip"
      ><span class="badge">D</span><span>POST</span></a
    >
    <a routerLink="/e-http-patch" routerLinkActive="active" class="chip"
      ><span class="badge">E</span><span>PATCH</span></a
    >
    <a routerLink="/f-http-delete" routerLinkActive="active" class="chip"
      ><span class="badge">F</span><span>DELETE</span></a
    >
    <a routerLink="/g-http-headers" routerLinkActive="active" class="chip"
      ><span class="badge">G</span><span>Headers</span></a
    >
    <a routerLink="/h-http-interceptor" routerLinkActive="active" class="chip"
      ><span class="badge">H</span><span>Interceptor</span></a
    >
    <a routerLink="/i-http-search" routerLinkActive="active" class="chip"
      ><span class="badge">I</span><span>Search</span></a
    >
    <a routerLink="/j-http-retry" routerLinkActive="active" class="chip"
      ><span class="badge">J</span><span>Retry</span></a
    >
    <a routerLink="/k-auth-guard" routerLinkActive="active" class="chip"
      ><span class="badge">K</span><span>Auth Guard</span></a
    >
  </div>
  <hr />
  <div class="legend">
    <span class="legend-item"
      ><span class="dot-badge">{{ activeLetter() }}</span> Active route</span
    >
    <button class="auth-btn" (click)="isLoggedIn() ? logout() : login()">
      {{ isLoggedIn() ? 'Logout' : 'Login' }}
    </button>
  </div>
</nav>

<router-outlet></router-outlet>
```

</details>

<details><summary><code>src/app/app.component.css</code></summary>

```css
nav.nav {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
    sans-serif;
}
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px 12px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #dbeafe;
  color: #1e3a8a;
  background: linear-gradient(#f8fafc, #eff6ff);
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.12);
  transition: background 0.15s ease, border-color 0.15s ease,
    transform 0.05s ease, box-shadow 0.15s ease;
}
.chip:hover {
  background: #e0f2fe;
  border-color: #bae6fd;
}
.chip.active {
  border-color: #60a5fa;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.22), inset 0 0 0 1px #93c5fd;
}
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #3b82f6;
  color: white;
  font-weight: 700;
  font-size: 12px;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.3);
}
.legend {
  margin-top: 10px;
  color: #64748b;
  font-size: 12px;
}
.legend .dot-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #3b82f6;
  color: #fff;
  font-weight: 700;
  font-size: 11px;
  margin-right: 6px;
  vertical-align: middle;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.3);
}
hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 12px 0 12px;
}
.auth-btn {
  margin-left: 12px;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.auth-btn:hover {
  background: #f3f4f6;
}
```

</details>

### Part A — http-basics (Final Code)

<details><summary><code>src/app/http-basics/http-basics.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
type Post = { userId: number; id: number; title: string; body: string };
@Component({
  selector: "app-http-basics",
  standalone: true,
  templateUrl: "./http-basics.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpBasicsComponent {
  posts = signal<Post[]>([]);
  private http = inject(HttpClient);
  load() {
    this.http
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      .subscribe((d) => this.posts.set(d));
  }
}
```

</details>

<details><summary><code>src/app/http-basics/http-basics.component.html</code></summary>

```html
<section>
  <h3>Welcome to the a-http-basics route</h3>
  <button (click)="load()">Load posts</button>
  <ul>
    @for (p of posts(); track p.id) {
    <li>{{ p.title }}</li>
    }
  </ul>
  @if (!posts().length) {
  <p class="muted">No posts loaded yet.</p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-basics/http-basics.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
button {
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
}
button:hover {
  background: #f7f7f7;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}
.muted {
  color: #6b7280;
}
```

</details>

---

### Part B — http-states (Final Code)

<details><summary><code>src/app/http-states/http-states.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
type Post = { userId: number; id: number; title: string; body: string };
@Component({
  selector: "app-http-states",
  standalone: true,
  templateUrl: "./http-states.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpStatesComponent {
  posts = signal<Post[] | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  private http = inject(HttpClient);
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      .subscribe({
        next: (d) => this.posts.set(d),
        error: (e) => this.error.set(this.getErrorMessage(e)),
        complete: () => this.loading.set(false),
      });
  }
  private getErrorMessage(err: unknown) {
    return err && typeof err === "object" && "message" in err
      ? String((err as any).message)
      : String(err ?? "Unknown error");
  }
}
```

</details>

<details><summary><code>src/app/http-states/http-states.component.html</code></summary>

```html
<section>
  <h3>Welcome to the b-http-states route</h3>
  <button (click)="load()" [disabled]="loading()">Load posts</button>
  @if (loading()) {
  <p class="muted">Loading…</p>
  } @else if (error()) {
  <p class="error">Error: {{ error() }}</p>
  } @else if (posts()) {
  <ul>
    @for (p of posts()!; track p.id) {
    <li>{{ p.title }}</li>
    }
  </ul>
  } @else {
  <p class="muted">Click to load posts.</p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-states/http-states.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
button {
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
}
button[disabled] {
  opacity: 0.6;
  cursor: default;
}
.muted {
  color: #6b7280;
}
.error {
  color: #b91c1c;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}
```

</details>

---

### Part C — http-params (Final Code)

<details><summary><code>src/app/http-params/http-params.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
type Post = { userId: number; id: number; title: string; body: string };
@Component({
  selector: "app-http-params",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-params.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpParamsComponent {
  userId = signal(1);
  posts = signal<Post[]>([]);
  private http = inject(HttpClient);
  load() {
    const params = new HttpParams().set("userId", String(this.userId()));
    this.http
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts", { params })
      .subscribe((d) => this.posts.set(d));
  }
}
```

</details>

<details><summary><code>src/app/http-params/http-params.component.html</code></summary>

```html
<section>
  <h3>Welcome to the c-http-params route</h3>
  <label
    >User:
    <select [ngModel]="userId()" (ngModelChange)="userId.set(+$event)">
      <option [value]="1">User 1</option>
      <option [value]="2">User 2</option>
      <option [value]="3">User 3</option>
      <option [value]="4">User 4</option>
      <option [value]="5">User 5</option>
    </select>
  </label>
  <button (click)="load()">Load filtered</button>
  <ul>
    @for (p of posts(); track p.id) {
    <li>#{{ p.id }} – {{ p.title }}</li>
    }
  </ul>
</section>
```

</details>

<details><summary><code>src/app/http-params/http-params.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}
select,
button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
}
button:hover {
  background: #f7f7f7;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}
```

</details>

---

### Part D — http-post (Final Code)

<details><summary><code>src/app/http-post/http-post.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
type Created = { id: number; title: string; body: string; userId: number };
@Component({
  selector: "app-http-post",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-post.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpPostComponent {
  title = signal("");
  body = signal("");
  result = signal<Created | null>(null);
  loading = signal(false);
  private http = inject(HttpClient);
  submit() {
    this.loading.set(true);
    this.result.set(null);
    this.http
      .post<Created>("https://jsonplaceholder.typicode.com/posts", {
        title: this.title(),
        body: this.body(),
        userId: 1,
      })
      .subscribe({
        next: (r) => this.result.set(r),
        complete: () => this.loading.set(false),
      });
  }
}
```

</details>

<details><summary><code>src/app/http-post/http-post.component.html</code></summary>

```html
<section>
  <h3>Welcome to the d-http-post route</h3>
  <label
    >Title: <input [ngModel]="title()" (ngModelChange)="title.set($event)"
  /></label>
  <label
    >Body:
    <textarea [ngModel]="body()" (ngModelChange)="body.set($event)"></textarea>
  </label>
  <button (click)="submit()" [disabled]="loading()">Create</button>
  @if (result()) {
  <p>Created post id: <strong>{{ result()!.id }}</strong></p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-post/http-post.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
label {
  display: block;
  margin: 8px 0;
}
input,
textarea {
  width: 100%;
  max-width: 520px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
}
button {
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
}
button[disabled] {
  opacity: 0.6;
  cursor: default;
}
```

</details>

---

### Part E — http-patch (Final Code)

<details><summary><code>src/app/http-patch/http-patch.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
type Post = { id: number; title: string; body: string; userId: number };
@Component({
  selector: "app-http-patch",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-patch.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpPatchComponent {
  id = signal(1);
  title = signal("Updated title");
  result = signal<Post | null>(null);
  private http = inject(HttpClient);
  patch() {
    this.http
      .patch<Post>(`https://jsonplaceholder.typicode.com/posts/${this.id()}`, {
        title: this.title(),
      })
      .subscribe((r) => this.result.set(r));
  }
}
```

</details>

<details><summary><code>src/app/http-patch/http-patch.component.html</code></summary>

```html
<section>
  <h3>Welcome to the e-http-patch route</h3>
  <label
    >Post ID:
    <input type="number" [ngModel]="id()" (ngModelChange)="id.set(+$event)"
  /></label>
  <label
    >New Title: <input [ngModel]="title()" (ngModelChange)="title.set($event)"
  /></label>
  <button (click)="patch()">PATCH</button>
  @if (result()) {
  <p>Server title: <strong>{{ result()!.title }}</strong></p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-patch/http-patch.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}
input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
button:hover {
  background: #f7f7f7;
}
p {
  margin-top: 10px;
}
```

</details>

---

### Part F — http-delete (Final Code)

<details><summary><code>src/app/http-delete/http-delete.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
type Post = { userId: number; id: number; title: string; body: string };
@Component({
  selector: "app-http-delete",
  standalone: true,
  templateUrl: "./http-delete.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpDeleteComponent {
  posts = signal<Post[]>([]);
  private http = inject(HttpClient);
  load() {
    this.http
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      .subscribe((d) => this.posts.set(d.slice(0, 10)));
  }
  remove(id: number) {
    const prev = this.posts();
    this.posts.set(prev.filter((p) => p.id !== id));
    this.http
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .subscribe({ error: () => this.posts.set(prev) });
  }
}
```

</details>

<details><summary><code>src/app/http-delete/http-delete.component.html</code></summary>

```html
<section>
  <h3>Welcome to the f-http-delete route</h3>
  <button (click)="load()">Load 10 posts</button>
  <ul>
    @for (p of posts(); track p.id) {
    <li>{{ p.title }} <button (click)="remove(p.id)">Delete</button></li>
    }
  </ul>
</section>
```

</details>

<details><summary><code>src/app/http-delete/http-delete.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
button:hover {
  background: #f7f7f7;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}
```

</details>

---

### Part G — http-headers (Final Code)

<details><summary><code>src/app/http-headers/http-headers.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "app-http-headers",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-headers.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpHeadersComponent {
  apiKey = signal("demo-key-123");
  seenHeader = signal<string | null>(null);
  private http = inject(HttpClient);
  send() {
    const headers = new HttpHeaders({ "X-Api-Key": this.apiKey() });
    this.http
      .get<any>("https://httpbin.org/anything", { headers })
      .subscribe((res) =>
        this.seenHeader.set(res.headers["X-Api-Key"] ?? null)
      );
  }
}
```

</details>

<details><summary><code>src/app/http-headers/http-headers.component.html</code></summary>

```html
<section>
  <h3>Welcome to the g-http-headers route</h3>
  <label
    >API Key: <input [ngModel]="apiKey()" (ngModelChange)="apiKey.set($event)"
  /></label>
  <button (click)="send()">Send with header</button>
  @if (seenHeader()) {
  <p>Server saw X-Api-Key: <strong>{{ seenHeader() }}</strong></p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-headers/http-headers.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}
input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
button:hover {
  background: #f7f7f7;
}
p strong {
  color: #111;
}
```

</details>

---

### Part H — auth.interceptor + http-interceptor-demo (Final Code)

<details><summary><code>src/app/auth.interceptor.ts</code></summary>

```ts
import { HttpInterceptorFn } from "@angular/common/http";
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = "demo-token-abc";
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
```

</details>

<details><summary><code>src/app/app.config.ts</code></summary>

```ts
import { ApplicationConfig } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
};
```

</details>

<details><summary><code>src/main.ts</code></summary>

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

bootstrapApplication(AppComponent, appConfig);
```

</details>

<details><summary><code>src/app/http-interceptor-demo/http-interceptor-demo.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-http-interceptor-demo",
  standalone: true,
  templateUrl: "./http-interceptor-demo.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpInterceptorDemoComponent {
  authHeader = signal<string | null>(null);
  private http = inject(HttpClient);
  load() {
    this.http
      .get<any>("https://httpbin.org/anything")
      .subscribe((res) =>
        this.authHeader.set(res.headers["Authorization"] ?? null)
      );
  }
}
```

</details>

<details><summary><code>src/app/http-interceptor-demo/http-interceptor-demo.component.html</code></summary>

```html
<section>
  <h3>Welcome to the h-http-interceptor route</h3>
  <button (click)="load()">Call API</button>
  @if (authHeader()) {
  <p>Authorization: <code>{{ authHeader() }}</code></p>
  }
</section>
```

</details>

<details><summary><code>src/app/http-interceptor-demo/http-interceptor-demo.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
button:hover {
  background: #f7f7f7;
}
code {
  background: #f6f8fa;
  padding: 2px 6px;
  border-radius: 4px;
}
```

</details>

---

### Part I — http-search (Final Code)

<details><summary><code>src/app/http-search/http-search.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { Subject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
type Product = { id: number; title: string };
type SearchRes = { products: Product[] };
@Component({
  selector: "app-http-search",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./http-search.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpSearchComponent {
  query = signal("");
  results = signal<Product[]>([]);
  private input$ = new Subject<string>();
  private http = inject(HttpClient);
  constructor() {
    this.input$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) =>
          this.http.get<SearchRes>(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}`
          )
        )
      )
      .subscribe((res) => this.results.set(res.products.slice(0, 10)));
  }
  onInput(v: string) {
    this.query.set(v);
    this.input$.next(v);
  }
}
```

</details>

<details><summary><code>src/app/http-search/http-search.component.html</code></summary>

```html
<section>
  <h3>Welcome to the i-http-search route</h3>
  <label
    >Search: <input [ngModel]="query()" (ngModelChange)="onInput($event)"
  /></label>
  <ul>
    @for (p of results(); track p.id) {
    <li>{{ p.title }}</li>
    }
  </ul>
</section>
```

</details>

<details><summary><code>src/app/http-search/http-search.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}
input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
ul {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}
li {
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}
```

</details>

---

### Part J — http-retry (Final Code)

<details><summary><code>src/app/http-retry/http-retry.component.ts</code></summary>

```ts
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { retry } from "rxjs/operators";
import { timer } from "rxjs";
@Component({
  selector: "app-http-retry",
  standalone: true,
  templateUrl: "./http-retry.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpRetryComponent {
  status = signal("Idle");
  private http = inject(HttpClient);
  tryRequest() {
    this.status.set("Requesting…");
    this.http
      .get("https://httpstat.us/503?sleep=500", { responseType: "text" })
      .pipe(retry({ count: 3, delay: (_e, c) => timer(c * 500) }))
      .subscribe({
        next: () => this.status.set("Unexpected success"),
        error: () => this.status.set("Failed after retries"),
        complete: () => this.status.set("Done"),
      });
  }
}
```

</details>

<details><summary><code>src/app/http-retry/http-retry.component.html</code></summary>

```html
<section>
  <h3>Welcome to the j-http-retry route</h3>
  <button (click)="tryRequest()">Try with retry/backoff</button>
  <p>Status: {{ status() }}</p>
  <p class="muted">Watch the Network tab to see retries.</p>
</section>
```

</details>

<details><summary><code>src/app/http-retry/http-retry.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
button:hover {
  background: #f7f7f7;
}
.muted {
  color: #6b7280;
}
```

</details>

---

### Part K — auth-guard (Final Code)

<details><summary><code>src/app/auth.service.ts</code></summary>

```ts
import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AuthService {
  private _isLoggedIn = signal(false);
  isLoggedIn() {
    return this._isLoggedIn();
  }
  login() {
    this._isLoggedIn.set(true);
  }
  logout() {
    this._isLoggedIn.set(false);
  }
}
```

</details>

<details><summary><code>src/app/auth.guard.ts</code></summary>

```ts
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigateByUrl("/a-http-basics");
  return false;
};
```

</details>

<details><summary><code>src/app/k-protected/k-protected.component.ts</code></summary>

```ts
import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-k-protected",
  standalone: true,
  templateUrl: "./k-protected.component.html",
  styleUrls: ["./k-protected.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KProtectedComponent {}
```

</details>

<details><summary><code>src/app/k-protected/k-protected.component.html</code></summary>

```html
<section>
  <h3>Welcome to the k-auth-guard (protected) route</h3>
  <p>
    This page is only visible when logged in. Use the Login/Logout button in the
    header to toggle access.
  </p>
</section>
```

</details>

<details><summary><code>src/app/k-protected/k-protected.component.css</code></summary>

```css
section {
  padding: 12px 0;
}
```

</details>

---

## All routes together (lazy-loaded)

If you prefer to see a single consolidated routes file at the end, here’s an example that includes Parts A–J. Adjust paths if your folders differ.

<details><summary><code>src/app/app.routes.ts</code> (complete list)</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "a-http-basics",
    loadComponent: () =>
      import("./http-basics/http-basics.component").then(
        (m) => m.HttpBasicsComponent
      ),
  },
  {
    path: "b-http-states",
    loadComponent: () =>
      import("./http-states/http-states.component").then(
        (m) => m.HttpStatesComponent
      ),
  },
  {
    path: "c-http-params",
    loadComponent: () =>
      import("./http-params/http-params.component").then(
        (m) => m.HttpParamsComponent
      ),
  },
  {
    path: "d-http-post",
    loadComponent: () =>
      import("./http-post/http-post.component").then(
        (m) => m.HttpPostComponent
      ),
  },
  {
    path: "e-http-patch",
    loadComponent: () =>
      import("./http-patch/http-patch.component").then(
        (m) => m.HttpPatchComponent
      ),
  },
  {
    path: "f-http-delete",
    loadComponent: () =>
      import("./http-delete/http-delete.component").then(
        (m) => m.HttpDeleteComponent
      ),
  },
  {
    path: "g-http-headers",
    loadComponent: () =>
      import("./http-headers/http-headers.component").then(
        (m) => m.HttpHeadersComponent
      ),
  },
  {
    path: "h-http-interceptor",
    loadComponent: () =>
      import("./http-interceptor-demo/http-interceptor-demo.component").then(
        (m) => m.HttpInterceptorDemoComponent
      ),
  },
  {
    path: "i-http-search",
    loadComponent: () =>
      import("./http-search/http-search.component").then(
        (m) => m.HttpSearchComponent
      ),
  },
  {
    path: "j-http-retry",
    loadComponent: () =>
      import("./http-retry/http-retry.component").then(
        (m) => m.HttpRetryComponent
      ),
  },
  { path: "", pathMatch: "full", redirectTo: "a-http-basics" },
  { path: "**", redirectTo: "a-http-basics" },
];
```

</details>
