# Class 16 — Core Services + HTTP Interceptors (Authoritative Single‑Touch Version)

Goal: Introduce the core application services (Auth, Clubs, Users, Toast) and HTTP interceptors (auth header + error normalization) exactly as they appear in the final application. These provide state management, persistence, network abstraction, optimistic updates, data import/export/reset, and global error/notification plumbing. Every file below is created once today and never edited again.

Timebox Suggestion: ~22–26 min (orient concepts, then paste code). Emphasize signals, optimistic mutation pattern, and interceptor responsibilities over rote typing.

Not Included Yet: Layout shell (Class 17), routing + UI infra + club list (Class 18), auth/login UI & change‑pin (Class 19), detail/create/edit (19–21), quick event component (20/21 context), import/export UI (Class 21), members overview (Class 22), users admin (Class 23), FriendlyDatePipe (Class 19).

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

1. `src/app/shared/services/auth.service.ts`
2. `src/app/shared/services/club.service.ts`
3. `src/app/shared/services/users.service.ts`
4. `src/app/shared/services/toast.service.ts`
5. `src/app/shared/http/auth.interceptor.ts`
6. `src/app/shared/http/http-error.interceptor.ts`
7. `src/app/shared/tokens/api-base.token.ts`

These versions are final—later features use them unchanged.

---

## Concept Highlights

- Signals as Store: Angular Signals (`signal`, `computed`) replace external state libs. Each service encapsulates domain state.
- Persisted Auth: Auth token + user snapshot stored in `localStorage` (if available) and restored on service construction.
- Optimistic Updates: `ClubService` mutates UI immediately (create/update/member/event changes) then persists; rollback on failure with toast + error signals.
- Validation Layer: Capacity, duplicates, date format, schema shape for import all validated client‑side for instant feedback.
- Interceptors: `authInterceptor` attaches Bearer token; `httpErrorInterceptor` normalizes errors and triggers logout on 401 (except login call) centralizing failure behavior.
- Import / Export / Reset: Data portability and deterministic demo seed built into `ClubService`—UI later just calls these methods.
- Role Enforcement: Admin guard checks performed in service methods (create/update/delete club) so security isn’t purely a UI responsibility.
- Toast Service: Minimal reactive queue with typed helpers (success/error/info/danger) and auto‑dismiss timers.
- Single‑Touch Integrity: Large service bodies are frozen now—future lessons only add components around them.

---

## 1) `src/app/shared/services/auth.service.ts`

```diff
+ ADDED src/app/shared/services/auth.service.ts
```

```ts
import { Injectable, computed, signal, inject } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { User } from "../models/user.model";
import { API_BASE } from "../tokens/api-base.token";

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageKey = "ccm.auth";
  private apiBase = (inject(API_BASE, { optional: true }) ?? "/api").replace(
    /\/+$/,
    ""
  );

  token = signal<string | null>(null);
  user = signal<User | null>(null);
  isAdmin = computed(() => !!this.user()?.isAdmin);

  constructor() {
    const raw =
      typeof localStorage === "undefined"
        ? null
        : localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data?.token && data?.user) {
          this.token.set(data.token);
          this.user.set(data.user);
        }
      } catch {
        // ignore
      }
    }
  }

  async login(
    username: string,
    pin: string
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      if (!/^\d{4}$/.test(pin)) {
        return { ok: false, message: "PIN must be exactly 4 digits" };
      }
      const res = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, {
          username,
          pin,
        })
      );
      this.token.set(res.token);
      this.user.set(res.user);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.storageKey, JSON.stringify(res));
      }
      return { ok: true };
    } catch (e: any) {
      return { ok: false, message: e?.error?.error ?? "Login failed" };
    }
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    if (typeof localStorage !== "undefined")
      localStorage.removeItem(this.storageKey);
    this.router.navigate(["/login"], { replaceUrl: true });
  }

  setUser(user: User) {
    this.user.set(user);
    if (typeof localStorage !== "undefined") {
      const token = this.token();
      if (token) {
        localStorage.setItem(this.storageKey, JSON.stringify({ token, user }));
      }
    }
  }
}
```

---

## 2) `src/app/shared/services/club.service.ts`

```diff
+ ADDED src/app/shared/services/club.service.ts
```

