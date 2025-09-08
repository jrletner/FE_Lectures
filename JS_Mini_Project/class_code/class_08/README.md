# Campus Club Manager — Class 8 (Completed)

## Conversation

Break room, 9:57 AM.

- Garrett: This one giant file is scary. Can we put things in folders?
- Codi: Yep. We'll switch to ES modules, group code by concern (models, store, ui, utils), and import just what we need. Behavior stays the same—this is an organization refactor.

## Codi’s requirements

- Keep behavior from Class 7 exactly the same (no feature regressions).
- Use `<script type="module" src="src/app.js">` so imports work in the browser.
- Split code under `src/` by concern:
  - `models/` for Club/Member/EventItem classes
  - `store/` for state and derived lists (filters)
  - `ui/` for pure DOM rendering
  - `utils/` for helpers like debounce and pipe
- Avoid circular dependencies; rendering must not import store.
- Use Live Server to run (not `file://`).
- Keep imports relative with `.js` extensions.

## Codi’s user stories

- As a developer, I can open `index.html` via Live Server and the app runs without console errors.
- As a developer, the entry is `src/app.js` with clean imports between modules.
- As a developer, features still work: add/remove members, add club, search (debounced), filter “Has seats only”, and sort.
- As a developer, I can quickly find code by responsibility in `src/models`, `src/store`, `src/ui`, and `src/utils`.

## What good looks like

- File tree matches the walkthrough’s current class tree.
- `index.html` title/subtitle updated for Class 8; script tag uses `type="module"`.
- All imports resolve (include `.js`), no circular import warnings, no runtime errors.
- Search debounces, filter toggles, sort options work; UI re-renders correctly.
- Rendering is stateless/pure in `ui/render.js`; store holds state and derived selectors.
- Code remains readable and small per file.

## Afternoon debrief

Today we took the single-file Class 7 app and split it into ES modules. We kept behavior intact while improving structure:

- Entry (`src/app.js`) wires events and calls `paint()`.
- `store/data.js` owns clubs and mutations; `store/filters.js` exposes UI state and `getVisibleClubs`.
- `ui/render.js` handles DOM creation only; it doesn’t know about global state.
- Utilities (`debounce`, `pipe`) are reusable and tested by usage.

Common pitfalls we avoided: forgetting `type="module"`, missing `.js` extensions in import paths, and mixing store logic into the renderer. Next up, we’ll keep this structure as we add features so complexity stays manageable.
