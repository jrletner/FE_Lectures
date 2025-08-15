# Campus Club Manager — Class 6 (Completed)
**Lesson:** Arrays & Loops — Search, Filter, Sort  
**Goal:** Add a toolbar that lets students search by name, filter to open clubs, and sort the list.

## What Changed from Class 5
- Added a **toolbar** with:
  - Search input (filters by club name, case-insensitive)
  - Checkbox “Has seats only” (filters to clubs with `seatsLeft > 0`)
  - Sort dropdown (Name A–Z / Z–A, Seats Left High→Low, Capacity High→Low)
- Introduced a small **UI state** object and a `getVisibleClubs()` function that:
  - Copies the array, applies `.filter()` conditions, and `.sort()` with a comparator.
- `renderClubs()` now renders **only** the visible (filtered/sorted) list.

## Try in Console
```js
// Add a new club and watch it appear according to current filters:
clubs.push(new Club("Zoology", 3)); renderClubs();

// See sorting by seats left:
document.getElementById("sort-by").value = "seats-desc";
document.getElementById("sort-by").dispatchEvent(new Event("change"));
```
