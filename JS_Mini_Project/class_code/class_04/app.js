// Class 4 — OOP: Classes & Composition
// Refactor state to use classes (Club, Member, Event) and interact via methods/getters.

// ---- Simple ID helper (avoids external libs for now) ----
let __id = 1;
function makeId(prefix) { return `${prefix}_${__id++}`; }

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
    this.rsvps = new Set(); // ids of members
  }
  toggleRsvp(memberId) {
    if (this.rsvps.has(memberId)) {
      this.rsvps.delete(memberId);
    } else if (this.rsvps.size < this.capacity) {
      this.rsvps.add(memberId);
    }
  }
}

class Club {
  constructor(name, capacity = 1) {
    this.id = makeId("c");
    this.name = name;
    this.capacity = capacity;
    this.members = []; // Member[]
    this.events = [];  // EventItem[]
  }

  // ---- Derived data (getters) ----
  get current()      { return this.members.length; }
  get seatsLeft()    { return Math.max(0, this.capacity - this.current); }
  get percentFull()  { return this.capacity > 0 ? Math.round((this.current / this.capacity) * 100) : 0; }

  // ---- Behavior ----
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

  addEvent(evt) {
    if (evt instanceof EventItem) this.events.push(evt);
  }

  upcomingEvents() {
    const now = new Date();
    return this.events.filter(e => e.date >= now).sort((a, b) => a.date - b.date);
  }

  // Helper to migrate from last week's plain objects
  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    // Seed members to match previous "current" counts
    for (let i = 0; i < (obj.current || 0); i++) {
      c.addMember(`Member ${i + 1}`);
    }
    return c;
  }
}

// ---- App State (now using Club instances) ----
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 12, capacity: 25 }),
  Club.fromPlain({ name: "Art Club",    current: 8,  capacity: 15 }),
];

// ---- Render ----
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  if (clubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs yet. Add one above to get started.";
    container.appendChild(p);
    return;
  }

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";

    // For now we show top-level stats. Members/Events UI comes next classes.
    const line1 = `${club.name}`;
    const line2 = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

    // Keep it simple for beginners: just a couple of lines
    card.innerHTML = `<strong>${line1}</strong><br>${line2}`;

    container.appendChild(card);
  });
}

// ---- Add Club (uses the Club class) ----
function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
  renderClubs();
}

// ---- Form handler (same UI as Class 3, now creating Club instances) ----
document.getElementById("club-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent = "Please enter a valid club name and capacity (min 1).";
    return;
  }

  const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    errorMessage.textContent = "A club with this name already exists.";
    return;
  }

  errorMessage.textContent = "";
  addClub(name, capacity);

  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// ---- Footer year & initial paint ----
document.getElementById("year").textContent = new Date().getFullYear();
renderClubs();
