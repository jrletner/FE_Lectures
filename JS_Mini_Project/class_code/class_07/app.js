// Class 7 — Advanced Functions (UX Helpers)
// Debounce the search input and introduce tiny functional utilities (pipe).
// Builds on Class 6 (search/filter/sort + Add Member UI).

// ---- Simple ID helper ----
let __id = 1;
function makeId(prefix) { return `${prefix}_${__id++}`; }

// ---- Small utilities (NEW in Class 7) ----
/**
 * debounce: returns a function that delays calling `fn`
 * until there has been no new call for `delay` ms.
 */
function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * pipe: compose functions left-to-right. pipe(f,g,h)(x) = h(g(f(x)))
 */
function pipe(...fns) {
  return (input) => fns.reduce((val, fn) => fn(val), input);
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
  get current() { return this.members.length; }
  get seatsLeft() { return Math.max(0, this.capacity - this.current); }
  get percentFull() { return this.capacity > 0 ? Math.round((this.current / this.capacity) * 100) : 0; }

  addMember(name, role = "member") {
    if (!name || typeof name !== "string") return { ok: false, reason: "invalid-name" };
    if (this.seatsLeft <= 0) return { ok: false, reason: "full" };
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

  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
    return c;
  }
}

// ---- App State ----
let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club", current: 8, capacity: 8 }),   // full
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];

// UI state (same keys as Class 6)
const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };

// ---- Functional transforms (NEW: built to use with pipe) ----
const applySearch = (list) => {
  const q = ui.searchText.trim().toLowerCase();
  if (!q) return list;
  return list.filter(c => c.name.toLowerCase().includes(q));
};

const applyOnlyOpen = (list) => {
  if (!ui.onlyOpen) return list;
  return list.filter(c => c.seatsLeft > 0);
};

const applySort = (list) => {
  const copy = list.slice();
  copy.sort((a, b) => {
    switch (ui.sortBy) {
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "seats-desc": return b.seatsLeft - a.seatsLeft;
      case "capacity-desc": return b.capacity - a.capacity;
      default: return 0;
    }
  });
  return copy;
};

// Compose into one function (NEW)
const getVisibleClubs = pipe(
  (arr) => arr.slice(), // defensive copy
  applySearch,
  applyOnlyOpen,
  applySort
);

// ---- Rendering ----
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = "";

  const visible = getVisibleClubs(clubs);
  if (visible.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs match your filters.";
    container.appendChild(p);
    return;
  }

  visible.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    card.dataset.clubId = club.id;

    const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

    const membersHtml = club.members.map(m => `
      <li>${m.name}
        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">
          Remove
        </button>
      </li>
    `).join("");

    card.innerHTML = `
      <div><strong>${club.name}</strong><br>${stats}</div>

      <div class="member-section">
        <h4>Members (${club.current})</h4>
        <ul class="member-list">
          ${membersHtml || "<li><em>No members yet</em></li>"}
        </ul>

        <div class="inline-form">
          <input id="member-name-${club.id}" type="text" placeholder="e.g., Jordan" />
          <button class="btn" data-action="add-member" data-club-id="${club.id}">Add Member</button>
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

// ---- Event Delegation (same pattern) ----
const clubContainer = document.getElementById("club-info");

clubContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = clubs.find(c => c.id === clubId);
  if (!club) return;

  if (action === "add-member") {
    const input = document.getElementById(`member-name-${clubId}`);
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

// ---- Create Club form (unchanged) ----
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
  clubs.push(new Club(name, capacity));
  renderClubs();

  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// ---- NEW: Debounced search wiring ----
// Best practice: capture the value and pass it to a debounced handler,
// instead of passing the event object directly (which may be reused).
const onSearchInput = debounce((value) => {
  ui.searchText = value;
  renderClubs();
}, 300);

document.getElementById("search").addEventListener("input", (e) => {
  onSearchInput(e.target.value);
});

// ---- Filter/sort wiring (same-day changes, no debounce) ----
document.getElementById("only-open").addEventListener("change", (e) => {
  ui.onlyOpen = e.target.checked;
  renderClubs();
});

document.getElementById("sort-by").addEventListener("change", (e) => {
  ui.sortBy = e.target.value;
  renderClubs();
});

// ---- Footer year & initial paint ----
document.getElementById("year").textContent = new Date().getFullYear();
renderClubs();
