# Campus Club Manager — Class 4 (Completed)
**Lesson:** OOP — Classes & Composition  
**Goal:** Refactor state to use **classes** and interact via methods/getters instead of plain objects.

## What Changed from Class 3
- Introduced **models**: `Club`, `Member`, `EventItem`
- Replaced plain objects with **`new Club(...)`** instances
- Moved math helpers into **getters**: `club.current`, `club.seatsLeft`, `club.percentFull`
- `addClub(name, capacity)` now creates a `Club` instance
- Rendering uses class **properties/getters**

## Files
- `index.html` — same UI as Class 3 (form + list)
- `styles.css` — same simple styling
- `app.js` — new class-based models; refactored state & rendering

## Try in Console
Open DevTools and experiment:
```js
// Add a member to the first club:
clubs[0].addMember("Ava");
renderClubs();

// See derived stats:
clubs[0].current;    // member count
clubs[0].seatsLeft;  // seats remaining
clubs[0].percentFull // % full
```