```ts
import { Injectable, computed, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { API_BASE } from "../tokens/api-base.token";
import { Club, toPlainClub } from "../models/club.model";
import type { Member } from "../models/member.model";
import type { EventItem } from "../models/event-item.model";
import { ToastService } from "./toast.service";
import { AuthService } from "./auth.service";

type SortBy = "name-asc" | "name-desc" | "seats-desc" | "capacity-desc";

@Injectable({ providedIn: "root" })
export class ClubService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE, { optional: true }) ?? "/api";
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  // Core state
  clubs = signal<Club[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // UI state (filters)
  searchText = signal("");
  onlyOpen = signal(false);
  sortBy = signal<SortBy>("name-asc");

  // Derived visible list
  visible = computed(() => {
    let list = this.clubs();
    const q = this.searchText().trim().toLowerCase();
    if (q) {
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (this.onlyOpen()) {
      list = list.filter((c) => c.capacity - c.members.length > 0);
    }
    switch (this.sortBy()) {
      case "name-desc":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "seats-desc":
        list = [...list].sort(
          (a, b) =>
            b.capacity - b.members.length - (a.capacity - a.members.length)
        );
        break;
      case "capacity-desc":
        list = [...list].sort((a, b) => b.capacity - a.capacity);
        break;
      default:
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  });

  constructor() {}

  // Seed data used for reset(). Keep in sync with db.json
  private static readonly SEED: Club[] = [
    {
      id: "c-robotics",
      name: "Robotics Club",
      capacity: 6,
      members: [
        { id: "m-r1", name: "Alex" },
        { id: "m-r2", name: "Jordan" },
        { id: "m-r3", name: "Taylor" },
        { id: "m-r4", name: "Blake" },
        { id: "m-r5", name: "Robin" },
        { id: "m-r6", name: "Shawn" },
      ],
      events: [
        {
          id: "e-r1",
          title: "Kickoff Night",
          dateIso: "2025-09-10",
          capacity: 40,
          description: "Project ideas and team formation",
        },
        {
          id: "e-r2",
          title: "Arduino Workshop",
          dateIso: "2025-10-05",
          capacity: 20,
          description: "Intro to microcontrollers",
        },
      ],
    },
    {
      id: "c-literature",
      name: "Literature Circle",
      capacity: 2,
      members: [
        { id: "m-l1", name: "Morgan" },
        { id: "m-l2", name: "Sam" },
      ],
      events: [
        {
          id: "e-l1",
          title: "Poetry Night",
          dateIso: "2025-09-20",
          capacity: 30,
          description: "Open mic and readings",
        },
      ],
    },
    {
      id: "c-gamedev",
      name: "Game Dev Guild",
      capacity: 8,
      members: [
        { id: "m-g1", name: "Casey" },
        { id: "m-g2", name: "Riley" },
        { id: "m-g3", name: "Jamie" },
        { id: "m-g4", name: "Quinn" },
        { id: "m-g5", name: "Ari" },
        { id: "m-g6", name: "Devon" },
        { id: "m-g7", name: "Jules" },
      ],
      events: [
        {
          id: "e-g1",
          title: "Unity Jam",
          dateIso: "2025-09-25",
          capacity: 50,
          description: "Build a game in one night",
        },
        {
          id: "e-g2",
          title: "Pixel Art 101",
          dateIso: "2025-10-12",
          capacity: 25,
          description: "Tools, palettes, and tips",
        },
      ],
    },
    {
      id: "c-outdoors",
      name: "Outdoor Adventures",
      capacity: 6,
      members: [
        { id: "m-o1", name: "Chris" },
        { id: "m-o2", name: "Pat" },
        { id: "m-o3", name: "Dana" },
      ],
      events: [
        {
          id: "e-o1",
          title: "Trail Hike",
          dateIso: "2025-09-07",
          capacity: 20,
          description: "Beginner-friendly 5k hike",
        },
      ],
    },
    {
      id: "c-cooking",
      name: "Culinary Collective",
      capacity: 6,
      members: [
        { id: "m-c1", name: "Avery" },
        { id: "m-c2", name: "Parker" },
        { id: "m-c3", name: "Jesse" },
        { id: "m-c4", name: "Skyler" },
        { id: "m-c5", name: "Reese" },
        { id: "m-c6", name: "Toni" },
      ],
      events: [
        {
          id: "e-c1",
          title: "Pasta Night",
          dateIso: "2025-09-15",
          capacity: 16,
          description: "Fresh pasta from scratch",
        },
      ],
    },
    {
      id: "c-photography",
      name: "Photography Society",
      capacity: 4,
      members: [
        { id: "m-p1", name: "Logan" },
        { id: "m-p2", name: "Harper" },
        { id: "m-p3", name: "River" },
        { id: "m-p4", name: "Sasha" },
      ],
      events: [
        {
          id: "e-p1",
          title: "Golden Hour Walk",
          dateIso: "2025-09-22",
          capacity: 30,
          description: "Campus sunset shoot",
        },
      ],
    },
    {
      id: "c-chess",
      name: "Chess & Strategy",
      capacity: 5,
      members: [
        { id: "m-s1", name: "Lee" },
        { id: "m-s2", name: "Drew" },
        { id: "m-s3", name: "Hayden" },
        { id: "m-s4", name: "Indy" },
        { id: "m-s5", name: "Alexis" },
      ],
      events: [
        {
          id: "e-s1",
          title: "Rapid Tournament",
          dateIso: "2025-10-01",
          capacity: 32,
          description: "Swiss pairings, 10+0",
        },
      ],
    },
    {
      id: "c-film",
      name: "Film Appreciation",
      capacity: 8,
      members: [
        { id: "m-f1", name: "Rowan" },
        { id: "m-f2", name: "Sage" },
        { id: "m-f3", name: "Maya" },
        { id: "m-f4", name: "Noah" },
        { id: "m-f5", name: "Liam" },
        { id: "m-f6", name: "Aria" },
        { id: "m-f7", name: "Theo" },
        { id: "m-f8", name: "Milo" },
      ],
      events: [
        {
          id: "e-f1",
          title: "Classic Noir Night",
          dateIso: "2025-09-18",
          capacity: 50,
          description: "Double feature + discussion",
        },
        {
          id: "e-f2",
          title: "Student Shorts",
          dateIso: "2025-10-20",
          capacity: 80,
          description: "Showcase and Q&A",
        },
      ],
    },
    {
      id: "c-gardening",
      name: "Community Garden",
      capacity: 4,
      members: [
        { id: "m-gd1", name: "Elliot" },
        { id: "m-gd2", name: "Peyton" },
      ],
      events: [
        {
          id: "e-gd1",
          title: "Fall Planting",
          dateIso: "2025-09-12",
          capacity: 20,
          description: "Beds prep and seedlings",
        },
      ],
    },
    {
      id: "c-music",
      name: "Campus Musicians",
      capacity: 6,
      members: [
        { id: "m-m1", name: "Isla" },
        { id: "m-m2", name: "Kai" },
        { id: "m-m3", name: "Zoe" },
      ],
      events: [
        {
          id: "e-m1",
          title: "Open Mic",
          dateIso: "2025-09-28",
          capacity: 60,
          description: "Sign-ups at the door",
        },
      ],
    },
  ];

  // Compact example of the expected JSON import schema
  private static readonly SCHEMA_EXAMPLE = `[
	{
		"id": "c-robotics",
		"name": "Robotics Club",
		"capacity": 6,
		"members": [
			{ "id": "u-123", "name": "alex" }
		],
		"events": [
			{
				"id": "e-1",
				"title": "Kickoff Night",
				"dateIso": "2025-09-10",
				"capacity": 40,
				"description": "Optional description"
			}
		]
	}
]`;

  // Expose for UI to display under error messages
  schemaExample: string = ClubService.SCHEMA_EXAMPLE;

  async load(): Promise<void> {
    if (this.clubs().length > 0) {
      this.loading.set(false);
      this.error.set(null);
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const url = `${this.apiBase}/clubs?cb=${Date.now()}`;
      const data = await firstValueFrom(this.http.get<Club[]>(url));
      if (Array.isArray(data)) {
        this.clubs.set(data);
      }
    } catch (err: any) {
      this.error.set(err?.message ?? "Failed to load clubs");
      this.toast.error("Failed to load clubs");
    } finally {
      this.loading.set(false);
    }
  }

  async fetchClub(id: string): Promise<Club | null> {
    try {
      const club = await firstValueFrom(
        this.http.get<Club>(`${this.apiBase}/clubs/${id}`)
      );
      if (!club) return null;
      const list = this.clubs();
      const idx = list.findIndex((c) => c.id === club.id);
      if (idx === -1) {
        this.clubs.set([...list, club]);
      } else {
        const next = [...list];
        next[idx] = club;
        this.clubs.set(next);
      }
      return club;
    } catch (e) {
      return null;
    }
  }

  updateClub(
    clubId: string,
    changes: Partial<Pick<Club, "name" | "capacity">>
  ): { ok: boolean; message?: string } {
    if (!this.auth.isAdmin()) {
      this.toast.error("Admins only");
      return { ok: false, message: "Admins only" };
    }
    if (changes.name !== undefined && !changes.name.trim()) {
      return { ok: false, message: "Name is required" };
    }
    if (changes.capacity !== undefined && changes.capacity <= 0) {
      return { ok: false, message: "Capacity must be > 0" };
    }
    const current = this.clubs().find((c) => c.id === clubId);
    const result = this.updateClubOptimistic(clubId, (c) => {
      const next: Club = {
        ...c,
        name: changes.name !== undefined ? changes.name.trim() : c.name,
        capacity: changes.capacity ?? c.capacity,
      };
      if (next.capacity < next.members.length) {
        return { ok: false, message: "Capacity below current members" };
      }
      Object.assign(c, next);
      return { ok: true };
    });
    if (result.ok && current) {
      const nextName =
        changes.name !== undefined ? changes.name.trim() : current.name;
      this.toast.success(`Updated club “${nextName}”`);
    }
    return result;
  }

  async deleteClub(clubId: string): Promise<boolean> {
    if (!this.auth.isAdmin()) {
      this.toast.error("Admins only");
      return false;
    }
    const prev = this.clubs();
    const target = prev.find((c) => c.id === clubId);
    if (!target) return false;
    this.clubs.set(prev.filter((c) => c.id !== clubId));
    try {
      await firstValueFrom(this.http.delete(`${this.apiBase}/clubs/${clubId}`));
      this.toast.danger(`Deleted club “${target.name}”`);
      return true;
    } catch {
      this.clubs.set(prev);
      this.error.set("Failed to delete club");
      this.toast.error(`Failed to delete club “${target.name}”`);
      return false;
    }
  }

  createClub(input: { name: string; capacity: number }): {
    ok: boolean;
    message?: string;
  } {
    if (!this.auth.isAdmin()) {
      this.toast.error("Admins only");
      return { ok: false, message: "Admins only" };
    }
    const name = input.name.trim();
    if (!name) return { ok: false, message: "Name is required" };
    if (input.capacity <= 0)
      return { ok: false, message: "Capacity must be > 0" };
    if (this.clubs().some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, message: "A club with that name already exists" };
    }
    const club: Club = {
      id: crypto.randomUUID(),
      name,
      capacity: input.capacity,
      members: [],
      events: [],
    };
    const prev = this.clubs();
    this.clubs.set([club, ...prev]);
    firstValueFrom(this.http.post<Club>(`${this.apiBase}/clubs`, club))
      .then((saved) => {
        if (saved && saved.id && saved.id !== club.id) {
          this.clubs.update((list) =>
            list.map((c) => (c.id === club.id ? { ...saved } : c))
          );
        }
        this.toast.success(`Created club “${name}”`);
      })
      .catch(() => {
        this.error.set("Failed to create club");
        this.toast.error(`Failed to create club “${name}”`);
        this.clubs.set(prev);
      });
    return { ok: true };
  }

  addMember(
    clubId: string,
    name: string,
    opts?: { silent?: boolean }
  ): { ok: boolean; message?: string } {
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, message: "Member name required" };
    return this.updateClubOptimistic(clubId, (c) => {
      if (c.members.length >= c.capacity)
        return { ok: false, message: "Club is at capacity" };
      if (
        c.members.some((m) => m.name.toLowerCase() === trimmed.toLowerCase())
      ) {
        return { ok: false, message: "Duplicate member" };
      }
      const member: Member = { id: crypto.randomUUID(), name: trimmed };
      c.members = [...c.members, member];
      if (!opts?.silent)
        this.toast.success(`Added member “${trimmed}” to “${c.name}”`);
      return { ok: true };
    });
  }

  removeMember(clubId: string, memberId: string): void {
    this.updateClubOptimistic(clubId, (c) => {
      const removed = c.members.find((m) => m.id === memberId);
      c.members = c.members.filter((m) => m.id !== memberId);
      if (removed)
        this.toast.info(`Removed member “${removed.name}” from “${c.name}”`);
      return { ok: true };
    });
  }

  /** Hold a spot for the current user */
  holdSpot(clubId: string): { ok: boolean; message?: string } {
    const user = this.auth.user();
    if (!user) return { ok: false, message: "You must be logged in" };
    const current = this.clubs();
    const idx = current.findIndex((c) => c.id === clubId);
    if (idx === -1) return { ok: false, message: "Club not found" };
    const club = current[idx];
    if (club.members.length >= club.capacity)
      return { ok: false, message: "Club is at capacity" };
    if (club.members.some((m) => m.id === user.id))
      return { ok: false, message: "You already hold a spot" };
    if (
      club.members.some(
        (m) => m.name.toLowerCase() === user.username.toLowerCase()
      )
    )
      return { ok: false, message: "Duplicate member" };

    const nextMembers = [...club.members, { id: user.id, name: user.username }];
    const prevSnapshot = [...current];
    const next = [...current];
    next[idx] = { ...club, members: nextMembers };
    this.clubs.set(next);
    firstValueFrom(
      this.http.patch<Club>(`${this.apiBase}/clubs/${clubId}`, {
        members: nextMembers.map((m) => ({ id: m.id, name: m.name })),
      })
    )
      .then(() =>
        this.toast.success(`You have held your spot in “${club.name}”`)
      )
      .catch((err) => {
        this.error.set("Failed to save changes");
        const status = err?.status;
        if (status === 401 || status === 403)
          this.toast.error("Not allowed to hold a spot");
        else this.toast.error("Failed to save changes");
        this.clubs.set(prevSnapshot);
      });
    return { ok: true };
  }

  /** Give up the current user's spot */
  giveUpSpot(clubId: string): void {
    const user = this.auth.user();
    if (!user) return;
    const current = this.clubs();
    const idx = current.findIndex((c) => c.id === clubId);
    if (idx === -1) return;
    const club = current[idx];
    const hadSeat = club.members.some((m) => m.id === user.id);
    if (!hadSeat) return;
    const nextMembers = club.members.filter((m) => m.id !== user.id);
    const prevSnapshot = [...current];
    const next = [...current];
    next[idx] = { ...club, members: nextMembers };
    this.clubs.set(next);
    firstValueFrom(
      this.http.patch<Club>(`${this.apiBase}/clubs/${clubId}`, {
        members: nextMembers.map((m) => ({ id: m.id, name: m.name })),
      })
    )
      .then(() =>
        this.toast.info(`You have given up your spot in “${club.name}”`)
      )
      .catch((err) => {
        this.error.set("Failed to save changes");
        const status = err?.status;
        if (status === 401 || status === 403)
          this.toast.error("Not allowed to give up a spot");
        else this.toast.error("Failed to save changes");
        this.clubs.set(prevSnapshot);
      });
  }

  // Deprecated helpers
  quickJoin(clubId: string, name = "Guest"): { ok: boolean; message?: string } {
    return this.holdSpot(clubId);
  }
  quickLeave(clubId: string): void {
    this.giveUpSpot(clubId);
  }

  addEvent(
    clubId: string,
    input: Omit<EventItem, "id">
  ): { ok: boolean; message?: string } {
    if (!/\d{4}-\d{2}-\d{2}/.test(input.dateIso))
      return { ok: false, message: "Invalid date" };
    if (!input.title.trim()) return { ok: false, message: "Title required" };
    return this.updateClubOptimistic(clubId, (c) => {
      const event: EventItem = { id: crypto.randomUUID(), ...input };
      c.events = [...c.events, event].sort((a, b) =>
        a.dateIso.localeCompare(b.dateIso)
      );
      this.toast.success(`Added event “${input.title}” to “${c.name}”`);
      return { ok: true };
    });
  }

  removeEvent(clubId: string, eventId: string): void {
    this.updateClubOptimistic(clubId, (c) => {
      const removed = c.events.find((e) => e.id === eventId);
      c.events = c.events.filter((e) => e.id !== eventId);
      if (removed)
        this.toast.info(`Removed event “${removed.title}” from “${c.name}”`);
      return { ok: true };
    });
  }

  // Import/Export/Reset
  exportJson(): string {
    return JSON.stringify(this.clubs().map(toPlainClub), null, 2);
  }

  /**
   * Validate the JSON payload for importing clubs with strict schema.
   */
  private validateImportPayload(input: any): {
    ok: boolean;
    message?: string;
    value?: Club[];
  } {
    const isString = (v: any): v is string => typeof v === "string";
    const isNumber = (v: any): v is number =>
      typeof v === "number" && !isNaN(v);
    const isObject = (v: any): v is Record<string, any> =>
      v !== null && typeof v === "object" && !Array.isArray(v);
    const isIsoDate = (v: any): v is string =>
      isString(v) && /^\d{4}-\d{2}-\d{2}$/.test(v);

    if (!Array.isArray(input))
      return { ok: false, message: "Top-level JSON must be an array of clubs" };

    const normalized: Club[] = [];
    for (let i = 0; i < input.length; i++) {
      const c = input[i];
      const label = `club[${i}]`;
      if (!isObject(c))
        return { ok: false, message: `${label} must be an object` };
      const allowedClubKeys = new Set([
        "id",
        "name",
        "capacity",
        "members",
        "events",
      ]);
      for (const k of Object.keys(c)) {
        if (!allowedClubKeys.has(k))
          return { ok: false, message: `${label} has unknown field "${k}"` };
      }

      const { id, name, capacity, members, events } = c as any;
      if (!isString(id) || !id.trim())
        return { ok: false, message: `${label}.id must be a non-empty string` };
      if (!isString(name) || !name.trim())
        return {
          ok: false,
          message: `${label}.name must be a non-empty string`,
        };
      if (!isNumber(capacity) || !Number.isInteger(capacity) || capacity <= 0)
        return {
          ok: false,
          message: `${label}.capacity must be a positive integer`,
        };

      if (!Array.isArray(members))
        return { ok: false, message: `${label}.members must be an array` };
      const mm = members as any[];
      const seenMemberIds = new Set<string>();
      const seenMemberNames = new Set<string>();
      const normalizedMembers: Member[] = [];
      for (let j = 0; j < mm.length; j++) {
        const m = mm[j];
        const mLabel = `${label}.members[${j}]`;
        if (!isObject(m))
          return { ok: false, message: `${mLabel} must be an object` };
        const allowedMemberKeys = new Set(["id", "name"]);
        for (const k of Object.keys(m)) {
          if (!allowedMemberKeys.has(k))
            return { ok: false, message: `${mLabel} has unknown field "${k}"` };
        }
        if (!isString(m["id"]) || !m["id"].trim())
          return {
            ok: false,
            message: `${mLabel}.id must be a non-empty string`,
          };
        if (!isString(m["name"]) || !m["name"].trim())
          return {
            ok: false,
            message: `${mLabel}.name must be a non-empty string`,
          };
        if (seenMemberIds.has(m["id"]))
          return {
            ok: false,
            message: `${mLabel}.id is duplicated within club`,
          };
        if (seenMemberNames.has(m["name"].toLowerCase()))
          return {
            ok: false,
            message: `${mLabel}.name is duplicated within club`,
          };
        seenMemberIds.add(m["id"]);
        seenMemberNames.add(m["name"].toLowerCase());
        normalizedMembers.push({ id: m["id"], name: m["name"] });
      }

      if (!Array.isArray(events))
        return { ok: false, message: `${label}.events must be an array` };
      const ee = events as any[];
      const seenEventIds = new Set<string>();
      const normalizedEvents: EventItem[] = [];
      for (let k = 0; k < ee.length; k++) {
        const e = ee[k];
        const eLabel = `${label}.events[${k}]`;
        if (!isObject(e))
          return { ok: false, message: `${eLabel} must be an object` };
        const allowedEventKeys = new Set([
          "id",
          "title",
          "dateIso",
          "capacity",
          "description",
        ]);
        for (const k of Object.keys(e)) {
          if (!allowedEventKeys.has(k))
            return { ok: false, message: `${eLabel} has unknown field "${k}"` };
        }
        if (!isString(e["id"]) || !e["id"].trim())
          return {
            ok: false,
            message: `${eLabel}.id must be a non-empty string`,
          };
        if (seenEventIds.has(e["id"]))
          return {
            ok: false,
            message: `${eLabel}.id is duplicated within club`,
          };
        if (!isString(e["title"]) || !e["title"].trim())
          return {
            ok: false,
            message: `${eLabel}.title must be a non-empty string`,
          };
        if (!isIsoDate(e["dateIso"]))
          return { ok: false, message: `${eLabel}.dateIso must be YYYY-MM-DD` };
        if (
          !isNumber(e["capacity"]) ||
          !Number.isInteger(e["capacity"]) ||
          e["capacity"] < 0
        )
          return {
            ok: false,
            message: `${eLabel}.capacity must be a non-negative integer`,
          };
        if (e["description"] !== undefined && !isString(e["description"]))
          return {
            ok: false,
            message: `${eLabel}.description must be a string if provided`,
          };
        seenEventIds.add(e["id"]);
        normalizedEvents.push({
          id: e["id"],
          title: e["title"],
          dateIso: e["dateIso"],
          capacity: e["capacity"],
          description: e["description"],
        });
      }

      if (capacity < normalizedMembers.length)
        return {
          ok: false,
          message: `${label}.capacity (${capacity}) cannot be less than number of members (${normalizedMembers.length})`,
        };

      normalized.push({
        id,
        name: name.trim(),
        capacity,
        members: normalizedMembers,
        events: normalizedEvents,
      });
    }

    return { ok: true, value: normalized };
  }

  importJson(json: string): { ok: boolean; message?: string } {
    try {
      const data = JSON.parse(json);
      const validation = this.validateImportPayload(data);
      if (!validation.ok) return { ok: false, message: validation.message };
      const cleaned = validation.value!;
      const prev = this.clubs();
      // Optimistically update UI while persisting to server
      this.clubs.set(cleaned);
      // Persist on server in background: delete all, then recreate
      (async () => {
        try {
          type User = { id: string; username: string; isAdmin?: boolean };
          let users: User[] = [];
          try {
            users = await firstValueFrom(
              this.http.get<User[]>(`${this.apiBase}/users`)
            );
          } catch {
            users = [];
          }
          const userByName = new Map<string, User>(
            (users ?? []).map((u) => [u.username.toLowerCase(), u])
          );
          const mapMembersToUsers = (members: { id: string; name: string }[]) =>
            members.map((m) => {
              const u = userByName.get(m.name.toLowerCase());
              return u ? { id: u.id, name: u.username } : m;
            });

          const existing = await firstValueFrom(
            this.http.get<Club[]>(`${this.apiBase}/clubs`)
          );
          // delete existing clubs
          await Promise.allSettled(
            (existing ?? []).map((c) =>
              firstValueFrom(this.http.delete(`${this.apiBase}/clubs/${c.id}`))
            )
          );
          // create new clubs; let server assign ids for consistency
          const created: Club[] = [];
          for (const c of cleaned) {
            const payload = toPlainClub({
              ...c,
              id: c.id,
              members: mapMembersToUsers(c.members ?? []),
            });
            const saved = await firstValueFrom(
              this.http.post<Club>(`${this.apiBase}/clubs`, payload)
            );
            created.push(saved ?? c);
          }
          // Refresh client state from server (source of truth)
          const fresh = await firstValueFrom(
            this.http.get<Club[]>(`${this.apiBase}/clubs`)
          );
          this.clubs.set(fresh ?? created);
          this.toast.success("Import complete");
        } catch (e) {
          this.error.set("Failed to import data");
          this.toast.error("Failed to import data");
          // Reload from server to reconcile
          try {
            const fresh = await firstValueFrom(
              this.http.get<Club[]>(`${this.apiBase}/clubs`)
            );
            this.clubs.set(fresh ?? prev);
          } catch {
            this.clubs.set(prev);
          }
        }
      })();
      return { ok: true };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "Invalid JSON" };
    }
  }

  reset(): void {
    const prev = this.clubs();
    // Optimistic set to seed immediately in UI
    this.clubs.set([...ClubService.SEED]);
    (async () => {
      try {
        // Fetch users to link seeded members to real users by username
        type User = { id: string; username: string; isAdmin?: boolean };
        let users: User[] = [];
        try {
          users = await firstValueFrom(
            this.http.get<User[]>(`${this.apiBase}/users`)
          );
        } catch {
          users = [];
        }
        const userByName = new Map<string, User>(
          (users ?? []).map((u) => [u.username.toLowerCase(), u])
        );
        const mapMembersToUsers = (members: { id: string; name: string }[]) =>
          members.map((m) => {
            const u = userByName.get(m.name.toLowerCase());
            return u ? { id: u.id, name: u.username } : m;
          });

        const existing = await firstValueFrom(
          this.http.get<Club[]>(`${this.apiBase}/clubs`)
        );
        // Delete all existing on server
        await Promise.allSettled(
          (existing ?? []).map((c) =>
            firstValueFrom(this.http.delete(`${this.apiBase}/clubs/${c.id}`))
          )
        );
        // Recreate from seed
        const created: Club[] = [];
        for (const c of ClubService.SEED) {
          // Link members to real users where possible
          const payload = toPlainClub({
            ...c,
            members: mapMembersToUsers(c.members),
          });
          const saved = await firstValueFrom(
            this.http.post<Club>(`${this.apiBase}/clubs`, payload)
          );
          created.push(saved ?? c);
        }
        // Refresh from server as source of truth
        const fresh = await firstValueFrom(
          this.http.get<Club[]>(`${this.apiBase}/clubs`)
        );
        this.clubs.set(fresh ?? created);
        this.toast.success("Reset complete");
      } catch {
        this.error.set("Failed to reset");
        this.toast.error("Failed to reset");
        this.clubs.set(prev);
      }
    })();
  }

  // Utility to update a club immutably with validation result
  private updateClubOptimistic<T extends { ok: boolean; message?: string }>(
    clubId: string,
    mutator: (c: Club) => T
  ): T {
    const current = this.clubs();
    const idx = current.findIndex((c) => c.id === clubId);
    if (idx === -1) return { ok: false, message: "Club not found" } as T;
    const draft: Club = {
      ...current[idx],
      members: [...current[idx].members],
      events: [...current[idx].events],
    };
    const result = mutator(draft);
    if (result.ok) {
      const prevSnapshot = [...current];
      const next = [...current];
      next[idx] = draft;
      this.clubs.set(next);
      // Persist via PUT
      firstValueFrom(
        this.http.put<Club>(
          `${this.apiBase}/clubs/${clubId}`,
          toPlainClub(draft)
        )
      ).catch(() => {
        this.error.set("Failed to save changes");
        this.toast.error("Failed to save changes");
        this.clubs.set(prevSnapshot);
      });
    }
    return result;
  }
}
```

