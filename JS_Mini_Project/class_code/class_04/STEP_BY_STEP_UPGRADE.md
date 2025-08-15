# Class 4 Upgrade Walkthrough — Step by Step
**From:** Class 3 (plain objects + functions)  
**To:** Class 4 (classes with methods/getters; composition)

This guide shows exactly how to refactor last week’s code.

> Tip: Make one change at a time; refresh and test often.

---

## Step 0 — Confirm your Class 3 baseline
You should have:
- A Create Club **form** with validation and duplicate check
- `clubs` as an **array of plain objects**
- Helpers like `seatsLeft(club)` and `percentFull(club)`
- A `renderClubs()` that displays name/capacity

---

## Step 1 — Add simple ID helper (top of `app.js`)
**File:** `app.js`  
**Where:** Top of the file.

```js
// STEP 1: NEW — simple ID helper
let __id = 1;
function makeId(prefix) { return `${prefix}_${__id++}`; }
```

---

## Step 2 — Create the **models** (classes)
**File:** `app.js`  
**Where:** Below the helper.

```js
// STEP 2: NEW — models
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
  get current()     { return this.members.length; }
  get seatsLeft()   { return Math.max(0, this.capacity - this.current); }
  get percentFull() { return this.capacity > 0 ? Math.round((this.current / this.capacity) * 100) : 0; }

  addMember(name, role = "member") {
    if (!name || typeof name !== "string") return { ok: false, reason: "invalid-name" };
    if (this.seatsLeft <= 0)              return { ok: false, reason: "full" };
    if (this.members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, reason: "duplicate" };
    }
    const m = new Member(name, role);
    this.members.push(m);
    return { ok: true, member: m };
  }

  removeMember(memberId) {
    const i = this.members.findIndex(m => m.id === memberId);
    if (i >= 0) { this.members.splice(i, 1); return true; }
    return false;
  }

  addEvent(evt) { if (evt instanceof EventItem) this.events.push(evt); }

  upcomingEvents() {
    const now = new Date();
    return this.events.filter(e => e.date >= now).sort((a, b) => a.date - b.date);
  }

  // Migration helper from plain objects
  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
    return c;
  }
}
```

---

## Step 3 — Migrate your data to **Club instances**
**File:** `app.js`  
**Where:** Replace your old `clubs = [...]` with:

```js
// STEP 3: CHANGE — use Club instances
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 12, capacity: 25 }),
  Club.fromPlain({ name: "Art Club",    current: 8,  capacity: 15 }),
];
```

This preserves the **same numbers** you had last week, but members are now real objects.

---

## Step 4 — Update the render to use **getters**
**File:** `app.js`  
**Where:** Keep your `renderClubs()` function, but update the message:

```js
// STEP 4: CHANGE — use club getters
const line1 = `${club.name}`;
const line2 = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
card.innerHTML = `<strong>${line1}</strong><br>${line2}`;
```

---

## Step 5 — Update `addClub` to create a **Club**
**File:** `app.js`  
**Where:** Replace the function body:

```js
// STEP 5: CHANGE — create a Club instance
function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
  renderClubs();
}
```

---

## Step 6 — Keep the form & validation the same
Good news — your existing form handler from Class 3 still works!  
It will now call the **updated** `addClub(name, capacity)` and everything renders as before.

---

## (Optional) Quick console tests
```js
clubs[0].addMember("Jordan");
clubs[0].current;     // increases by 1
clubs[0].seatsLeft;   // decreases by 1
clubs[0].percentFull; // recalculates correctly
renderClubs();
```

---

## Final Result
- Same UI as last week
- Internals now model data with **classes**, which sets you up for:
  - Class 5: DOM patterns & Add Member UI
  - Class 9: Events with dates & IDs
