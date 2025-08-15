# Class 5 Upgrade Walkthrough — Step by Step
**From:** Class 4 (classes, stats shown)  
**To:** Class 5 (DOM patterns, event delegation, Add Member UI)

This guide shows the changes to make **on top of Class 4**.

---

## Step 0 — Confirm Class 4 baseline
- You have `Club`, `Member`, and `EventItem` classes.
- `clubs` is an array of `Club` instances.
- `renderClubs()` shows each club’s name and basic stats.
- You still have the Create Club form with validation.

---

## Step 1 — Update CSS for member UI
**File:** `styles.css`  
**Where:** Add the following blocks (or keep ours).

```css
/* STEP 1: NEW — simple member UI styles */
.member-section { margin-top: 8px; }
.member-section h4 { margin: 0 0 6px; font-size: 16px; }
.member-list { list-style: disc; padding-left: 20px; margin: 6px 0; }
.member-list li { margin: 2px 0; }

.inline-form { display: flex; gap: 6px; align-items: center; margin-top: 6px; }
.inline-form input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.link-btn {
  background: none; border: none; color: #0b5bd3; cursor: pointer; padding: 0;
}
.link-btn:hover { text-decoration: underline; }

.note { color: #666; font-size: 12px; margin-left: 8px; }
```

---

## Step 2 — Render members + inline Add Member form
**File:** `app.js`  
**Where:** Inside `renderClubs()`, after you build each `card`.

```js
// STEP 2: CHANGE — add members list and inline form
const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
const membersHtml = club.members.map(m => \`
  <li>\${m.name}
    <button class="link-btn" data-action="remove-member" data-club-id="\${club.id}" data-member-id="\${m.id}">Remove</button>
  </li>\`
).join("");

card.innerHTML = \`
  <div><strong>\${club.name}</strong><br>\${stats}</div>
  <div class="member-section">
    <h4>Members (\${club.current})</h4>
    <ul class="member-list">\${membersHtml || "<li><em>No members yet</em></li>"}</ul>
    <div class="inline-form">
      <input id="member-name-\${club.id}" type="text" placeholder="e.g., Jordan" />
      <button class="btn" data-action="add-member" data-club-id="\${club.id}">Add Member</button>
      <span id="status-\${club.id}" class="note"></span>
    </div>
  </div>\`;
```

---

## Step 3 — Event Delegation on the container
**File:** `app.js`  
**Where:** Below `renderClubs()`.

```js
// STEP 3: NEW — event delegation for dynamic buttons
const clubContainer = document.getElementById("club-info");

clubContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = clubs.find(c => c.id === clubId);
  if (!club) return;

  if (action === "add-member") {
    const input = document.getElementById(\`member-name-\${clubId}\`);
    const name = (input?.value || "").trim();
    if (name === "") { setStatus(clubId, "Please enter a member name."); return; }
    const result = club.addMember(name);
    if (!result.ok) {
      const msg = result.reason === "full" ? "Club is at capacity."
              : result.reason === "duplicate" ? "Member name already exists."
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

function setStatus(clubId, message) {
  const el = document.getElementById(\`status-\${clubId}\`);
  if (el) el.textContent = message;
}
```

---

## Step 4 — Keep Create Club form as-is
No change needed; it still works and uses your class-based `addClub` logic or pushes a new `Club`.

---

## Step 5 — Test
- Click **Add Member** with an empty input → see a tiny inline message.
- Add multiple unique names → list grows; stats update.
- Try duplicate names → see helpful message.
- Remove a member → stats update.

---

## Optional: Empty State
If `clubs` is ever empty, `renderClubs()` prints “No clubs yet”. You can test by setting `clubs = []; renderClubs();` in the console.

That’s it! You’ve introduced **event delegation** and **render-from-state** patterns that scale.