---

## 3) `src/app/shared/services/users.service.ts`

```diff
+ ADDED src/app/shared/services/users.service.ts
```

```ts
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { User } from "../models/user.model";
import { API_BASE } from "../tokens/api-base.token";

@Injectable({ providedIn: "root" })
export class UsersService {
  private http = inject(HttpClient);
  private apiBase = (inject(API_BASE, { optional: true }) ?? "/api").replace(
    /\/+$/,
    ""
  );
  private base = `${this.apiBase}/users`;

  list(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(this.base));
  }
  get(id: string): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${this.base}/${id}`));
  }
  create(input: {
    username: string;
    pin: string;
    isAdmin?: boolean;
  }): Promise<User> {
    return firstValueFrom(this.http.post<User>(this.base, input));
  }
  update(
    id: string,
    changes: Partial<{ username: string; pin: string; isAdmin: boolean }>
  ): Promise<User> {
    return firstValueFrom(this.http.patch<User>(`${this.base}/${id}`, changes));
  }
  remove(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/${id}`));
  }
}
```

---

## 4) `src/app/shared/services/toast.service.ts`

```diff
+ ADDED src/app/shared/services/toast.service.ts
```

```ts
import { Injectable, signal } from "@angular/core";

export type ToastType = "success" | "error" | "info" | "danger";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  timeoutMs: number;
}

@Injectable({ providedIn: "root" })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(type: ToastType, message: string, timeoutMs = 3500) {
    const id = crypto.randomUUID();
    const toast: Toast = { id, type, message, timeoutMs };
    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(id), timeoutMs);
    return id;
  }
  success(message: string, timeoutMs?: number) {
    return this.show("success", message, timeoutMs);
  }
  error(message: string, timeoutMs?: number) {
    return this.show("error", message, timeoutMs ?? 4500);
  }
  info(message: string, timeoutMs?: number) {
    return this.show("info", message, timeoutMs);
  }
  danger(message: string, timeoutMs?: number) {
    return this.show("danger", message, timeoutMs);
  }
  dismiss(id: string) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
  clear() {
    this.toasts.set([]);
  }
}
```

---

## 5) `src/app/shared/http/auth.interceptor.ts`

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
  const withAuth = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(withAuth);
};
```

---

## 6) `src/app/shared/http/http-error.interceptor.ts`

```diff
+ ADDED src/app/shared/http/http-error.interceptor.ts
```

```ts
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ClubService } from "../services/club.service";
import { AuthService } from "../services/auth.service";

