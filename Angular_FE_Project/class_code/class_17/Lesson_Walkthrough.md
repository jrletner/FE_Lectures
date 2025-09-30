# Class 17 — Application Layout Shell (Authoritative Single‑Touch Version)

Goal: Establish the FINAL root layout shell (`AppComponent`) and footer so we never revisit these files. The shell already references future infrastructure (loading bar, error banner, toast container) and features (Change PIN modal) that will be created in upcoming classes. This preserves the single‑touch rule: when those components arrive later, we do NOT edit the root component.

Timebox Suggestion: ~12–15 min (explain signals, dynamic summary, header UX; then paste code).

Not Included Yet: Routing (Class 18), UI infra component files (Class 18), auth/login + change‑pin implementation (Change PIN component file lands Class 19), club list (Class 18), detail/create/edit (19–21), import/export tools (21), members overview (22), users admin (23), FriendlyDatePipe (19).

---

Diff legend for live coding:

- Before each affected file, a tiny diff shows what changed:
  - Lines starting with + are additions
  - Lines starting with - are removals
  - Plain lines are context
- After the diff, the full final file is shown so students can paste cleanly.

All files below are NEW in this class.

---

## Scope (Files Introduced Today)

1. `src/app/app.component.ts`
2. `src/app/app.component.html`
3. `src/app/app.component.css`
4. `src/app/shared/layout/footer/footer.component.ts`

These are final. Do not edit them in later classes.

---

## Concept Highlights

- Single‑Touch Root: We lock in the production root structure early; later feature components plug into `<router-outlet />` without shell edits.
- Header Navigation: Semantic `<nav>` + accessible triggers. Links anticipate routes that will exist after Class 18; they may 404 or not render until those components exist—acceptable during incremental build.
- Signals & Computed: `pageSummary` uses a `computed` reactive derivation based on the current URL (updated inside a router subscription once routing is configured next class).
- Conditional Modal: Boolean flag `showPin` toggles future Change PIN modal. Component is imported now to avoid a future shell edit (file created in Class 19).
- Defensive Styling: Encapsulated CSS chooses tokens / variables expected to exist in global theme (defined earlier in project setup) without later modifications.
- Error / Loading / Toast Placeholders: Imported infrastructure components (files not yet created) reflect final dependency graph; they will exist after Class 18 (toast container + loading + error banner). Until then, temporary TypeScript errors may appear—see Verification notes.

---

## 1) `src/app/app.component.ts`

```diff
+ ADDED src/app/app.component.ts
```

```ts
import { Component, computed, inject, signal } from "@angular/core";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from "@angular/router";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./shared/layout/footer/footer.component";
// Infrastructure + feature components (files created in later classes):
import { LoadingBarComponent } from "./shared/ui/loading-bar/loading-bar.component"; // Class 18
import { ErrorBannerComponent } from "./shared/ui/error-banner/error-banner.component"; // Class 18
import { ToastContainerComponent } from "./shared/ui/toast-container/toast-container.component"; // Class 18
import { ChangePinComponent } from "./auth/change-pin.component"; // Class 19
import { ClubService } from "./shared/services/club.service";
import { AuthService } from "./shared/services/auth.service";

@Component({
  selector: "app-root",
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FooterComponent,
    LoadingBarComponent,
    ErrorBannerComponent,
    ToastContainerComponent,
    ChangePinComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "Campus-Club-Manager";
  svc = inject(ClubService);
  auth = inject(AuthService);
  private router = inject(Router);
  isHome = signal(true);
  private currentUrl = signal<string>("");
  showPin = false;

  // Dynamic page summary text shown in the subheader
  pageSummary = computed(() => {
    const url = this.currentUrl();
    if (!url) return "";
    if (url === "/" || url.startsWith("/?")) {
      return "Welcome! Use search and filters to explore clubs.";
    }
    if (url.startsWith("/clubs/new")) {
      return "Create a new club: name it, set capacity, and add it to your directory.";
    }
    if (/^\/clubs\/.+\/edit/.test(url)) {
      return "Edit club details and manage its settings.";
    }
    if (/^\/clubs\/.+/.test(url)) {
      return "View club details, manage members, and add events.";
    }
    if (url.startsWith("/tools")) {
      return "Import, export, or reset your data. Preview the JSON before downloading.";
    }
    return "Explore and manage your campus clubs.";
  });

  constructor() {
    // Activated once router is configured (Class 18). Safe now; no events until then.
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const url = ev.urlAfterRedirects || ev.url;
        this.isHome.set(url === "/" || url.startsWith("/?"));
        this.currentUrl.set(url);
      }
    });
  }

  onRetry() {
    this.svc.load();
  }

  onLogout() {
    this.auth.logout();
  }
}
```

