import {
  clubs,
  setClubs,
  addClub,
  findClubById,
  toPlainArray,
} from "./store.js";
import { ui as UIState, getVisibleClubs } from "./filters.js";
import { renderClubs, setStatus, renderClubDetail } from "./ui.js";
import { saveState, clearState, loadState, loadStateRaw } from "./persist.js";
import { parseHash, goHome } from "./router.js";
import { loadClubsFromServer, saveClubsToServer } from "./api.js";

// Footer year
(document.getElementById("year") as HTMLElement).textContent = String(
  new Date().getFullYear()
);

// Status helpers
const statusEl = document.getElementById("global-status") as HTMLElement;
function setGlobalStatus(
  msg: string,
  kind: "" | "loading" | "error" | "success" = ""
) {
  statusEl.textContent = msg;
  statusEl.className = "status " + kind;
}
function clearGlobalStatus() {
  setGlobalStatus("");
}

function setRouteChrome(route: ReturnType<typeof parseHash>) {
  const homeOnly = document.querySelectorAll(".route-only.home");
  homeOnly.forEach((el) =>
    route.view === "home"
      ? el.classList.remove("hidden")
      : el.classList.add("hidden")
  );
  const crumb = document.getElementById("crumb-current") as HTMLElement;
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
  } else {
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
      setClubs(serverClubs as any);
      saveState(clubs as any);
      setGlobalStatus("Loaded from server.", "success");
    } catch (err) {
      console.error(err);
      setGlobalStatus("Server load failed — using built‑in data.", "error");
      // If you want, you could set a tiny fallback seed here
      // For simplicity we keep clubs as [] and let the user add
    } finally {
      setTimeout(clearGlobalStatus, 1000);
    }
  } else {
    setClubs(saved as any);
  }
  paint();
}

const appRoot = document.getElementById("app-root") as HTMLElement;
appRoot.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null;
  const btn = target?.closest("[data-action]") as HTMLElement | null;
  if (!btn) return;
  const action = btn.dataset.action as string | undefined;
  const clubId = btn.dataset.clubId as string | undefined;
  const club = clubId ? findClubById(clubId) : undefined;
  if (!club) return;

  if (action === "add-member") {
    const input = document.getElementById(
      `member-name-${clubId}`
    ) as HTMLInputElement | null;
    const name = (input?.value || "").trim();
    if (name === "") {
      setStatus(clubId!, "Please enter a member name.");
      return;
    }
    const result = club.addMember(name);
    if (!result.ok) {
      const msg =
        result.reason === "full"
          ? "Club is at capacity."
          : result.reason === "duplicate"
          ? "Member name already exists."
          : "Invalid member name.";
      setStatus(clubId!, msg);
      return;
    }
    setStatus(clubId!, "Member added.");
    saveState(clubs as any);
    paint();
  }

  if (action === "remove-member") {
    const memberId = btn.dataset.memberId as string | undefined;
    if (!memberId) return;
    club.removeMember(memberId);
    saveState(clubs as any);
    paint();
  }

  if (action === "add-event") {
    const titleEl = document.getElementById(
      `event-title-${clubId}`
    ) as HTMLInputElement | null;
    const dateEl = document.getElementById(
      `event-date-${clubId}`
    ) as HTMLInputElement | null;
    const capEl = document.getElementById(
      `event-capacity-${clubId}`
    ) as HTMLInputElement | null;
    const descEl = document.getElementById(
      `event-desc-${clubId}`
    ) as HTMLInputElement | null;

    const title = (titleEl?.value || "").trim();
    const dateISO = (dateEl?.value || "").trim();
    const cap = parseInt(capEl?.value || "0", 10);
    const desc = (descEl?.value || "").trim();

    if (!title || !dateISO || isNaN(cap) || cap <= 0) {
      setStatus(clubId!, "Enter a title, date, and capacity (>0).");
      return;
    }

    const added = club.addEvent({
      title,
      dateISO,
      description: desc,
      capacity: cap,
    });
    if (!added.ok) {
      setStatus(
        clubId!,
        added.reason === "invalid-date"
          ? "Please pick a valid date."
          : "Could not add event."
      );
      return;
    }

    setStatus(clubId!, "Event added.");
    saveState(clubs as any);
    paint();
  }

  if (action === "remove-event") {
    const eventId = btn.dataset.eventId as string | undefined;
    if (!eventId) return;
    club.removeEvent(eventId);
    saveState(clubs as any);
    paint();
  }
});

