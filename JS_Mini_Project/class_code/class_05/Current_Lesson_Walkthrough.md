# Class 5 — DOM Rendering Patterns & Member UI

> At a glance
>
> - What you’ll build: Member UI inside each club card (list/add/remove) using event delegation; continue using OOP models from Class 4.
> - Files touched: index.html, styles.css, app.js
> - Est. time: 60–90 min
> - Prereqs: Finished Class 4

## How to run

- Use the VS Code Live Server extension (Right‑click `index.html` → "Open with Live Server"). Avoid opening via `file://` to ensure assets and scripts load consistently.

## How to use

- Live‑code friendly: paste small diffs in order and verify ✅ checks as you go.
- Keep the browser and console open side‑by‑side. Think in triads: Visual (UI), Console (one line), DOM query.

## Before you start

- Open: `JS_Mini_Project/class_code/class_05`
- Baseline: Compare Class 4 repo files to Class 5 repo files to ensure exact diffs.
- Files to diff: `index.html`, `styles.css`, `app.js`

## What changed since last class

<details>
  <summary>Diff — index.html</summary>

```diff
@@
-  <title>Campus Club Manager — Class 4</title>
+  <title>Campus Club Manager — Class 5</title>
```

</details>

<details>
  <summary>Diff — styles.css</summary>

```diff
@@
-main { max-width: 900px; margin: 0 auto; }
+main { max-width: 960px; margin: 0 auto; }
@@
 .club-card {
   border: 1px solid #ccc;
   background: #fff;
-  padding: 10px;
+  padding: 12px;
   border-radius: 6px;
 }
@@
+/* Inline member UI helpers */
+.link-btn { background: none; border: none; color: #0b5bd3; cursor: pointer; padding: 0; }
+.link-btn:hover { text-decoration: underline; }
+.note  { color: #666; font-size: 12px; margin-left: 8px; }
+
+.member-section { margin-top: 8px; }
+.member-section h4 { margin: 0 0 6px; font-size: 16px; }
+.member-list { list-style: disc; padding-left: 20px; margin: 6px 0; }
+.member-list li { margin: 2px 0; }
+
+.inline-form { display: flex; gap: 6px; align-items: center; margin-top: 6px; }
+.inline-form input { flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
```

</details>

<details>
  <summary>Diff — app.js</summary>

```diff
@@
-let clubs = [
-  Club.fromPlain({ name: "Coding Club", current: 12, capacity: 25 }),
-  Club.fromPlain({ name: "Art Club",    current: 8,  capacity: 15 }),
-];
+let clubs = [
+  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 5 }),
+  Club.fromPlain({ name: "Art Club",    current: 2, capacity: 4 }),
+];
@@
   const card = document.createElement("div");
   card.className = "club-card";
-
-  // For now we show top-level stats. Members/Events UI comes next classes.
-  const line1 = `${club.name}`;
-  const line2 = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
-
-  // Keep it simple for beginners: just a couple of lines
-  card.innerHTML = `<strong>${line1}</strong><br>${line2}`;
+  card.dataset.clubId = club.id;
+  const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
+  const membersHtml = club.members.map(m => `
+      <li>${m.name}
+        <button class=\"link-btn\" data-action=\"remove-member\" data-club-id=\"${club.id}\" data-member-id=\"${m.id}\">Remove</button>
+      </li>
+    `).join("");
+  card.innerHTML = `
+    <div><strong>${club.name}</strong><br>${stats}</div>
+    <div class=\"member-section\">
+      <h4>Members (${club.current})</h4>
+      <ul class=\"member-list\">${membersHtml || "<li><em>No members yet</em></li>"}</ul>
+      <div class=\"inline-form\">
+        <input id=\"member-name-${club.id}\" type=\"text\" placeholder=\"e.g., Jordan\" />
+        <button class=\"btn\" data-action=\"add-member\" data-club-id=\"${club.id}\">Add Member</button>
+        <span id=\"status-${club.id}\" class=\"note\"></span>
+      </div>
+    </div>`;
@@
-function addClub(name, capacity) {
-  clubs.push(new Club(name, capacity));
-  renderClubs();
-}
+// removed thin addClub wrapper; push directly in submit handler
@@
-  errorMessage.textContent = "";
-  addClub(name, capacity);
+  errorMessage.textContent = "";
+  clubs.push(new Club(name, capacity));
+  renderClubs();
@@
+// Helper: inline status message per card
+function setStatus(clubId, message) {
+  const el = document.getElementById(`status-${clubId}`);
+  if (el) el.textContent = message;
+}
+
+// Event delegation for dynamic buttons
+const clubContainer = document.getElementById("club-info");
+clubContainer.addEventListener("click", (e) => {
+  const btn = e.target.closest("[data-action]");
+  if (!btn) return;
+  const action = btn.dataset.action;
+  const clubId = btn.dataset.clubId;
+  const club = clubs.find(c => c.id === clubId);
+  if (!club) return;
+  if (action === "add-member") {
+    const input = document.getElementById(`member-name-${clubId}`);
+    const name = (input?.value || "").trim();
+    if (name === "") { setStatus(clubId, "Please enter a member name."); return; }
+    const result = club.addMember(name);
+    if (!result.ok) {
+      const msg = result.reason === "full" ? "Club is at capacity."
+                : result.reason === "duplicate" ? "Member name already exists."
+                : "Invalid member name.";
+      setStatus(clubId, msg);
+      return;
+    }
+    setStatus(clubId, "Member added.");
+    renderClubs();
+  }
+  if (action === "remove-member") {
+    const memberId = btn.dataset.memberId;
+    club.removeMember(memberId);
+    renderClubs();
+  }
+});
```

