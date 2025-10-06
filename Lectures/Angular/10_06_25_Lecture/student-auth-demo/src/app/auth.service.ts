import { Injectable, signal, computed, effect } from '@angular/core';
import * as bcrypt from 'bcryptjs';

// Represent a user in our tiny fake DB.
interface DemoUser {
  username: string; // the login name
  hash: string; // bcrypt hash of the password
  role: 'user' | 'admin'; // simple role flag
}

// Helper: hash a plain password (cost 10 for demo speed)
function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

// Seed two demo users (password for both = 1234). In a real app these hashes
// would be created on a server ahead of time.
const DEMO_USERS: DemoUser[] = [
  { username: 'user', hash: hashPassword('1234'), role: 'user' },
  { username: 'admin', hash: hashPassword('1234'), role: 'admin' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  // --- Signals (reactive state) ---
  private _currentUser = signal<DemoUser | null>(null); // logged in user (or null)
  private _isLoading = signal(false); // true while login attempt runs
  private _errorMessage = signal<string | null>(null); // last error message

  // --- Public read-only references (templates call as functions) ---
  currentUser = this._currentUser; // signal accessor in template: currentUser()
  isLoading = this._isLoading; // isLoading()
  errorMessage = this._errorMessage; // errorMessage()

  // Derived (computed) signals: auto-update when the above change.
  isAuthenticated = computed(() => this._currentUser() !== null);
  isAdmin = computed(() => this._currentUser()?.role === 'admin');

  // Optional: Expose a SAFE list of available demo accounts (no hashes) for students.
  // This lets us render with @for to show which usernames to try.
  demoAccounts = DEMO_USERS.map((u) => ({
    username: u.username,
    role: u.role,
  }));

  // On creation try to restore a previous session from localStorage (educational only).
  constructor() {
    const raw = localStorage.getItem('demo_current_user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          username: string;
          role: 'user' | 'admin';
        };
        const match = DEMO_USERS.find(
          (u) => u.username === parsed.username && u.role === parsed.role
        );
        if (match) this._currentUser.set(match);
      } catch {
        /* ignore */
      }
    }

    // Effect: whenever currentUser changes, store (or clear) minimal safe data.
    effect(() => {
      const cu = this._currentUser();
      if (cu) {
        localStorage.setItem(
          'demo_current_user',
          JSON.stringify({ username: cu.username, role: cu.role })
        );
      } else {
        localStorage.removeItem('demo_current_user');
      }
    });

    // Educational console log (remove in production): show initial state / restoration result.
    console.log(
      '[AuthService] Initialized. Restored user:',
      this._currentUser()?.username ?? null
    );
  }

  // Perform a fake async login: we look up by username, then compare the hash.
  login(username: string, password: string): void {
    if (this._isLoading()) return; // prevent double-click spam
    this._errorMessage.set(null); // clear previous errors
    this._isLoading.set(true); // show loading state

    console.log('[AuthService] login attempt start:', username);

    // Simulate network delay
    setTimeout(() => {
      const foundUser = DEMO_USERS.find((d) => d.username === username);
      if (foundUser && bcrypt.compareSync(password, foundUser.hash)) {
        // success path: store the user (never store the plain password)
        this._currentUser.set(foundUser);
        console.log('[AuthService] login success:', foundUser.username);
      } else {
        // failure path: show error + clear any stale user state
        this._errorMessage.set('Invalid username or password');
        this._currentUser.set(null);
        console.warn('[AuthService] login failed for:', username);
      }
      this._isLoading.set(false); // stop loading state
    }, 650);
  }

  // Clear current user (simple logout + effect will clear storage)
  logout(): void {
    this._currentUser.set(null);
    console.log('[AuthService] logout() user cleared');
  }
}
