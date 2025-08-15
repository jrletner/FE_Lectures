# Class 9 Upgrade Walkthrough — Step by Step
**From:** Class 8 (ES modules, members UI)  
**To:** Class 9 (Events + Day.js + nanoid)

This guide shows the exact changes to make.

---

## Step 0 — Create a centralized externals module
**File:** `src/utils/externals.js`
```js
// dayjs + plugin
import dayjsLib from "https://esm.sh/dayjs@1.11.11";
import relativeTime from "https://esm.sh/dayjs@1.11.11/plugin/relativeTime";
dayjsLib.extend(relativeTime);
export const dayjs = dayjsLib;

// nanoid
export { nanoid } from "https://esm.sh/nanoid@5.0.7";
```
**Why:** One place to manage external URLs; easier to swap CDNs later.

---

## Step 1 — Switch models to use nanoid IDs
**Files:** `src/models/Member.js`, `src/models/Club.js`  
**Change:** Replace any homemade counters with `nanoid()`.
```js
import { nanoid } from '../utils/externals.js';
// ...
this.id = nanoid();
```

---

## Step 2 — Enhance the Event model with Day.js
**File:** `src/models/EventItem.js`
```js
import { nanoid, dayjs } from '../utils/externals.js';

export class EventItem {
  constructor(title, dateISO, description = "", capacity = 100) {
    this.id = nanoid();
    this.title = title;
    this.dateISO = dateISO; // "YYYY-MM-DD"
    this.description = description;
    this.capacity = capacity;
    this.rsvps = new Set();
  }
  get date() { return dayjs(this.dateISO); }
  get isPast() { return this.date.isBefore(dayjs(), 'day'); }
  get friendlyWhen() {
    const fmt = this.date.format('MMM D, YYYY');
    const rel = this.date.from(dayjs(), true);
    const suffix = this.isPast ? `${rel} ago` : `in ${rel}`;
    return `${fmt} (${suffix})`;
  }
}
```

---

## Step 3 — Add event methods to `Club`
**File:** `src/models/Club.js`
```js
addEvent({ title, dateISO, description = "", capacity = 100 }) {
  const d = dayjs(dateISO);
  if (!d.isValid()) return { ok: false, reason: 'invalid-date' };
  const evt = new EventItem(title, dateISO, description, capacity);
  this.events.push(evt);
  this.sortEvents();
  return { ok: true, event: evt };
}
removeEvent(eventId) { /* ... */ }
sortEvents() { /* ... */ }
```

---

## Step 4 — Seed a couple of events
**File:** `src/store/data.js`
```js
export let clubs = [
  Club.fromPlain({
    name: "Coding Club", current: 3, capacity: 10,
    events: [
      { title: "Hack Night", dateISO: "2025-09-10", description: "Bring a project.", capacity: 30 },
      { title: "Intro to Git", dateISO: "2025-09-03", description: "Hands-on basics." }
    ]
  }),
  // ...
];
```

---

## Step 5 — Render events + add event form
**File:** `src/ui/render.js`
- Show each event with `evt.friendlyWhen` and a **Remove** button.
- Add a per-club **Add Event** form with inputs:
  - Title (text)
  - Date (type="date", with `min` set to `dayjs().format('YYYY-MM-DD')`)
  - Capacity (number)
  - Description (text, optional)
- Use `data-action="add-event"` and `data-action="remove-event"` on buttons.

---

## Step 6 — Handle event actions
**File:** `src/app.js`
- In the click delegation, add handlers for **add-event** and **remove-event**.
- On add: collect values, validate, call `club.addEvent(...)`, then re-render.

---

## Step 7 — Test
- Add a future event → should appear with a friendly date like `in 12 days`.
- Add a past date (optional) → shows `Past` badge.
- Remove event → list updates.
- All prior features (search/filter/sort, add/remove member, create club) still work.

You now have **Events** with clear dates and unique IDs using external libraries.