</details>

## File tree (current class)

<details open>
  <summary>File tree — class_05</summary>

```text
class_05/
  index.html
  styles.css
  app.js
```

</details>

## Live-coding steps

### 1) index.html — update the title

> 📍 Where
>
> - File: `class_05/index.html`
> - Inside `<head>`, find the existing `<title>`.
>
> ℹ️ What
>
> - Update the tab title to “Class 5”.
>
> 💡 Why
>
> - Keeps everyone oriented during class.
>
> ✅ Check
>
> - Browser tab reads “Campus Club Manager — Class 5”.

<details open>
  <summary>Diff — index.html: title to Class 5</summary>

```diff
@@
-  <title>Campus Club Manager — Class 4</title>
+  <title>Campus Club Manager — Class 5</title>
```

</details>

<details>
  <summary>Clean copy/paste — index.html: new title</summary>

```html
<title>Campus Club Manager — Class 5</title>
```

</details>

### 2) styles.css — widen main and pad cards

> 📍 Where
>
> - File: `class_05/styles.css`
> - Find the `main { ... }` and `.club-card { ... }` blocks.
>
> ℹ️ What
>
> - Set `max-width: 960px` on `main` and increase `.club-card` padding to `12px`.
>
> 💡 Why
>
> - Gives space for the new inline member UI.
>
> ✅ Check
>
> - Content is slightly wider; cards have a bit more breathing room.

<details open>
  <summary>Diff — styles.css: main width and card padding</summary>

```diff
@@
-main { max-width: 900px; margin: 0 auto; }
+main { max-width: 960px; margin: 0 auto; }
@@
 .club-card {
   border: 1px solid #ccc;
   background: #fff;
-  padding: 10px;
+  padding: 12px;
   border-radius: 6px;
 }
```

</details>

<details>
  <summary>Clean copy/paste — styles.css: updated rules</summary>

```css
/* main */
 {
  max-width: 960px;
  margin: 0 auto;
}

/* club-card */
padding: 12px;
```

</details>

### 3) styles.css — add helpers for the member UI

> 📍 Where
>
> - File: `class_05/styles.css`
> - Near other utility classes; append these rules.
>
> ℹ️ What
>
> - Add link‑style buttons, small note text, member section, list, and inline form styles.
>
> 💡 Why
>
> - Simple, readable UI for inline actions without extra libraries.
>
> ✅ Check
>
> - “Remove” buttons look like links; inputs align inline.

<details open>
  <summary>Diff — styles.css: add member UI helper classes</summary>

```diff
@@
+/* Inline member UI helpers */
+.link-btn { background: none; border: none; color: #0b5bd3; cursor: pointer; padding: 0; }
+.link-btn:hover { text-decoration: underline; }
+.note  { color: #666; font-size: 12px; margin-left: 8px; }
+
+.member-section { margin-top: 8px; }
+.member-section h4 { margin: 0 0 6px; font-size: 16px; }
+.member-list { list-style: disc; padding-left: 20px; margin: 6px 0; }
+.member-list li { margin: 2px 0; }
+
+.inline-form { display: flex; gap: 6px; align-items: center; margin-top: 6px; }
+.inline-form input { flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
```

</details>

<details>
  <summary>Clean copy/paste — styles.css: helper classes</summary>

