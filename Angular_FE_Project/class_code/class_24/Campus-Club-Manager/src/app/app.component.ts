import { Component, computed, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { LoadingBarComponent } from './shared/ui/loading-bar/loading-bar.component';
import { ErrorBannerComponent } from './shared/ui/error-banner/error-banner.component';
import { ClubService } from './shared/services/club.service';
import { ToastContainerComponent } from './shared/ui/toast-container/toast-container.component';
import { AuthService } from './shared/services/auth.service';
import { ChangePinComponent } from './auth/change-pin.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FooterComponent,
    LoadingBarComponent,
    ErrorBannerComponent,
    ToastContainerComponent,
    ChangePinComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Campus-Club-Manager';
  svc = inject(ClubService);
  auth = inject(AuthService);
  private router = inject(Router);
  isHome = signal(true);
  private currentUrl = signal<string>('');
  showPin = false;

  // Dynamic page summary text shown in the subheader
  pageSummary = computed(() => {
    const url = this.currentUrl();
    if (!url) return '';
    if (url === '/' || url.startsWith('/?')) {
      return 'Welcome! Use search and filters to explore clubs.';
    }
    if (url.startsWith('/clubs/new')) {
      return 'Create a new club: name it, set capacity, and add it to your directory.';
    }
    if (/^\/clubs\/.+\/edit/.test(url)) {
      return 'Edit club details and manage its settings.';
    }
    if (/^\/clubs\/.+/.test(url)) {
      return 'View club details, manage members, and add events.';
    }
    if (url.startsWith('/tools')) {
      return 'Import, export, or reset your data. Preview the JSON before downloading.';
    }
    return 'Explore and manage your campus clubs.';
  });

  constructor() {
    // Toggle simple route chrome for home vs other pages
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const url = ev.urlAfterRedirects || ev.url;
        this.isHome.set(url === '/' || url.startsWith('/?'));
        this.currentUrl.set(url);
      }
    });
  }

  onRetry() {
    this.svc.load();
  }

  onLogout() {
    this.auth.logout();
  }
}
