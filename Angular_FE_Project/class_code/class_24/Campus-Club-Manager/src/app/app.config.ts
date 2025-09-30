import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { routes } from './app.routes';
import { API_BASE } from './shared/tokens/api-base.token';
import { httpErrorInterceptor } from './shared/http/http-error.interceptor';
import { authInterceptor } from './shared/http/auth.interceptor';

class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // eslint-disable-next-line no-console
    console.error('GlobalError', error);
  }
}

// Use the dev proxy for API calls. proxy.conf.json rewrites '/api' -> backend on port 3000.
const API_BASE_URL = '/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, httpErrorInterceptor])
    ),
    { provide: API_BASE, useValue: API_BASE_URL },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
