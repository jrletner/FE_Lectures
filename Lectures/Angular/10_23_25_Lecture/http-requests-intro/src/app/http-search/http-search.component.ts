import {
  Component,
  ChangeDetectionStrategy,
  effect,
  signal,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

// Result types for the search API
type Product = { id: number; title: string };
type SearchRes = { products: Product[] };

@Component({
  selector: 'app-http-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './http-search.component.html',
  styleUrls: ['./http-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpSearchComponent {
  // Bindable search query and results list
  query = signal('');
  results = signal<Product[]>([]);
  // Subject emits each time the user types; we will debounce this stream
  private input$ = new Subject<string>();

  constructor() {
    // Debounce rapid typing, ignore duplicates, and cancel previous requests
    this.input$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        // switchMap cancels the previous HTTP request when a new value arrives
        switchMap((q) => {
          if (!q.trim())
            return this.http.get<SearchRes>(
              'https://dummyjson.com/products/search?q='
            );
          return this.http.get<SearchRes>(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}`
          );
        })
      )
      // Update the results signal with the top 10 products
      // subscribe to push the latest search results into our signal
      .subscribe((res) => this.results.set(res.products.slice(0, 10)));
  }

  // Keep the query signal in sync and push values into the debounced stream
  private http = inject(HttpClient);
  onInput(v: string) {
    this.query.set(v);
    this.input$.next(v);
  }
}