```css
.link-btn {
  background: none;
  border: none;
  color: #0b5bd3;
  cursor: pointer;
  padding: 0;
}
.link-btn:hover {
  text-decoration: underline;
}
.note {
  color: #666;
  font-size: 12px;
  margin-left: 8px;
}
.member-section {
  margin-top: 8px;
}
.member-section h4 {
  margin: 0 0 6px;
  font-size: 16px;
}
.member-list {
  list-style: disc;
  padding-left: 20px;
  margin: 6px 0;
}
.member-list li {
  margin: 2px 0;
}
.inline-form {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 6px;
}
.inline-form input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
```

</details>

<br><br>

> Checkpoint 1 — Styles applied
>
> - Visual: Cards still render; Remove buttons look like links.
> - Console: No CSS load errors.

### 4) app.js — seed data: smaller demo numbers

> 📍 Where
>
> - File: `class_05/app.js`
> - Replace the `let clubs = [...]` array.
>
> ℹ️ What
>
> - Use smaller seed numbers for easier testing (hit capacity/duplicate faster).
>
> 💡 Why
>
> - Speeds up testing edge cases in class.
>
> ✅ Check
>
> - After reload, stats show 3/5 and 2/4 for the two clubs.

<details open>
  <summary>Diff — app.js: adjust initial seeds</summary>

```diff
@@
-let clubs = [
-  Club.fromPlain({ name: "Coding Club", current: 12, capacity: 25 }),
-  Club.fromPlain({ name: "Art Club",    current: 8,  capacity: 15 }),
-];
+let clubs = [
+  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 5 }),
+  Club.fromPlain({ name: "Art Club",    current: 2, capacity: 4 }),
+];
```

</details>

<details>
  <summary>Clean copy/paste — app.js: new seeds</summary>

```js
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 5 }),
  Club.fromPlain({ name: "Art Club", current: 2, capacity: 4 }),
];
```

</details>

### 5) app.js — render: add Members UI inside each card

> 📍 Where
>
> - File: `class_05/app.js`
> - Inside `renderClubs()` in the `clubs.forEach(club)` loop, right after `card.className = 'club-card'`.
>
> ℹ️ What
>
> - Replace the simple two‑line message with a member list + inline add UI.
> - Add `data-club-id` on the card and `data-action` on buttons to enable event delegation.
>
> 💡 Why
>
> - Centralizes interactions per card and keeps one listener for dynamic content.
>
> ✅ Check
>
> - Each card shows a Members section; empty lists show “No members yet”.

<details open>
  <summary>Diff — app.js: replace simple card body with member UI</summary>

```diff
@@
   const card = document.createElement("div");
   card.className = "club-card";
-
-  // For now we show top-level stats. Members/Events UI comes next classes.
-  const line1 = `${club.name}`;
-  const line2 = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
-
-  // Keep it simple for beginners: just a couple of lines
-  card.innerHTML = `<strong>${line1}</strong><br>${line2}`;
+  card.dataset.clubId = club.id;
+  const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
+  const membersHtml = club.members.map(m => `
+      <li>${m.name}
+        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
+      </li>
+    `).join("");
+  card.innerHTML = `
+    <div><strong>${club.name}</strong><br>${stats}</div>
+    <div class="member-section">
+      <h4>Members (${club.current})</h4>
+      <ul class="member-list">
+        ${membersHtml || "<li><em>No members yet</em></li>"}
+      </ul>
+      <div class="inline-form">
+        <input id="member-name-${club.id}" type="text" placeholder="e.g., Jordan" />
+        <button class="btn" data-action="add-member" data-club-id="${club.id}">Add Member</button>
+        <span id="status-${club.id}" class="note"></span>
+      </div>
+    </div>`;
```

</details>

<details>
  <summary>Clean copy/paste — app.js: member UI body</summary>

```js
card.dataset.clubId = club.id;
const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
const membersHtml = club.members
  .map(
    (m) => `
  <li>${m.name}
    <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
  </li>
`
  )
  .join("");
card.innerHTML = `
  <div><strong>${club.name}</strong><br>${stats}</div>
  <div class="member-section">
    <h4>Members (${club.current})</h4>
    <ul class="member-list">
      ${membersHtml || "<li><em>No members yet</em></li>"}
    </ul>
    <div class="inline-form">
      <input id="member-name-${
        club.id
      }" type="text" placeholder="e.g., Jordan" />
      <button class="btn" data-action="add-member" data-club-id="${
        club.id
      }">Add Member</button>
      <span id="status-${club.id}" class="note"></span>
    </div>
  </div>
