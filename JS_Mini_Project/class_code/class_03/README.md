# Campus Club Manager — Class 3 (Completed)

Morning Standup, 9:20 AM.

- Garrett: Where are we today?
- Codi: Done: the example clubs show up with clear numbers. Today: I’ll add a simple form so people can add a club, and I’ll keep it friendly—no weird inputs, clear messages. Bootcamp’s been big on good habits like this. Blockers: none.
- Garrett: Let’s ship it so people can try it.

## Codi’s requirements (from our chat)

- Add a Create Club form with name and capacity inputs and a submit button.
- On submit: prevent default, trim the name, parse capacity, and validate.
- Block: empty name, capacity < 1 or not a number, and duplicate names (case-insensitive).
- On success: add the club, re-render the list, reset the form and messages.
- When there are zero clubs, show a friendly empty-state message.

## Codi’s user stories

- As a visitor, I can create a new club via a form (name + capacity) without reloading.
- As a visitor, I see clear validation for empty name, bad capacity, or duplicates.
- As a visitor, a valid club appears immediately and the form resets.
- As a developer, an empty state appears when there are zero clubs.

## What good looks like

- Submitting the form with invalid input shows a clear message; page doesn’t reload.
- Duplicate names (case-insensitive) are blocked with a friendly message.
- Valid submissions add a club immediately; the form and messages reset.
- An empty state message appears when there are zero clubs.

## Morning debrief (bootcamp tie‑in)

- Codi: This one felt good—we kept it welcoming and practical like bootcamp: add the form, keep it friendly, guide people when something’s off, and show the new club right away.
- Garrett: I asked “can people add clubs without nonsense?” Now valid clubs appear instantly, bad input shows a friendly fix, and the page never reloads. This nails it.
