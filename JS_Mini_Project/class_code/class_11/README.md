# Campus Club Manager — Class 11 (Completed)

Break room, 10:20 AM.

- Codi: What do you need next?
- Garrett: Each club should have its own page, but keep the list too.
- Codi: I’ll add a tiny hash router. Home shows the list; `#/club/:id` shows a detail view. List‑only UI hides on detail. Unknown IDs bounce back home.

## Codi’s user stories

- As a visitor, I can open a club’s detail page at `#/club/:id` and share that URL.
- As a visitor, I can return home to see the full list.
- As a developer, list‑only UI is hidden on detail so each view stays focused.
- As a developer, routing reuses the same state and mutation handlers; only the renderer switches.
