import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// The API response type
type Post = { userId: number; id: number; title: string; body: string };

@Component({
  selector: 'app-http-states',
  standalone: true,
  templateUrl: './http-states.component.html',
  styleUrls: ['./http-states.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpStatesComponent {
  // Holds the posts when loaded; null means we haven't loaded yet
  posts = signal<Post[] | null>(null);
  // True while we are waiting for the server to respond
  loading = signal(false);
  // Holds a human-readable error message if the request fails
  error = signal<string | null>(null);

  private http = inject(HttpClient);

  // Start loading, reset any previous error, and fetch posts
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      // subscribe with an Observer object so we can handle all states
      .subscribe({
        // next is called when the server responds successfully with data
        next: (data) => this.posts.set(data),
        // error is called if the request fails (network/server issue)
        error: (err) => this.error.set(this.getErrorMessage(err)),
        // complete is called after next when the observable finishes
        complete: () => this.loading.set(false),
      });
  }

  // Safely extract a message from unknown error shapes
  private getErrorMessage(err: unknown) {
    if (err && typeof err === 'object' && 'message' in err)
      return String((err as any).message);
    return String(err ?? 'Unknown error');
  }
}
