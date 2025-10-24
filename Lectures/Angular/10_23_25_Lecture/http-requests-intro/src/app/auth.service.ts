import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Demo-only: signal for auth state
  private _isLoggedIn = signal(false);

  isLoggedIn() {
    return this._isLoggedIn();
  }

  login() {
    this._isLoggedIn.set(true);
  }

  logout() {
    this._isLoggedIn.set(false);
  }
}
