# Student Auth Walkthrough (Beginner Friendly)

Build a tiny front-end only authentication + simple authorization demo in Angular (standalone + signals + new control flow `@if`, `@for`). We will:

0. Project setup (scaffold / generate service + component)
1. Install bcrypt (educational hashing only)
2. Create the Auth Service (demo users + signals + computed state)
3. App Component logic (expose façade properties + form signals)
4. App Component template (bindings, control flow `@if`, `@for`)
5. Component styles (minor cosmetics)
6. Admin Panel component logic (role-gated feature)
7. Admin Panel template + styles (protected UI section)
8. Review & mental model + final clean (uncommented) code reference

> IMPORTANT (Reality Check): Real apps never hash or verify passwords in the browser. This is ONLY a teaching exercise to see the pieces. A real backend would verify credentials and return a token (JWT / session info).

---

## Before We Start: Breaking “Auth” Into Small Concepts

Authentication ("auth") feels big, but it’s really just a bunch of tiny things you already know how to do glued together. In this mini project we combine the following micro‑skills. Skim this list first — you probably recognize almost all of them:

1. Data modeling: a user object has a username, a hashed password, and a role ("user" or "admin"). You’ve made objects before — same thing.
2. Storing demo data: an in‑memory array `DEMO_USERS` acts like a pretend database. You already know arrays & `.find()`.
3. Hashing vs plain text: we call a function (`bcrypt.hashSync`) instead of storing the raw password. It’s just a transformation. (Real apps do this on the server.)
4. Comparing credentials: take the username the person typed, look up a record, compare the password via `bcrypt.compareSync`. That's just conditional logic.
5. Reactive state: signals hold current user, loading flag, and error message — like variables that auto-update the UI when they change.
6. Derived (computed) state: instead of manually managing booleans like `loggedIn`, we calculate them from existing state: `isAuthenticated = currentUser() !== null`.
7. Asynchronous simulation: a `setTimeout` to imitate waiting for a server. You’ve seen timeouts before; here it just delays setting the result.
8. Input handling: binding `<input>` value to a signal and updating on `(input)` event.
9. Validation: enabling the Login button only if both fields are non-empty (`canSubmit` computed). Basic form logic.
10. Conditional rendering: show either the login form or the logged-in panel using `@if ... @else` — just if/else but in the template.
11. Role-based rendering: another conditional that only shows the admin panel when the current user role is `admin`.
12. Looping lists: `@for` to list demo accounts — same concept as `.map()` visually.
13. Encapsulation / façade: hide the raw service behind a private field in the component and expose only what the template truly needs (clean public surface).
14. Local persistence: `localStorage.setItem` + `JSON.parse/JSON.stringify` plus an `effect` that syncs state → storage; a tiny cache so refresh doesn’t log you out instantly.
15. Error handling: set an error message string when login fails; clear it when retrying. You’ve assigned variables like this countless times.
16. Logging out: just set `currentUser` back to `null`. Simplicity.
17. Reusable template fragment: `<ng-template #loggedIn>` stores markup for the authenticated view that only becomes visible when the `@if` uses its `else` clause.
18. Secure data hygiene (mindset): never store the plain password after hashing (even in a client demo). You already know how to avoid keeping extra variables.

When these are stacked in order it “feels” like Auth, but each piece is a small, ordinary action. Keep this list in the back of your mind as you go — you’re just checking off basic building blocks.

---

### Tiny Concept Demos (Click to Expand)

Each box shows a minimal, isolated version of the idea so you can grok it before seeing the full auth flow. These are NOT the full project files—just bite‑sized references.

<details><summary>1. Data Modeling (User Object)</summary>

```ts
// A plain TypeScript interface describing a user shape
interface DemoUser {
  username: string;
  hash: string; // hashed password
  role: "user" | "admin";
}

const sample: DemoUser = {
  username: "alice",
  hash: "abc123hash",
  role: "user",
};
```

</details>

<details><summary>2. Storing Demo Data (Array + find)</summary>

