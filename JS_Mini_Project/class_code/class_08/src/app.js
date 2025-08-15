// src/app.js — Entry point (ES Modules)
import { clubs, addClub, findClubById } from './store/data.js';
import { ui, getVisibleClubs } from './store/filters.js';
import { renderClubs, setStatus } from './ui/render.js';
import { debounce } from './utils/debounce.js';

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Render + Re-render helper ----
function paint() {
  const visible = getVisibleClubs(clubs);
  renderClubs(visible);
}

// ---- Event Delegation for club actions ----
const clubContainer = document.getElementById('club-info');

clubContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = findClubById(clubId);
  if (!club) return;

  if (action === 'add-member') {
    const input = document.getElementById(`member-name-${clubId}`);
    const name = (input?.value || '').trim();

    if (name === '') { setStatus(clubId, 'Please enter a member name.'); return; }

    const result = club.addMember(name);
    if (!result.ok) {
      const msg = result.reason === 'full'      ? 'Club is at capacity.'
               : result.reason === 'duplicate' ? 'Member name already exists.'
               : 'Invalid member name.';
      setStatus(clubId, msg);
      return;
    }

    setStatus(clubId, 'Member added.');
    paint();
  }

  if (action === 'remove-member') {
    const memberId = btn.dataset.memberId;
    club.removeMember(memberId);
    paint();
  }
});

// ---- Create Club form ----
document.getElementById('club-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('club-name');
  const capacityInput = document.getElementById('club-capacity');
  const errorMessage = document.getElementById('error-message');

  const name = nameInput.value.trim();
  const capacity = parseInt(capacityInput.value, 10);

  if (name === '' || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent = 'Please enter a valid club name and capacity (min 1).';
    return;
  }

  const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    errorMessage.textContent = 'A club with this name already exists.';
    return;
  }

  errorMessage.textContent = '';
  addClub(name, capacity);
  paint();

  nameInput.value = '';
  capacityInput.value = '';
  nameInput.focus();
});

// ---- Toolbar wiring ----
const onSearchInput = debounce((value) => {
  ui.searchText = value;
  paint();
}, 300);

document.getElementById('search').addEventListener('input', (e) => {
  onSearchInput(e.target.value);
});

document.getElementById('only-open').addEventListener('change', (e) => {
  ui.onlyOpen = e.target.checked;
  paint();
});

document.getElementById('sort-by').addEventListener('change', (e) => {
  ui.sortBy = e.target.value;
  paint();
});

// Initial paint
paint();
