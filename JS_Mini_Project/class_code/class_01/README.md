# Campus Club Manager — Class 1 (Completed)

**Lesson:** Kickoff & Setup  
**Goal:** Create a minimal, working web project with HTML, CSS, and JS linked correctly.

## Manager → Developer: Story Brief

We need a reliable, repeatable baseline for the rest of the curriculum. Today isn’t about features; it’s about scaffolding a clean, professional starting point so future lessons can focus on one concept at a time. The output should be simple and confidence‑building: HTML structure, basic CSS, and a wired JS file with proof of life (a small console message is fine).

Constraints and intent:

- Keep it minimal and readable—this is for beginners learning from the repo history.
- Use a consistent file layout: `index.html`, `styles.css`, `app.js`.
- Link assets correctly; no 404s in the Network tab.
- Serve via Live Server (http) to avoid file URL quirks.
- No premature logic; just placeholders and a clean surface for later features.

What “done” looks like today:

- I can open the page with Live Server, see the app title and a tidy layout, CSS is applied, JS is loaded (no console errors), and a console message confirms the environment is ready for Class 2.

## User Stories (Class 1)

- As a visitor, I can open the site and see a visible header/title so that I know I’m in the right place.
- As a visitor, I see a main area reserved for future dynamic content so that the page sets expectations.
- As a developer/instructor, the stylesheet and script are linked correctly so that there are no asset 404s or silent failures.
- As a developer/instructor, the project follows a simple file structure (HTML/CSS/JS) so that learners can navigate easily.
- As a developer/instructor, I see a console message confirming the setup so that I know the JS pipeline is working.

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