```ts
const DEMO_USERS = [
  { username: "user", hash: "hash1", role: "user" },
  { username: "admin", hash: "hash2", role: "admin" },
];

const userInput = "admin";
const found = DEMO_USERS.find((u) => u.username === userInput);
// found is the object with username 'admin' (or undefined if not there)
```

</details>

<details><summary>3. Hashing vs Plain Text (Concept)</summary>

```ts
import * as bcrypt from "bcryptjs";

const plain = "1234";
const hash = bcrypt.hashSync(plain, 10); // store ONLY hash
const matches = bcrypt.compareSync("1234", hash); // true
```

</details>

<details><summary>4. Comparing Credentials</summary>

```ts
function loginAttempt(username: string, password: string) {
  const user = DEMO_USERS.find((u) => u.username === username);
  if (user && bcrypt.compareSync(password, user.hash)) {
    return "success";
  }
  return "fail";
}
```

</details>

<details><summary>5. Reactive State (Signals)</summary>

```ts
import { signal } from "@angular/core";

const currentUser = signal<string | null>(null);
currentUser.set("alice"); // UI reactive parts would update automatically
```

</details>

<details><summary>6. Derived / Computed State</summary>

```ts
import { signal, computed } from "@angular/core";
const currentUser = signal<string | null>(null);
const isAuthenticated = computed(() => currentUser() !== null);
```

</details>

<details><summary>7. Async Simulation (setTimeout)</summary>

```ts
function fakeServerCall(cb: () => void) {
  setTimeout(cb, 600); // pretend network latency
}

fakeServerCall(() => console.log("Done after ~600ms"));
```

</details>

<details><summary>8. Input Handling (Template Binding)</summary>

```html
<input
  [value]="username()"
  (input)="username.set(($event.target as HTMLInputElement).value)"
/>
```

```ts
// component excerpt
username = signal("");
```

</details>

<details><summary>9. Validation (Enable Button)</summary>

```ts
import { signal, computed } from "@angular/core";
const user = signal("");
const pass = signal("");
const canSubmit = computed(() => user().trim() !== "" && pass().trim() !== "");
```

```html
<button [disabled]="!canSubmit()">Login</button>
```

</details>

<details><summary>10. Conditional Rendering (@if)</summary>

```html
@if (isAuthenticated()) {
<p>Welcome!</p>
} @else {
<p>Please log in.</p>
}
```

</details>

<details><summary>11. Role-Based Rendering</summary>

```html
@if (isAdmin()) { <app-admin-panel></app-admin-panel> } @else {
<p>No admin access.</p>
}
```

</details>

<details><summary>12. Looping Lists (@for)</summary>

```html
<ul>
  @for (acct of demoAccounts; track acct.username) {
  <li>{{ acct.username }} ({{ acct.role }})</li>
  }
</ul>
```

</details>

<details><summary>13. Encapsulation / Façade Pattern</summary>

```ts
class FacadeExample {
  private service = inject(AuthService); // hide full API
  isAuthenticated = this.service.isAuthenticated; // expose just what template needs
}
```

</details>

<details><summary>14. Local Persistence (effect + localStorage)</summary>

```ts
import { signal, effect } from "@angular/core";
const user = signal<string | null>(null);
effect(() => {
  const u = user();
  if (u) localStorage.setItem("demo_user", u);
  else localStorage.removeItem("demo_user");
});
```

</details>

<details><summary>15. Error Handling</summary>

```ts
const errorMessage = signal<string | null>(null);
function failLogin() {
  errorMessage.set("Invalid credentials");
}
function retry() {
  errorMessage.set(null);
}
```

</details>

<details><summary>16. Logging Out</summary>

```ts
function logout() {
  currentUser.set(null);
}
```

</details>

<details><summary>17. Reusable Template Fragment (ng-template)</summary>

```html
@if (showMain()) {
<p>Main Content</p>
} @else {
<p>Alternate Content</p>
}
```

</details>

<details><summary>18. Secure Data Hygiene (Don’t keep plain password)</summary>

```ts
function register(rawPassword: string) {
  const hash = bcrypt.hashSync(rawPassword, 10); // keep hash
  // DO NOT keep rawPassword beyond this point
  return { hash };
}
```

