import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule), // import necessary Angular modules
    provideHttpClient(withInterceptorsFromDi()), // register HttpClient + DI interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // attach auth interceptor
    provideZoneChangeDetection({ eventCoalescing: true }), // performance tweak
    provideRouter(routes), // application routes
  ],
};
