import { Club } from "./models.js";

export let clubs: Club[] = [];

export function setClubs(plainArray: any[]) {
  clubs.splice(0, clubs.length, ...plainArray.map(Club.fromPlain));
}
export function addClub(name: string, capacity: number) {
  clubs.push(new Club(name, capacity));
}
export function findClubById(id: string) {
  return clubs.find((c) => c.id === id);
}
export function toPlainArray(currentClubs: Club[]) {
  return currentClubs.map((c) => c.toPlain());
}
