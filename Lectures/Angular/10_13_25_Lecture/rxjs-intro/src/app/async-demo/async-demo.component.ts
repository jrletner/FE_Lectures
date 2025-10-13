import { Component, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval, timer, of, Subject } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-async-demo',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './async-demo.component.html',
  styleUrl: './async-demo.component.css',
})
export class AsyncDemoComponent {
  tick$ = interval(1000).pipe(map((i) => i + 1));
  on = signal(true);
  private toggle$ = new Subject<boolean>();
  quote$ = this.toggle$.pipe(
    startWith(true),
    switchMap((on) =>
      on ? timer(500, 2000).pipe(map((i) => `Quote #${i}`)) : of(null)
    )
  );
  toggle() {
    this.on.set(!this.on());
    this.toggle$.next(this.on());
  }
}
