import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'app-http-retry',
  standalone: true,
  templateUrl: './http-retry.component.html',
  styleUrls: ['./http-retry.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpRetryComponent {
  // Show the current status so students can follow the flow
  status = signal('Idle');

  private http = inject(HttpClient);

  // Try a failing request and retry it a few times with increasing delays
  tryRequest() {
    // 1) Update UI to indicate we're starting a request
    this.status.set('Requesting…');

    // 2) Kick off a GET that we expect to fail with HTTP 503 (Service Unavailable)
    //    The query param ?sleep=500 adds an artificial server delay so you can
    //    see the retry timing clearly in the Network tab.
    this.http
      // httpstat.us/503 responds with 503. Add ?sleep=500 to simulate delay.
      .get('https://httpstat.us/503?sleep=500', { responseType: 'text' })
      // pipe lets us chain RxJS operators to transform/control the stream.
      // It returns a NEW Observable and does not start the request by itself.
      .pipe(
        // 3) retry operator with timer-based backoff:
        //    - count: how many times to retry after the first failure
        //    - delay: wait before each retry using an Observable timer
        //      500ms, 1000ms, 1500ms (retryCount is 1, 2, 3)
        retry({
          count: 3,
          delay: (_err, retryCount) => timer(retryCount * 500),
        })
      )
      // 4) subscribe starts the request chain and lets us reflect the outcome
      //    in the UI. With 503 responses, 'error' will run after retries end.
      .subscribe({
        // next: would run if we somehow get a 200 OK on any attempt
        next: () => this.status.set('Unexpected success'),
        // error: runs after all retry attempts are exhausted (still failing)
        error: () => this.status.set('Failed after retries'),
        // complete: runs when the observable completes. For errors this
        //           doesn't fire; it's shown here for teaching completeness.
        complete: () => this.status.set('Done'),
      });
  }
}
