# Campus Club Manager — Class 8 (Completed)
**Lesson:** ES Modules & Dev Server (structure only; any static server works)  
**Goal:** Refactor the single-file app into **ES modules** with a small folder structure.

## Highlights vs Class 7
- Split code into folders:
  - `src/models/` — `Club.js`, `Member.js`, `EventItem.js`
  - `src/store/`  — app data and UI filter logic
  - `src/utils/`  — `debounce.js`, `pipe.js`
  - `src/ui/`     — DOM rendering (`renderClubs`)
  - `src/app.js`  — entry point wires everything up
- `index.html` now loads JavaScript with:  
  `<script type="module" src="src/app.js"></script>`

## How to Run
You need to serve files over **http://** for ES module imports to work reliably (file URLs can be blocked).  
Pick one of these:
- **VS Code Live Server** extension (Right-click `index.html` → “Open with Live Server”)
- **Python**: `python3 -m http.server` (then open `http://localhost:8000`)
- **Node**: `npx http-server .`

Open `index.html` in your browser via the local server URL.
