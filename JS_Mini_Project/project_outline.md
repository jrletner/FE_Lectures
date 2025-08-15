# Campus Club Manager — Full Project Outline (Markdown)

## Project Phases & Milestones

- **Phase 0 – Setup (Class 1):** Repo, basic HTML/CSS, starter JS.
- **Phase 1 – Foundations (Classes 2–3):** Variables/strings/numbers → form, functions, validation.
- **Phase 2 – Modeling & DOM (Classes 4–5):** OOP classes, render from state, add members.
- **Phase 3 – Lists & UX (Classes 6–7):** Loops, search/filter/sort, debounce utilities.
- **Phase 4 – Structure & Dates (Classes 8–9):** ES modules, dev server, Day.js/nanoid, events.
- **Phase 5 – Rules & Persistence (Classes 10–11):** RSVP, roles, async/await, `json-server`.
- **Phase 6 – Polish & Demo (Class 12):** QA, stretch features, deploy, presentations.

**Milestones**

- **M1 (end Class 5):** Interactive front-end (add club/member; renders from JS state).
- **M2 (end Class 9):** Clean module structure; events with dates & IDs.
- **M3 (end Class 11):** Full CRUD persisted to mock backend; resilient async UX.
- **Final (Class 12):** Polished app + demo.

---

## Class 1 — Kickoff & Setup

**Date:** Mon, Aug 11, 2025  
**Lesson:** Kickoff & Setup

- **Teach:** How the web runs JS, DevTools, VS Code, Git basics, HTML/CSS refresher
- **Build:** `index.html`, `styles.css`, `app.js` scaffold; stub `#club-info`
- **Deliverable:** Page loads “Campus Club Manager”; repo created

## Class 2 — Variables, Numbers, Strings

**Date:** Thu, Aug 14, 2025  
**Lesson:** Variables, Numbers, Strings

- **Teach:** `let/const`, template literals, basic math
- **Build:** Seed clubs, compute seats left, render text to page
- **Deliverable:** Static list with counts from variables/arrays

## Class 3 — Booleans, Ifs, Functions (Create Club)

**Date:** Mon, Aug 18, 2025  
**Lesson:** Booleans, If Statements, Functions

- **Teach:** Truthy/falsy, guards, pure functions
- **Build:** **Create Club** form, validation, duplicate-name check; `renderClubs()`, `addClub()`
- **Deliverable:** Users can add valid clubs; errors display

## Class 4 — OOP: Classes & Composition

**Date:** Thu, Aug 21, 2025  
**Lesson:** OOP: Classes & Composition

- **Teach:** `class`, constructor, methods; composition over inheritance
- **Build:** `Club`, `Member`, `Event` classes; e.g., `Club.addMember()`, `Event.toggleRsvp()`
- **Deliverable:** State changes go through class APIs

## Class 5 — DOM Rendering Patterns

**Date:** Mon, Aug 25, 2025  
**Lesson:** DOM Rendering Patterns

- **Teach:** Query/create, event delegation, render-from-state
- **Build:** Dynamic club cards; **Add Member** UI; empty-state
- **Deliverable:** Members can be added; UI updates without reload

## Class 6 — Arrays & Loops (Search/Filter/Sort)

**Date:** Thu, Aug 28, 2025  
**Lesson:** Arrays & Loops (Search/Filter/Sort)

- **Teach:** `map/filter/reduce`, `for…of`, comparator functions
- **Build:** Search box, filter by category, sort by name/next event
- **Deliverable:** Live search/filter/sort

## (No Class — Labor Day)

**Date:** Mon, Sep 1, 2025  
**Note:** U.S. Holiday — skip / buffer / review

## Class 7 — Advanced Functions (UX Helpers)

**Date:** Thu, Sep 4, 2025  
**Lesson:** Advanced Functions (UX Helpers)

- **Teach:** Higher-order functions, closures; debounce vs throttle
- **Build:** Debounce search; small `pipe()`/`compose()` utility; tiny controller helpers
- **Deliverable:** Snappy search; tidy utilities

## Class 8 — ES Modules & Dev Server

**Date:** Mon, Sep 8, 2025  
**Lesson:** ES Modules & Dev Server

- **Teach:** `export`/`import`, file boundaries, index “barrels”, (optional) Vite
- **Build:** Split into `models/`, `views/`, `controllers/`, `store/`, `ui/`
- **Deliverable:** Same behavior, modular code; dev server running

## Class 9 — External Libraries (Dates & IDs) + Events

**Date:** Thu, Sep 11, 2025  
**Lesson:** Dates & IDs with Libraries + Events

- **Teach:** Picking libs, Day.js basics, nanoid
- **Build:** Event form (title/date/desc); “days until”; unique IDs
- **Deliverable:** Clubs have events; upcoming vs past clear

## Class 10 — OOP Review: Rules, Roles & RSVP

**Date:** Mon, Sep 15, 2025  
**Lesson:** OOP Review: Rules, Roles & RSVP

- **Teach:** Invariants, capacity checks, method chaining
- **Build:** RSVP toggles; capacity enforcement; simple roles (`admin`/`member`)
- **Deliverable:** Business rules enforced; UI reflects permissions

## Class 11 — Async/Await & Persistence (json-server)

**Date:** Thu, Sep 18, 2025  
**Lesson:** Async/Await & Persistence

- **Teach:** `fetch`, promises, async/await, optimistic UI + rollback
- **Build:** `db.json` + `json-server`; `api/*.js` wrappers; replace in-memory CRUD; loading & retry states
- **Deliverable:** Full CRUD persisted; resilient UX

## Class 12 — Polish, Deploy, Demo Day

**Date:** Mon, Sep 22, 2025  
**Lesson:** Polish, Deploy, Demo Day

- **Teach:** QA checklist, small perf wins, accessibility basics, deployment (GH Pages)
- **Build:** Delete/edit club; percentage full; empty-state visuals; pagination; remember filters
- **Deliverable:** Deployed app + 3–5 min student demos

---

## Repo Structure (by Class 8+)

```text
/public/index.html
/src/
  app.js
  store/index.js
  models/Club.js
  models/Member.js
  models/Event.js
  controllers/clubsController.js
  views/ClubList.js
  views/MemberForm.js
  views/EventForm.js
  ui/Toast.js
  lib/pipe.js
/api/
  clubs.js
  members.js
  events.js
db.json
```

## Data Shapes

```js
// Club
{ id: "c_123", name: "Coding Club", category: "Tech", capacity: 25, members: ["m_1","m_2"], events: ["e_1"] }

// Member
{ id: "m_1", name: "Ava", role: "member" } // or "admin"

// Event
{ id: "e_1", clubId: "c_123", title: "Hack Night", date: "2025-09-10", rsvps: ["m_1","m_2"], capacity: 30 }
```

## Assessment & Checkpoints

- **Code Check-ins:** Tag each class (`c01-setup`, `c03-create-club`, `c09-events`, `c11-persisted-crud`).
- **Rubric (10 pts each class):** 4 pts feature works, 3 pts organization, 2 pts readability, 1 pt commit quality.
- **M1/M2/M3 reviews:** 5–10 min demos at end of Classes 5, 9, 11.

## Stretch Ideas

- Dark mode toggle; keyboard focus states.
- CSV export of members/events.
- Hash-based routes (`#/clubs/:id`).
- Simple unit tests for model methods (Jest).
