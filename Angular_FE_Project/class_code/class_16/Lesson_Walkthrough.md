# Class 16 — Interceptors + Services (exact contents)

Goal: Add HTTP interceptors and core services. We’re laying plumbing; no UI uses them yet. Interceptors are NOT wired globally in this class to keep things isolated until the API exists.

Timebox: ~90 minutes (create folders, paste code, quick build)

---

Diff legend for live coding:

- Before each affected file, a tiny diff shows what changed:
  - Lines starting with + are additions
  - Lines starting with - are removals
  - Plain lines are context
- After the diff, the full final file is shown so students can paste cleanly.

---

## 1) Folder structure

- src/app/shared/http
- src/app/shared/services

---

## 2) Interceptors (files only; not provided yet)

### src/app/shared/http/auth.interceptor.ts

Beginner “what/why”:

- What: If a user is logged in, this interceptor adds an Authorization header with their token to every outgoing HTTP request.
- Why: Saves us from adding the header manually in every service call.

Change diff (new in Class 16):

```diff
+ ADDED src/app/shared/http/auth.interceptor.ts
```

```ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  if (!token) return next(req);

  const authorized = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(authorized);
};
```

### src/app/shared/http/http-error.interceptor.ts

Beginner “what/why”:

- What: Catches HTTP errors globally and shows a friendly toast message.
- Why: Centralizes error handling so features don’t have to repeat the same try/catch logic.

Change diff (new in Class 16):

```diff
+ ADDED src/app/shared/http/http-error.interceptor.ts
```

```ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ToastService } from "../services/toast.service";
import { firstValueFrom } from "rxjs";

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((err) => {
      const message = err?.error?.message || err?.message || "Request failed";
      toast.show({ kind: "error", text: message });
      return throwError(() => err);
    })
  );
};
```

---

## 3) Services

### src/app/shared/services/toast.service.ts

Beginner “what/why”:

- What: Lightweight service to show small toast notifications (success/error/info) that auto-hide after a few seconds.
- Why: Gives users feedback without blocking the UI.

Change diff (new in Class 16):

```diff
+ ADDED src/app/shared/services/toast.service.ts
```

```ts
import { Injectable, signal } from "@angular/core";

export type Toast = {
  id: number;
  kind: "success" | "error" | "info";
  text: string;
};

@Injectable({ providedIn: "root" })
export class ToastService {
  #nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  show(t: Omit<Toast, "id">) {
    const id = this.#nextId++;
    const toast: Toast = { id, ...t };
    this.toasts.update((list) => [toast, ...list]);
    // auto dismiss
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}
```

### src/app/shared/services/auth.service.ts

Beginner “what/why”:

- What: Manages the current user and token; handles login/logout.
- Why: Central place for auth state so components/services don’t re-implement it.

Change diff (new in Class 16):

```diff
+ ADDED src/app/shared/services/auth.service.ts
```

```ts
import { Injectable, computed, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { API_BASE } from "../tokens/api-base.token";
import type { User } from "../models/user";

@Injectable({ providedIn: "root" })
export class AuthService {
  #http = inject(HttpClient);
  #api = inject(API_BASE);

  readonly #token = signal<string | null>(null);
  readonly #user = signal<User | null>(null);

  readonly isLoggedIn = computed(() => !!this.#token());
  readonly user = computed(() => this.#user());

  token() {
    return this.#token();
  }

  setToken(token: string | null) {
    this.#token.set(token);
  }

  setUser(user: User | null) {
    this.#user.set(user);
  }

  async login(username: string, pin: string) {
    const res = await firstValueFrom(
      this.#http.post<{ token: string; user: User }>(`${this.#api}/login`, {
        username,
        pin,
      })
    );

    if (res) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  }

  logout() {
    this.setToken(null);
    this.setUser(null);
  }
}
```

### src/app/shared/services/users.service.ts

Beginner “what/why”:

- What: Fetches users from the API.
- Why: Keeps user-related HTTP logic in one place; components stay simple.

Change diff (new in Class 16):

```diff
+ ADDED src/app/shared/services/users.service.ts
```

```ts
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_BASE } from "../tokens/api-base.token";
import type { User } from "../models/user";

