// src/models/EventItem.js
import { nanoid, dayjs } from '../utils/externals.js';

export class EventItem {
  constructor(title, dateISO, description = "", capacity = 100, id = nanoid()) {
    this.id = id;
    this.title = title;
    this.dateISO = dateISO; // "YYYY-MM-DD"
    this.description = description;
    this.capacity = capacity;
    this.rsvps = Array.isArray(this.rsvps) ? new Set(this.rsvps) : new Set(); // ensure Set
  }

  get date() {
    return dayjs(this.dateISO);
  }

  get isPast() {
    return this.date.isBefore(dayjs(), 'day');
  }

  get friendlyWhen() {
    const fmt = this.date.format('MMM D, YYYY');
    const rel = this.date.from(dayjs(), true);
    const suffix = this.isPast ? `${rel} ago` : `in ${rel}`;
    return `${fmt} (${suffix})`;
  }

  toPlain() {
    return {
      id: this.id,
      title: this.title,
      dateISO: this.dateISO,
      description: this.description,
      capacity: this.capacity,
      rsvps: Array.from(this.rsvps),
    };
  }

  static fromPlain(obj) {
    const evt = new EventItem(obj.title, obj.dateISO, obj.description || "", obj.capacity || 100, obj.id);
    // restore RSVPs as Set
    evt.rsvps = new Set(Array.isArray(obj.rsvps) ? obj.rsvps : []);
    return evt;
  }
}
