export type Route = { view: "home" } | { view: "club"; id: string };
export function parseHash(): Route {
  const raw = window.location.hash || "#/";
  const h = raw.startsWith("#") ? raw.slice(1) : raw;
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 0) return { view: "home" };
  if (parts[0] === "club" && parts[1]) return { view: "club", id: parts[1] };
  return { view: "home" };
}
export function goHome() {
  window.location.hash = "#/";
}
export function goClub(id: string) {
  window.location.hash = `#/club/${id}`;
}
