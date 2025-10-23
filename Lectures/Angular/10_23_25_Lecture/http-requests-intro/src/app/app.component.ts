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

@Component({
  selector: 'app-root',
  standalone: true,
  // Import RouterOutlet, RouterLink
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  activeLetter = signal<string>('');
  private router = inject(Router);

  constructor() {
    // Initialize with current URL (may be empty before first navigation)
    this.setLetterFromUrl(this.router.url ?? '');
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.setLetterFromUrl(e.urlAfterRedirects || e.url);
      }
    });
  }

  private setLetterFromUrl(url: string) {
    const clean = url.split('?')[0].split('#')[0];
    const firstSeg = clean.split('/').filter(Boolean)[0] ?? '';
    const letter = firstSeg.charAt(0);
    this.activeLetter.set(letter ? letter.toUpperCase() : '');
  }
}
