import { Component, signal, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  delay,
  filter,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-reactive-search',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './reactive-search.component.html',
  styleUrl: './reactive-search.component.css',
})
export class ReactiveSearchComponent implements OnInit {
  query = '';
  isSearching = signal(false);
  query$ = new Subject<string>();
  results$!: Observable<string[]>;

  ngOnInit() {
    this.results$ = this.query$.pipe(
      map((q) => q.trim()),
      filter((q) => q.length >= 2),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isSearching.set(true)),
      switchMap((q) => this.fakeSearch(q)),
      tap(() => this.isSearching.set(false)),
      catchError(() => of(['Error: try again']))
    );
  }

  fakeSearch(q: string): Observable<string[]> {
    if (!q) return of([]).pipe(delay(150));
    const items = ['alpha', 'beta', 'gamma', 'delta'].filter((x) =>
      x.includes(q.toLowerCase())
    );
    return of(items).pipe(delay(250));
  }
}
