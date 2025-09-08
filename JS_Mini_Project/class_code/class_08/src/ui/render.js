// src/ui/render.js
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

    const membersHtml = club.members.map(m => `
      <li>${m.name}
        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">
          Remove
        </button>
      </li>
    `).join('');

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
    `;

    container.appendChild(card);
  });
}

export function setStatus(clubId, message) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}
