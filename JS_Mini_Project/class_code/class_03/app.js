// Class 3 — Booleans, Ifs, Functions (Create Club)
// Completed project file

// Seed data from previous class
let clubs = [
  { name: "Coding Club", current: 12, capacity: 25 },
  { name: "Art Club",    current: 8,  capacity: 15 },
];

// Utility: compute seats left
function seatsLeft(club) {
  return club.capacity - club.current;
}

// Utility: compute percent full (rounded)
function percentFull(club) {
  if (club.capacity <= 0) return 0;
  return Math.round((club.current / club.capacity) * 100);
}

// Render all clubs
function renderClubs() {
  const container = document.getElementById("club-info");
  container.innerHTML = ""; // clear

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

    const msg = `${club.name}: ${club.current}/${club.capacity} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
    card.textContent = msg;
    container.appendChild(card);
  });
}

// Add a new club and re-render
function addClub(name, capacity) {
  clubs.push({ name, current: 0, capacity });
  renderClubs();
}

// Handle Create Club form submit
document.getElementById("club-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("club-name");
  const capacityInput = document.getElementById("club-capacity");
  const errorMessage = document.getElementById("error-message");

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  // Basic validation
  if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent = "Please enter a valid club name and capacity (min 1).";
    return;
  }

  // Duplicate check (case-insensitive)
  const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    errorMessage.textContent = "A club with this name already exists.";
    return;
  }

  // Clear error and add
  errorMessage.textContent = "";
  addClub(name, capacity);

  // Reset form and focus name for faster entry
  nameInput.value = "";
  capacityInput.value = "";
  nameInput.focus();
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial paint
renderClubs();