`;
```

</details>

### 6) app.js — helper: inline status message

> 📍 Where
>
> - File: `class_05/app.js`
> - Directly below `renderClubs()`.
>
> ℹ️ What
>
> - Small helper to set the status span inside a card.
>
> 💡 Why
>
> - Keeps the click handler simple; avoids duplicate DOM lookups.
>
> ✅ Check
>
> - No errors; nothing visible yet.

<details open>
  <summary>Diff — app.js: add setStatus helper</summary>

```diff
@@
+function setStatus(clubId, message) {
+  const el = document.getElementById(`status-${clubId}`);
+  if (el) el.textContent = message;
+}
```

</details>

<details>
  <summary>Clean copy/paste — app.js: setStatus</summary>

```js
function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
```

</details>

### 7) app.js — event delegation on the cards container

> 📍 Where
>
> - File: `class_05/app.js`
> - Below the helper; one listener on `#club-info`.
>
> ℹ️ What
>
> - Listen for clicks on Add/Remove via `data-action` and re‑render from state.
>
> 💡 Why
>
> - One listener handles dynamic content reliably.
>
> ✅ Check
>
> - Add “Jordan”; card re‑renders. Remove “Jordan” works.

<details open>
  <summary>Diff — app.js: add delegated click handler</summary>

```diff
@@
+const clubContainer = document.getElementById("club-info");
+clubContainer.addEventListener("click", (e) => {
+  const btn = e.target.closest("[data-action]");
+  if (!btn) return;
+  const action = btn.dataset.action;
+  const clubId = btn.dataset.clubId;
+  const club = clubs.find(c => c.id === clubId);
+  if (!club) return;
+  if (action === "add-member") {
+    const input = document.getElementById(`member-name-${clubId}`);
+    const name = (input?.value || "").trim();
+    if (name === "") { setStatus(clubId, "Please enter a member name."); return; }
+    const result = club.addMember(name);
+    if (!result.ok) {
+      const msg = result.reason === "full" ? "Club is at capacity."
+                : result.reason === "duplicate" ? "Member name already exists."
+                : "Invalid member name.";
+      setStatus(clubId, msg);
+      return;
+    }
+    setStatus(clubId, "Member added.");
+    renderClubs();
+  }
+  if (action === "remove-member") {
+    const memberId = btn.dataset.memberId;
+    club.removeMember(memberId);
+    renderClubs();
+  }
+});
```

</details>

<details>
  <summary>Clean copy/paste — app.js: delegated handler</summary>

```js
const clubContainer = document.getElementById("club-info");
clubContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = clubs.find((c) => c.id === clubId);
  if (!club) return;
  if (action === "add-member") {
    const input = document.getElementById(`member-name-${clubId}`);
    const name = (input?.value || "").trim();
    if (name === "") {
      setStatus(clubId, "Please enter a member name.");
      return;
    }
    const result = club.addMember(name);
    if (!result.ok) {
      const msg =
        result.reason === "full"
          ? "Club is at capacity."
          : result.reason === "duplicate"
          ? "Member name already exists."
          : "Invalid member name.";
      setStatus(clubId, msg);
      return;
    }
    setStatus(clubId, "Member added.");
    renderClubs();
  }
  if (action === "remove-member") {
    const memberId = btn.dataset.memberId;
    club.removeMember(memberId);
    renderClubs();
  }
});
```

</details>

<br><br>

> Checkpoint 2 — Member UI and interactions
>
> - Visual: Members section appears; add/remove updates counts and list.
> - Console: No errors on click; `clubs.at(-1) instanceof Club` → true after form submit.
> - DOM: `document.querySelectorAll('.club-card').length` equals number of clubs.

### 8) app.js — change the submit handler to push directly

> 📍 Where
>
> - File: `class_05/app.js`
> - Inside the form `submit` handler after the duplicate check block.
>
> ℹ️ What
>
> - Replace `addClub(name, capacity)` with `clubs.push(new Club(...)); renderClubs();`.
>
> 💡 Why
>
> - We’re removing the thin wrapper and writing to state directly.
>
> ✅ Check
>
> - Creating a new club still works; card appears at the end.

<details open>
  <summary>Diff — app.js: push directly in submit handler</summary>

```diff
@@
  errorMessage.textContent = "";
-  addClub(name, capacity);
+  clubs.push(new Club(name, capacity));
+  renderClubs();
```