</details>

---

### Quick Mental Model

1. Signals are like variables that automatically notify Angular’s change detection when accessed in a template.
2. Computeds are formulas over signals; they never store independent truth.
3. Effects are observers: they “listen” by reading signals and run code when those readings change.

### Common Gotchas

- Don’t perform heavy synchronous work inside an `effect`—it reruns when dependencies change.
- Avoid writing to a signal you just read inside the same `computed()` (risk of circular recalculation).
- Use narrow, purposeful effects (one responsibility) for easier reasoning & cleanup.

### When to Use Which

- Start with `signal` for raw state.
- Add `computed` for anything you’d otherwise keep as a duplicate boolean/string/number.
- Add `effect` only when you must “reach outside” (persistence, console logging, timers, analytics, etc.).

---

## Step 0 – Project Setup

**Goal:** Create Angular 19 project.

Run necessary ng commands:

<details><summary>Commands</summary>

```bash
# Create a new Angular app (standalone APIs by default)
ng new student-auth-demo --skip-tests
cd student-auth-demo

# Generate an auth service and an admin panel component (standalone)
ng g service auth --skip-tests
ng g component admin-panel --skip-tests
```

</details>

---

### Run & Observe (After Step 0)

```bash
ng serve --open
```

Expected: Default Angular starter page (no auth UI yet).

---

## Step 1 – Install bcrypt (Educational Only)

**Goal:** Add a client-side hashing library so we can contrast storing plain text vs. a hash.

<details><summary>Install Commands</summary>

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

</details>

Why two packages?

- `bcryptjs` = actual JS implementation.
- `@types/bcryptjs` = TypeScript type definitions for better IntelliSense.

> Security Reminder: Hashing on the client is NOT secure. We do it here only to visualize the concept. A server normally stores the hash and performs comparison.

---

### Run & Observe (After Step 1)

```bash
ng serve --open
```

Expected: Still starter page (packages added, no visual changes).

---

## Step 2 – Create (or Replace) `auth.service.ts`

**Goal:** Central place for auth state + actions (login/logout). We seed 2 demo accounts: `user` and `admin`, both with password `1234` (hashed). We expose signals for: current user, loading state, error message, plus derived signals `isAuthenticated` and `isAdmin`. (No template bindings yet — we are only establishing reactive data producers. Direction: everything here is internal TS state; nothing flows to the DOM until later steps bind to these signals.)

Key ideas:

- Signals store reactive state (`signal()`)
- Computed values derive booleans (`computed()`)
- We simulate async with `setTimeout`
- We never store plain passwords once hashed
- We use clear variable names (avoid single letters)

<details><summary><code>src/app/auth.service.ts</code> (with comments)</summary>

