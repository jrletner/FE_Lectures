import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-http-headers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './http-headers.component.html',
  styleUrls: ['./http-headers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpHeadersComponent {
  // Enter an API key value that we will send as a custom header
  apiKey = signal('demo-key-123');
  // The server will echo back the headers; capture what it saw
  seenHeader = signal<string | null>(null);

  private http = inject(HttpClient);

  // Build custom headers and call httpbin.org to echo them back
  send() {
    const headers = new HttpHeaders({ 'X-Api-Key': this.apiKey() });
    this.http
      .get<any>('https://httpbin.org/anything', { headers })
      // subscribe and read back the echoed header from httpbin
      .subscribe((res) =>
        this.seenHeader.set(res.headers['X-Api-Key'] ?? null)
      );
  }
}
