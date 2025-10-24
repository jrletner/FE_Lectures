import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  activeLetter = signal<string>('A');
  private router = inject(Router);
  auth = inject(AuthService);

  constructor() {
    this.setLetterFromUrl(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.setLetterFromUrl(e.urlAfterRedirects));
  }

  private setLetterFromUrl(url: string) {
    const firstSeg = url.split('/').filter(Boolean)[0] || 'a-http-basics';
    const letter = firstSeg.charAt(0).toUpperCase();
    this.activeLetter.set(letter);
  }

  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }
  isLoggedIn() {
    return this.auth.isLoggedIn();
  }
}
