// src/models/EventItem.js
let __id = 1;
function makeId(prefix) { return `${prefix}_${__id++}`; }

export class EventItem {
  constructor(title, dateStr, description = "", capacity = 100) {
    this.id = makeId("e");
    this.title = title;
    this.date = new Date(dateStr);
    this.description = description;
    this.capacity = capacity;
    this.rsvps = new Set();
  }
  toggleRsvp(memberId) {
    if (this.rsvps.has(memberId)) this.rsvps.delete(memberId);
    else if (this.rsvps.size < this.capacity) this.rsvps.add(memberId);
  }
}
