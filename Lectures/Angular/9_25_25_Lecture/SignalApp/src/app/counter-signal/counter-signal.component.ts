import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-counter-signal',
  imports: [],
  templateUrl: './counter-signal.component.html',
  styleUrl: './counter-signal.component.css',
})
export class CounterSignalComponent {
  count = signal(0);

  inc() {
    this.count.update((c) => c + 1);
  }

  dec() {
    this.count.update((c) => c - 1);
  }

  reset() {
    this.count.set(0);
  }
}