</details>

<details>
  <summary>Clean copy/paste — app.js: submit handler body</summary>

```js
clubs.push(new Club(name, capacity));
renderClubs();
```

</details>

### 9) app.js — remove the old addClub wrapper

> 📍 Where
>
> - File: `class_05/app.js`
> - Your Class 4 file had `function addClub(name, capacity) { ... }`. Delete it if still present.
>
> ℹ️ What
>
> - Remove the addClub wrapper; we no longer call it.
>
> 💡 Why
>
> - Avoid dead code and reduce indirection.
>
> ✅ Check
>
> - Search for `function addClub(` returns nothing; app still compiles and runs.

<details open>
  <summary>Diff — app.js: remove addClub wrapper</summary>

```diff
-function addClub(name, capacity) {
-  clubs.push(new Club(name, capacity));
-  renderClubs();
-}
```

</details>

## Troubleshooting

- Buttons do nothing: Ensure the listener is attached to `#club-info` and buttons have `data-action` attributes.
- Status never updates: Check the IDs `status-<club.id>` and that `setStatus` is defined and loaded before clicks.
- New clubs fail to render: Confirm you push `new Club(...)` and call `renderClubs()` after.
- CSS misaligned: Verify you added `.link-btn`, `.member-section`, and `.inline-form` blocks.

## Appendix — Full Source After This Class

<details>
  <summary>Full source — index.html</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 5</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Track club capacity and members</p>
    </header>

    <main>
      <!-- Create Club Form (from previous classes) -->
      <form id="club-form" class="form">
        <div class="form-row">
          <label for="club-name">Club Name</label>
          <input type="text" id="club-name" placeholder="e.g., Chess Club" />
        </div>
        <div class="form-row">
          <label for="club-capacity">Max Capacity</label>
          <input
            type="number"
            id="club-capacity"
            placeholder="e.g., 20"
            min="1"
          />
        </div>
        <button type="submit" class="btn">Add Club</button>
        <p id="error-message" class="error" role="alert" aria-live="polite"></p>
      </form>

      <!-- Clubs render here -->
      <section id="club-info" class="cards"></section>
    </main>

    <footer>
      <small>&copy; <span id="year"></span> Campus Club Manager</small>
    </footer>

    <script src="app.js"></script>
  </body>
</html>
```

</details>

<details>
  <summary>Full source — styles.css</summary>

```css
/* Class 5 — DOM Rendering Patterns
   Keep styles simple and readable for beginners.
*/

* {
  box-sizing: border-box;
}
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
  color: #333;
}

header h1 {
  margin: 0;
}
header p {
  margin: 4px 0 16px;
  color: #555;
}

main {
  max-width: 960px;
  margin: 0 auto;
}

.form {
  background: #fff;
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 6px;
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}
.form-row label {
  width: 120px;
}
.form-row input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 8px 12px;
  border: 1px solid #999;
  background: #fafafa;
  cursor: pointer;
  border-radius: 4px;
}
.btn:hover {
  background: #f0f0f0;
}
.btn:focus {
  outline: 2px solid #4a90e2;
  outline-offset: 2px;
}

.link-btn {
  background: none;
  border: none;
  color: #0b5bd3;
  cursor: pointer;
  padding: 0;
}
.link-btn:hover {
  text-decoration: underline;
}

.error {
  color: #c00;
  margin-top: 8px;
}
.note {
  color: #666;
  font-size: 12px;
  margin-left: 8px;
}

.cards {
  display: grid;
  gap: 10px;
}
.club-card {
  border: 1px solid #ccc;
  background: #fff;
  padding: 12px;
  border-radius: 6px;
}

.member-section {
  margin-top: 8px;
}
.member-section h4 {
  margin: 0 0 6px;
  font-size: 16px;
}
.member-list {
  list-style: disc;
  padding-left: 20px;
  margin: 6px 0;
}
.member-list li {
  margin: 2px 0;
}

.inline-form {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 6px;
}
.inline-form input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

footer {
  margin-top: 20px;
  color: #666;
}
```

</details>

<details>
  <summary>Full source — app.js</summary>

```javascript
// Class 5 — DOM Rendering Patterns
// Add Member UI + event delegation + render-from-state patterns.
// Builds on Class 4 (classes for Club, Member, EventItem).

// ---- Simple ID helper ----
let __id = 1;
function makeId(prefix) {
  return `${prefix}_${__id++}`;
}

