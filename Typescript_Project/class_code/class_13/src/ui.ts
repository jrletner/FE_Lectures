import type { Club } from "./models.js";

export function renderClubs(visibleClubs: Club[]) {
  const container = document.getElementById("app-root") as HTMLElement;
  container.innerHTML = "";

  if (visibleClubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs match your filters.";
    container.appendChild(p);
    return;
  }

  visibleClubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    card.dataset.clubId = club.id;

    const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

    const membersHtml = club.members
      .map(
        (m) => `
      <li>${m.name}
        <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
      </li>
    `
      )
      .join("");

    const todayISO = new Date().toISOString().slice(0, 10);

    card.innerHTML = `
      <div><strong><a href="#/club/${club.id}">${
      club.name
    }</a></strong><br>${stats}</div>

      <div class="member-section">
        <h4>Members (${club.current})</h4>
        <ul class="member-list">
          ${membersHtml || "<li><em>No members yet</em></li>"}
        </ul>

        <div class="inline-form">
          <input id="member-name-${
            club.id
          }" type="text" placeholder="e.g., Jordan" />
          <button class="btn" data-action="add-member" data-club-id="${
            club.id
          }">Add Member</button>
          <span id="status-${club.id}" class="note"></span>
        </div>
      </div>

      <div class="event-section">
        <h4>Quick Add Event</h4>
        <div class="inline-form">
          <input id="event-title-${
            club.id
          }" type="text" placeholder="Event title" />
          <input id="event-date-${club.id}" type="date" min="${todayISO}" />
          <input id="event-capacity-${
            club.id
          }" type="number" min="1" placeholder="Capacity" />
          <input id="event-desc-${
            club.id
          }" type="text" placeholder="Optional description" />
          <button class="btn" data-action="add-event" data-club-id="${
            club.id
          }">Add Event</button>
        </div>
        <p class="note"><a href="#/club/${
          club.id
        }">View details</a> to see full event list.</p>
      </div>
    `;

    container.appendChild(card);
  });
}

export function setStatus(clubId: string, message: string) {
  const el = document.getElementById(`status-${clubId}`);
  if (el) el.textContent = message;
}

export function renderClubDetail(club: Club) {
  const container = document.getElementById("app-root") as HTMLElement;
  container.innerHTML = "";

  (
    document.getElementById("crumb-current") as HTMLElement
  ).textContent = `› ${club.name}`;

  const card = document.createElement("div");
  card.className = "card";
  card.dataset.clubId = club.id;

  const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

  const membersHtml = club.members
    .map(
      (m) => `
    <li>${m.name}
      <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">Remove</button>
    </li>
  `
    )
    .join("");

  const eventsHtml = club.events
    .map((evt) => {
      const dateStr = new Date(evt.dateISO).toLocaleDateString();
      const pastBadge = evt.isPast ? '<span class="badge">Past</span>' : "";
      return `<li>
      <strong>${evt.title}</strong> — ${dateStr} ${pastBadge}
      <button class="link-btn" data-action="remove-event" data-club-id="${club.id}" data-event-id="${evt.id}">Remove</button>
    </li>`;
    })
    .join("");

  const todayISO = new Date().toISOString().slice(0, 10);

  card.innerHTML = `
    <div><strong>${club.name}</strong><br>${stats}</div>

    <div class="member-section">
      <h4>Members (${club.current})</h4>
      <ul class="member-list">${
        membersHtml || "<li><em>No members yet</em></li>"
      }</ul>
      <div class="inline-form">
        <input id="member-name-${
          club.id
        }" type="text" placeholder="e.g., Jordan" />
        <button class="btn" data-action="add-member" data-club-id="${
          club.id
        }">Add Member</button>
        <span id="status-${club.id}" class="note"></span>
      </div>
    </div>

    <div class="event-section">
      <h4>Events (${club.events.length})</h4>
      <ul class="event-list">${
        eventsHtml || "<li><em>No events yet</em></li>"
      }</ul>
      <div class="inline-form">
        <input id="event-title-${
          club.id
        }" type="text" placeholder="Event title" />
        <input id="event-date-${club.id}" type="date" min="${todayISO}" />
        <input id="event-capacity-${
          club.id
        }" type="number" min="1" placeholder="Capacity" />
        <input id="event-desc-${
          club.id
        }" type="text" placeholder="Optional description" />
        <button class="btn" data-action="add-event" data-club-id="${
          club.id
        }">Add Event</button>
      </div>
    </div>
  `;

  container.appendChild(card);
}
