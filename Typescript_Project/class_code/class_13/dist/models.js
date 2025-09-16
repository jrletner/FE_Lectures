export class Member {
    constructor(name, role = "member", id = crypto.randomUUID()) {
        this.name = name;
        this.role = role;
        this.id = id;
    }
    toPlain() {
        return { id: this.id, name: this.name, role: this.role };
    }
    static fromPlain(obj) {
        return new Member(obj.name, obj.role ?? "member", obj.id ?? crypto.randomUUID());
    }
}
export class EventItem {
    constructor(title, dateISO, description = "", capacity = 100, id = crypto.randomUUID()) {
        this.title = title;
        this.dateISO = dateISO;
        this.description = description;
        this.capacity = capacity;
        this.id = id;
        this.rsvps = new Set();
    }
    get date() {
        return new Date(this.dateISO);
    }
    get isPast() {
        const now = new Date();
        return (this.date.getTime() <
            new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime());
    }
    get friendlyWhen() {
        return this.date.toLocaleDateString();
    }
    toPlain() {
        return {
            id: this.id,
            title: this.title,
            dateISO: this.dateISO,
            description: this.description,
            capacity: this.capacity,
            rsvps: Array.from(this.rsvps),
        };
    }
    static fromPlain(obj) {
        const e = new EventItem(obj.title, obj.dateISO, obj.description ?? "", obj.capacity ?? 100, obj.id ?? crypto.randomUUID());
        e.rsvps = new Set(Array.isArray(obj.rsvps) ? obj.rsvps : []);
        return e;
    }
}
export class Club {
    constructor(name, capacity = 1, id = crypto.randomUUID()) {
        this.name = name;
        this.capacity = capacity;
        this.id = id;
        this.members = [];
        this.events = [];
    }
    get current() {
        return this.members.length;
    }
    get seatsLeft() {
        return Math.max(0, this.capacity - this.current);
    }
    get percentFull() {
        return this.capacity > 0
            ? Math.round((this.current / this.capacity) * 100)
            : 0;
    }
    addMember(name, role = "member") {
        if (!name.trim())
            return { ok: false, reason: "invalid-name" };
        if (this.seatsLeft <= 0)
            return { ok: false, reason: "full" };
        if (this.members.some((m) => m.name.toLowerCase() === name.toLowerCase()))
            return { ok: false, reason: "duplicate" };
        const m = new Member(name, role);
        this.members.push(m);
        return { ok: true, member: m };
    }
    removeMember(memberId) {
        const i = this.members.findIndex((m) => m.id === memberId);
        if (i >= 0) {
            this.members.splice(i, 1);
            return true;
        }
        return false;
    }
    addEvent({ title, dateISO, description = "", capacity = 100, }) {
        const d = new Date(dateISO);
        if (isNaN(d.getTime()))
            return { ok: false, reason: "invalid-date" };
        const evt = new EventItem(title, dateISO, description, capacity);
        this.events.push(evt);
        this.sortEvents();
        return { ok: true, event: evt };
    }
    removeEvent(eventId) {
        const i = this.events.findIndex((e) => e.id === eventId);
        if (i >= 0) {
            this.events.splice(i, 1);
            return true;
        }
        return false;
    }
    sortEvents() {
        this.events.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    upcomingEvents() {
        return this.events
            .filter((e) => !e.isPast)
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    toPlain() {
        return {
            id: this.id,
            name: this.name,
            capacity: this.capacity,
            members: this.members.map((m) => m.toPlain()),
            events: this.events.map((e) => e.toPlain()),
        };
    }
    static fromPlain(obj) {
        const c = new Club(obj.name, obj.capacity, obj.id ?? crypto.randomUUID());
        (obj.members ?? []).forEach((m) => c.members.push(Member.fromPlain(m)));
        (obj.events ?? []).forEach((e) => c.events.push(EventItem.fromPlain(e)));
        if (!obj.members && typeof obj.current === "number") {
            for (let i = 0; i < obj.current; i++)
                c.addMember(`Member ${i + 1}`);
        }
        c.sortEvents();
        return c;
    }
}
