// src/services/api.js
// Simulated server API using local files and artificial latency.
// Requires serving over HTTP to fetch ./data/seed.json

const SEED_URL = './data/seed.json';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function loadClubsFromServer() {
  // Simulate network latency
  await delay(600);
  const res = await fetch(SEED_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load from server: ' + res.status);
  return res.json(); // returns plain array
}

export async function saveClubsToServer(plainArray) {
  // Simulate save: latency + random small failure rate
  await delay(600);
  const fail = Math.random() < 0.1; // 10% chance
  if (fail) throw new Error('Temporary server error. Try again.');
  // In a real app, we'd POST to an endpoint. Here we just resolve.
  return { ok: true, savedAt: new Date().toISOString(), count: Array.isArray(plainArray) ? plainArray.length : 0 };
}
