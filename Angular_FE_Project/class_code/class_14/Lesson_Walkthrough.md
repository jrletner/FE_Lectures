# Class 14 — Bootstrapping Campus Club Manager (exact build start)

Goal: Start a brand-new Angular app using Angular 19.2.3 CLI, align package versions to the class_24 sample, wire providers (Router + HttpClient with fetch), add routes file, and serve cleanly. No extra routes beyond what exists in the end product.

Timebox: ~90–120 minutes (live coding + Q&A)

---

Diff legend for live coding:

- Before each affected file, a tiny diff shows what changed:
  - Lines starting with + are additions
  - Lines starting with - are removals
  - Plain lines are context
- After the diff, the full final file is shown so students can paste cleanly.

---

## 1) Install prerequisites (exact versions where required)

- Install Node.js (use an LTS version compatible with Angular 19; Node 20 LTS is fine). Download from nodejs.org.
- Install Angular CLI 19.2.3 globally:

```bash
npm i -g @angular/cli@19.2.3
```

Note: We’ll align project dependencies to match the class_24 sample after scaffolding.

---

## 2) Create the project

```bash
ng new campus-club-manager
cd campus-club-manager
```

Answer prompts minimally (no SSR for now). This creates the workspace with a standalone `AppComponent`.

---

## 3) Align package.json to class_24 where needed

- Ensure Angular framework packages are on 19.2.x and CLI/build tools on 19.2.3.
- Ensure TypeScript aligns with the sample (~5.7.2).

If your scaffold differs, run:

```bash
npm i -D typescript@~5.7.2
```

Then open `package.json` and verify (do not deviate from your scaffolded values unless these differ materially from class_24):

- `@angular/*` packages are ^19.2.x
- `@angular/cli` is ^19.2.3
- `@angular-devkit/build-angular` is ^19.2.3
- `typescript` is ~5.7.2

We’ll add additional dev deps (concurrently, json-server, bcryptjs, jsonwebtoken) later when we wire the API.

---

## 4) Create a routes file (no extra routes yet)

Create `src/app/app.routes.ts` with an empty route list for now. We’ll add only final routes in later classes.

Beginner “what/why”:

- What: This file lists the URL paths in our app and which component should show for each path. Right now it’s empty, so the app won’t navigate anywhere yet.
- Why: We set up the routing system early so we can plug in the final routes later without reworking the foundation.

Change diff (new in Class 14):

```diff
+ ADDED src/app/app.routes.ts
```

```ts
// src/app/app.routes.ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Intentionally empty in Class 14. We will add only end-product routes later.
];
```

---

## 5) Wire providers with fetch-based HttpClient

Edit `src/app/app.config.ts` to use Router + HttpClient(withFetch()). Interceptors and tokens will be added in later classes.

Beginner “what/why”:

- What: This sets up project-wide features. `provideRouter(routes)` turns on page navigation; `provideHttpClient(withFetch())` turns on making web requests using the browser’s Fetch API.
- Why: We enable these early so later features (login, data loading) work out of the box without refactoring.

Change diff (edits in Class 14):

```diff
+ Added provideRouter(routes)
+ Added provideHttpClient(withFetch())
```

```ts
// src/app/app.config.ts
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient, withFetch } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withFetch())],
};
```

---

## 6) Verify AppComponent shell has RouterOutlet

Open `src/app/app.component.ts` and ensure it imports `RouterOutlet` (keep it minimal for now; we’ll expand later to match class_24 exactly).

Beginner “what/why”:

- What: `RouterOutlet` is a placeholder in the page where Angular puts the component for the current route.
- Why: Without this, changing the URL won’t show anything. It’s the “screen area” for our routed pages.

Change diff (edits in Class 14):

```diff
+ Added RouterOutlet import
+ Ensure templateUrl points to ./app.component.html
+ Ensure styleUrl points to ./app.component.css
```

```ts
// src/app/app.component.ts
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {}
```

Update `src/app/app.component.html` to render the outlet:

Beginner “what/why”:

- What: This HTML tag is where routed content appears.
- Why: It connects the routing system to the visible page.

Change diff (edits in Class 14):

```diff
+ Added <router-outlet></router-outlet>
```

```html
<!-- src/app/app.component.html -->
<router-outlet></router-outlet>
```

Leave `src/app/app.component.css` as generated.

---

## 7) Serve and sanity check

```bash
ng serve
```

Open http://localhost:4200

- App builds and serves without errors
- Blank page is expected (no routes yet) but no runtime errors should appear in the console

---

## 8) What’s next (Class 15 preview)

- Add shared models and `API_BASE` token.
- Introduce interceptors and services structure (scaffold only), still compiling cleanly.
- We will only add routes present in the final app, in the order needed to keep the app running every class.

---

## Full file contents created/updated in Class 14

Use these for quick reference. Click a filename to expand.

<details>
<summary>src/app/app.routes.ts</summary>

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Intentionally empty in Class 14. We will add only end-product routes later.
];
```

</details>

<details>
<summary>src/app/app.config.ts</summary>

```ts
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient, withFetch } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withFetch())],
};
```

</details>

<details>
<summary>src/app/app.component.ts</summary>

```ts
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {}
```

</details>

<details>
<summary>src/app/app.component.html</summary>

```html
<router-outlet></router-outlet>
```

</details>
