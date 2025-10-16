import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-signal-counter',
  standalone: true,
  templateUrl: './signal-counter.component.html',
  styleUrl: './signal-counter.component.css',
})
export class SignalCounterComponent {
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
