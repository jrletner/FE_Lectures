# Angular refactor plan — Overview

This page starts with a short conversation between Garret and Codi about why we’re refactoring the front end to Angular, followed by a plain‑English project overview and a phased goals map aligned to our updated walkthroughs and reference build.

## Garret × Codi — the plan

- Garret: Our JS mini‑project works, but we’re hitting limits on structure and testability. Let’s move to Angular so features scale and we can plug in an API.
- Codi: Agreed. We’ll use Angular 19 with standalone components, signals for state, and `@for/@if` in templates to keep things clean.
- Garret: What’s the first milestone?
- Codi: A minimal app shell with routes and a service that holds clubs in signals. Seed comes from a lightweight dev API (`server.js` + `db.json`) so it matches what we have now.
- Garret: Then we slice features: filters, capacity math, members, and events.
- Codi: Right. After core features, we’ll add auth/guards, switch HttpClient over the `/api` proxy with global interceptors, and build optimistic CRUD and utility pages (Tools, Admin Users). Delete happens on the Edit page only and is async.
- Garret: Until the NodeJS API is live, we’ll run a lightweight `server.js` (json‑server) with `db.json` behind that same `/api` path via the proxy; when Node is ready, we flip the target with no client changes.
- Codi: Perfect—that keeps the Angular build functionally identical to our JS Application we built—no surprises.

## Project overview (plain English)

We’re building the Campus Club Manager in Angular. Users can:

- Browse clubs, open details, and see capacity info
- Manage members and events with simple, safe validation
- Sign in to access routes; admins can create/edit/delete clubs and view admin users
- Export/Import JSON and Reset the seed via Tools

We use a dev API (`server.js` + `db.json`) behind an Angular proxy at `/api`. When the Node backend is ready, we just flip the proxy target—no client changes. The app stays simple: clear routes, small components, and one signals‑backed service at the core. Providers use `withFetch()` and global interceptors; the API base is `/api` with a dev proxy rewrite.

## Quick references

- Route/Guard/Component matrix: see `../route-guard-component-matrix.md`
- Class outcomes index (14–23): see `../class-outcomes-index.md`

## Parity guarantee

Classes 14–23 cumulatively produce the Class 24 reference build exactly (byte‑for‑byte for equivalent files). There are zero exceptions: routes, guards, service method shapes, and UI placement (e.g., Delete lives on the Edit page only) all match the final.

## Implementation phases (at a glance)

- Class 14 — App shell baseline: standalone AppComponent with RouterOutlet; `app.routes.ts` created (empty); `app.config.ts` provides Router + HttpClient(withFetch()).
- Class 15 — Models + API token: add shared models (user, member, event-item, club + helpers) and `API_BASE` token.
- Class 16 — Interceptors + services: auth/http-error interceptors; services scaffold (toast, auth, users, club) with signals.
- Class 17 — Dev API + proxy + providers: add `server.js`, `db.json`, `proxy.conf.json`, npm scripts; wire interceptors, `API_BASE = '/api'`, and `ErrorHandler` in `app.config.ts`.
- Class 18 — Login + guards: `LoginComponent`, finalized `AuthService` (signals + localStorage) and `ToastService`; routes include `/login` and wildcard → `/login`; define `authOnly` and `adminOnly` guards.
- Class 19 — List + Quick Event + Members: `ClubListComponent` with search/sort/only‑open and Quick Event; set home route `/` (authOnly); add `MembersOverviewComponent` at `/members` (authOnly) with `?clubId` deep‑link.
- Class 20 — New Club (admin): route `/clubs/new` (adminOnly); `ClubNewComponent`; `ClubService.createClub({ name, capacity }) → { ok, message? }` (optimistic; id reconciliation).
- Class 21 — Club Detail (read‑only): route `/clubs/:id` (authOnly); no resolver; derive from service via route param.
- Class 22 — Club Edit (admin): route `/clubs/:id/edit` (adminOnly); no resolver; `updateClub(id, { name, capacity }) → { ok, message? }`.
- Class 23 — Delete + Tools + Admin Users: `deleteClub(id): Promise<boolean>`; Delete button only on Edit page; add Tools at `/tools` (adminOnly) and Admin Users at `/admin/users` (adminOnly); include `.btn-outline.-danger` style.
- Class 24 — Final reference snapshot used for demos/verification.

That’s the map: small, safe steps that take us from a static list to a polished, API‑ready Angular app—functionally identical to our reference build.