```ts
import { Injectable, signal, computed, effect } from "@angular/core";
import * as bcrypt from "bcryptjs";

// Represent a user in our tiny fake DB.
interface DemoUser {
  username: string; // the login name
  hash: string; // bcrypt hash of the password
  role: "user" | "admin"; // simple role flag
}

// Helper: hash a plain password (cost 10 for demo speed)
function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

// Seed two demo users (password for both = 1234). In a real app these hashes
// would be created on a server ahead of time.
const DEMO_USERS: DemoUser[] = [
  { username: "user", hash: hashPassword("1234"), role: "user" },
  { username: "admin", hash: hashPassword("1234"), role: "admin" },
];

@Injectable({ providedIn: "root" })
export class AuthService {
  // --- Signals (reactive state) ---
  private _currentUser = signal<DemoUser | null>(null); // logged in user (or null)
  private _isLoading = signal(false); // true while login attempt runs
  private _errorMessage = signal<string | null>(null); // last error message

  // --- Public read-only references (templates call as functions) ---
  currentUser = this._currentUser; // signal accessor in template: currentUser()
  isLoading = this._isLoading; // isLoading()
  errorMessage = this._errorMessage; // errorMessage()

  // Derived (computed) signals: auto-update when the above change.
  isAuthenticated = computed(() => this._currentUser() !== null);
  isAdmin = computed(() => this._currentUser()?.role === "admin");

  // Optional: Expose a SAFE list of available demo accounts (no hashes) for students.
  // This lets us render with @for to show which usernames to try.
  demoAccounts = DEMO_USERS.map((u) => ({
    username: u.username,
    role: u.role,
  }));

  // On creation try to restore a previous session from localStorage (educational only).
  constructor() {
    const raw = localStorage.getItem("demo_current_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          username: string;
          role: "user" | "admin";
        };
        const match = DEMO_USERS.find(
          (u) => u.username === parsed.username && u.role === parsed.role
        );
        if (match) this._currentUser.set(match);
      } catch {
        /* ignore */
      }
    }

    // Effect: whenever currentUser changes, store (or clear) minimal safe data.
    effect(() => {
      const cu = this._currentUser();
      if (cu) {
        localStorage.setItem(
          "demo_current_user",
          JSON.stringify({ username: cu.username, role: cu.role })
        );
      } else {
        localStorage.removeItem("demo_current_user");
      }
    });

    // Educational console log (remove in production): show initial state / restoration result.
    console.log(
      "[AuthService] Initialized. Restored user:",
      this._currentUser()?.username ?? null
    );
  }

  // Perform a fake async login: we look up by username, then compare the hash.
  login(username: string, password: string): void {
    if (this._isLoading()) return; // prevent double-click spam
    this._errorMessage.set(null); // clear previous errors
    this._isLoading.set(true); // show loading state

    console.log("[AuthService] login attempt start:", username);

    // Simulate network delay
    setTimeout(() => {
      const foundUser = DEMO_USERS.find((d) => d.username === username);
      if (foundUser && bcrypt.compareSync(password, foundUser.hash)) {
        // success path: store the user (never store the plain password)
        this._currentUser.set(foundUser);
        console.log("[AuthService] login success:", foundUser.username);
      } else {
        // failure path: show error + clear any stale user state
        this._errorMessage.set("Invalid username or password");
        this._currentUser.set(null);
        console.warn("[AuthService] login failed for:", username);
      }
      this._isLoading.set(false); // stop loading state
    }, 650);
  }

  // Clear current user (simple logout + effect will clear storage)
  logout(): void {
    this._currentUser.set(null);
    console.log("[AuthService] logout() user cleared");
  }
}
```

</details>

---

### Run & Observe (After Step 2)

```bash
ng serve --open
```

Expected: UI still unchanged; service compiles without errors.

Important: You will NOT see the AuthService console log yet. Angular only instantiates (constructs) a service when something injects it. At this point nothing injects `AuthService`, so its constructor (and the initialization log) has not run. This is normal and a good illustration of Angular's lazy provider instantiation.

LocalStorage Check (optional): Open DevTools → Application tab → Local Storage → http://localhost:4200. There should be NO key named `demo_current_user` yet (unless a previous run left one behind; if so you can clear it to watch it appear in Step 4 after a successful login).

The first console log (and any restore attempt) will appear in Step 3 when the root component injects the service.

---

## Step 3 – App Component (Logic) `app.component.ts`

**Goal:** Provide a small login form using signals for the input fields and computed validation. We inject the service using the `inject()` function (instead of a constructor parameter). We ALSO keep the raw service instance private and expose only the signals/arrays the template needs (encapsulation / façade approach). Binding types this logic will participate in (used in the template in Step 4) with direction:

