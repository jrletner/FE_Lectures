const SEED_URL = "./data/seed.json";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
export async function loadClubsFromServer() {
    await delay(400);
    const res = await fetch(SEED_URL, { cache: "no-store" });
    if (!res.ok)
        throw new Error("Failed to load from server: " + res.status);
    return res.json();
}
export async function saveClubsToServer(plainArray) {
    await delay(400);
    if (Math.random() < 0.1)
        throw new Error("Temporary server error. Try again.");
    return {
        ok: true,
        savedAt: new Date().toISOString(),
        count: Array.isArray(plainArray) ? plainArray.length : 0,
    };
}
