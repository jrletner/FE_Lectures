import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// The API returns the created record with a fake id
type Created = { id: number; title: string; body: string; userId: number };

@Component({
  selector: 'app-http-post',
  standalone: true,
  imports: [FormsModule], // enable [(ngModel)] binding in the template
  templateUrl: './http-post.component.html',
  styleUrls: ['./http-post.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpPostComponent {
  // Form fields as signals
  title = signal('');
  body = signal('');
  // Holds the server response after creation
  result = signal<Created | null>(null);
  // Controls the disabled state of the submit button
  loading = signal(false);

  private http = inject(HttpClient);

  // Send a POST request with the form data as JSON
  submit() {
    this.loading.set(true);
    this.result.set(null);
    this.http
      .post<Created>('https://jsonplaceholder.typicode.com/posts', {
        title: this.title(),
        body: this.body(),
        userId: 1,
      })
      // subscribe so we can update state from the async response
      .subscribe({
        // next gives us the created item from the server
        next: (res) => this.result.set(res),
        // complete runs when the observable finishes (after next)
        complete: () => this.loading.set(false),
      });
  }
}
