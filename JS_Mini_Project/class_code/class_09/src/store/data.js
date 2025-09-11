// src/store/data.js
import { Club } from '../models/Club.js';

// Seed with a couple of upcoming events using ISO dates
export let clubs = [
  Club.fromPlain({
    name: "Coding Club", current: 3, capacity: 10,
    events: [
      { title: "Hack Night", dateISO: "2025-09-10", description: "Bring a project.", capacity: 30 },
      { title: "Intro to Git", dateISO: "2025-09-03", description: "Hands-on basics." }
    ]
  }),
  Club.fromPlain({
    name: "Art Club", current: 8, capacity: 8,
    events: [
      { title: "Open Studio", dateISO: "2025-08-30" }
    ]
  }),
  Club.fromPlain({ name: "Book Club", current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics", current: 5, capacity: 6 }),
];

export function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
}

export function findClubById(id) {
  return clubs.find(c => c.id === id);
}
