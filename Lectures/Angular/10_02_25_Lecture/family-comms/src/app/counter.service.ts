import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private _count = signal(0);
  count = this._count;

  increment(): void {
    this._count.update((c) => c + 1);
  }

  reset(): void {
    this._count.set(0);
  }
}
