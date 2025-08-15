# Campus Club Manager — Class 10 (Completed)
**Lesson:** Persistence with `localStorage` + Import/Export  
**Goal:** Save the app state to the browser so data survives refreshes, and add Import/Export JSON.

## Highlights vs Class 9
- Added **`persist.js`** with:
  - `saveState(clubs)`, `loadState()`, `clearState()`
- Extended models with **`toPlain()`** / `fromPlain(...)` so we can serialize & revive class instances.
- New **toolbar buttons**:
  - **Export JSON** → downloads a `campus-club-manager-data.json` file
  - **Import JSON** → upload a saved file to restore state
  - **Reset Data** → clears saved state and reloads default seed
- Auto-saves after every mutation (add/remove club/member/event).

## How to Run
Serve over HTTP (ES modules + CDNs):
- VS Code Live Server, or
- `python3 -m http.server`, or
- `npx http-server .`

Open `index.html`, change data, refresh — it persists!