---

## 2) `src/app/app.component.html`

```diff
+ ADDED src/app/app.component.html
```

```html
<header class="app-header">
  <div class="container app-header-inner">
    <div class="brand">
      <span class="badge">CC</span>
      <span>Campus Club Manager</span>
    </div>
    <nav class="top-nav">
      <a routerLink="/" class="nav-pill">Home</a>
      @if (auth.isAdmin()) { <a routerLink="/clubs/new">New Club</a> } @if
      (auth.isAdmin()) { <a routerLink="/admin/users">Users</a> } @if
      (auth.isAdmin()) { <a routerLink="/tools">Tools</a> } @if (!auth.user()) {
      <a routerLink="/login">Sign in</a>
      } @else {
      <span class="current-user" title="Current user"
        >👤 {{ auth.user()?.username }}@if (auth.isAdmin()) {
        <span class="chip -danger" style="margin-left: 0.5rem">Admin</span>
        }</span
      >
      <button class="btn btn-ghost btn-sm" (click)="showPin = !showPin">
        Change PIN
      </button>
      <button class="btn btn-outline" (click)="onLogout()">Logout</button>
      }
    </nav>
  </div>
  <div style="border-top: 1px solid var(--border)"></div>
</header>

<div class="subheader">
  <div class="inner">
    <p class="page-summary">{{ pageSummary() }}</p>
  </div>
  <div style="border-top: 1px solid var(--border); opacity: 0.5"></div>
</div>

<!-- Infrastructure components (files appear in Class 18) -->
<app-loading-bar [active]="svc.loading()"></app-loading-bar>
<app-error-banner
  [message]="svc.error()"
  (retry)="onRetry()"
  (dismiss)="svc.error.set(null)"
></app-error-banner>

<main class="app-main container">
  @if (showPin) {
  <div class="modal-overlay" aria-modal="true" role="dialog">
    <div class="modal" (click)="$event.stopPropagation()">
      <app-change-pin (close)="showPin = false" />
    </div>
  </div>
  }
  <router-outlet />
</main>

<app-toast-container />

<app-footer />
```

---

## 3) `src/app/app.component.css`

```diff
+ ADDED src/app/app.component.css
```

```css
.top-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.nav-pill {
  border: 2px solid var(--primary-200);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}
.current-user {
  opacity: 0.85;
  margin: 0 0.25rem 0 0.5rem;
}
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
}
.btn-sm {
  padding: 0.2rem 0.5rem;
  font-size: 0.9rem;
}
:host {
  display: block;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}
.app-header {
  display: grid;
  gap: 0.25rem;
  background: radial-gradient(
      1200px 800px at 0% 100%,
      rgba(99, 102, 241, 0.1),
      transparent 60%
    ), radial-gradient(
      1000px 700px at 100% 0%,
      rgba(99, 102, 241, 0.06),
      transparent 60%
    ), rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.app-header nav {
  display: flex;
  gap: 1rem;
}
.app-main {
  padding-block: 1rem;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 1rem;
  width: min(92vw, 420px);
}
.brand .badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 0.4rem;
  border-radius: 10px;
  background: var(--primary-700);
  color: #fff;
  font-weight: 800;
  line-height: 1;
}
.app-header .top-nav a {
  color: #3730a3;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid #c7d2fe;
  padding: 0.35rem 0.6rem;
  border-radius: 10px;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.2s ease, border-color
      0.15s ease, transform 0.15s ease;
}
.app-header .top-nav a:hover,
.app-header .top-nav a:focus-visible {
  background: linear-gradient(180deg, var(--primary), var(--primary-700));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 8px 18px rgba(79, 70, 229, 0.22);
  transform: translateY(-1px);
}
```

---