- `[value]="usernameInput()" / `[value]="passwordInput()"` : TS signal value → DOM input value (one‑way, TS → DOM).
- `(input)="usernameInput.set(...)"` / `(input)="passwordInput.set(...)"` : DOM event (user typing) → TS signal update (DOM → TS).
- `[disabled]="!canSubmit() || isLoading()"` : TS boolean → DOM button `disabled` property (TS → DOM).
- `(click)="submit()"` and `(click)="logout()"` : DOM click → TS method invocation (DOM → TS).
- Interpolation `{{ ... }}` (next step) : TS expression result → DOM text node (TS → DOM).
- Structural `@if` / `@for` (next step) : TS predicate / iterable → DOM block creation & list replication (TS → DOM structure).

<details><summary><code>src/app/app.component.ts</code> (with comments – private service + exposed properties)</summary>

```ts
import { Component, signal, computed, inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { AdminPanelComponent } from "./admin-panel.component"; // stand-alone child component

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AdminPanelComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  // --- Local form field signals (not in the service) ---
  usernameInput = signal("");
  passwordInput = signal("");

  // Keep the actual service private (encapsulation / façade)
  private auth = inject(AuthService);

  // Publicly exposed references used by the template
  currentUser = this.auth.currentUser;
  isAuthenticated = this.auth.isAuthenticated;
  isAdmin = this.auth.isAdmin;
  isLoading = this.auth.isLoading;
  errorMessage = this.auth.errorMessage;
  demoAccounts = this.auth.demoAccounts; // plain array of safe demo entries

  // Validation logic for enabling the submit button
  canSubmit = computed(
    () =>
      this.usernameInput().trim() !== "" && this.passwordInput().trim() !== ""
  );

  submit(): void {
    if (!this.canSubmit() || this.isLoading()) return; // prevent invalid/duplicate submits
    this.auth.login(this.usernameInput().trim(), this.passwordInput().trim());
  }

  logout(): void {
    this.auth.logout();
  }
}
```

</details>

---

### Run & Observe (After Step 3)

```bash
ng serve --open
```

Expected: Still default page (logic only; template not swapped yet).

Console: NOW you should see:
[AuthService] Initialized. Restored user: null
(or a username if persistence restored one from a previous run).
No login attempt logs yet because the template with the form is not wired/rendered until Step 4.

LocalStorage Check: If you had no prior session, the key `demo_current_user` still does NOT exist. If you previously logged in in an earlier build, you might already see the key with a JSON value like `{ "username": "user", "role": "user" }`. Leave it or clear it—either is fine; logging in at Step 4 will (re)create/update it.

---

## Step 4 – App Component Template `app.component.html`

**Goal:** Show two mutually exclusive UI states: (1) Login form when not authenticated, (2) Authenticated panel when logged in. Uses new control flow `@if` and `@for` AND the exposed component façade properties (not a direct service reference) for cleaner encapsulation. Binding types present (with explicit direction):

- Structural control-flow: `@if`, `@for` — TS expressions (`isAuthenticated()`, `demoAccounts`) drive DOM block insertion/removal & repetition (TS → DOM structure).
- Property: `[value]` — TS signal current value fills the input’s value attribute (TS → DOM).
- Property: `[disabled]` — TS boolean expression controls button enabled state (TS → DOM).
- Event: `(input)` — user keystrokes fire a DOM InputEvent that calls a TS function updating signals (DOM → TS).
- Event: `(click)` — user click triggers TS method (DOM → TS).
- Interpolation: `{{ currentUser()!.username }}` — TS expression evaluated and inserted as text content (TS → DOM text).
- Template reference in `else loggedIn` — TS truthiness of `!isAuthenticated()` decides whether Angular instantiates the referenced `<ng-template #loggedIn>` fragment (TS → DOM structure via reference).

Beginner: What is `<ng-template #loggedIn>` doing?

Angular's new block syntax (`@if ... @else`) does not use an attribute on an element. Instead you write `@if (condition) { ... } @else { ... }` directly in the template. (Earlier draft showed an attribute form which is incorrect.) If you still want to keep a reusable fragment you can nest another `@if` or use `*ngTemplateOutlet`, but for most cases the inline block form is clearer.

Highlights:

- Encapsulation: template binds to `isAuthenticated()`, `isLoading()`, `errorMessage()`, etc. — no direct `authService.` usage.
- `@if (condition) { ... } @else { ... }` = new block syntax replacing legacy `*ngIf`.
- `@for (acct of demoAccounts; track acct.username)` = new loop block replacing `*ngFor`.
- Demo accounts displayed from a safe array with only username/role.

<details><summary><code>src/app/app.component.html</code> (with comments – using exposed properties)</summary>

