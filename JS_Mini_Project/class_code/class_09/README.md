# Class 9 — Events, Dates, and External Libraries

## Conversation

We’ve got basic clubs and members from last time. Today, let’s let each club plan events with real dates. We’ll keep things simple in the browser, bring in dayjs for friendly dates, and nanoid for reliable IDs. No bundlers, just ES modules over a local server.

## Codi’s requirements

- Add an Events section for every club with a simple list and an inline "Add Event" form.
- Each event has: title, date (YYYY‑MM‑DD), optional description, and capacity.
- Display human‑friendly date labels using dayjs (e.g., "Sep 10, 2025 (in 12 days)").
- Mark past events with a small "Past" badge.
- Use nanoid for all new IDs (members, events, clubs created at runtime).
- Keep CDN imports centralized in `src/utils/externals.js` to make vendor swaps easy.

## Codi’s user stories

- As a student, I can see each club’s upcoming and past events listed on its card.
- As a student, I can add an event by typing a title, choosing a date, setting a capacity, and clicking Add Event.
- As a student, I can remove an event from a club’s list.
- As a student, I can understand when an event happens via friendly labels (and see a Past badge when it’s in the past).
- As a maintainer, I can rely on unique IDs without collisions, even after many additions.
- As a maintainer, I can change external library providers in one place (`externals.js`).

## What good looks like

- The header reads “Events with Dates & IDs (Day.js + nanoid)” and the page title says Class 9.
- Club cards show an Events section. Adding a valid event instantly renders it; removing works.
- Friendly date strings render and Past events show a badge; no console errors.
- All IDs seen in the DOM are nanoid‑style strings (not incremental numbers).
- The project runs from a local server; CDN imports load successfully.

## Afternoon debrief

- Modules and boundaries: UI renders; models own rules (Club.addEvent, EventItem getters).
- External libraries via ESM: dayjs for date math/labels and nanoid for IDs, imported once in `externals.js`.
- Event delegation: One click handler manages member and event actions; simpler wiring.
- Data evolution: `fromPlain` migrates seeds so new features don’t break existing data.

See `Current_Lesson_Walkthrough.md` for step‑by‑step diffs and the full source at end-of-class state.
