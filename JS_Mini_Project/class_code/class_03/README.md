# Campus Club Manager — Class 3 (Completed)

## Conversation

- Garrett: Where do we take it today?
- Codi: Morning standup — Done: the list renders from one data source. Today: add clubs with a small form and keep the page calm by handling the submit in one place. Blockers: none. Bootcamp lesson I’ll use: catch actions in one place and draw the screen from the info we keep.
- Garrett: Ship it.

## Codi’s requirements (from our chat)

- Add a small form to create a club (name and capacity inputs + submit button).
- On submit, prevent the default, validate inputs, and either show a friendly message or add the club.
- Validation: name is not empty and not a duplicate (case-insensitive); capacity is a number and at least 1.
- When valid, push `{ name, current: 0, capacity }` into the list and re-render.
- Keep one submit listener for the form (no multiple handlers); no console errors.

## Codi’s user stories

- As a visitor, I can add a new club and see it appear in the list.
- As a visitor, if I enter bad input, I see a clear message and nothing breaks.
- As a developer, the form submit is handled in one place.
- As a developer, the list always reflects what’s in the `clubs` array.

## What good looks like

- Adding works: new clubs show up immediately.
- Duplicate names are blocked with a friendly message.
- Invalid capacity (missing/zero/negative) shows a friendly message; no crashes.
- No console errors.

## Afternoon debrief (bootcamp tie‑in)

- Codi: From bootcamp — keep your page calm by catching actions in one spot and redrawing from the info you have. That makes the flow easy to follow.
- Garrett: Exactly what we needed — a simple form that just works and keeps the list honest.
