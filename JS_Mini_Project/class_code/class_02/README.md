# Campus Club Manager — Class 2 (Completed)

**Lesson:** Variables, Numbers, Strings  
**Goal:** Seed club data, do simple math (seats left, percent full), and render to the page.

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

## Acceptance Criteria

- `clubs` array exists with at least two items and the correct shape.
- `renderClubs()` populates the container with visible cards for each club.
- Helper math displays readable stats (seats left, percent full).
- Footer year is set programmatically; no console errors during render.

## Run this class

- **VS Code Live Server** extension (Right-click `index.html` → “Open with Live Server”)
