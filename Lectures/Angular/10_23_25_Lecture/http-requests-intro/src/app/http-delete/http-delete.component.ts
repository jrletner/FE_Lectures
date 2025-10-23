import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// API response type
type Post = { userId: number; id: number; title: string; body: string };

@Component({
  selector: 'app-http-delete',
  standalone: true,
  templateUrl: './http-delete.component.html',
  styleUrls: ['./http-delete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpDeleteComponent {
  // Keep a list of posts to display and delete from
  posts = signal<Post[]>([]);

  private http = inject(HttpClient);

  // Load some demo posts (first 10) from the API
  load() {
    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      // subscribe and store the first 10 items for easy testing
      .subscribe((data) => this.posts.set(data.slice(0, 10)));
  }

  // Delete a post by id using an optimistic UI update
  remove(id: number) {
    // 1) Optimistically remove it from the UI
    const prev = this.posts();
    this.posts.set(prev.filter((p) => p.id !== id));

    // 2) Ask the server to delete; if it fails, roll back the UI
    this.http
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      // subscribe to perform the server-side delete and handle rollback on error
      .subscribe({
        // if the delete fails, restore the prior list so the UI is consistent
        error: () => {
          this.posts.set(prev);
        },
      });
  }
}
