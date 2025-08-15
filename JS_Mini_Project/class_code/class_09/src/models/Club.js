// src/models/Club.js
import { nanoid, dayjs } from '../utils/externals.js';
import { Member } from './Member.js';
import { EventItem } from './EventItem.js';

export class Club {
  constructor(name, capacity = 1) {
    this.id = nanoid();
    this.name = name;
    this.capacity = capacity;
    this.members = []; // Member[]
    this.events = [];  // EventItem[]
  }

  // ---- Derived ----
  get current()     { return this.members.length; }
  get seatsLeft()   { return Math.max(0, this.capacity - this.current); }
  get percentFull() { return this.capacity > 0 ? Math.round((this.current / this.capacity) * 100) : 0; }

  // ---- Members ----
  addMember(name, role = "member") {
    if (!name || typeof name !== "string") return { ok: false, reason: "invalid-name" };
    if (this.seatsLeft <= 0)              return { ok: false, reason: "full" };
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

  // ---- Events ----
  addEvent({ title, dateISO, description = "", capacity = 100 }) {
    const d = dayjs(dateISO);
    if (!d.isValid()) return { ok: false, reason: 'invalid-date' };
    // Allow same-day events; block obviously bad dates if needed
    const evt = new EventItem(title, dateISO, description, capacity);
    this.events.push(evt);
    this.sortEvents();
    return { ok: true, event: evt };
  }

  removeEvent(eventId) {
    const i = this.events.findIndex(e => e.id === eventId);
    if (i >= 0) { this.events.splice(i, 1); return true; }
    return false;
  }

  sortEvents() {
    this.events.sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }

  upcomingEvents() {
    const now = dayjs();
    return this.events.filter(e => !e.isPast).sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }

  // Migration helper from plain objects
  static fromPlain(obj) {
    const c = new Club(obj.name, obj.capacity);
    for (let i = 0; i < (obj.current || 0); i++) c.addMember(`Member ${i + 1}`);
    // Optional: port events if provided
    (obj.events || []).forEach(e =>
      c.addEvent({ title: e.title, dateISO: e.dateISO, description: e.description || "", capacity: e.capacity || 100 })
    );
    return c;
  }
}