@Injectable({ providedIn: "root" })
export class UsersService {
  #http = inject(HttpClient);
  #api = inject(API_BASE);

  getAll() {
    return this.#http.get<User[]>(`${this.#api}/users`);
  }
}
```

### src/app/shared/services/club.service.ts

Beginner “what/why”:

- What: The largest service. Manages clubs, including loading, search/sort filters, visible computed list, importing/exporting data, and optimistic updates for members/events.
- Why: Encapsulates business logic and keeps components thin. Signals/computed make the UI reactive and snappy.

Change diff (new in Class 16):

```diff
+ ADDED src/app/shared/services/club.service.ts
```

```ts
import { Injectable, computed, signal, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_BASE } from "../tokens/api-base.token";
import type { Club } from "../models/club";
import type { Member } from "../models/member";
import type { EventItem } from "../models/event-item";
import { toPlainClub, seatsLeft } from "../models/club";
import { AuthService } from "./auth.service";

type SortBy = "name-asc" | "name-desc" | "seats-desc" | "capacity-desc";

@Injectable({ providedIn: "root" })
export class ClubService {
  #http = inject(HttpClient);
  #api = inject(API_BASE);
  #auth = inject(AuthService);

  // Data + status
  readonly #clubs = signal<Club[]>([]);
  readonly clubs = computed(() => this.#clubs());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Filters
  readonly searchText = signal("");
  readonly onlyOpen = signal(false);
  readonly sortBy = signal<SortBy>("name-asc");

  // Derived visible list
  readonly visible = computed(() => {
    let list = this.#clubs();
    const q = this.searchText().trim().toLowerCase();
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q));
    if (this.onlyOpen()) list = list.filter((c) => seatsLeft(c) > 0);
    switch (this.sortBy()) {
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "seats-desc":
        list = [...list].sort((a, b) => seatsLeft(b) - seatsLeft(a));
        break;
      case "capacity-desc":
        list = [...list].sort((a, b) => b.capacity - a.capacity);
        break;
    }
    return list;
  });

  load() {
    this.loading.set(true);
    this.error.set(null);
    return this.#http.get<Club[]>(`${this.#api}/clubs`).subscribe({
      next: (list) => {
        this.#clubs.set(list);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.message || "Failed to load clubs");
        this.loading.set(false);
      },
    });
  }

  setClubs(list: Club[]) {
    this.#clubs.set(list);
  }

  getById(id: string) {
    return this.#clubs().find((c) => c.id === id) || null;
  }

  // Fetch single club from API (used by detail/edit pages later)
  fetchClub(id: string) {
    return this.#http.get<Club>(`${this.#api}/clubs/${id}`);
  }

  // -- Import/Export/Reset --
  exportAll(): Club[] {
    return this.#clubs().map(toPlainClub);
  }

  importAll(list: Club[]) {
    this.#clubs.set(list.map(toPlainClub));
  }

  resetToSeed() {
    return this.#http.post<Club[]>(`${this.#api}/reset`, {}).subscribe((l) => {
      this.#clubs.set(l);
    });
  }

  // -- Events -- (PUT full club with +1 event)
  addEvent(
    clubId: string,
    payload: {
      title: string;
      dateIso: string;
      capacity: number;
      description: string;
    }
  ): { ok: true } | { ok: false; message?: string } {
    const cur = this.getById(clubId);
    if (!cur) return { ok: false, message: "Club not found" };
    const newEvent: EventItem = {
      id: `e-${Date.now()}`,
      title: payload.title.trim(),
      dateIso: payload.dateIso,
      capacity: Math.max(1, payload.capacity),
      description: payload.description?.trim() || "",
    };
    const next: Club = { ...cur, events: [newEvent, ...cur.events] };
    // optimistic update; server rules allow: admin or non-admin adding exactly one event
    this.#updateLocal(next);
    this.#http
      .put(`${this.#api}/clubs/${clubId}`, toPlainClub(next))
      .subscribe({
        error: () => {
          // revert on failure
          this.#updateLocal(cur);
        },
      });
    return { ok: true };
  }

  // -- Members (hold/give up own spot via PATCH) --
  holdSpot(clubId: string): { ok: true } | { ok: false; message?: string } {
    const cur = this.getById(clubId);
    const user = this.#auth.user();
    if (!cur || !user) return { ok: false, message: "Not allowed" };
    if (seatsLeft(cur) <= 0) return { ok: false, message: "At capacity" };
    if (cur.members.some((m) => m.id === user.id))
      return { ok: false, message: "Already held" };
    const next: Club = {
      ...cur,
      members: [
        ...cur.members,
        { id: user.id, name: user.username } satisfies Member,
      ],
    };
    this.#updateLocal(next);
    this.#http
      .patch(`${this.#api}/clubs/${clubId}`, { members: next.members })
      .subscribe({
        error: () => this.#updateLocal(cur),
      });
    return { ok: true };
  }

  giveUpSpot(clubId: string): { ok: true } | { ok: false; message?: string } {
    const cur = this.getById(clubId);
    const user = this.#auth.user();
    if (!cur || !user) return { ok: false, message: "Not allowed" };
    if (!cur.members.some((m) => m.id === user.id))
      return { ok: false, message: "No spot held" };
    const next: Club = {
      ...cur,
      members: cur.members.filter((m) => m.id !== user.id),
    };
    this.#updateLocal(next);
    this.#http
      .patch(`${this.#api}/clubs/${clubId}`, { members: next.members })
      .subscribe({
        error: () => this.#updateLocal(cur),
      });
    return { ok: true };
  }

  // -- Member helpers (admin-only batch changes used by edit page later) --
  addMember(clubId: string, member: Member) {
    const cur = this.getById(clubId);
    if (!cur) return;
    const next: Club = { ...cur, members: [member, ...cur.members] };
    this.#updateLocal(next);
  }

  removeMember(clubId: string, memberId: string) {
    const cur = this.getById(clubId);
    if (!cur) return;
    const next: Club = {
      ...cur,
      members: cur.members.filter((m) => m.id !== memberId),
    };
    this.#updateLocal(next);
  }

  removeEvent(clubId: string, eventId: string) {
    const cur = this.getById(clubId);
    if (!cur) return;
    const next: Club = {
      ...cur,
      events: cur.events.filter((e) => e.id !== eventId),
    };
    this.#updateLocal(next);
  }

  // -- Internal helper --
  #updateLocal(next: Club) {
    this.#clubs.update((list) =>
      list.map((c) => (c.id === next.id ? next : c))
    );
  }
}
```

---

## 4) Build to verify

```bash
ng serve
```

- Expect a clean compile. No runtime behavior changes yet.
- Interceptors are defined but not yet provided globally; that happens after the dev API is in place (Class 17).

---

## 5) What’s next (Class 17 preview)

- Add the dev API server, proxy, scripts, and wire the providers (router + http fetch + interceptors + API_BASE + error handler) exactly as in the final app.

---

## Full file contents created/updated in Class 16

Use these for quick reference. Click a filename to expand.

<details>
<summary>src/app/shared/http/auth.interceptor.ts</summary>

```ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  if (!token) return next(req);

  const authorized = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(authorized);
};
```

</details>

<details>
<summary>src/app/shared/http/http-error.interceptor.ts</summary>

```ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ToastService } from "../services/toast.service";

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((err) => {
      const message = err?.error?.message || err?.message || "Request failed";
      toast.show({ kind: "error", text: message });
      return throwError(() => err);
    })
  );
};
```

</details>

<details>
<summary>src/app/shared/services/toast.service.ts</summary>

```ts
import { Injectable, signal } from "@angular/core";

