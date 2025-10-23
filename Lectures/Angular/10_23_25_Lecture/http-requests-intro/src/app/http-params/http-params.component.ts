import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// API response type
type Post = { userId: number; id: number; title: string; body: string };

@Component({
  selector: 'app-http-params',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './http-params.component.html',
  styleUrls: ['./http-params.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpParamsComponent {
  // Control which user's posts we request via a query parameter
  userId = signal(1);
  // Hold the filtered posts
  posts = signal<Post[]>([]);

  private http = inject(HttpClient);

  // Build a query string like ?userId=1 using HttpParams and request data
  load() {
    const params = new HttpParams().set('userId', String(this.userId()));
    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts', { params })
      // subscribe starts the request; 'next' receives the filtered results
      .subscribe((data) => this.posts.set(data));
  }
}
