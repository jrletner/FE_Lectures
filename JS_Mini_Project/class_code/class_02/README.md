# Campus Club Manager — Class 2 (Completed)

## Conversation

- Garrett: What’s the plan for today?
- Codi: Morning standup — Done: a clean page with our title and wiring. Today: add two pretend clubs in JavaScript, do a little math, and show them on the page. Blockers: none. Bootcamp lesson I’ll use: keep the info in one place and let the page read from it.
- Garrett: Great, let’s see the list come to life.

## Codi’s requirements (from our chat)

- Add a `clubs` array with two example clubs shaped like `{ name, current, capacity }`.
- Write helpers: `seatsLeft(club)` and `percentFull(club)` (rounded; safe for capacity 0).
- Implement `renderClubs()` that clears the container and renders one card per club.
- Keep styles simple and ensure there are no console errors.

## Codi’s user stories

- As a visitor, I see two example clubs with numbers I can understand.
- As a visitor, I see seats left and a rounded percent full for each club.
- As a developer, the page renders from the `clubs` array so it’s easy to change.
- As a developer, re-rendering clears old content so nothing duplicates.

## What good looks like

- Two clubs render as cards with current/capacity, seats left, and percent full.
- Percent is a whole number; capacity 0 yields 0% without errors.
- No console errors during initial render.

## Afternoon debrief (bootcamp tie‑in)

- Codi: We kept the info tidy and let the page read from it—exactly how bootcamp taught us to avoid chaos.
- Garrett: This solves it—now the app looks alive with real numbers on screen.
