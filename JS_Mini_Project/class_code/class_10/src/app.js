// src/app.js — Class 10 entry
// New this class: persistence with localStorage + import/export/reset
import { clubs, setClubs, addClub, findClubById, toPlainArray } from './store/data.js';
import { ui, getVisibleClubs } from './store/filters.js';
import { renderClubs, setStatus } from './ui/render.js';
import { debounce } from './utils/debounce.js';
import { saveState, loadState, clearState } from './store/persist.js';

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Render + Re-render helper ----
function paint() {
  const visible = getVisibleClubs(clubs);
  renderClubs(visible);
}

// Persist immediately on startup (in case we loaded from seed)
saveState(clubs);

// ---- Event Delegation for club & event actions ----
const clubContainer = document.getElementById('club-info');

clubContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const clubId = btn.dataset.clubId;
  const club = findClubById(clubId);
  if (!club) return;

  // Members
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
    saveState(clubs);
    paint();
  }

  if (action === 'remove-member') {
    const memberId = btn.dataset.memberId;
    club.removeMember(memberId);
    saveState(clubs);
    paint();
  }

  // Events
  if (action === 'add-event') {
    const titleEl = document.getElementById(`event-title-${clubId}`);
    const dateEl  = document.getElementById(`event-date-${clubId}`);
    const capEl   = document.getElementById(`event-capacity-${clubId}`);
    const descEl  = document.getElementById(`event-desc-${clubId}`);

    const title = (titleEl?.value || '').trim();
    const dateISO = (dateEl?.value || '').trim();
    const cap = parseInt(capEl?.value || '0', 10);
    const desc = (descEl?.value || '').trim();

    if (!title || !dateISO || isNaN(cap) || cap <= 0) {
      setStatus(clubId, 'Enter a title, date, and capacity (>0).');
      return;
    }

    const added = club.addEvent({ title, dateISO, description: desc, capacity: cap });
    if (!added.ok) {
      setStatus(clubId, added.reason === 'invalid-date' ? 'Please pick a valid future date.' : 'Could not add event.');
      return;
    }
    setStatus(clubId, 'Event added.');
    saveState(clubs);
    paint();
  }

  if (action === 'remove-event') {
    const eventId = btn.dataset.eventId;
    club.removeEvent(eventId);
    saveState(clubs);
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
  saveState(clubs);
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

// ---- NEW: Import / Export / Reset ----
const exportBtn = document.getElementById('export-json');
const importBtn = document.getElementById('import-json');
const importFile = document.getElementById('import-file');
const resetBtn = document.getElementById('reset-data');

exportBtn.addEventListener('click', () => {
  const data = toPlainArray(clubs);
  const text = JSON.stringify(data, null, 2);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'campus-club-manager-data.json';
  a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', () => {
  importFile.click();
});

importFile.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    // Expecting an array of clubs (plain objects)
    if (!Array.isArray(parsed)) throw new Error('Invalid JSON format');
    setClubs(parsed); // rebuilds classes from plain
    saveState(clubs);
    paint();
    alert('Import complete!');
  } catch (err) {
    console.error(err);
    alert('Import failed: ' + err.message);
  } finally {
    importFile.value = ''; // reset input
  }
});

resetBtn.addEventListener('click', () => {
  if (!confirm('Reset data to the default seed? This will erase your saved changes.')) return;
  clearState();
  location.reload();
});

// Initial paint
paint();
