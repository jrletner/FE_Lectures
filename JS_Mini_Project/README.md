# Campus Club Manager — JS Mini Project (Class-by-Class)

This mini project evolves across folders `class_code/class_01` → `class_code/class_12`. Each folder contains the finished code for that class and a delta-style walkthrough (`Current_Lesson_Walkthrough.md`) describing what changed from the previous class.

## How to run locally

- Classes 1–11: You can open `index.html` directly or serve via a local server.
- Class 12 uses `fetch('./data/seed.json')` and must be served over HTTP.

Suggested quick server (macOS, zsh), run this in the specific class folder:

```bash
# Example for Class 12
cd JS_Mini_Project/class_code/class_12
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Alternatively (Node installed):

```bash
npx serve -p 8000 JS_Mini_Project/class_code/class_12
```

## Class-by-class overview

- Class 1: Kickoff & setup — HTML/CSS/JS scaffold, simple page text.
- Class 2: Variables & arrays — compute counts and render basic info.
- Class 3: Create Club form — validation, duplicate name guard, renderClubs, addClub.
- Class 4: OOP models — `Club`, `Member`, `EventItem` with class methods.
- Class 5: DOM patterns — event delegation; dynamic club cards; Add Member UI.
- Class 6: Search/Filter/Sort — toolbar with derived list pipeline.
- Class 7: UX helpers — `debounce`, small `pipe` utility; cleaner filtering.
- Class 8: ES Modules — moved to `src/` with `models/`, `store/`, `ui/`, `utils/`, `router`.
- Class 9: Libraries & Events — `dayjs` (relative-time) and `nanoid`; events with friendly dates.
- Class 10: Persistence — `localStorage` save/load; Import/Export/Reset; models serialize with `toPlain`/`fromPlain` and stable IDs.
- Class 11: Routing — hash-based router; home list vs club detail; split `ui/render.js` and `ui/detail.js`.
- Class 12: Async/Fetch — load seed from `data/seed.json` on first boot, simulated save, and global status messages.

## Current structure (Class 12)

```text
class_code/class_12/
  index.html
  styles.css
  data/seed.json
  src/
    app.js
    router.js
    services/
      api.js
    store/
      data.js
      filters.js
      persist.js
    models/
      Club.js
      Member.js
      EventItem.js
    ui/
      render.js
      detail.js
    utils/
      debounce.js
      externals.js   # dayjs, nanoid
      pipe.js
```

## Data shapes (Class 12)

```js
// Club (derived props computed in class)
{
  id: "clb_...",
  name: "Coding Club",
  capacity: 10,
  members: Member[],
  events: EventItem[],
  // derived in code: current, seatsLeft, percentFull
}

// Member
{ id: "mem_...", name: "Ava" }

// EventItem
{
  id: "evt_...",
  title: "Hack Night",
  dateISO: "2025-09-10",
  description?: "...",
  capacity?: 30,
  // derived in code: friendlyWhen, isPast
}
```

## Documentation per class

Every class folder includes `Current_Lesson_Walkthrough.md` with:

- A delta section listing exactly what changed from the prior class.
- Small rationale for each change and where to find it (file/path).
- An appendix with the full code for that class for quick reference.

## Notes & troubleshooting

- If you see errors fetching `./data/seed.json`, ensure you’re serving over HTTP (not `file://`). Use a local server (see above).
- Import/Export/Reset work locally via `localStorage` (Class 10+).
- The global status banner (Class 12) shows loading/success/error messages for async actions.
