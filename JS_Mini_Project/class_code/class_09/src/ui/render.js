// src/ui/render.js
import { dayjs } from '../utils/externals.js';

// Renders the provided list of clubs. Event handling is in app.js
export function renderClubs(visibleClubs) {
  const container = document.getElementById('club-info');
  container.innerHTML = '';

  if (visibleClubs.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No clubs match your filters.';
    container.appendChild(p);
    return;
  }

  visibleClubs.forEach((club) => {
    const card = document.createElement('div');
    card.className = 'club-card';
    card.dataset.clubId = club.id;

    const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

    // Members list
    const membersHtml = club.members.map(m => `
      <li>${m.name}
        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">
          Remove
        </button>
      </li>
    `).join('');

    // Events list (upcoming first; past are shown with a badge)
    const eventsHtml = club.events.map(evt => {
      const when = evt.friendlyWhen; // e.g., "Sep 10, 2025 (in 12 days)"
      const pastBadge = evt.isPast ? '<span class="badge">Past</span>' : '';
      return `<li>
        <strong>${evt.title}</strong> — ${when} ${pastBadge}
        <button class="link-btn" data-action="remove-event" data-club-id="${club.id}" data-event-id="${evt.id}">
          Remove
        </button>
      </li>`;
    }).join('');

    // Event form (per club)
    const todayISO = dayjs().format('YYYY-MM-DD');

    card.innerHTML = `
      <div><strong>${club.name}</strong><br>${stats}</div>

      <div class="member-section">
        <h4>Members (${club.current})</h4>
        <ul class="member-list">
          ${membersHtml || '<li><em>No members yet</em></li>'}
        </ul>

        <div class="inline-form">
          <input id="member-name-${club.id}" type="text" placeholder="e.g., Jordan" />
          <button class="btn" data-action="add-member" data-club-id="${club.id}">Add Member</button>
          <span id="status-${club.id}" class="note"></span>
        </div>
      </div>

      <div class="event-section">
        <h4>Events (${club.events.length})</h4>
        <ul class="event-list">
          ${eventsHtml || '<li><em>No events yet</em></li>'}
        </ul>

        <div class="inline-form">
          <input id="event-title-${club.id}" type="text" placeholder="Event title" />
          <input id="event-date-${club.id}" type="date" min="${todayISO}" />
          <input id="event-capacity-${club.id}" type="number" min="1" placeholder="Capacity" />
          <input id="event-desc-${club.id}" type="text" placeholder="Optional description" />
          <button class="btn" data-action="add-event" data-club-id="${club.id}">Add Event</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

export function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
