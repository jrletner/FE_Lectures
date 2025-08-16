# Campus Club Manager — Class 1 (Completed)

**Lesson:** Kickoff & Setup  
**Goal:** Create a minimal, working web project with HTML, CSS, and JS linked correctly.

---

## Lesson Summary

## Problem or Enhancement

We need a reliable starting point for Campus Club Manager. There’s no shared page layout or agreed place for styles and scripts, which makes future work harder to follow. The enhancement is to establish a minimal, professional baseline: a clean HTML layout, a small stylesheet, and a single entry script (even if it’s mostly empty now).

## Impact on the Application

- Creates a consistent foundation (index.html, styles.css, app.js) for all future lessons.
- Clarifies separation of concerns: structure (HTML), presentation (CSS), behavior (JS).
- Reduces setup friction so each following class focuses on one concept at a time.

## What We’ll Change (Beginner Friendly)

- index.html:
  - Add a header with the app title and a main area to hold the content.
  - Include a placeholder element where we’ll insert dynamic content later (e.g., a section for clubs).
  - Link the stylesheet and reference a script file we’ll grow over time.
- styles.css:
  - Add readable defaults (font, spacing, layout width) so the page looks clean.
  - Keep styles simple and commented so new learners can follow along.
- app.js:
  - Create the file and confirm it’s wired (for example, later we’ll set the footer year or log a message).

This class “sets the table” so we can serve real features next.

## Risks, Assumptions, Dependencies

- Risks: Adding too much logic too early; we keep the baseline minimal and clear.
- Assumptions: You’ll run the app with VS Code Live Server to serve files over http://.
- Dependencies: None yet beyond a modern browser.

## Acceptance Criteria

- index.html includes a visible header and a main container for the app.
- styles.css is linked and applies basic layout/typography.
- app.js is referenced from the HTML (no 404s in the Network tab).
- Opening with Live Server shows the title and an empty placeholder area without console errors.

## Run this class

- **VS Code Live Server** extension (Right-click `index.html` → “Open with Live Server”)

You should see the title and a console message:

```
Class 1 setup complete. Ready for Class 2!
```

## Next

In **Class 2**, you'll add seed data, a couple of math helpers, and render a simple club list.
