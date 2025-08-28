# Campus Club Manager — Class 6 (Completed)

## Conversation

- Garrett: It’s getting crowded. I need search, a way to hide full clubs, and sorting.
- Codi: Morning standup — Done: cards show members and I can add/remove on each card. Today: I’ll add a small toolbar so you can type to search by name, tick a box to hide full clubs, and choose how to sort. I’ll remember those choices and use them to show a narrowed, ordered list. If nothing matches, I’ll show a friendly message. Blockers: none. Bootcamp lesson I’ll use: keep your data steady, then make what you see from it.
- Garrett: Perfect. Let’s ship it.

## Codi’s requirements (from our chat)

- Add a toolbar with:
  - Search box: filters by club name (case-insensitive).
  - “Has seats only” checkbox: hides clubs with zero seats left.
  - Sort menu: Name (A–Z), Name (Z–A), Seats left (High→Low), Capacity (High→Low).
- Keep `clubs` as the single source; derive a visible list from it using the toolbar choices.
- Update the page when inputs change: update choices, recompute the visible list, then render.
- Show “No clubs match your filters.” when nothing qualifies.
- Keep add/remove member behavior from Class 5 working the same as before.

## Codi’s user stories

- As a visitor, I can type to search by club name and see results narrow right away.
- As a visitor, I can hide full clubs with a checkbox.
- As a visitor, I can change the sort and the list reorders.
- As a visitor, if nothing matches, I see a clear message.
- As a developer, the screen is drawn from one place: the data plus my toolbar choices.

## What good looks like

- Toolbar appears above the cards with search, “Has seats only,” and a Sort menu.
- Typing “art” shows Art Club (case-insensitive).
- Checking “Has seats only” hides full clubs.
- Sorting by “Seats left (High→Low)” puts clubs with more seats at the top.
- “No clubs match your filters.” shows when nothing qualifies.
- Add/remove members still works as before.

## Afternoon debrief (bootcamp tie‑in)

- Codi: Bootcamp taught me to keep the data calm and make the view from it. We saved your choices in a tiny place, used them to narrow and order the list, and the page stayed easy to think about.
- Garrett: That’s exactly what I asked for—search, a way to hide full clubs, and sorting—without breaking the member features we had yesterday.
