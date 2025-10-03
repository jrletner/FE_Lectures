import { Component, inject } from '@angular/core';
import { CounterChildComponent } from '../counter-child/counter-child.component';
import { CounterService } from '../../../counter.service';

@Component({
  selector: 'app-counter-parent',
  imports: [CounterChildComponent],
  templateUrl: './counter-parent.component.html',
  styleUrl: './counter-parent.component.css',
})
export class CounterParentComponent {
  // count = 0;
  // onInc(n: number) {
  //   this.count = n;
  // }
  // SERVICE

  counter = inject(CounterService);

  readonly count = this.counter.count;
}
