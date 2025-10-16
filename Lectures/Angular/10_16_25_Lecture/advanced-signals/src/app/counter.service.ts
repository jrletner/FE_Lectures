import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  count = signal(0);
  inc() {
    this.count.update((v) => v + 1);
  }
  dec() {
    this.count.update((v) => v - 1);
  }
  reset() {
    this.count.set(0);
  }
}
