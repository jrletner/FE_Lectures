# Class 15 — Shared models + API token (exact contents)

Goal: Add the shared model interfaces and the API_BASE injection token exactly as in the final app. No behavior changes yet; the app should still compile and serve cleanly.

Timebox: ~60 minutes (scaffold + paste full contents + quick run)

---

Diff legend for live coding:

- Before each affected file, a tiny diff shows what changed:
  - Lines starting with + are additions
  - Lines starting with - are removals
  - Plain lines are context
- After the diff, the full final file is shown so students can paste cleanly.

---

## 1) Create shared folders

- src/app/shared/models
- src/app/shared/tokens

You can let Angular CLI scaffold the interfaces so file names match, then replace contents with the exact versions below:

```bash
# optional scaffolding (produces .model.ts files)
ng g interface shared/models/user
ng g interface shared/models/member
ng g interface shared/models/event-item
ng g interface shared/models/club
```

---

## 2) Add full file contents (exact)

Create or replace these files with the following contents:

Change diff (new files introduced in Class 15):

```diff
// Models
+ ADDED src/app/shared/models/user.model.ts
+ ADDED src/app/shared/models/member.model.ts
+ ADDED src/app/shared/models/event-item.model.ts
+ ADDED src/app/shared/models/club.model.ts
// Token
+ ADDED src/app/shared/tokens/api-base.token.ts
```

### src/app/shared/models/user.model.ts

Beginner “what/why”:

- What: Describes the shape of a user object the app uses.
- Why: Having a clear interface helps TypeScript catch mistakes and makes code easier to read.

```ts
export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}
```

### src/app/shared/models/member.model.ts

Beginner “what/why”:

- What: Describes the shape of a club member.
- Why: We’ll use this to track who’s in each club.

```ts
export interface Member {
  id: string;
  name: string;
}
```

### src/app/shared/models/event-item.model.ts

Beginner “what/why”:

- What: Describes one event (like a meeting) for a club.
- Why: We store title, date, size, and optional details so the UI can show them and we can validate inputs.

```ts
export interface EventItem {
  id: string;
  title: string;
  dateIso: string; // ISO date string
  capacity: number;
  description?: string;
}
```

### src/app/shared/models/club.model.ts

Beginner “what/why”:

- What: Describes a club and includes helper functions for common calculations.
- Why: The helpers keep UI code simple (for example, showing seats left or percent full).

```ts
import type { Member } from "./member.model";
import type { EventItem } from "./event-item.model";

export interface Club {
  id: string;
  name: string;
  capacity: number;
  members: Member[];
  events: EventItem[];
}

export function seatsLeft(club: Club): number {
  return Math.max(0, club.capacity - club.members.length);
}

export function percentFull(club: Club): number {
  if (club.capacity <= 0) return 0;
  return Math.min(100, Math.round((club.members.length / club.capacity) * 100));
}

export function toPlainClub(c: Club): Club {
  return {
    id: c.id,
    name: c.name,
    capacity: c.capacity,
    members: c.members.map((m) => ({ id: m.id, name: m.name })),
    events: c.events.map((e) => ({
      id: e.id,
      title: e.title,
      dateIso: e.dateIso,
      capacity: e.capacity,
      description: e.description,
    })),
  };
}
```

### src/app/shared/tokens/api-base.token.ts

Beginner “what/why”:

- What: Creates a simple “name tag” (InjectionToken) we can use to provide the API base URL.
- Why: Using a token lets us swap the value (e.g., local vs. production) without changing all the places that use it.

```ts
import { InjectionToken } from "@angular/core";

export const API_BASE = new InjectionToken<string>("API_BASE");
```

---

## 3) No provider changes yet

We created the API_BASE token, but we won’t provide a value until we wire the dev API (Class 17). Keeping app.config.ts unchanged avoids premature coupling.

---

## 4) Serve and sanity check

```bash
ng serve
```

- The app should build with no TypeScript errors.
- It’ll still render a blank page (no routes yet) and no runtime errors in the console.

---

## 5) What’s next (Class 16 preview)

- Add HTTP interceptors (auth + http-error) and service scaffolding (auth, users, club, toast) with exact file contents.
- We’ll avoid calling the API until the server is introduced, but compile should remain green.

---

## Full file contents created/updated in Class 15

Use these for quick reference. Click a filename to expand.

<details>
<summary>src/app/shared/models/user.model.ts</summary>

```ts
export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}
```

</details>

<details>
<summary>src/app/shared/models/member.model.ts</summary>

```ts
export interface Member {
  id: string;
  name: string;
}
```

</details>

<details>
<summary>src/app/shared/models/event-item.model.ts</summary>

```ts
export interface EventItem {
  id: string;
  title: string;
  dateIso: string; // ISO date string
  capacity: number;
  description?: string;
}
```

</details>

<details>
<summary>src/app/shared/models/club.model.ts</summary>

```ts
import type { Member } from "./member.model";
import type { EventItem } from "./event-item.model";

export interface Club {
  id: string;
  name: string;
  capacity: number;
  members: Member[];
  events: EventItem[];
}

export function seatsLeft(club: Club): number {
  return Math.max(0, club.capacity - club.members.length);
}

export function percentFull(club: Club): number {
  if (club.capacity <= 0) return 0;
  return Math.min(100, Math.round((club.members.length / club.capacity) * 100));
}

export function toPlainClub(c: Club): Club {
  return {
    id: c.id,
    name: c.name,
    capacity: c.capacity,
    members: c.members.map((m) => ({ id: m.id, name: m.name })),
    events: c.events.map((e) => ({
      id: e.id,
      title: e.title,
      dateIso: e.dateIso,
      capacity: e.capacity,
      description: e.description,
    })),
  };
}
```

</details>

<details>
<summary>src/app/shared/tokens/api-base.token.ts</summary>

```ts
import { InjectionToken } from "@angular/core";

export const API_BASE = new InjectionToken<string>("API_BASE");
```

</details>
