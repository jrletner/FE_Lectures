# Campus Club Manager — Class 9 (Completed)
**Lesson:** Dates & IDs with Libraries + Events  
**Goal:** Add events to clubs with **unique IDs** (nanoid) and **human-friendly dates** (Day.js).

## What Changed from Class 8
- Introduced **external libraries** via ESM CDN:
  - **dayjs** (`friendlyWhen`, `isPast`, date formatting and "in X days" text)
  - **nanoid** (globally unique IDs for Club, Member, Event)
- Added per-club **Events** section with a simple **Add Event** form.
- Render each event with **formatted date** and **relative time** (e.g., `Sep 10, 2025 (in 12 days)`).
- Kept existing search/filter/sort and Add Member UI.

## How to Run
Serve over **HTTP** (modules + CDNs):
- VS Code Live Server, or
- `python3 -m http.server`, or
- `npx http-server .`

Then open `index.html`. Make sure you have an internet connection so CDNs can load modules.
