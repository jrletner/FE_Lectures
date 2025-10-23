import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-http-interceptor-demo',
  standalone: true,
  templateUrl: './http-interceptor-demo.component.html',
  styleUrls: ['./http-interceptor-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpInterceptorDemoComponent {
  // We'll display whatever Authorization header the server says it received
  authHeader = signal<string | null>(null);
  private http = inject(HttpClient);

  // Make a GET request; the interceptor will add the Authorization header
  load() {
    // subscribe to see what Authorization header the server reports back
    this.http.get<any>('https://httpbin.org/anything').subscribe((res) => {
      this.authHeader.set(res.headers['Authorization'] ?? null);
    });
  }
}
