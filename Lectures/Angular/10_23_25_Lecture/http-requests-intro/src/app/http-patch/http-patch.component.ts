import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// The post shape used by the demo API
type Post = { id: number; title: string; body: string; userId: number };

@Component({
  selector: 'app-http-patch',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './http-patch.component.html',
  styleUrls: ['./http-patch.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpPatchComponent {
  // Which post id to update
  id = signal(1);
  // New title to send in the PATCH body
  title = signal('Updated title');
  // Server response after the update
  result = signal<Post | null>(null);

  private http = inject(HttpClient);

  // PATCH only the fields that changed (title in this case)
  patch() {
    this.http
      .patch<Post>(`https://jsonplaceholder.typicode.com/posts/${this.id()}`, {
        title: this.title(),
      })
      // subscribe so we can update the UI with the patched data
      .subscribe((res) => this.result.set(res));
  }
}