export type Toast = {
  id: number;
  kind: "success" | "error" | "info";
  text: string;
};

@Injectable({ providedIn: "root" })
export class ToastService {
  #nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  show(t: Omit<Toast, "id">) {
    const id = this.#nextId++;
    const toast: Toast = { id, ...t };
    this.toasts.update((list) => [toast, ...list]);
    // auto dismiss
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}
```

</details>

<details>
<summary>src/app/shared/services/auth.service.ts</summary>

```ts
import { Injectable, computed, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { API_BASE } from "../tokens/api-base.token";
import type { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  #http = inject(HttpClient);
  #api = inject(API_BASE);

  readonly #token = signal<string | null>(null);
  readonly #user = signal<User | null>(null);

  readonly isLoggedIn = computed(() => !!this.#token());
  readonly user = computed(() => this.#user());

  token() {
    return this.#token();
  }

  setToken(token: string | null) {
    this.#token.set(token);
  }

  setUser(user: User | null) {
    this.#user.set(user);
  }

  async login(username: string, pin: string) {
    const res = await this.#http
      .post<{ token: string; user: User }>(`${this.#api}/login`, {
        username,
        pin,
      })
      .toPromise();

    if (res) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  }

  logout() {
    this.setToken(null);
    this.setUser(null);
  }
}
```

</details>

<details>
<summary>src/app/shared/services/users.service.ts</summary>

```ts
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_BASE } from "../tokens/api-base.token";
import type { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class UsersService {
  #http = inject(HttpClient);
  #api = inject(API_BASE);

  getAll() {
    return this.#http.get<User[]>(`${this.#api}/users`);
  }
}
```

</details>

<details>
<summary>src/app/shared/services/club.service.ts</summary>

```ts
import { Injectable, computed, signal, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_BASE } from "../tokens/api-base.token";
import type { Club, Member, EventItem } from "../models/club.model";
import { toPlainClub } from "../models/club.model";

@Injectable({ providedIn: "root" })
export class ClubService {
  #http = inject(HttpClient);
  #api = inject(API_BASE);

  readonly #clubs = signal<Club[]>([]);
  readonly clubs = computed(() => this.#clubs());

  load() {
    return this.#http.get<Club[]>(`${this.#api}/clubs`).subscribe((list) => {
      this.#clubs.set(list);
    });
  }

  setClubs(list: Club[]) {
    this.#clubs.set(list);
  }

  getById(id: string) {
    return this.clubs().find((c) => c.id === id) || null;
  }

  // -- Import/Export/Reset --
  exportAll(): Club[] {
    return this.#clubs().map(toPlainClub);
  }

  importAll(list: Club[]) {
    this.#clubs.set(list.map(toPlainClub));
  }

  resetToSeed() {
    return this.#http
      .post<Club[]>(`${this.#api}/reset`, {})
      .subscribe((list) => {
        this.#clubs.set(list);
      });
  }

  // -- Members --
  addMember(clubId: string, member: Member) {
    const cur = this.getById(clubId);
    if (!cur) return;
    const next: Club = { ...cur, members: [member, ...cur.members] };
    this.#updateLocal(next);
  }

  removeMember(clubId: string, memberId: string) {
    const cur = this.getById(clubId);
    if (!cur) return;
    const next: Club = {
      ...cur,
      members: cur.members.filter((m) => m.id !== memberId),
    };
    this.#updateLocal(next);
  }

  // -- Events --
  addEvent(clubId: string, event: EventItem) {
    const cur = this.getById(clubId);
    if (!cur) return;
    const next: Club = { ...cur, events: [event, ...cur.events] };
    this.#updateLocal(next);
  }

  removeEvent(clubId: string, eventId: string) {
    const cur = this.getById(clubId);
    if (!cur) return;
    const next: Club = {
      ...cur,
      events: cur.events.filter((e) => e.id !== eventId),
    };
    this.#updateLocal(next);
  }

  // -- Internal helper --
  #updateLocal(next: Club) {
    this.#clubs.update((list) =>
      list.map((c) => (c.id === next.id ? next : c))
    );
  }
}
```

</details>
