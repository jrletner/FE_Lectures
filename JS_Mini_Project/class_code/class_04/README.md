# Campus Club Manager — Class 4 (Completed)

## Conversation

- Garrett: Yesterday looked solid. What’s today’s focus?
- Codi: I want to tidy the inside so it’s easier to grow. In bootcamp I learned to keep the information and the “smarts” together so the page stays simple. I’ll make each club tell us simple facts like how many seats are left. No blockers.
- Garrett: Love it—make it easy to add features later.

## Codi’s requirements (from our chat)

- Add small building blocks: Club, Member, and Event.
- Let each Club provide simple facts itself: current count, seats left, and percent full.
- Keep old sample data working by adding a quick converter: `Club.fromPlain`.
- Update the page to read those facts from each Club (name, seats filled, seats left, percent full).
- When a new club is added, create a real Club and refresh the list.
- Remove old math helpers we no longer need because the Club provides those facts.

## Codi’s user stories

- As a visitor, I still see the same page and numbers working as before.
- As a developer, I can work with Club, Member, and Event so data and behavior live together.
- As a developer, I can get a club’s current count, seats left, and percent full directly from the Club.
- As a developer, I can convert older plain objects into Clubs without breaking the page.

## What good looks like

- The UI looks the same as Class 3 (no regressions, no console errors).
- The clubs list holds Club items (not loose objects).
- Rendering reads simple facts from each Club and shows name + status cleanly.
- Old utility functions for seats/percent are gone and nothing references them.

## Afternoon debrief (bootcamp tie‑in)

- Codi: This is a bootcamp move—keep the page calm by putting the brains next to the data. Now each club tells us what we need (like seats left), so adding features later is less scary.
- Garrett: My ask was “make it easier to add things later.” With clear building blocks and simple reads, we kept the look the same but set up the app to grow without chaos.
