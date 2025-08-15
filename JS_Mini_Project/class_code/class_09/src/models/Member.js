// src/models/Member.js
import { nanoid } from '../utils/externals.js';

export class Member {
  constructor(name, role = "member") {
    this.id = nanoid();
    this.name = name;
    this.role = role;
  }
}
