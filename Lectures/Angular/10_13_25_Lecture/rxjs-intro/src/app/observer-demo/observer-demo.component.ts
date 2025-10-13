import { Component, signal } from '@angular/core';
import { interval, map, Observable, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-observer-demo',
  imports: [],
  templateUrl: './observer-demo.component.html',
  styleUrl: './observer-demo.component.css',
})
export class ObserverDemoComponent {
  // A simple countdown and an observer object that logs events
  countdown$(start: number = 3): Observable<number> {
    return interval(500).pipe(
      map((i) => start - i),
      take(start + 1)
    );
  }

  messages: string[] = [];
  status = signal<'idle' | 'running' | 'done' | 'error'>('idle');

  observer = {
    next: (val: number) => this.messages.push(`Next: ${val}`),
    error: (err: unknown) => {
      this.messages.push(`Error: ${String(err)}`);
      this.status.set('error');
    },
    complete: () => {
      this.messages.push('Complete');
      this.status.set('done');
    },
  };

  subscription?: Subscription;

  start(): void {
    this.stop();
    this.messages = [];
    this.status.set('running');
    this.subscription = this.countdown$().subscribe(this.observer);
  }

  stop(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    if (this.status() !== 'done' && this.status() !== 'error') {
      this.status.set('idle');
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