```html
<h2>Student Auth Demo</h2>

<!-- Demo accounts list (purely educational) -->
<section>
  <h4>Available Demo Accounts</h4>
  <ul>
    @for (acct of demoAccounts; track acct.username) {
    <li>{{ acct.username }} (role: {{ acct.role }})</li>
    }
  </ul>
</section>

@if (!isAuthenticated()) {
<!-- Login Form -->
<div>
  <label>
    Username:
    <input
      [value]="usernameInput()"
      (input)="usernameInput.set($any($event.target).value)"
    />
  </label>
  <br />
  <label>
    Password:
    <input
      type="password"
      [value]="passwordInput()"
      (input)="passwordInput.set($any($event.target).value)"
    />
  </label>
  <br />
  <button [disabled]="!canSubmit() || isLoading()" (click)="submit()">
    Login
  </button>
  @if (isLoading()) { <span>Logging in...</span> } @if (errorMessage()) {
  <p style="color: red;">{{ errorMessage() }}</p>
  }
</div>
} @else {
<!-- Authenticated View -->
<div>
  <p>
    Welcome, {{ currentUser()!.username }} (role: {{ currentUser()!.role }}).
  </p>
  @if (isAdmin()) {
  <app-admin-panel></app-admin-panel>
  } @else {
  <p><em>You do not have admin privileges.</em></p>
  }
  <button (click)="logout()">Logout</button>
</div>
}
```

</details>

---

### Run & Observe (After Step 4)

```bash
ng serve --open
```

Expected: Auth UI present (demo accounts, inputs, disabled button until both fields filled). Login with `user/1234` (no admin panel) vs `admin/1234` (admin panel shows). Refresh keeps session.

Console sequence examples when testing:

1. Click Login with empty fields: (button disabled, no log)
2. Fill valid credentials and click Login:
   [AuthService] login attempt start: user
   (after delay)
   [AuthService] login success: user
3. Try wrong password:
   [AuthService] login attempt start: user
   (after delay)
   [AuthService] login failed for: user
4. Logout:
   [AuthService] logout() user cleared

LocalStorage Check:

1. Before login: No `demo_current_user` key (unless restored from earlier).
2. After successful login as `user/1234`: key appears with value:
   {"username":"user","role":"user"}
3. After login as `admin/1234`: value updates to:
   {"username":"admin","role":"admin"}
4. After clicking Logout: key is removed (refresh Application tab to confirm). If it lingers, ensure no other tab of the app is holding a logged-in state and that you logged out successfully.

---

## Step 5 – Component Styles `app.component.css`

Simple visual spacing (optional but helps readability).

<details><summary><code>src/app/app.component.css</code></summary>

```css
label {
  display: inline-block;
  margin: 0.35rem 0;
}
button {
  margin-top: 0.5rem;
}
section {
  margin-bottom: 1rem;
  padding: 0.5rem 0.75rem;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
}
```

</details>

---

### Run & Observe (After Step 5)

```bash
ng serve --open
```

Expected: Same behavior as Step 4 with improved spacing/styling.
Console: Logging patterns identical to Step 4.

---

## Step 6 – Admin Panel Component Logic

**Goal:** A tiny component that only displays when the logged user is an admin. We still make it standalone. It reads the service with `inject()`. Binding types: in this component’s own template only interpolation (TS → DOM text). Whether the whole component appears is controlled by the parent’s `@if (isAdmin())` (parent TS predicate → DOM component presence). Any future admin-only actions would add event bindings (DOM → TS).

<details><summary><code>src/app/admin-panel.component.ts</code> (with comments)</summary>

```ts
import { Component, inject } from "@angular/core";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-admin-panel",
  standalone: true,
  templateUrl: "./admin-panel.component.html",
  styleUrl: "./admin-panel.component.css",
})
export class AdminPanelComponent {
  auth = inject(AuthService); // gives template access to isAdmin(), currentUser(), etc.
}
```

</details>

---

### Run & Observe (After Step 6)

```bash
ng serve --open
```

