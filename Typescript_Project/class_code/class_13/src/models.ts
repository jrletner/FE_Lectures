// Beginner-friendly domain models with simple types
export type Id = string;

export class Member {
  constructor(
    public name: string,
    public role: "member" | "leader" = "member",
    public id: Id = crypto.randomUUID()
  ) {}
  toPlain() {
    return { id: this.id, name: this.name, role: this.role };
  }
  static fromPlain(obj: { id?: Id; name: string; role?: "member" | "leader" }) {
    return new Member(
      obj.name,
      obj.role ?? "member",
      obj.id ?? crypto.randomUUID()
    );
  }
}

export class EventItem {
  public rsvps: Set<Id> = new Set();
  constructor(
    public title: string,
    public dateISO: string,
    public description: string = "",
    public capacity: number = 100,
    public id: Id = crypto.randomUUID()
  ) {}
  get date() {
    return new Date(this.dateISO);
  }
  get isPast() {
    const now = new Date();
    return (
      this.date.getTime() <
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    );
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
  static fromPlain(obj: any) {
    const e = new EventItem(
      obj.title,
      obj.dateISO,
      obj.description ?? "",
      obj.capacity ?? 100,
      obj.id ?? crypto.randomUUID()
    );
    e.rsvps = new Set(Array.isArray(obj.rsvps) ? obj.rsvps : []);
    return e;
  }
}

export class Club {
  public members: Member[] = [];
  public events: EventItem[] = [];
  constructor(
    public name: string,
    public capacity: number = 1,
    public id: Id = crypto.randomUUID()
  ) {}

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

  addMember(name: string, role: "member" | "leader" = "member") {
    if (!name.trim())
      return { ok: false as const, reason: "invalid-name" as const };
    if (this.seatsLeft <= 0)
      return { ok: false as const, reason: "full" as const };
    if (this.members.some((m) => m.name.toLowerCase() === name.toLowerCase()))
      return { ok: false as const, reason: "duplicate" as const };
    const m = new Member(name, role);
    this.members.push(m);
    return { ok: true as const, member: m };
  }
  removeMember(memberId: Id) {
    const i = this.members.findIndex((m) => m.id === memberId);
    if (i >= 0) {
      this.members.splice(i, 1);
      return true;
    }
    return false;
  }

  addEvent({
    title,
    dateISO,
    description = "",
    capacity = 100,
  }: {
    title: string;
    dateISO: string;
    description?: string;
    capacity?: number;
  }) {
    const d = new Date(dateISO);
    if (isNaN(d.getTime()))
      return { ok: false as const, reason: "invalid-date" as const };
    const evt = new EventItem(title, dateISO, description, capacity);
    this.events.push(evt);
    this.sortEvents();
    return { ok: true as const, event: evt };
  }
  removeEvent(eventId: Id) {
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
  static fromPlain(obj: any) {
    const c = new Club(obj.name, obj.capacity, obj.id ?? crypto.randomUUID());
    (obj.members ?? []).forEach((m: any) =>
      c.members.push(Member.fromPlain(m))
    );
    (obj.events ?? []).forEach((e: any) =>
      c.events.push(EventItem.fromPlain(e))
    );
    if (!obj.members && typeof obj.current === "number") {
      for (let i = 0; i < obj.current; i++) c.addMember(`Member ${i + 1}`);
    }
    c.sortEvents();
    return c;
  }
}
