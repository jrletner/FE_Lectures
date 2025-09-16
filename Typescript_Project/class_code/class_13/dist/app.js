import { clubs, setClubs, addClub, findClubById, toPlainArray, } from "./store.js";
import { ui as UIState, getVisibleClubs } from "./filters.js";
import { renderClubs, setStatus, renderClubDetail } from "./ui.js";
import { saveState, clearState, loadState } from "./persist.js";
import { parseHash, goHome } from "./router.js";
import { loadClubsFromServer, saveClubsToServer } from "./api.js";
// Footer year
document.getElementById("year").textContent = String(new Date().getFullYear());
// Status helpers
const statusEl = document.getElementById("global-status");
function setGlobalStatus(msg, kind = "") {
    statusEl.textContent = msg;
    statusEl.className = "status " + kind;
}
function clearGlobalStatus() {
    setGlobalStatus("");
}
function setRouteChrome(route) {
    const homeOnly = document.querySelectorAll(".route-only.home");
    homeOnly.forEach((el) => route.view === "home"
        ? el.classList.remove("hidden")
        : el.classList.add("hidden"));
    const crumb = document.getElementById("crumb-current");
    crumb.textContent = route.view === "home" ? "" : crumb.textContent;
}
function paint() {
    const route = parseHash();
    setRouteChrome(route);
    if (route.view === "club") {
        const club = findClubById(route.id);
        if (!club) {
            goHome();
            return;
        }
        renderClubDetail(club);
    }
    else {
        const visible = getVisibleClubs(clubs);
        renderClubs(visible);
    }
}
async function bootstrap() {
    const saved = loadState();
    if (!saved) {
        try {
            setGlobalStatus("Loading starter data from server…", "loading");
            const serverClubs = await loadClubsFromServer();
            setClubs(serverClubs);
            saveState(clubs);
            setGlobalStatus("Loaded from server.", "success");
        }
        catch (err) {
            console.error(err);
            setGlobalStatus("Server load failed — using built‑in data.", "error");
            // If you want, you could set a tiny fallback seed here
            // For simplicity we keep clubs as [] and let the user add
        }
        finally {
            setTimeout(clearGlobalStatus, 1000);
        }
    }
    else {
        setClubs(saved);
    }
    paint();
}
const appRoot = document.getElementById("app-root");
appRoot.addEventListener("click", (e) => {
    const target = e.target;
    const btn = target?.closest("[data-action]");
    if (!btn)
        return;
    const action = btn.dataset.action;
    const clubId = btn.dataset.clubId;
    const club = clubId ? findClubById(clubId) : undefined;
    if (!club)
        return;
    if (action === "add-member") {
        const input = document.getElementById(`member-name-${clubId}`);
        const name = (input?.value || "").trim();
        if (name === "") {
            setStatus(clubId, "Please enter a member name.");
            return;
        }
        const result = club.addMember(name);
        if (!result.ok) {
            const msg = result.reason === "full"
                ? "Club is at capacity."
                : result.reason === "duplicate"
                    ? "Member name already exists."
                    : "Invalid member name.";
            setStatus(clubId, msg);
            return;
        }
        setStatus(clubId, "Member added.");
        saveState(clubs);
        paint();
    }
    if (action === "remove-member") {
        const memberId = btn.dataset.memberId;
        if (!memberId)
            return;
        club.removeMember(memberId);
        saveState(clubs);
        paint();
    }
    if (action === "add-event") {
        const titleEl = document.getElementById(`event-title-${clubId}`);
        const dateEl = document.getElementById(`event-date-${clubId}`);
        const capEl = document.getElementById(`event-capacity-${clubId}`);
        const descEl = document.getElementById(`event-desc-${clubId}`);
        const title = (titleEl?.value || "").trim();
        const dateISO = (dateEl?.value || "").trim();
        const cap = parseInt(capEl?.value || "0", 10);
        const desc = (descEl?.value || "").trim();
        if (!title || !dateISO || isNaN(cap) || cap <= 0) {
            setStatus(clubId, "Enter a title, date, and capacity (>0).");
            return;
        }
        const added = club.addEvent({
            title,
            dateISO,
            description: desc,
            capacity: cap,
        });
        if (!added.ok) {
            setStatus(clubId, added.reason === "invalid-date"
                ? "Please pick a valid date."
                : "Could not add event.");
            return;
        }
        setStatus(clubId, "Event added.");
        saveState(clubs);
        paint();
    }
    if (action === "remove-event") {
        const eventId = btn.dataset.eventId;
        if (!eventId)
            return;
        club.removeEvent(eventId);
        saveState(clubs);
        paint();
    }
});
document.getElementById("club-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("club-name");
    const capacityInput = document.getElementById("club-capacity");
    const errorMessage = document.getElementById("error-message");
    const name = nameInput.value.trim();
    const capacity = parseInt(capacityInput.value, 10);
    if (name === "" || isNaN(capacity) || capacity <= 0) {
        errorMessage.textContent =
            "Please enter a valid club name and capacity (min 1).";
        return;
    }
    const exists = clubs.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        errorMessage.textContent = "A club with this name already exists.";
        return;
    }
    errorMessage.textContent = "";
    addClub(name, capacity);
    saveState(clubs);
    paint();
    nameInput.value = "";
    capacityInput.value = "";
    nameInput.focus();
});
const onSearchInput = (value) => {
    UIState.searchText = value;
    paint();
};
document.getElementById("search").addEventListener("input", (e) => onSearchInput(e.target.value));
document.getElementById("only-open").addEventListener("change", (e) => {
    UIState.onlyOpen = e.target.checked;
    paint();
});
document.getElementById("sort-by").addEventListener("change", (e) => {
    UIState.sortBy = e.target.value;
    paint();
});
const exportBtn = document.getElementById("export-json");
const importBtn = document.getElementById("import-json");
const importFile = document.getElementById("import-file");
const resetBtn = document.getElementById("reset-data");
exportBtn.addEventListener("click", () => {
    const data = toPlainArray(clubs);
    const text = JSON.stringify(data, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campus-club-manager-data.json";
    a.click();
    URL.revokeObjectURL(url);
});
importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file)
        return;
    try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed))
            throw new Error("Invalid JSON format");
        setClubs(parsed);
        saveState(clubs);
        paint();
        alert("Import complete!");
    }
    catch (err) {
        console.error(err);
        alert("Import failed: " + (err?.message || String(err)));
    }
    finally {
        importFile.value = "";
    }
});
resetBtn.addEventListener("click", () => {
    if (!confirm("Reset data to the default seed? This will erase your saved changes."))
        return;
    clearState();
    location.reload();
});
document.getElementById("reload-server").addEventListener("click", async () => {
    try {
        setGlobalStatus("Loading from server…", "loading");
        const serverClubs = await loadClubsFromServer();
        setClubs(serverClubs);
        saveState(clubs);
        paint();
        setGlobalStatus("Loaded from server.", "success");
    }
    catch (err) {
        console.error(err);
        setGlobalStatus("Server load failed. Check console.", "error");
    }
    finally {
        setTimeout(clearGlobalStatus, 1000);
    }
});
document.getElementById("save-server").addEventListener("click", async () => {
    try {
        setGlobalStatus("Saving to server…", "loading");
        const payload = toPlainArray(clubs);
        const res = await saveClubsToServer(payload);
        setGlobalStatus(`Saved ${res.count} items at ${new Date(res.savedAt).toLocaleTimeString()}.`, "success");
    }
    catch (err) {
        console.error(err);
        setGlobalStatus(err.message || "Server save failed.", "error");
    }
    finally {
        setTimeout(clearGlobalStatus, 1200);
    }
});
window.addEventListener("hashchange", paint);
window.addEventListener("load", bootstrap);
