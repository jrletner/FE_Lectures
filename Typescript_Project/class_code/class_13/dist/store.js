import { Club } from "./models.js";
export let clubs = [];
export function setClubs(plainArray) {
    clubs.splice(0, clubs.length, ...plainArray.map(Club.fromPlain));
}
export function addClub(name, capacity) {
    clubs.push(new Club(name, capacity));
}
export function findClubById(id) {
    return clubs.find((c) => c.id === id);
}
export function toPlainArray(currentClubs) {
    return currentClubs.map((c) => c.toPlain());
}
