# Class 12 Upgrade Walkthrough — Step by Step
**From:** Class 11 (Routing + Detail View)  
**To:** Class 12 (Async + Fetch + Loading States)

---

## Step 0 — Add a simple API layer
**File:** `src/services/api.js`
```js
const SEED_URL = './data/seed.json';
const delay = (ms) => new Promise(res => setTimeout(res, ms));
export async function loadClubsFromServer() {
  await delay(600);
  const res = await fetch(SEED_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load from server: ' + res.status);
  return res.json();
}
export async function saveClubsToServer(plainArray) {
  await delay(600);
  if (Math.random() < 0.1) throw new Error('Temporary server error. Try again.');
  return { ok: true, savedAt: new Date().toISOString(), count: plainArray.length };
}
```

---

## Step 1 — Create a global status area
**File:** `index.html`
```html
<div id="global-status" class="status" aria-live="polite"></div>
```
**File:** `styles.css` — add `.status`, `.status.loading`, `.status.error`, `.status.success`.

---

## Step 2 — Add new toolbar buttons
**File:** `index.html`
```html
<button id="reload-server" class="btn" type="button">Reload from Server</button>
<button id="save-server" class="btn" type="button">Save to Server</button>
```

---

## Step 3 — Bootstrap logic
**File:** `src/app.js`
- On `load`, call `bootstrap()`:
  - If **no saved state**, call `loadClubsFromServer()` → `setClubs(...)` → `saveState(clubs)`.
  - Otherwise use saved state.
- Wrap calls in `try/catch` and show global status messages.

---

## Step 4 — Wire the new buttons
**File:** `src/app.js`
- **Reload from Server:** fetch → `setClubs` → `saveState` → re‑render.
- **Save to Server:** `toPlainArray(clubs)` → `saveClubsToServer(payload)` → show success or error.

---

## Step 5 — Test
1. Clear localStorage (use **Reset Data**) and refresh → app fetches `seed.json`.  
2. Add a club/member/event → click **Save to Server** → success message.  
3. Try again a few times to see the simulated error path (10% chance).

You’ve now introduced **async/await**, **fetch**, and **loading states** — a huge step toward real-world apps.
