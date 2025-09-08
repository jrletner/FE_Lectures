// src/store/data.js
import { Club } from '../models/Club.js';

export let clubs = [
  Club.fromPlain({ name: "Coding Club", current: 3, capacity: 10 }),
  Club.fromPlain({ name: "Art Club",    current: 8, capacity: 8 }),   // full
  Club.fromPlain({ name: "Book Club",   current: 2, capacity: 12 }),
  Club.fromPlain({ name: "Robotics",    current: 5, capacity: 6 }),
];

export function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
}

export function findClubById(id) {
  return clubs.find(c => c.id === id);
}
