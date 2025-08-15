// src/store/data.js
import { Club } from '../models/Club.js';
import { loadState } from './persist.js';

// Default seed (used if no saved state exists)
const defaultSeed = [
  Club.fromPlain({
    name: "Coding Club", capacity: 10,
    members: [{ name: "Ava" }, { name: "Ben" }, { name: "Kai" }],
    events: [
      { title: "Hack Night", dateISO: "2025-09-10", description: "Bring a project.", capacity: 30 },
      { title: "Intro to Git", dateISO: "2025-09-03", description: "Hands-on basics." }
    ]
  }),
  Club.fromPlain({
    name: "Art Club", capacity: 8,
    members: [{ name: "Riley" }, { name: "Sam" }, { name: "Noah" }, { name: "Maya" }, { name: "Ivy" }, { name: "Leo" }, { name: "Zoe" }, { name: "Owen" }],
    events: [{ title: "Open Studio", dateISO: "2025-08-30" }]
  }),
  Club.fromPlain({ name: "Book Club", capacity: 12, members: [{ name: "Elle" }, { name: "Quinn" }] }),
  Club.fromPlain({ name: "Robotics", capacity: 6, members: [{ name: "Jo" }, { name: "Pat" }, { name: "Max" }, { name: "Ada" }, { name: "Ray" }] }),
];

// Initialize from saved state if present
const saved = loadState();
export let clubs = Array.isArray(saved) ? saved.map(Club.fromPlain) : defaultSeed;

// Helpers
export function setClubs(plainArray) {
  clubs.splice(0, clubs.length, ...plainArray.map(Club.fromPlain));
}

export function addClub(name, capacity) {
  clubs.push(new Club(name, capacity));
}

export function findClubById(id) {
  return clubs.find(c => c.id === id);
}

export function toPlainArray(currentClubs) {
  return currentClubs.map(c => c.toPlain());
}