## 4) `src/app/shared/layout/footer/footer.component.ts`

```diff
+ ADDED src/app/shared/layout/footer/footer.component.ts
```

```ts
import { Component } from "@angular/core";

@Component({
  selector: "app-footer",
  standalone: true,
  template: `<footer class="footer">© {{ year }} Campus Club Manager</footer>`,
  styles: [
    `
      .footer {
        margin-top: 2rem;
        padding: 1rem 0;
        color: #666;
        border-top: 1px solid #eee;
        text-align: center;
      }
    `,
  ],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
```

---

## Verification / Demo Script

1. Paste files. Expect temporary TypeScript import errors for referenced components not yet created (loading bar, error banner, toast container, change pin). This is acceptable under the single‑touch contract; they resolve in Classes 18–19.
2. (Optional) Temporarily comment those specific import lines + usages if you need a clean build right now; UNDO those comments before committing so the shell remains final.
3. Run dev server — root layout renders header + footer skeleton.
4. Toggle `showPin = true` in dev tools to see modal container structure (component body missing until Class 19, so leave commented or accept a template error if not yet present).
5. Add a dummy route manually (or wait for Class 18) to confirm `<router-outlet />` placeholder.

Edge Talking Points:

- Why import ahead of file creation? Ensures zero future edits to the shell; trade‑off is short‑lived red squiggles.
- `pageSummary` gracefully returns empty until router begins emitting events (after routing added in Class 18).

---

## Single‑Touch Reminder

Do NOT edit these files again. All future visual or navigational changes (toasts, error surfacing, loading, auth modals, feature navigation) occur via the components themselves or routing, never by reshaping the shell.

---

## Next Class Preview (Class 18)

Add full routing configuration, global providers (`app.config.ts`), UI infrastructure components (loading bar, error banner, toast container), and the club list feature. That class resolves the current placeholder imports and removes any build errors.

---

End of Class 17 Walkthrough (Authoritative)

\n+## Full file contents created/updated in Class 17
\n+Reference appendix (single-touch). Click to expand each file introduced this class.
\n+<details>

<summary>src/app/app.component.ts</summary>

```ts
import { Component, computed, inject, signal } from "@angular/core";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from "@angular/router";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./shared/layout/footer/footer.component";
// Infrastructure + feature components (files created in later classes):
import { LoadingBarComponent } from "./shared/ui/loading-bar/loading-bar.component"; // Class 18
import { ErrorBannerComponent } from "./shared/ui/error-banner/error-banner.component"; // Class 18
import { ToastContainerComponent } from "./shared/ui/toast-container/toast-container.component"; // Class 18
import { ChangePinComponent } from "./auth/change-pin.component"; // Class 19
import { ClubService } from "./shared/services/club.service";
import { AuthService } from "./shared/services/auth.service";

@Component({
  selector: "app-root",
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FooterComponent,
    LoadingBarComponent,
    ErrorBannerComponent,
    ToastContainerComponent,
    ChangePinComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "Campus-Club-Manager";
  svc = inject(ClubService);
  auth = inject(AuthService);
  private router = inject(Router);
  isHome = signal(true);
  private currentUrl = signal<string>("");
  showPin = false;

  // Dynamic page summary text shown in the subheader
  pageSummary = computed(() => {
    const url = this.currentUrl();
    if (!url) return "";
    if (url === "/" || url.startsWith("/?")) {
      return "Welcome! Use search and filters to explore clubs.";
    }
    if (url.startsWith("/clubs/new")) {
      return "Create a new club: name it, set capacity, and add it to your directory.";
    }
    if (/^\/clubs\/.+\/edit/.test(url)) {
      return "Edit club details and manage its settings.";
    }
    if (/^\/clubs\/.+/.test(url)) {
      return "View club details, manage members, and add events.";
    }
    if (url.startsWith("/tools")) {
      return "Import, export, or reset your data. Preview the JSON before downloading.";
    }
    return "Explore and manage your campus clubs.";
  });

  constructor() {
    // Activated once router is configured (Class 18). Safe now; no events until then.
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const url = ev.urlAfterRedirects || ev.url;
        this.isHome.set(url === "/" || url.startsWith("/?"));
        this.currentUrl.set(url);
      }
    });
  }

  onRetry() {
    this.svc.load();
  }

  onLogout() {
    this.auth.logout();
  }
}
```