// Maps HTTP errors to friendly messages and surfaces them via ClubService.error
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const svc = inject(ClubService);
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((err: unknown) => {
      let msg = "Something went wrong";
      if (err instanceof HttpErrorResponse) {
        if (err.status === 0) msg = "Network error — check your connection";
        else if (err.status === 401) {
          // If unauthorized (and not the login call), force logout and redirect
          if (!req.url.includes("/auth/login")) {
            auth.logout();
          }
          msg = "Please sign in to continue";
        } else if (err.status >= 500) msg = "Server error — please try again";
        else if (err.status === 404) msg = "Not found";
        else if (err.status === 400) msg = "Invalid request";
        else msg = err.message || msg;
      }
      svc.error.set(msg);
      return throwError(() => err);
    })
  );
};
```

---

## 7) `src/app/shared/tokens/api-base.token.ts`

```diff
+ ADDED src/app/shared/tokens/api-base.token.ts
```

```ts
import { InjectionToken } from "@angular/core";
export const API_BASE = new InjectionToken<string>("API_BASE");
```

---

## Verification / Demo Script

1. (Optional) Provide a mock backend (json-server) and set API proxy to `/api`. Skip UI—invoke methods from dev tools.
2. Call `clubService.load()` once → `loading` flips true → clubs populate → `visible()` returns filtered set.
3. Simulate network error (temporarily change API_BASE value) → interceptor sets `error` with friendly text.
4. Run `authService.login('admin','1234')` (assuming seeded user) → token & user signals set, persisted in localStorage; page refresh restores.
5. Exercise optimistic path: `clubService.createClub({ name: 'Test', capacity: 3 })` then quickly toggle network offline to observe rollback on failure.
6. Import validation: feed malformed JSON (missing fields / wrong types) to `clubService.importJson(...)` and confirm `ok=false` with message.
7. Reset: `clubService.reset()` → seed data instantly appears → after async server sync, any server‑assigned differences reconciled.

Edge Mentions (verbal):

- Do not add logic to components for validation—services already enforce constraints.
- Import & Reset are intentionally heavy; they remain pure service responsibilities (no future edits) even when UI triggers them later.

---

## Single‑Touch Reminder

Do NOT edit these files later. All future lessons (layout, routes, components, admin tools) depend on these stable APIs.

---

## Next Class Preview (Class 17)

Introduce the layout shell (`AppComponent`) and footer that will reference these services & future infrastructure components without modifying them.

---

End of Class 16 Walkthrough (Authoritative)

\n+## Full file contents created/updated in Class 16
\n+Reference appendix (single-touch). Click a filename to expand. These must not be edited later.
\n+<details>

<summary>src/app/shared/services/auth.service.ts</summary>

```ts
import { Injectable, computed, signal, inject } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { User } from "../models/user.model";
import { API_BASE } from "../tokens/api-base.token";

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageKey = "ccm.auth";
  private apiBase = (inject(API_BASE, { optional: true }) ?? "/api").replace(
    /\/+$/,
    ""
  );

  token = signal<string | null>(null);
  user = signal<User | null>(null);
  isAdmin = computed(() => !!this.user()?.isAdmin);

  constructor() {
    const raw =
      typeof localStorage === "undefined"
        ? null
        : localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data?.token && data?.user) {
          this.token.set(data.token);
          this.user.set(data.user);
        }
      } catch {
        // ignore
      }
    }
  }

  async login(
    username: string,
    pin: string
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      if (!/^\d{4}$/.test(pin)) {
        return { ok: false, message: "PIN must be exactly 4 digits" };
      }
      const res = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, {
          username,
          pin,
        })
      );
      this.token.set(res.token);
      this.user.set(res.user);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.storageKey, JSON.stringify(res));
      }
      return { ok: true };
    } catch (e: any) {
      return { ok: false, message: e?.error?.error ?? "Login failed" };
    }
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    if (typeof localStorage !== "undefined")
      localStorage.removeItem(this.storageKey);
    this.router.navigate(["/login"], { replaceUrl: true });
  }

  setUser(user: User) {
    this.user.set(user);
    if (typeof localStorage !== "undefined") {
      const token = this.token();
      if (token) {
        localStorage.setItem(this.storageKey, JSON.stringify({ token, user }));
      }
    }
  }
}
```

</details>

<details>
<summary>src/app/shared/services/club.service.ts</summary>

```ts
import { Injectable, computed, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { API_BASE } from "../tokens/api-base.token";
import { Club, toPlainClub } from "../models/club.model";
import type { Member } from "../models/member.model";
import type { EventItem } from "../models/event-item.model";
import { ToastService } from "./toast.service";
import { AuthService } from "./auth.service";

type SortBy = "name-asc" | "name-desc" | "seats-desc" | "capacity-desc";

@Injectable({ providedIn: "root" })
export class ClubService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE, { optional: true }) ?? "/api";
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  // Core state
  clubs = signal<Club[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // UI state (filters)
  searchText = signal("");
  onlyOpen = signal(false);
  sortBy = signal<SortBy>("name-asc");

  // Derived visible list
  visible = computed(() => {
    let list = this.clubs();
    const q = this.searchText().trim().toLowerCase();
    if (q) {
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (this.onlyOpen()) {
      list = list.filter((c) => c.capacity - c.members.length > 0);
    }
    switch (this.sortBy()) {
      case "name-desc":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "seats-desc":
        list = [...list].sort(
          (a, b) =>
            b.capacity - b.members.length - (a.capacity - a.members.length)
        );
        break;
      case "capacity-desc":
        list = [...list].sort((a, b) => b.capacity - a.capacity);
        break;
      default:
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  });

  constructor() {}

  // Seed data used for reset(). Keep in sync with db.json
  private static readonly SEED: Club[] = [
    {
      id: "c-robotics",
      name: "Robotics Club",
      capacity: 6,
      members: [
        { id: "m-r1", name: "Alex" },
        { id: "m-r2", name: "Jordan" },
        { id: "m-r3", name: "Taylor" },
        { id: "m-r4", name: "Blake" },
        { id: "m-r5", name: "Robin" },
        { id: "m-r6", name: "Shawn" },
      ],
      events: [
        {
          id: "e-r1",
          title: "Kickoff Night",
          dateIso: "2025-09-10",
          capacity: 40,
          description: "Project ideas and team formation",
        },
        {
          id: "e-r2",
          title: "Arduino Workshop",
          dateIso: "2025-10-05",
          capacity: 20,
          description: "Intro to microcontrollers",
        },
      ],
    },
    {
      id: "c-literature",
      name: "Literature Circle",
      capacity: 2,
      members: [
        { id: "m-l1", name: "Morgan" },
        { id: "m-l2", name: "Sam" },
      ],
      events: [
        {
          id: "e-l1",
          title: "Poetry Night",
          dateIso: "2025-09-20",
          capacity: 30,
          description: "Open mic and readings",
        },
      ],
    },
    {
      id: "c-gamedev",
      name: "Game Dev Guild",
      capacity: 8,
      members: [
        { id: "m-g1", name: "Casey" },
        { id: "m-g2", name: "Riley" },
        { id: "m-g3", name: "Jamie" },
        { id: "m-g4", name: "Quinn" },
        { id: "m-g5", name: "Ari" },
        { id: "m-g6", name: "Devon" },
        { id: "m-g7", name: "Jules" },
      ],
      events: [
        {
          id: "e-g1",
          title: "Unity Jam",
          dateIso: "2025-09-25",
          capacity: 50,
          description: "Build a game in one night",
        },
        {
          id: "e-g2",
          title: "Pixel Art 101",
          dateIso: "2025-10-12",
          capacity: 25,
          description: "Tools, palettes, and tips",
        },
      ],
    },
    {
      id: "c-outdoors",
      name: "Outdoor Adventures",
      capacity: 6,
      members: [
        { id: "m-o1", name: "Chris" },
        { id: "m-o2", name: "Pat" },
        { id: "m-o3", name: "Dana" },
      ],
      events: [
        {
          id: "e-o1",
          title: "Trail Hike",
          dateIso: "2025-09-07",
          capacity: 20,
          description: "Beginner-friendly 5k hike",
        },
      ],
    },
    {
      id: "c-cooking",
      name: "Culinary Collective",
      capacity: 6,
      members: [
        { id: "m-c1", name: "Avery" },
        { id: "m-c2", name: "Parker" },
        { id: "m-c3", name: "Jesse" },
        { id: "m-c4", name: "Skyler" },
        { id: "m-c5", name: "Reese" },
        { id: "m-c6", name: "Toni" },
      ],
      events: [
        {
          id: "e-c1",
          title: "Pasta Night",
          dateIso: "2025-09-15",
          capacity: 16,
          description: "Fresh pasta from scratch",
        },
      ],
    },
    {
      id: "c-photography",
      name: "Photography Society",
      capacity: 4,
      members: [
        { id: "m-p1", name: "Logan" },
        { id: "m-p2", name: "Harper" },
        { id: "m-p3", name: "River" },
        { id: "m-p4", name: "Sasha" },
      ],
      events: [
        {
          id: "e-p1",
          title: "Golden Hour Walk",
          dateIso: "2025-09-22",
          capacity: 30,
          description: "Campus sunset shoot",
        },
      ],
    },
    {
      id: "c-chess",
      name: "Chess & Strategy",
      capacity: 5,
      members: [
        { id: "m-s1", name: "Lee" },
        { id: "m-s2", name: "Drew" },
        { id: "m-s3", name: "Hayden" },
        { id: "m-s4", name: "Indy" },
        { id: "m-s5", name: "Alexis" },
      ],
      events: [
        {
          id: "e-s1",
          title: "Rapid Tournament",
          dateIso: "2025-10-01",
          capacity: 32,
          description: "Swiss pairings, 10+0",
        },
      ],
    },
    {
      id: "c-film",
      name: "Film Appreciation",
      capacity: 8,
      members: [
        { id: "m-f1", name: "Rowan" },
        { id: "m-f2", name: "Sage" },
        { id: "m-f3", name: "Maya" },
        { id: "m-f4", name: "Noah" },
        { id: "m-f5", name: "Liam" },
        { id: "m-f6", name: "Aria" },
        { id: "m-f7", name: "Theo" },
        { id: "m-f8", name: "Milo" },
      ],
      events: [
        {
          id: "e-f1",
          title: "Classic Noir Night",
          dateIso: "2025-09-18",
          capacity: 50,
          description: "Double feature + discussion",
        },
        {
          id: "e-f2",
          title: "Student Shorts",
          dateIso: "2025-10-20",
          capacity: 80,
          description: "Showcase and Q&A",
        },
      ],
    },
    {
      id: "c-gardening",
      name: "Community Garden",
      capacity: 4,
      members: [
        { id: "m-gd1", name: "Elliot" },
        { id: "m-gd2", name: "Peyton" },
      ],
      events: [
        {
          id: "e-gd1",
          title: "Fall Planting",
          dateIso: "2025-09-12",
          capacity: 20,
          description: "Beds prep and seedlings",
        },
      ],
    },
    {
      id: "c-music",
      name: "Campus Musicians",
      capacity: 6,
      members: [
        { id: "m-m1", name: "Isla" },
        { id: "m-m2", name: "Kai" },
        { id: "m-m3", name: "Zoe" },
      ],
      events: [
        {
          id: "e-m1",
          title: "Open Mic",
          dateIso: "2025-09-28",
          capacity: 60,
          description: "Sign-ups at the door",
        },
      ],
    },
  ];

  // Compact example of the expected JSON import schema
  private static readonly SCHEMA_EXAMPLE = `[\n\t{\n\t\t"id": "c-robotics",\n\t\t"name": "Robotics Club",\n\t\t"capacity": 6,\n\t\t"members": [\n\t\t\t{ "id": "u-123", "name": "alex" }\n\t\t],\n\t\t"events": [\n\t\t\t{\n\t\t\t\t"id": "e-1",\n\t\t\t\t"title": "Kickoff Night",\n\t\t\t\t"dateIso": "2025-09-10",\n\t\t\t\t"capacity": 40,\n\t\t\t\t"description": "Optional description"\n\t\t\t}\n\t\t]\n\t}\n]`;

  // Expose for UI to display under error messages
  schemaExample: string = ClubService.SCHEMA_EXAMPLE;

  async load(): Promise<void> {
    if (this.clubs().length > 0) {
      this.loading.set(false);
      this.error.set(null);
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const url = `${this.apiBase}/clubs?cb=${Date.now()}`;
      const data = await firstValueFrom(this.http.get<Club[]>(url));
      if (Array.isArray(data)) {
        this.clubs.set(data);
      }
    } catch (err: any) {
      this.error.set(err?.message ?? "Failed to load clubs");
      this.toast.error("Failed to load clubs");
    } finally {
      this.loading.set(false);
    }
  }

  async fetchClub(id: string): Promise<Club | null> {
    try {
      const club = await firstValueFrom(
        this.http.get<Club>(`${this.apiBase}/clubs/${id}`)
      );
      if (!club) return null;
      const list = this.clubs();
      const idx = list.findIndex((c) => c.id === club.id);
      if (idx === -1) {
        this.clubs.set([...list, club]);
      } else {
        const next = [...list];
        next[idx] = club;
        this.clubs.set(next);
      }
      return club;
    } catch (e) {
      return null;
    }
  }

  updateClub(
    clubId: string,
    changes: Partial<Pick<Club, "name" | "capacity">>
  ): { ok: boolean; message?: string } {
    if (!this.auth.isAdmin()) {
      this.toast.error("Admins only");
      return { ok: false, message: "Admins only" };
    }
    if (changes.name !== undefined && !changes.name.trim()) {
      return { ok: false, message: "Name is required" };
    }
    if (changes.capacity !== undefined && changes.capacity <= 0) {
      return { ok: false, message: "Capacity must be > 0" };
    }
    const current = this.clubs().find((c) => c.id === clubId);
    const result = this.updateClubOptimistic(clubId, (c) => {
      const next: Club = {
        ...c,
        name: changes.name !== undefined ? changes.name.trim() : c.name,
        capacity: changes.capacity ?? c.capacity,
      };
      if (next.capacity < next.members.length) {
        return { ok: false, message: "Capacity below current members" };
      }
      Object.assign(c, next);
      return { ok: true };
    });
    if (result.ok && current) {
      const nextName =
        changes.name !== undefined ? changes.name.trim() : current.name;
      this.toast.success(`Updated club “${nextName}”`);
    }
    return result;
  }

  async deleteClub(clubId: string): Promise<boolean> {
    if (!this.auth.isAdmin()) {
      this.toast.error("Admins only");
      return false;
    }
    const prev = this.clubs();
    const target = prev.find((c) => c.id === clubId);
    if (!target) return false;
    this.clubs.set(prev.filter((c) => c.id !== clubId));
    try {
      await firstValueFrom(this.http.delete(`${this.apiBase}/clubs/${clubId}`));
      this.toast.danger(`Deleted club “${target.name}”`);
      return true;
    } catch {
      this.clubs.set(prev);
      this.error.set("Failed to delete club");
      this.toast.error(`Failed to delete club “${target.name}”`);
      return false;
    }
  }

  createClub(input: { name: string; capacity: number }): {
    ok: boolean;
    message?: string;
  } {
    if (!this.auth.isAdmin()) {
      this.toast.error("Admins only");
      return { ok: false, message: "Admins only" };
    }
    const name = input.name.trim();
    if (!name) return { ok: false, message: "Name is required" };
    if (input.capacity <= 0)
      return { ok: false, message: "Capacity must be > 0" };
    if (this.clubs().some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, message: "A club with that name already exists" };
    }
    const club: Club = {
      id: crypto.randomUUID(),
      name,
      capacity: input.capacity,
      members: [],
      events: [],
    };
    const prev = this.clubs();
    this.clubs.set([club, ...prev]);
    firstValueFrom(this.http.post<Club>(`${this.apiBase}/clubs`, club))
      .then((saved) => {
        if (saved && saved.id && saved.id !== club.id) {
          this.clubs.update((list) =>
            list.map((c) => (c.id === club.id ? { ...saved } : c))
          );
        }
        this.toast.success(`Created club “${name}”`);
      })
      .catch(() => {
        this.error.set("Failed to create club");
        this.toast.error(`Failed to create club “${name}”`);
        this.clubs.set(prev);
      });
    return { ok: true };
  }

  addMember(
    clubId: string,
    name: string,
    opts?: { silent?: boolean }
  ): { ok: boolean; message?: string } {
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, message: "Member name required" };
    return this.updateClubOptimistic(clubId, (c) => {
      if (c.members.length >= c.capacity)
        return { ok: false, message: "Club is at capacity" };
      if (
        c.members.some((m) => m.name.toLowerCase() === trimmed.toLowerCase())
      ) {
        return { ok: false, message: "Duplicate member" };
      }
      const member: Member = { id: crypto.randomUUID(), name: trimmed };
      c.members = [...c.members, member];
      if (!opts?.silent)
        this.toast.success(`Added member “${trimmed}” to “${c.name}”`);
      return { ok: true };
    });
  }

  removeMember(clubId: string, memberId: string): void {
    this.updateClubOptimistic(clubId, (c) => {
      const removed = c.members.find((m) => m.id === memberId);
      c.members = c.members.filter((m) => m.id !== memberId);
      if (removed)
        this.toast.info(`Removed member “${removed.name}” from “${c.name}”`);
      return { ok: true };
    });
  }

  /** Hold a spot for the current user */
  holdSpot(clubId: string): { ok: boolean; message?: string } {
    const user = this.auth.user();
    if (!user) return { ok: false, message: "You must be logged in" };
    const current = this.clubs();
    const idx = current.findIndex((c) => c.id === clubId);
    if (idx === -1) return { ok: false, message: "Club not found" };
    const club = current[idx];
    if (club.members.length >= club.capacity)
      return { ok: false, message: "Club is at capacity" };
    if (club.members.some((m) => m.id === user.id))
      return { ok: false, message: "You already hold a spot" };
    if (
      club.members.some(
        (m) => m.name.toLowerCase() === user.username.toLowerCase()
      )
    )
      return { ok: false, message: "Duplicate member" };

    const nextMembers = [...club.members, { id: user.id, name: user.username }];
    const prevSnapshot = [...current];
    const next = [...current];
    next[idx] = { ...club, members: nextMembers };
    this.clubs.set(next);
    firstValueFrom(
      this.http.patch<Club>(`${this.apiBase}/clubs/${clubId}`, {
        members: nextMembers.map((m) => ({ id: m.id, name: m.name })),
      })
    )
      .then(() =>
        this.toast.success(`You have held your spot in “${club.name}”`)
      )
      .catch((err) => {
        this.error.set("Failed to save changes");
        const status = err?.status;
        if (status === 401 || status === 403)
          this.toast.error("Not allowed to hold a spot");
        else this.toast.error("Failed to save changes");
        this.clubs.set(prevSnapshot);
      });
    return { ok: true };
  }

  /** Give up the current user's spot */
  giveUpSpot(clubId: string): void {
    const user = this.auth.user();
    if (!user) return;
    const current = this.clubs();
    const idx = current.findIndex((c) => c.id === clubId);
    if (idx === -1) return;
    const club = current[idx];
    const hadSeat = club.members.some((m) => m.id === user.id);
    if (!hadSeat) return;
    const nextMembers = club.members.filter((m) => m.id !== user.id);
    const prevSnapshot = [...current];
    const next = [...current];
    next[idx] = { ...club, members: nextMembers };
    this.clubs.set(next);
    firstValueFrom(
      this.http.patch<Club>(`${this.apiBase}/clubs/${clubId}`, {
        members: nextMembers.map((m) => ({ id: m.id, name: m.name })),
      })
    )
      .then(() =>
        this.toast.info(`You have given up your spot in “${club.name}”`)
      )
      .catch((err) => {
        this.error.set("Failed to save changes");
        const status = err?.status;
        if (status === 401 || status === 403)
          this.toast.error("Not allowed to give up a spot");
        else this.toast.error("Failed to save changes");
        this.clubs.set(prevSnapshot);
      });
  }

  // Deprecated helpers
  quickJoin(clubId: string, name = "Guest"): { ok: boolean; message?: string } {
    return this.holdSpot(clubId);
  }
  quickLeave(clubId: string): void {
    this.giveUpSpot(clubId);
  }

  addEvent(
    clubId: string,
    input: Omit<EventItem, "id">
  ): { ok: boolean; message?: string } {
    if (!/\d{4}-\d{2}-\d{2}/.test(input.dateIso))
      return { ok: false, message: "Invalid date" };
    if (!input.title.trim()) return { ok: false, message: "Title required" };
    return this.updateClubOptimistic(clubId, (c) => {
      const event: EventItem = { id: crypto.randomUUID(), ...input };
      c.events = [...c.events, event].sort((a, b) =>
        a.dateIso.localeCompare(b.dateIso)
      );
      this.toast.success(`Added event “${input.title}” to “${c.name}”`);
      return { ok: true };
    });
  }

  removeEvent(clubId: string, eventId: string): void {
    this.updateClubOptimistic(clubId, (c) => {
      const removed = c.events.find((e) => e.id === eventId);
      c.events = c.events.filter((e) => e.id !== eventId);
      if (removed)
        this.toast.info(`Removed event “${removed.title}” from “${c.name}”`);
      return { ok: true };
    });
  }

  // Import/Export/Reset
  exportJson(): string {
    return JSON.stringify(this.clubs().map(toPlainClub), null, 2);
  }

  /**
   * Validate the JSON payload for importing clubs with strict schema.
   */
  private validateImportPayload(input: any): {
    ok: boolean;
    message?: string;
    value?: Club[];
  } {
    const isString = (v: any): v is string => typeof v === "string";
    const isNumber = (v: any): v is number =>
      typeof v === "number" && !isNaN(v);
    const isObject = (v: any): v is Record<string, any> =>
      v !== null && typeof v === "object" && !Array.isArray(v);
    const isIsoDate = (v: any): v is string =>
      isString(v) && /^\d{4}-\d{2}-\d{2}$/.test(v);

    if (!Array.isArray(input))
      return { ok: false, message: "Top-level JSON must be an array of clubs" };

    const normalized: Club[] = [];
    for (let i = 0; i < input.length; i++) {
      const c = input[i];
      const label = `club[${i}]`;
      if (!isObject(c))
        return { ok: false, message: `${label} must be an object` };
      const allowedClubKeys = new Set([
        "id",
        "name",
        "capacity",
        "members",
        "events",
      ]);
      for (const k of Object.keys(c)) {
        if (!allowedClubKeys.has(k))
          return { ok: false, message: `${label} has unknown field "${k}"` };
      }

      const { id, name, capacity, members, events } = c as any;
      if (!isString(id) || !id.trim())
        return { ok: false, message: `${label}.id must be a non-empty string` };
      if (!isString(name) || !name.trim())
        return {
          ok: false,
          message: `${label}.name must be a non-empty string`,
        };
      if (!isNumber(capacity) || !Number.isInteger(capacity) || capacity <= 0)
        return {
          ok: false,
          message: `${label}.capacity must be a positive integer`,
        };

      if (!Array.isArray(members))
        return { ok: false, message: `${label}.members must be an array` };
      const mm = members as any[];
      const seenMemberIds = new Set<string>();
      const seenMemberNames = new Set<string>();
      const normalizedMembers: Member[] = [];
      for (let j = 0; j < mm.length; j++) {
        const m = mm[j];
        const mLabel = `${label}.members[${j}]`;
        if (!isObject(m))
          return { ok: false, message: `${mLabel} must be an object` };
        const allowedMemberKeys = new Set(["id", "name"]);
        for (const k of Object.keys(m)) {
          if (!allowedMemberKeys.has(k))
            return { ok: false, message: `${mLabel} has unknown field "${k}"` };
        }
        if (!isString(m["id"]) || !m["id"].trim())
          return {
            ok: false,
            message: `${mLabel}.id must be a non-empty string`,
          };
        if (!isString(m["name"]) || !m["name"].trim())
          return {
            ok: false,
            message: `${mLabel}.name must be a non-empty string`,
          };
        if (seenMemberIds.has(m["id"]))
          return {
            ok: false,
            message: `${mLabel}.id is duplicated within club`,
          };
        if (seenMemberNames.has(m["name"].toLowerCase()))
          return {
            ok: false,
            message: `${mLabel}.name is duplicated within club`,
          };
        seenMemberIds.add(m["id"]);
        seenMemberNames.add(m["name"].toLowerCase());
        normalizedMembers.push({ id: m["id"], name: m["name"] });
      }

      if (!Array.isArray(events))
        return { ok: false, message: `${label}.events must be an array` };
      const ee = events as any[];
      const seenEventIds = new Set<string>();
      const normalizedEvents: EventItem[] = [];
      for (let k = 0; k < ee.length; k++) {
        const e = ee[k];
        const eLabel = `${label}.events[${k}]`;
        if (!isObject(e))
          return { ok: false, message: `${eLabel} must be an object` };
        const allowedEventKeys = new Set([
          "id",
          "title",
          "dateIso",
          "capacity",
          "description",
        ]);
        for (const k of Object.keys(e)) {
          if (!allowedEventKeys.has(k))
            return { ok: false, message: `${eLabel} has unknown field "${k}"` };
        }
        if (!isString(e["id"]) || !e["id"].trim())
          return {
            ok: false,
            message: `${eLabel}.id must be a non-empty string`,
          };
        if (seenEventIds.has(e["id"]))
          return {
            ok: false,
            message: `${eLabel}.id is duplicated within club`,
          };
        if (!isString(e["title"]) || !e["title"].trim())
          return {
            ok: false,
            message: `${eLabel}.title must be a non-empty string`,
          };
        if (!isIsoDate(e["dateIso"]))
          return { ok: false, message: `${eLabel}.dateIso must be YYYY-MM-DD` };
        if (
          !isNumber(e["capacity"]) ||
          !Number.isInteger(e["capacity"]) ||
          e["capacity"] < 0
        )
          return {
            ok: false,
            message: `${eLabel}.capacity must be a non-negative integer`,
          };
        if (e["description"] !== undefined && !isString(e["description"]))
          return {
            ok: false,
            message: `${eLabel}.description must be a string if provided`,
          };
        seenEventIds.add(e["id"]);
        normalizedEvents.push({
          id: e["id"],
          title: e["title"],
          dateIso: e["dateIso"],
          capacity: e["capacity"],
          description: e["description"],
        });
      }

      if (capacity < normalizedMembers.length)
        return {
          ok: false,
          message: `${label}.capacity (${capacity}) cannot be less than number of members (${normalizedMembers.length})`,
        };

      normalized.push({
        id,
        name: name.trim(),
        capacity,
        members: normalizedMembers,
        events: normalizedEvents,
      });
    }

    return { ok: true, value: normalized };
  }

  importJson(json: string): { ok: boolean; message?: string } {
    try {
      const data = JSON.parse(json);
      const validation = this.validateImportPayload(data);
      if (!validation.ok) return { ok: false, message: validation.message };
      const cleaned = validation.value!;
      const prev = this.clubs();
      // Optimistically update UI while persisting to server
      this.clubs.set(cleaned);
      // Persist on server in background: delete all, then recreate
      (async () => {
        try {
          type User = { id: string; username: string; isAdmin?: boolean };
          let users: User[] = [];
          try {
            users = await firstValueFrom(
              this.http.get<User[]>(`${this.apiBase}/users`)
            );
          } catch {
            users = [];
          }
          const userByName = new Map<string, User>(
            (users ?? []).map((u) => [u.username.toLowerCase(), u])
          );
          const mapMembersToUsers = (members: { id: string; name: string }[]) =>
            members.map((m) => {
              const u = userByName.get(m.name.toLowerCase());
              return u ? { id: u.id, name: u.username } : m;
            });

          const existing = await firstValueFrom(
            this.http.get<Club[]>(`${this.apiBase}/clubs`)
          );
          // delete existing clubs
          await Promise.allSettled(
            (existing ?? []).map((c) =>
              firstValueFrom(this.http.delete(`${this.apiBase}/clubs/${c.id}`))
            )
          );
          // create new clubs; let server assign ids for consistency
          const created: Club[] = [];
          for (const c of cleaned) {
            const payload = toPlainClub({
              ...c,
              id: c.id,
              members: mapMembersToUsers(c.members ?? []),
            });
            const saved = await firstValueFrom(
              this.http.post<Club>(`${this.apiBase}/clubs`, payload)
            );
            created.push(saved ?? c);
          }
          // Refresh client state from server (source of truth)
          const fresh = await firstValueFrom(
            this.http.get<Club[]>(`${this.apiBase}/clubs`)
          );
          this.clubs.set(fresh ?? created);
          this.toast.success("Import complete");
        } catch (e) {
          this.error.set("Failed to import data");
          this.toast.error("Failed to import data");
          // Reload from server to reconcile
          try {
            const fresh = await firstValueFrom(
              this.http.get<Club[]>(`${this.apiBase}/clubs`)
            );
            this.clubs.set(fresh ?? prev);
          } catch {
            this.clubs.set(prev);
          }
        }
      })();
      return { ok: true };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "Invalid JSON" };
    }
  }

  reset(): void {
    const prev = this.clubs();
    // Optimistic set to seed immediately in UI
    this.clubs.set([...ClubService.SEED]);
    (async () => {
      try {
        // Fetch users to link seeded members to real users by username
        type User = { id: string; username: string; isAdmin?: boolean };
        let users: User[] = [];
        try {
          users = await firstValueFrom(
            this.http.get<User[]>(`${this.apiBase}/users`)
          );
        } catch {
          users = [];
        }
        const userByName = new Map<string, User>(
          (users ?? []).map((u) => [u.username.toLowerCase(), u])
        );
        const mapMembersToUsers = (members: { id: string; name: string }[]) =>
          members.map((m) => {
            const u = userByName.get(m.name.toLowerCase());
            return u ? { id: u.id, name: u.username } : m;
          });

        const existing = await firstValueFrom(
          this.http.get<Club[]>(`${this.apiBase}/clubs`)
        );
        // Delete all existing on server
        await Promise.allSettled(
          (existing ?? []).map((c) =>
            firstValueFrom(this.http.delete(`${this.apiBase}/clubs/${c.id}`))
          )
        );
        // Recreate from seed
        const created: Club[] = [];
        for (const c of ClubService.SEED) {
          // Link members to real users where possible
          const payload = toPlainClub({
            ...c,
            members: mapMembersToUsers(c.members),
          });
          const saved = await firstValueFrom(
            this.http.post<Club>(`${this.apiBase}/clubs`, payload)
          );
          created.push(saved ?? c);
        }
        // Refresh from server as source of truth
        const fresh = await firstValueFrom(
          this.http.get<Club[]>(`${this.apiBase}/clubs`)
        );
        this.clubs.set(fresh ?? created);
        this.toast.success("Reset complete");
      } catch {
        this.error.set("Failed to reset");
        this.toast.error("Failed to reset");
        this.clubs.set(prev);
      }
    })();
  }

  // Utility to update a club immutably with validation result
  private updateClubOptimistic<T extends { ok: boolean; message?: string }>(
    clubId: string,
    mutator: (c: Club) => T
  ): T {
    const current = this.clubs();
    const idx = current.findIndex((c) => c.id === clubId);
    if (idx === -1) return { ok: false, message: "Club not found" } as T;
    const draft: Club = {
      ...current[idx],
      members: [...current[idx].members],
      events: [...current[idx].events],
    };
    const result = mutator(draft);
    if (result.ok) {
      const prevSnapshot = [...current];
      const next = [...current];
      next[idx] = draft;
      this.clubs.set(next);
      // Persist via PUT
      firstValueFrom(
        this.http.put<Club>(
          `${this.apiBase}/clubs/${clubId}`,
          toPlainClub(draft)
        )
      ).catch(() => {
        this.error.set("Failed to save changes");
        this.toast.error("Failed to save changes");
        this.clubs.set(prevSnapshot);
      });
    }
    return result;
  }
}
```

</details>

<details>
<summary>src/app/shared/services/users.service.ts</summary>

```ts
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { User } from "../models/user.model";
import { API_BASE } from "../tokens/api-base.token";

