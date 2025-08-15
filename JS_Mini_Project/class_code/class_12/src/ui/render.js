// src/ui/render.js
import { dayjs } from '../utils/externals.js';

export function renderClubs(visibleClubs) {
  const container = document.getElementById('app-root');
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

    const membersHtml = club.members.map(m => `
      <li>${m.name}
        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
      </li>
    `).join('');

    const todayISO = dayjs().format('YYYY-MM-DD');

    card.innerHTML = `
      <div><strong><a href="#/club/${club.id}">${club.name}</a></strong><br>${stats}</div>

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
        <h4>Quick Add Event</h4>
        <div class="inline-form">
          <input id="event-title-${club.id}" type="text" placeholder="Event title" />
          <input id="event-date-${club.id}" type="date" min="${todayISO}" />
          <input id="event-capacity-${club.id}" type="number" min="1" placeholder="Capacity" />
          <input id="event-desc-${club.id}" type="text" placeholder="Optional description" />
          <button class="btn" data-action="add-event" data-club-id="${club.id}">Add Event</button>
        </div>
        <p class="note"><a href="#/club/${club.id}">View details</a> to see full event list.</p>
      </div>
    `;

    container.appendChild(card);
  });
}

export function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
