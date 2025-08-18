# Campus Club Manager — Class 2 (Completed)

**Lesson:** Variables, Numbers, Strings  
**Goal:** Seed club data, do simple math (seats left, percent full), and render to the page.

## Manager → Developer: Story Brief

Class 1 gave us the shell; now we need something real to look at. I want two believable sample clubs rendered on the page and a simple pattern we can keep using: state in memory, and the UI derived from that state. Keep the math helpers tiny and readable—this is about clarity, not micro-optimizations.

Constraints and intent:

- No external libraries; plain JavaScript only.
- Keep data shape consistent: `{ name, current, capacity }`.
- Helpers should be pure and small: `seatsLeft(club)`, `percentFull(club)`.
- Rendering should clear the container and then append one card per club.
- Percentages should be whole numbers (rounded) for readability.

What “done” looks like today:

- I open the page, see two club cards rendered with current/capacity, seats left, and percent full. No duplication on re-render, no console errors. The structure will carry forward into Class 3 when we add a form.

## What Students Should See

- Two starter clubs displayed with seat counts and percent full.

---

## Lesson Summary

## Problem or Enhancement

Learners need to see real data on the page and a first rendering pattern. Currently the app has structure but no behavior. The enhancement is to introduce a tiny in-memory dataset, simple math helpers, and a render function that turns data into HTML.

## Impact on the Application

- Establishes the core pattern: keep data in memory and render the UI from that data.
- Shows how to select DOM elements and build UI with JavaScript.
- Lays the groundwork for future interactivity (forms, validation, filters).

## What We’ll Change (Beginner Friendly)

- app.js:
  - Add a `clubs` array with a couple of example clubs: `{ name, current, capacity }`.
  - Write helpers like `seatsLeft(club)` and `percentFull(club)` to compute stats.
  - Create `renderClubs()` that finds a container (e.g., `#club-info`) and inserts cards for each club.
  - Set the footer year automatically (`document.getElementById('year').textContent = new Date().getFullYear()`).
- index.html:
  - Ensure the container where clubs should render exists and the script is included.
- styles.css:
  - Keep styles simple; no major changes required for this step.

This class connects the dots: data → render → visible UI.

## Risks, Assumptions, Dependencies

- Risks: Rendering directly from data without reusing code can lead to duplication later—acceptable for now.
- Assumptions: We have a container (e.g., `#club-info`) in the HTML.
- Dependencies: None; plain JavaScript only.

## User Stories (Class 2)

- As a visitor, I can see two example clubs rendered as cards so that the page feels alive and informative.
- As a visitor, each card shows seats left and percent full so that I can quickly gauge capacity.
- As a developer/instructor, the helpers return correct values for edge cases (0 capacity → 0%) so that demos don’t break.
- As a developer/instructor, re-rendering clears the container first so that cards don’t duplicate.
- As a developer/instructor, percent is rounded to a whole number so that the UI is easy to read.

## Acceptance Criteria

- `clubs` array exists with at least two items and the correct shape.
- `renderClubs()` populates the container with visible cards for each club.
- Helper math displays readable stats (seats left, percent full).
- Footer year is set programmatically; no console errors during render.

## Run this class

- **VS Code Live Server** extension (Right-click `index.html` → “Open with Live Server”)