Expected: Admin panel appears only when logged in as `admin/1234`.
Console: When switching from user -> admin account you will see a new login attempt / success pair. The effect-driven persistence will continue silently (initial restore already logged earlier).

---

## Step 7 – Admin Panel Template + Styles

**Goal:** Add minimal protected content. Binding types: currently static HTML (no binding). If you later add dynamic data, interpolation (`{{ }}` TS → DOM text) or `@for` (TS iterable → DOM repeated nodes) would apply.

<details><summary><code>src/app/admin-panel.component.html</code> (with comments)</summary>

```html
<h3>Admin Panel</h3>
<p>Only admins should see this content.</p>
<ul>
  <li>Placeholder secure action A</li>
  <li>Placeholder secure action B</li>
</ul>
```

</details>

<details><summary><code>src/app/admin-panel.component.css</code></summary>

```css
:host {
  display: block;
  margin: 0.75rem 0 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #c7c7c7;
  border-radius: 6px;
  background: #f5f9ff;
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}
```

</details>

---

### Run & Observe (After Step 7)

```bash
ng serve --open
```

Expected: Styled admin panel visible for admin; persistence & logout still work.
Console: Only new messages arise from any additional login / logout actions you perform.

---

## Step 8 – Review & Mental Model

**You now have:**

- Reactive form inputs (signals) instead of template-driven forms
- Centralized auth logic & state in a service
- A derived, declarative way to show/hide content with `@if`
- Role-based conditional rendering (admin vs non-admin)
- `@for` to show a list of demo accounts
- `inject()` for a lightweight dependency injection pattern without a constructor

**Common Questions:**

- How does persistence work here? A lightweight `localStorage` + `effect()` pair stores only `{ username, role }` and restores it on refresh (demo only; real apps revalidate tokens server-side).
- Why hash on the client? ONLY to illustrate password hashing concept; not secure.
- Why signals? They eliminate manual subscription boilerplate and integrate seamlessly with the template.

---

## Final Code (No Comments) – Copy/Paste Reference

Below are clean versions of the files (no inline comments) so you can copy them into a fresh project if needed.

<details><summary><code>auth.service.ts (final)</code></summary>

```ts
import { Injectable, signal, computed, effect } from "@angular/core";
import * as bcrypt from "bcryptjs";

interface DemoUser {
  username: string;
  hash: string;
  role: "user" | "admin";
}
function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}
const DEMO_USERS: DemoUser[] = [
  { username: "user", hash: hashPassword("1234"), role: "user" },
  { username: "admin", hash: hashPassword("1234"), role: "admin" },
];

@Injectable({ providedIn: "root" })
export class AuthService {
  private _currentUser = signal<DemoUser | null>(null);
  private _isLoading = signal(false);
  private _errorMessage = signal<string | null>(null);

  currentUser = this._currentUser;
  isLoading = this._isLoading;
  errorMessage = this._errorMessage;
  isAuthenticated = computed(() => this._currentUser() !== null);
  isAdmin = computed(() => this._currentUser()?.role === "admin");
  demoAccounts = DEMO_USERS.map((u) => ({
    username: u.username,
    role: u.role,
  }));

  constructor() {
    const raw = localStorage.getItem("demo_current_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          username: string;
          role: "user" | "admin";
        };
        const match = DEMO_USERS.find(
          (u) => u.username === parsed.username && u.role === parsed.role
        );
        if (match) this._currentUser.set(match);
      } catch {}
    }
    effect(() => {
      const cu = this._currentUser();
      if (cu) {
        localStorage.setItem(
          "demo_current_user",
          JSON.stringify({ username: cu.username, role: cu.role })
        );
      } else {
        localStorage.removeItem("demo_current_user");
      }
    });
  }

  login(username: string, password: string): void {
    if (this._isLoading()) return;
    this._errorMessage.set(null);
    this._isLoading.set(true);
    setTimeout(() => {
      const foundUser = DEMO_USERS.find((d) => d.username === username);
      if (foundUser && bcrypt.compareSync(password, foundUser.hash)) {
        this._currentUser.set(foundUser);
      } else {
        this._errorMessage.set("Invalid username or password");
        this._currentUser.set(null);
      }
      this._isLoading.set(false);
    }, 650);
  }

  logout(): void {
    this._currentUser.set(null);
  }
}
```