</details>

<details>
<summary>src/app/app.component.html</summary>

```html
<header class="app-header">
  <div class="container app-header-inner">
    <div class="brand">
      <span class="badge">CC</span>
      <span>Campus Club Manager</span>
    </div>
    <nav class="top-nav">
      <a routerLink="/" class="nav-pill">Home</a>
      @if (auth.isAdmin()) { <a routerLink="/clubs/new">New Club</a> } @if
      (auth.isAdmin()) { <a routerLink="/admin/users">Users</a> } @if
      (auth.isAdmin()) { <a routerLink="/tools">Tools</a> } @if (!auth.user()) {
      <a routerLink="/login">Sign in</a>
      } @else {
      <span class="current-user" title="Current user"
        >👤 {{ auth.user()?.username }}@if (auth.isAdmin()) {
        <span class="chip -danger" style="margin-left: 0.5rem">Admin</span>
        }</span
      >
      <button class="btn btn-ghost btn-sm" (click)="showPin = !showPin">
        Change PIN
      </button>
      <button class="btn btn-outline" (click)="onLogout()">Logout</button>
      }
    </nav>
  </div>
  <div style="border-top: 1px solid var(--border)"></div>
</header>

<div class="subheader">
  <div class="inner">
    <p class="page-summary">{{ pageSummary() }}</p>
  </div>
  <div style="border-top: 1px solid var(--border); opacity: 0.5"></div>
</div>

<!-- Infrastructure components (files appear in Class 18) -->
<app-loading-bar [active]="svc.loading()"></app-loading-bar>
<app-error-banner
  [message]="svc.error()"
  (retry)="onRetry()"
  (dismiss)="svc.error.set(null)"
></app-error-banner>

<main class="app-main container">
  @if (showPin) {
  <div class="modal-overlay" aria-modal="true" role="dialog">
    <div class="modal" (click)="$event.stopPropagation()">
      <app-change-pin (close)="showPin = false" />
    </div>
  </div>
  }
  <router-outlet />
</main>

<app-toast-container />

<app-footer />
```

</details>

<details>
<summary>src/app/app.component.css</summary>

```css
.top-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.nav-pill {
  border: 2px solid var(--primary-200);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}
.current-user {
  opacity: 0.85;
  margin: 0 0.25rem 0 0.5rem;
}
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
}
.btn-sm {
  padding: 0.2rem 0.5rem;
  font-size: 0.9rem;
}
:host {
  display: block;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}
.app-header {
  display: grid;
  gap: 0.25rem;
  background: radial-gradient(
      1200px 800px at 0% 100%,
      rgba(99, 102, 241, 0.1),
      transparent 60%
    ), radial-gradient(
      1000px 700px at 100% 0%,
      rgba(99, 102, 241, 0.06),
      transparent 60%
    ), rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.app-header nav {
  display: flex;
  gap: 1rem;
}
.app-main {
  padding-block: 1rem;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 1rem;
  width: min(92vw, 420px);
}
.brand .badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 0.4rem;
  border-radius: 10px;
  background: var(--primary-700);
  color: #fff;
  font-weight: 800;
  line-height: 1;
}
.app-header .top-nav a {
  color: #3730a3;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid #c7d2fe;
  padding: 0.35rem 0.6rem;
  border-radius: 10px;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.2s ease, border-color
      0.15s ease, transform 0.15s ease;
}
.app-header .top-nav a:hover,
.app-header .top-nav a:focus-visible {
  background: linear-gradient(180deg, var(--primary), var(--primary-700));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 8px 18px rgba(79, 70, 229, 0.22);
  transform: translateY(-1px);
}
```

</details>

<details>
<summary>src/app/shared/layout/footer/footer.component.ts</summary>

```ts
import { Component } from "@angular/core";

@Component({
  selector: "app-footer",
  standalone: true,
  template: `<footer class="footer">© {{ year }} Campus Club Manager</footer>`,
  styles: [
    `
      .footer {
        margin-top: 2rem;
        padding: 1rem 0;
        color: #666;
        border-top: 1px solid #eee;
        text-align: center;
      }
    `,
  ],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
```

</details>
