import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  // Route for Part A — place above redirects
  {
    path: 'a-http-basics',
    // Lazy-load the standalone component (code-splitting)
    loadComponent: () =>
      import('./http-basics/http-basics.component').then(
        (m) => m.HttpBasicsComponent
      ),
  },
  {
    path: 'b-http-states',
    // Lazy-load the component so its JS is only loaded on demand
    loadComponent: () =>
      import('./http-states/http-states.component').then(
        (m) => m.HttpStatesComponent
      ),
  },
  {
    path: 'c-http-params',
    // Lazy-load the component file via dynamic import
    loadComponent: () =>
      import('./http-params/http-params.component').then(
        (m) => m.HttpParamsComponent
      ),
  },
  {
    path: 'd-http-post',
    // Lazy-load the standalone component for Part D
    loadComponent: () =>
      import('./http-post/http-post.component').then(
        (m) => m.HttpPostComponent
      ),
  },
  {
    path: 'e-http-patch',
    // Lazy-load the standalone component for Part E
    loadComponent: () =>
      import('./http-patch/http-patch.component').then(
        (m) => m.HttpPatchComponent
      ),
  },
  {
    path: 'f-http-delete',
    // Lazy-load the standalone component for Part F
    loadComponent: () =>
      import('./http-delete/http-delete.component').then(
        (m) => m.HttpDeleteComponent
      ),
  },
  {
    path: 'g-http-headers',
    // Lazy-load the standalone component for Part G
    loadComponent: () =>
      import('./http-headers/http-headers.component').then(
        (m) => m.HttpHeadersComponent
      ),
  },
  {
    path: 'h-http-interceptor',
    // Lazy-load the standalone component for Part H
    loadComponent: () =>
      import('./http-interceptor-demo/http-interceptor-demo.component').then(
        (m) => m.HttpInterceptorDemoComponent
      ),
  },
  {
    path: 'i-http-search',
    // Lazy-load the standalone component for Part I
    loadComponent: () =>
      import('./http-search/http-search.component').then(
        (m) => m.HttpSearchComponent
      ),
  },
  {
    path: 'j-http-retry',
    // Lazy-load the standalone component for Part J
    loadComponent: () =>
      import('./http-retry/http-retry.component').then(
        (m) => m.HttpRetryComponent
      ),
  },
  {
    path: 'k-auth-guard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./k-protected/k-protected.component').then(
        (m) => m.KProtectedComponent
      ),
  },
  // Default route: when URL is empty, redirect to Part A
  // Always leave the default path at the bottom, order matters
  { path: '', pathMatch: 'full', redirectTo: 'a-http-basics' },
  { path: '**', redirectTo: 'a-http-basics' },
];
