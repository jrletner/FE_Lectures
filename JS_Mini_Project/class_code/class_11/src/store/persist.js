// src/store/persist.js
const STORAGE_KEY = 'ccm:v1';
export function saveState(clubs) {
  try { const plain = clubs.map(c => (typeof c.toPlain === 'function' ? c.toPlain() : c)); localStorage.setItem(STORAGE_KEY, JSON.stringify(plain)); }
  catch (e) { console.error('Failed to save:', e); }
}
export function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return null; return JSON.parse(raw); }
  catch (e) { console.error('Failed to load:', e); return null; }
}
export function clearState() { try { localStorage.removeItem(STORAGE_KEY); } catch (e) { console.error('Failed to clear:', e); } }
