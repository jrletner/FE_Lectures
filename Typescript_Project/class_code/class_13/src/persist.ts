const STORAGE_KEY = "ccm:v1";
export function saveState(clubs: any[]) {
  try {
    const plain = clubs.map((c) =>
      typeof (c as any).toPlain === "function" ? (c as any).toPlain() : c
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  } catch (e) {
    console.error("Failed to save:", e);
  }
}
export function loadStateRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
export function loadState() {
  try {
    const raw = loadStateRaw();
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load:", e);
    return null;
  }
}
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear state:", e);
  }
}
