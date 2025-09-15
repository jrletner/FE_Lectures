// src/models/Member.js
import { nanoid } from '../utils/externals.js';

export class Member {
  constructor(name, role = "member", id = nanoid()) {
    this.id = id;
    this.name = name;
    this.role = role;
  }
  toPlain() {
    return { id: this.id, name: this.name, role: this.role };
  }
  static fromPlain(obj) {
    return new Member(obj.name, obj.role || "member", obj.id);
  }
}
