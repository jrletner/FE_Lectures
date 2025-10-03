import { Component, inject } from '@angular/core';
import { CounterService } from '../../../counter.service';

@Component({
  selector: 'app-counter-child2',
  imports: [],
  templateUrl: './counter-child2.component.html',
  styleUrl: './counter-child2.component.css',
})
export class CounterChild2Component {
  counter = inject(CounterService);
  readonly count = this.counter.count;
}