(document.getElementById("club-form") as HTMLFormElement).addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("club-name") as HTMLInputElement;
    const capacityInput = document.getElementById(
      "club-capacity"
    ) as HTMLInputElement;
    const errorMessage = document.getElementById(
      "error-message"
    ) as HTMLElement;

    const name = nameInput.value.trim();
    const capacity = parseInt(capacityInput.value, 10);
    if (name === "" || isNaN(capacity) || capacity <= 0) {
      errorMessage.textContent =
        "Please enter a valid club name and capacity (min 1).";
      return;
    }
    const exists = clubs.some(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      errorMessage.textContent = "A club with this name already exists.";
      return;
    }

    errorMessage.textContent = "";
    addClub(name, capacity);
    saveState(clubs as any);
    paint();

    nameInput.value = "";
    capacityInput.value = "";
    nameInput.focus();
  }
);

const onSearchInput = (value: string) => {
  UIState.searchText = value;
  paint();
};
(document.getElementById("search") as HTMLInputElement).addEventListener(
  "input",
  (e) => onSearchInput((e.target as HTMLInputElement).value)
);
(document.getElementById("only-open") as HTMLInputElement).addEventListener(
  "change",
  (e) => {
    UIState.onlyOpen = (e.target as HTMLInputElement).checked;
    paint();
  }
);
(document.getElementById("sort-by") as HTMLSelectElement).addEventListener(
  "change",
  (e) => {
    UIState.sortBy = (e.target as HTMLSelectElement).value as any;
    paint();
  }
);

const exportBtn = document.getElementById("export-json") as HTMLButtonElement;
const importBtn = document.getElementById("import-json") as HTMLButtonElement;
const importFile = document.getElementById("import-file") as HTMLInputElement;
const resetBtn = document.getElementById("reset-data") as HTMLButtonElement;

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
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Invalid JSON format");
    setClubs(parsed);
    saveState(clubs as any);
    paint();
    alert("Import complete!");
  } catch (err: any) {
    console.error(err);
    alert("Import failed: " + (err?.message || String(err)));
  } finally {
    importFile.value = "";
  }
});
resetBtn.addEventListener("click", () => {
  if (
    !confirm(
      "Reset data to the default seed? This will erase your saved changes."
    )
  )
    return;
  clearState();
  location.reload();
});

(
  document.getElementById("reload-server") as HTMLButtonElement
).addEventListener("click", async () => {
  try {
    setGlobalStatus("Loading from server…", "loading");
    const serverClubs = await loadClubsFromServer();
    setClubs(serverClubs as any);
    saveState(clubs as any);
    paint();
    setGlobalStatus("Loaded from server.", "success");
  } catch (err) {
    console.error(err);
    setGlobalStatus("Server load failed. Check console.", "error");
  } finally {
    setTimeout(clearGlobalStatus, 1000);
  }
});

(document.getElementById("save-server") as HTMLButtonElement).addEventListener(
  "click",
  async () => {
    try {
      setGlobalStatus("Saving to server…", "loading");
      const payload = toPlainArray(clubs);
      const res = await saveClubsToServer(payload);
      setGlobalStatus(
        `Saved ${res.count} items at ${new Date(
          res.savedAt
        ).toLocaleTimeString()}.`,
        "success"
      );
    } catch (err: any) {
      console.error(err);
      setGlobalStatus(err.message || "Server save failed.", "error");
    } finally {
      setTimeout(clearGlobalStatus, 1200);
    }
  }
);

window.addEventListener("hashchange", paint);
window.addEventListener("load", bootstrap);
