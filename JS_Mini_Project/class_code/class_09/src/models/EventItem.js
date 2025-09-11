// src/models/EventItem.js
import { nanoid, dayjs } from '../utils/externals.js';

export class EventItem {
  constructor(title, dateISO, description = "", capacity = 100) {
    this.id = nanoid();
    this.title = title;
    this.dateISO = dateISO; // "YYYY-MM-DD"
    this.description = description;
    this.capacity = capacity;
    this.rsvps = new Set(); // member IDs
  }

  get date() {
    return dayjs(this.dateISO);
  }

  get isPast() {
    return this.date.isBefore(dayjs(), 'day');
  }

  // Human-friendly date like "Sep 10, 2025 (in 12 days)"
  get friendlyWhen() {
    const fmt = this.date.format('MMM D, YYYY');
    const rel = this.date.from(dayjs(), true); // "12 days"
    const suffix = this.isPast ? `${rel} ago` : `in ${rel}`;
    return `${fmt} (${suffix})`;
  }

  toggleRsvp(memberId) {
    if (this.rsvps.has(memberId)) this.rsvps.delete(memberId);
    else if (this.rsvps.size < this.capacity) this.rsvps.add(memberId);
  }
}
