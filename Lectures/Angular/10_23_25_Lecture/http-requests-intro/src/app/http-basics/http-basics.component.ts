// Import core Angular utilities and HttpClient for making HTTP requests
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Define the shape of a Post coming back from the API
type Post = { userId: number; id: number; title: string; body: string };

@Component({
  selector: 'app-http-basics', // HTML tag you'll use in templates
  standalone: true, // This component doesn't need an NgModule
  templateUrl: './http-basics.component.html', // The template file for the UI
  styleUrls: ['./http-basics.component.css'],
  // Reflect the OnPush setting from the previous step
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpBasicsComponent {
  // A writable signal to hold the list of posts once loaded
  posts = signal<Post[]>([]);
  // Inject HttpClient via inject() for a clean standalone pattern
  private http = inject(HttpClient);

  // When called, fetch posts from the public demo API
  load() {
    this.http
      // Ask for an array of Post objects from the URL
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      // Subscribe to start the request and set the signal when data arrives
      // subscribe starts the request; 'next' gives us the response data
      .subscribe((data) => this.posts.set(data));
  }
}
