# Class 11 Upgrade Walkthrough — Step by Step
**From:** Class 10 (Persistence + Import/Export)  
**To:** Class 11 (Routing + Detail View)

## Step 0 — Add a router
Create `src/router.js` with `parseHash`, `goHome`, and `goClub` helpers.

## Step 1 — Wire the router in `src/app.js`
Listen to `hashchange`/`load`, branch on route, and hide/show home‑only UI.

## Step 2 — Create a detail renderer (`src/ui/detail.js`)
Show full members/events and reuse data‑action buttons.

## Step 3 — Link list cards to detail pages (`src/ui/render.js`)
Wrap club name with `<a href="#/club/:id">` and keep a quick add event form on list.

## Step 4 — Test
Deep link to a club, refresh, navigate back home — everything should persist.
