// src/store/filters.js
import { pipe } from '../utils/pipe.js';

export const ui = { searchText: "", onlyOpen: false, sortBy: "name-asc" };

const applySearch = (list) => {
  const q = ui.searchText.trim().toLowerCase();
  if (!q) return list;
  return list.filter(c => c.name.toLowerCase().includes(q));
};
const applyOnlyOpen = (list) => ui.onlyOpen ? list.filter(c => c.seatsLeft > 0) : list;
const applySort = (list) => {
  const copy = list.slice();
  copy.sort((a, b) => {
    switch (ui.sortBy) {
      case "name-asc":      return a.name.localeCompare(b.name);
      case "name-desc":     return b.name.localeCompare(a.name);
      case "seats-desc":    return b.seatsLeft - a.seatsLeft;
      case "capacity-desc": return b.capacity - a.capacity;
      default:              return 0;
    }
  });
  return copy;
};

export const getVisibleClubs = pipe((arr) => arr.slice(), applySearch, applyOnlyOpen, applySort);
