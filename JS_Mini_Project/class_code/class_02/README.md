# Campus Club Manager — Class 2 (Completed)

Morning Standup, 9:12 AM.

- Garrett: Status?
- Codi: Done: the first page is up and neat. Today: I’ll add a couple of pretend clubs and show them on the page. Bootcamp taught me to keep numbers honest and keep the page in sync with the info we have, so I’ll do that in a simple way. Blockers: none.
- Garrett: Sounds good—let’s make it feel alive.

## Codi’s requirements (from our chat)

- Add a `clubs` array with two example clubs shaped like `{ name, current, capacity }`.
- Write helpers: `seatsLeft(club)` and `percentFull(club)` (rounded, safe for 0 capacity).
- Implement `renderClubs()` that clears the container and renders one card per club.
- Ensure the container exists in HTML and there are no console errors.

## Codi’s user stories

- As a visitor, I can see two example clubs rendered as cards with current/capacity.
- As a visitor, I see seats left and a rounded percent full on each card.
- As a developer, re-rendering clears the container so cards never duplicate.
- As a developer, edge cases like capacity 0 render safely (percent = 0%).

## What good looks like

- Two sample clubs render as cards with current/capacity, seats left, and percent full.
- Re-rendering does not duplicate cards (container is cleared first).
- Percent is a whole number; capacity 0 yields 0% without errors.
- No console errors during initial render.

## Morning debrief (bootcamp tie‑in)

- Codi: Super happy with this—we kept it simple like bootcamp: keep the info tidy and show it clearly, no drama. Seeing the page update right from our list feels great.
- Garrett: My problem was “show me a couple of pretend clubs.” Now I see real cards with current/capacity, seats left, and percent full, rendered cleanly from that data. Exactly what I was hoping for.
