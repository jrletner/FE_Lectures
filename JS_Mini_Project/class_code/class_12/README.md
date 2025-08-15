# Campus Club Manager — Class 12 (Completed)
**Lesson:** Async & Fetch — Load seed from a “server” (local JSON) and simulate server saves with loading states.

## What Changed from Class 11
- New **`services/api.js`** with two async functions:
  - `loadClubsFromServer()` → fetches `./data/seed.json` (served locally) with an artificial delay.
  - `saveClubsToServer(plainArray)` → simulates a POST with delay and a small chance of failure.
- Added **global status** messages with simple loading/success/error styles.
- New toolbar buttons: **Reload from Server** and **Save to Server**.
- **Bootstrap flow:** On first run (no saved state), the app fetches `seed.json` and persists the result to localStorage.

## How to Run
Serve over HTTP (ES modules + fetch need it):
- VS Code Live Server, or
- `python3 -m http.server`, or
- `npx http-server .`

Open `index.html`, then try:
1) Click **Reload from Server** → data loads from `data/seed.json`.  
2) Make some changes. Click **Save to Server** → simulated save.  
3) Refresh → data is still there (localStorage).
