# Campus Club Manager — Class 7 (Completed)

Break room, 9:50 AM.

## Conversation

- Garrett: The search feels jumpy. It refreshes on every letter.
- Codi: Let’s make it chill. I’ll add a tiny delay so it updates after you pause, and I’ll split our list changes into simple steps I can chain together.
- Garrett: Smooth and simple. Go for it.

## Codi’s requirements (from our chat)

- Add a small debounce so search updates after a short pause (~300ms).
- Keep “Has seats only” and “Sort by” updates instant.
- Break list logic into three tiny functions: search, only‑open, and sort.
- Chain those functions together with a simple pipe.
- Keep results identical to Class 6 for the same settings.

## Codi’s user stories

- As a visitor, the list doesn’t jitter while I type in the search box.
- As a visitor, the “Has seats only” checkbox and “Sort by” menu still work right away.
- As a developer, I can read the list logic as small, clear steps.
- As a developer, I can pass the clubs array into one composed function to get the visible list.

## What good looks like

- Typing filters the list after a short pause; no frame‑by‑frame flicker.
- Checking “Has seats only” or changing “Sort by” updates immediately.
- Search, filter, and sort produce the same results as Class 6.
- Code shows `debounce`, `pipe`, and three helpers: `applySearch`, `applyOnlyOpen`, `applySort`.

## Afternoon debrief (bootcamp tie‑in)

- Codi: Today I used a tiny delay to calm rapid input, and I broke one chunky function into small steps I could chain. It’s easier to read and tweak later.
- Garrett: The page feels smoother, and the logic is easier to follow. Same features, less chaos while typing.
