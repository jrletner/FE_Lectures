import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CounterService } from '../../../counter.service';
import { CounterChild2Component } from '../counter-child2/counter-child2.component';

@Component({
  selector: 'app-counter-child',
  imports: [CounterChild2Component],
  templateUrl: './counter-child.component.html',
  styleUrl: './counter-child.component.css',
})
export class CounterChildComponent {
  // @Input() count = 0;
  // @Output() increment = new EventEmitter<number>();
  // inc() {
  //   this.increment.emit(this.count + 1);
  // }
  // SERVICE

  counter = inject(CounterService);
  readonly count = this.counter.count;

  inc(): void {
    this.counter.increment();
  }

  resetInc(): void {
    this.counter.reset();
  }
}