@Injectable({ providedIn: "root" })
export class UsersService {
  private http = inject(HttpClient);
  private apiBase = (inject(API_BASE, { optional: true }) ?? "/api").replace(
    /\/+$/,
    ""
  );
  private base = `${this.apiBase}/users`;

  list(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(this.base));
  }
  get(id: string): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${this.base}/${id}`));
  }
  create(input: {
    username: string;
    pin: string;
    isAdmin?: boolean;
  }): Promise<User> {
    return firstValueFrom(this.http.post<User>(this.base, input));
  }
  update(
    id: string,
    changes: Partial<{ username: string; pin: string; isAdmin: boolean }>
  ): Promise<User> {
    return firstValueFrom(this.http.patch<User>(`${this.base}/${id}`, changes));
  }
  remove(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/${id}`));
  }
}
```

</details>

<details>
<summary>src/app/shared/services/toast.service.ts</summary>

```ts
import { Injectable, signal } from "@angular/core";

export type ToastType = "success" | "error" | "info" | "danger";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  timeoutMs: number;
}

@Injectable({ providedIn: "root" })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(type: ToastType, message: string, timeoutMs = 3500) {
    const id = crypto.randomUUID();
    const toast: Toast = { id, type, message, timeoutMs };
    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(id), timeoutMs);
    return id;
  }
  success(message: string, timeoutMs?: number) {
    return this.show("success", message, timeoutMs);
  }
  error(message: string, timeoutMs?: number) {
    return this.show("error", message, timeoutMs ?? 4500);
  }
  info(message: string, timeoutMs?: number) {
    return this.show("info", message, timeoutMs);
  }
  danger(message: string, timeoutMs?: number) {
    return this.show("danger", message, timeoutMs);
  }
  dismiss(id: string) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
  clear() {
    this.toasts.set([]);
  }
}
```

</details>

<details>
<summary>src/app/shared/http/auth.interceptor.ts</summary>

```ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const withAuth = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(withAuth);
};
```

</details>

<details>
<summary>src/app/shared/http/http-error.interceptor.ts</summary>

```ts
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ClubService } from "../services/club.service";
import { AuthService } from "../services/auth.service";

// Maps HTTP errors to friendly messages and surfaces them via ClubService.error
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const svc = inject(ClubService);
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((err: unknown) => {
      let msg = "Something went wrong";
      if (err instanceof HttpErrorResponse) {
        if (err.status === 0) msg = "Network error — check your connection";
        else if (err.status === 401) {
          // If unauthorized (and not the login call), force logout and redirect
          if (!req.url.includes("/auth/login")) {
            auth.logout();
          }
          msg = "Please sign in to continue";
        } else if (err.status >= 500) msg = "Server error — please try again";
        else if (err.status === 404) msg = "Not found";
        else if (err.status === 400) msg = "Invalid request";
        else msg = err.message || msg;
      }
      svc.error.set(msg);
      return throwError(() => err);
    })
  );
};
```

</details>

<details>
<summary>src/app/shared/tokens/api-base.token.ts</summary>

```ts
import { InjectionToken } from "@angular/core";
export const API_BASE = new InjectionToken<string>("API_BASE");
```

</details>
