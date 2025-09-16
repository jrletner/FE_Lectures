export const ui = {
    searchText: "",
    onlyOpen: false,
    sortBy: "name-asc",
};
export function getVisibleClubs(all) {
    let list = all.slice();
    const q = ui.searchText.trim().toLowerCase();
    if (q)
        list = list.filter((c) => c.name.toLowerCase().includes(q));
    if (ui.onlyOpen)
        list = list.filter((c) => c.seatsLeft > 0);
    list.sort((a, b) => {
        switch (ui.sortBy) {
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "seats-desc":
                return b.seatsLeft - a.seatsLeft;
            case "capacity-desc":
                return b.capacity - a.capacity;
        }
    });
    return list;
}
