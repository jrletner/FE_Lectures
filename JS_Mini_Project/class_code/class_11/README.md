# Campus Club Manager — Class 11 (Completed)
**Lesson:** Client‑side Routing (Hash) — List ↔ Detail Views  
**Goal:** Introduce a lightweight router so each club has its own URL (`#/club/:id`) and a home list route (`#/`).

## What Changed from Class 10
- New **hash router** (`src/router.js`) with helpers:
  - `parseHash()` → `{ view: 'home' }` or `{ view: 'club', id }`
  - `goHome()`, `goClub(id)`
- New **detail renderer** (`src/ui/detail.js`) that shows a single club’s members and events with the same add/remove actions.
- Updated **list renderer** to link each club name to `#/club/:id` and include a “Quick Add Event” form.
- **Breadcrumb**/crumbs at the top and **home‑only** sections (form + toolbar hidden on detail route).
- All previous features still work: search/filter/sort, add/remove members/events, localStorage, import/export.

## How to Run
Serve over HTTP (ES modules + CDNs): VS Code Live Server, `python3 -m http.server`, or `npx http-server .`  
Open `index.html`. Click a club name to navigate to its detail page, and use the “All Clubs” crumb to return.