</details>

<details><summary><code>app.component.ts (final)</code></summary>

```ts
import { Component, signal, computed, inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { AdminPanelComponent } from "./admin-panel.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AdminPanelComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  usernameInput = signal("");
  passwordInput = signal("");
  private auth = inject(AuthService);
  currentUser = this.auth.currentUser;
  isAuthenticated = this.auth.isAuthenticated;
  isAdmin = this.auth.isAdmin;
  isLoading = this.auth.isLoading;
  errorMessage = this.auth.errorMessage;
  demoAccounts = this.auth.demoAccounts;
  canSubmit = computed(
    () =>
      this.usernameInput().trim() !== "" && this.passwordInput().trim() !== ""
  );
  submit(): void {
    if (!this.canSubmit() || this.isLoading()) return;
    this.auth.login(this.usernameInput().trim(), this.passwordInput().trim());
  }
  logout(): void {
    this.auth.logout();
  }
}
```

</details>

<details><summary><code>app.component.html (final)</code></summary>

```html
<h2>Student Auth Demo</h2>
<section>
  <h4>Available Demo Accounts</h4>
  <ul>
    @for (acct of demoAccounts; track acct.username) {
    <li>{{ acct.username }} (role: {{ acct.role }})</li>
    }
  </ul>
</section>
@if (!isAuthenticated()) {
<div>
  <label>
    Username:
    <input
      [value]="usernameInput()"
      (input)="usernameInput.set($any($event.target).value)"
    />
  </label>
  <br />
  <label>
    Password:
    <input
      type="password"
      [value]="passwordInput()"
      (input)="passwordInput.set($any($event.target).value)"
    />
  </label>
  <br />
  <button [disabled]="!canSubmit() || isLoading()" (click)="submit()">
    Login
  </button>
  @if (isLoading()) { <span>Logging in...</span> } @if (errorMessage()) {
  <p style="color: red;">{{ errorMessage() }}</p>
  }
</div>
} @else {
<div>
  <p>
    Welcome, {{ currentUser()!.username }} (role: {{ currentUser()!.role }}).
  </p>
  @if (isAdmin()) {
  <app-admin-panel></app-admin-panel>
  } @else {
  <p><em>You do not have admin privileges.</em></p>
  }
  <button (click)="logout()">Logout</button>
</div>
}
```

</details>

<details><summary><code>app.component.css (final)</code></summary>

```css
label {
  display: inline-block;
  margin: 0.35rem 0;
}
button {
  margin-top: 0.5rem;
}
section {
  margin-bottom: 1rem;
  padding: 0.5rem 0.75rem;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
}
```

</details>

<details><summary><code>admin-panel.component.ts (final)</code></summary>

```ts
import { Component, inject } from "@angular/core";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-admin-panel",
  standalone: true,
  templateUrl: "./admin-panel.component.html",
  styleUrl: "./admin-panel.component.css",
})
export class AdminPanelComponent {
  auth = inject(AuthService);
}
```

</details>

<details><summary><code>admin-panel.component.html (final)</code></summary>

```html
<h3>Admin Panel</h3>
<p>Only admins should see this content.</p>
<ul>
  <li>Placeholder secure action A</li>
  <li>Placeholder secure action B</li>
</ul>
```

</details>

<details><summary><code>admin-panel.component.css (final)</code></summary>

```css
:host {
  display: block;
  margin: 0.75rem 0 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #c7c7c7;
  border-radius: 6px;
  background: #f5f9ff;
}
h3 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}
```

</details>

---

## Next Practice Ideas

Persistence + effects are already implemented. Here are fresh extensions:

1. Registration flow: form to create a new user (validate uniqueness, hash password, auto‑login on success).
2. Additional roles / permissions matrix (e.g. `moderator`) and a reusable `hasRole(role: string)` computed.
3. Failed login throttling: count attempts, temporary lockout with countdown feedback signal.

Happy coding! 🚀
