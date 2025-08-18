# Campus Club Manager — Class 2 (Completed)

Break room, 9:12 AM.

- Garrett: Morning, Codi! I just want to see a couple of pretend clubs on the page. What does this even look like?
- Codi: Nice and doable. In bootcamp we used arrays and little math helpers to keep numbers honest. I’ll seed a tiny `clubs` list, compute seats left and percent full, and render cards from that. I’ll clear the container each time so nothing duplicates.
- Garrett: Love it—thanks!

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