// ---- Models ----
class Member {
  constructor(name, role = "member") {
    this.id = makeId("m");
    this.name = name;
    this.role = role;
  }
}

class EventItem {
  constructor(title, dateStr, description = "", capacity = 100) {
    this.id = makeId("e");
    this.title = title;
    this.date = new Date(dateStr);
    this.description = description;
    this.capacity = capacity;
    this.rsvps = new Set();
  }
  toggleRsvp(memberId) {
    if (this.rsvps.has(memberId)) this.rsvps.delete(memberId);
    else if (this.rsvps.size < this.capacity) this.rsvps.add(memberId);
  }
}

class Club {
  constructor(name, capacity = 1) {
    this.id = makeId("c");
    this.name = name;
    this.capacity = capacity;
    this.members = [];
    this.events = [];
  }
  get current() {
    return this.members.length;
  }
  get seatsLeft() {
    return Math.max(0, this.capacity - this.current);
  }
  get percentFull() {
    return this.capacity > 0
      ? Math.round((this.current / this.capacity) * 100)
      : 0;
  }

  addMember(name, role = "member") {
    if (!name || typeof name !== "string")
      return { ok: false, reason: "invalid-name" };
    if (this.seatsLeft <= 0) return { ok: false, reason: "full" };
    if (this.members.some((m) => m.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, reason: "duplicate" };
    }
    const m = new Member(name, role);
    this.members.push(m);
    return { ok: true, member: m };
  }

  removeMember(memberId) {
    const i = this.members.findIndex((m) => m.id === memberId);
    if (i >= 0) {
      this.members.splice(i, 1);
      return true;
    }
    return false;
  }

  addEvent(evt) {
    if (evt instanceof EventItem) this.events.push(evt);
  }

  upcomingEvents() {
    const now = new Date();
    return this.events
      .filter((e) => e.date >= now)
      .sort((a, b) => a.date - b.date);
  }

  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
    return c;
  }
}

// ---- App State ----
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 5 }),
  Club.fromPlain({ name: "Art Club", current: 2, capacity: 4 }),
];

// ---- Rendering ----
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  // Empty state
  if (clubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs yet. Add one above to get started.";
    container.appendChild(p);
    return;
  }

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    card.dataset.clubId = club.id;

    const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

    // Members list UI + inline add form
    const membersHtml = club.members
      .map(
        (m) => `
      <li>${m.name}
        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">
          Remove
        </button>
      </li>
    `
      )
      .join("");

    card.innerHTML = `
      <div><strong>${club.name}</strong><br>${stats}</div>

      <div class="member-section">
        <h4>Members (${club.current})</h4>
        <ul class="member-list">
          ${membersHtml || "<li><em>No members yet</em></li>"}
        </ul>

        <div class="inline-form">
          <input id="member-name-${
            club.id
          }" type="text" placeholder="e.g., Jordan" />
          <button class="btn" data-action="add-member" data-club-id="${
            club.id
          }">Add Member</button>
          <span id="status-${club.id}" class="note"></span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Helper: set a tiny status message inside a club card
function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}

// ---- Event Delegation for dynamic UI ----
const clubContainer = document.getElementById("club-info");

clubContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = clubs.find((c) => c.id === clubId);
  if (!club) return;

  if (action === "add-member") {
    const input = document.getElementById(`member-name-${clubId}`);
    const name = (input?.value || "").trim();

    if (name === "") {
      setStatus(clubId, "Please enter a member name.");
      return;
    }

    const result = club.addMember(name);
    if (!result.ok) {
      const msg =
        result.reason === "full"
          ? "Club is at capacity."
          : result.reason === "duplicate"
          ? "Member name already exists."
          : "Invalid member name.";
      setStatus(clubId, msg);
      return;
    }

    setStatus(clubId, "Member added.");
    renderClubs(); // Re-render from state
  }

  if (action === "remove-member") {
    const memberId = btn.dataset.memberId;
    club.removeMember(memberId);
    renderClubs();
  }
});

// ---- Create Club form (from earlier classes) ----
document.getElementById("club-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent =
      "Please enter a valid club name and capacity (min 1).";
    return;
  }

  const exists = clubs.some((c) => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    errorMessage.textContent = "A club with this name already exists.";
    return;
  }

  errorMessage.textContent = "";
  clubs.push(new Club(name, capacity));
  renderClubs();

  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// ---- Footer year & initial paint ----
document.getElementById("year").textContent = new Date().getFullYear();
renderClubs();
```

</details>
