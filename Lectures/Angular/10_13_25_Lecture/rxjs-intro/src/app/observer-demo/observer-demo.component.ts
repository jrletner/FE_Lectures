import { Component, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { interval, Observable, Subscription, throwError } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-observer-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './observer-demo.component.html',
  styleUrl: './observer-demo.component.css',
})
export class ObserverDemoComponent implements OnDestroy {
  messages: string[] = [];
  status = signal<'idle' | 'running' | 'done' | 'error'>('idle');
  subscription?: Subscription;
  startValue = 3;

  countdown$(start: number = this.startValue): Observable<number> {
    if (start > 9) return throwError(() => new Error('Max 9'));
    return interval(500).pipe(
      map((i) => start - i),
      take(start + 1)
    );
  }

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

  start(): void {
    this.stop();
    this.messages = [];
    this.status.set('running');
    this.subscription = this.countdown$(this.startValue).subscribe(
      this.observer
    );
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
