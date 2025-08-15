# Campus Club Manager — Class 7 (Completed)
**Lesson:** Advanced Functions (UX Helpers)  
**Goal:** Debounce search input to avoid excessive renders and factor list transforms with a tiny `pipe` utility.

## What Changed from Class 6
- Added a **`debounce`** helper and wired it to the search input (300ms wait).
- Extracted search/filter/sort into **small transform functions** and composed them with a **`pipe`** utility.
- Kept existing Add Member UI and Create Club form.

## Try in Console
```js
// Paste to see functional composition work:
ui.searchText = "club";
renderClubs();

// Quickly type in the search box; renders happen after you pause typing.
```
